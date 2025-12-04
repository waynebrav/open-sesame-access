import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Package, Truck, CheckCircle, Clock, ChevronDown, ChevronUp, ArrowLeft, User, ShoppingBag, MapPin, Copy, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    case "shipped":
      return <Truck className="h-4 w-4" />;
    case "processing":
      return <Clock className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
    case "completed":
      return "bg-green-500";
    case "shipped":
      return "bg-blue-500";
    case "processing":
      return "bg-yellow-500";
    case "cancelled":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusProgress = (status: string) => {
  switch (status) {
    case "pending":
      return 10;
    case "processing":
      return 35;
    case "shipped":
      return 70;
    case "delivered":
    case "completed":
      return 100;
    default:
      return 0;
  }
};

const OrderTracking = ({ order }: { order: any }) => {
  const steps = [
    { status: "pending", label: "Order Placed", icon: Package },
    { status: "processing", label: "Processing", icon: Clock },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ];
  
  const currentIndex = steps.findIndex(s => s.status === order.status);
  const progress = getStatusProgress(order.status);
  
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Order Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      
      <div className="grid grid-cols-4 gap-2 mt-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = step.status === order.status;
          
          return (
            <div key={step.status} className="flex flex-col items-center text-center">
              <div className={`p-2 rounded-full mb-2 ${
                isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              } ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-xs ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {order.tracking_number && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tracking Number</p>
              <p className="font-mono font-medium">{order.tracking_number}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(order.tracking_number);
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {order.shipping_method && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="h-4 w-4" />
          <span>Shipping via {order.shipping_method}</span>
        </div>
      )}
    </div>
  );
};

const OrderHistory = () => {
  const [openOrders, setOpenOrders] = useState<string[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data: ordersData, error } = await supabase
          .from("orders")
          .select(`
            id, 
            created_at, 
            status, 
            total_amount, 
            payment_status,
            tracking_number,
            shipping_method,
            shipping_name,
            shipping_city,
            shipping_country,
            order_items:order_items(id, product_name, unit_price, quantity, total_price)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setOrders(ordersData || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load your orders",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate, toast]);

  const toggleOrder = (orderId: string) => {
    setOpenOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Link 
                to="/profile" 
                className="inline-flex items-center text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Profile
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/profile" 
                className="inline-flex items-center px-3 py-2 bg-primary-foreground/20 rounded-lg hover:bg-primary-foreground/30 transition-colors"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
              <Link 
                to="/products" 
                className="inline-flex items-center px-3 py-2 bg-primary-foreground/20 rounded-lg hover:bg-primary-foreground/30 transition-colors"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="mt-4">
            <h1 className="text-3xl font-bold mb-2">Order History</h1>
            <p className="text-primary-foreground/80">Track and manage your orders</p>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="container mx-auto py-8 px-4">
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/3 mt-2"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                  <Button asChild>
                    <Link to="/products">Browse Products</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Collapsible
                  key={order.id}
                  open={openOrders.includes(order.id)}
                  onOpenChange={() => toggleOrder(order.id)}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {openOrders.includes(order.id) ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                                <CardDescription>
                                  {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </CardDescription>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 flex-wrap gap-2">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Total</p>
                              <p className="text-lg font-bold">KES {order.total_amount?.toLocaleString()}</p>
                            </div>
                            <Badge 
                              className={`${getStatusColor(order.status)} text-white`}
                              variant="secondary"
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                            {order.payment_status && (
                              <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'}>
                                {order.payment_status}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <Separator className="mb-4" />
                        
                        {/* Order Tracking */}
                        <OrderTracking order={order} />
                        
                        <Separator className="my-4" />
                        
                        {/* Shipping Address */}
                        {order.shipping_name && (
                          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <p className="font-medium text-sm">{order.shipping_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {[order.shipping_city, order.shipping_country].filter(Boolean).join(', ')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Order Items */}
                        <div className="space-y-3 mb-6">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                            Items ({order.order_items?.length || 0})
                          </h4>
                          {order.order_items?.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between py-3 border-b border-muted/50 last:border-0">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-medium">{item.product_name}</p>
                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">KES {(item.total_price || (item.unit_price * item.quantity))?.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">
                                  KES {item.unit_price?.toLocaleString()} each
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between pt-4 flex-wrap gap-4">
                          <div className="flex space-x-2 flex-wrap gap-2">
                            {order.status === "shipped" && order.tracking_number && (
                              <Button variant="outline" size="sm" asChild>
                                <a 
                                  href={`https://track.aftership.com/${order.tracking_number}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Track Package
                                </a>
                              </Button>
                            )}
                            {(order.status === "delivered" || order.status === "completed") && (
                              <Button variant="outline" size="sm">
                                Reorder
                              </Button>
                            )}
                          </div>
                          <div className="bg-muted/50 px-4 py-2 rounded-lg">
                            <p className="text-sm text-muted-foreground">Order Total</p>
                            <p className="text-xl font-bold">KES {order.total_amount?.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderHistory;
