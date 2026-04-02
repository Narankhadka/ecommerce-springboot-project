import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdPersonAdd } from "react-icons/md";
import toast from "react-hot-toast";

import SellerTable from "./SellerTable";
import ErrorPage from "../../shared/ErrorPage";
import Loader from "../../shared/Loader";
import Modal from "../../shared/Modal";
import DeleteModal from "../../shared/DeleteModal";
import AddSellerForm from "./AddSellerForm";
import useSellerFilter from "./useSellerFilter";
import { deleteSeller, changeSellerPassword } from "../../../store/actions";

const Sellers = () => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordLoader, setPasswordLoader] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const { sellers, pagination } = useSelector((state) => state.seller);
  const { isLoading, errorMessage } = useSelector((state) => state.errors);

  useSellerFilter();

  const emptySellers = !sellers || sellers?.length === 0;

  const handleDeleteClick = (row) => {
    setSelectedSeller(row);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedSeller) return;
    dispatch(deleteSeller(selectedSeller.id, toast, setDeleteLoader, setDeleteModalOpen));
  };

  const handleChangePasswordClick = (row) => {
    setSelectedSeller(row);
    setNewPassword("");
    setPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!selectedSeller || !newPassword.trim()) return;
    dispatch(changeSellerPassword(selectedSeller.id, newPassword, toast, setPasswordLoader, setPasswordModalOpen));
  };

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return (
    <React.Fragment>
      <div className="pt-6 pb-10 flex justify-end">
        <button
          onClick={() => setOpenModal(true)}
          className="bg-custom-blue hover:bg-blue-800 text-white font-semibold py-2 px-4 flex items-center gap-2 rounded-md shadow-md transition-colors hover:text-slate-300 duration-300"
        >
          <MdPersonAdd className="text-xl" />
          Add Seller
        </button>
      </div>

      {!emptySellers && (
        <h1 className="text-slate-800 text-3xl text-center font-bold pb-6 uppercase">
          All Sellers
        </h1>
      )}

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {emptySellers ? (
            <div className="flex flex-col items-center justify-center text-gray-600 py-10">
              <h2 className="text-2xl font-semibold">No Seller Created Yet</h2>
            </div>
          ) : (
            <SellerTable
              sellers={sellers}
              pagination={pagination}
              onDelete={handleDeleteClick}
              onChangePassword={handleChangePasswordClick}
            />
          )}
        </>
      )}

      <Modal open={openModal} setOpen={setOpenModal} title="Add New Seller">
        <AddSellerForm setOpen={setOpenModal} />
      </Modal>

      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        title={`Delete seller: ${selectedSeller?.username}`}
        onDeleteHandler={handleDeleteConfirm}
        loader={deleteLoader}
      />

      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75"
            onClick={() => setPasswordModalOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-10">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Change Password — {selectedSeller?.username}
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-800">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="px-4 py-2 border border-slate-700 rounded-md text-sm text-slate-800 outline-none bg-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  disabled={passwordLoader}
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoader}
                  className="px-4 py-2 text-sm font-semibold rounded-md bg-custom-blue text-white hover:bg-blue-800"
                >
                  {passwordLoader ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Sellers;