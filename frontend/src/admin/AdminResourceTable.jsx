import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loader from '../components/Loader.jsx';
import { Input, Textarea, Select, Checkbox } from '../components/FormField.jsx';
import TagInput from '../components/TagInput.jsx';
import ImageUploader from '../components/ImageUploader.jsx';

export default function AdminResourceTable({ title, api, columns, fields, orderable = false, emptyLabel = 'Nothing here yet.' }) {
  const { data: items, loading, error, refetch } = useFetch(api.list, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    const defaults = {};
    fields.forEach((f) => {
      defaults[f.name] = f.type === 'checkbox' ? (f.default ?? true) : f.type === 'tags' ? [] : f.default ?? '';
    });
    setForm(defaults);
    setEditing(null);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (item) => {
    const next = { ...item };
    fields.forEach((f) => {
      if (f.type === 'datetime-local' && next[f.name]) {
        next[f.name] = new Date(next[f.name]).toISOString().slice(0, 16);
      }
    });
    setForm(next);
    setEditing(item);
    setFormError('');
    setModalOpen(true);
  };

  const handleChange = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...form };
      fields.forEach((f) => {
        if (f.type === 'number') payload[f.name] = payload[f.name] === '' ? null : Number(payload[f.name]);
        if (f.type === 'datetime-local') payload[f.name] = payload[f.name] ? `${payload[f.name]}:00.000Z` : null;
      });
      if (editing) {
        await api.update(editing.id, payload);
      } else {
        await api.create(payload);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.remove(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setFormError(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const move = async (item, direction) => {
    const sorted = [...items].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((i) => i.id === item.id);
    const swapWith = sorted[idx + direction];
    if (!swapWith) return;
    await Promise.all([
      api.update(item.id, { display_order: swapWith.display_order }),
      api.update(swapWith.id, { display_order: item.display_order }),
    ]);
    refetch();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">{title}</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      {loading && <Loader label="Loading…" />}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && items?.length === 0 && <EmptyState title={emptyLabel} />}

      {!loading && items?.length > 0 && (
        <div className="overflow-x-auto rounded-2xl bg-surface shadow-soft">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink/40">
                {columns.map((col) => (
                  <th key={col.key} className="whitespace-nowrap px-5 py-3 font-medium">
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-5 py-3.5 text-ink/80">
                      {col.render ? col.render(item) : String(item[col.key] ?? '—')}
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {orderable && (
                        <>
                          <button onClick={() => move(item, -1)} className="rounded p-1.5 text-ink/40 hover:bg-ink/5" aria-label="Move up">
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => move(item, 1)} className="rounded p-1.5 text-ink/40 hover:bg-ink/5" aria-label="Move down">
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                      <button onClick={() => openEdit(item)} className="rounded p-1.5 text-ink/40 hover:bg-white/10 hover:text-ink" aria-label="Edit">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setDeleteTarget(item)} className="rounded p-1.5 text-ink/40 hover:bg-red-500/15 hover:text-red-400" aria-label="Delete">
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


      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${title}` : `Add ${title}`} wide>
        <form onSubmit={handleSubmit}>
          {/* Scrollable body */}
          <div className="max-h-[55vh] overflow-y-auto pr-2 -mr-2 space-y-4">
            {fields.map((f) => {
              const value = form[f.name];
              if (f.type === 'textarea') {
                return <Textarea key={f.name} label={f.label} value={value || ''} onChange={(e) => handleChange(f.name, e.target.value)} />;
              }
              if (f.type === 'select') {
                return (
                  <Select key={f.name} label={f.label} value={value || ''} onChange={(e) => handleChange(f.name, e.target.value)} required={f.required}>
                    <option value="" disabled>Select…</option>
                    {f.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Select>
                );
              }
              if (f.type === 'checkbox') {
                return <Checkbox key={f.name} label={f.label} checked={!!value} onChange={(e) => handleChange(f.name, e.target.checked)} />;
              }
              if (f.type === 'tags') {
                return <TagInput key={f.name} label={f.label} value={value || []} onChange={(v) => handleChange(f.name, v)} />;
              }
              if (f.type === 'image') {
                return <ImageUploader key={f.name} label={f.label} bucket={f.bucket} value={value} onChange={(url) => handleChange(f.name, url)} />;
              }
              return (
                <Input
                  key={f.name}
                  label={f.label}
                  type={f.type || 'text'}
                  value={value ?? ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  required={f.required}
                />
              );
            })}
            {formError && <p className="text-sm text-red-400">{formError}</p>}
          </div>

          {/* Fixed footer buttons */}
          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-ink/10">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        description="This action cannot be undone."
      />
    </div>
  );
}
