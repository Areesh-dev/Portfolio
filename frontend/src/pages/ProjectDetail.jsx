import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import Container from '../components/Container.jsx';
import Loader from '../components/Loader.jsx';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';
import { setPageMeta } from '../utils/seo.js';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, loading, error } = useFetch(() => publicApi.project(slug), [slug]);

  useEffect(() => {
    if (project) {
      setPageMeta({ title: `${project.title} — Project`, description: project.short_description });
    }
  }, [project]);

  return (
    <Layout>
      <Container className="py-16">
        <Link to="/projects" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>

        {loading && <Loader label="Loading project…" />}
        {!loading && (error || !project) && (
          <EmptyState title="Project not found" description="It may have been unpublished or the link is incorrect." />
        )}

        {!loading && project && (
          <article>
            {project.featured_image && (
              <div className="mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-primary-950/40">
                <img src={project.featured_image} alt={project.title} className="h-full w-full object-cover" />
              </div>
            )}

            <div className="grid gap-10 lg:grid-cols-[1fr_0.6fr]">
              <div>
                {project.category && <Badge tone="primary">{project.category}</Badge>}
                <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{project.title}</h1>
                {project.short_description && <p className="mt-4 text-lg text-ink/60">{project.short_description}</p>}
                {project.full_description && (
                  <p className="mt-6 whitespace-pre-line leading-relaxed text-ink/70">{project.full_description}</p>
                )}

                {project.images?.length > 0 && (
                  <div className="mt-10 grid gap-4 sm:grid-cols-2">
                    {project.images.map((img) => (
                      <div key={img.id} className="overflow-hidden rounded-xl bg-primary-950/40">
                        <img src={img.image_url} alt={img.caption || project.title} className="h-full w-full object-cover" />
                        {img.caption && <p className="p-2 text-xs text-ink/50">{img.caption}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <aside className="h-fit space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                {project.technologies?.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-ink">Technologies</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  {project.live_url && (
                    <Button as="a" href={project.live_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </Button>
                  )}
                  {project.github_url && (
                    <Button as="a" href={project.github_url} target="_blank" rel="noopener noreferrer" variant="outline">
                      <Github className="h-4 w-4" /> GitHub
                    </Button>
                  )}
                </div>
              </aside>
            </div>
          </article>
        )}
      </Container>
    </Layout>
  );
}
