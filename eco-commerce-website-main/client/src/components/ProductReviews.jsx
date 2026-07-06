import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProductReviews({ productId }) {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing product! Really love the eco-friendly materials and the quality is outstanding.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      user: 'Mike Chen',
      rating: 4,
      comment: 'Good value for money. Shipping was fast and packaging was minimal which I appreciate.',
      date: '2024-01-10',
      verified: true
    },
    {
      id: 3,
      user: 'Emma Wilson',
      rating: 5,
      comment: 'Exceeded my expectations! Will definitely buy again and recommend to friends.',
      date: '2024-01-08',
      verified: false
    }
  ]);
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  
  const [showReviewForm, setShowReviewForm] = useState(false);

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }
    
    const review = {
      id: Date.now(),
      user: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      verified: true
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type={interactive ? 'button' : undefined}
          className={`star ${i <= rating ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
          onClick={interactive ? () => onRatingChange(i) : undefined}
          disabled={!interactive}
        >
          <i className={i <= rating ? 'fas fa-star' : 'far fa-star'}></i>
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <button 
          className="write-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          <i className="fas fa-edit"></i>
          Write a Review
        </button>
      </div>

      <div className="reviews-summary">
        <div className="average-rating">
          <div className="rating-number">{averageRating.toFixed(1)}</div>
          <div className="rating-stars">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="total-reviews">{reviews.length} reviews</div>
        </div>

        <div className="rating-breakdown">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="rating-bar">
              <span className="rating-label">{rating} star</span>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="rating-count">({count})</span>
            </div>
          ))}
        </div>
      </div>

      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="review-form">
          <h4>Write Your Review</h4>
          
          <div className="form-group">
            <label>Rating:</label>
            <div className="rating-input">
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview({ ...newReview, rating })
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Review:</label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Share your experience with this product..."
              required
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowReviewForm(false)} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              <i className="fas fa-paper-plane"></i>
              Submit Review
            </button>
          </div>
        </form>
      )}

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <div className="reviewer-name">
                    {review.user}
                    {review.verified && (
                      <span className="verified-badge">
                        <i className="fas fa-check-circle"></i>
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>
              <div className="review-rating">
                {renderStars(review.rating)}
              </div>
            </div>
            <div className="review-comment">
              {review.comment}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .product-reviews {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid var(--border-color);
        }

        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .reviews-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .write-review-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .write-review-btn:hover {
          background: var(--primary-dark);
        }

        .reviews-summary {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--bg-secondary);
          border-radius: 0.75rem;
        }

        .average-rating {
          text-align: center;
        }

        .rating-number {
          font-size: 3rem;
          font-weight: 700;
          color: var(--primary-color);
          line-height: 1;
        }

        .rating-stars {
          display: flex;
          justify-content: center;
          gap: 0.25rem;
          margin: 0.5rem 0;
        }

        .star {
          background: none;
          border: none;
          color: #fbbf24;
          font-size: 1.25rem;
          cursor: default;
        }

        .star.interactive {
          cursor: pointer;
          transition: transform 0.1s;
        }

        .star.interactive:hover {
          transform: scale(1.2);
        }

        .star.empty {
          color: #d1d5db;
        }

        .total-reviews {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .rating-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .rating-bar {
          display: grid;
          grid-template-columns: 60px 1fr 40px;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
        }

        .rating-label {
          color: var(--text-secondary);
        }

        .bar-container {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: #fbbf24;
          transition: width 0.3s ease;
        }

        .rating-count {
          color: var(--text-secondary);
          text-align: right;
        }

        .review-form {
          background: white;
          padding: 2rem;
          border-radius: 0.75rem;
          border: 2px solid var(--border-color);
          margin-bottom: 2rem;
        }

        .review-form h4 {
          margin: 0 0 1.5rem 0;
          color: var(--text-primary);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .rating-input {
          display: flex;
          gap: 0.25rem;
        }

        .rating-input .star {
          font-size: 1.5rem;
        }

        textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--border-color);
          border-radius: 0.5rem;
          font-family: inherit;
          font-size: 1rem;
          resize: vertical;
        }

        textarea:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .cancel-btn {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        .submit-btn {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-item {
          background: white;
          padding: 1.5rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border-color);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .reviewer-info {
          display: flex;
          gap: 0.75rem;
        }

        .reviewer-avatar {
          width: 40px;
          height: 40px;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reviewer-name {
          font-weight: 500;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .verified-badge {
          background: var(--secondary-color);
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .review-date {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .review-rating {
          display: flex;
          gap: 0.125rem;
        }

        .review-comment {
          color: var(--text-primary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .reviews-summary {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .reviews-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductReviews;
