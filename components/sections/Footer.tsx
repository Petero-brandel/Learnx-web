import Link from 'next/link';
import { FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-white text-2xl font-bold mb-4">Bluedemy</h3>
            <p className="text-sm leading-relaxed">
              Professional online learning platform for career growth and skill development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses" className="hover:text-white transition">All Courses</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-6 text-3xl">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/bluedemy/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@bluedemy.org-elearning"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500 transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@bluedemy.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
            </div>
            <p className="text-xs mt-8 text-gray-500">
              © {new Date().getFullYear()} Bluedemy. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
