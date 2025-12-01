import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { X, Check, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image_url: string;
  brand: string;
  description: string;
  [key: string]: any;
}

const ProductComparison = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const productIds = searchParams.get('ids')?.split(',') || [];
    if (productIds.length === 0 || productIds.length > 4) {
      toast.error("Please select 1-4 products to compare");
      navigate('/products');
      return;
    }
    fetchProducts(productIds);
  }, [searchParams]);

  const fetchProducts = async (ids: string[]) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', ids);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = (productId: string) => {
    const newIds = products
      .filter(p => p.id !== productId)
      .map(p => p.id);
    
    if (newIds.length === 0) {
      navigate('/products');
    } else {
      navigate(`/comparison?ids=${newIds.join(',')}`);
    }
  };

  const specs = [
    { key: 'brand', label: 'Brand' },
    { key: 'price', label: 'Price', format: (p: Product) => `${p.currency} ${p.price.toLocaleString()}` },
    { key: 'stock_quantity', label: 'In Stock' },
    { key: 'warranty_info', label: 'Warranty' },
    { key: 'ar_enabled', label: 'AR Enabled', format: (p: Product) => p.ar_enabled },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Comparison</h1>
          <p className="text-muted-foreground">Compare up to 4 products side by side</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-left bg-muted/50 sticky left-0 z-10">Feature</th>
                {products.map((product) => (
                  <th key={product.id} className="p-4 bg-muted/50 min-w-[250px]">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeProduct(product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <img
                        src={product.image_url || '/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs.map((spec) => (
                <tr key={spec.key} className="border-b">
                  <td className="p-4 font-medium bg-muted/30 sticky left-0 z-10">
                    {spec.label}
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {spec.format ? (
                        typeof spec.format(product) === 'boolean' ? (
                          spec.format(product) ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <Minus className="h-5 w-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          spec.format(product)
                        )
                      ) : product[spec.key] ? (
                        product[spec.key]
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4 font-medium bg-muted/30 sticky left-0 z-10">
                  Actions
                </td>
                {products.map((product) => (
                  <td key={product.id} className="p-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="w-full"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Add to cart logic here
                          toast.success("Added to cart");
                        }}
                        className="w-full"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductComparison;
