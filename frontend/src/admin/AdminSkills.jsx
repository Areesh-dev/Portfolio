import AdminResourceTable from './AdminResourceTable.jsx';
import Badge from '../components/Badge.jsx';
import { adminApi } from '../lib/api.js';

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Cloud', 'Tools', 'UI/UX', 'Other'];

export default function AdminSkills() {
  return (
    <AdminResourceTable
      title="Skills"
      api={adminApi.skills}
      orderable
      emptyLabel="No skills yet. Add your first one."
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category', render: (i) => <Badge tone="primary">{i.category}</Badge> },
        { key: 'proficiency', label: 'Proficiency', render: (i) => (i.proficiency != null ? `${i.proficiency}%` : '—') },
        { key: 'is_active', label: 'Status', render: (i) => <Badge tone={i.is_active ? 'success' : 'neutral'}>{i.is_active ? 'Active' : 'Disabled'}</Badge> },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'category', label: 'Category', type: 'select', options: CATEGORIES, required: true },
        { name: 'proficiency', label: 'Personal Proficiency Indicator (0-100, optional)', type: 'number' },
        { name: 'icon', label: 'Icon — any Lucide icon name (e.g. Database, Cloud, code-2)' },
        { name: 'is_active', label: 'Active', type: 'checkbox', default: true },
      ]}
    />
  );
}
