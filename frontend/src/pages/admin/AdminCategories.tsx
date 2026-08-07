import { useState } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { useAdminCategories, useAdminCreateCategory, useAdminUpdateCategory, useAdminDeleteCategory } from '../../features/admin/hooks';
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

export default function AdminCategories() {
  const { data: categories, isLoading } = useAdminCategories();
  const createCategory = useAdminCreateCategory();
  const updateCategory = useAdminUpdateCategory();
  const deleteCategory = useAdminDeleteCategory();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setSlug('');
    setIcon('');
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!name.trim() || !slug.trim()) return;

    if (editingId) {
      updateCategory.mutate(
        { id: editingId, data: { name: name.trim(), slug: slug.trim(), icon: icon.trim() || undefined } },
        { onSuccess: () => { resetForm(); setShowModal(false); } }
      );
    } else {
      createCategory.mutate(
        { name: name.trim(), slug: slug.trim(), icon: icon.trim() || undefined },
        { onSuccess: () => { resetForm(); setShowModal(false); } }
      );
    }
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon || '');
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    deleteCategory.mutate(id, { onSuccess: () => setDeleteConfirmId(null) });
  };

  return (
    <div style={{ background: '#FAF8F5', minHeight: '88vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Tag style={{ width: '28px', height: '28px', color: '#C89B3C' }} />
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '32px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
              Manage Categories
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
            Add Category
          </button>
        </div>

        {/* Categories List */}
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: '60px', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #EFEFEF', opacity: 0.6 }} />
            ))}
          </div>
        ) : categories && categories.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #EFEFEF',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(200, 155, 60, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C89B3C',
                    fontSize: '18px',
                  }}>
                    {cat.icon || '📁'}
                  </div>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>{cat.name}</p>
                    <p style={{ fontSize: '12px', color: '#888888', margin: '2px 0 0 0' }}>/{cat.slug}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {cat._count?.posts !== undefined && (
                    <span style={{ fontSize: '12px', color: '#888888', marginRight: '8px' }}>
                      {cat._count.posts} posts
                    </span>
                  )}
                  <button
                    onClick={() => handleEdit(cat)}
                    style={{ background: 'none', border: 'none', color: '#6B6B6B', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cat.id)}
                    style={{ background: 'none', border: 'none', color: '#DC3545', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFEFEF', padding: '48px', textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: '#6B6B6B', margin: 0 }}>No categories yet. Create your first category!</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingId ? 'Edit Category' : 'Create Category'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="category-slug"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>Icon (emoji)</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="📁"
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
                disabled={!name.trim() || !slug.trim() || createCategory.isPending || updateCategory.isPending}
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
                {editingId ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Delete Category">
          <p style={{ fontSize: '14px', color: '#444444', marginBottom: '20px' }}>
            Are you sure you want to delete this category? This action cannot be undone.
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
              disabled={deleteCategory.isPending}
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
              {deleteCategory.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
