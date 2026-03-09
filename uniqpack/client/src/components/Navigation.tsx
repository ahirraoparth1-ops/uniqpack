import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Machinery" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-[#001f3f] text-white p-2 rounded">
              <span className="font-bold text-xl tracking-tight font-display">UQ</span>
            </div>
            <span className="font-bold text-xl text-[#001f3f] hidden sm:block font-display">
              UniqPack
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[#001f3f] border-b-2 border-transparent py-1",
                  location === link.href
                    ? "text-[#001f3f] border-[#001f3f]"
                    : "text-gray-500 hover:border-gray-300",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact">
              <Button className="bg-[#001f3f] hover:bg-[#003366] text-white rounded-sm px-6">
                Request Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-[#001f3f]"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-md text-base font-medium",
                  location === link.href
                    ? "bg-gray-50 text-[#001f3f]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#001f3f]",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-[#001f3f] text-white">Request Quote</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
