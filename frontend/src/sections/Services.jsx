import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import Container from '../components/Container.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import Button from '../components/Button.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';

const PREVIEW_LIMIT = 6;

export default function Services() {
  const { data: services, loading } = useFetch(() => publicApi.services(), []);
  const preview = (services || []).slice(0, PREVIEW_LIMIT);

  return (
    <section id="services" className="bg-white/[0.02] py-24">
      <SectionHeading eyebrow="Services" title="What I can help you with" align="left" />
      <Container>
        {loading && <Loader label="Loading services…" />}
        {!loading && (!services || services.length === 0) && (
          <EmptyState icon={Briefcase} title="No services available yet." />
        )}
        {!loading && preview.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>

            {services.length > PREVIEW_LIMIT && (
              <div className="mt-12 flex justify-center">
                <Button as={Link} to="/services" variant="outline">
                  View All Services <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
