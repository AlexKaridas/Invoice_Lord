import { Dispatch, SetStateAction } from "react";

interface PageButtonsProps {
  total_products: number | null;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export default function PageButtons({ total_products, page, setPage }: PageButtonsProps) {
  const lastPage = total_products ? Math.ceil(total_products / 9) - 1 : 0;

  const baseButton =
    "relative rounded-lg shadow-sm overflow-hidden font-medium text-sm transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-4 py-2";
  const inactive =
    "bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white hover:scale-105 cursor-pointer";
  const active = "bg-blue-600 text-white shadow-lg scale-105 cursor-default";
  const ellipsisClass = "text-gray-500 text-xl";

  const renderPageButton = (pageNumber: number) => {
    const isActive = pageNumber === page;
    return (
      <button
        key={pageNumber}
        onClick={() => !isActive && setPage(pageNumber)}
        className={`${baseButton} ${isActive ? active : inactive}`}
        disabled={isActive}
      >
        {pageNumber}
      </button>
    );
  };

  if (lastPage <= 0) {
    return null;
  }

  return (
    <div className="h-20 mt-10 flex flex-wrap gap-4 w-full items-center justify-center">
      {renderPageButton(0)}

      {page > 2 && <span className={ellipsisClass}>...</span>}

      {page > 0 && page - 1 > 0 && renderPageButton(page - 1)}
      {page !== 0 && page !== lastPage && renderPageButton(page)}
      {page < lastPage && page + 1 < lastPage && renderPageButton(page + 1)}

      {page < lastPage - 2 && <span className={ellipsisClass}>...</span>}

      {renderPageButton(lastPage)}
    </div>
  );
}

