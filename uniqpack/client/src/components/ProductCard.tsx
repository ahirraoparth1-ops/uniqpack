import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Box } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.imageUrl;

  return (
    <Card className="group h-full flex flex-col overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img
          src={imageSrc}
          alt={product.name}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-[#001f3f]/0 group-hover:bg-[#001f3f]/5 transition-colors duration-300" />
      </div>
      
      <CardHeader className="pb-2">
        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
          {product.category}
        </div>
        <h3 className="text-xl font-bold text-[#001f3f] group-hover:text-blue-800 transition-colors line-clamp-2">
          {product.name}
        </h3>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {product.description}
        </p>
        <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 p-2 rounded">
          <Box className="w-4 h-4 mr-2 text-[#001f3f]" />
          Capacity: {product.capacity}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-6">
        <Link href={`/products/${product.slug}`} className="w-full">
          <Button 
            className="w-full bg-white text-[#001f3f] border-2 border-[#001f3f] hover:bg-[#001f3f] hover:text-white transition-all duration-300 font-semibold group-hover:shadow-md"
          >
            View Specifications
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
