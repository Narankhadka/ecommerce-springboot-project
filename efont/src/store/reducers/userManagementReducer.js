const initialState = {
  users: null,
  pagination: {},
};

export const userManagementReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ADMIN_USERS":
      return {
        ...state,
        users: action.payload,
        pagination: {
          ...state.pagination,
          pageNumber: action.pageNumber,
          pageSize: action.pageSize,
          totalElements: action.totalElements,
          totalPages: action.totalPages,
          lastPage: action.lastPage,
        },
      };
    default:
      return state;
  }
};
