import { useState } from 'react';
import { Plus, Edit, Trash2, Hash } from 'lucide-react';
import { useAdminTags, useAdminCreateTag, useAdminUpdateTag, useAdminDeleteTag } from '../../features/admin/hooks';
import Modal from '../../components/ui/Modal';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 15px',
  background: '#FAF8F5',
  border: '1px solid #DADADA',
  borderRadius: '12px',
  fontSize: '13.5px',
  color: '#1A1A1A',
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',
};

export default function AdminTags() {
  const { data: tags, isLoading } = useAdminTags();
  const createTag = useAdminCreateTag();
  const updateTag = useAdminUpdateTag();
  const deleteTag = useAdminDeleteTag();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setSlug('');
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!name.trim() || !slug.trim()) return;

    if (editingId) {
      updateTag.mutate(
        { id: editingId, data: { name: name.trim(), slug: slug.trim() } },
        { onSuccess: () => { resetForm(); setShowModal(false); } }
      );
    } else {
      createTag.mutate(
        { name: name.trim(), slug: slug.trim() },
        { onSuccess: () => { resetForm(); setShowModal(false); } }
      );
    }
  };

  const handleEdit = (tag: any) => {
    setEditingId(tag.id);
    setName(tag.name);
    setSlug(tag.slug);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    deleteTag.mutate(id, { onSuccess: () => setDeleteConfirmId(null) });
  };

  return (
    <div style={{ background: '#FAF8F5', minHeight: '88vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Hash style={{ width: '28px', height: '28px', color: '#C89B3C' }} />
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '32px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Manage Tags
            </h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '8px',
              background: '#C89B3C',
              color: '#FFFFFF',
              fontSize: '13.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(200, 155, 60, 0.3)',
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Add Tag
          </button>
        </div>

        {/* Tags Grid */}
        {isLoading ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ width: '140px', height: '44px', background: '#FFFFFF', borderRadius: '9999px', border: '1px solid #EFEFEF', opacity: 0.6 }} />
            ))}
          </div>
        ) : tags && tags.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {tags.map((tag) => (
              <div
                key={tag.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: '#FFFFFF',
                  borderRadius: '9999px',
                  border: '1px solid #EFEFEF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A' }}>
                  #{tag.name}
                </span>
                {tag._count?.posts !== undefined && (
                  <span style={{ fontSize: '11px', color: '#888888', background: '#FAF8F5', padding: '2px 8px', borderRadius: '9999px' }}>
                    {tag._count.posts}
                  </span>
                )}
                <button
                  onClick={() => handleEdit(tag)}
                  style={{ background: 'none', border: 'none', color: '#888888', cursor: 'pointer', padding: '2px', display: 'flex' }}
                  title="Edit"
                >
                  <Edit size={13} />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(tag.id)}
                  style={{ background: 'none', border: 'none', color: '#DC3545', cursor: 'pointer', padding: '2px', display: 'flex' }}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEFEF', padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>No tags yet. Create your first tag!</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingId ? 'Edit Tag' : 'Create Tag'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tag name"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="tag-slug"
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #DADADA', background: '#FFFFFF', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !slug.trim() || createTag.isPending || updateTag.isPending}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#C89B3C',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: !name.trim() || !slug.trim() ? 'not-allowed' : 'pointer',
                  opacity: !name.trim() || !slug.trim() ? 0.6 : 1,
                }}
              >
                {editingId ? 'Save Changes' : 'Create Tag'}
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Delete Tag">
          <p style={{ fontSize: '14px', color: '#444444', marginBottom: '20px' }}>
            Are you sure you want to delete this tag? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => setDeleteConfirmId(null)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #DADADA', background: '#FFFFFF', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={deleteTag.isPending}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#DC3545',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {deleteTag.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
