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

  const hasImage = article.image_url && !imageError;

  return (
    <article className="group border-b border-gray-100 last:border-0">
      <a href={`/article/${article.id}`} className="flex gap-4 py-4 hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors">
        {/* Thumbnail — only shown when image is available */}
        {hasImage && (
          <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-100">
            {useOptimization ? (
              <Image
                src={article.image_url!}
                alt={article.title}
                fill
                sizes="96px"
                className="object-cover"
                quality={75}
                priority={false}
                onError={() => setUseOptimization(false)}
              />
            ) : (
              <img
                src={article.image_url!}
                alt={article.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0 justify-between">
          <div>
            {/* Source + date row */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {article.source_name && (
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full shrink-0">
                  {article.source_name}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {publishedDate}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
              {article.title}
            </h2>

            {/* Excerpt — hidden on small screens */}
            {article.excerpt && (
              <p className="hidden sm:block text-gray-500 text-xs mt-1 line-clamp-1 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>

          {/* Bottom row */}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            {article.view_count > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {article.view_count}
              </span>
            )}
            <span className="ml-auto flex items-center gap-0.5 text-primary-600 font-semibold">
              Oxu
              <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
