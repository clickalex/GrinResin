#!/usr/bin/env node
/**
 * GrinRex Resin — catalogue data builder.
 * Single source of truth for the 150-product opportunity catalogue.
 * Emits:
 *   1. client/src/data/products.ts                      (typed module for the UI)
 */
import { writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DATA = path.join(ROOT, "client/src/data");
mkdirSync(PUB, { recursive: true });
mkdirSync(DATA, { recursive: true });

// ---------------------------------------------------------------------------
// Material & tool vocabulary (underscore tokens render title-cased in the UI)
// ---------------------------------------------------------------------------
const M = {
  base: ["epoxy_resin", "hardener"],
  mica: "mica_powder",
  paste: "pigment_paste",
  ink: "alcohol_ink",
  foil: "gold_foil",
  petals: "dried_flowers",
  glitter: "fine_glitter",
  dye: "resin_dye",
  photo: "photo_print",
  wood: "wood_slice",
  sand: "colored_sand",
  beads: "glass_beads",
  wire: "jewelry_wire",
  seal: "glossy_topcoat",
  box: "gift_box",
  ribbon: "satin_ribbon",
  card: "printed_card_stock",
};

const T = {
  basic: ["measuring_scale", "mixing_cups", "stirring_sticks", "heat_gun", "nitrile_gloves"],
  molds: "silicone_molds",
  sand: "sanding_paper",
  polish: "polishing_compound",
  drill: "hand_drill",
  pliers: "round_nose_pliers",
  uv: "uv_resin_lamp",
  torch: "mini_torch",
  level: "spirit_level",
};

/** [name, scale, extraMaterials[], extraTools[], note, launch?] */
const families = {
  "Jewelry & Personal Accessories": [
    ["Botanical Drop Earrings", "small", [M.petals, M.foil], ["earring_hooks"], "Pressed petals suspended in featherweight drops.", true],
    ["Minimalist Geometric Studs", "small", [M.paste], ["earring_studs"], "Flat-backed shapes with a single line of color."],
    ["Hoop Earrings with Floral Inlay", "small", [M.petals], ["hoop_settings"], "Small-format florals wrapped in a wear-everyday hoop."],
    ["Resin Cocktail Ring", "small", [M.glitter], ["ring_blanks", T.polish], "Domed cast stones set on adjustable shanks."],
    ["Adjustable Band Ring", "small", [M.mica], ["ring_blanks"], "Marbled bands with open backs for sizing."],
    ["Name Initial Pendant", "small", ["vinyl_letters"], ["pendant_bails", T.drill], "Single letters cast for layering or gifting."],
    ["Birthstone Pendant", "small", [M.dye], ["pendant_bails"], "Twelve-color palette matched to birth months."],
    ["Suncatcher Pendant", "small", [M.foil], ["pendant_bails"], "Foil fragments tuned to throw warm window light."],
    ["Pressed Flower Locket", "small", [M.petals], ["locket_frames", T.sand], "Two petals, one memory, sealed under clear cast."],
    ["Charm Bracelet", "small", [M.beads], ["clasps", M.wire], "Mix-and-match cast charms on a light chain."],
    ["Resin Bead Necklace", "small", [M.dye], [M.wire], "Hand-cut beads with gradient depth."],
    ["Cufflink Set", "small", [M.ink], ["cufflink_blanks"], "Alcohol-ink fields finished for formal wear."],
    ["Tie Clip", "small", [M.mica], ["tie_clip_blanks"], "Slim bar with a subdued mineral shimmer."],
    ["Lapel Pin", "small", [M.paste], ["pin_backs", T.drill], "Cast motifs for blazers, bags, and uniforms."],
    ["Dried Flower Brooch", "medium", [M.petals, M.foil], ["brooch_backs"], "A preserved bouquet in miniature."],
    ["Hair Claw Clip", "medium", [M.glitter], ["claw_clip_blanks", T.polish], "Sanded, polished, and filed smooth for daily handling."],
    ["Pearl-Tipped Hairpins", "small", [M.beads], ["hairpin_bases"], "Single cast beads on slender pins."],
    ["Resin Comb", "medium", [M.mica], ["comb_blanks", T.sand, T.polish], "Fine teeth require careful demold and edge finishing."],
    ["Sunglass Chain Beads", "small", [M.dye], [M.wire, "clasps"], "Strung beads that keep shades close at hand."],
    ["Bag Charm", "small", [M.foil, M.petals], ["jump_rings", "charm_loops"], "A pocket-sized signature for everyday bags."],
    ["Shoe Charm Set", "small", [M.glitter], ["charm_clasps"], "Playful cast shapes for clogs and straps."],
    ["Watch Face Insert", "medium", [M.ink], ["watch_movement", T.drill], "Custom dials cast onto bare watch bases."],
    ["Compact Mirror Cover", "medium", [M.petals, M.foil], ["mirror_compact_shells", T.polish], "Decoupled florals pressed behind a pocket mirror."],
    ["Phone Grip Charm", "small", [M.glitter], ["grip_bases", "adhesive_pads"], "Cast grip discs bonded to standard cases."],
    ["Anklet with Resin Beads", "small", [M.beads], [M.wire, "clasps_small"], "Light beads on waxed cord."],
    ["Photo Locket Pendant", "medium", [M.photo, M.seal], ["locket_frames"], "A cropped memory sealed under clear resin."],
    ["Coordinate Pendant", "small", ["printed_micro_text"], ["pendant_bails"], "Latitude and longitude of a place worth keeping."],
    ["Twin Stone Bracelet", "small", [M.dye], [M.wire, "clasps"], "Paired colors cast for best-friend sets."],
  ],
  "Everyday Gifting & Keepsakes": [
    ["Custom Name Keychain", "small", [M.paste, "vinyl_letters"], ["keychain_rings", T.basic[0], T.sand], "The entry product: a name, a color, a daily companion.", true],
    ["Initial Letter Keychain", "small", [M.mica], ["keychain_rings"], "One letter, twelve palettes."],
    ["Fridge Magnet Set", "small", [M.petals, M.photo], ["neodymium_magnets", "adhesive_backing"], "Tiny cast canvases for the busiest surface in the house.", true],
    ["Pressed Flower Bookmark", "medium", [M.petals, M.foil], ["bookmark_molds", T.sand], "A petal pressed into a page-marker.", true],
    ["City Map Keychain", "small", ["printed_map_slice", M.seal], ["keychain_rings"], "Home, routed, and cast."],
    ["Memory Photo Block", "medium", [M.photo, M.seal], ["block_molds", T.polish], "A cropped photograph under a thick clear face.", true],
    ["Personalized Nameplate", "medium", [M.paste, M.foil], ["nameplate_molds", T.sand], "Desk and door names with a gallery finish.", true],
    ["Door Name Hanger", "medium", [M.mica], ["door_hanger_molds", "cotton_cord"], "Entryway identity with a weighted drop."],
    ["Luggage Tag", "small", [M.paste, "printed_id_card"], ["tag_molds", "split_rings"], "Findable bags with a personal front."],
    ["Anniversary Token Coin", "small", [M.foil], ["coin_molds", T.polish], "Two names, one date, cast to keep."],
    ["Graduation Year Token", "small", [M.glitter], ["coin_molds"], "Class colors sealed for the shelf."],
    ["Best Friend Charm Pair", "small", [M.dye], ["keychain_rings", M.wire], "Two halves of the same pour."],
    ["Baby Milestone Tile", "medium", [M.paste, "printed_card_stock"], ["tile_molds", T.sand], "First steps, first day, cast flat."],
    ["Long Distance Keychain Pair", "small", ["map_halves", M.paste], ["keychain_rings"], "Two cities, one matching set."],
    ["Housewarming Name Plaque", "large", [M.mica, M.foil], ["plaque_molds", T.sand], "A welcome mat for the wall."],
    ["Resin Button Badge", "small", [M.paste], ["badge_shells", "badge_press"], "Cast fronts on standard pin badges."],
    ["Pet Portrait Tile", "medium", [M.photo, M.seal], ["tile_molds", T.polish], "A favorite snapshot, raised above the frame."],
    ["Teacher Appreciation Token", "small", [M.glitter, "printed_thanks_card"], ["coin_molds"], "Gratitude with some weight to it."],
    ["Mini Photo Frame", "small", [M.photo], ["frame_molds", T.sand], "Desk-sized frames for pockets of memory."],
    ["Custom Emoji Keychain", "small", [M.dye, M.glitter], ["keychain_rings", "emoji_molds"], "Smiles cast one order at a time."],
    ["Zodiac Sign Keychain", "small", [M.glitter], ["keychain_rings", "zodiac_molds"], "Twelve signs, twelve colorways."],
    ["Monogram Ring Holder", "medium", [M.mica], ["ring_dish_molds", T.polish], "A nightstand home for one ring."],
    ["Puzzle Piece Pair Bracelet", "small", [M.dye], [M.wire, "clasps"], "Interlocking tokens for pairs."],
    ["Souvenir Photo Chip", "small", [M.photo, M.seal], ["chip_molds"], "Travel days cast pocket-small."],
    ["Custom Lyric Plaque", "medium", ["printed_lyric_card", M.paste], ["plaque_molds", T.sand], "One line of a shared song, kept."],
    ["Quote Bookmark Trio", "medium", ["printed_quote_slips"], ["bookmark_molds"], "Three quotes, three ribbons, one gift."],
  ],
  "Home & Living": [
    ["River Coaster Set", "medium", [M.dye, M.foil], ["coaster_molds", T.sand, T.polish], "Amber rivers between cast wood slices.", true],
    ["Decorative Serving Tray", "large", [M.petals, M.seal], ["tray_molds", T.level], "Centerpiece tray for styled, non-hot serving."],
    ["Jewelry Tray", "small", [M.paste], ["trinket_molds", T.polish], "The everyday catch-all dish, poured in soft solids.", true],
    ["Ring Dish", "small", [M.glitter], ["trinket_molds"], "A bedside circle with a subtle sparkle."],
    ["Resin Phone Stand", "medium", [M.mica], ["stand_molds", T.sand, T.polish], "Angled, sanded, and weighted to hold.", true],
    ["Geometric Bookends", "large", [M.sand], ["bookend_molds", T.sand], "Weighted cast blocks for real shelves."],
    ["Table Number Set", "small", [M.foil], ["number_molds", T.polish], "Banquet numerals cast for reuse."],
    ["Candle Holder Cup", "medium", [M.mica], ["holder_molds", T.polish], "For tealights only, with a heat-safe insert cup."],
    ["Votive Lamp Shades", "medium", [M.ink], ["votive_molds", T.sand], "Ink clouds lit from behind."],
    ["Window Sun Catcher", "medium", [M.foil, M.glitter], ["suncatcher_molds", "cotton_cord"], "Foil bursts tuned for afternoon sun."],
    ["Wall Clock Face", "large", [M.paste], ["clock_movement", "clock_ring_mold", T.drill], "A quiet statement above the mantel."],
    ["Desk Organizer Cup", "medium", [M.mica], ["organizer_molds", T.sand], "Cast tumbler rows for pens and clips."],
    ["Decorative Bowl", "medium", [M.dye], ["bowl_molds", T.level], "Deep decorative casts; display only."],
    ["Fruit Bowl", "large", [M.petals], ["large_bowl_molds", T.level], "A molded centerpiece for dry display."],
    ["Wall Art Panel", "large", [M.ink, M.foil], ["panel_molds", T.sand, T.polish, "french_cleat_hardware"], "Gallery-wall pours hung on cleats."],
    ["Doorstop Charm", "medium", [M.mica], ["doorstop_molds", T.polish], "A weighted hello."],
    ["Plant Saucer", "small", [M.dye], ["saucer_molds"], "Matched trays for nursery shelves."],
    ["Candle Tray", "medium", [M.seal, M.paste], ["tray_molds", T.polish], "A protected base under cool-burning candles."],
    ["Cabinet Knob Set", "small", [M.glitter], ["knob_molds", T.drill], "Six cast knobs, screw-mounted from behind."],
    ["Drawer Pull Set", "medium", [M.mica], ["pull_molds", T.drill], "Furniture jewelry with steel threads."],
    ["Wall Hook Trio", "small", [M.paste], ["hook_molds", "hook_screws"], "Coats, keys, and leashes on small cast plates."],
    ["Home Temple Accent Piece", "medium", [M.foil, M.paste], ["decor_molds", T.sand], "Devotional accents cast with restrained gold."],
    ["Abstract Slab Centerpiece", "large", [M.ink, M.foil], ["slab_molds", T.sand, T.polish], "Free-pour ink fields, sanded to a lens."],
    ["Table Lamp Base", "large", [M.sand, M.mica], ["lamp_molds", "lamp_hardware_kit", T.drill], "Wired by an electrician; the cast is the shade's foot."],
    ["Night Lamp Sphere", "medium", [M.ink], ["sphere_molds", "led_puck_light"], "A glowing marble for bedside shelves."],
    ["Window Bead Curtain", "medium", [M.dye], ["bead_molds", M.wire], "Strung beads that move with the breeze."],
    ["Floating Shelf Accent", "medium", [M.mica], ["accent_molds", "mounting_tape"], "Trim pieces that finish open shelves."],
    ["Trinket Catch-All", "small", [M.glitter], ["trinket_molds"], "Entryway keys land softer in resin."],
  ],
  "Desk, Office & Corporate": [
    ["Pen Stand", "medium", [M.paste], ["pen_holder_molds", T.sand], "Branded color fields for the desk.", true],
    ["Pen Rest Bar", "small", [M.mica], ["bar_molds", T.polish], "A weighted line for a favorite pen."],
    ["Desk Tray", "large", [M.seal], ["desk_tray_molds", T.sand, T.polish], "Paperwork corralled on one cast field."],
    ["Business Card Holder", "medium", [M.dye], ["card_holder_molds", T.sand], "Angled cast that makes cards look intentional."],
    ["Paperweight Set", "small", [M.foil], ["sphere_molds", T.polish], "Three weights, one palette."],
    ["Desk Pad", "large", [M.ink, M.seal], ["large_flat_molds", T.level, T.sand, T.polish], "A glass-smooth desk skin; topcoat required."],
    ["Desk Clock", "large", [M.paste], ["clock_movement", "clock_block_mold"], "Time, quietly personalized."],
    ["Logo Nameplate", "medium", ["printed_logo_transfer", M.seal], ["nameplate_molds", T.sand], "Reception plates with sealed logo prints."],
    ["Corporate Gift Coaster Set", "medium", [M.mica], ["coaster_molds", "packaging_box"], "Branded fours in a keepsake box."],
    ["Award Trophy Block", "large", [M.foil, "engraved_plate"], ["trophy_molds", T.polish], "Recognition you don't throw away."],
    ["Commemorative Plaque", "large", [M.seal, "printed_ceremony_card"], ["plaque_molds", "wall_mount_hardware"], "Foundations, openings, farewells."],
    ["Menu Plate", "medium", ["printed_menu_insert", M.seal], ["menu_plate_molds", T.sand], "Café table menus sealed against spills."],
    ["Identity Tag", "small", [M.paste], ["id_tag_molds", "lanyard_slot_cut"], "Conference badges with a solid cast front."],
    ["Lanyard Tag", "small", [M.glitter], ["lanyard_tag_molds", "lanyard_cords"], "Office passes upgraded."],
    ["Desk Calendar Frame", "medium", [M.mica], ["frame_molds", T.sand], "Twelve months under a clear lip."],
    ["Monitor Riser Block", "premium", [M.sand], ["riser_molds", T.level, T.polish], "A deep structural cast, engineered with feet."],
    ["Badge Reel Cover", "small", [M.paste], ["reel_shells", "badge_reels"], "Retractable, but considered."],
    ["Conference Pass Card", "small", [M.dye], ["card_molds", "event_clip"], "Event passes worth keeping after."],
  ],
  "Celebrations & Seasonal": [
    ["Wedding Date Keepsake", "medium", [M.foil, "printed_invite_excerpt"], ["keepsake_molds", T.polish], "The date, the names, the day.", true],
    ["Bridal Party Gift Set", "large", [M.petals, M.foil], ["gift_box_set_molds", "ribbon_spools"], "Matched ring-bearer trays and favors."],
    ["Groom's Flask Inlay", "medium", [M.paste], ["flask_inlay_molds", T.sand], "Cast panel bonded to a steel flask."],
    ["Wedding Favour Magnet", "small", [M.glitter], ["magnet_molds", "neodymium_magnets"], "Guests leave with something on the fridge."],
    ["Wax Seal Stamp", "medium", [M.paste], ["seal_molds", "brass_inserts"], "Cast fronts mounted on brass seals."],
    ["Bouquet Preservation Block", "premium", [M.petals, M.seal], ["bouquet_block_mold", T.sand, T.polish, T.level], "The full bouquet, dried flat, cast deep."],
    ["Cake Topper Set", "small", [M.foil], ["letter_molds", "topper_wires"], "Names raised above the top tier."],
    ["Anniversary Memory Frame", "medium", [M.photo, M.foil], ["frame_molds", T.sand], "One year, one photo, one pour."],
    ["Engagement Ring Box", "medium", [M.glitter], ["ring_box_molds", "velvet_insert"], "A proposal, presented."],
    ["Newborn Milestone Set", "medium", [M.paste, "printed_milestone_cards"], ["tile_molds", T.sand], "Ten months, cast as ten tiles."],
    ["Rakhi Thread Set", "small", [M.glitter, M.foil], ["rakhi_molds", M.wire], "Festival threads with a cast center."],
    ["Diya Lamp Set", "medium", [M.mica], ["diya_molds", T.polish], "Festival lights on a stable base."],
    ["Rangoli Accent Tiles", "medium", [M.paste, M.glitter], ["tile_molds"], "Festival color that lasts past the day."],
    ["Christmas Ornament Set", "small", [M.glitter, M.foil], ["ornament_molds", "ribbon_loops"], "Tree keepsakes cast each season."],
    ["Festive Gift Tag Set", "small", [M.paste], ["tag_molds", "jute_string"], "Named, wrapped, remembered."],
    ["Graduation Keepsake Plaque", "medium", [M.foil, "printed_sash_photo"], ["plaque_molds", T.sand], "The day the cap flew."],
  ],
  "Hobby, Gaming & Collectibles": [
    ["Custom Dice Set", "medium", [M.glitter, M.dye], ["dice_molds", T.polish], "Speckled polyhedrals cast in pairs."],
    ["Dice Tower Insert", "large", [M.paste], ["tower_molds", T.sand], "Cast chutes that quiet the table."],
    ["Domino Set", "medium", [M.sand], ["domino_molds", T.sand, T.polish], "Weighted tiles with sanded faces."],
    ["Chess Piece Set", "premium", [M.sand, M.dye], ["chess_molds", T.polish, T.sand], "Two-pour board, finished by hand."],
    ["Guitar Pick Set", "small", [M.dye], ["pick_molds", T.sand], "Cast picks filed to gauge."],
    ["Guitar Pick Guard", "medium", [M.foil], ["guard_molds", T.drill], "Ink swirls under real strings."],
    ["Keyboard Keycap Set", "small", [M.paste], ["keycap_molds", "keycap_puller"], "Accent caps for artisan boards."],
    ["Miniature Terrain Tiles", "small", [M.sand], ["terrain_molds"], "Modular battlefields in resin."],
    ["Diorama Base", "large", [M.sand, M.paste], ["base_molds", T.level], "Stable, carvable ground for scenes."],
    ["Custom Map Art Panel", "premium", ["printed_map_slice", M.ink, M.seal], ["panel_molds", T.sand, T.polish], "A route, a city, a coastline — cast as art."],
    ["Console Cartridge Inserts", "small", [M.glitter], ["cart_molds"], "Retro hardware, decorated gently."],
    ["Dice Vault Box", "medium", [M.paste], ["vault_molds", T.sand], "A hinged home for lucky dice."],
    ["Trading Card Frame", "medium", [M.foil], ["card_frame_molds"], "Grail cards under a clear lip."],
    ["Tabletop Token Set", "small", [M.dye], ["token_molds"], "Colored markers with satisfying weight."],
    ["Kite String Spool", "small", [M.paste], ["spool_molds", "cotton_thread"], "Festival spools cast in team colors."],
    ["Board Game Token Set", "small", [M.glitter, M.dye], ["token_molds"], "Custom meeples' chunky cousins."],
  ],
  "Garden, Pet & Memorial": [
    ["Pet Memorial Pendant", "small", ["small_fur_locket_kit", M.seal], ["pendant_bails", "fur_preservation_sleeve"], "A keepsake worn close, poured with care.", true],
    ["Paw Print Plaque", "medium", [M.paste], ["paw_molds", T.sand], "Pressed prints raised on a wall."],
    ["Fur Keepsake Locket", "small", ["fur_seal_sleeve"], ["locket_frames"], "Sealed in an inner sleeve before casting."],
    ["Pet ID Tag", "small", ["engraved_metal_core"], ["tag_molds", "split_rings"], "Cast over a real engraved tag — never a print-only tag."],
    ["Pet Portrait Coaster Set", "medium", [M.photo, M.seal], ["coaster_molds", T.sand], "The favorite face, kept in four's."],
    ["Memorial Photo Stone", "large", [M.photo, M.seal], ["stone_molds", T.sand, T.polish], "Garden-weight memory with a sealed photo face."],
    ["Memory Urn Accent", "premium", [M.foil], ["urn_accent_molds", T.polish], "A cast collar finished for a keepsake urn."],
    ["Plant Pot Set", "medium", [M.dye], ["pot_molds", T.sand], "Decorative overpots with drainage respect."],
    ["Succulent Planter", "small", [M.sand], ["planter_molds"], "Shallow casts for thirsty-free species."],
    ["Hanging Planter", "medium", [M.paste], ["hanging_molds", M.wire], "Cast rims on a hanger cradle."],
    ["Garden Marker Set", "small", [M.paste], ["marker_molds", "stake_inserts"], "Herb names that survive the hose."],
    ["Bird Feeder Stand", "medium", [M.sand], ["feeder_molds", "feeder_hardware"], "Weather-cured with a UV-stable topcoat."],
    ["Wind Chime Set", "medium", [M.mica], ["chime_molds", "chime_tubes"], "Cast discs that ring, not rattle."],
    ["Stepping Stones", "large", [M.sand, M.paste], ["stone_molds", "uv_topcoat"], "Outdoor pieces in UV-stable resin only."],
    ["Solar Garden Light Dome", "medium", [M.ink], ["dome_molds", "solar_light_caps"], "Ambient path light around solar caps."],
    ["Plant Support Ring", "small", [M.dye], ["ring_molds"], "Trellis circles on a budget."],
    ["Terrarium Vessel", "large", [M.seal], ["terrarium_molds", T.level, T.polish], "A sealed world under a cast dome."],
    ["Garden Wind Spinner", "medium", [M.glitter, M.foil], ["spinner_molds", "spinner_bearings"], "Motion caught in color."],
  ],
};

const bands = { small: [15, 40], medium: [30, 100], large: [60, 250], premium: [150, 1000] };

const products = [];
let id = 0;
for (const [family, rows] of Object.entries(families)) {
  for (const [name, scale, extraMats, extraTools, note, launch] of rows) {
    id += 1;
    const materials = [...M.base, ...(scale === "premium" ? [M.foil] : []), ...extraMats].filter(
      (m, i, a) => a.indexOf(m) === i
    );
    const tools = [...T.basic, T.molds, ...extraTools.filter(Boolean), T.sand, T.polish].filter(
      (t, i, a) => a.indexOf(t) === i
    );
    products.push({
      id,
      name,
      family,
      scale,
      materials,
      tools,
      note,
      launch: Boolean(launch),
      material_range: bands[scale],
    });
  }
}

if (products.length !== 150) throw new Error(`Expected 150 products, got ${products.length}`);
const launchCount = products.filter((p) => p.launch).length;
console.log(`Catalogue built: ${products.length} products, ${launchCount} launch-edit items.`);

// ---------------------------------------------------------------------------
// 1. Typed TS module for the UI
// ---------------------------------------------------------------------------
const ts = `/**
 * GENERATED by scripts/build-catalogue.mjs — do not edit by hand.
 * The complete 150-product opportunity catalogue behind the GrinRex Resin presentation.
 */
export type ProductScale = "small" | "medium" | "large" | "premium";

export type CatalogueProduct = {
  id: number;
  name: string;
  family: string;
  scale: ProductScale;
  materials: string[];
  tools: string[];
  note: string;
  launch: boolean;
  material_range: [number, number];
};

export const productFamilies = ${JSON.stringify(Object.keys(families), null, 2)} as const;

export const scaleBands: Record<ProductScale, [number, number]> = ${JSON.stringify(bands, null, 2)};

export const catalogue: CatalogueProduct[] = ${JSON.stringify(products, null, 2)};

export const launchEditProducts = catalogue.filter((product) => product.launch);
`;
writeFileSync(path.join(ROOT, "client/src/data/products.ts"), ts);

console.log("Wrote: client/src/data/products.ts");
