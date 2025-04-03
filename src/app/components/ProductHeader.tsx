const ProductHeader = ({ productCount }: { productCount: number | null }) => {
  return (
    <div className="pb-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-gray-100">
        Available Products
      </h1>
      <h2 className="text-lg font-semibold text-center text-gray-500 dark:text-gray-400 mt-2">
        Filter by quantity, price, or name to find exactly what you need.
      </h2>
      {productCount !== null && (
        <p className="text-sm text-center text-gray-400 dark:text-gray-500 mt-1">
          {productCount} products available
        </p>
      )}
    </div>
  );
};

export default ProductHeader;
