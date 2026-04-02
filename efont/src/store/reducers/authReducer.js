const initialState = {
    user: null,
    address: [],
    clientSecret: null,
    selectedUserCheckoutAddress: null,
    showLoginModal: false,
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN_USER":
            return { ...state, user: action.payload };
        case "USER_ADDRESS":
            return { ...state, address: action.payload };
        case "SELECT_CHECKOUT_ADDRESS":
            return { ...state, selectedUserCheckoutAddress: action.payload };
        case "REMOVE_CHECKOUT_ADDRESS":
            return { ...state, selectedUserCheckoutAddress: null };
        case "CLIENT_SECRET":
            return { ...state, clientSecret: action.payload };
        case "REMOVE_CLIENT_SECRET_ADDRESS":
            return { ...state, clientSecret: null, selectedUserCheckoutAddress: null };
        case "LOG_OUT":
            return {
                user: null,
                address: null,
                showLoginModal: false,
            };
        case "SHOW_LOGIN_MODAL":
            return { ...state, showLoginModal: true };
        case "HIDE_LOGIN_MODAL":
            return { ...state, showLoginModal: false };
        default:
            return state;
    }
};