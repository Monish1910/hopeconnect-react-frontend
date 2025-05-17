
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { donorApi, tokenApi } from '../services/api';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '../components/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';

interface DonorProfile {
  id: string;
  did: string;
  fullName: string;
  dob: string;
  bloodType: string;
  healthStatus: string;
  consentGivenStatus: boolean;
  specificOrgansToPledge: string[];
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  transplantId?: string;
}

interface TokenBalance {
  balance: number;
}

const DonorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [donorData, setDonorData] = useState<any>(null);
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [consentFile, setConsentFile] = useState<File | null>(null);
  const [consentDetails, setConsentDetails] = useState({
    agreed: false,
    hash: "",
  });

  // Fetch donor dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardResponse = await donorApi.getDashboard();
        setDonorData(dashboardResponse.data.donorProfile);
        setActivities(dashboardResponse.data.activities || []);
        
        // Fetch token balance
        const balanceResponse = await tokenApi.getBalance();
        setTokenBalance(balanceResponse.data);
      } catch (error) {
        console.error("Error fetching donor dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const handleConsentSubmit = async () => {
    if (!consentDetails.agreed) {
      toast({
        title: "Consent Required",
        description: "Please agree to the consent form.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real implementation, file would be uploaded to a server
      // For now, we'll just use the file name as a placeholder
      const consentData = {
        consentFormUrl: consentFile ? consentFile.name : "consent_form.pdf",
        consentDetailsHash: consentDetails.hash || "generated_hash_from_backend",
        consentGivenStatus: true,
      };

      await donorApi.submitConsent(consentData);

      toast({
        title: "Consent Submitted",
        description: "Your consent has been recorded successfully.",
      });

      // Update the local donor data
      if (donorData) {
        setDonorData({
          ...donorData,
          consentGivenStatus: true,
        });
      }
    } catch (error) {
      console.error("Error submitting consent:", error);
      toast({
        title: "Error",
        description: "Failed to submit consent. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Donor Dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-blue"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Donor Dashboard">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Donor Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Donor Profile</CardTitle>
            <CardDescription>Your donor information and status</CardDescription>
          </CardHeader>
          <CardContent>
            {donorData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p>{donorData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Blood Type</p>
                    <p>{donorData.bloodType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p>{format(new Date(donorData.dob), 'PPP')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Donor ID (DID)</p>
                    <p className="text-sm">{donorData.did}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Health Status</p>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      donorData.healthStatus === 'Approved' 
                        ? 'bg-green-100 text-green-800'
                        : donorData.healthStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {donorData.healthStatus || 'Pending Verification'}
                  </span>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Consent Status</p>
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      donorData.consentGivenStatus 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {donorData.consentGivenStatus ? 'Consent Given' : 'Pending Consent'}
                  </span>
                </div>
                
                {/* Pledged Organs */}
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Pledged Organs</p>
                  <div className="flex flex-wrap gap-2">
                    {donorData.specificOrgansToPledge && donorData.specificOrgansToPledge.map((organ: string) => (
                      <span
                        key={organ}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize"
                      >
                        {organ}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    Update Profile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No donor profile found</p>
                <Button 
                  className="mt-4 bg-medical-blue"
                  onClick={() => window.location.href = '/become-donor'}
                >
                  Complete Registration
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Token Balance and Consent Card */}
        <div className="space-y-6">
          {/* Token Balance */}
          <Card>
            <CardHeader>
              <CardTitle>HopeToken Balance</CardTitle>
              <CardDescription>Tokens earned through your contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-5xl font-bold text-medical-teal">
                  {tokenBalance ? tokenBalance.balance : '0'}
                </p>
                <p className="mt-2 text-gray-600">HopeTokens</p>
                
                <div className="mt-6">
                  <Button disabled={!tokenBalance || tokenBalance.balance <= 0}>
                    Redeem Tokens
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Consent Form */}
          <Card>
            <CardHeader>
              <CardTitle>Formal Consent</CardTitle>
              <CardDescription>
                {donorData && donorData.consentGivenStatus 
                  ? "Your consent has been recorded" 
                  : "Submit your formal consent to finalize donation pledge"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {donorData && donorData.consentGivenStatus ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Thank you for submitting your consent. Your pledge is now active.
                  </p>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-medical-blue">Submit Consent</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Donor Consent Form</DialogTitle>
                      <DialogDescription>
                        Please review and submit the formal consent for organ donation.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Upload Consent Form</label>
                        <Input 
                          type="file" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setConsentFile(e.target.files[0]);
                            }
                          }}
                        />
                        <p className="text-xs text-gray-500">
                          Upload a signed copy of the consent form (.pdf or .jpg)
                        </p>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="consent" 
                          checked={consentDetails.agreed}
                          onCheckedChange={(checked) => 
                            setConsentDetails({...consentDetails, agreed: checked === true})
                          }
                        />
                        <label htmlFor="consent" className="text-sm leading-relaxed">
                          I hereby consent to donate my organs as specified in my donor profile. 
                          I understand that this consent can be withdrawn at any time prior to donation.
                        </label>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-medical-blue"
                        onClick={handleConsentSubmit}
                      >
                        Submit Consent
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Activity Feed */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Updates related to your donations</CardDescription>
          </CardHeader>
          <CardContent>
            {activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start border-b pb-4 last:border-0">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{activity.description}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(activity.timestamp), 'PPp')}
                      </p>
                      {activity.transplantId && (
                        <a 
                          href={`/track-donation?id=${activity.transplantId}`} 
                          className="text-sm text-medical-blue hover:underline"
                        >
                          Track this donation
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DonorDashboard;
