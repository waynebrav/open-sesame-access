import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard, Smartphone, Wallet, Trash2, Key, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import PayPalManagement from './PayPalManagement';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MpesaConfig {
  id: string;
  name: string;
  shortcode: string;
  environment: 'sandbox' | 'production';
  is_active: boolean;
  created_at: string;
}

export const PaymentManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSecrets, setShowSecrets] = useState(false);
  const [newMpesaConfig, setNewMpesaConfig] = useState({
    name: '',
    shortcode: '',
    environment: 'sandbox' as 'sandbox' | 'production',
  });
  
  // M-Pesa API credentials state
  const [mpesaCredentials, setMpesaCredentials] = useState({
    consumer_key: '',
    consumer_secret: '',
    passkey: '',
    callback_url: '',
  });

  const { data: mpesaConfigs = [], isLoading: loadingMpesa } = useQuery({
    queryKey: ['mpesa-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mpesa_configurations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching M-Pesa configs:', error);
        return [] as MpesaConfig[];
      }
      
      return data as MpesaConfig[];
    },
  });

  const createMpesaConfig = useMutation({
    mutationFn: async (config: typeof newMpesaConfig) => {
      const { data, error } = await supabase
        .from('mpesa_configurations')
        .insert([config])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'M-Pesa configuration created successfully',
      });
      setNewMpesaConfig({ name: '', shortcode: '', environment: 'sandbox' });
      queryClient.invalidateQueries({ queryKey: ['mpesa-configurations'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create M-Pesa configuration',
        variant: 'destructive',
      });
    },
  });

  const toggleMpesaConfig = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      if (isActive) {
        await supabase
          .from('mpesa_configurations')
          .update({ is_active: false })
          .neq('id', id);
      }

      const { data, error } = await supabase
        .from('mpesa_configurations')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Configuration updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['mpesa-configurations'] });
    },
  });

  const deleteMpesaConfig = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('mpesa_configurations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Configuration deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['mpesa-configurations'] });
    },
  });

  const handleCreateMpesa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMpesaConfig.name || !newMpesaConfig.shortcode) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createMpesaConfig.mutate(newMpesaConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment Management</h2>
        <p className="text-muted-foreground">Configure payment methods and withdrawal settings</p>
      </div>

      <Tabs defaultValue="mpesa" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mpesa" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            M-Pesa
          </TabsTrigger>
          <TabsTrigger value="paypal" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            PayPal
          </TabsTrigger>
          <TabsTrigger value="withdrawal" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Withdrawal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mpesa" className="space-y-6">
          {/* M-Pesa API Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                M-Pesa API Credentials
              </CardTitle>
              <CardDescription>
                Configure your Safaricom Daraja API credentials for M-Pesa STK Push
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  These credentials are stored securely as environment secrets. Contact your administrator to update them in Supabase secrets.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="consumer-key">Consumer Key</Label>
                  <div className="relative">
                    <Input
                      id="consumer-key"
                      type={showSecrets ? 'text' : 'password'}
                      value={mpesaCredentials.consumer_key}
                      onChange={(e) => setMpesaCredentials(prev => ({ ...prev, consumer_key: e.target.value }))}
                      placeholder="Enter Daraja Consumer Key"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="consumer-secret">Consumer Secret</Label>
                  <Input
                    id="consumer-secret"
                    type={showSecrets ? 'text' : 'password'}
                    value={mpesaCredentials.consumer_secret}
                    onChange={(e) => setMpesaCredentials(prev => ({ ...prev, consumer_secret: e.target.value }))}
                    placeholder="Enter Daraja Consumer Secret"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passkey">Passkey (Lipa Na M-Pesa Online)</Label>
                  <Input
                    id="passkey"
                    type={showSecrets ? 'text' : 'password'}
                    value={mpesaCredentials.passkey}
                    onChange={(e) => setMpesaCredentials(prev => ({ ...prev, passkey: e.target.value }))}
                    placeholder="Enter Lipa Na M-Pesa Passkey"
                  />
                </div>
                <div>
                  <Label htmlFor="callback-url">Callback URL</Label>
                  <Input
                    id="callback-url"
                    type="text"
                    value={mpesaCredentials.callback_url}
                    onChange={(e) => setMpesaCredentials(prev => ({ ...prev, callback_url: e.target.value }))}
                    placeholder="https://your-domain.com/api/mpesa-callback"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSecrets(!showSecrets)}
                >
                  {showSecrets ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showSecrets ? 'Hide' : 'Show'} Credentials
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: 'Info',
                      description: 'API credentials should be configured in Supabase Edge Function secrets for security',
                    });
                  }}
                >
                  Save API Credentials
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Add M-Pesa Configuration</CardTitle>
              <CardDescription>
                Add a new M-Pesa business shortcode configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateMpesa} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mpesa-name">Configuration Name</Label>
                    <Input
                      id="mpesa-name"
                      value={newMpesaConfig.name}
                      onChange={(e) => setNewMpesaConfig(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Production M-Pesa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mpesa-shortcode">Business Shortcode</Label>
                    <Input
                      id="mpesa-shortcode"
                      value={newMpesaConfig.shortcode}
                      onChange={(e) => setNewMpesaConfig(prev => ({ ...prev, shortcode: e.target.value }))}
                      placeholder="e.g., 174379"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="mpesa-environment">Environment</Label>
                  <Select
                    value={newMpesaConfig.environment}
                    onValueChange={(value: 'sandbox' | 'production') =>
                      setNewMpesaConfig(prev => ({ ...prev, environment: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                      <SelectItem value="production">Production (Live)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  disabled={createMpesaConfig.isPending}
                  className="w-full"
                >
                  {createMpesaConfig.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Configuration
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Existing Configurations */}
          <Card>
            <CardHeader>
              <CardTitle>M-Pesa Configurations</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMpesa ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {mpesaConfigs?.map((config) => (
                    <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{config.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Shortcode: {config.shortcode} • {config.environment}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant={config.is_active ? 'default' : 'secondary'}>
                          {config.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Switch
                          checked={config.is_active}
                          onCheckedChange={(checked) =>
                            toggleMpesaConfig.mutate({ id: config.id, isActive: checked })
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMpesaConfig.mutate(config.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {!mpesaConfigs?.length && (
                    <div className="text-center py-8 text-muted-foreground">
                      No M-Pesa configurations found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paypal">
          <PayPalManagement />
        </TabsContent>

        <TabsContent value="withdrawal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="withdrawal-account">Withdrawal Account</Label>
                  <Input
                    id="withdrawal-account"
                    placeholder="Bank account or mobile money number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="withdrawal-method">Withdrawal Method</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select withdrawal method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="mpesa">M-Pesa</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="minimum-withdrawal">Minimum Withdrawal Amount</Label>
                  <Input
                    id="minimum-withdrawal"
                    type="number"
                    placeholder="1000"
                  />
                </div>

                <Button className="w-full">
                  Save Withdrawal Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
