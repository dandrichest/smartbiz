import { useState } from 'react';
import { FaStar, FaRegStar, FaPaperPlane } from 'react-icons/fa';
import '../styles/ReviewForm.css';

function ReviewForm() {
    const [review, setReview] = useState({
        rating: 5,
        comment: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReview((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(review);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setReview({ rating: 5, comment: "" });
        }, 3000);
    };

    // Render stars based on rating
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

    return (
        <div className="review-form-container">
            <div className="review-form-card">
                <div className="review-form-header">
                    <h2>✍️ Leave a Review</h2>
                    <p>Share your experience with us</p>
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
                            rows={5}
                            placeholder="Write your review..."
                            className="review-textarea"
                        />
                        <div className="review-character-count">
                            {review.comment.length} / 500
                        </div>
                    </div>

                    <button type="submit" className="review-submit-btn">
                        <FaPaperPlane /> Submit Review
                    </button>
                </form>

                {submitted && (
                    <div className="review-success">
                        <span>✅</span>
                        <p>Thank you for your review!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReviewForm;