import AdminResourceTable from './AdminResourceTable.jsx';
import Badge from '../components/Badge.jsx';
import { adminApi } from '../lib/api.js';

export default function AdminServices() {
  return (
    <AdminResourceTable
      title="Services"
      api={adminApi.services}
      orderable
      emptyLabel="No services yet. Add your first one."
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'icon', label: 'Icon' },
        { key: 'is_active', label: 'Status', render: (i) => <Badge tone={i.is_active ? 'success' : 'neutral'}>{i.is_active ? 'Active' : 'Disabled'}</Badge> },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'icon', label: 'Icon — any Lucide icon name (e.g. Rocket, Code2, ShieldCheck, arrow-right)' },
        { name: 'image_url', label: 'Image', type: 'image', bucket: 'service-images' },
        { name: 'is_active', label: 'Active', type: 'checkbox', default: true },
      ]}
    />
  );
}
