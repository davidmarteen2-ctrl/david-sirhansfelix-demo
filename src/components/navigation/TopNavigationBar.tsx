import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { TELEGRAM_WELCOMING_URL } from "@/lib/config";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Signals", href: "#signals" },
  { label: "Community", href: "#community" },
  { label: "Broker", href: "#broker" },
  { label: "Learn", href: "#learn" },
  { label: "About", href: "#about" },
  { label: "Apply", href: "#apply" },
];

export function TopNavigationBar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30, duration: 0.25 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300",
          scrolled ? "py-4" : "py-6"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between w-full mx-4 lg:mx-8 xl:mx-auto max-w-[1280px] rounded-2xl transition-all duration-300",
            scrolled
              ? "bg-white/95 backdrop-blur-md shadow-sm border border-border px-6 py-3"
              : "bg-transparent px-2 py-2"
          )}
        >
          {/* Brand Lockup */}
          <div className="flex items-center flex-shrink-0">
            <span className="text-xl font-semibold tracking-tight text-primary">
              SirHansFelix
            </span>
          </div>

          {/* Desktop Navigation Cluster */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative px-4 py-2 text-[14px] font-medium text-secondary hover:text-primary transition-colors group"
              >
                {item.label}
                <span className="absolute bottom-1.5 left-4 right-4 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <Button size="sm" variant="header-primary" iconName="arrow-right" href={TELEGRAM_WELCOMING_URL} target="_blank" rel="noopener noreferrer">
              Join Telegram
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-primary focus:outline-none"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="text-xl font-semibold tracking-tight text-primary">
                SirHansFelix
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-primary focus:outline-none"
                aria-label="Close mobile menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col px-6 py-8 space-y-6 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-medium text-primary"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-8 mt-4 border-t border-border">
                <Button className="w-full justify-center" variant="hero-primary" iconName="arrow-right" size="lg" href={TELEGRAM_WELCOMING_URL} target="_blank" rel="noopener noreferrer">
                  Join Telegram
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
