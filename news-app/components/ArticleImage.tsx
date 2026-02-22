'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ArticleImageProps {
  src: string;
  alt: string;
}

export default function ArticleImage({ src, alt }: ArticleImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return null;
  }

  return (
    <div className="relative h-96 bg-gray-200">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        className="object-cover"
        quality={90}
        priority={true}
        onError={() => setImageError(true)}
      />
    </div>
  );
}
