import { Link } from "wouter";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#001f3f] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-display tracking-tight">UniqPack</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Engineering excellence in packaging automation. We deliver robust, 
              high-performance machinery for manufacturing leaders worldwide.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 font-display">Products</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/products" className="hover:text-white transition-colors">Filling Machines</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Capping Systems</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Labeling Units</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Complete Lines</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 font-display">Company</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Support</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6 font-display">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 shrink-0 text-gray-400" />
                <span>Manoj Dhasharath Jorvekar (CEO)<br />Uniq Pack<br />Gat No.20, Karanji BK, Karanji BK., Kopargaon<br />Shrirampur - 423603, Ahmednagar, Maharashtra, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 shrink-0 text-gray-400" />
                <span>+91 832 915 5152</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 shrink-0 text-gray-400" />
                <span>sales@uniqpack.net</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} UniqPack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
