/* eslint-disable no-unused-vars */
import { 
    FaGavel, 
    FaFileContract, 
    FaUserShield, 
    FaMoneyBillWave, 
    FaUserCog,
    FaClipboardCheck,
    FaBan,
    FaEnvelope,
    FaBuilding
} from 'react-icons/fa';
import '../styles/Terms.css';

const Terms = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="terms-container">
            <div className="terms-card">
                <div className="terms-header">
                    <div className="terms-header-icon">
                        <FaGavel />
                    </div>
                    <h1>Terms of Service</h1>
                    <p>Last Updated: {currentYear}</p>
                </div>

                <div className="terms-content">
                    <div className="terms-section">
                        <div className="terms-section-icon">
                            <FaFileContract />
                        </div>
                        <div className="terms-section-content">
                            <h2>Acceptance of Terms</h2>
                            <p>
                                By using SmartBiz, you agree to these Terms of Service. If you do not agree, 
                                please do not use our services. These terms apply to all users of the platform.
                            </p>
                            <ul>
                                <li>You must be at least 18 years old to use this service</li>
                                <li>You agree to provide accurate and complete information</li>
                                <li>You are responsible for maintaining account security</li>
                                <li>You agree to comply with all applicable laws</li>
                            </ul>
                        </div>
                    </div>

                    <div className="terms-section">
                        <div className="terms-section-icon">
                            <FaUserShield />
                        </div>
                        <div className="terms-section-content">
                            <h2>User Accounts</h2>
                            <p>
                                To access certain features, you must create an account. You are responsible for 
                                all activities that occur under your account.
                            </p>
                            <ul>
                                <li>Keep your password secure and confidential</li>
                                <li>Notify us immediately of unauthorized use</li>
                                <li>You may not share your account with others</li>
                                <li>We reserve the right to suspend or terminate accounts</li>
                            </ul>
                        </div>
                    </div>

                    <div className="terms-section">
                        <div className="terms-section-icon">
                            <FaMoneyBillWave />
                        </div>
                        <div className="terms-section-content">
                            <h2>Payments and Transactions</h2>
                            <p>
                                SmartBiz facilitates transactions between users. We are not responsible for 
                                disputes between parties.
                            </p>
                            <ul>
                                <li>All transactions are final unless otherwise stated</li>
                                <li>We use secure payment processing services</li>
                                <li>Prices are subject to change without notice</li>
                                <li>Refunds are handled according to our refund policy</li>
                            </ul>
                        </div>
                    </div>

                    <div className="terms-section">
                        <div className="terms-section-icon">
                            <FaUserCog />
                        </div>
                        <div className="terms-section-content">
                            <h2>User Responsibilities</h2>
                            <p>
                                You are responsible for your use of SmartBiz and for any content you post, 
                                share, or transmit through our platform.
                            </p>
                            <ul>
                                <li>Do not upload harmful or malicious content</li>
                                <li>Respect intellectual property rights</li>
                                <li>Do not engage in fraudulent activities</li>
                                <li>Comply with all applicable laws and regulations</li>
                            </ul>
                        </div>
                    </div>

                    <div className="terms-section">
                        <div className="terms-section-icon">
                            <FaClipboardCheck />
                        </div>
                        <div className="terms-section-content">
                            <h2>Intellectual Property</h2>
                            <p>
                                All content on SmartBiz is protected by copyright, trademark, and other 
                                intellectual property laws.
                            </p>
                            <ul>
                                <li>You may not copy or reproduce our content without permission</li>
                                <li>You retain ownership of content you submit</li>
                                <li>You grant us a license to use submitted content</li>
                                <li>We respect intellectual property rights of others</li>
                            </ul>
                        </div>
                    </div>

                    <div className="terms-section">
                        <div className="terms-section-icon">
                            <FaBan />
                        </div>
                        <div className="terms-section-content">
                            <h2>Termination</h2>
                            <p>
                                We reserve the right to terminate or suspend your account at our sole discretion, 
                                without prior notice, for any reason.
                            </p>
                            <ul>
                                <li>Violation of these terms may result in termination</li>
                                <li>You may delete your account at any time</li>
                                <li>Some provisions survive termination</li>
                                <li>We may modify these terms at any time</li>
                            </ul>
                        </div>
                    </div>

                    <div className="terms-footer">
                        <div className="terms-footer-content">
                            <h3>Contact Us</h3>
                            <p>
                                If you have any questions about these Terms of Service, please contact us at:
                            </p>
                            <div className="terms-contact">
                                <span>📧 legal@smartbiz.com</span>
                                <span>📞 (555) 123-4567</span>
                            </div>
                        </div>
                        <div className="terms-update">
                            <p>These terms were last updated on {new Date().toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</p>
                            <p className="terms-small">SmartBiz - All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terms;