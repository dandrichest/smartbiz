import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-left">
                    <span className="footer-logo">📦 SmartBiz</span>
                    <span className="footer-divider">|</span>
                    <span className="footer-copyright">© {currentYear} SmartBiz</span>
                </div>
                <div className="footer-right">
                    <Link to="/privacy">Privacy</Link>
                    <span className="footer-divider">|</span>
                    <Link to="/terms">Terms</Link>
                    <span className="footer-divider">|</span>
                    <Link to="/support">Support</Link>
                    <span className="footer-divider">|</span>
                    <span className="footer-version">v2.1.0</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;