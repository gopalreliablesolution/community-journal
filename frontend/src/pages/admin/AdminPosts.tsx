import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trash2, Eye, Edit, MessageCircle, Heart, Clock } from 'lucide-react';
import { useAdminPosts, useAdminDeletePost } from '../../features/admin/hooks';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate, formatNumber } from '../../utils/formatters';
import { ROUTES } from '../../constants';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import { Badge } from '../../components/ui/Badge';

export default function AdminPosts() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useAdminPosts(page, 20, debouncedSearch);
  const deletePost = useAdminDeletePost();

  const handleDelete = () => {
    if (deleteModal) {
      deletePost.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal(null),
      });
    }
  };

  if (isLoading) return <Loader size="lg" className="min-h-[400px]" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-neutral-heading">
          Post Management
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-neutral-gray rounded-lg text-sm focus:outline-none focus:border-gold"
          >
            <option value="">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-neutral-gray rounded-lg focus:outline-none focus:border-gold"
            />
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-neutral-lightgray">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-darkgray">Post</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-darkgray">Author</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-darkgray">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-darkgray">Stats</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-neutral-darkgray">Date</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-neutral-darkgray">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.data.map((post) => (
              <tr key={post.id} className="hover:bg-neutral-offwhite">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {(post as any).coverImage?.path ? (
                      <img src={(post as any).coverImage.path} alt="" className="w-12 h-10 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-10 rounded bg-neutral-lightgray flex items-center justify-center text-neutral-muted flex-shrink-0">
                        <Eye size={14} />
                      </div>
                    )}
                    <div className="min-w-0">
                      <Link
                        to={`/posts/${post.slug}`}
                        className="font-medium text-neutral-heading hover:text-gold line-clamp-1 text-sm"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        {(post as any).categories?.slice(0, 2).map((cat: any) => (
                          <span key={cat.category.id} className="text-xs text-neutral-muted bg-neutral-lightgray px-1.5 py-0.5 rounded">
                            {cat.category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`${ROUTES.PROFILE.replace(':username', post.author.username)}`}
                    className="flex items-center gap-2 text-sm text-neutral-darkgray hover:text-gold"
                  >
                    {(post as any).author.avatar?.path ? (
                      <img src={(post as any).author.avatar.path} alt="" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-semibold">
                        {post.author.name?.charAt(0)}
                      </div>
                    )}
                    {post.author.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="status" status={post.status}>
                    {post.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 text-xs text-neutral-darkgray">
                    <span className="flex items-center gap-1" title="Views">
                      <Eye size={12} /> {formatNumber(post._count?.views || 0)}
                    </span>
                    <span className="flex items-center gap-1" title="Likes">
                      <Heart size={12} /> {post._count?.likes || 0}
                    </span>
                    <span className="flex items-center gap-1" title="Comments">
                      <MessageCircle size={12} /> {post._count?.comments || 0}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-neutral-darkgray">
                    <div>{formatDate(post.publishedAt || post.createdAt)}</div>
                    {post.readingTime && (
                      <div className="text-xs text-neutral-muted flex items-center gap-1 mt-0.5">
                        <Clock size={10} /> {post.readingTime} min
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      to={`/posts/${post.slug}`}
                      className="p-1.5 rounded hover:bg-neutral-lightgray"
                      title="View"
                    >
                      <Eye size={16} className="text-neutral-darkgray" />
                    </Link>
                    <Link
                      to={`/edit/${post.id}`}
                      className="p-1.5 rounded hover:bg-neutral-lightgray"
                      title="Edit"
                    >
                      <Edit size={16} className="text-neutral-darkgray" />
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ id: post.id, title: post.title })}
                      className="p-1.5 rounded hover:bg-neutral-lightgray"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-status-error" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data?.data.length === 0 && (
          <div className="text-center py-12 text-neutral-muted">No posts found</div>
        )}
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="ghost"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-neutral-darkgray">
            Page {page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="ghost"
            onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
            disabled={page === data.pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Post"
      >
        <p className="mb-6">
          Are you sure you want to delete <strong>{deleteModal?.title}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteModal(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deletePost.isPending}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
