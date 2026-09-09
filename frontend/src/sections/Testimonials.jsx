import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import Container from '../components/Container.jsx';
import TestimonialCard from '../components/TestimonialCard.jsx';
import Button from '../components/Button.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';

const PREVIEW_LIMIT = 6;

export default function Testimonials() {
  const { data: reviews } = useFetch(() => publicApi.reviews(), []);

  if (!reviews || reviews.length === 0) return null;

  const preview = reviews.slice(0, PREVIEW_LIMIT);

  return (
    <section id="testimonials" className="py-24">
      <SectionHeading eyebrow="Testimonials" title="What clients say" align="center" />
      <Container>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((review, i) => (
            <TestimonialCard key={review.id} review={review} index={i} />
          ))}
        </div>

        {reviews.length > PREVIEW_LIMIT && (
          <div className="mt-12 flex justify-center">
            <Button as={Link} to="/testimonials" variant="outline">
              View All Testimonials <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
