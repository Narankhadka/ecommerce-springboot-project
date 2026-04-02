import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LoginPromptModal = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showLoginModal = useSelector((state) => state.auth.showLoginModal);

    if (!showLoginModal) return null;

    const handleClose = () => {
        dispatch({ type: 'HIDE_LOGIN_MODAL' });
    };

    const handleLogin = () => {
        dispatch({ type: 'HIDE_LOGIN_MODAL' });
        navigate('/login');
    };

    return (
        <div
            onClick={handleClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    zIndex: 10000,
                    pointerEvents: 'auto',
                    background: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    width: '100%',
                    maxWidth: '380px',
                    margin: '0 16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                }}
            >
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        color: '#9ca3af',
                    }}
                >
                    X
                </button>

                <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    marginBottom: '8px',
                }}>
                    Please Log In
                </h2>

                <p style={{
                    color: '#6b7280',
                    marginBottom: '24px',
                }}>
                    You need to be logged in to add items to your cart.
                </p>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={handleLogin}
                        style={{
                            flex: 1,
                            backgroundColor: '#2563eb',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        Log In
                    </button>
                    <button
                        onClick={handleClose}
                        style={{
                            flex: 1,
                            backgroundColor: 'white',
                            color: '#374151',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid #d1d5db',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPromptModal;
