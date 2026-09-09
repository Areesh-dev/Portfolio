import AdminResourceTable from './AdminResourceTable.jsx';
import { adminApi } from '../lib/api.js';
import { formatMonthYear } from '../utils/formatDate.js';

export default function AdminResume() {
  return (
    <div className="space-y-12">
      <AdminResourceTable
        title="Experience"
        api={adminApi.experiences}
        emptyLabel="No experience entries yet."
        columns={[
          { key: 'position', label: 'Position' },
          { key: 'organization', label: 'Organization' },
          { key: 'range', label: 'Dates', render: (i) => `${formatMonthYear(i.start_date)} — ${formatMonthYear(i.end_date)}` },
        ]}
        fields={[
          { name: 'position', label: 'Position', required: true },
          { name: 'organization', label: 'Organization', required: true },
          { name: 'start_date', label: 'Start Date', type: 'date', required: true },
          { name: 'end_date', label: 'End Date (leave blank if current)', type: 'date' },
          { name: 'location', label: 'Location' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
      />

      <AdminResourceTable
        title="Education"
        api={adminApi.education}
        emptyLabel="No education entries yet."
        columns={[
          { key: 'degree', label: 'Degree' },
          { key: 'institution', label: 'Institution' },
          { key: 'range', label: 'Dates', render: (i) => `${formatMonthYear(i.start_date)} — ${formatMonthYear(i.end_date)}` },
        ]}
        fields={[
          { name: 'degree', label: 'Degree', required: true },
          { name: 'institution', label: 'Institution', required: true },
          { name: 'start_date', label: 'Start Date', type: 'date', required: true },
          { name: 'end_date', label: 'End Date (leave blank if current)', type: 'date' },
          { name: 'location', label: 'Location' },
          { name: 'description', label: 'Description', type: 'textarea' },
        ]}
      />
    </div>
  );
}
