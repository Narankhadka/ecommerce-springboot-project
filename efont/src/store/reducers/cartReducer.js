const initialState = {
    cart: [],
    totalPrice: 0,
    cartId: null,
}

const recalcTotal = (items) =>
    items.reduce((sum, item) => {
        const price = item.specialPrice || item.productPrice || item.price || 0;
        const qty = item.quantity || 1;
        return sum + price * qty;
    }, 0);

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "ADD_CART": {
            const productToAdd = action.payload;
            const existingProduct = state.cart.find(
                (item) => item.productId === productToAdd.productId
            );

            let updatedCart;
            if (existingProduct) {
                updatedCart = state.cart.map((item) =>
                    item.productId === productToAdd.productId ? productToAdd : item
                );
            } else {
                updatedCart = [...state.cart, productToAdd];
            }

            return {
                ...state,
                cart: updatedCart,
                totalPrice: recalcTotal(updatedCart),
            };
        }
        case "REMOVE_CART": {
            const filteredCart = state.cart.filter(
                (item) => item.productId !== action.payload.productId
            );
            return {
                ...state,
                cart: filteredCart,
                totalPrice: recalcTotal(filteredCart),
            };
        }
        case "GET_USER_CART_PRODUCTS": {
            const items = action.payload;
            const hasItems = Array.isArray(items) && items.length > 0;
            return {
                ...state,
                cart: hasItems ? items : state.cart,
                totalPrice: hasItems ? recalcTotal(items) : state.totalPrice,
                cartId: action.cartId || state.cartId,
            };
        }
        case "CLEAR_CART":
            return { cart: [], totalPrice: 0, cartId: null };
        default:
            return state;
    }
}