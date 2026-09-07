'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center my-10 gap-1.5 sm:gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Previous Page"
        className="p-2 border border-gray-300 cursor-pointer rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white shadow-2xs"
      >
        <ChevronLeft size={18} className="text-gray-600" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-gray-400 text-sm select-none"
              >
                •••
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center cursor-pointer justify-center rounded-md text-sm font-semibold transition-all ${
                isCurrent
                  ? 'bg-[#004a99] text-white border border-[#004a99] shadow-2xs'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
              }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
        className="p-2 border border-gray-300 cursor-pointer rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white shadow-2xs"
      >
        <ChevronRight size={18} className="text-gray-600" />
      </button>
    </div>
  );
}
