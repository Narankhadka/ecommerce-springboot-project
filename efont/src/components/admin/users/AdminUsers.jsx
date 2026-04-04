import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { FaSearch, FaTimes, FaTrash } from "react-icons/fa";

import { getAllAdminUsers, deleteAdminUser } from "../../../store/actions";
import DeleteModal from "../../shared/DeleteModal";
import Loader from "../../shared/Loader";
import ErrorPage from "../../shared/ErrorPage";

const ROLE_BADGE = {
  ROLE_ADMIN: "bg-red-100 text-red-700 border border-red-300",
  ROLE_SELLER: "bg-orange-100 text-orange-700 border border-orange-300",
  ROLE_USER: "bg-blue-100 text-blue-700 border border-blue-300",
};

const ROLE_LABEL = {
  ROLE_ADMIN: "Admin",
  ROLE_SELLER: "Seller",
  ROLE_USER: "User",
};

const AdminUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [searchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("keyword") || "");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  const { users, pagination } = useSelector((state) => state.userManagement);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  const buildQueryString = (page, keyword) => {
    let qs = `pageNumber=${page - 1}&pageSize=10&sortBy=userId&sortOrder=asc`;
    if (keyword && keyword.trim()) qs += `&keyword=${encodeURIComponent(keyword.trim())}`;
    return qs;
  };

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const keyword = searchParams.get("keyword") || "";
    setCurrentPage(page);
    setSearchInput(keyword);
    dispatch(getAllAdminUsers(buildQueryString(page, keyword)));
  }, [searchParams, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("page", "1");
    if (searchInput.trim()) params.set("keyword", searchInput.trim());
    navigate(`${pathname}?${params}`);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    navigate(pathname);
  };

  const handlePaginationChange = (paginationModel) => {
    const page = paginationModel.page + 1;
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    navigate(`${pathname}?${params}`);
  };

  const handleDeleteClick = (row) => {
    setSelectedUser(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    dispatch(deleteAdminUser(selectedUser.id, toast, setDeleteLoader, setDeleteModalOpen));
  };

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      width: 90,
    },
    {
      field: "userName",
      headerName: "Username",
      width: 160,
    },
    {
      field: "email",
      headerName: "Email",
      width: 240,
    },
    {
      field: "roles",
      headerName: "Roles",
      width: 220,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-1 items-center h-full">
          {params.value.map((role) => (
            <span
              key={role}
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_BADGE[role] || "bg-gray-100 text-gray-700 border border-gray-300"}`}
            >
              {ROLE_LABEL[role] || role}
            </span>
          ))}
        </div>
      ),
    },
    {
      field: "orderCount",
      headerName: "Orders",
      width: 90,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const isAdmin = params.row.roles.includes("ROLE_ADMIN");
        return (
          <div className="flex items-center h-full">
            <button
              disabled={isAdmin}
              onClick={() => handleDeleteClick(params.row)}
              title={isAdmin ? "Cannot delete admin users" : "Delete user"}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-semibold transition-colors ${
                isAdmin
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-700 hover:bg-red-600 hover:text-white"
              }`}
            >
              <FaTrash className="text-xs" />
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  const tableRows = (users || []).map((u) => ({
    id: u.userId,
    userName: u.userName,
    email: u.email,
    roles: u.roles,
    orderCount: u.orderCount,
  }));

  const emptyUsers = !users || users.length === 0;

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <React.Fragment>
      <div className="pt-6 pb-4">
        <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
          All Users
        </h1>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-lg mx-auto">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by username or email"
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm text-slate-800 outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors"
          >
            Search
          </button>
          {(searchInput || searchParams.get("keyword")) && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="flex items-center gap-1 border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold py-2 px-3 rounded-md text-sm transition-colors"
            >
              <FaTimes />
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <Loader />
      ) : emptyUsers ? (
        <div className="flex flex-col items-center justify-center text-gray-600 py-10">
          <h2 className="text-2xl font-semibold">No Users Found</h2>
        </div>
      ) : (
        <div className="max-w-fit mx-auto pb-10">
          <DataGrid
            rows={tableRows}
            columns={columns}
            paginationMode="server"
            rowCount={pagination?.totalElements || 0}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: pagination?.pageSize || 10,
                  page: currentPage - 1,
                },
              },
            }}
            onPaginationModelChange={handlePaginationChange}
            disableRowSelectionOnClick
            disableColumnResize
            pagination
            pageSizeOptions={[pagination?.pageSize || 10]}
            paginationOptions={{
              showFirstButton: true,
              showLastButton: true,
              hideNextButton: currentPage === pagination?.totalPages,
            }}
          />
        </div>
      )}

      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        title={`Delete user: ${selectedUser?.userName}`}
        onDeleteHandler={handleDeleteConfirm}
        loader={deleteLoader}
      />
    </React.Fragment>
  );
};

export default AdminUsers;
