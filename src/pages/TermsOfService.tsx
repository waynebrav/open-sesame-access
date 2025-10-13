import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <div className="container py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Electrify's e-commerce platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Account Responsibilities</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security and confidentiality of your account credentials</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Prohibited Activities</h2>
            <p className="text-muted-foreground mb-4">Users may not:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Transmit malicious code or compromise system security</li>
              <li>Engage in fraudulent activities or misrepresent identity</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Scrape or data mine without permission</li>
              <li>Use the service for unauthorized commercial purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Product Information & Pricing</h2>
            <p className="text-muted-foreground mb-4">
              We strive to provide accurate product descriptions and pricing. However, errors may occur. We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Correct any errors in product information or pricing</li>
              <li>Refuse or cancel orders placed with incorrect pricing</li>
              <li>Update product availability and specifications</li>
              <li>Limit quantities on certain items</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Payment Terms</h2>
            <p className="text-muted-foreground mb-4">
              By placing an order, you agree to provide valid payment information. We accept multiple payment methods including credit cards, M-Pesa, PayPal, and other digital payment providers. All payments are processed securely through encrypted channels.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Shipping & Delivery</h2>
            <p className="text-muted-foreground mb-4">
              Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery to the carrier. We are not responsible for delays caused by carriers or customs clearance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Returns & Refunds</h2>
            <p className="text-muted-foreground mb-4">
              Please refer to our Returns & Refunds policy for detailed information about returning products and obtaining refunds. Generally, items must be returned within 30 days in their original condition.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All content on this platform, including but not limited to text, graphics, logos, images, and software, is the property of Electrify or its licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              To the fullest extent permitted by law, Electrify shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Your use or inability to use our services</li>
              <li>Any unauthorized access to or use of our servers</li>
              <li>Any interruption or cessation of transmission to or from our services</li>
              <li>Any bugs, viruses, or other harmful code transmitted through our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Dispute Resolution</h2>
            <p className="text-muted-foreground mb-4">
              Any disputes arising from these terms shall be resolved through binding arbitration in accordance with the laws of Kenya. You waive your right to participate in class actions or class arbitrations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Modifications to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes via email or website notice. Your continued use of the service after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We may terminate or suspend your account and access to our services immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These Terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8 p-6 bg-muted rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-2">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-1">
              <p className="text-muted-foreground">
                Email: <a href="mailto:legal@electrify.com" className="text-primary hover:underline">legal@electrify.com</a>
              </p>
              <p className="text-muted-foreground">
                Support: <a href="mailto:support@electrify.com" className="text-primary hover:underline">support@electrify.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;