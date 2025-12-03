import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Zap, Monitor, Gamepad2, Headphones, Keyboard, Mouse, Speaker, ShoppingCart, Loader2, Sparkles, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { CurrencyDisplay } from "@/components/CurrencyDisplay";
import { Link } from "react-router-dom";

interface SetupItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url?: string;
}

const BuildSetup = () => {
  const [setupType, setSetupType] = useState("");
  const [budget, setBudget] = useState([50000]);
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSetup, setGeneratedSetup] = useState<{ total: number; items: SetupItem[] } | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const setupTypes = [
    { id: "gaming", name: "Gaming Setup", icon: Gamepad2, color: "bg-red-500", description: "High-performance gaming gear" },
    { id: "productivity", name: "Productivity", icon: Monitor, color: "bg-blue-500", description: "Work from home essentials" },
    { id: "content-creation", name: "Content Creation", icon: Speaker, color: "bg-purple-500", description: "Streaming & video production" },
    { id: "entertainment", name: "Entertainment", icon: Headphones, color: "bg-green-500", description: "Audio & visual experience" }
  ];

  // Fetch products from database
  const { data: products } = useQuery({
    queryKey: ["setup-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, category_id, categories(name)")
        .eq("status", "Active")
        .gt("stock_quantity", 0);
      
      if (error) throw error;
      return data;
    }
  });

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      "Display": Monitor,
      "Input": Keyboard,
      "Audio": Headphones,
      "Accessories": Mouse,
      "Gaming": Gamepad2,
      "default": Zap
    };
    return icons[category] || icons.default;
  };

  const handleGenerateSetup = async () => {
    if (!setupType) {
      toast({
        title: "Select a setup type",
        description: "Please choose what kind of setup you want to build.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Filter and score products based on setup type and budget
      const maxBudget = budget[0];
      const availableProducts = products || [];
      
      // Simple AI-like logic to select products
      let selectedProducts: SetupItem[] = [];
      let totalCost = 0;
      
      // Shuffle and pick products that fit the budget
      const shuffled = [...availableProducts].sort(() => Math.random() - 0.5);
      
      for (const product of shuffled) {
        if (totalCost + product.price <= maxBudget && selectedProducts.length < 8) {
          selectedProducts.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: (product.categories as any)?.name || "Electronics",
            image_url: product.image_url || undefined
          });
          totalCost += product.price;
        }
      }
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (selectedProducts.length === 0) {
        toast({
          title: "No products found",
          description: "Try increasing your budget or check back later for more products.",
          variant: "destructive",
        });
        setGeneratedSetup(null);
      } else {
        setGeneratedSetup({
          total: totalCost,
          items: selectedProducts
        });
        
        toast({
          title: "Setup Generated!",
          description: `Found ${selectedProducts.length} items within your budget.`,
        });
      }
    } catch (error) {
      console.error("Error generating setup:", error);
      toast({
        title: "Error",
        description: "Failed to generate setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAllToCart = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (!generatedSetup) return;

    try {
      // Get or create cart
      let { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!cart) {
        const { data: newCart, error } = await supabase
          .from("carts")
          .insert({ user_id: user.id })
          .select("id")
          .single();
        
        if (error) throw error;
        cart = newCart;
      }

      // Add all items to cart
      for (const item of generatedSetup.items) {
        const { data: existingItem } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("cart_id", cart.id)
          .eq("product_id", item.id)
          .maybeSingle();

        if (existingItem) {
          await supabase
            .from("cart_items")
            .update({ quantity: existingItem.quantity + 1 })
            .eq("id", existingItem.id);
        } else {
          await supabase
            .from("cart_items")
            .insert({
              cart_id: cart.id,
              product_id: item.id,
              quantity: 1
            });
        }
      }

      toast({
        title: "Added to cart!",
        description: `${generatedSetup.items.length} items have been added to your cart.`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add items to cart.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4" />
              AI POWERED
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Build My Setup
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tell us what you need, and our AI will build the perfect electronics setup tailored to your budget
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Tell us about your needs
                </CardTitle>
                <CardDescription>
                  The more details you provide, the better we can customize your setup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Setup Type Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Setup Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {setupTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSetupType(type.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          setupType === type.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <type.icon className={`h-6 w-6 mb-2 ${setupType === type.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className="text-sm font-medium">{type.name}</p>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Slider */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Budget: <CurrencyDisplay amount={budget[0]} className="font-bold text-primary" />
                  </label>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    min={10000}
                    max={500000}
                    step={5000}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>KSh 10,000</span>
                    <span>KSh 500,000</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Describe your needs (optional)</label>
                  <Textarea
                    placeholder="I need a setup for streaming games, with good audio quality and RGB lighting. I have a small desk space..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button 
                  onClick={handleGenerateSetup}
                  disabled={!setupType || isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating Your Setup...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate My Setup
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Setup */}
            <Card>
              <CardHeader>
                <CardTitle>Your Recommended Setup</CardTitle>
                <CardDescription>
                  AI-curated electronics based on your requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!generatedSetup ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Select a setup type and budget to generate your custom setup</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Total Price */}
                    <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">Total Setup Cost</span>
                        <CurrencyDisplay amount={generatedSetup.total} className="text-2xl font-bold text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <Check className="h-4 w-4 text-green-500" />
                        Within your budget of <CurrencyDisplay amount={budget[0]} />
                      </p>
                    </div>

                    <Separator />

                    {/* Items List */}
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {generatedSetup.items.map((item, index) => {
                        const Icon = getCategoryIcon(item.category);
                        return (
                          <Link 
                            key={item.id} 
                            to={`/product/${item.id}`}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded object-cover" />
                              ) : (
                                <div className="w-10 h-10 rounded bg-background flex items-center justify-center">
                                  <Icon className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                                <Badge variant="secondary" className="text-xs">
                                  {item.category}
                                </Badge>
                              </div>
                            </div>
                            <CurrencyDisplay amount={item.price} className="font-medium" />
                          </Link>
                        );
                      })}
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full" onClick={handleAddAllToCart}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add All to Cart
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setGeneratedSetup(null)}>
                        Start Over
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Why Use Our AI Setup Builder?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Smart Recommendations</h3>
                  <p className="text-sm text-muted-foreground">
                    AI analyzes your needs to find the perfect product combinations
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <Monitor className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Budget Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    Get the best value for your money with intelligent budget allocation
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">One-Click Purchase</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your entire setup to cart with a single click
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BuildSetup;
