import AdminResourceTable from './AdminResourceTable.jsx';
import Badge from '../components/Badge.jsx';
import { adminApi } from '../lib/api.js';

const STATUSES = ['planning', 'in-progress', 'on-hold'];

export default function AdminUpcomingProjects() {
  return (
    <AdminResourceTable
      title="Upcoming Projects"
      api={adminApi.upcomingProjects}
      emptyLabel="No upcoming projects yet."
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'status', label: 'Status', render: (i) => <Badge tone="primary">{i.status}</Badge> },
        { key: 'progress', label: 'Progress', render: (i) => `${i.progress}%` },
        { key: 'launch_date', label: 'Launch (UTC)', render: (i) => (i.launch_date ? new Date(i.launch_date).toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' }) : '—') },
        { key: 'is_published', label: 'Published', render: (i) => <Badge tone={i.is_published ? 'success' : 'neutral'}>{i.is_published ? 'Published' : 'Draft'}</Badge> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'image_url', label: 'Image', type: 'image', bucket: 'project-images' },
        { name: 'technologies', label: 'Technologies', type: 'tags' },
        { name: 'status', label: 'Status', type: 'select', options: STATUSES, required: true },
        { name: 'timeline', label: 'Timeline (e.g. "Q1 2026")' },
        { name: 'launch_date', label: 'Launch Date & Time (UTC) — powers the countdown section', type: 'datetime-local' },
        { name: 'progress', label: 'Progress (0-100)', type: 'number', default: 0 },
        { name: 'is_published', label: 'Published', type: 'checkbox', default: false },
      ]}
    />
  );
}
