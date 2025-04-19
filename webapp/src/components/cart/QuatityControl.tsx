type QuantityControlProps = {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: QuantityControlProps) {
  return (
    <div className="flex items-center">
      <button
        onClick={onDecrease}
        type="button"
        className="inline-flex h-5 w-5 hover:cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
      >
        <svg
          className="h-2.5 w-2.5 text-gray-900"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        type="text"
        className="w-10 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none"
        value={quantity}
        readOnly
      />
      <button
        onClick={onIncrease}
        type="button"
        className="inline-flex h-5 w-5 hover:cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
      >
        <svg
          className="h-2.5 w-2.5 text-gray-900"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
  );
}
