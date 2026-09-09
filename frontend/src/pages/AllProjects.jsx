import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FolderKanban } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import Container from '../components/Container.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';
import { useSiteContent } from '../hooks/useSiteContent.jsx';
import { setPageMeta } from '../utils/seo.js';

export default function AllProjects() {
  const { content } = useSiteContent();
  const { data: projects, loading } = useFetch(() => publicApi.projects(), []);

  useEffect(() => {
    setPageMeta({
      title: content?.site_title ? `Projects — ${content.site_title}` : 'All Projects',
      description: 'Every published project in one place.',
    });
  }, [content]);

  return (
    <Layout>
      <Container className="py-16">
        <Link to="/#projects" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="mb-10 text-3xl font-bold tracking-tight text-ink sm:text-4xl">All Projects</h1>

        {loading && <Loader label="Loading projects…" />}
        {!loading && (!projects || projects.length === 0) && (
          <EmptyState icon={FolderKanban} title="No projects available yet." description="Published projects will show up here." />
        )}
        {!loading && projects?.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </Container>
    </Layout>
  );
}
