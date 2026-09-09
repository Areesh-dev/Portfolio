import { motion } from 'framer-motion';
import DynamicIcon from './DynamicIcon.jsx';

// Groups a flat skills array by category and renders each as a labeled
// column of proficiency bars. `perCategoryLimit` caps how many skills show
// per category — used by the home-page preview; the full /skills page
// passes no limit.
export default function SkillsGrid({ skills, perCategoryLimit }) {
  const grouped = skills.reduce((acc, skill) => {
    (acc[skill.category] ||= []).push(skill);
    return acc;
  }, {});

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {Object.entries(grouped).map(([category, items]) => {
        const shown = perCategoryLimit ? items.slice(0, perCategoryLimit) : items;
        return (
          <div key={category}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-400">{category}</h3>
            <div className="space-y-4">
              {shown.map((skill, i) => {
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                  >
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 font-medium text-ink">
                        <DynamicIcon name={skill.icon} className="h-4 w-4 text-primary-400" />
                        {skill.name}
                      </span>
                      {skill.proficiency != null && <span className="text-ink/40">{skill.proficiency}%</span>}
                    </div>
                    {skill.proficiency != null && (
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
                        <div className="h-full rounded-full bg-primary-400" style={{ width: `${skill.proficiency}%` }} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
