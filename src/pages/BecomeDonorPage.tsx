
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { donorApi } from '../services/api';
import { useToast } from "@/hooks/use-toast";
import PageHeader from '../components/PageHeader';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Form schema for donor registration
const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  dob: z.date({
    required_error: "Date of birth is required",
  }),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], {
    required_error: "Blood type is required",
  }),
  contactInfo: z.object({
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
    address: z.string().min(5, { message: "Address is required" }),
  }),
  organsToPledge: z.object({
    heart: z.boolean().optional(),
    lungs: z.boolean().optional(),
    liver: z.boolean().optional(),
    kidneys: z.boolean().optional(),
    pancreas: z.boolean().optional(),
    intestines: z.boolean().optional(),
    corneas: z.boolean().optional(),
    skin: z.boolean().optional(),
    bone: z.boolean().optional(),
  }).refine(data => 
    Object.values(data).some(value => value === true), 
    { message: "Please select at least one organ to pledge" }
  ),
  initialConsent: z.boolean().refine(val => val === true, {
    message: "You must consent to organ donation",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const BecomeDonorPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: user?.name || "",
      dob: undefined,
      bloodType: undefined,
      contactInfo: {
        phone: "",
        address: "",
      },
      organsToPledge: {
        heart: false,
        lungs: false,
        liver: false,
        kidneys: false,
        pancreas: false,
        intestines: false,
        corneas: false,
        skin: false,
        bone: false,
      },
      initialConsent: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    // Transform data to match API expectations
    const specificOrgansToPledge = Object.entries(data.organsToPledge)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    const donorData = {
      fullName: data.fullName,
      dob: data.dob.toISOString(),
      bloodType: data.bloodType,
      contactInfo: data.contactInfo,
      specificOrgansToPledge,
      initialConsent: data.initialConsent,
    };

    try {
      setIsSubmitting(true);
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please log in or create an account to register as a donor.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      // Submit data to API
      const response = await donorApi.registerProfile(donorData);
      
      toast({
        title: "Registration Successful",
        description: "Thank you for registering as an organ donor! You've taken the first step in saving lives.",
      });
      
      // Redirect to donor dashboard
      navigate('/donor-dashboard');
    } catch (error: any) {
      console.error('Failed to register donor:', error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Failed to register as donor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Become an Organ Donor" 
        subtitle="Register to help save lives through organ donation" 
      />

      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Sidebar info */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Why Become a Donor?</h3>
              <p className="mb-4 text-gray-700">
                By registering as an organ donor, you have the potential to save up to 8 lives 
                and enhance the lives of over 50 people.
              </p>
              
              <h3 className="text-lg font-semibold mb-2 mt-6">What Happens After Registration?</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>Your profile is securely stored on our blockchain</li>
                <li>You'll receive a digital donor card</li>
                <li>You'll be asked to complete a formal consent process</li>
                <li>You can update your preferences anytime</li>
              </ol>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
                <h4 className="font-semibold text-medical-blue mb-2">Your data is secure</h4>
                <p className="text-sm text-gray-700">
                  HopeConnect uses blockchain technology to ensure your data is secure, 
                  transparent, and tamper-proof.
                </p>
              </div>
            </div>
          </div>
          
          {/* Registration form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Donor Registration Form</h2>
              
              {!isAuthenticated && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-amber-700">
                    <strong>Note:</strong> You need to be logged in to complete registration. 
                    <Button 
                      variant="link" 
                      className="p-0 ml-1 text-medical-blue"
                      onClick={() => navigate('/login')}
                    >
                      Login or create an account
                    </Button>
                  </p>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Details Section */}
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                    </div>
                    
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
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date of Birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bloodType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Blood Type</FormLabel>
                          <FormControl>
                            <select
                              className="form-select"
                              {...field}
                              disabled={isSubmitting}
                            >
                              <option value="">Select Blood Type</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="contactInfo.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="md:col-span-2">
                      <FormField
                        control={form.control}
                        name="contactInfo.address"
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
                    
                    {/* Organs Section */}
                    <div className="md:col-span-2 mt-4">
                      <h3 className="text-lg font-semibold mb-4">Organs to Pledge</h3>
                      <p className="text-gray-600 mb-4">
                        Select the organs you wish to donate. You can update this selection later.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="organsToPledge.heart"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel>Heart</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="organsToPledge.lungs"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel>Lungs</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="organsToPledge.liver"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel>Liver</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="organsToPledge.kidneys"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel>Kidneys</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="organsToPledge.pancreas"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel>Pancreas</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="organsToPledge.intestines"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel>Intestines</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="organsToPledge.corneas"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel>Corneas</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="organsToPledge.skin"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel>Skin</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="organsToPledge.bone"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormLabel>Bone</FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      {form.formState.errors.organsToPledge && (
                        <p className="text-red-500 text-sm mt-2">
                          {form.formState.errors.organsToPledge.message}
                        </p>
                      )}
                    </div>
                    
                    {/* Consent Section */}
                    <div className="md:col-span-2 mt-4">
                      <FormField
                        control={form.control}
                        name="initialConsent"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I consent to organ donation and understand that my data will be securely stored
                              </FormLabel>
                              <FormDescription>
                                You can withdraw consent at any time through your donor dashboard.
                                A formal consent process will follow after registration.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-medical-blue text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                        Registering...
                      </span>
                    ) : (
                      "Register as a Donor"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeDonorPage;
