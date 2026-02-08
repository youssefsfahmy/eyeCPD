import React from "react";
import { ThemeSwitcher } from "../theme-switcher";
import { Facebook, Twitter, LinkedIn, Email, Phone } from "@mui/icons-material";
import { Typography, IconButton } from "@mui/material";
import LogoColor from "../common/icons/logo-color";

function FooterNav() {
  const quickLinks = [
    { name: "Services", href: "/services" },
    { name: "Education", href: "/education" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ];

  const socialLinks = [
    { icon: <Facebook />, href: "https://facebook.com" },
    { icon: <Twitter />, href: "https://twitter.com" },
    { icon: <LinkedIn />, href: "https://linkedin.com" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="flex items-center md:items-start mb-4 space-x-2">
              <LogoColor size={150} className="mx-auto" />
            </div>
            <Typography
              variant="body2"
              className="mb-4 text-gray-600 dark:text-gray-300"
            >
              Professional development for optometrists
            </Typography>

            {/* Contact */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Email className="w-4 h-4" />
                <span>info@cpdoptometry.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <Typography
              variant="h6"
              className="mb-4 font-semibold text-gray-900 dark:text-white"
            >
              Quick Links
            </Typography>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => (
                <Typography
                  key={index}
                  // href={link.href}
                  className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {link.name}
                </Typography>
              ))}
            </div>
          </div>

          {/* Social & Theme */}
          <div>
            <Typography
              variant="h6"
              className="mb-4 font-semibold text-gray-900 dark:text-white"
            >
              Connect
            </Typography>
            <div className="flex items-center mb-4 space-x-3">
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  size="small"
                >
                  {social.icon}
                </IconButton>
              ))}
            </div>
            <ThemeSwitcher />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0">
            <Typography
              variant="body2"
              className="text-gray-500 dark:text-gray-400"
            >
              © {currentYear} CPD Optometry. All rights reserved.
            </Typography>
            <Typography variant="body2" className="text-xs text-gray-400">
              Powered by{" "}
              <a
                href="https://theblink.tech"
                target="_blank"
                className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
                rel="noreferrer"
              >
                The Blink ;{`)`}
              </a>
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterNav;
