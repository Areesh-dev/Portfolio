import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import Container from '../components/Container.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';
import { useSiteContent } from '../hooks/useSiteContent.jsx';
import { setPageMeta } from '../utils/seo.js';

export default function AllServices() {
  const { content } = useSiteContent();
  const { data: services, loading } = useFetch(() => publicApi.services(), []);

  useEffect(() => {
    setPageMeta({
      title: content?.site_title ? `Services — ${content.site_title}` : 'Services',
      description: 'Everything I can help you with.',
    });
  }, [content]);

  return (
    <Layout>
      <Container className="py-16">
        <Link to="/#services" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="mb-10 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Services</h1>

        {loading && <Loader label="Loading services…" />}
        {!loading && (!services || services.length === 0) && (
          <EmptyState icon={Briefcase} title="No services available yet." />
        )}
        {!loading && services?.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        )}
      </Container>
    </Layout>
  );
}
