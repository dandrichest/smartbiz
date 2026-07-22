/* eslint-disable no-unused-vars */
import { 
    FaEnvelope, 
    FaPhone, 
    FaCommentDots, 
    FaQuestionCircle, 
    FaBook, 
    FaHeadset,
    FaTicketAlt,
    FaClock,
    FaCheckCircle,
    FaArrowRight,
    FaSearch,
    FaLifeRing,
    FaFileAlt,
    FaVideo,
    FaUsers
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Support.css';

const Support = () => {
    const currentYear = new Date().getFullYear();

    const faqs = [
        {
            question: "How do I add a new product?",
            answer: "Go to Inventory → Click 'Add Product' → Fill in the details → Save."
        },
        {
            question: "How do I process a sale?",
            answer: "Go to Sales → Select products → Add to cart → Process sale."
        },
        {
            question: "How do I manage customers?",
            answer: "Go to Customers → Add new customer or manage existing ones."
        },
        {
            question: "How do I view analytics?",
            answer: "Go to Analytics → View sales, revenue, and customer insights."
        },
        {
            question: "How do I reset my password?",
            answer: "Click on Settings → Security → Change password."
        },
        {
            question: "How do I export data?",
            answer: "Go to Settings → Data Management → Export Data."
        }
    ];

    return (
        <div className="support-container">
            <div className="support-card">
                <div className="support-header">
                    <div className="support-header-icon">
                        <FaHeadset />
                    </div>
                    <h1>Support Center</h1>
                    <p>How can we help you today?</p>
                </div>

                {/* Quick Actions */}
                <div className="support-quick-actions">
                    <div className="support-quick-action">
                        <FaBook className="quick-icon" />
                        <h3>Documentation</h3>
                        <p>Browse our comprehensive guides</p>
                        <Link to="/docs" className="quick-link">Learn More →</Link>
                    </div>
                    <div className="support-quick-action">
                        <FaCommentDots className="quick-icon" />
                        <h3>Live Chat</h3>
                        <p>Chat with our support team</p>
                        <button className="quick-link">Start Chat →</button>
                    </div>
                    <div className="support-quick-action">
                        <FaTicketAlt className="quick-icon" />
                        <h3>Submit Ticket</h3>
                        <p>Get help with specific issues</p>
                        <button className="quick-link">Submit Ticket →</button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="support-faq-section">
                    <h2>
                        <FaQuestionCircle className="section-icon" />
                        Frequently Asked Questions
                    </h2>
                    <div className="support-faq-grid">
                        {faqs.map((faq, index) => (
                            <div key={index} className="support-faq-item">
                                <div className="faq-question">
                                    <FaCheckCircle className="faq-check" />
                                    <h4>{faq.question}</h4>
                                </div>
                                <p className="faq-answer">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="support-contact-section">
                    <h2>
                        <FaHeadset className="section-icon" />
                        Contact Us
                    </h2>
                    <div className="support-contact-grid">
                        <div className="support-contact-item">
                            <div className="contact-icon-wrapper">
                                <FaEnvelope />
                            </div>
                            <div className="contact-info">
                                <h4>Email Support</h4>
                                <p>support@smartbiz.com</p>
                                <span>Response within 24 hours</span>
                            </div>
                        </div>
                        <div className="support-contact-item">
                            <div className="contact-icon-wrapper">
                                <FaPhone />
                            </div>
                            <div className="contact-info">
                                <h4>Phone Support</h4>
                                <p>(555) 123-4567</p>
                                <span>Mon-Fri, 9AM - 6PM EST</span>
                            </div>
                        </div>
                        <div className="support-contact-item">
                            <div className="contact-icon-wrapper">
                                <FaClock />
                            </div>
                            <div className="contact-info">
                                <h4>Support Hours</h4>
                                <p>24/7 Available</p>
                                <span>Live chat: 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resources Section */}
                <div className="support-resources-section">
                    <h2>
                        <FaLifeRing className="section-icon" />
                        Additional Resources
                    </h2>
                    <div className="support-resources-grid">
                        <Link to="/docs" className="support-resource-item">
                            <FaBook className="resource-icon" />
                            <div>
                                <h4>Documentation</h4>
                                <p>Detailed guides and tutorials</p>
                            </div>
                            <FaArrowRight className="resource-arrow" />
                        </Link>
                        <Link to="/videos" className="support-resource-item">
                            <FaVideo className="resource-icon" />
                            <div>
                                <h4>Video Tutorials</h4>
                                <p>Watch step-by-step guides</p>
                            </div>
                            <FaArrowRight className="resource-arrow" />
                        </Link>
                        <Link to="/community" className="support-resource-item">
                            <FaUsers className="resource-icon" />
                            <div>
                                <h4>Community</h4>
                                <p>Join our user community</p>
                            </div>
                            <FaArrowRight className="resource-arrow" />
                        </Link>
                        <Link to="/faq" className="support-resource-item">
                            <FaFileAlt className="resource-icon" />
                            <div>
                                <h4>FAQ</h4>
                                <p>Common questions answered</p>
                            </div>
                            <FaArrowRight className="resource-arrow" />
                        </Link>
                    </div>
                </div>

                <div className="support-footer">
                    <p>© {currentYear} SmartBiz Support. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Support;