import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { adminApi } from '../lib/api.js';
import Button from '../components/Button.jsx';
import { Input, Textarea, Checkbox } from '../components/FormField.jsx';
import TagInput from '../components/TagInput.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import Loader from '../components/Loader.jsx';

const EMPTY = {
  title: '',
  slug: '',
  short_description: '',
  full_description: '',
  featured_image: '',
  category: '',
  technologies: [],
  github_url: '',
  live_url: '',
  project_date: '',
  featured: false,
  is_published: false,
};

export default function AdminProjectEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    adminApi.projects.get(id).then((data) => {
      setForm({ ...EMPTY, ...data });
      setImages(data.images || []);
      setLoading(false);
    });
  }, [id, isNew]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setBool = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.checked }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        const created = await adminApi.projects.create(form);
        navigate(`/admin/projects/${created.id}/edit`, { replace: true });
      } else {
        await adminApi.projects.update(id, form);
      }
    } catch (err) {
      setError(err.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const addScreenshot = async (url) => {
    if (!url) return;
    const created = await adminApi.projects.addImage(id, { image_url: url, display_order: images.length });
    setImages((prev) => [...prev, created]);
  };

  const removeScreenshot = async (imageId) => {
    await adminApi.projects.removeImage(id, imageId);
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  if (loading) return <Loader label="Loading project…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <button onClick={() => navigate('/admin/projects')} className="mb-6 flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </button>

      <h1 className="mb-6 text-2xl font-bold text-ink">{isNew ? 'New Project' : `Edit: ${form.title}`}</h1>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-surface p-6 shadow-soft">
        <Input label="Title" required value={form.title} onChange={set('title')} />
        <Input label="Slug (leave blank to auto-generate from title)" value={form.slug} onChange={set('slug')} />
        <Input label="Short Description" value={form.short_description} onChange={set('short_description')} />
        <Textarea label="Full Description" rows={6} value={form.full_description} onChange={set('full_description')} />
        <ImageUploader label="Featured Image" bucket="project-images" value={form.featured_image} onChange={(url) => setForm((f) => ({ ...f, featured_image: url }))} />
        <Input label="Category" value={form.category} onChange={set('category')} />
        <TagInput label="Technologies" value={form.technologies} onChange={(v) => setForm((f) => ({ ...f, technologies: v }))} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="GitHub URL" type="url" value={form.github_url} onChange={set('github_url')} />
          <Input label="Live Demo URL" type="url" value={form.live_url} onChange={set('live_url')} />
        </div>
        <Input label="Project Date" type="date" value={form.project_date || ''} onChange={set('project_date')} />
        <div className="flex items-center gap-8">
          <Checkbox label="Featured" checked={form.featured} onChange={setBool('featured')} />
          <Checkbox label="Published" checked={form.is_published} onChange={setBool('is_published')} />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-ink/10 pt-5">
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/projects')}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {isNew ? 'Create Project' : 'Save Changes'}
          </Button>
        </div>
      </form>

      {!isNew && (
        <div className="mt-8 rounded-2xl bg-surface p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold text-ink">Screenshots</h2>
          <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-video overflow-hidden rounded-xl bg-primary-950/40">
                <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => removeScreenshot(img.id)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-red-400 opacity-0 transition group-hover:opacity-100"
                  aria-label="Remove screenshot"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <ImageUploader label="Add screenshot" bucket="project-screenshots" value="" onChange={addScreenshot} />
        </div>
      )}
    </div>
  );
}
