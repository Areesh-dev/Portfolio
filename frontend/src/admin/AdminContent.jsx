import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api.js';
import { Input, Textarea } from '../components/FormField.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import VideoUploader from '../components/VideoUploader.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';

function Section({ title, children }) {
  return (
    <div className="rounded-2xl bg-surface p-6 shadow-soft">
      <h2 className="mb-5 text-lg font-semibold text-ink">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function AdminContent() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.siteContent.get().then(setForm);
  }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const setImg = (field) => (url) => setForm((f) => ({ ...f, [field]: url }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await adminApi.siteContent.update(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <Loader label="Loading content…" />;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-ink">Website Content</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Section title="Site">
          <Input label="Site Title" value={form.site_title || ''} onChange={set('site_title')} />
          <Input label="Tagline (shown as the small badge in the hero)" value={form.site_tagline || ''} onChange={set('site_tagline')} />
          <Textarea label="SEO Meta Description" value={form.seo_meta_description || ''} onChange={set('seo_meta_description')} />
        </Section>

        <Section title="Hero">
          <Input label={`Heading (e.g. "Hi, I'm Alex")`} value={form.hero_heading || ''} onChange={set('hero_heading')} />
          <Input label={`Subheading / Role (e.g. "Full-Stack Developer")`} value={form.hero_subheading || ''} onChange={set('hero_subheading')} />
          <Textarea label="Intro paragraph" value={form.hero_intro || ''} onChange={set('hero_intro')} />
          <VideoUploader label="Hero Background Video (optional)" bucket="hero-video" value={form.hero_video_url} onChange={setImg('hero_video_url')} />
          <ImageUploader label="Hero Photo (used if no video is set)" bucket="profile-images" value={form.hero_image_url} onChange={setImg('hero_image_url')} />
        </Section>

        <Section title="About">
          <Input label="Heading" value={form.about_heading || ''} onChange={set('about_heading')} />
          <Textarea label="Description" value={form.about_description || ''} onChange={set('about_description')} />
          <Textarea label="Development Philosophy" value={form.about_philosophy || ''} onChange={set('about_philosophy')} />
          <Textarea label="Learning Journey" value={form.about_learning_journey || ''} onChange={set('about_learning_journey')} />
          <ImageUploader label="About Photo" bucket="profile-images" value={form.about_image_url} onChange={setImg('about_image_url')} />
        </Section>

        <Section title="Contact">
          <Input label="Contact Email" type="email" value={form.contact_email || ''} onChange={set('contact_email')} />
          <Input label="Contact Phone" value={form.contact_phone || ''} onChange={set('contact_phone')} />
          <Input label="Location" value={form.contact_location || ''} onChange={set('contact_location')} />
        </Section>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-4">
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
          {saved && <span className="text-sm text-emerald-600">Saved!</span>}
        </div>
      </form>
    </div>
  );
}
