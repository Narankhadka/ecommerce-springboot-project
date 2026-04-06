
const btnStyles = "border-[1.2px] border-slate-800 px-3 py-1 rounded-sm";
const disabledStyles = "border-[1.2px] border-slate-300 px-3 py-1 rounded-sm text-slate-300 cursor-not-allowed";

const SetQuantity = ({
    quantity,
    cardCounter,
    handeQtyIncrease,
    handleQtyDecrease,
    updating,
}) => {
   return (
   <div className="flex gap-8 items-center">
        {cardCounter ? null : <div className="font-semibold">QUANTITY</div>}
        <div className="flex md:flex-row flex-col gap-4 items-center lg:text-[22px] text-sm">
            <button
                disabled={updating || quantity <= 1}
                className={updating || quantity <= 1 ? disabledStyles : btnStyles}
                onClick={handleQtyDecrease}>
                -
            </button>
                <div className="text-red-500">{updating ? "..." : quantity}</div>
            <button
                disabled={updating}
                className={updating ? disabledStyles : btnStyles}
                onClick={handeQtyIncrease}>
                +
            </button>
        </div>
    </div>
   );
};

export default SetQuantity;
