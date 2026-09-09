import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import { Input, Textarea } from '../components/FormField.jsx';
import { useSiteContent } from '../hooks/useSiteContent.jsx';
import { publicApi } from '../lib/api.js';

const EMPTY = { name: '', email: '', phone: '', company: '', subject: '', message: '' };

export default function Contact() {
  const { content } = useSiteContent();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.subject.trim()) next.subject = 'Required';
    if (!form.message.trim()) next.message = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError('');
    try {
      await publicApi.submitEnquiry(form);
      setSent(true);
      setForm(EMPTY);
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    content?.contact_email && { icon: Mail, label: content.contact_email, href: `mailto:${content.contact_email}` },
    content?.contact_phone && { icon: Phone, label: content.contact_phone, href: `tel:${content.contact_phone}` },
    content?.contact_location && { icon: MapPin, label: content.contact_location },
  ].filter(Boolean);

  return (
    <section id="contact" className="py-24">
      <SectionHeading eyebrow="Contact" title="Have a project in mind?" description="Send a message and I'll get back to you soon." />
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5">
          {contactInfo.map(({ icon: Icon, label, href }, i) => {
            const row = (
              <>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500/15 text-primary-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm text-ink/70">{label}</span>
              </>
            );
            return href ? (
              <a key={i} href={href} className="flex items-center gap-4 hover:text-primary-300">
                {row}
              </a>
            ) : (
              <div key={i} className="flex items-center gap-4">
                {row}
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <p className="font-medium text-ink">Message sent — thanks for reaching out!</p>
              <Button variant="ghost" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Input label="Name" id="name" value={form.name} onChange={set('name')} error={errors.name} />
              <Input label="Email" id="email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
              <Input label="Phone (optional)" id="phone" value={form.phone} onChange={set('phone')} />
              <Input label="Company (optional)" id="company" value={form.company} onChange={set('company')} />
              <div className="sm:col-span-2">
                <Input label="Subject" id="subject" value={form.subject} onChange={set('subject')} error={errors.subject} />
              </div>
              <div className="sm:col-span-2">
                <Textarea label="Message" id="message" value={form.message} onChange={set('message')} error={errors.message} />
              </div>
              {serverError && <p className="sm:col-span-2 text-sm text-red-600">{serverError}</p>}
              <div className="sm:col-span-2">
                <Button type="submit" loading={submitting} className="w-full sm:w-auto">
                  Send Message
                </Button>
              </div>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
