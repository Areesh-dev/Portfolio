import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, GraduationCap, Briefcase, Sparkles, BookOpen } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';
import { useSiteContent } from '../hooks/useSiteContent.jsx';
import { formatMonthYear } from '../utils/formatDate.js';

function Timeline({ items, renderTitle, renderSubtitle }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-8 border-l border-ink/10 pl-6">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          className="relative"
        >
          <span className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full border-2 border-page bg-primary-400" />
          <p className="text-xs font-medium uppercase tracking-wide text-primary-400">
            {formatMonthYear(item.start_date)} — {formatMonthYear(item.end_date)}
          </p>
          <h4 className="mt-1 font-semibold text-ink">{renderTitle(item)}</h4>
          <p className="text-sm text-ink/50">{renderSubtitle(item)}</p>
          {item.description && <p className="mt-2 text-sm text-ink/60">{item.description}</p>}
        </motion.div>
      ))}
    </div>
  );
}

// Fresher message component
function FresherMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative rounded-lg border border-primary-400/20 bg-primary-400/5 p-6"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-400/10">
          <BookOpen className="h-5 w-5 text-primary-400" />
        </div>
        <div>
          <h4 className="font-semibold text-ink">Fresher | No Professional Experience</h4>
          <p className="mt-2 text-sm text-ink/60">
            Currently building practical experience through personal web development projects, continuous learning, and hands-on exploration of modern web technologies.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Resume() {
  const { content } = useSiteContent();
  const { data, loading } = useFetch(
    () => Promise.all([publicApi.experiences(), publicApi.education()]).then(([experiences, education]) => ({ experiences, education })),
    []
  );

  const isEmpty = !loading && !data?.experiences?.length && !data?.education?.length;
  const hasExperience = !loading && data?.experiences?.length > 0;
  const hasEducation = !loading && data?.education?.length > 0;

  return (
    <section id="resume" className="bg-white/[0.02] py-24">
      <SectionHeading eyebrow="Resume" title="Experience & Education" align="left" />
      <Container>
        {loading && <Loader label="Loading resume…" />}
        {isEmpty && <EmptyState icon={Briefcase} title="Resume details coming soon." />}

        {!loading && !isEmpty && (
          <div className="grid gap-14 lg:grid-cols-2">
            {/* Experience Column */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-ink">
                <Briefcase className="h-5 w-5 text-primary-400" /> Experience
              </h3>
              {hasExperience ? (
                <Timeline 
                  items={data.experiences} 
                  renderTitle={(i) => i.position} 
                  renderSubtitle={(i) => [i.organization, i.location].filter(Boolean).join(' · ')} 
                />
              ) : (
                <FresherMessage />
              )}
            </div>

            {/* Education Column */}
            <div>
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-ink">
                <GraduationCap className="h-5 w-5 text-primary-400" /> Education
              </h3>
              {hasEducation ? (
                <Timeline 
                  items={data.education} 
                  renderTitle={(i) => i.degree} 
                  renderSubtitle={(i) => [i.institution, i.location].filter(Boolean).join(' · ')} 
                />
              ) : (
                <div className="text-sm text-ink/40">No education entries yet.</div>
              )}
            </div>
          </div>
        )}

        {content?.resume_file_url && (
          <div className="mt-14 flex justify-center">
            <Button as={Link} to="/resume" variant="secondary">
              <FileText className="h-4 w-4" /> View Resume
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}