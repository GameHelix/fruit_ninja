'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ArticleImageProps {
  src: string;
  alt: string;
}

export default function ArticleImage({ src, alt }: ArticleImageProps) {
  const [imageError, setImageError] = useState(false);
  const [useOptimization, setUseOptimization] = useState(true);

  return (
    <div className="relative h-96 bg-gray-200">
      {!imageError ? (
        useOptimization ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
            quality={90}
            priority={true}
            onError={() => setUseOptimization(false)}
            unoptimized={false}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-400">Şəkil yüklənmədi</p>
          </div>
        </div>
      )}
    </div>
  );
}
