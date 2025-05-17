
import React from 'react';
import PageHeader from '../components/PageHeader';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="About HopeConnect" 
        subtitle="Our mission, technology, and impact" 
      />

      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Mission Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-gray-700 mb-4">
                  HopeConnect aims to revolutionize organ donation in India by leveraging blockchain 
                  and AI technologies to create a transparent, efficient, and trustworthy ecosystem 
                  for organ donation and transplantation.
                </p>
                <p className="text-gray-700 mb-4">
                  India faces a critical organ shortage with over 500,000 patients waiting for transplants, 
                  while only 0.8 donations occur per million population. Our mission is to bridge this gap 
                  by creating technology that increases donor registrations, optimizes donor-recipient matching, 
                  and ensures full transparency throughout the transplant journey.
                </p>
              </div>
              <div>
                <img 
                  src="/placeholder.svg" 
                  alt="HopeConnect Mission" 
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
          
          {/* Technology Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Technology</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medical-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Blockchain Transparency</h3>
                  <p className="text-gray-700">
                    Our platform uses blockchain technology to create an immutable record of all 
                    organ donations and transplantations. Every step in the organ journey is recorded 
                    on the blockchain, ensuring full transparency and traceability.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medical-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI-Powered Matching</h3>
                  <p className="text-gray-700">
                    Our advanced AI algorithms consider multiple factors including blood type, 
                    tissue compatibility, organ size, patient urgency, and geographical proximity 
                    to find the most suitable matches for each patient awaiting transplantation.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medical-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Real-Time Tracking</h3>
                  <p className="text-gray-700">
                    Our platform provides real-time tracking of organ transportation, ensuring 
                    hospitals, patients, and families can monitor the status of donated organs 
                    throughout the journey from donor to recipient.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-medical-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Incentive Tokens</h3>
                  <p className="text-gray-700">
                    Our HopeToken system provides incentives to donors and families, which can be 
                    redeemed for various benefits while staying compliant with ethical guidelines 
                    and organ donation laws.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Team Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">Dr. Arjun Mehta</h3>
                <p className="text-gray-600">Founder, CEO</p>
                <p className="text-sm text-gray-500 mt-2">
                  Former transplant surgeon with over 15 years of experience in India's healthcare system.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">Priya Sharma</h3>
                <p className="text-gray-600">CTO</p>
                <p className="text-sm text-gray-500 mt-2">
                  Blockchain specialist with expertise in healthcare technology and secure systems.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                  <img 
                    src="/placeholder.svg" 
                    alt="Team Member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">Raj Kumar</h3>
                <p className="text-gray-600">Head of AI</p>
                <p className="text-sm text-gray-500 mt-2">
                  AI researcher specializing in medical applications and matching algorithms.
                </p>
              </div>
            </div>
          </div>
          
          {/* Impact Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4">
                <h3 className="text-3xl font-bold text-medical-blue">5,280</h3>
                <p className="text-gray-600">Donors Registered</p>
              </div>
              
              <div className="text-center p-4">
                <h3 className="text-3xl font-bold text-medical-blue">42</h3>
                <p className="text-gray-600">Hospital Partners</p>
              </div>
              
              <div className="text-center p-4">
                <h3 className="text-3xl font-bold text-medical-blue">317</h3>
                <p className="text-gray-600">Successful Matches</p>
              </div>
              
              <div className="text-center p-4">
                <h3 className="text-3xl font-bold text-medical-blue">298</h3>
                <p className="text-gray-600">Lives Saved</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold mb-4">Success Story</h3>
              <blockquote className="italic text-gray-700 mb-4">
                "When my wife needed a kidney transplant, we spent months searching for a suitable donor. 
                HopeConnect's AI matching system found a compatible donor within weeks, and the transparent 
                blockchain tracking gave us confidence throughout the process. Today, my wife is healthy and thriving."
              </blockquote>
              <p className="font-medium">- Rajesh Singh, Delhi</p>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Join Us in Making a Difference</h2>
            <p className="text-gray-700 max-w-2xl mx-auto mb-8">
              Whether you're interested in becoming a donor, partnering as a hospital, 
              or supporting our mission financially, there are many ways to help us 
              save more lives through efficient organ donation.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/become-donor">
                <Button className="bg-medical-blue">Become a Donor</Button>
              </Link>
              <Link to="/hospital-partners">
                <Button variant="outline" className="border-medical-blue text-medical-blue">
                  Hospital Partnership
                </Button>
              </Link>
              <Link to="/support-us">
                <Button className="bg-medical-orange">Support Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
