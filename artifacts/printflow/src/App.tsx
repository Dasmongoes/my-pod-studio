import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import NotFound from "./pages/NotFound";
import CartDrawer from "./components/CartDrawer";
import ShopifyConfig from "./components/ShopifyConfig";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:handle" element={<ProductDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CartDrawer />
        <ShopifyConfig />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
