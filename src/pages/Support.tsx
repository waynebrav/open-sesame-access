import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SupportTicketSystem from "@/components/SupportTicketSystem";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, Phone } from "lucide-react";

const Support = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <MessageCircle className="h-16 w-16 text-electrify-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Customer Support</h1>
            <p className="text-muted-foreground mb-8">
              Please log in to access our support ticket system and get personalized assistance.
            </p>
            <div className="space-y-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/login">Log In</Link>
              </Button>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <a href="mailto:support@electrify.com" className="hover:text-electrify-500">
                    support@electrify.com
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Phone className="h-5 w-5" />
                  <a href="tel:+254700000000" className="hover:text-electrify-500">
                    +254 700 000 000
                  </a>
                </div>
              </div>
            </div>
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
        <SupportTicketSystem />
      </main>
      <Footer />
    </div>
  );
};

export default Support;
