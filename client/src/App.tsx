/** GrinRex Resin style: enforce the dark Lacquered Portfolio theme across the chapter reel. */
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import SiteLayout from "./components/SiteLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Opportunity from "./pages/chapters/Opportunity";
import Revenue from "./pages/chapters/Revenue";
import Studio from "./pages/chapters/Studio";
import Collection from "./pages/chapters/Collection";
import CatalogueChapter from "./pages/chapters/Catalogue";
import Costing from "./pages/chapters/Costing";
import Production from "./pages/chapters/Production";
import Market from "./pages/chapters/Market";
import Roadmap from "./pages/chapters/Roadmap";
import Playbook from "./pages/chapters/Playbook";
import Investor from "./pages/chapters/Investor";
import DemosIndex from "./pages/demos/DemosIndex";
import CatalogueDemo from "./pages/demos/CatalogueDemo";
import ShopDemo from "./pages/demos/ShopDemo";
import PricingDemo from "./pages/demos/PricingDemo";
import OrderBuilderDemo from "./pages/demos/OrderBuilderDemo";
import OrderTrackDemo from "./pages/demos/OrderTrackDemo";

// The document reader carries the markdown renderer (streamdown) — load it only when opened.
const Documents = lazy(() => import("./pages/Documents"));

function RouteFallback() {
  return (
    <section className="chapter">
      <div className="section-marker"><span>13</span><i /><p>Loading the library…</p></div>
    </section>
  );
}

function Router() {
  return (
    <SiteLayout>
      <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={Home} />

        <Route path="/chapters/opportunity" component={Opportunity} />
        <Route path="/chapters/revenue" component={Revenue} />
        <Route path="/chapters/studio" component={Studio} />
        <Route path="/chapters/collection" component={Collection} />
        <Route path="/chapters/catalogue" component={CatalogueChapter} />
        <Route path="/chapters/costing" component={Costing} />
        <Route path="/chapters/production" component={Production} />
        <Route path="/chapters/market" component={Market} />
        <Route path="/chapters/roadmap" component={Roadmap} />
        <Route path="/chapters/playbook" component={Playbook} />
        <Route path="/chapters/investor" component={Investor} />
        <Route path="/documents" component={Documents} />

        <Route path="/demos" component={DemosIndex} />
        <Route path="/demos/catalogue" component={CatalogueDemo} />
        <Route path="/demos/shop" component={ShopDemo} />
        <Route path="/demos/pricing" component={PricingDemo} />
        <Route path="/demos/order" component={OrderBuilderDemo} />
        <Route path="/demos/track" component={OrderTrackDemo} />

        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
    </SiteLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
