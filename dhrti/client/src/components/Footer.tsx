import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card text-card-foreground transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
              <Recycle className="h-5 w-5 text-primary" />
              <span>Dhrti</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Dhrti is a B2B marketplace bridging the gap between plastic waste suppliers and verified recyclers/manufacturers. We aim to power a circular economy for plastic waste materials.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/mission" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Mission
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Partners</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/suppliers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  For Suppliers
                </Link>
              </li>
              <li>
                <Link to="/buyers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  For Buyers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Block */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                <span>101 Circular Road, Green Tech Park, IN</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4.5 w-4.5 text-primary shrink-0" />
                <a href="mailto:support@dhrti.com" className="hover:text-primary transition-colors">support@dhrti.com</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4.5 w-4.5 text-primary shrink-0" />
                <span className="hover:text-primary transition-colors">+91 98765 43210</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Panel */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Dhrti Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
