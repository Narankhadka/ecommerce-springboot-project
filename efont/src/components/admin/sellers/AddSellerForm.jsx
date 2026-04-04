import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addNewDashboardSeller, fetchCategories } from "../../../store/actions";
import InputField from "../../shared/InputField";
import Spinners from "../../shared/Spinners";

const AddSellerForm = ({ setOpen }) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const { categories } = useSelector((state) => state.products);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const addSellerHandler = (data) => {
    const sendData = {
      ...data,
      categoryId: Number(data.categoryId),
      roles: ["seller"],
    };
    dispatch(addNewDashboardSeller(sendData, toast, reset, setOpen, setLoader));
  };

  return (
    <div className="py-5 relative h-full">
      <form className="space-y-4" onSubmit={handleSubmit(addSellerHandler)}>
        <div className="flex flex-col gap-4 w-full">
          <InputField
            label="UserName"
            required
            id="username"
            type="text"
            message="*UserName is required"
            placeholder="Enter username"
            register={register}
            errors={errors}
          />
          <InputField
            label="Email"
            required
            id="email"
            type="email"
            message="*Email is required"
            placeholder="Enter email"
            register={register}
            errors={errors}
          />
          <InputField
            label="Password"
            required
            id="password"
            type="password"
            message="*Password is required"
            placeholder="Enter password"
            register={register}
            errors={errors}
          />

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm text-slate-800">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("categoryId", { required: "*Category is required" })}
              className="px-4 py-2 border border-slate-700 rounded-md text-sm text-slate-800 outline-none bg-transparent"
            >
              <option value="">Select category</option>
              {(categories || []).map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm font-semibold text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <InputField
            label="Shop Name"
            required
            id="shopName"
            type="text"
            message="*Shop name is required"
            placeholder="Enter shop name"
            register={register}
            errors={errors}
          />
          <InputField
            label="Shop Location"
            required
            id="shopLocation"
            type="text"
            message="*Shop location is required"
            placeholder="Enter shop location"
            register={register}
            errors={errors}
          />
          <InputField
            label="Phone Number"
            id="phoneNumber"
            type="text"
            message=""
            placeholder="Enter phone number (optional)"
            register={register}
            errors={errors}
          />
        </div>

        <div className="flex w-full justify-between items-center absolute bottom-14">
          <button
            disabled={loader}
            onClick={() => setOpen(false)}
            type="button"
            className="border border-blue-500 rounded-[5px] font-metropolis text-textColor py-[10px] px-4 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            disabled={loader}
            type="submit"
            className="font-metropolis rounded-[5px] bg-custom-blue hover:bg-blue-800 text-white py-[10px] px-4 text-sm font-medium"
          >
            {loader ? (
              <div className="flex gap-2 items-center">
                <Spinners /> Loading..
              </div>
            ) : (
              "Add New Seller"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSellerForm;
