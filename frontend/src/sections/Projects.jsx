import { Link } from 'react-router-dom';
import { FolderKanban, ArrowRight } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import Container from '../components/Container.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import Button from '../components/Button.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';

const PREVIEW_LIMIT = 6;

export default function Projects() {
  const { data: projects, loading } = useFetch(() => publicApi.projects(), []);
  const preview = (projects || []).slice(0, PREVIEW_LIMIT);

  return (
    <section id="projects" className="py-24">
      <SectionHeading eyebrow="Projects" title="Selected work" align="left" />
      <Container>
        {loading && <Loader label="Loading projects…" />}
        {!loading && (!projects || projects.length === 0) && (
          <EmptyState icon={FolderKanban} title="No projects available yet." description="Published projects will show up here." />
        )}
        {!loading && preview.length > 0 && (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>

            {projects.length > PREVIEW_LIMIT && (
              <div className="mt-12 flex justify-center">
                <Button as={Link} to="/projects" variant="outline">
                  View All Projects <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
