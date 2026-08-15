'use client';

import Image from 'next/image';

const passthroughLoader = ({ src }) => src;

export default function PortfolioImage({ src, alt, sizes, priority = false }) {
  const isExternal = /^https?:\/\//i.test(src);

  return (
    <Image
      src={src}
      alt={alt}
      width={1600}
      height={1000}
      sizes={sizes}
      priority={priority}
      loader={isExternal ? passthroughLoader : undefined}
      unoptimized={isExternal}
    />
  );
}
