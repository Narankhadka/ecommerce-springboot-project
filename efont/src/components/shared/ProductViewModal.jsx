import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Divider } from '@mui/material';
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import Status from './Status';
import { MdClose, MdDone } from 'react-icons/md';
import { formatNPR } from '../../utils/formatPrice';
import api from '../../api/api';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../../store/actions';
import { checkIsAdmin, checkIsSeller } from '../../utils/authUtils';

const StarDisplay = ({ rating }) => (
  <span className='flex gap-0.5'>
    {[1,2,3,4,5].map((s) => (
      <svg key={s} className={`w-4 h-4 ${s <= rating ? 'text-yellow-400' : 'text-gray-300'}`} fill='currentColor' viewBox='0 0 20 20'>
        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/>
      </svg>
    ))}
  </span>
);

const StarSelector = ({ value, onChange }) => (
  <span className='flex gap-1'>
    {[1,2,3,4,5].map((s) => (
      <button key={s} type='button' onClick={() => onChange(s)} className='focus:outline-none'>
        <svg className={`w-7 h-7 transition-colors ${s <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} fill='currentColor' viewBox='0 0 20 20'>
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'/>
        </svg>
      </button>
    ))}
  </span>
);

function ProductViewModal({open, setOpen, product}) {
  // currentProduct tracks whichever product is displayed — starts as the prop,
  // updates when the user clicks a recommendation card inside the modal.
  const [currentProduct, setCurrentProduct] = useState(product || {});

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [recommendations, setRecommendations] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const isLoggedIn = !!user;
  const isAdminOrSeller = checkIsAdmin(user) || checkIsSeller(user);

  const { id, productName, image, description, quantity, price, discount, specialPrice } = currentProduct;
  const isCurrentlyAvailable = quantity && Number(quantity) > 0;

  // Reset everything when the modal opens with a fresh product from the parent.
  useEffect(() => {
    if (open && product?.id) {
      setCurrentProduct(product);
      setReviews([]);
      setRecommendations([]);
      setRating(0);
      setComment('');
      setSelectedImages([]);
      setImagePreviews([]);
      setAlreadyReviewed(false);
      setCanReview(false);
      setShowLoginPrompt(false);
    }
  }, [open, product]);

  const loadReviews = () => {
    if (!id) return;
    setReviewsLoading(true);
    api.get(`/public/products/${id}/reviews`)
      .then(res => {
        setReviews(res.data);
        if (user) {
          const myReview = res.data.find(r => r.userName === user.username);
          setAlreadyReviewed(!!myReview);
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  };

  // Re-fetch reviews and can-review whenever the displayed product changes.
  useEffect(() => {
    if (!open || !id) return;
    loadReviews();
    if (isLoggedIn) {
      api.get(`/reviews/can-review/${id}`)
        .then(res => setCanReview(res.data.canReview))
        .catch(() => setCanReview(false));
    }
  }, [open, id, isLoggedIn]);

  // Re-fetch recommendations whenever the displayed product changes.
  useEffect(() => {
    if (!open || !id) return;
    setRecsLoading(true);
    api.get(`/public/products/${id}/recommendations`)
      .then(res => setRecommendations(res.data || []))
      .catch(() => setRecommendations([]))
      .finally(() => setRecsLoading(false));
  }, [open, id]);

  // Swap the displayed product to a recommendation card the user clicked.
  const handleRecommendationClick = (rec) => {
    setCurrentProduct({
      id: rec.productId,
      productName: rec.productName,
      image: rec.image,
      description: rec.description,
      quantity: rec.quantity,
      price: rec.price,
      discount: rec.discount,
      specialPrice: rec.specialPrice,
    });
    setRating(0);
    setComment('');
    setSelectedImages([]);
    setImagePreviews([]);
    setAlreadyReviewed(false);
    setCanReview(false);
    setShowLoginPrompt(false);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    const newFiles = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating'); return; }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('rating', rating);
      if (comment) formData.append('comment', comment);
      selectedImages.forEach(img => formData.append('images', img));
      await api.post(`/reviews/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Review submitted!');
      setRating(0);
      setComment('');
      setSelectedImages([]);
      setImagePreviews([]);
      setAlreadyReviewed(true);
      loadReviews();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    dispatch(addToCart(
      { image, productName, description, specialPrice, price, productId: id, quantity },
      1,
      toast
    ));
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <Dialog
        open={open}
        as="div"
        className="relative"
        style={{ zIndex: 100 }}
        onClose={() => setOpen(false)}
      >
        <DialogBackdrop
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          style={{ zIndex: 100 }}
        />
        <div
          className="fixed inset-0 w-screen overflow-y-auto"
          style={{ zIndex: 101 }}
        >
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="relative transform rounded-lg bg-white shadow-xl transition-all w-full"
              style={{
                maxWidth: '680px',
                maxHeight: '80vh',
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
                {/* X close button — top right */}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '16px',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    zIndex: 10,
                  }}
                >
                  X
                </button>

                {image && (
                  <div style={{ width: '100%', height: '220px', overflow: 'hidden' }}>
                    <img
                      src={image?.startsWith("http") ? image : `${import.meta.env.VITE_BACK_END_URL}/images/${image}`}
                      alt={productName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                <div className='px-6 pt-10 pb-2'>
                  <DialogTitle as="h1" className="lg:text-3xl sm:text-2xl text-xl font-semibold leading-6 text-gray-800 mb-4">
                    {productName}
                  </DialogTitle>

                  <div className="space-y-2 text-gray-700 pb-4">
                    <div className="flex items-center justify-between gap-2">
                      {discount > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                          <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>
                            {formatNPR(price)}
                          </span>
                          <span style={{ color: '#dc2626', fontWeight: '700', fontSize: '1.5rem' }}>
                            {formatNPR(specialPrice)}
                          </span>
                          <span style={{
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                          }}>
                            Save {discount}%
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontWeight: '700', fontSize: '1.5rem' }}>
                          {formatNPR(price)}
                        </span>
                      )}

                      {isCurrentlyAvailable ? (
                        <Status
                          text="In Stock"
                          icon={MdDone}
                          bg="bg-teal-200"
                          color="text-teal-900"
                        />
                      ) : (
                        <Status
                          text="Out-Of-Stock"
                          icon={MdClose}
                          bg="bg-rose-200"
                          color="text-rose-700"
                        />
                      )}
                    </div>

                    {/* Add to Cart button — only for regular users and guests, not admin/seller */}
                    {!isAdminOrSeller && (
                      <button
                        disabled={!isCurrentlyAvailable}
                        onClick={handleAddToCart}
                        style={
                          isCurrentlyAvailable
                            ? {
                                backgroundColor: '#2563eb',
                                color: 'white',
                                padding: '10px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                width: '100%',
                                marginTop: '12px',
                              }
                            : {
                                backgroundColor: '#9ca3af',
                                color: 'white',
                                padding: '10px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'not-allowed',
                                width: '100%',
                                marginTop: '12px',
                              }
                        }
                      >
                        {isCurrentlyAvailable ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    )}

                    {/* Inline login prompt — shown when guest clicks Add to Cart */}
                    {showLoginPrompt && (
                      <div style={{
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        padding: '16px',
                        marginTop: '12px',
                        textAlign: 'center',
                      }}>
                        <p style={{
                          color: '#1e40af',
                          fontWeight: '600',
                          marginBottom: '12px',
                        }}>
                          Please log in to add items to cart
                        </p>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => navigate('/login')}
                            style={{
                              backgroundColor: '#2563eb',
                              color: 'white',
                              padding: '8px 20px',
                              borderRadius: '6px',
                              border: 'none',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            Log In
                          </button>
                          <button
                            onClick={() => setShowLoginPrompt(false)}
                            style={{
                              backgroundColor: 'white',
                              color: '#374151',
                              padding: '8px 20px',
                              borderRadius: '6px',
                              border: '1px solid #d1d5db',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <Divider />

                    <p>{description}</p>
                  </div>
                </div>


              {/* Reviews Section */}
              <div className='px-6 pb-4'>
                <Divider className='mb-4'/>
                <div className='flex items-center gap-3 mb-3'>
                  <h2 className='text-lg font-semibold text-gray-800'>Reviews</h2>
                  {avgRating && (
                    <div className='flex items-center gap-1'>
                      <StarDisplay rating={Math.round(avgRating)} />
                      <span className='text-sm text-gray-600 font-medium'>{avgRating} ({reviews.length})</span>
                    </div>
                  )}
                </div>

                {/* Write Review Form */}
                {isLoggedIn && canReview && !alreadyReviewed && (
                  <form onSubmit={handleSubmitReview} className='mb-4 border rounded-lg p-4 bg-blue-50'>
                    <p className='text-sm font-semibold text-gray-700 mb-2'>Write a Review</p>
                    <div className='mb-2'>
                      <StarSelector value={rating} onChange={setRating} />
                    </div>
                    <textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder='Share your experience (optional)'
                      rows={3}
                      className='w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none'
                    />
                    <div className='mt-2'>
                      <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        className='text-xs text-blue-600 underline hover:text-blue-800'
                      >
                        + Add photos (optional)
                      </button>
                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={handleImageChange}
                        className='hidden'
                      />
                      {imagePreviews.length > 0 && (
                        <div className='flex gap-2 mt-2 flex-wrap'>
                          {imagePreviews.map((src, i) => (
                            <div key={i} className='relative'>
                              <img src={src} alt='' className='w-14 h-14 object-cover rounded border' />
                              <button
                                type='button'
                                onClick={() => removeImage(i)}
                                className='absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center leading-none'
                              >
                                x
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type='submit'
                      disabled={submitting}
                      className='mt-3 px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-60'
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
                {isLoggedIn && alreadyReviewed && (
                  <p className='text-sm text-green-600 mb-3 font-medium'>You have already reviewed this product.</p>
                )}

                {reviewsLoading ? (
                  <p className='text-sm text-gray-400'>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p className='text-sm text-gray-400'>No reviews yet. Be the first to review!</p>
                ) : (
                  <div className='flex flex-col gap-4 max-h-72 overflow-y-auto pr-1'>
                    {reviews.map((r) => (
                      <div key={r.reviewId} className='border rounded-lg p-3 bg-gray-50'>
                        <div className='flex items-center justify-between mb-1'>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm font-semibold text-gray-700'>{r.userName}</span>
                            <StarDisplay rating={r.rating} />
                          </div>
                          <span className='text-xs text-gray-400'>
                            {new Date(r.createdAt).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        {r.comment && <p className='text-sm text-gray-600 mt-1'>{r.comment}</p>}
                        {r.imageUrls && r.imageUrls.length > 0 && (
                          <div className='flex gap-2 mt-2 flex-wrap'>
                            {r.imageUrls.map((url, i) => (
                              <img
                                key={i}
                                src={`${import.meta.env.VITE_BACK_END_URL}/images/${url}`}
                                alt={`Review photo ${i + 1}`}
                                className='w-16 h-16 object-cover rounded border'
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommendations Section — hidden when empty */}
              {(recsLoading || recommendations.length > 0) && (
                <div className='px-6 pb-4'>
                  <Divider className='mb-4' />
                  <h2 className='text-lg font-semibold text-gray-800 mb-3'>You May Also Like</h2>
                  {recsLoading ? (
                    <div className='flex justify-center py-3'>
                      <div className='w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 12, overflowX: 'auto' }}>
                      {recommendations.slice(0, 4).map(rec => (
                        <div
                          key={rec.productId}
                          onClick={() => handleRecommendationClick(rec)}
                          style={{
                            width: 150,
                            flexShrink: 0,
                            border: '1px solid #e5e7eb',
                            borderRadius: 8,
                            padding: 8,
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ width: '100%', height: 90, overflow: 'hidden', borderRadius: 6, marginBottom: 6, background: '#f9fafb' }}>
                            <img
                              src={rec.image?.startsWith('http') ? rec.image : `${import.meta.env.VITE_BACK_END_URL}/images/${rec.image}`}
                              alt={rec.productName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <p style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: '#374151',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            marginBottom: 4,
                          }}>
                            {rec.productName}
                          </p>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                            {formatNPR(rec.discount > 0 ? rec.specialPrice : rec.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="px-6 py-4 flex justify-end gap-4">
                <button
                  onClick={() => setOpen(false)}
                  type="button"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-700 hover:text-slate-800 hover:border-slate-800 rounded-md"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ProductViewModal;
