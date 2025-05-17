
import React from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-medical-blue to-medical-teal text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Revolutionizing Organ Donation in India
              </h1>
              <p className="text-xl mb-8">
                Using cutting-edge blockchain technology and AI to bring transparency, 
                efficiency and hope to the organ donation ecosystem.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/become-donor">
                  <Button size="lg" className="bg-medical-orange text-white hover:bg-opacity-90">
                    Get Started
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-medical-blue">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="/placeholder.svg" 
                alt="Medical professionals collaborating" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The Organ Shortage Crisis</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard 
              value="500,000+" 
              label="Patients Waiting for Organs" 
            />
            <StatCard 
              value="0.8" 
              label="Donations per Million Population" 
            />
            <StatCard 
              value="17" 
              label="Lives Lost Daily While Waiting" 
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How HopeConnect Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-medical-blue rounded-full text-white flex items-center justify-center mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3">Register as a Donor</h3>
              <p className="text-gray-700">
                Create your secure donor profile, specifying which organs you wish to pledge.
                Your data is secured on our blockchain.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-medical-teal rounded-full text-white flex items-center justify-center mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Matching</h3>
              <p className="text-gray-700">
                Our advanced AI algorithm matches donors with recipients based on medical compatibility and urgency.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-medical-orange rounded-full text-white flex items-center justify-center mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3">Transparent Tracking</h3>
              <p className="text-gray-700">
                Follow the entire journey of organ donation with our blockchain-based tracking system.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/become-donor">
              <Button size="lg" className="bg-medical-blue text-white hover:bg-opacity-90">
                Become a Donor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-medical-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of other donors who are helping save lives across India.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/become-donor">
              <Button size="lg" className="bg-white text-medical-blue hover:bg-gray-100">
                Pledge Your Organs
              </Button>
            </Link>
            <Link to="/hospital-partners">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-medical-blue">
                Hospital Partnership
              </Button>
            </Link>
            <Link to="/support-us">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-medical-blue">
                Support Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
