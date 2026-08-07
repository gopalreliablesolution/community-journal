import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/apiClient';
import { useAuthStore } from '../../store/auth.store';
import { toast } from 'sonner';

interface CommentFormProps {
  postId: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#FFFFFF',
  border: '1px solid #DCE1E7',
  borderRadius: '8px',
  fontSize: '14px',
  color: '#1A1A1A',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
};

export default function CommentForm({ postId }: CommentFormProps) {
  const user = useAuthStore((state) => state.user);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const addCommentMutation = useMutation({
    mutationFn: async (commentContent: string) => {
      const { data } = await api.post(`/posts/${postId}/comments`, { content: commentContent });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setContent('');
      toast.success('Comment posted successfully');
    },
    onError: () => {
      toast.error('Failed to post comment. Please sign in to comment.');
    },
  });

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to post comments.');
      navigate('/auth/login', { state: { from: window.location.pathname } });
      return;
    }
    if (!content.trim()) {
      toast.error('Please write a comment before submitting.');
      return;
    }
    addCommentMutation.mutate(content.trim());
  };

  return (
    <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #EFEFEF' }}>
      {/* Title & Disclaimer header */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
        <h4 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
          Leave a Reply
        </h4>
        <p style={{ fontSize: '12.5px', fontStyle: 'italic', color: '#888888', margin: 0 }}>
          Your email address will not be published. Required fields are marked <span style={{ color: '#DC3545' }}>*</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Comment Textarea */}
        <div>
          <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '8px' }}>
            Comment <span style={{ color: '#DC3545' }}>*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder=""
            style={{
              ...inputStyle,
              minHeight: '130px',
              resize: 'vertical',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#C89B3C')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#DCE1E7')}
          />
        </div>

        {/* 3 Inputs Row: Name, Email, Website */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
              Name <span style={{ color: '#DC3545' }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C89B3C')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#DCE1E7')}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
              Email <span style={{ color: '#DC3545' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C89B3C')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#DCE1E7')}
            />
          </div>

          {/* Website */}
          <div>
            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
              Website
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder=""
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#C89B3C')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#DCE1E7')}
            />
          </div>
        </div>

        {/* Post Comment Button - Always active, validates on click */}
        <div style={{ marginTop: '8px' }}>
          <button
            type="submit"
            disabled={addCommentMutation.isPending}
            style={{
              padding: '12px 28px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #C89B3C 0%, #A67C1F 100%)',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              cursor: addCommentMutation.isPending ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(200, 155, 60, 0.35)',
            }}
            onMouseEnter={(e) => {
              if (!addCommentMutation.isPending) {
                e.currentTarget.style.opacity = '0.92';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!addCommentMutation.isPending) {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}
