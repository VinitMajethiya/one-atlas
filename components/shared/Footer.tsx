import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M19.27 4.73A10.9 10.9 0 0 0 13.5 3h-.1l-.23.27C15.22 4.14 17 5.76 18.1 7.7a18.8 18.8 0 0 1-5-1.7 19.3 19.3 0 0 1-6.2 0 18.8 18.8 0 0 1-5 1.7C3 5.76 4.78 4.14 6.83 3.27L6.6 3H6.5a10.9 10.9 0 0 0-5.77 1.73A20.9 20.9 0 0 0 .04 17.5a12.8 12.8 0 0 0 5.66 3l1.1-1.3c-1.8-.5-3.3-1.6-4.2-3 2.1 1.2 4.5 1.8 7 1.8s4.9-.6 7-1.8c-.9 1.4-2.4 2.5-4.2 3l1.1 1.3a12.8 12.8 0 0 0 5.66-3 20.9 20.9 0 0 0-1-12.77ZM8 14a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 8 14Zm8 0a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 16 14Z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-.533 1.027c.18.554.29 1.144.3 1.759.83.18 1.434.92 1.434 1.797 0 1.017-.83 1.847-1.845 1.847-.07 0-.142-.008-.21-.017-.678 2.091-2.399 3.696-4.636 4.364.032.128.05.263.05.402 0 1.017-.83 1.846-1.847 1.846s-1.847-.829-1.847-1.846c0-.14.018-.274.051-.402-2.238-.668-3.958-2.273-4.636-4.364-.069.009-.139.017-.21.017C2.83 14.25 2 13.42 2 12.403c0-.877.604-1.617 1.434-1.797.01-.615.12-1.205.3-1.759a1.25 1.25 0 0 1-.533-1.027c0-.688.562-1.249 1.25-1.249.52 0 .963.322 1.155.779 1.348-.909 3.125-1.482 5.09-1.579l1.096-3.428 2.923.633a1.002 1.002 0 0 1 1.95.275c0 .554-.45.1-.998.1a1.001 1.001 0 0 1-.998-1.001.996.996 0 0 1 .71-.958l-2.723-.591-.986 3.084c1.97.098 3.748.672 5.093 1.582.19-.457.633-.779 1.154-.779zM7 11.25c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm10 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm-5 4c-1.84 0-3.37.94-3.93 2.14a.252.252 0 0 0 .22.36h7.42a.25.25 0 0 0 .22-.36c-.56-1.2-2.09-2.14-3.93-2.14z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={props.className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="w-full bg-bg-subtle border-t border-border-default transition-colors duration-300 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 text-text-heading font-bold text-lg mb-4">
              <Compass className="h-6 w-6 text-primary" />
              <span>OneAtlas</span>
            </Link>
            <p className="text-text-muted text-sm max-w-sm mb-6">
              AI-native platform for generating and deploying secure, enterprise-grade internal tools, dashboards, and databases.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="https://discord.gg/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="Discord">
                <DiscordIcon className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="LinkedIn">
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a href="https://x.com/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="Twitter/X">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="https://reddit.com/r/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="Reddit">
                <RedditIcon className="h-5 w-5" />
              </a>
              <a href="https://github.com/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="GitHub">
                <GithubIcon className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors" title="Instagram">
                <InstagramIcon className="h-5 w-5" />
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
            <h4 className="text-text-heading font-semibold text-sm uppercase tracking-wider mb-4">Use Cases</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/templates?category=crm" className="text-text-muted hover:text-primary transition-colors">CRM Tools</Link></li>
              <li><Link href="/templates?category=hr" className="text-text-muted hover:text-primary transition-colors">HR Dashboards</Link></li>
              <li><Link href="/templates?category=finance-operators" className="text-text-muted hover:text-primary transition-colors">Finance Ops</Link></li>
              <li><Link href="/templates?category=developers" className="text-text-muted hover:text-primary transition-colors">DevOps Panels</Link></li>
              <li><Link href="/templates?category=admin" className="text-text-muted hover:text-primary transition-colors">Data Tools</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-heading font-semibold text-sm uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="text-text-muted hover:text-primary transition-colors">Docs</Link></li>
              <li><Link href="/support" className="text-text-muted hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/blog" className="text-text-muted hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/docs" className="text-text-muted hover:text-primary transition-colors">Updates</Link></li>
              <li><a href="https://youtube.com/@oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">YouTube</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-heading font-semibold text-sm uppercase tracking-wider mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://discord.gg/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">Discord</a></li>
              <li><a href="https://linkedin.com/company/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="https://x.com/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="https://reddit.com/r/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">Reddit</a></li>
              <li><a href="https://github.com/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="https://instagram.com/oneatlas" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">Instagram</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-text-heading font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Press</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Terms</a></li>
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
