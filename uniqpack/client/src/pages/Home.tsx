import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Factory, Settings, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: products, isLoading } = useProducts();
  const featuredProducts = products?.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#001f3f] text-white overflow-hidden clip-path-slant pb-20 lg:pb-32">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://pixabay.com/get/gb815258bb99401f029504a85c863ef6ae86dc9314b7a13a25855c02318770e582453d1db0355d357aa5df565f42f1a8c4a6f38d946d0cac76e2d0da6081ddf65_1280.jpg" 
            alt="Industrial Machinery Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#001f3f] to-[#001f3f]/80" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-display leading-tight mb-6 text-white">
              UniqPack <br/>
              <span className="text-gray-300">Machinery for Modern Manufacturing</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Precision-engineered automation solutions designed to optimize your production line efficiency. Reliable, scalable, and built for 24/7 operation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-[#001f3f] hover:bg-gray-100 font-bold px-8 py-6 text-lg rounded-sm shadow-lg hover:shadow-xl transition-all">
                  View Machinery
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-bold px-8 py-6 text-lg rounded-sm">
                  Request Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Factory className="w-12 h-12 text-[#001f3f] mb-6" />
              <h3 className="text-xl font-bold mb-3">Industry Standard</h3>
              <p className="text-gray-600">Built to ISO 9001 standards with premium components for maximum durability and uptime.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Settings className="w-12 h-12 text-[#001f3f] mb-6" />
              <h3 className="text-xl font-bold mb-3">Custom Automation</h3>
              <p className="text-gray-600">Tailored solutions engineered to fit your specific product requirements and factory layout.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Users className="w-12 h-12 text-[#001f3f] mb-6" />
              <h3 className="text-xl font-bold mb-3">Global Support</h3>
              <p className="text-gray-600">24/7 technical support and rapid spare parts delivery to keep your line running.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[#001f3f] mb-2 font-display">Featured Machinery</h2>
              <p className="text-gray-600">Our most popular automated packaging solutions</p>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center font-semibold text-[#001f3f] hover:text-blue-800">
              View Full Catalog <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center sm:hidden">
             <Link href="/products">
              <Button variant="outline" className="w-full border-[#001f3f] text-[#001f3f]">
                View Full Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#001f3f] py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-display">Ready to optimize your production line?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Schedule a consultation with our engineering team to discuss your specific requirements.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-[#001f3f] hover:bg-gray-100 font-bold px-10 py-6 rounded-sm">
              Get in Touch
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
