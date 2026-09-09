import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Quote } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import Container from '../components/Container.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import TestimonialCard from '../components/TestimonialCard.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';
import { useSiteContent } from '../hooks/useSiteContent.jsx';
import { setPageMeta } from '../utils/seo.js';

export default function AllTestimonials() {
  const { content } = useSiteContent();
  const { data: reviews, loading } = useFetch(() => publicApi.reviews(), []);

  useEffect(() => {
    setPageMeta({
      title: content?.site_title ? `Testimonials — ${content.site_title}` : 'Testimonials',
      description: 'What clients say.',
    });
  }, [content]);

  return (
    <Layout>
      <Container className="py-16">
        <Link to="/#testimonials" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="mb-10 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Testimonials</h1>

        {loading && <Loader label="Loading testimonials…" />}
        {!loading && (!reviews || reviews.length === 0) && (
          <EmptyState icon={Quote} title="No testimonials yet." />
        )}
        {!loading && reviews?.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, i) => (
              <TestimonialCard key={review.id} review={review} index={i} />
            ))}
          </div>
        )}
      </Container>
    </Layout>
  );
}
