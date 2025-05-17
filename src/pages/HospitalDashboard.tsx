
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { hospitalApi } from '../services/api';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';

interface OrganRequest {
  id: string;
  patientName: string;
  patientId: string;
  requiredOrganType: string;
  criticalityScore: number;
  bloodType: string;
  status: string;
  createdAt: string;
}

interface DonorMatch {
  id: string;
  donorId: string;
  donorName: string;
  bloodType: string;
  age: number;
  organType: string;
  compatibilityScore: number;
  healthScore: number;
  location: string;
  matchingFactors: {
    bloodTypeMatch: boolean;
    sizeMatch: boolean;
    tissueMatch: boolean;
    ageMatch: boolean;
    urgencyMatch: boolean;
  };
}

interface TransplantLog {
  id: string;
  donorId: string;
  donorName: string;
  patientId: string;
  patientName: string;
  organType: string;
  status: string;
  createdAt: string;
}

// Form schema for update donor health
const donorHealthSchema = z.object({
  donorId: z.string().min(1, "Donor ID is required"),
  healthCheckPassed: z.boolean().default(false),
  healthScore: z.number().min(0).max(100),
  notes: z.string().optional(),
});

// Form schema for organ request
const organRequestSchema = z.object({
  patientName: z.string().min(2, "Patient name is required"),
  patientId: z.string().min(1, "Patient ID is required"),
  requiredOrganType: z.string().min(1, "Organ type is required"),
  bloodType: z.string().min(1, "Blood type is required"),
  criticalityScore: z.number().min(1).max(10, "Criticality must be between 1-10"),
  patientDetails: z.string().optional(),
});

const HospitalDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("update-donor");
  const [organRequests, setOrganRequests] = useState<OrganRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [donorMatches, setDonorMatches] = useState<DonorMatch[]>([]);
  const [transplantLogs, setTransplantLogs] = useState<TransplantLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const donorHealthForm = useForm<z.infer<typeof donorHealthSchema>>({
    resolver: zodResolver(donorHealthSchema),
    defaultValues: {
      donorId: "",
      healthCheckPassed: false,
      healthScore: 0,
      notes: "",
    },
  });
  
  const organRequestForm = useForm<z.infer<typeof organRequestSchema>>({
    resolver: zodResolver(organRequestSchema),
    defaultValues: {
      patientName: "",
      patientId: "",
      requiredOrganType: "",
      bloodType: "",
      criticalityScore: 5,
      patientDetails: "",
    },
  });

  // Fetch organ requests on component mount
  useEffect(() => {
    if (activeTab === 'view-requests') {
      fetchOrganRequests();
    } else if (activeTab === 'manage-transplants') {
      fetchTransplantLogs();
    }
  }, [activeTab]);

  const fetchOrganRequests = async () => {
    setIsLoading(true);
    try {
      // This endpoint needs to be implemented in the backend
      const response = await fetch('http://localhost:3001/api/hospital/organ-requests');
      const data = await response.json();
      setOrganRequests(data);
    } catch (error) {
      console.error("Error fetching organ requests:", error);
      toast({
        title: "Error",
        description: "Failed to load organ requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDonorMatches = async (organRequestId: string) => {
    setIsLoading(true);
    try {
      const response = await hospitalApi.findMatches(organRequestId);
      setDonorMatches(response.data);
      setSelectedRequest(organRequestId);
    } catch (error) {
      console.error("Error fetching donor matches:", error);
      toast({
        title: "Error",
        description: "Failed to load donor matches",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransplantLogs = async () => {
    setIsLoading(true);
    try {
      // This endpoint needs to be implemented in the backend
      const response = await fetch('http://localhost:3001/api/hospital/transplant-logs');
      const data = await response.json();
      setTransplantLogs(data || []);
    } catch (error) {
      console.error("Error fetching transplant logs:", error);
      toast({
        title: "Error",
        description: "Failed to load transplant logs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDonorHealth = async (data: z.infer<typeof donorHealthSchema>) => {
    try {
      setIsLoading(true);
      await hospitalApi.updateDonorHealth(data.donorId, {
        healthCheckPassed: data.healthCheckPassed,
        healthScoreAIGiven: data.healthScore,
        notes: data.notes,
      });
      
      toast({
        title: "Success",
        description: "Donor health record updated successfully",
      });
      
      donorHealthForm.reset();
    } catch (error) {
      console.error("Error updating donor health:", error);
      toast({
        title: "Error",
        description: "Failed to update donor health record",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOrganRequest = async (data: z.infer<typeof organRequestSchema>) => {
    try {
      setIsLoading(true);
      await hospitalApi.requestOrgan({
        patient: {
          name: data.patientName,
          id: data.patientId,
          bloodType: data.bloodType,
          details: data.patientDetails,
        },
        requiredOrganType: data.requiredOrganType,
        criticalityScore: data.criticalityScore,
      });
      
      toast({
        title: "Success",
        description: "Organ request submitted successfully",
      });
      
      // Reset form and switch to view requests
      organRequestForm.reset();
      setActiveTab('view-requests');
      fetchOrganRequests();
    } catch (error) {
      console.error("Error submitting organ request:", error);
      toast({
        title: "Error",
        description: "Failed to submit organ request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initiateTransplant = async (donorId: string) => {
    if (!selectedRequest) return;
    
    try {
      setIsLoading(true);
      await hospitalApi.initiateTransplant({
        organRequestId: selectedRequest,
        donorId: donorId,
      });
      
      toast({
        title: "Success",
        description: "Transplant process initiated successfully",
      });
      
      // Switch to manage transplants tab
      setActiveTab('manage-transplants');
      fetchTransplantLogs();
    } catch (error) {
      console.error("Error initiating transplant:", error);
      toast({
        title: "Error",
        description: "Failed to initiate transplant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recordRecovery = async (transplantLogId: string) => {
    try {
      setIsLoading(true);
      await hospitalApi.recordRecovery(transplantLogId, {
        recoveryStatus: "Completed",
        recoveryNotes: "Organ recovered successfully",
      });
      
      toast({
        title: "Success",
        description: "Organ recovery recorded successfully",
      });
      
      fetchTransplantLogs();
    } catch (error) {
      console.error("Error recording recovery:", error);
      toast({
        title: "Error",
        description: "Failed to record recovery",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const recordCompletion = async (transplantLogId: string) => {
    try {
      setIsLoading(true);
      await hospitalApi.recordCompletion(transplantLogId, {
        completionStatus: "Successful",
        completionNotes: "Transplant completed successfully",
      });
      
      toast({
        title: "Success",
        description: "Transplant completion recorded successfully",
      });
      
      fetchTransplantLogs();
    } catch (error) {
      console.error("Error recording completion:", error);
      toast({
        title: "Error",
        description: "Failed to record completion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      id: "update-donor",
      label: "Update Donor Health",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Update Donor Health Record</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...donorHealthForm}>
              <form onSubmit={donorHealthForm.handleSubmit(handleUpdateDonorHealth)} className="space-y-6">
                <FormField
                  control={donorHealthForm.control}
                  name="donorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donor ID (DID or DB ID)</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={donorHealthForm.control}
                    name="healthCheckPassed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                            className="form-checkbox"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Health Check Passed</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={donorHealthForm.control}
                    name="healthScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Health Score (0-100)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0} 
                            max={100} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={donorHealthForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter any relevant health notes..."
                          disabled={isLoading}
                          className="h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="bg-medical-blue"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Updating...
                    </span>
                  ) : (
                    "Update Health Record"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "new-request",
      label: "New Organ Request",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Submit New Organ Request</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...organRequestForm}>
              <form onSubmit={organRequestForm.handleSubmit(handleSubmitOrganRequest)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={organRequestForm.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={organRequestForm.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient ID</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={organRequestForm.control}
                    name="requiredOrganType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Organ Type</FormLabel>
                        <FormControl>
                          <select
                            className="form-select"
                            {...field}
                            disabled={isLoading}
                          >
                            <option value="">Select Organ Type</option>
                            <option value="heart">Heart</option>
                            <option value="lungs">Lungs</option>
                            <option value="liver">Liver</option>
                            <option value="kidneys">Kidneys</option>
                            <option value="pancreas">Pancreas</option>
                            <option value="intestines">Intestines</option>
                            <option value="corneas">Corneas</option>
                            <option value="skin">Skin</option>
                            <option value="bone">Bone</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={organRequestForm.control}
                    name="bloodType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Type</FormLabel>
                        <FormControl>
                          <select
                            className="form-select"
                            {...field}
                            disabled={isLoading}
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
                    control={organRequestForm.control}
                    name="criticalityScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Criticality Score (1-10)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={10} 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={organRequestForm.control}
                      name="patientDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter any relevant patient details..."
                              disabled={isLoading}
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
                  className="bg-medical-blue"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Organ Request"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "view-requests",
      label: "View Requests & Matches",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Organ Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && !selectedRequest ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-blue"></div>
                </div>
              ) : organRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left bg-gray-50 border-b">
                        <th className="p-2">Patient</th>
                        <th className="p-2">Organ Type</th>
                        <th className="p-2">Blood Type</th>
                        <th className="p-2">Criticality</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Created</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organRequests.map((request) => (
                        <tr key={request.id} className="border-b">
                          <td className="p-2">{request.patientName}</td>
                          <td className="p-2 capitalize">{request.requiredOrganType}</td>
                          <td className="p-2">{request.bloodType}</td>
                          <td className="p-2">{request.criticalityScore}</td>
                          <td className="p-2">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === 'Pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : request.status === 'Matched'
                                  ? 'bg-blue-100 text-blue-800'
                                  : request.status === 'Allocated'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="p-2 text-sm">
                            {format(new Date(request.createdAt), 'dd MMM yyyy')}
                          </td>
                          <td className="p-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => fetchDonorMatches(request.id)}
                              disabled={request.status !== 'Pending'}
                            >
                              Find Matches
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No organ requests found</p>
                  <Button 
                    className="mt-4 bg-medical-blue"
                    onClick={() => setActiveTab('new-request')}
                  >
                    Create New Request
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedRequest && donorMatches.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Potential Donor Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Matching Factors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-blue-50 p-3 rounded-md text-center">
                      <p className="text-xs text-gray-500">Blood Type</p>
                      <p className="font-medium">Match</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md text-center">
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="font-medium">Match</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md text-center">
                      <p className="text-xs text-gray-500">Tissue</p>
                      <p className="font-medium">Match</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md text-center">
                      <p className="text-xs text-gray-500">Age</p>
                      <p className="font-medium">Match</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md text-center">
                      <p className="text-xs text-gray-500">Urgency</p>
                      <p className="font-medium">High</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Ranked Donor Matches</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left bg-gray-50 border-b">
                        <th className="p-2">Donor</th>
                        <th className="p-2">Blood Type</th>
                        <th className="p-2">Age</th>
                        <th className="p-2">Organ</th>
                        <th className="p-2">Compatibility</th>
                        <th className="p-2">Health Score</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donorMatches.map((match) => (
                        <tr key={match.id} className="border-b">
                          <td className="p-2">{match.donorName}</td>
                          <td className="p-2">{match.bloodType}</td>
                          <td className="p-2">{match.age}</td>
                          <td className="p-2 capitalize">{match.organType}</td>
                          <td className="p-2">{match.compatibilityScore}%</td>
                          <td className="p-2">{match.healthScore}%</td>
                          <td className="p-2">{match.location}</td>
                          <td className="p-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" className="bg-medical-blue">
                                  Select
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Confirm Donor Selection</DialogTitle>
                                  <DialogDescription>
                                    You are about to initiate a transplant process with this donor.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <h4 className="font-medium">Match Details:</h4>
                                  <ul className="mt-2 space-y-1">
                                    <li><strong>Donor:</strong> {match.donorName}</li>
                                    <li><strong>Compatibility Score:</strong> {match.compatibilityScore}%</li>
                                    <li><strong>Health Score:</strong> {match.healthScore}%</li>
                                    <li><strong>Organ:</strong> {match.organType}</li>
                                  </ul>
                                </div>
                                <DialogFooter>
                                  <Button 
                                    className="bg-medical-blue"
                                    onClick={() => initiateTransplant(match.donorId)}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? "Processing..." : "Confirm Selection"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: "manage-transplants",
      label: "Manage Active Transplants",
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Active Transplant Processes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-medical-blue"></div>
              </div>
            ) : transplantLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left bg-gray-50 border-b">
                      <th className="p-2">Tracking ID</th>
                      <th className="p-2">Donor</th>
                      <th className="p-2">Patient</th>
                      <th className="p-2">Organ</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Created</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transplantLogs.map((log) => (
                      <tr key={log.id} className="border-b">
                        <td className="p-2 font-mono text-sm">{log.id}</td>
                        <td className="p-2">{log.donorName}</td>
                        <td className="p-2">{log.patientName}</td>
                        <td className="p-2 capitalize">{log.organType}</td>
                        <td className="p-2">
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              log.status === 'Initiated' 
                                ? 'bg-blue-100 text-blue-800' 
                                : log.status === 'RecoveryCompleted'
                                ? 'bg-yellow-100 text-yellow-800'
                                : log.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="p-2 text-sm">
                          {format(new Date(log.createdAt), 'dd MMM yyyy')}
                        </td>
                        <td className="p-2">
                          {log.status === 'Initiated' ? (
                            <Button 
                              size="sm" 
                              onClick={() => recordRecovery(log.id)}
                              disabled={isLoading}
                            >
                              Record Recovery
                            </Button>
                          ) : log.status === 'RecoveryCompleted' ? (
                            <Button 
                              size="sm"
                              onClick={() => recordCompletion(log.id)}
                              disabled={isLoading}
                            >
                              Record Completion
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(`/track-donation?id=${log.id}`, '_blank')}
                            >
                              View Details
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No active transplant processes</p>
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <DashboardLayout 
      title="Hospital Dashboard" 
      tabs={tabs}
      showTabs={true}
      defaultTab={activeTab}
    />
  );
};

export default HospitalDashboard;
