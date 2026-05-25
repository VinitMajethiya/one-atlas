import React from 'react';
import Link from 'next/link';
import { Code, Globe, Users, MessageSquare, Compass } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-bg-subtle border-t border-border-default transition-colors duration-300 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-text-heading font-bold text-lg mb-4">
              <Compass className="h-6 w-6 text-primary" />
              <span>OneAtlas</span>
            </Link>
            <p className="text-text-muted text-sm max-w-sm mb-6">
              AI-native platform for generating and deploying secure, enterprise-grade internal tools, dashboards, and databases.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-text-muted hover:text-primary transition-colors">
                <Code className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors">
                <Users className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-muted hover:text-primary transition-colors">
                <MessageSquare className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-text-heading font-semibold text-sm uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/templates" className="text-text-muted hover:text-primary transition-colors">Templates</Link></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Schema Editor</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Deployments</a></li>
              <li><Link href="/pricing" className="text-text-muted hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-heading font-semibold text-sm uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="text-text-muted hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/blog" className="text-text-muted hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/support" className="text-text-muted hover:text-primary transition-colors">Help Center</Link></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Updates</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-heading font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/enterprise" className="text-text-muted hover:text-primary transition-colors">Enterprise</Link></li>
              <li><Link href="/security" className="text-text-muted hover:text-primary transition-colors">Security</Link></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Press Kit</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-default mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} OneAtlas Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">SLA Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
