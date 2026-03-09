import { useProduct, useCreateInquiry } from "@/hooks/use-products";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { insertInquirySchema } from "@shared/schema";
import { z } from "zod";
import { Check, Info, FileText, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

// Schema for inquiry form
const formSchema = insertInquirySchema.extend({
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(5, "Phone number required"),
});

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, isLoading } = useProduct(slug || "");
  const createInquiry = useCreateInquiry();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      message: "I would like to request a quote for this machine.",
      productId: undefined,
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!product) return;
    try {
      await createInquiry.mutateAsync({ ...data, productId: product.id });
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handled in hook
    }
  };

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-12"><Skeleton className="h-[600px] w-full" /></div>;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }

  const heroImageSrc = product.imageUrl;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Product Hero */}
      <div className="bg-[#001f3f] text-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded bg-blue-900/50 text-blue-200 text-sm font-semibold mb-4 border border-blue-800">
                {product.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-bold font-display mb-6 leading-tight">{product.name}</h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">{product.description}</p>
              
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-white text-[#001f3f] hover:bg-gray-100 font-bold px-8 h-14 text-lg rounded-sm w-full md:w-auto">
                    Request Quote & Specs
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Request Information</DialogTitle>
                    <DialogDescription>
                      Complete the form below to receive a detailed quote for the {product.name}.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="company" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      
                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl><Textarea className="resize-none h-24" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <Button type="submit" className="w-full bg-[#001f3f]" disabled={createInquiry.isPending}>
                        {createInquiry.isPending ? "Sending..." : "Submit Inquiry"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-white p-2 rounded-lg shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
              <img 
                src={heroImageSrc} 
                alt={product.name} 
                className="w-full rounded border border-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Specs Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center">
                <Info className="w-5 h-5 text-[#001f3f] mr-2" />
                <h2 className="text-lg font-bold text-[#001f3f]">Technical Specifications</h2>
              </div>
              <div className="p-0">
                <table className="w-full text-sm text-left">
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-500 w-1/3">Capacity</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{product.capacity}</td>
                    </tr>
                    {Object.entries(product.specs).map(([key, value], index) => (
                      <tr key={key} className={index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                        <td className="px-6 py-4 font-medium text-gray-500 border-b border-gray-100 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </td>
                        <td className="px-6 py-4 text-gray-900 border-b border-gray-100">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-[#001f3f] mb-6">Key Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features?.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-3 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#001f3f] mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" /> 
                Documentation
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-[#001f3f] group">
                    <ArrowRight className="w-4 h-4 mr-2 text-gray-300 group-hover:text-[#001f3f]" />
                    Product Brochure (PDF)
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-[#001f3f] group">
                    <ArrowRight className="w-4 h-4 mr-2 text-gray-300 group-hover:text-[#001f3f]" />
                    Technical Drawing (DXF)
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center text-sm text-gray-600 hover:text-[#001f3f] group">
                    <ArrowRight className="w-4 h-4 mr-2 text-gray-300 group-hover:text-[#001f3f]" />
                    Installation Guide
                  </a>
                </li>
              </ul>
            </div>

            <div className="bg-[#001f3f] p-6 rounded-lg shadow-lg text-white">
              <h3 className="font-bold text-lg mb-2">Need a custom solution?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Our engineering team can modify this machine to meet your exact specifications.
              </p>
              <Button onClick={() => setOpen(true)} className="w-full bg-white text-[#001f3f] hover:bg-gray-100 font-bold">
                Contact Engineering
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
