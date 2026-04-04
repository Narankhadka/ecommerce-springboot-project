import React, { useEffect, useState } from 'react'
import InputField from '../shared/InputField'
import { useForm } from 'react-hook-form';
import { FaAddressCard } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Spinners from '../shared/Spinners';
import toast from 'react-hot-toast';
import { addUpdateUserAddress } from '../../store/actions';
import LocationPicker from './LocationPicker';

const AddAddressForm = ({ address, setOpenAddressModal }) => {
    const dispatch = useDispatch();
    const { btnLoader } = useSelector((state) => state.errors);
    const [locationData, setLocationData] = useState(null);
    const {
            register,
            handleSubmit,
            reset,
            setValue,
            formState: {errors},
        } = useForm({
            mode: "onTouched",
        });

        const onSaveAddressHandler = async (data) => {
            const addressPayload = {
                ...data,
                latitude: locationData?.latitude ?? null,
                longitude: locationData?.longitude ?? null,
                mapAddress: locationData?.mapAddress ?? null,
            };
            dispatch(addUpdateUserAddress(
                addressPayload,
                toast,
                address?.addressId,
                setOpenAddressModal
            ));
        };

        const handleLocationSelect = (loc) => {
            setLocationData(loc);
            if (!loc) return;
            if (loc.city)     setValue('city',     loc.city,     { shouldValidate: true });
            if (loc.state)    setValue('state',    loc.state,    { shouldValidate: true });
            if (loc.pincode)  setValue('pincode',  loc.pincode,  { shouldValidate: true });
            if (loc.street)   setValue('street',   loc.street,   { shouldValidate: true });
            if (loc.country)  setValue('country',  loc.country,  { shouldValidate: true });
        };


        useEffect(() => {
            if (address?.addressId) {
                setValue("buildingName", address?.buildingName);
                setValue("city", address?.city);
                setValue("street", address?.street);
                setValue("state", address?.state);
                setValue("pincode", address?.pincode);
                setValue("country", address?.country);
            }
        }, [address]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <form
                onSubmit={handleSubmit(onSaveAddressHandler)}
                style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

                    <div className="flex justify-center items-center mb-3 font-semibold text-xl text-slate-800 py-1 px-4">
                        <FaAddressCard className="mr-2 text-xl"/>
                        {!address?.addressId ?
                        "Add Address" :
                        "Update Address"
                        }
                    </div>

                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <InputField
                            label="Building Name (optional)"
                            id="buildingName"
                            type="text"
                            placeholder="Enter Building Name"
                            register={register}
                            errors={errors}
                            labelStyle={{ fontSize: '0.85rem' }}
                            inputStyle={{ padding: '8px 10px' }}
                            />

                        <InputField
                            label="City"
                            required
                            id="city"
                            type="text"
                            message="*City is required"
                            placeholder="Enter City"
                            register={register}
                            errors={errors}
                            labelStyle={{ fontSize: '0.85rem' }}
                            inputStyle={{ padding: '8px 10px' }}
                            />

                        <InputField
                            label="State"
                            required
                            id="state"
                            type="text"
                            message="*State is required"
                            placeholder="Enter State"
                            register={register}
                            errors={errors}
                            labelStyle={{ fontSize: '0.85rem' }}
                            inputStyle={{ padding: '8px 10px' }}
                            />

                        <InputField
                            label="Pincode"
                            required
                            id="pincode"
                            type="text"
                            message="*Pincode is required"
                            placeholder="Enter Pincode"
                            register={register}
                            errors={errors}
                            labelStyle={{ fontSize: '0.85rem' }}
                            inputStyle={{ padding: '8px 10px' }}
                            />

                        <InputField
                            label="Street"
                            required
                            id="street"
                            type="text"
                            message="*Street is required"
                            placeholder="Enter Street"
                            register={register}
                            errors={errors}
                            labelStyle={{ fontSize: '0.85rem' }}
                            inputStyle={{ padding: '8px 10px' }}
                            />

                        <InputField
                            label="Country"
                            required
                            id="country"
                            type="text"
                            message="*Country is required"
                            placeholder="Enter Country"
                            register={register}
                            errors={errors}
                            labelStyle={{ fontSize: '0.85rem' }}
                            inputStyle={{ padding: '8px 10px' }}
                            />
                    </div>

                    <div style={{ marginTop: '12px' }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                            Pin Location on Map
                            <span style={{ marginLeft: '4px', fontSize: '0.75rem', fontWeight: '400', color: '#9ca3af' }}>(optional)</span>
                        </p>
                        <LocationPicker
                            onLocationSelect={handleLocationSelect}
                            mapHeight={200}
                            buttonStyle={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            successBoxStyle={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        />
                    </div>
                </div>

                <div style={{
                    position: 'sticky',
                    bottom: 0,
                    backgroundColor: 'white',
                    padding: '12px 0',
                    borderTop: '1px solid #e5e7eb',
                    marginTop: '16px'
                }}>
                    <button
                        disabled={btnLoader}
                        className="text-white bg-custom-blue px-4 py-2 rounded-md w-full"
                        type="submit">
                        {btnLoader ? (
                            <>
                            <Spinners /> Loading...
                            </>
                        ) : (
                            <>Save Address</>
                        )}
                    </button>
                </div>
            </form>
        </div>
  )
}

export default AddAddressForm
