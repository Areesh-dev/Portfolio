import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileX, ExternalLink } from 'lucide-react';

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
      title: content?.site_title
        ? `Resume — ${content.site_title}`
        : 'Resume',
      description: 'View or download the full resume.',
    });
  }, [content]);

  return (
    <Layout>
      <Container className="py-16">

        {/* Back */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink/60 transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Resume
            </h1>

            <p className="mt-2 text-sm text-ink/60">
              View my resume or download a PDF copy.
            </p>
          </div>

          {resumeUrl && (
            <div className="flex flex-wrap gap-3">

              {/* Download */}
              <Button
                as="a"
                href={resumeUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>

              {/* Open */}
              <Button
                as="a"
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                <ExternalLink className="h-4 w-4" />
                Open PDF
              </Button>

            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
            <p className="text-sm text-ink/60">
              Loading resume...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !resumeUrl && (
          <EmptyState
            icon={FileX}
            title="Resume not available yet."
            description="Check back soon."
          />
        )}

        {/* PDF */}
        {!loading && resumeUrl && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

            <iframe
              title="Resume PDF"
              src={`${resumeUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="block h-[85vh] w-full bg-white sm:h-[110vh] lg:h-[140vh]"
            />

          </div>
        )}

      </Container>
    </Layout>
  );
}
