import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { resolveIcon } from '../utils/iconMap.js';


export default function DynamicIcon({ name, className }) {
  const [Icon, setIcon] = useState(null);

  useEffect(() => {
    let active = true;
    setIcon(null);
    resolveIcon(name).then((found) => {
      if (active) setIcon(() => found || Sparkles);
    });
    return () => {
      active = false;
    };
  }, [name]);

  const Component = Icon || Sparkles;
  return <Component className={className} />;
}
