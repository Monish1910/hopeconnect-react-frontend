
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'donor':
        return '/donor-dashboard';
      case 'hospital_staff':
      case 'admin':
        return '/hospital-dashboard';
      case 'logistics_provider':
        return '/logistics-dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-medical-blue">HopeConnect</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-medical-blue transition-colors">
              Home
            </Link>
            <Link to="/become-donor" className="text-gray-700 hover:text-medical-blue transition-colors">
              Become a Donor
            </Link>
            <Link to="/hospital-partners" className="text-gray-700 hover:text-medical-blue transition-colors">
              Hospital Partners
            </Link>
            <Link to="/support-us" className="text-gray-700 hover:text-medical-blue transition-colors">
              Support Us
            </Link>
            <Link to="/track-donation" className="text-gray-700 hover:text-medical-blue transition-colors">
              Track Donation
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-medical-blue transition-colors">
              About
            </Link>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white">
                    {user?.name || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="font-medium text-sm">
                    Signed in as {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(getDashboardLink())}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-medical-blue text-white hover:bg-opacity-90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t mt-2">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-medical-blue py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/become-donor" 
                className="text-gray-700 hover:text-medical-blue py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Become a Donor
              </Link>
              <Link 
                to="/hospital-partners" 
                className="text-gray-700 hover:text-medical-blue py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Hospital Partners
              </Link>
              <Link 
                to="/support-us" 
                className="text-gray-700 hover:text-medical-blue py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Support Us
              </Link>
              <Link 
                to="/track-donation" 
                className="text-gray-700 hover:text-medical-blue py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Track Donation
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-medical-blue py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {/* Auth Links for Mobile */}
              {isAuthenticated ? (
                <>
                  <Link 
                    to={getDashboardLink()} 
                    className="text-medical-blue hover:underline py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-red-600 hover:underline py-2 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-medical-blue hover:underline py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-medical-blue text-white py-2 px-4 rounded text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
