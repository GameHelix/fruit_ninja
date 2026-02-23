'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl = '/' }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build page URL — handles both '/' and '/?q=...&source=...' correctly
  const pageUrl = (page: number) => {
    if (page === 1) return baseUrl;
    const sep = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${sep}page=${page}`;
  };

  const pages: (number | string)[] = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  } else {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12 mb-6">
      {/* Previous */}
      {currentPage > 1 ? (
        <a
          href={pageUrl(currentPage - 1)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Əvvəlki
        </a>
      ) : (
        <span className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Əvvəlki
        </span>
      )}

      {/* Page numbers (desktop) */}
      <div className="hidden sm:flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm">
                &hellip;
              </span>
            );
          }
          const n = page as number;
          return (
            <a
              key={n}
              href={pageUrl(n)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                n === currentPage
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
              }`}
            >
              {n}
            </a>
          );
        })}
      </div>

      {/* Mobile: current / total */}
      <div className="sm:hidden px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
        {currentPage} / {totalPages}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <a
          href={pageUrl(currentPage + 1)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-sm font-medium text-gray-700 shadow-sm"
        >
          Növbəti
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      ) : (
        <span className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-300 cursor-not-allowed">
          Növbəti
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </div>
  );
}
