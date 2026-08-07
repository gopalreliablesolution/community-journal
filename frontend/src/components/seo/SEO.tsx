import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

const DEFAULT_SEO = {
  siteName: 'Inkora',
  title: 'Inkora - Community Publishing Platform',
  description: 'A modern community publishing platform for writers and readers.',
  image: '/og-default.png',
  type: 'website',
};

export default function SEO({
  title,
  description,
  image,
  url,
  type = DEFAULT_SEO.type,
  siteName = DEFAULT_SEO.siteName,
}: SEOProps) {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;
  const pageTitle = title ? `${title} | ${siteName}` : DEFAULT_SEO.title;
  const pageDescription = description || DEFAULT_SEO.description;
  const pageImage = image || DEFAULT_SEO.image;

  useEffect(() => {
    document.title = pageTitle;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', pageDescription);
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', pageDescription, true);
    setMeta('og:image', pageImage, true);
    setMeta('og:url', currentUrl, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', siteName, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', pageDescription);
    setMeta('twitter:image', pageImage);
  }, [pageTitle, pageDescription, pageImage, currentUrl, type, siteName]);

  return null;
}
