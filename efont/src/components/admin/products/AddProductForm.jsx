import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import InputField from '../../shared/InputField';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addNewProductFromDashboard, fetchCategories, updateProductFromDashboard } from '../../../store/actions';
import toast from 'react-hot-toast';
import Spinners from '../../shared/Spinners';
import SelectTextField from '../../shared/SelectTextField';
import Skeleton from '../../shared/Skeleton';
import ErrorPage from '../../shared/ErrorPage';
import { checkIsAdmin } from '../../../utils/authUtils';
import api from '../../../api/api';

const AddProductForm = ({ setOpen, product, update=false}) => {
const [loader, setLoader] = useState(false);
const [selectedCategory, setSelectedCategory] = useState();
const [sellers, setSellers] = useState([]);
const [selectedSeller, setSelectedSeller] = useState(null);
const [sellerProfile, setSellerProfile] = useState(null);
const { categories } = useSelector((state) => state.products);
const { categoryLoader, errorMessage } = useSelector((state) => state.errors);
const { user } = useSelector((state) => state.auth);
const isAdmin = checkIsAdmin(user);

const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        mode: "onTouched"
    });

    const saveProductHandler = (data) => {
        if(!update) {
            // create new product logic
            const categoryId = isAdmin
                ? selectedCategory?.categoryId
                : sellerProfile?.assignedCategoryId;
            const sendData = {
                ...data,
                categoryId,
                ...(isAdmin && selectedSeller ? { sellerId: selectedSeller.userId } : {}),
            };
            dispatch(addNewProductFromDashboard(
                sendData, toast, reset, setLoader, setOpen, isAdmin
            ));
        } else {
            const sendData = {
                ...data,
                id: product.id,
            };
            dispatch(updateProductFromDashboard(sendData, toast, reset, setLoader, setOpen, isAdmin));
        }
    };


    useEffect(() => {
        if (update && product) {
            setValue("productName", product?.productName);
            setValue("price", product?.price);
            setValue("quantity", product?.quantity);
            setValue("discount", product?.discount);
            setValue("specialPrice", product?.specialPrice);
            setValue("description", product?.description);
        }
    }, [update, product]);


    useEffect(() => {
        if (!update) {
            dispatch(fetchCategories());
        }
    }, [dispatch, update]);

    useEffect(() => {
        if (isAdmin && !update) {
            api.get('/auth/sellers?pageSize=100')
                .then(({ data }) => {
                    setSellers(data.content || []);
                    if (data.content?.length > 0) {
                        setSelectedSeller(data.content[0]);
                    }
                })
                .catch(() => {});
        }
    }, [isAdmin, update]);

    useEffect(() => {
        if (!categoryLoader && categories) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, categoryLoader]);

    useEffect(() => {
        if (!isAdmin && !update) {
            api.get('/seller/profile')
                .then(({ data }) => setSellerProfile(data))
                .catch(() => {});
        }
    }, [isAdmin, update]);

    if (categoryLoader) return <Skeleton />
    if (errorMessage) return <ErrorPage message={errorMessage} />

  return (
    <div className='py-5 relative h-full'>
        <form className='space-y-4'
            onSubmit={handleSubmit(saveProductHandler)}>
            <div className='flex md:flex-row flex-col gap-4 w-full'>
                <InputField 
                    label="Product Name"
                    required
                    id="productName"
                    type="text"
                    message="This field is required*"
                    register={register}
                    placeholder="Product Name"
                    errors={errors}
                    />

                {!update && isAdmin && (
                    <SelectTextField
                        label="Select Categories"
                        select={selectedCategory}
                        setSelect={setSelectedCategory}
                        lists={categories}
                    />
                )}
                {!update && !isAdmin && (
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold text-sm text-slate-800">
                            Your Category
                        </label>
                        <div className="px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-500 bg-gray-50">
                            {sellerProfile?.assignedCategoryName || 'Loading...'}
                        </div>
                    </div>
                )}
            </div>

            {isAdmin && !update && sellers.length > 0 && (
                <div className="flex flex-col gap-2 w-full">
                    <label className="font-semibold text-sm text-slate-800">
                        Assign Seller
                    </label>
                    <select
                        className="px-4 py-2 w-full border border-slate-700 outline-hidden bg-transparent text-slate-800 rounded-md text-sm"
                        value={selectedSeller?.userId ?? ''}
                        onChange={(e) => {
                            const found = sellers.find(s => s.userId === Number(e.target.value));
                            setSelectedSeller(found || null);
                        }}
                    >
                        {sellers.map((s) => (
                            <option key={s.userId} value={s.userId}>
                                {s.userName} ({s.email})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className='flex md:flex-row flex-col gap-4 w-full'>
                <InputField
                    label="Price"
                    required
                    id="price"
                    type="number"
                    message="This field is required*"
                    placeholder="Product Price"
                    register={register}
                    errors={errors}
                    />

                    <InputField
                    label="Quantity"
                    required
                    id="quantity"
                    type="number"
                    message="This field is required*"
                    register={register}
                    placeholder="Product Quantity"
                    errors={errors}
                    registerOptions={{ min: { value: 0, message: "Quantity cannot be negative" } }}
                    />
            </div>
        <div className="flex md:flex-row flex-col gap-4 w-full">
          <InputField
            label="Discount"
            id="discount"
            type="number"
            message="This field is required*"
            placeholder="Product Discount"
            register={register}
            errors={errors}
            registerOptions={{ setValueAs: v => v === "" ? 0 : parseFloat(v) }}
          />
          <InputField
            label="Special Price"
            id="specialPrice"
            type="number"
            message="This field is required*"
            placeholder="Product Special Price"
            register={register}
            errors={errors}
            registerOptions={{ setValueAs: v => v === "" ? 0 : parseFloat(v) }}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
            <label htmlFor='desc'
              className='font-semibold text-sm text-slate-800'>
                Description
            </label>

            <textarea
                rows={5}
                placeholder="Add product description...."
                className={`px-4 py-2 w-full border outline-hidden bg-transparent text-slate-800 rounded-md ${
                    errors["description"]?.message ? "border-red-500" : "border-slate-700" 
                }`}
                maxLength={255}
                {...register("description", {
                    required: {value: true, message:"Description is required"},
                })}
                />

                {errors["description"]?.message && (
                    <p className="text-sm font-semibold text-red-600 mt-0">
                        {errors["description"]?.message}
                    </p>
                )}
        </div>

        <div className='flex w-full justify-between items-center absolute bottom-14'>
            <Button disabled={loader}
                    onClick={() => setOpen(false)}
                    variant='outlined'
                    className='text-white py-[10px] px-4 text-sm font-medium'>
                Cancel
            </Button>

            <Button
                disabled={loader}
                type='submit'
                variant='contained'
                color='primary'
                className='bg-custom-blue text-white  py-[10px] px-4 text-sm font-medium'>
                {loader ? (
                    <div className='flex gap-2 items-center'>
                        <Spinners /> Loading...
                    </div>
                ) : (
                    "Save"
                )}
            </Button>
        </div>
        </form>
    </div>
  )
}

export default AddProductForm