'use client';

import { useState } from 'react';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              bir<span className="text-primary-600">news</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            <a
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Ana səhifə
            </a>
            <a
              href="/#sources"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              Mənbələr
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            aria-label="Menyunu aç"
            aria-expanded={open}
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="sm:hidden border-t border-gray-100 py-2 space-y-0.5">
            <a
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
            >
              Ana səhifə
            </a>
            <a
              href="/#sources"
              onClick={() => setOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
            >
              Mənbələr
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
