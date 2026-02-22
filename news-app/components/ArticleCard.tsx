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
    <article className="card overflow-hidden group">
      <a href={`/article/${article.id}`} className="block">
        {article.image_url && (
          <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-200">
            {!imageError ? (
              useOptimization ? (
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  quality={85}
                  priority={false}
                  onError={() => setUseOptimization(false)}
                  unoptimized={false}
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
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {article.source_name && (
              <div className="absolute top-3 left-3">
                <span className="inline-block bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {article.source_name}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-5">
          {!article.image_url && article.source_name && (
            <div className="mb-3">
              <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
                {article.source_name}
              </span>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {article.title}
          </h2>

          {article.excerpt && (
            <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              {article.author && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {article.author}
                </span>
              )}
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {publishedDate}
              </span>
            </div>

            <span className="flex items-center text-primary-600 font-medium">
              Oxu
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </a>
    </article>
  );
}
