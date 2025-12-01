import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  helpful_votes: number;
  is_verified_purchase: boolean;
  created_at: string;
  user_id: string;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Review[];
    },
  });

  const { data: userReview } = useQuery({
    queryKey: ['userReview', productId, user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in to review');
      
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          title: title || null,
          comment: comment || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['userReview', productId, user?.id] });
      setIsReviewDialogOpen(false);
      setRating(5);
      setTitle("");
      setComment("");
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const averageRating = reviews?.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold">{averageRating}</div>
              <div className="mt-2">{renderStars(Number(averageRating))}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {reviews?.length || 0} reviews
              </div>
            </div>
            
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews?.filter(r => r.rating === stars).length || 0;
                const percentage = reviews?.length ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 mb-2">
                    <span className="text-sm w-8">{stars}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {user && !userReview && (
            <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Write a Review</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Write Your Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rating</label>
                    {renderStars(rating, true, setRating)}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title (optional)</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Sum up your experience"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Review (optional)</label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this product"
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={() => createReviewMutation.mutate()}
                    disabled={createReviewMutation.isPending}
                    className="w-full"
                  >
                    Submit Review
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {!user && (
            <p className="text-sm text-muted-foreground text-center">
              Please log in to write a review
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading reviews...</div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {review.user_id.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {renderStars(review.rating)}
                      {review.is_verified_purchase && (
                        <span className="text-xs text-green-600 font-medium">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    {review.title && (
                      <h4 className="font-semibold mb-1">{review.title}</h4>
                    )}
                    {review.comment && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {review.comment}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        Helpful ({review.helpful_votes})
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;