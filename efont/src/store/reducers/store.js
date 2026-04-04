import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducer";
import { errorReducer } from "./errorReducer";
import { cartReducer } from "./cartReducer";
import { authReducer } from "./authReducer";
import { paymentMethodReducer } from "./paymentMethodReducer";
import { adminReducer } from "./adminReducer";
import { orderReducer } from "./orderReducer";
import { sellerReducer } from "./sellerReducer";
import { userManagementReducer } from "./userManagementReducer";

const user = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth"))
    : null;

const selectedUserCheckoutAddress = localStorage.getItem("CHECKOUT_ADDRESS")
    ? JSON.parse(localStorage.getItem("CHECKOUT_ADDRESS"))
    : null;

const clientSecret = localStorage.getItem("client-secret")
    ? JSON.parse(localStorage.getItem("client-secret"))
    : null;

// Cart is never preloaded from localStorage.
// It is always fetched fresh from the backend using the logged-in user's JWT.
const initialState = {
    auth: { user: user, selectedUserCheckoutAddress, clientSecret },
};

export const store = configureStore({
    reducer: {
        products: productReducer,
        errors: errorReducer,
        carts: cartReducer,
        auth: authReducer,
        payment: paymentMethodReducer,
        admin: adminReducer,
        order: orderReducer,
        seller: sellerReducer,
        userManagement: userManagementReducer,
    },
    preloadedState: initialState,
});

export default store;