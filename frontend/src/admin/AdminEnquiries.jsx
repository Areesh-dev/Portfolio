import { useState } from 'react';
import { Trash2, Archive, Mail } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { adminApi } from '../lib/api.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Modal from '../components/Modal.jsx';
import { formatDate } from '../utils/formatDate.js';
import { cn } from '../utils/cn.js';

const TABS = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

const STATUS_TONE = { new: 'primary', read: 'neutral', replied: 'success', archived: 'warning' };

export default function AdminEnquiries() {
  const [status, setStatus] = useState('');
  const { data: enquiries, loading, refetch } = useFetch(() => adminApi.enquiries.list(status), [status]);
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openDetail = async (enquiry) => {
    setSelected(enquiry);
    if (enquiry.status === 'new') {
      await adminApi.enquiries.updateStatus(enquiry.id, 'read');
      refetch();
    }
  };

  const updateStatus = async (id, newStatus) => {
    await adminApi.enquiries.updateStatus(id, newStatus);
    refetch();
    setSelected((s) => (s?.id === id ? { ...s, status: newStatus } : s));
  };

  const remove = async () => {
    setDeleting(true);
    try {
      await adminApi.enquiries.remove(deleteTarget.id);
      setDeleteTarget(null);
      setSelected(null);
      refetch();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Enquiries</h1>

      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition',
              status === tab.value ? 'bg-primary-50 text-primary-950' : 'bg-surface text-ink/60 hover:text-ink'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <Loader label="Loading enquiries…" />}
      {!loading && enquiries?.length === 0 && <EmptyState icon={Mail} title="No enquiries here." />}

      {!loading && enquiries?.length > 0 && (
        <div className="overflow-x-auto rounded-2xl bg-surface shadow-soft">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/40">
                <th className="px-5 py-3 font-medium">From</th>
                <th className="px-5 py-3 font-medium">Subject</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enq) => (
                <tr key={enq.id} className="cursor-pointer border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]" onClick={() => openDetail(enq)}>
                  <td className="px-5 py-3.5 font-medium text-ink">{enq.name}</td>
                  <td className="max-w-xs truncate px-5 py-3.5 text-ink/70">{enq.subject}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={STATUS_TONE[enq.status]}>{enq.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-ink/50">{formatDate(enq.created_at)}</td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => updateStatus(enq.id, 'archived')} className="rounded p-1.5 text-ink/40 hover:bg-ink/5" aria-label="Archive">
                        <Archive className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(enq)} className="rounded p-1.5 text-ink/40 hover:bg-red-500/15 hover:text-red-400" aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.subject || 'Enquiry'} wide>
        {selected && (
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium text-ink">{selected.name}</span>{' '}
              <a href={`mailto:${selected.email}`} className="text-primary-400">
                {selected.email}
              </a>
            </p>
            {(selected.phone || selected.company) && (
              <p className="text-ink/60">{[selected.phone, selected.company].filter(Boolean).join(' · ')}</p>
            )}
            <p className="whitespace-pre-line rounded-lg bg-ink/5 p-4 text-ink/80">{selected.message}</p>
            <div className="flex items-center justify-between pt-2">
              <select
                value={selected.status}
                onChange={(e) => updateStatus(selected.id, e.target.value)}
                className="rounded-lg border border-ink/15 bg-surface px-3 py-2 text-sm text-ink"
              >
                {['new', 'read', 'replied', 'archived'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <a href={`mailto:${selected.email}`} className="text-sm font-medium text-primary-400 hover:underline">
                Reply by Email
              </a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={remove} loading={deleting} description="This enquiry will be permanently deleted." />
    </div>
  );
}
