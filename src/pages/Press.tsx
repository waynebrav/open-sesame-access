import React from "react";
import { Download, Mail, FileText, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Press = () => {
  const pressReleases = [
    {
      date: "March 15, 2024",
      title: "Electrify Launches Revolutionary AR Shopping Experience",
      excerpt: "Electrify introduces cutting-edge augmented reality features, allowing customers to visualize products in their space before purchase.",
    },
    {
      date: "February 28, 2024",
      title: "Electrify Expands Payment Options with Multi-Currency Support",
      excerpt: "New payment integrations including Stripe, PayPal, and M-Pesa make shopping more accessible to customers worldwide.",
    },
    {
      date: "January 10, 2024",
      title: "Electrify Reaches 100,000 Satisfied Customers Milestone",
      excerpt: "The electronics retail platform celebrates significant growth and customer satisfaction achievements.",
    },
  ];

  const mediaAssets = [
    { name: "Company Logo (PNG)", size: "2.3 MB", icon: ImageIcon },
    { name: "Brand Guidelines (PDF)", size: "5.1 MB", icon: FileText },
    { name: "Product Images (ZIP)", size: "45.8 MB", icon: ImageIcon },
    { name: "Press Kit (PDF)", size: "8.2 MB", icon: FileText },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-electrify-500 to-purple-600 bg-clip-text text-transparent">
                Press & Media
              </h1>
              <p className="text-muted-foreground text-lg">
                Latest news, press releases, and media resources for journalists and content creators
              </p>
            </div>

            {/* Press Contact */}
            <div className="bg-card border rounded-lg p-8 mb-12">
              <h2 className="text-2xl font-semibold mb-4">Press Contact</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  For press inquiries, interviews, or media requests, please contact our media relations team:
                </p>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-electrify-500" />
                  <a href="mailto:press@electrify.com" className="text-electrify-500 hover:underline">
                    press@electrify.com
                  </a>
                </div>
                <p className="text-sm">
                  Response time: Within 24 hours on business days
                </p>
              </div>
            </div>

            {/* Press Releases */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Recent Press Releases</h2>
              <div className="space-y-6">
                {pressReleases.map((release, index) => (
                  <div key={index} className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <p className="text-sm text-muted-foreground mb-2">{release.date}</p>
                    <h3 className="text-xl font-semibold mb-3">{release.title}</h3>
                    <p className="text-muted-foreground mb-4">{release.excerpt}</p>
                    <Button variant="link" className="p-0 h-auto text-electrify-500">
                      Read full release →
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Assets */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Media Assets</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {mediaAssets.map((asset, index) => (
                  <div key={index} className="bg-card border rounded-lg p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-electrify-500/10 rounded">
                        <asset.icon className="h-6 w-6 text-electrify-500" />
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-muted-foreground">{asset.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="bg-card border rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">About Electrify</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Electrify is a leading electronics retail platform that combines cutting-edge technology with exceptional customer service. Founded with a mission to make premium electronics accessible to everyone, we offer a curated selection of smartphones, laptops, smart home devices, and more.
                </p>
                <p>
                  Our innovative AR shopping experience, multi-currency support, and commitment to customer satisfaction have made us a trusted destination for tech enthusiasts across the globe.
                </p>
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-2">Quick Facts</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Founded: 2023</li>
                    <li>• Headquarters: Nairobi, Kenya</li>
                    <li>• Products: 10,000+ electronics</li>
                    <li>• Customers: 100,000+ worldwide</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Press;
