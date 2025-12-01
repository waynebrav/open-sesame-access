import React from "react";
import FAQSection from "@/components/FAQSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const HelpCenter = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-electrify-500 to-purple-600 bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions about orders, shipping, returns, and more
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <FAQSection />
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default HelpCenter;
