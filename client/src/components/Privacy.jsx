import { FaShieldAlt, FaLock, FaDatabase, FaCookie, FaEnvelope, FaUserSecret } from 'react-icons/fa';
import '../styles/Privacy.css';

const Privacy = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="privacy-container">
            <div className="privacy-card">
                <div className="privacy-header">
                    <div className="privacy-header-icon">
                        <FaShieldAlt />
                    </div>
                    <h1>Privacy Policy</h1>
                    <p>Last Updated: {currentYear}</p>
                </div>

                <div className="privacy-content">
                    <div className="privacy-section">
                        <div className="privacy-section-icon">
                            <FaLock />
                        </div>
                        <div className="privacy-section-content">
                            <h2>Information We Collect</h2>
                            <p>
                                SmartBiz collects information to provide better services to all our users. 
                                We collect information you provide directly, such as your name, email address, 
                                phone number, and company details when you create an account or use our services.
                            </p>
                            <ul>
                                <li>Account information (name, email, phone)</li>
                                <li>Business information (company name, address)</li>
                                <li>Transaction data and purchase history</li>
                                <li>Usage data and analytics</li>
                            </ul>
                        </div>
                    </div>

                    <div className="privacy-section">
                        <div className="privacy-section-icon">
                            <FaUserSecret />
                        </div>
                        <div className="privacy-section-content">
                            <h2>How We Use Your Information</h2>
                            <p>
                                We use the information we collect to provide, maintain, and improve our services, 
                                as well as to protect the security of our platform.
                            </p>
                            <ul>
                                <li>Process transactions and manage inventory</li>
                                <li>Send important updates and notifications</li>
                                <li>Analyze usage patterns to improve our services</li>
                                <li>Provide customer support and respond to inquiries</li>
                            </ul>
                        </div>
                    </div>

                    <div className="privacy-section">
                        <div className="privacy-section-icon">
                            <FaDatabase />
                        </div>
                        <div className="privacy-section-content">
                            <h2>Data Security</h2>
                            <p>
                                We take data security seriously. We implement appropriate technical and organizational 
                                measures to protect your personal information against unauthorized access, alteration, 
                                disclosure, or destruction.
                            </p>
                            <ul>
                                <li>End-to-end encryption for sensitive data</li>
                                <li>Regular security audits and updates</li>
                                <li>Secure data storage and backup systems</li>
                                <li>Access controls and authentication measures</li>
                            </ul>
                        </div>
                    </div>

                    <div className="privacy-section">
                        <div className="privacy-section-icon">
                            <FaCookie />
                        </div>
                        <div className="privacy-section-content">
                            <h2>Cookies and Tracking</h2>
                            <p>
                                We use cookies and similar tracking technologies to improve your experience on our platform. 
                                You can control cookie preferences through your browser settings.
                            </p>
                            <ul>
                                <li>Essential cookies for core functionality</li>
                                <li>Analytics cookies to understand usage patterns</li>
                                <li>Preference cookies to remember your settings</li>
                                <li>Third-party cookies for integrated services</li>
                            </ul>
                        </div>
                    </div>

                    <div className="privacy-section">
                        <div className="privacy-section-icon">
                            <FaEnvelope />
                        </div>
                        <div className="privacy-section-content">
                            <h2>Your Rights</h2>
                            <p>
                                You have the right to access, modify, or delete your personal information at any time. 
                                You can manage your privacy settings through your account dashboard.
                            </p>
                            <ul>
                                <li>Access your personal data at any time</li>
                                <li>Request correction or deletion of your data</li>
                                <li>Opt out of marketing communications</li>
                                <li>Export your data in a portable format</li>
                            </ul>
                        </div>
                    </div>

                    <div className="privacy-footer">
                        <div className="privacy-footer-content">
                            <h3>Contact Us</h3>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <div className="privacy-contact">
                                <span>📧 privacy@smartbiz.com</span>
                                <span>📞 (555) 123-4567</span>
                            </div>
                        </div>
                        <div className="privacy-update">
                            <p>This policy was last updated on {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                            <p className="privacy-small">SmartBiz - All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;