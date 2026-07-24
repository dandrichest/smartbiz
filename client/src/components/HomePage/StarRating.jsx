import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

/**
 * Purely presentational star-rating display.
 * Can be used in both display mode and interactive mode.
 */
const StarRating = ({ 
    rating = 0, 
    max = 5, 
    interactive = false, 
    onChange = null,
    size = 20,
    className = ''
}) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

    const handleClick = (index) => {
        if (interactive && onChange) {
            onChange(index + 1);
        }
    };

    return (
        <div 
            className={`star-rating ${className}`} 
            role={interactive ? 'radiogroup' : 'img'}
            aria-label={`Rating: ${rating} out of ${max} stars`}
            style={{ display: 'inline-flex', gap: '2px' }}
        >
            {[...Array(fullStars)].map((_, i) => (
                <button
                    key={`full-${i}`}
                    type="button"
                    role={interactive ? 'radio' : undefined}
                    aria-checked={interactive ? true : undefined}
                    aria-label={`${i + 1} star${i > 0 ? 's' : ''}`}
                    className={`star filled ${interactive ? 'interactive' : ''}`}
                    onClick={() => handleClick(i)}
                    style={{ 
                        cursor: interactive ? 'pointer' : 'default',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: size,
                        color: '#fbbf24',
                    }}
                    disabled={!interactive}
                >
                    <FaStar />
                </button>
            ))}
            
            {hasHalfStar && (
                <button
                    key="half"
                    type="button"
                    role={interactive ? 'radio' : undefined}
                    aria-checked={interactive ? true : undefined}
                    aria-label="Half star"
                    className={`star half-filled ${interactive ? 'interactive' : ''}`}
                    onClick={() => handleClick(fullStars)}
                    style={{ 
                        cursor: interactive ? 'pointer' : 'default',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: size,
                        color: '#fbbf24',
                    }}
                    disabled={!interactive}
                >
                    <FaStarHalfAlt />
                </button>
            )}
            
            {[...Array(emptyStars)].map((_, i) => (
                <button
                    key={`empty-${i}`}
                    type="button"
                    role={interactive ? 'radio' : undefined}
                    aria-checked={interactive ? false : undefined}
                    aria-label={`${fullStars + (hasHalfStar ? 1 : 0) + i + 1} star${i > 0 ? 's' : ''}`}
                    className={`star empty ${interactive ? 'interactive' : ''}`}
                    onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + i)}
                    style={{ 
                        cursor: interactive ? 'pointer' : 'default',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: size,
                        color: '#d1d5db',
                    }}
                    disabled={!interactive}
                >
                    <FaRegStar />
                </button>
            ))}
        </div>
    );
};

export default StarRating;