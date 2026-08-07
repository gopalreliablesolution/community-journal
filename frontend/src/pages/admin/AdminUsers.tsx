import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Ban, Trash2, Shield, UserCheck, Users as UsersIcon, FileText, Calendar, TrendingUp } from 'lucide-react';
import { useAdminUsers, useAdminUserGrowth, useAdminUpdateUser, useAdminDeleteUser } from '../../features/admin/hooks';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate } from '../../utils/formatters';
import { ROUTES } from '../../constants';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Loader from '../../components/ui/Loader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#C89B3C', '#2E6BE6', '#28A745', '#E83E8C', '#6F42C1'];

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
  const [growthPeriod, setGrowthPeriod] = useState(30);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useAdminUsers(page, 20, debouncedSearch);
  const { data: growthData, isLoading: growthLoading } = useAdminUserGrowth(growthPeriod);
  const updateUser = useAdminUpdateUser();
  const deleteUser = useAdminDeleteUser();

  const handleToggleRole = (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN';
    updateUser.mutate({ id: userId, data: { role: newRole } });
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    updateUser.mutate({ id: userId, data: { status: newStatus } });
  };

  const handleDelete = () => {
    if (deleteModal) {
      deleteUser.mutate(deleteModal.id, {
        onSuccess: () => setDeleteModal(null),
      });
    }
  };

  if (isLoading) return <Loader size="lg" className="min-h-[400px]" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-neutral-heading">
          User Management
        </h1>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-muted" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-neutral-gray rounded-lg focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-heading flex items-center gap-2">
              <TrendingUp size={20} className="text-gold" />
              User Growth
            </h2>
            <select
              value={growthPeriod}
              onChange={(e) => setGrowthPeriod(Number(e.target.value))}
              className="text-sm border rounded px-2 py-1"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          {growthLoading ? (
            <div className="h-64 flex items-center justify-center text-neutral-muted">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={growthData?.growth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEFEF" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  labelFormatter={(v) => new Date(v as string).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
                  formatter={(value) => [`${value} users`, 'New Users']}
                />
                <Line type="monotone" dataKey="users" stroke="#C89B3C" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-neutral-heading mb-4">Role Distribution</h2>
          {growthLoading ? (
            <div className="h-48 flex items-center justify-center text-neutral-muted">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={growthData?.roleDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="role"
                >
                  {(growthData?.roleDistribution || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Status Distribution & Top Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-neutral-heading mb-4">Status Distribution</h2>
          {growthLoading ? (
            <div className="h-48 flex items-center justify-center text-neutral-muted">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={growthData?.statusDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {(growthData?.statusDistribution || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Top Users by Posts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h2 className="text-lg font-semibold text-neutral-heading mb-4">Top Authors</h2>
          <div className="space-y-3">
            {growthData?.topUsers?.map((user, idx) => (
              <div key={user.id} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gold w-5">{idx + 1}</span>
                {user.avatar?.path ? (
                  <img src={user.avatar.path} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold text-sm font-semibold">
                    {user.name?.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link to={`/users/${user.username}`} className="text-sm font-medium text-neutral-heading hover:text-gold line-clamp-1">
                    {user.name}
                  </Link>
                  <p className="text-xs text-neutral-darkgray">@{user.username}</p>
                </div>
                <div className="text-right text-xs text-neutral-darkgray">
                  <div>{user._count.posts} posts</div>
                  <div>{user._count.followers} followers</div>
                </div>
              </div>
            ))}
            {(!growthData?.topUsers || growthData.topUsers.length === 0) && (
              <p className="text-neutral-muted text-sm">No users yet</p>
            )}
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map((user) => (
          <div key={user.id} className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow">
            {/* User Header */}
            <div className="flex items-start gap-3 mb-3">
              {(user as any).avatar?.path ? (
                <img src={(user as any).avatar.path} alt="" className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold text-lg font-semibold">
                  {user.name?.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <Link
                  to={`${ROUTES.PROFILE.replace(':username', user.username)}`}
                  className="font-semibold text-neutral-heading hover:text-gold line-clamp-1"
                >
                  {user.name}
                </Link>
                <p className="text-sm text-neutral-darkgray">@{user.username}</p>
              </div>
              <button
                onClick={() => handleToggleRole(user.id, user.role)}
                className={`p-1.5 rounded text-xs font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-gold-light text-gold-dark'
                    : 'bg-neutral-lightgray text-neutral-darkgray'
                }`}
                title={`Click to make ${user.role === 'ADMIN' ? 'Member' : 'Admin'}`}
              >
                {user.role === 'ADMIN' ? <Shield size={14} /> : null}
                {user.role}
              </button>
            </div>

            {/* Bio */}
            {(user as any).bio && (
              <p className="text-sm text-neutral-darkgray mb-3 line-clamp-2">{(user as any).bio}</p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 mb-3 text-xs text-neutral-darkgray">
              <span className="flex items-center gap-1">
                <FileText size={12} /> {user._count?.posts || 0} posts
              </span>
              <span className="flex items-center gap-1">
                <UsersIcon size={12} /> {(user as any)._count?.followers || 0} followers
              </span>
              <span className="flex items-center gap-1">
                <UsersIcon size={12} /> {(user as any)._count?.following || 0} following
              </span>
            </div>

            {/* Status & Actions */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    user.status === 'ACTIVE'
                      ? 'bg-status-success/10 text-status-success'
                      : 'bg-status-error/10 text-status-error'
                  }`}
                >
                  {user.status}
                </span>
                <span className="text-xs text-neutral-muted flex items-center gap-1">
                  <Calendar size={10} /> {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleStatus(user.id, user.status)}
                  className="p-1.5 rounded hover:bg-neutral-lightgray"
                  title={user.status === 'ACTIVE' ? 'Ban user' : 'Unban user'}
                >
                  {user.status === 'ACTIVE' ? (
                    <Ban size={14} className="text-status-error" />
                  ) : (
                    <UserCheck size={14} className="text-status-success" />
                  )}
                </button>
                <button
                  onClick={() => setDeleteModal({ id: user.id, name: user.name })}
                  className="p-1.5 rounded hover:bg-neutral-lightgray"
                  title="Delete user"
                >
                  <Trash2 size={14} className="text-status-error" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data?.data.length === 0 && (
        <div className="text-center py-12 text-neutral-muted">No users found</div>
      )}

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
        title="Delete User"
      >
        <p className="mb-6">
          Are you sure you want to delete <strong>{deleteModal?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteModal(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={deleteUser.isPending}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
