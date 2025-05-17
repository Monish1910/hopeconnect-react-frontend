
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/hooks/use-toast";
import { supportApi } from '../services/api';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  donationType: z.enum(["oneTime", "monthly", "quarterly", "annual"], {
    required_error: "Please select a donation type",
  }),
  amount: z.number({
    required_error: "Amount is required",
    invalid_type_error: "Amount must be a number",
  }).min(1, { message: "Amount must be greater than 0" }),
});

type FormValues = z.infer<typeof formSchema>;

const SupportPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      donationType: "oneTime",
      amount: 1000,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Submit donation data to API
      await supportApi.donate(data);
      
      toast({
        title: "Thank you for your donation!",
        description: "Your contribution will help save lives across India.",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Failed to process donation:', error);
      toast({
        title: "Donation Failed",
        description: "We encountered an issue processing your donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Support Our Mission" 
        subtitle="Help us revolutionize organ donation in India" 
      />

      <div className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Introduction Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-12">
            <h2 className="text-2xl font-bold mb-4">Support HopeConnect's Mission</h2>
            <p className="text-gray-700 mb-6">
              Your support enables us to continue building technology that saves lives through 
              more efficient organ donation processes. Every contribution helps us expand our 
              network, improve our AI algorithms, and bring hope to thousands awaiting transplants.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="/placeholder.svg" 
                  alt="Supporting organ donation" 
                  className="rounded-lg shadow-md w-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Why Your Support Matters</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-blue mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Expand the donor network across more cities in India</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-blue mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Enhance our AI matching algorithms for better transplant outcomes</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-blue mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Provide better donor management tools to hospitals</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-medical-blue mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Fund awareness campaigns to increase donor registrations</span>
                  </li>
                </ul>
                
                <div className="mt-6">
                  <Button className="bg-medical-orange">Learn About Our Impact</Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Impact Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Our Impact So Far</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Donors Registered</span>
                    <span className="font-semibold">5,280</span>
                  </div>
                  <Progress value={53} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Hospitals Partnered</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <Progress value={84} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Successful Matches</span>
                    <span className="font-semibold">317</span>
                  </div>
                  <Progress value={32} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Lives Saved</span>
                    <span className="font-semibold">298</span>
                  </div>
                  <Progress value={30} className="h-2 bg-gray-200" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">How We Use Your Donations</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Technology Development</span>
                    <span className="font-semibold">40%</span>
                  </div>
                  <Progress value={40} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Awareness Programs</span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <Progress value={25} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Hospital Integration</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <Progress value={20} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Research</span>
                    <span className="font-semibold">10%</span>
                  </div>
                  <Progress value={10} className="h-2 bg-gray-200" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Administration</span>
                    <span className="font-semibold">5%</span>
                  </div>
                  <Progress value={5} className="h-2 bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Donation Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Make a Donation</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
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
                    name="donationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donation Type</FormLabel>
                        <FormControl>
                          <select
                            className="form-select"
                            {...field}
                            disabled={isSubmitting}
                          >
                            <option value="oneTime">One Time</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annual">Annual</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Donation Amount (₹)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                disabled={isSubmitting}
                                className="pl-8"
                              />
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                ₹
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.setValue('amount', 1000)}
                      >
                        ₹1,000
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.setValue('amount', 5000)}
                      >
                        ₹5,000
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.setValue('amount', 10000)}
                      >
                        ₹10,000
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.setValue('amount', 25000)}
                      >
                        ₹25,000
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-medical-orange"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Processing...
                    </span>
                  ) : (
                    "Make Donation"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
