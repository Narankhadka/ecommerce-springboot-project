const initialState = {
    adminOrder: null,
    pagination: {},
    userOrders: [],
    userOrdersLoading: false,
    userOrdersError: null,
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_ADMIN_ORDERS":
            return {
                ...state,
                adminOrder: action.payload,
                pagination: {
                    ...state.pagination,
                    pageNumber: action.pageNumber,
                    pageSize: action.pageSize,
                    totalElements: action.totalElements,
                    totalPages: action.totalPages,
                    lastPage: action.lastPage,
                },
            };
        case "USER_ORDERS_LOADING":
            return { ...state, userOrdersLoading: true, userOrdersError: null };
        case "USER_ORDERS":
            return { ...state, userOrdersLoading: false, userOrders: action.payload };
        case "USER_ORDERS_ERROR":
            return { ...state, userOrdersLoading: false, userOrdersError: action.payload };
        default:
            return state;
    }
};