import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading.jsx';
import Container from '../components/Container.jsx';
import Badge from '../components/Badge.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';

const STATUS_TONE = { planning: 'neutral', 'in-progress': 'primary', 'on-hold': 'warning' };
const STATUS_LABEL = { planning: 'Planning', 'in-progress': 'In Progress', 'on-hold': 'On Hold' };

export default function UpcomingProject() {
  const { data: items } = useFetch(() => publicApi.upcomingProjects(), []);

  // No published upcoming project → section doesn't render at all.
  if (!items || items.length === 0) return null;

  return (
    <section id="upcoming" className="bg-white/[0.02] py-24">
      <SectionHeading eyebrow="What's Next" title="Upcoming project" align="left" />
      <Container>
        <div className="grid gap-8 sm:grid-cols-2">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-soft backdrop-blur-sm"
            >
              {item.image_url && (
                <div className="aspect-video overflow-hidden bg-primary-950/40">
                  <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                  {item.timeline && <span className="text-xs text-ink/40">{item.timeline}</span>}
                </div>
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                {item.description && <p className="mt-2 text-sm text-ink/60">{item.description}</p>}

                {item.technologies?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.technologies.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                )}

                <div className="mt-5">
                  <div className="mb-1 flex justify-between text-xs text-ink/40">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                    <div className="h-full rounded-full bg-primary-400" style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
