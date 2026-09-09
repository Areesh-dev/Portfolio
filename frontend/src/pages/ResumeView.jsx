import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileX } from 'lucide-react';
import Layout from '../components/Layout.jsx';
import Container from '../components/Container.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { useSiteContent } from '../hooks/useSiteContent.jsx';
import { setPageMeta } from '../utils/seo.js';

export default function ResumeView() {
  const { content, loading } = useSiteContent();
  const resumeUrl = content?.resume_file_url;

  useEffect(() => {
    setPageMeta({
      title: content?.site_title ? `Resume — ${content.site_title}` : 'Resume',
      description: 'View or download the full resume.',
    });
  }, [content]);

  return (
    <Layout>
      <Container className="py-16">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Resume</h1>
          {resumeUrl && (
            <Button as="a" href={resumeUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          )}
        </div>

        {!loading && !resumeUrl && (
          <EmptyState icon={FileX} title="Resume not available yet." description="Check back soon." />
        )}

        {resumeUrl && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <iframe title="Resume PDF" src={`${resumeUrl}#toolbar=0&navpanes=0`} className="h-[160vh] w-full" />
          </div>
        )}
      </Container>
    </Layout>
  );
}
