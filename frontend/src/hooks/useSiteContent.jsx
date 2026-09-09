import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useFetch } from './useFetch.js';
import { publicApi } from '../lib/api.js';
import PageLoader from '../components/PageLoader.jsx';

const SiteContentContext = createContext(null);

// Fetched once for the whole public-site route tree (mounted at a shared
// parent route in App.jsx) and shared by every section, so navigating
// between the home page and a project detail page doesn't re-fetch the
// same site-wide copy or re-show the boot splash.
export function SiteContentProvider({ children }) {
  const { data, loading } = useFetch(() => publicApi.siteContent(), []);
  // Only ever show the full-page splash on the very first load of the
  // session — once flipped true it never goes back, even if a later
  // refetch sets loading true again.
  const [everLoaded, setEverLoaded] = useState(false);

  useEffect(() => {
    if (!loading) setEverLoaded(true);
  }, [loading]);

  return (
    <SiteContentContext.Provider value={{ content: data, loading }}>
      <AnimatePresence>{!everLoaded && <PageLoader key="loader" label={data?.site_title || 'Portfolio'} />}</AnimatePresence>
      {everLoaded && children}
    </SiteContentContext.Provider>
  );
}

export const useSiteContent = () => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used within SiteContentProvider');
  return ctx;
};
