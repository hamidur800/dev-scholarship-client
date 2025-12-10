import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="footer p-10 max-w-7xl mx-auto">
        <aside>
          <h2 className="text-2xl font-bold text-primary mb-4">ScholarStream</h2>
          <p className="max-w-xs">
            Connecting students with life-changing scholarship opportunities. 
            Simplifying the journey to financial aid for education.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="link link-hover"><FaFacebook className="text-xl" /></a>
            <a href="#" className="link link-hover"><FaTwitter className="text-xl" /></a>
            <a href="#" className="link link-hover"><FaLinkedin className="text-xl" /></a>
            <a href="#" className="link link-hover"><FaInstagram className="text-xl" /></a>
          </div>
        </aside>
        <nav>
          <h6 className="footer-title">Quick Links</h6>
          <Link to="/" className="link link-hover">Home</Link>
          <Link to="/all-scholarships" className="link link-hover">All Scholarships</Link>
          <Link to="/dashboard" className="link link-hover">Dashboard</Link>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About Us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Blog</a>
          <a className="link link-hover">FAQ</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of Use</a>
          <a className="link link-hover">Privacy Policy</a>
          <a className="link link-hover">Cookie Policy</a>
        </nav>
      </div>
      <div className="divider my-0"></div>
      <div className="footer footer-center p-4 text-base-content">
        <p>
          Copyright © {new Date().getFullYear()} ScholarStream. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
