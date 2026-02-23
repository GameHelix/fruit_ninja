'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  initialQuery?: string;
  sourceId?: number;
}

export default function SearchBar({ initialQuery = '', sourceId }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (sourceId) params.set('source', sourceId.toString());

    router.push(params.toString() ? `/?${params.toString()}` : '/');
  };

  const handleClear = () => {
    setQuery('');
    router.push(sourceId ? `/?source=${sourceId}` : '/');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-6">
      <div className="relative">
        {/* Search icon */}
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Xəbərlərdə axtar..."
          className="w-full pl-12 pr-36 py-4 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/60 shadow-lg text-sm sm:text-base"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
              aria-label="Axtarışı təmizlə"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors font-semibold text-sm shadow-sm"
          >
            Axtar
          </button>
        </div>
      </div>
    </form>
  );
}
