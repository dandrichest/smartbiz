import { useState } from 'react';
import { FaStar, FaRegStar, FaPaperPlane, FaTimes } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';
import '../../styles/ReviewForm.css';

const ReviewForm = ({ productId, onSuccess, onClose }) => {
    const [review, setReview] = useState({
        rating: 5,
        comment: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!productId) {
            toast.error('Product ID is required');
            return;
        }

        if (!review.comment.trim()) {
            toast.error('Please write a comment');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/reviews', {
                productId,
                rating: Number(review.rating),
                comment: review.comment.trim(),
            });

            if (response.data.success) {
                toast.success('Review submitted successfully!');
                setSubmitted(true);
                
                if (onSuccess) {
                    onSuccess(response.data.data);
                }
                
                setTimeout(() => {
                    setSubmitted(false);
                    setReview({ rating: 5, comment: '' });
                    if (onClose) onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="star-filled" />);
            } else {
                stars.push(<FaRegStar key={i} className="star-empty" />);
            }
        }
        return stars;
    };

    if (submitted) {
        return (
            <div className="review-success-container">
                <div className="review-success-icon">✅</div>
                <h3>Thank You!</h3>
                <p>Your review has been submitted successfully.</p>
            </div>
        );
    }

    return (
        <div className="review-form-wrapper">
            {onClose && (
                <button className="review-form-close" onClick={onClose}>
                    <FaTimes />
                </button>
            )}
            <div className="review-form-header">
                <h2>Write a Review</h2>
                <p>Share your experience with this product</p>
            </div>

            <form onSubmit={handleSubmit} className="review-form">
                <div className="review-form-group">
                    <label className="review-label">
                        Rating
                        <span className="review-rating-display">
                            {renderStars(Number(review.rating))}
                        </span>
                    </label>
                    <select 
                        name="rating" 
                        value={review.rating} 
                        onChange={handleChange}
                        className="review-select"
                        disabled={loading}
                    >
                        <option value="5">★★★★★ (5) - Excellent</option>
                        <option value="4">★★★★☆ (4) - Very Good</option>
                        <option value="3">★★★☆☆ (3) - Good</option>
                        <option value="2">★★☆☆☆ (2) - Fair</option>
                        <option value="1">★☆☆☆☆ (1) - Poor</option>
                    </select>
                </div>

                <div className="review-form-group">
                    <label className="review-label">Comment</label>
                    <textarea 
                        name="comment" 
                        value={review.comment}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Write your review..."
                        className="review-textarea"
                        disabled={loading}
                        maxLength={500}
                        required
                    />
                    <div className="review-character-count">
                        {review.comment.length} / 500
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="review-submit-btn"
                    disabled={loading}
                >
                    {loading ? (
                        'Submitting...'
                    ) : (
                        <>
                            <FaPaperPlane /> Submit Review
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;