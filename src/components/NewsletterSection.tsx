import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if email already exists
      const { data: existingSubscriber } = await supabase
        .from("newsletter_subscribers")
        .select("id, is_active")
        .eq("email", email)
        .maybeSingle();
      
      if (existingSubscriber) {
        if (existingSubscriber.is_active) {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
          });
        } else {
          // Reactivate subscription
          await supabase
            .from("newsletter_subscribers")
            .update({ is_active: true, updated_at: new Date().toISOString() })
            .eq("id", existingSubscriber.id);
          
          toast({
            title: "Welcome back!",
            description: "Your subscription has been reactivated.",
          });
          setIsSubscribed(true);
        }
      } else {
        // Create new subscription
        const { error } = await supabase
          .from("newsletter_subscribers")
          .insert({
            email,
            is_active: true,
            subscribed_at: new Date().toISOString(),
          });
        
        if (error) throw error;
        
        toast({
          title: "Successfully subscribed!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setIsSubscribed(true);
      }
      
      setEmail("");
      
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Subscription failed",
        description: "Could not subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-electrify-800 to-purple-900 text-white">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
            <Mail className="h-8 w-8" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Electrify</h2>
          <p className="text-blue-100 mb-8">
            Subscribe to our newsletter for exclusive deals, tech news, and product announcements.
          </p>
          
          {isSubscribed ? (
            <div className="flex flex-col items-center justify-center py-6">
              <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
              <p className="text-lg font-medium">You're all set!</p>
              <p className="text-blue-200">Check your inbox for a welcome message.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-white text-electrify-800 hover:bg-white/90 min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          )}
          
          <p className="text-xs text-blue-200 mt-4">
            By subscribing, you agree to receive marketing emails from Electrify. You can unsubscribe at any time.
          </p>
          
          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 text-sm">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="font-medium">Exclusive Deals</p>
              <p className="text-blue-200 text-xs">Get early access to sales</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="font-medium">Tech News</p>
              <p className="text-blue-200 text-xs">Latest product updates</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="font-medium">No Spam</p>
              <p className="text-blue-200 text-xs">Unsubscribe anytime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
