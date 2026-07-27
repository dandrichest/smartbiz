import { useRef, useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import StarRating from './StarRating';
import { FORM_CONSTRAINTS } from '../../constants/homePageData';

const TestimonialForm = ({ 
    formData, 
    formErrors, 
    isSubmitting, 
    onChange, 
    onSubmit, 
    onCancel 
}) => {
    const firstInputRef = useRef(null);

    // Move focus into the form when it mounts — improves keyboard UX
    useEffect(() => {
        firstInputRef.current?.focus();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <div
            className="testimonial-form-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-form-title"
        >
            <form onSubmit={handleSubmit} className="testimonial-form" noValidate>
                <h3 id="testimonial-form-title">Share Your Experience</h3>
                <p className="form-subtitle">Help others discover the benefits of SmartBiz</p>

                {/* Global submit error */}
                {formErrors.submit && (
                    <p role="alert" className="error-message global-error">
                        {formErrors.submit}
                    </p>
                )}

                {/* Name */}
                <div className="form-group">
                    <label htmlFor="testimonial-name">
                        Full Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                        ref={firstInputRef}
                        id="testimonial-name"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        value={formData.name || ''}
                        maxLength={FORM_CONSTRAINTS.name.max}
                        aria-required="true"
                        aria-invalid={!!formErrors.name}
                        aria-describedby={formErrors.name ? 'name-error' : undefined}
                        className={formErrors.name ? 'error' : ''}
                        onChange={(e) => onChange('name', e.target.value)}
                        disabled={isSubmitting}
                    />
                    {formErrors.name && (
                        <span id="name-error" role="alert" className="error-message">
                            {formErrors.name}
                        </span>
                    )}
                </div>

                {/* Role */}
                <div className="form-group">
                    <label htmlFor="testimonial-role">
                        Role / Company <span aria-hidden="true">*</span>
                    </label>
                    <input
                        id="testimonial-role"
                        type="text"
                        autoComplete="organization-title"
                        placeholder="e.g., CEO at Acme Inc."
                        value={formData.role || ''}
                        maxLength={FORM_CONSTRAINTS.role.max}
                        aria-required="true"
                        aria-invalid={!!formErrors.role}
                        aria-describedby={formErrors.role ? 'role-error' : undefined}
                        className={formErrors.role ? 'error' : ''}
                        onChange={(e) => onChange('role', e.target.value)}
                        disabled={isSubmitting}
                    />
                    {formErrors.role && (
                        <span id="role-error" role="alert" className="error-message">
                            {formErrors.role}
                        </span>
                    )}
                </div>

                {/* Quote */}
                <div className="form-group">
                    <label htmlFor="testimonial-quote">
                        Your Testimonial <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                        id="testimonial-quote"
                        placeholder="Share your experience with SmartBiz…"
                        value={formData.quote || ''}
                        rows={4}
                        maxLength={FORM_CONSTRAINTS.quote.max}
                        aria-required="true"
                        aria-invalid={!!formErrors.quote}
                        aria-describedby={
                            formErrors.quote ? 'quote-error quote-count' : 'quote-count'
                        }
                        className={formErrors.quote ? 'error' : ''}
                        onChange={(e) => onChange('quote', e.target.value)}
                        disabled={isSubmitting}
                    />
                    <span id="quote-count" className="char-count" aria-live="polite">
                        {(formData.quote || '').length} / {FORM_CONSTRAINTS.quote.max}
                    </span>
                    {formErrors.quote && (
                        <span id="quote-error" role="alert" className="error-message">
                            {formErrors.quote}
                        </span>
                    )}
                </div>

                {/* Rating */}
                <div className="form-group">
                    <label id="rating-label">Rating</label>
                    <StarRating
                        rating={formData.rating || 5}
                        interactive
                        onChange={(val) => onChange('rating', val)}
                        size={24}
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn-submit-testimonial"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                    >
                        {isSubmitting ? (
                            'Submitting…'
                        ) : (
                            <><FaCheckCircle aria-hidden="true" /> Submit Testimonial</>
                        )}
                    </button>
                    <button
                        type="button"
                        className="btn-cancel-form"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        <FaTimes aria-hidden="true" /> Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TestimonialForm;