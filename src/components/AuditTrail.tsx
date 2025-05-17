
import React from 'react';
import { format } from 'date-fns';

interface StatusUpdate {
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
}

interface AuditTrailProps {
  statusHistory: StatusUpdate[];
}

const AuditTrail: React.FC<AuditTrailProps> = ({ statusHistory }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Audit Trail</h3>
      
      <div className="space-y-0">
        {statusHistory.map((update, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-medical-blue">{update.status}</h4>
              <p className="text-sm text-gray-500">
                {format(new Date(update.timestamp), 'MMM dd, yyyy - hh:mm a')}
              </p>
              <p className="mt-1 mb-2">
                <span className="font-medium">By:</span> {update.actor}
              </p>
              {update.notes && <p className="text-gray-700">{update.notes}</p>}
              
              {update.location && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Location: {update.location.lat}, {update.location.lng}
                  </p>
                  <div className="mt-2 bg-gray-100 rounded h-32 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Map placeholder</p>
                  </div>
                </div>
              )}
              
              {update.blockchainDetails && (
                <div className="mt-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <p className="text-xs font-medium mb-1">Blockchain Record</p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Hash:</span> {update.blockchainDetails.hash.substring(0, 10)}...
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">Previous Hash:</span> {update.blockchainDetails.previousHash.substring(0, 10)}...
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Signatures:</span> {update.blockchainDetails.signatures.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditTrail;
