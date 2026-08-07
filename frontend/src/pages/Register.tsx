import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Check, X, Loader2 } from 'lucide-react';
import { useCheckUsername } from '../features/auth/hooks';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/apiClient';
import { useAuthStore } from '../store/auth.store';
import { toast } from 'sonner';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, and underscores only'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

type RegisterForm = z.infer<typeof registerSchema>;

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

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const checkUsername = useCheckUsername();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const watchedUsername = watch('username', '');
  const debouncedUsername = useDebounce(watchedUsername, 500);
  const usernameAvailable = debouncedUsername && debouncedUsername.length >= 3
    ? checkUsername.data?.data?.data?.available
    : undefined;

  useEffect(() => {
    if (debouncedUsername && debouncedUsername.length >= 3) {
      checkUsername.mutate(debouncedUsername);
    }
  }, [debouncedUsername]);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError(null);
      // Check username availability before submitting
      const checkResult = await checkUsername.mutateAsync(data.username);
      if (!checkResult.data.data.available) {
        setError('This username is already taken. Please choose another.');
        toast.error('Username already taken');
        return;
      }
      const response = await api.post('/auth/register', data);
      const { user, accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(user);
      toast.success('Account created successfully! Welcome.');
      navigate('/');
    } catch (err: any) {
      const errorData = err.response?.data?.error;
      let errorMessage = 'Registration failed. Please try again.';
      if (errorData?.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
        errorMessage = errorData.details.map((d: any) => d.message).join(' • ');
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      {/* Title */}
      <h2
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '30px',
          fontWeight: 700,
          color: '#1A1A1A',
          letterSpacing: '-0.02em',
          marginBottom: '4px',
        }}
      >
        Create account
      </h2>

      {/* Subtitle */}
      <p
        style={{
          fontSize: '12.5px',
          fontWeight: 500,
          color: '#6B6B6B',
          marginBottom: '16px',
        }}
      >
        Let's get started with your 30 days trial
      </p>

      {/* Error banner */}
      {error && (
        <div
          style={{
            marginBottom: '14px',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(220,53,69,0.08)',
            border: '1px solid rgba(220,53,69,0.2)',
            color: '#DC3545',
            fontSize: '12px',
            lineHeight: '1.4',
          }}
        >
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Row 1: Name & Username Side-by-Side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Name"
              {...register('name')}
              style={{ ...inputStyle, borderColor: errors.name ? '#DC3545' : '#DADADA' }}
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
              <p style={{ fontSize: '11px', color: '#DC3545', marginTop: '3px', paddingLeft: '2px' }}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register('username')}
              style={{ ...inputStyle, borderColor: errors.username ? '#DC3545' : '#DADADA' }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#C89B3C';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 155, 60, 0.15)';
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.username ? '#DC3545' : '#DADADA';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = '#FAF8F5';
              }}
            />
            {errors.username && (
              <p style={{ fontSize: '11px', color: '#DC3545', marginTop: '3px', paddingLeft: '2px' }}>
                {errors.username.message}
              </p>
            )}
            {!errors.username && watchedUsername && watchedUsername.length >= 3 && (
              <p style={{ fontSize: '11px', marginTop: '3px', paddingLeft: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {checkUsername.isPending ? (
                  <span style={{ color: '#888888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Loader2 style={{ width: '11px', height: '11px', animation: 'spin 1s linear infinite' }} />
                    Checking...
                  </span>
                ) : usernameAvailable === true ? (
                  <span style={{ color: '#28A745', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check style={{ width: '11px', height: '11px' }} />
                    Username available
                  </span>
                ) : usernameAvailable === false ? (
                  <span style={{ color: '#DC3545', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <X style={{ width: '11px', height: '11px' }} />
                    Username already taken
                  </span>
                ) : null}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            style={{ ...inputStyle, borderColor: errors.email ? '#DC3545' : '#DADADA' }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#C89B3C';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 155, 60, 0.15)';
              e.currentTarget.style.background = '#FFFFFF';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.email ? '#DC3545' : '#DADADA';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = '#FAF8F5';
            }}
          />
          {errors.email && (
            <p style={{ fontSize: '11px', color: '#DC3545', marginTop: '3px', paddingLeft: '2px' }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Row 3: Password */}
        <div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password (e.g. Pass1234)"
              {...register('password')}
              style={{
                ...inputStyle,
                paddingRight: '40px',
                borderColor: errors.password ? '#DC3545' : '#DADADA',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#C89B3C';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 155, 60, 0.15)';
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.password ? '#DC3545' : '#DADADA';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = '#FAF8F5';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
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
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPassword ? <EyeOff style={{ width: '17px', height: '17px' }} /> : <Eye style={{ width: '17px', height: '17px' }} />}
            </button>
          </div>
          {errors.password && (
            <p style={{ fontSize: '11px', color: '#DC3545', marginTop: '3px', paddingLeft: '2px' }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '12px',
            border: 'none',
            background: isSubmitting ? '#DADADA' : '#C89B3C',
            color: '#FFFFFF',
            fontSize: '14.5px',
            fontWeight: 600,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(200, 155, 60, 0.35)',
            transition: 'all 0.2s ease',
            marginTop: '4px',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = '#A67C1F';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSubmitting) {
              e.currentTarget.style.background = '#C89B3C';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {/* Switch to Login link */}
      <div style={{ marginTop: '14px', fontSize: '12.5px', color: '#6B6B6B' }}>
        Already have an account?{' '}
        <Link
          to="/auth/login"
          style={{ color: '#C89B3C', fontWeight: 600, textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#A67C1F')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#C89B3C')}
        >
          Login
        </Link>
      </div>

      {/* Social Logins Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: '14px',
          marginTop: '18px',
        }}
      >
        {/* Google */}
        <button
          type="button"
          onClick={() => { window.location.href = '/api/v1/auth/google'; }}
          style={{
            width: '60px',
            height: '42px',
            borderRadius: '12px',
            background: '#FFFFFF',
            border: '1px solid #F1F1F1',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#C89B3C')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#F1F1F1')}
        >
          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </button>

        {/* Apple */}
        <button
          type="button"
          onClick={() => { window.location.href = '/api/v1/auth/apple'; }}
          style={{
            width: '60px',
            height: '42px',
            borderRadius: '12px',
            background: '#FFFFFF',
            border: '1px solid #F1F1F1',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#C89B3C')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#F1F1F1')}
        >
          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }} fill="#1A1A1A">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.66-.8 1.1-1.92.98-3.04-.95.04-2.1.63-2.78 1.43-.61.71-1.14 1.86-1 2.97 1.06.08 2.14-.55 2.8-1.36z" />
          </svg>
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={() => { window.location.href = '/api/v1/auth/facebook'; }}
          style={{
            width: '60px',
            height: '42px',
            borderRadius: '12px',
            background: '#FFFFFF',
            border: '1px solid #F1F1F1',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#C89B3C')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#F1F1F1')}
        >
          <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }} fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
