import React from 'react';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import ModelsTicker from '../components/landing/ModelsTicker';
import TemplatesShowcase from '../components/landing/TemplatesShowcase';
import AtlasForRoles from '../components/landing/AtlasForRoles';
import EnterpriseTeaser from '../components/landing/EnterpriseTeaser';
import SecurityTeaser from '../components/landing/SecurityTeaser';
import PricingPreview from '../components/landing/PricingPreview';
import FAQSection from '../components/landing/FAQSection';
import Navbar from '../components/nav/Navbar';
import Footer from '../components/shared/Footer';

export const metadata = {
  title: 'OneAtlas — Build Internal Tools Instantly with AI',
  description: 'Deploy database-backed CRMs, HR dashboards, and operational tools from abstract schemas in seconds. Secure, scalable, and compliant.',
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <HowItWorks />
        <ModelsTicker />
        <TemplatesShowcase />
        <AtlasForRoles />
        <EnterpriseTeaser />
        <SecurityTeaser />
        <PricingPreview />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
