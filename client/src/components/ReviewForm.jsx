import { useState } from 'react'
import '../styles/ReviewForm.css'
function ReviewForm() {
    const [review, setReview] = useState({
        rating: 5,
        comment: "",
    });

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
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <h2>Leave a Review</h2>

                <div>
                    <label>Rating</label>
                    <select name="rating" value={review.rating} onChange={handleChange}>
                        <option value="5">★★★★★ (5)</option>
                        <option value="4">★★★★☆ (4)</option>
                        <option value="3">★★★☆☆ (3)</option>
                        <option value="2">★★☆☆☆ (2)</option>
                        <option value="1">★☆☆☆☆ (1)</option>
                    </select>
                </div>

                <div>
                    <label>Comment</label>
                    <textarea name="comment" value={review.comment}
                        onChange={handleChange}
                        rows={5}
                        placeholder='Write your review...' />
                </div>

                <button type='submit'>Submit Review</button>
            </form>
        </>
    )
}

export default ReviewForm;
