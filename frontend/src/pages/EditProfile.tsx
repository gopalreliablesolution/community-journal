import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, UserCheck, Lock, Trash2, Eye, EyeOff } from 'lucide-react';
import api from '../services/apiClient';
import { useAuthStore } from '../store/auth.store';
import { useChangePassword, useDeleteAccount } from '../features/profile/hooks';
import { Avatar } from '../components/ui/Avatar';
import Modal from '../components/ui/Modal';
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  background: '#FAF8F5',
  border: '1px solid #DADADA',
  borderRadius: '12px',
  fontSize: '14px',
  color: '#1A1A1A',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.2s ease',
};

export default function EditProfile() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        bio: user.bio || '',
      });
    }
  }, [user, reset]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const { data: response } = await api.patch('/me/profile', data);
      return response.data;
    },
    onSuccess: (updatedUser: any) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile settings updated successfully!');
      navigate('/dashboard');
    },
    onError: (err: any) => {
      const message = err.response?.data?.error?.message || 'Failed to update profile settings';
      toast.error(message);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'avatars');

      // Step 1: Upload file to media storage
      const { data: mediaResponse } = await api.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const mediaId = mediaResponse.data.id;

      // Step 2: Attach avatarId to user profile
      const { data: profileResponse } = await api.patch('/me/profile', { avatarId: mediaId });
      return profileResponse.data;
    },
    onSuccess: (updatedUser: any) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar updated successfully!');
      setAvatarFile(null);
      setAvatarPreview(null);
    },
    onError: (err: any) => {
      const message = err.response?.data?.error?.message || 'Failed to upload avatar photo';
      toast.error(message);
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (avatarFile) {
      await uploadAvatarMutation.mutateAsync(avatarFile);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    changePassword.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      { onSuccess: () => resetPassword() }
    );
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast.error('Please enter your password to confirm');
      return;
    }
    deleteAccount.mutate(deletePassword);
  };

  if (!user) {
    navigate('/auth/login');
    return null;
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '88vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        
        {/* Title */}
        <h1
          style={{
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: '32px',
            fontWeight: 600,
            color: '#1A1A1A',
            marginBottom: '28px',
            letterSpacing: '-0.02em',
          }}
        >
          Profile Settings
        </h1>

        {/* Avatar Section Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #EFEFEF',
            padding: '28px 32px',
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <h2
            style={{
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: '20px',
              fontWeight: 600,
              color: '#1A1A1A',
              marginTop: 0,
              marginBottom: '16px',
            }}
          >
            Profile Avatar
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Avatar
                name={user.name}
                src={avatarPreview || user.avatar?.path}
                size="xl"
              />
              <label
                htmlFor="avatar-upload"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: '#C89B3C',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'background 0.2s ease',
                }}
              >
                <Camera style={{ width: '16px', height: '16px' }} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <div>
              <p style={{ fontSize: '13.5px', color: '#6B6B6B', marginBottom: '8px' }}>
                Upload a new photo for your author avatar (JPEG, PNG, WebP).
              </p>
              {avatarFile && (
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  disabled={uploadAvatarMutation.isPending}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#C89B3C',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: uploadAvatarMutation.isPending ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(200, 155, 60, 0.3)',
                  }}
                >
                  {uploadAvatarMutation.isPending ? 'Saving Avatar...' : 'Save Avatar Photo'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Form Card */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #EFEFEF',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '20px',
                fontWeight: 600,
                color: '#1A1A1A',
                marginTop: 0,
                marginBottom: '4px',
              }}
            >
              Account Details
            </h2>

            {/* Display Name */}
            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                {...register('name')}
                style={{
                  ...inputStyle,
                  borderColor: errors.name ? '#DC3545' : '#DADADA',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C89B3C';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 155, 60, 0.15)';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.name ? '#DC3545' : '#DADADA';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#FAF8F5';
                }}
              />
              {errors.name && (
                <p style={{ fontSize: '12px', color: '#DC3545', marginTop: '4px' }}>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Author Bio
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                placeholder="Tell readers a bit about your journey and expertise..."
                style={{
                  ...inputStyle,
                  resize: 'none',
                  borderColor: errors.bio ? '#DC3545' : '#DADADA',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C89B3C';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 155, 60, 0.15)';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.bio ? '#DC3545' : '#DADADA';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#FAF8F5';
                }}
              />
              {errors.bio && (
                <p style={{ fontSize: '12px', color: '#DC3545', marginTop: '4px' }}>
                  {errors.bio.message}
                </p>
              )}
            </div>

            {/* Readonly Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                style={{ ...inputStyle, background: '#F1F1F1', color: '#888888', cursor: 'not-allowed' }}
              />
            </div>

            {/* Readonly Username */}
            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Username
              </label>
              <input
                type="text"
                value={user.username}
                disabled
                style={{ ...inputStyle, background: '#F1F1F1', color: '#888888', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #DADADA',
                background: '#FFFFFF',
                color: '#1A1A1A',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              style={{
                padding: '12px 28px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #C89B3C 0%, #A67C1F 100%)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: updateProfileMutation.isPending ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(200, 155, 60, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <UserCheck style={{ width: '16px', height: '16px' }} />
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {/* Password Change Card */}
        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #EFEFEF',
              padding: '32px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <Lock style={{ width: '20px', height: '20px', color: '#C89B3C' }} />
              <h2
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#1A1A1A',
                  marginTop: 0,
                  marginBottom: 0,
                }}
              >
                Change Password
              </h2>
            </div>

            {/* Current Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Current Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter current password"
                  {...registerPassword('currentPassword')}
                  style={{
                    ...inputStyle,
                    paddingRight: '40px',
                    borderColor: passwordErrors.currentPassword ? '#DC3545' : '#DADADA',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C89B3C';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 155, 60, 0.15)';
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = passwordErrors.currentPassword ? '#DC3545' : '#DADADA';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = '#FAF8F5';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#999999',
                    padding: 0,
                  }}
                >
                  {showCurrentPassword ? <EyeOff style={{ width: '17px', height: '17px' }} /> : <Eye style={{ width: '17px', height: '17px' }} />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p style={{ fontSize: '12px', color: '#DC3545', marginTop: '4px' }}>{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  {...registerPassword('newPassword')}
                  style={{
                    ...inputStyle,
                    paddingRight: '40px',
                    borderColor: passwordErrors.newPassword ? '#DC3545' : '#DADADA',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#C89B3C';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 155, 60, 0.15)';
                    e.currentTarget.style.background = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = passwordErrors.newPassword ? '#DC3545' : '#DADADA';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.background = '#FAF8F5';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#999999',
                    padding: 0,
                  }}
                >
                  {showNewPassword ? <EyeOff style={{ width: '17px', height: '17px' }} /> : <Eye style={{ width: '17px', height: '17px' }} />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p style={{ fontSize: '12px', color: '#DC3545', marginTop: '4px' }}>{passwordErrors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                {...registerPassword('confirmPassword')}
                style={{
                  ...inputStyle,
                  borderColor: passwordErrors.confirmPassword ? '#DC3545' : '#DADADA',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C89B3C';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 155, 60, 0.15)';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = passwordErrors.confirmPassword ? '#DC3545' : '#DADADA';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#FAF8F5';
                }}
              />
              {passwordErrors.confirmPassword && (
                <p style={{ fontSize: '12px', color: '#DC3545', marginTop: '4px' }}>{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={changePassword.isPending}
                style={{
                  padding: '12px 28px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #C89B3C 0%, #A67C1F 100%)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: changePassword.isPending ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(200, 155, 60, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Lock style={{ width: '16px', height: '16px' }} />
                {changePassword.isPending ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </form>

        {/* Danger Zone - Account Deletion */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(220, 53, 69, 0.2)',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Trash2 style={{ width: '20px', height: '20px', color: '#DC3545' }} />
            <h2
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '20px',
                fontWeight: 600,
                color: '#DC3545',
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              Delete Account
            </h2>
          </div>
          <p style={{ fontSize: '13.5px', color: '#6B6B6B', marginBottom: '16px', lineHeight: '1.5' }}>
            Once you delete your account, there is no going back. All your posts, comments, and data will be permanently removed.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid #DC3545',
              background: 'transparent',
              color: '#DC3545',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#DC3545';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#DC3545';
            }}
          >
            Delete My Account
          </button>
        </div>

        {/* Delete Account Confirmation Modal */}
        <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeletePassword(''); }} title="Delete Account">
          <p style={{ fontSize: '14px', color: '#444444', marginBottom: '16px', lineHeight: '1.5' }}>
            This action is <strong>irreversible</strong>. Please enter your password to confirm account deletion.
          </p>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#FAF8F5',
              border: '1px solid #DADADA',
              borderRadius: '12px',
              fontSize: '14px',
              color: '#1A1A1A',
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: '20px',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#DC3545';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#DADADA';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}
              style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #DADADA', background: '#FFFFFF', fontSize: '13.5px', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteAccount.isPending || !deletePassword}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: '#DC3545',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: deleteAccount.isPending || !deletePassword ? 'not-allowed' : 'pointer',
                opacity: deleteAccount.isPending || !deletePassword ? 0.6 : 1,
              }}
            >
              {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
