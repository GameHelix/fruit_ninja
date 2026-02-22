'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl = '/' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages);
  } else {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-12 mb-8">
      {/* Previous button */}
      {currentPage > 1 ? (
        <a
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          ← Əvvəlki
        </a>
      ) : (
        <span className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed font-medium">
          ← Əvvəlki
        </span>
      )}

      {/* Page numbers */}
      <div className="hidden sm:flex items-center space-x-1">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <a
              key={pageNumber}
              href={`${baseUrl}?page=${pageNumber}`}
              className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </a>
          );
        })}
      </div>

      {/* Mobile: Show current page */}
      <div className="sm:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
        <span className="text-gray-700 font-medium">
          {currentPage} / {totalPages}
        </span>
      </div>

      {/* Next button */}
      {currentPage < totalPages ? (
        <a
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          Növbəti →
        </a>
      ) : (
        <span className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed font-medium">
          Növbəti →
        </span>
      )}
    </div>
  );
}
