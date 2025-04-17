import { DOMAIN } from '@/constants';
import { Metadata } from 'next';

type SetMetadataProps = {
  title: string;
  description: string;
  urlPath: string;
  image?: string;
};
export const setMetadata = (props: SetMetadataProps) => {
  const { title, description, urlPath, image = '/favicon.svg' } = props;

  return {
    title: title,
    description,
    alternates: {
      canonical: DOMAIN + urlPath,
    },
    openGraph: {
      title: title,
      description,
      url: DOMAIN + urlPath,
      type: 'website',
      siteName: 'Sách',
      locale: 'vi-VN',
      images: image,
    },
    twitter: {
      title: title,
      description,
      card: 'summary',
      images: image,
    },
    referrer: 'origin',
    robots: {
      follow: true,
      index: true,
    },
    metadataBase: new URL(DOMAIN + urlPath),
  } as Metadata;
};
