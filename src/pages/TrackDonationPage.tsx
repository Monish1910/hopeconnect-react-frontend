
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { trackingApi } from '../services/api';
import { useToast } from "@/hooks/use-toast";
import PageHeader from '../components/PageHeader';
import AuditTrail from '../components/AuditTrail';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TransplantLog {
  id: string;
  donorId: string;
  donorName: string;
  patientId: string;
  patientName: string;
  organType: string;
  status: string;
  createdAt: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    actor: string;
    notes: string;
    location?: {
      lat: number;
      lng: number;
    };
    blockchainDetails?: {
      hash: string;
      previousHash: string;
      signatures: string[];
    };
  }>;
}

const TrackDonationPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [trackingId, setTrackingId] = useState('');
  const [transplantLog, setTransplantLog] = useState<TransplantLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  
  // Check URL parameters for tracking ID
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');
    
    if (idParam) {
      setTrackingId(idParam);
      handleSearch(idParam);
    }
  }, [location]);

  const handleSearch = async (id?: string) => {
    const searchId = id || trackingId;
    
    if (!searchId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a tracking ID",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      setSearchAttempted(true);
      
      const response = await trackingApi.getTransplantLog(searchId);
      setTransplantLog(response.data);
    } catch (error) {
      console.error("Error fetching transplant log:", error);
      setTransplantLog(null);
      toast({
        title: "Error",
        description: "Failed to find transplant record. Please check the tracking ID and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="Track Donation" 
        subtitle="Follow the journey of organ donations in real-time" 
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Donation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Enter Tracking ID or Donor ID"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="bg-medical-blue"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Enter the Tracking ID provided to you, or the Donor ID to see all donations.
              </p>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-blue"></div>
            </div>
          ) : searchAttempted && !transplantLog ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-gray-400 mx-auto mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Record Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any transplant record with the provided ID. 
                Please check the ID and try again.
              </p>
            </div>
          ) : transplantLog ? (
            <div className="space-y-8">
              {/* Donation Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Donation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Tracking Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Tracking ID:</span>
                          <span className="font-mono">{transplantLog.id}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Organ Type:</span>
                          <span className="capitalize">{transplantLog.organType}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Current Status:</span>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transplantLog.status === 'Initiated' 
                                ? 'bg-blue-100 text-blue-800'
                                : transplantLog.status === 'RecoveryCompleted'
                                ? 'bg-yellow-100 text-yellow-800'
                                : transplantLog.status === 'Completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {transplantLog.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Participants</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Donor:</span>
                          <span>{transplantLog.donorName}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Donor ID:</span>
                          <span className="font-mono">{transplantLog.donorId.substring(0, 12)}...</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-gray-600">Recipient:</span>
                          <span>{transplantLog.patientName}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Audit Trail */}
              <AuditTrail statusHistory={transplantLog.statusHistory} />
              
              {/* Blockchain Verification */}
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    This transplant record is secured on the blockchain for maximum transparency and security.
                    Each status update is hashed and linked to create an immutable record of the organ's journey.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-md border">
                    <h4 className="font-medium mb-2">Verify on Blockchain Explorer</h4>
                    <p className="text-sm text-gray-500 mb-2">
                      You can verify this transaction on the blockchain explorer using the transaction hash.
                    </p>
                    <Button variant="outline">View on Blockchain Explorer</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TrackDonationPage;
