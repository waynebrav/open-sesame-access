import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_role: string | null;
  testimonial: string;
  rating: number | null;
  avatar_url: string | null;
  is_published: boolean;
  is_featured: boolean;
}

const TestimonialManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerRole, setCustomerRole] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [rating, setRating] = useState(5);
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('testimonials')
        .insert({
          customer_name: customerName,
          customer_role: customerRole || null,
          testimonial,
          rating,
          is_published: isPublished,
          is_featured: isFeatured,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      resetForm();
      toast({ title: "Testimonial created successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .update({
          customer_name: customerName,
          customer_role: customerRole || null,
          testimonial,
          rating,
          is_published: isPublished,
          is_featured: isFeatured,
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      resetForm();
      toast({ title: "Testimonial updated successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast({ title: "Testimonial deleted successfully" });
    },
  });

  const resetForm = () => {
    setCustomerName("");
    setCustomerRole("");
    setTestimonial("");
    setRating(5);
    setIsPublished(true);
    setIsFeatured(false);
    setEditing(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: Testimonial) => {
    setEditing(item);
    setCustomerName(item.customer_name);
    setCustomerRole(item.customer_role || "");
    setTestimonial(item.testimonial);
    setRating(item.rating || 5);
    setIsPublished(item.is_published);
    setIsFeatured(item.is_featured);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editing) {
      updateMutation.mutate(editing.id);
    } else {
      createMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Testimonial Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Testimonial" : "Create Testimonial"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Customer Name</label>
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Role/Title (optional)</label>
                <Input
                  value={customerRole}
                  onChange={(e) => setCustomerRole(e.target.value)}
                  placeholder="e.g. CEO at Company"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Testimonial</label>
                <Textarea
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  placeholder="Enter testimonial text"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer ${
                        star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium">
                    Publish
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="isFeatured" className="text-sm font-medium">
                    Feature on homepage
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {editing ? "Update" : "Create"} Testimonial
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading testimonials...</div>
      ) : (
        <div className="grid gap-4">
          {testimonials?.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.is_published ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                      {item.is_featured && (
                        <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                          Featured
                        </span>
                      )}
                      <div className="flex gap-1">
                        {Array.from({ length: item.rating || 0 }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{item.customer_name}</CardTitle>
                    {item.customer_role && (
                      <p className="text-sm text-muted-foreground">{item.customer_role}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.testimonial}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestimonialManagement;