import { FaEdit, FaEye, FaImage, FaTrashAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { formatNPR } from "../../utils/formatPrice";

export const ORDER_STATUSES = [
  "Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export const adminProductTableColumn = (
  handleEdit,
  handleDelete,
  handleImageUpload,
  handleProductView
) => [
  {
    disableColumnMenu: true,
    sortable: false,
    field: "id",
    headerName: "ID",
    minWidth: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="text-center">ProductID</span>,
  },
  {
    disableColumnMenu: true,
    field: "productName",
    headerName: "Product Name",
    align: "center",
    width: 260,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: (params) => <span>Product Name</span>,
  },

  {
    disableColumnMenu: true,
    field: "price",
    headerName: "Price",
    minWidth: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="text-center">Price</span>,
    renderCell: (params) => <span>{formatNPR(params.row.price)}</span>,
  },
  {
    disableColumnMenu: true,
    field: "quantity",
    headerName: "Quantity",
    minWidth: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="text-center">Quantity</span>,
    renderCell: (params) => {
      const qty = params.row.quantity;
      if (qty === 0) {
        return (
          <span className="text-red-500 font-semibold">Out of Stock</span>
        );
      }
      if (qty <= 5) {
        return (
          <span className="text-orange-500 font-semibold">
            Low Stock: {qty} remaining
          </span>
        );
      }
      return <span>{qty}</span>;
    },
  },
  {
    disableColumnMenu: true,
    field: "specialPrice",
    headerName: "Price",
    minWidth: 200,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => (
      <span className="text-center">Special Price</span>
    ),
    renderCell: (params) => <span>{formatNPR(params.row.specialPrice)}</span>,
  },
  {
    sortable: false,
    field: "description",
    headerName: "Image",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    disableColumnMenu: true,
    headerClassName: "text-black font-semibold border ",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="ps-10">Description</span>,
  },
  {
    sortable: false,
    field: "image",
    headerName: "Image",
    headerAlign: "center",
    align: "center",
    width: 200,
    editable: false,
    disableColumnMenu: true,
    headerClassName: "text-black font-semibold border ",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="ps-10">Image</span>,
  },

  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold text-center",
    cellClassName: "text-slate-700 font-normal",
    sortable: false,
    width: 400,
    renderHeader: (params) => <span>Action</span>,
    renderCell: (params) => {
      return (
        <div className="flex justify-center items-center space-x-2 h-full pt-2">
          <button
            onClick={() => handleImageUpload(params.row)}
            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 h-9 rounded-md"
          >
            <FaImage className="mr-2" />
            Image
          </button>
          <button
            onClick={() => handleEdit(params.row)}
            className="flex items-center bg-blue-500 text-white px-4 h-9 rounded-md "
          >
            <FaEdit className="mr-2" />
            Edit
          </button>

          <button
            onClick={() => handleDelete(params.row)}
            className="flex items-center bg-red-500 text-white px-4   h-9 rounded-md"
          >
            <FaTrashAlt className="mr-2" />
            Delete
          </button>
          <button
            onClick={() => handleProductView(params.row)}
            className="flex items-center bg-slate-800 text-white px-4   h-9 rounded-md"
          >
            <FaEye className="mr-2" />
            View
          </button>
        </div>
      );
    },
  },
];


export const sellerOrderTableColumn = (handleStatusChange) => [
  {
    sortable: false,
    disableColumnMenu: true,
    field: "id",
    headerName: "orderId",
    minWidth: 120,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span className="text-center">Order ID</span>,
  },
  {
    disableColumnMenu: true,
    field: "email",
    headerName: "Email",
    align: "center",
    width: 230,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Email</span>,
  },
  {
    disableColumnMenu: true,
    field: "totalAmount",
    headerName: "Total Amount",
    align: "center",
    width: 160,
    editable: false,
    sortable: true,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Total Amount</span>,
    renderCell: (params) => <span>{formatNPR(params.row.totalAmount)}</span>,
  },
  {
    disableColumnMenu: true,
    field: "date",
    headerName: "Order Date",
    align: "center",
    width: 140,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Order Date</span>,
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold text-center border",
    cellClassName: "text-slate-700 font-normal border",
    sortable: false,
    width: 220,
    renderHeader: () => <span>Update Status</span>,
    renderCell: (params) => {
      const currentStatus = params.row.status;
      const isTerminal = currentStatus === "Delivered" || currentStatus === "Cancelled";
      const isInList = ORDER_STATUSES.includes(currentStatus);
      return (
        <div className="flex items-center h-full w-full px-1">
          <select
            value={currentStatus}
            disabled={isTerminal}
            onChange={(e) => {
              e.stopPropagation();
              handleStatusChange(params.row.id, e.target.value);
            }}
            className={`w-full px-2 py-1 text-sm border rounded ${
              isTerminal
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                : "bg-white text-slate-700 cursor-pointer border-slate-300"
            }`}
          >
            {!isInList && (
              <option value={currentStatus}>{currentStatus}</option>
            )}
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      );
    },
  },
];

export const adminOrderTableColumn = (handleEdit) => [
  { 
    sortable: false,
    disableColumnMenu: true,
    field: "id",
    headerName: "orderId",
    minWidth: 180,
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className='text-center'>Order ID</span>
   },
  {
    // Column for customer email.
    disableColumnMenu: true,
    field: "email",
    headerName: "Email",
    align: "center",
    width: 250,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: (params) => <span>Email</span>,
  },
  {
    // Column for showing total amount of the order.
    disableColumnMenu: true,
    field: "totalAmount",
    headerName: "Total Amount",
    align: "center",
    width: 200,
    editable: false,
    sortable: true,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: (params) => <span>Total Amount</span>,
  },
  {
    // Column to display order status (e.g., Pending, Shipped).
    disableColumnMenu: true,
    field: "status",
    headerName: "Status",
    align: "center",
    width: 200,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: (params) => <span>Status</span>,
  },
  {
    // Column for order creation date.
    disableColumnMenu: true,
    field: "date",
    headerName: "Order Date",
    align: "center",
    width: 200,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: (params) => <span>Order Date</span>,
  },
  {
    // Custom action column with an "Edit" button.
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold text-center",
    cellClassName: "text-slate-700 font-normal",
    sortable: false,
    width: 250,
    renderHeader: (params) => <span>Action</span>,
    renderCell: (params) => {
      return (
        <div className='flex justify-center items-center space-x-2 h-full pt-2'>
          <button
            onClick={() => handleEdit(params.row)}
            className='flex items-center bg-blue-500 text-white px-4 h-9 rounded-md'>
              <FaEdit className='mr-2'/>
              Edit
          </button>
        </div>
      );
    },
  },
];


//table column for categories in admin panel
export const categoryTableColumns = (handleEdit, handleDelete) => [
  {
    sortable: false,
    disableColumnMenu: true,
    field: "id",
    headerName: "CategoryId",
    minWidth: 300,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: (params) => <span className="text-center">CategoryId</span>,
  },
  {
    disableColumnMenu: true,
    field: "categoryName",
    headerName: "Category Name",
    align: "center",
    width: 400,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border ",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: (params) => <span>Category Name</span>,
  },

  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold text-center",
    cellClassName: "text-slate-700 font-normal",
    sortable: false,
    width: 400,
    renderHeader: (params) => <span>Action</span>,
    renderCell: (params) => {
      return (
        <div className="flex justify-center space-x-2 h-full pt-2">
          <button
            onClick={() => handleEdit(params.row)}
            className="flex items-center bg-blue-500 text-white px-4 h-9 rounded-md "
          >
            <FaEdit className="mr-2" />
            Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={() => handleDelete(params.row)}
            className="flex items-center bg-red-500 text-white px-4   h-9 rounded-md"
          >
            <FaTrashAlt className="mr-2" />
            Delete
          </button>
        </div>
      );
    },
  },
];


//table column for seller in admin panel
export const sellerTableColumns = (handleDelete, handleChangePassword, handleCategoryUpdate) => [
  {
    disableColumnMenu: true,
    field: "id",
    headerName: "ID",
    minWidth: 100,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span className="text-center">SellerID</span>,
  },
  {
    disableColumnMenu: true,
    field: "username",
    headerName: "UserName",
    minWidth: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
    sortable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span className="text-center">UserName</span>,
  },
  {
    disableColumnMenu: true,
    field: "email",
    headerName: "Email",
    align: "center",
    minWidth: 220,
    editable: false,
    sortable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center border",
    cellClassName: "text-slate-700 font-normal border text-center",
    renderHeader: () => <span>Email</span>,
    renderCell: (params) => (
      <div className="flex items-center justify-center gap-1">
        <MdOutlineEmail className="text-slate-700 text-lg" />
        <span>{params?.row?.email}</span>
      </div>
    ),
  },
  {
    disableColumnMenu: true,
    field: "shopName",
    headerName: "Shop Name",
    minWidth: 150,
    headerAlign: "center",
    align: "center",
    editable: false,
    sortable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span>Shop Name</span>,
    renderCell: (params) => (
      <span>{params.row.shopName || "-"}</span>
    ),
  },
  {
    disableColumnMenu: true,
    field: "shopLocation",
    headerName: "Location",
    minWidth: 140,
    headerAlign: "center",
    align: "center",
    editable: false,
    sortable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span>Location</span>,
    renderCell: (params) => (
      <span>{params.row.shopLocation || "-"}</span>
    ),
  },
  {
    disableColumnMenu: true,
    field: "phoneNumber",
    headerName: "Phone",
    minWidth: 130,
    headerAlign: "center",
    align: "center",
    editable: false,
    sortable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span>Phone</span>,
    renderCell: (params) => (
      <span>{params.row.phoneNumber || "-"}</span>
    ),
  },
  {
    disableColumnMenu: true,
    field: "assignedCategoryName",
    headerName: "Category",
    minWidth: 160,
    headerAlign: "center",
    align: "center",
    editable: false,
    sortable: false,
    headerClassName: "text-black font-semibold border",
    cellClassName: "text-slate-700 font-normal border",
    renderHeader: () => <span>Category</span>,
    renderCell: (params) => {
      const cat = params.row.assignedCategoryName;
      if (!cat) {
        return (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-300">
            Not Assigned
          </span>
        );
      }
      return (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-300">
          {cat}
        </span>
      );
    },
  },
  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    editable: false,
    headerClassName: "text-black font-semibold text-center",
    cellClassName: "text-slate-700 font-normal",
    sortable: false,
    minWidth: 340,
    renderHeader: () => <span>Action</span>,
    renderCell: (params) => {
      return (
        <div className="flex justify-center items-center space-x-2 h-full pt-2">
          <button
            onClick={() => handleCategoryUpdate(params.row)}
            className="flex items-center bg-indigo-500 hover:bg-indigo-600 text-white px-3 h-9 rounded-md text-sm"
          >
            Category
          </button>
          <button
            onClick={() => handleChangePassword(params.row)}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-3 h-9 rounded-md text-sm"
          >
            Password
          </button>
          <button
            onClick={() => handleDelete(params.row)}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 h-9 rounded-md text-sm"
          >
            <FaTrashAlt className="mr-1" />
            Delete
          </button>
        </div>
      );
    },
  },
];