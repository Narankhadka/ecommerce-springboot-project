import React, { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { sellerTableColumns } from "../../helper/tableColumn";

const SellerTable = ({ sellers, pagination, onDelete, onChangePassword, onCategoryUpdate }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pathname = useLocation().pathname;
  const params = new URLSearchParams(searchParams);
  const [currentPage, setCurrentPage] = useState(pagination?.pageNumber || 1);

  const tableRecords = sellers?.map((item) => {
    return {
      id: item.userId,
      username: item.userName,
      email: item.email,
      shopName: item.shopName || null,
      shopLocation: item.shopLocation || null,
      phoneNumber: item.phoneNumber || null,
      assignedCategoryId: item.assignedCategoryId || null,
      assignedCategoryName: item.assignedCategoryName || null,
    };
  });

  const handlePaginationChange = (paginationModel) => {
    const page = paginationModel.page + 1;
    setCurrentPage(page);

    params.set("page", page.toString());
    navigate(`${pathname}?${params}`);
  };

  const columns = sellerTableColumns(onDelete, onChangePassword, onCategoryUpdate);

  return (
    <div>
      <div className="max-w-fit mx-auto">
        <DataGrid
          className="w-full"
          rows={tableRecords}
          paginationMode="server"
          rowCount={pagination?.totalElements || 0}
          columns={columns}
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
    </div>
  );
};

export default SellerTable;
