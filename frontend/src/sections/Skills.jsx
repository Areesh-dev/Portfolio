import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import Container from '../components/Container.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SkillsGrid from '../components/SkillsGrid.jsx';
import Button from '../components/Button.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';

const PREVIEW_PER_CATEGORY = 5;

export default function Skills() {
  const { data: skills, loading } = useFetch(() => publicApi.skills(), []);
  const previewCount = (skills || []).length
    ? Object.values(
        skills.reduce((acc, s) => {
          (acc[s.category] ||= []).push(s);
          return acc;
        }, {})
      ).reduce((sum, items) => sum + Math.min(items.length, PREVIEW_PER_CATEGORY), 0)
    : 0;
  const truncated = (skills?.length || 0) > previewCount;

  return (
    <section id="skills" className="py-24">
      <SectionHeading
        eyebrow="Skills"
        title="Technologies I work with"
        description="A personal proficiency indicator — a subjective self-assessment, not an objective benchmark."
      />
      <Container>
        {loading && <Loader label="Loading skills…" />}
        {!loading && (!skills || skills.length === 0) && <EmptyState icon={Layers} title="No skills added yet." />}
        {!loading && skills?.length > 0 && (
          <>
            <SkillsGrid skills={skills} perCategoryLimit={PREVIEW_PER_CATEGORY} />

            {truncated && (
              <div className="mt-12 flex justify-center">
                <Button as={Link} to="/skills" variant="outline">
                  View All Skills <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
