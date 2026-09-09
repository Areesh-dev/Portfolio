import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import Container from '../components/Container.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SkillsGrid from '../components/SkillsGrid.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';
import { useSiteContent } from '../hooks/useSiteContent.jsx';
import { setPageMeta } from '../utils/seo.js';

export default function AllSkills() {
  const { content } = useSiteContent();
  const { data: skills, loading } = useFetch(() => publicApi.skills(), []);

  useEffect(() => {
    setPageMeta({
      title: content?.site_title ? `Skills — ${content.site_title}` : 'Skills',
      description: 'The full technology and skills breakdown.',
    });
  }, [content]);

  return (
    <Layout>
      <Container className="py-16">
        <Link to="/#skills" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="mb-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Skills</h1>
        <p className="mb-10 text-sm text-ink/50">A personal proficiency indicator — a subjective self-assessment, not an objective benchmark.</p>

        {loading && <Loader label="Loading skills…" />}
        {!loading && (!skills || skills.length === 0) && <EmptyState icon={Layers} title="No skills added yet." />}
        {!loading && skills?.length > 0 && <SkillsGrid skills={skills} />}
      </Container>
    </Layout>
  );
}
