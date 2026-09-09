import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import Badge from './Badge.jsx';

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition hover:border-white/20 hover:shadow-soft"
    >
      <Link to={`/projects/${project.slug}`} className="block aspect-[4/3] overflow-hidden bg-primary-950/40">
        {project.featured_image ? (
          <img
            src={project.featured_image}
            alt={project.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-primary-300">No image</div>
        )}
      </Link>
      <div className="p-6">
        {project.category && <Badge tone="primary">{project.category}</Badge>}
        <h3 className="mt-3 text-lg font-semibold text-ink">
          <Link to={`/projects/${project.slug}`} className="hover:text-primary-400">
            {project.title}
          </Link>
        </h3>
        {project.short_description && <p className="mt-2 text-sm text-ink/60">{project.short_description}</p>}

        {project.technologies?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-4 text-sm">
          <Link to={`/projects/${project.slug}`} className="flex items-center gap-1 font-medium text-primary-400 hover:underline">
            View Project <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="text-ink/40 hover:text-ink">
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" aria-label="Live demo" className="text-ink/40 hover:text-ink">
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
