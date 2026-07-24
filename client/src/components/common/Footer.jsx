/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import { FaBox, FaHeart, FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import "../../styles/Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = "v2.1.0";

  return (
    <footer className="ft">
      <div className="ft-inner">
        {/* Left: Brand & Copyright */}
        <div className="ft-left">
          <div className="ft-brand">
            <div className="ft-brand-icon">
              <FaBox />
            </div>
            <span className="ft-brand-name">SmartBiz</span>
          </div>
          <span className="ft-separator" />
          <span className="ft-copyright">
            © {currentYear} SmartBiz. Made for business owners
          </span>
        </div>

        {/* Right: Links & Version */}
        <div className="ft-right">
          <nav className="ft-links">
            <Link to="/privacy" className="ft-link">
              Privacy
            </Link>
            <Link to="/terms" className="ft-link">
              Terms
            </Link>
            <Link to="/support" className="ft-link">
              Support
            </Link>
          </nav>

          <span className="ft-separator" />

          <div className="ft-socials">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ft-social"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ft-social"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ft-social"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>

          <span className="ft-separator" />

          <span className="ft-version">
            <span className="ft-version-dot" />
            {appVersion}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;