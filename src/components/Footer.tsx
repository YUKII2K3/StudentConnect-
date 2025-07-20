import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { ExternalLink, BookOpen, Users, Settings, FileText } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-4 md:px-6 bg-background border-t border-border">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          {/* Brand Section */}
          <div className="max-w-md">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="p-2 bg-gradient-primary rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Icons.studentConnect className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                StudentConnect
              </h2>
            </Link>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Crafted by{' '}
              <span className="text-primary font-semibold hover:text-primary-hover transition-colors">
                <a 
                  href="https://yuktheshwar.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  Yukii
                  <ExternalLink className="w-3 h-3" />
                </a>
              </span>
            </p>

            {/* Contact Section */}
            <div className="mb-8 space-y-3">
              <a
                href="mailto:yuktheshwarshali@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Icons.mail className="w-4 h-4" />
                <span className="text-sm">yuktheshwarshali@gmail.com</span>
              </a>
              <a
                href="mailto:yukiis.dev@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Icons.mail className="w-4 h-4" />
                <span className="text-sm">yukiis.dev@gmail.com</span>
              </a>
            </div>

            <p className="text-sm text-muted-foreground">
              © {currentYear} StudentConnect. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
            {/* App Pages */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Dashboard</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/dashboard" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Overview
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/tasks" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Tasks
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/notes" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Notes
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/settings" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://github.com/YUKII2K3" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.gitHub className="w-4 h-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://linkedin.com/in/yuktheshwar-mp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:yuktheshwarshali@gmail.com" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.mail className="w-4 h-4" />
                    Email
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/intent/tweet?text=Check%20out%20StudentConnect%20-%20A%20beautiful%20student%20productivity%20dashboard!%20Built%20by%20@Yukii" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <Icons.twitter className="w-4 h-4" />
                    Share
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://yuktheshwar.vercel.app/projects" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a 
                    href="https://yuktheshwar.vercel.app/blog" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a 
                    href="https://yuktheshwar.vercel.app/about" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a 
                    href="https://yuktheshwar.vercel.app/contact" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/license" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    MIT License
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Large Brand Name Section */}
        <div className="w-full flex mt-16 items-center justify-center">
          <h1 className="text-center text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground/20 to-foreground/5 select-none animate-pulse">
            StudentConnect
          </h1>
        </div>

        {/* Bottom Border */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Empowering students with productivity tools for academic success.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Crafted by Yukii</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;