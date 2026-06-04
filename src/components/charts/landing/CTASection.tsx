// src/components/landing/CTASection.tsx
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-3xl sm:text-4xl font-bold font-mono mb-4 ${
          isDark ? 'text-[color:var(--alpha-text)]' : 'text-[color:var(--alpha-text)]'
        }`}>
          Ready to Supercharge Your Web3 Journey?
        </h2>
        <p className={`text-lg mb-8 ${
          isDark ? 'text-[color:var(--alpha-text-muted)]' : 'text-[color:var(--alpha-text-muted)]'
        }`}>
          Join thousands of enthusiasts who are already using Alpha Tracker to manage their projects and maximize opportunities.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register">
            <Button className={`h-12 px-8 text-base font-mono ${
              isDark 
                ? 'bg-[var(--alpha-signal)] text-[var(--alpha-accent-contrast)] hover:bg-[var(--alpha-signal-press)]' 
                : 'bg-gradient-to-r from-[color:var(--alpha-main)] to-[color:var(--alpha-highlight)] text-[color:var(--alpha-text)] hover:opacity-90'
            }`}>
              Get Started Free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className={`h-12 px-8 text-base font-mono border-2 ${
              isDark 
                ? 'border-[var(--alpha-border)] text-[color:var(--alpha-text-muted)] hover:bg-[var(--alpha-hover-soft)]' 
                : 'border-[color:var(--alpha-border)] text-[color:var(--alpha-text)] hover:bg-[color:var(--alpha-surface-soft)]'
            }`}>
              Learn More <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}