import { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { useFetch } from '../hooks/useFetch.js';
import { adminApi } from '../lib/api.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Badge from '../components/Badge.jsx';
import StarRating from '../components/StarRating.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

export default function AdminReviews() {
  const { data: reviews, loading, refetch } = useFetch(() => adminApi.reviews.list(), []);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const approve = async (id) => {
    setBusyId(id);
    try {
      await adminApi.reviews.approve(id);
      refetch();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async () => {
    setBusyId(deleteTarget.id);
    try {
      await adminApi.reviews.remove(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Reviews</h1>
      {loading && <Loader label="Loading reviews…" />}
      {!loading && reviews?.length === 0 && <EmptyState title="No reviews submitted yet." />}

      {!loading && reviews?.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-soft sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <div className="mb-1.5 flex items-center gap-3">
                  <p className="font-semibold text-ink">{review.client_name}</p>
                  <Badge tone={review.is_approved ? 'success' : 'warning'}>{review.is_approved ? 'Approved' : 'Pending'}</Badge>
                </div>
                <p className="mb-1 text-xs text-ink/50">{[review.client_role, review.company].filter(Boolean).join(' · ')}</p>
                <StarRating rating={review.rating} />
                <p className="mt-2 text-sm text-ink/70">{review.review_text}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                {!review.is_approved && (
                  <button
                    onClick={() => approve(review.id)}
                    disabled={busyId === review.id}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" /> Approve
                  </button>
                )}
                <button
                  onClick={() => setDeleteTarget(review)}
                  disabled={busyId === review.id}
                  className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/25 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> {review.is_approved ? 'Delete' : 'Reject'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={remove}
        loading={busyId === deleteTarget?.id}
        title={deleteTarget?.is_approved ? 'Delete review?' : 'Reject review?'}
        description="This action cannot be undone."
      />
    </div>
  );
}
