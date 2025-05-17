
import React from 'react';
import PageHeader from '../components/PageHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { partnershipApi } from '../services/api';

const formSchema = z.object({
  hospitalName: z.string().min(2, "Hospital name is required"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  hospitalType: z.string().min(2, "Hospital type is required"),
  address: z.string().min(5, "Address is required"),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const HospitalPartners = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalName: "",
      contactPerson: "",
      email: "",
      phone: "",
      hospitalType: "",
      address: "",
      additionalInfo: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Submit data to API
      await partnershipApi.registerInterest(data);
      
      toast({
        title: "Registration Successful",
        description: "Thank you for your interest. Our team will contact you shortly.",
      });
      
      form.reset();
    } catch (error) {
      console.error('Failed to register interest:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Hospital Partners" 
        subtitle="Join our network of hospital partners and help save lives" 
      />

      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Introduction Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Partner With HopeConnect</h2>
            <p className="text-gray-700 mb-6">
              HopeConnect partners with hospitals across India to streamline the organ donation and 
              transplantation process. Our blockchain and AI-powered platform helps hospitals match 
              donors with recipients more efficiently and tracks the entire transplant journey with 
              unprecedented transparency.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button className="bg-medical-blue">
                Watch Demo
              </Button>
              <Button variant="outline" className="border-medical-blue text-medical-blue">
                Download Information Pack
              </Button>
            </div>
          </div>
          
          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Streamlined Process</h3>
              <p className="text-gray-600">
                Reduce administrative burden with our digital platform that handles everything from donor matching to transplant logistics.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medical-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enhanced Trust</h3>
              <p className="text-gray-600">
                Build confidence with patients through our transparent blockchain tracking system that ensures accountability at every step.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medical-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-gray-600">
                Leverage our advanced AI algorithm to find the best possible organ matches for your patients, improving transplant outcomes.
              </p>
            </div>
          </div>
          
          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-12">
            <h2 className="text-2xl font-bold mb-6">Hospital Registration Form</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="hospitalName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Person</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isSubmitting} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hospitalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital Type</FormLabel>
                        <FormControl>
                          <select
                            className="form-select"
                            {...field}
                            disabled={isSubmitting}
                          >
                            <option value="">Select Hospital Type</option>
                            <option value="Government">Government</option>
                            <option value="Private">Private</option>
                            <option value="Trust">Trust / Nonprofit</option>
                            <option value="University">University / Teaching</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Any specific interests or questions..."
                              disabled={isSubmitting}
                              className="h-24"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-medical-blue"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Submitting...
                    </span>
                  ) : (
                    "Register Interest"
                  )}
                </Button>
              </form>
            </Form>
          </div>
          
          {/* Success Story */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Partner Hospital Success Story</h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="/placeholder.svg" 
                  alt="AIIMS Hospital" 
                  className="rounded-lg shadow-md w-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AIIMS Delhi</h3>
                <p className="text-gray-700 mb-4">
                  Since partnering with HopeConnect, AIIMS Delhi has seen a 40% increase in successful organ matches
                  and a 25% reduction in transplant processing time.
                </p>
                <blockquote className="border-l-4 border-medical-blue pl-4 italic text-gray-600 mb-4">
                  "HopeConnect's platform has revolutionized how we approach organ transplantation. 
                  The AI-powered matching system has been instrumental in finding compatible donors more quickly, 
                  and the blockchain tracking gives our patients peace of mind."
                </blockquote>
                <p className="font-medium">- Dr. Sanjeev Kumar, Head of Transplantation</p>
                
                <Button 
                  variant="link" 
                  className="p-0 mt-2 text-medical-blue"
                >
                  Read Full Case Study
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalPartners;
