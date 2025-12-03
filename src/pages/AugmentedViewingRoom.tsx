import React, { useState, useEffect } from "react";
import { Box, PanelRightClose, PanelLeftOpen, ShoppingCart, Heart, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ARViewer from "@/components/ar/ARViewer";
import ARProductList from "@/components/ar/ARProductList";
import ARInfoSection from "@/components/ar/ARInfoSection";
import ARSupermarket from "@/components/ar/ARSupermarket";
import ARProductComparison from "@/components/ar/ARProductComparison";
import ARWishlistIntegration from "@/components/ar/ARWishlistIntegration";
import ARSocialSharing from "@/components/ar/ARSocialSharing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";
import { Link } from "react-router-dom";

const AugmentedViewingRoom = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'products' | 'supermarket'>('supermarket');
  const [comparisonProducts, setComparisonProducts] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: arProducts, isLoading: isLoadingProducts, error, refetch } = useQuery({
    queryKey: ['ar-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          currency,
          description,
          model_3d_url,
          image_url,
          stock_quantity,
          categories (id, name),
          product_images (url, is_primary)
        `)
        .eq('status', 'Active')
        .gt('stock_quantity', 0)
        .limit(50);
      
      if (error) {
        console.error("Error fetching AR products:", error);
        throw new Error(error.message);
      }

      if (!data) return [];
      
      return data.map(product => {
        const primaryImage = Array.isArray(product.product_images) 
          ? product.product_images.find(img => img.is_primary)
          : null;
          
        return {
          ...product,
          displayImage: primaryImage?.url || product.image_url || '/placeholder.svg',
        };
      });
    }
  });

  useEffect(() => {
    if (!selectedProduct && arProducts && arProducts.length > 0) {
      setSelectedProduct(arProducts[0]);
    }
  }, [arProducts, selectedProduct]);

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product);
    if (!isARActive) {
      setIsARActive(true);
    }
  };

  const handleLaunchAR = () => {
    setIsARActive(true);
  };

  const handleAddToCart = async (productId: string, productName: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    try {
      let { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!cart) {
        const { data: newCart, error } = await supabase
          .from('carts')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        
        if (error) throw error;
        cart = newCart;
      }
      
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cart.id)
        .eq('product_id', productId)
        .maybeSingle();
      
      if (existingItem) {
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({
            cart_id: cart.id,
            product_id: productId,
            quantity: 1
          });
      }
      
      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart`,
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add product to cart",
        variant: "destructive",
      });
    }
  };

  const handleAddToWishlist = async (productId: string, productName: string) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      let { data: wishlist } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!wishlist) {
        const { data: newWishlist, error } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id })
          .select('id')
          .single();
        
        if (error) throw error;
        wishlist = newWishlist;
      }

      const { data: existingItem } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('wishlist_id', wishlist.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        toast({
          title: "Already in wishlist",
          description: `${productName} is already in your wishlist`,
        });
        return;
      }

      await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: wishlist.id,
          product_id: productId
        });

      toast({
        title: "Added to wishlist",
        description: `${productName} has been added to your wishlist`,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: "Could not add product to wishlist",
        variant: "destructive",
      });
    }
  };

  const toggleComparison = (productId: string) => {
    setComparisonProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 4) {
        toast({
          title: "Comparison limit reached",
          description: "You can compare up to 4 products at a time",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, productId];
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-background to-muted/30 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center">
                  <Box className="mr-3 h-8 w-8 text-primary" />
                  Augmented Viewing Room
                </h1>
                <p className="text-muted-foreground">
                  Experience products in 3D and AR before you buy
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => refetch()}
                  title="Refresh products"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                >
                  {isPanelCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelRightClose className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'products' | 'supermarket')} className="mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="supermarket">3D Supermarket</TabsTrigger>
              <TabsTrigger value="products">Product Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="supermarket" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <ARSupermarket onAddToCart={handleAddToCart} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AR Viewer */}
                <div className={`transition-all duration-300 ${isPanelCollapsed ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                  <ARViewer 
                    isARActive={isARActive}
                    selectedProduct={selectedProduct}
                    onLaunchAR={handleLaunchAR}
                  />
                  
                  {/* Selected Product Details */}
                  {selectedProduct && (
                    <Card className="mt-4">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <img 
                            src={selectedProduct.displayImage} 
                            alt={selectedProduct.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{selectedProduct.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {selectedProduct.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <CurrencyDisplay amount={selectedProduct.price} className="text-xl font-bold text-primary" />
                              {selectedProduct.stock_quantity > 0 ? (
                                <Badge variant="secondary">In Stock</Badge>
                              ) : (
                                <Badge variant="destructive">Out of Stock</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleAddToCart(selectedProduct.id, selectedProduct.name)}
                              disabled={selectedProduct.stock_quantity <= 0}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Add to Cart
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAddToWishlist(selectedProduct.id, selectedProduct.name)}
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              Wishlist
                            </Button>
                            <Link to={`/product/${selectedProduct.id}`}>
                              <Button size="sm" variant="ghost" className="w-full">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                
                {/* Product List */}
                <div className={`lg:col-span-1 ${isPanelCollapsed ? 'hidden' : 'block'}`}>
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader className="py-3">
                      <CardTitle className="text-lg">Products ({arProducts?.length || 0})</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-2">
                      {isLoadingProducts ? (
                        <div className="space-y-3">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-muted rounded-lg h-20" />
                          ))}
                        </div>
                      ) : error ? (
                        <div className="text-center py-8 text-destructive">
                          <p>Failed to load products</p>
                          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
                            Try Again
                          </Button>
                        </div>
                      ) : arProducts && arProducts.length > 0 ? (
                        <div className="space-y-2">
                          {arProducts.map((product) => (
                            <div 
                              key={product.id}
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedProduct?.id === product.id 
                                  ? 'bg-primary/10 border border-primary' 
                                  : 'bg-muted/50 hover:bg-muted'
                              }`}
                              onClick={() => handleSelectProduct(product)}
                            >
                              <img 
                                src={product.displayImage}
                                alt={product.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{product.name}</p>
                                <CurrencyDisplay amount={product.price} className="text-xs text-muted-foreground" />
                              </div>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                className="h-8 w-8 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product.id, product.name);
                                }}
                              >
                                <ShoppingCart className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No products available</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* AR Features Section */}
          {selectedProduct && viewMode === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <ARWishlistIntegration 
                onViewInAR={(productId) => {
                  const product = arProducts?.find(p => p.id === productId);
                  if (product) {
                    setSelectedProduct(product);
                    setIsARActive(true);
                  }
                }}
                onAddToCart={(productId) => {
                  const product = arProducts?.find(p => p.id === productId);
                  if (product) {
                    handleAddToCart(productId, product.name);
                  }
                }}
              />
              <ARSocialSharing 
                productName={selectedProduct.name}
                productId={selectedProduct.id}
                onTakeScreenshot={() => {
                  toast({
                    title: "Screenshot captured!",
                    description: "Your AR view has been captured successfully.",
                  });
                }}
                onRecordVideo={() => {
                  toast({
                    title: "Recording started",
                    description: "Your AR session is being recorded.",
                  });
                }}
              />
            </div>
          )}

          <ARInfoSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AugmentedViewingRoom;
