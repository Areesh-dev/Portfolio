import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import Container from '../components/Container.jsx';
import Badge from '../components/Badge.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { publicApi } from '../lib/api.js';

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

function splitDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function useCountdown(targetIso) {
  const target = useMemo(() => (targetIso ? new Date(targetIso).getTime() : null), [targetIso]);
  const [remaining, setRemaining] = useState(() => (target ? target - Date.now() : 0));

  useEffect(() => {
    if (!target) return;
    const tick = () => setRemaining(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return splitDuration(remaining);
}

export default function NextProjectCountdown() {
  const { data: items } = useFetch(() => publicApi.upcomingProjects(), []);

  // The soonest published upcoming project that still has time left.
  const next = (items || [])
    .filter((p) => p.launch_date && new Date(p.launch_date).getTime() > Date.now())
    .sort((a, b) => new Date(a.launch_date) - new Date(b.launch_date))[0];

  const time = useCountdown(next?.launch_date);

  // No upcoming project has a future launch date set → don't render at all.
  if (!next) return null;

  return (
    <section id="next-project" className="py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] px-6 py-14 text-center shadow-glass backdrop-blur-xl sm:px-12"
        >
          <div className="pointer-events-none absolute -top-20 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />

          <span className="relative mb-4 inline-flex items-center gap-2 rounded-full border border-primary-400/30 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-300">
            <Rocket className="h-3.5 w-3.5" /> Launching Soon
          </span>
          <h2 className="relative text-2xl font-bold text-ink sm:text-3xl">{next.title}</h2>
          {next.description && <p className="relative mx-auto mt-3 max-w-xl text-sm text-ink/60">{next.description}</p>}

          <div className="relative mx-auto mt-10 grid max-w-lg grid-cols-4 gap-3 sm:gap-4">
            {UNITS.map((unit) => (
              <div key={unit.key} className="rounded-2xl border border-white/10 bg-white/5 py-4">
                <motion.p
                  key={time[unit.key]}
                  initial={{ opacity: 0.4, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-extrabold tabular-nums text-ink sm:text-4xl"
                >
                  {String(time[unit.key]).padStart(2, '0')}
                </motion.p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-ink/40">{unit.label}</p>
              </div>
            ))}
          </div>

          {next.technologies?.length > 0 && (
            <div className="relative mt-8 flex flex-wrap justify-center gap-1.5">
              {next.technologies.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
