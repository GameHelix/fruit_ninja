'use client';

import { formatDistanceToNow } from 'date-fns';
import { az } from 'date-fns/locale';
import { Article } from '@/lib/db';
import Image from 'next/image';
import { useState } from 'react';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const [useOptimization, setUseOptimization] = useState(true);

  const publishedDate = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: az })
    : formatDistanceToNow(new Date(article.scraped_at), { addSuffix: true, locale: az });

  return (
    <article className="card overflow-hidden group flex flex-col">
      <a href={`/article/${article.id}`} className="flex flex-col flex-1">
        {/* Image */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100 shrink-0">
          {article.image_url && !imageError ? (
            useOptimization ? (
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                quality={80}
                priority={false}
                onError={() => setUseOptimization(false)}
              />
            ) : (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Source badge */}
          {article.source_name && (
            <div className="absolute top-3 left-3">
              <span className="inline-block bg-primary-600/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                {article.source_name}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          {/* Source badge (no image variant) */}
          {!article.image_url && article.source_name && (
            <span className="inline-block self-start mb-2 bg-primary-50 text-primary-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {article.source_name}
            </span>
          )}

          <h2 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug flex-1">
            {article.title}
          </h2>

          {article.excerpt && (
            <p className="text-gray-500 mb-3 line-clamp-2 text-sm leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-50">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex items-center gap-1 shrink-0">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {publishedDate}
              </span>
              {article.view_count > 0 && (
                <span className="flex items-center gap-1 shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {article.view_count}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1 text-primary-600 font-semibold shrink-0 ml-2">
              Oxu
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
