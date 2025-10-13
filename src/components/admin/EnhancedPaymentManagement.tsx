import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CreditCard, DollarSign, Bitcoin, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export const EnhancedPaymentManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: providers, isLoading } = useQuery({
    queryKey: ['payment-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_providers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const updateProviderMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('payment_providers')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-providers'] });
      toast({
        title: "Success",
        description: "Payment provider updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getProviderIcon = (code: string) => {
    const iconMap: Record<string, any> = {
      stripe: CreditCard,
      paddle: DollarSign,
      coinbase: Bitcoin,
      googlepay: Smartphone,
      applepay: Smartphone,
      square: CreditCard,
      razorpay: CreditCard,
      flutterwave: DollarSign,
    };
    const Icon = iconMap[code] || CreditCard;
    return <Icon className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Providers</h2>
        <p className="text-muted-foreground">
          Configure API keys and settings for various payment providers
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {providers?.map((provider) => (
          <Card key={provider.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getProviderIcon(provider.code)}
                  <CardTitle>{provider.name}</CardTitle>
                </div>
                <Switch
                  checked={provider.is_active}
                  onCheckedChange={(checked) => {
                    updateProviderMutation.mutate({
                      id: provider.id,
                      updates: { is_active: checked }
                    });
                  }}
                />
              </div>
              <CardDescription>{provider.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="config" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="config">Config</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="config" className="space-y-4">
                  <div className="space-y-2">
                    <Label>API Key / Client ID</Label>
                    <Input
                      type="password"
                      placeholder="Enter API key"
                      defaultValue={(provider.configuration as any)?.apiKey || ''}
                      onBlur={(e) => {
                        const newConfig = {
                          ...(provider.configuration as object || {}),
                          apiKey: e.target.value
                        };
                        updateProviderMutation.mutate({
                          id: provider.id,
                          updates: { configuration: newConfig }
                        });
                      }}
                    />
                  </div>
                  
                  {(provider.code === 'stripe' || provider.code === 'paddle' || provider.code === 'square') && (
                    <div className="space-y-2">
                      <Label>Secret Key</Label>
                      <Input
                        type="password"
                        placeholder="Enter secret key"
                        defaultValue={(provider.configuration as any)?.secretKey || ''}
                        onBlur={(e) => {
                          const newConfig = {
                            ...(provider.configuration as object || {}),
                            secretKey: e.target.value
                          };
                          updateProviderMutation.mutate({
                            id: provider.id,
                            updates: { configuration: newConfig }
                          });
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input
                      type="text"
                      placeholder="https://..."
                      defaultValue={(provider.configuration as any)?.webhookUrl || ''}
                      onBlur={(e) => {
                        const newConfig = {
                          ...(provider.configuration as object || {}),
                          webhookUrl: e.target.value
                        };
                        updateProviderMutation.mutate({
                          id: provider.id,
                          updates: { configuration: newConfig }
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Add configuration notes..."
                      defaultValue={(provider.configuration as any)?.notes || ''}
                      onBlur={(e) => {
                        const newConfig = {
                          ...(provider.configuration as object || {}),
                          notes: e.target.value
                        };
                        updateProviderMutation.mutate({
                          id: provider.id,
                          updates: { configuration: newConfig }
                        });
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="info" className="space-y-2">
                  <div>
                    <p className="text-sm font-medium">Provider Code</p>
                    <p className="text-sm text-muted-foreground">{provider.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Supported Currencies</p>
                    <p className="text-sm text-muted-foreground">
                      {provider.supported_currencies?.join(', ')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground">
                      {provider.is_active ? '✅ Active' : '❌ Inactive'}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EnhancedPaymentManagement;