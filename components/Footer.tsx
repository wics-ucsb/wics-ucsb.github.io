import Link from "next/link";
import { Mail } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/ucsb_wics/", icon: FaInstagram },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/women-in-computer-science-ucsb/", icon: FaLinkedin },
  { label: "Email", href: "mailto:ucsb.wics@gmail.com", icon: Mail },
];

const Footer = () => (
  <footer className="gradient-brand text-primary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display font-bold text-lg mb-3">WiCS UCSB</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            Women in Computer Science at UCSB
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Connect</h4>
          <div className="flex gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                className="p-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Stay Updated</h4>
          <p className="text-sm opacity-80 mb-3">Join our mailing list for the latest updates.</p>
          <Link
            href="/engage#join"
            className="inline-block text-sm px-4 py-2 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
          >
            Subscribe →
          </Link>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-primary-foreground/20 text-center text-sm opacity-60">
        © {new Date().getFullYear()} Women in Computer Science. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;