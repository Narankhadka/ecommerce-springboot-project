import { Button, Step, StepLabel, Stepper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddressInfo from './AddressInfo';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAddresses } from '../../store/actions';
import toast from 'react-hot-toast';
import Skeleton from '../shared/Skeleton';
import ErrorPage from '../shared/ErrorPage';
import PaymentMethod from './PaymentMethod';
import OrderSummary from './OrderSummary';
import KhaltiPayment from './KhaltiPayment';
import EsewaPayment from './EsewaPayment';
import CodPayment from './CodPayment';

const steps = ['Address', 'Payment Method', 'Order Summary', 'Payment'];

const Checkout = () => {
    const [activeStep, setActiveStep] = useState(0);
    const dispatch = useDispatch();
    const { isLoading, errorMessage } = useSelector((state) => state.errors);
    const { cart, totalPrice } = useSelector((state) => state.carts);
    const { address, selectedUserCheckoutAddress } = useSelector((state) => state.auth);
    const { paymentMethod } = useSelector((state) => state.payment);

    useEffect(() => {
        dispatch(getUserAddresses());
    }, [dispatch]);

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleNext = () => {
        // Step 0 validation: address required
        if (activeStep === 0 && !selectedUserCheckoutAddress) {
            toast.error('Please select a delivery address before proceeding.');
            return;
        }
        // Step 1 validation: payment method required
        if (activeStep === 1 && !paymentMethod) {
            toast.error('Please select a payment method before proceeding.');
            return;
        }
        // Step 2 validation: non-empty cart
        if (activeStep === 2 && (!cart || cart.length === 0)) {
            toast.error('Your cart is empty. Please add items before checking out.');
            return;
        }
        setActiveStep((prev) => prev + 1);
    };

    const isNextDisabled =
        errorMessage ||
        (activeStep === 0 && !selectedUserCheckoutAddress) ||
        (activeStep === 1 && !paymentMethod);

    const renderPaymentStep = () => {
        switch (paymentMethod) {
            case 'Khalti':
                return <KhaltiPayment />;
            case 'eSewa':
                return <EsewaPayment />;
            case 'COD':
                return <CodPayment />;
            default:
                return (
                    <div className='max-w-md mx-auto p-6 text-center text-gray-500 mt-10'>
                        No payment method selected.
                    </div>
                );
        }
    };

    return (
        <div className='py-14 min-h-[calc(100vh-100px)]'>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {isLoading ? (
                <div className='lg:w-[80%] mx-auto py-5'>
                    <Skeleton />
                </div>
            ) : (
                <div className='mt-5'>
                    {activeStep === 0 && <AddressInfo address={address} />}
                    {activeStep === 1 && <PaymentMethod />}
                    {activeStep === 2 && (
                        <OrderSummary
                            totalPrice={totalPrice}
                            cart={cart}
                            address={selectedUserCheckoutAddress}
                            paymentMethod={paymentMethod}
                        />
                    )}
                    {activeStep === 3 && renderPaymentStep()}
                </div>
            )}

            {/* Fixed bottom navigation bar */}
            <div
                className='flex justify-between items-center px-4 fixed z-50 h-24 bottom-0 bg-white left-0 w-full py-4 border-slate-200'
                style={{ boxShadow: '0 -2px 4px rgba(100, 100, 100, 0.15)' }}
            >
                <Button
                    variant='outlined'
                    disabled={activeStep === 0}
                    onClick={handleBack}
                >
                    Back
                </Button>

                {/* Hide the "Proceed" button on the last payment step */}
                {activeStep !== steps.length - 1 && (
                    <button
                        disabled={!!isNextDisabled}
                        className={`bg-custom-blue font-semibold px-6 h-10 rounded-md text-white ${
                            isNextDisabled ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                        onClick={handleNext}
                    >
                        Proceed
                    </button>
                )}
            </div>

            {errorMessage && <ErrorPage message={errorMessage} />}
        </div>
    );
};

export default Checkout;
