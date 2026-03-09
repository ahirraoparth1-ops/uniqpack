import { Factory, ShieldCheck, Globe, Trophy } from "lucide-react";

export default function About() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-50 py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-[#001f3f] mb-6 font-display">About UniqPack</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Since 1995, we have been at the forefront of packaging automation, delivering engineering excellence to manufacturing facilities across the globe.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-[#001f3f] mb-6 font-display">Engineering Excellence</h2>
            <div className="prose text-gray-600 space-y-4">
              <p>
                UniqPack was founded on a simple principle: machinery should be built to last. In an industry where downtime costs thousands of dollars per minute, we prioritize reliability above all else.
              </p>
              <p>
                Our engineering team comprises veterans from the automation industry who understand the nuances of production line integration. From initial concept to final installation, we ensure every machine is optimized for your specific product and throughput requirements.
              </p>
              <p>
                Today, UniqPack machines are operating in over 40 countries, serving industries ranging from pharmaceuticals and food & beverage to cosmetics and chemicals.
              </p>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
             {/* Engineering team or facility image */}
            <img 
              src="/images/about-hero.png" 
              alt="Engineering Team" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Stats / Values */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-[#001f3f] rounded-full mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#001f3f] mb-2">25+ Years</h3>
            <p className="text-sm text-gray-600">Of industry experience and innovation</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-[#001f3f] rounded-full mb-4">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#001f3f] mb-2">40+ Countries</h3>
            <p className="text-sm text-gray-600">Active installations worldwide</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-[#001f3f] rounded-full mb-4">
              <Factory className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#001f3f] mb-2">500+ Machines</h3>
            <p className="text-sm text-gray-600">Successfully deployed and running</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-[#001f3f] rounded-full mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#001f3f] mb-2">ISO 9001</h3>
            <p className="text-sm text-gray-600">Certified quality management</p>
          </div>
        </div>
      </div>
    </div>
  );
}
