import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { useResetPassword } from '../features/auth/hooks';

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const resetPassword = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <div className="text-center">
        <h2
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '30px',
            fontWeight: 700,
            color: '#1A1A1A',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}
        >
          Invalid Reset Link
        </h2>
        <p style={{ fontSize: '13.5px', color: '#6B6B6B', marginBottom: '20px' }}>
          This password reset link is invalid or has expired.
        </p>
        <Link
          to="/auth/forgot-password"
          style={{
            color: '#C89B3C',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '13.5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ArrowLeft style={{ width: '14px', height: '14px' }} />
          Request a new reset link
        </Link>
      </div>
    );
  }

  if (resetPassword.isSuccess) {
    return (
      <div className="text-center">
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(40, 167, 69, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <CheckCircle style={{ width: '32px', height: '32px', color: '#28A745' }} />
        </div>
        <h2
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '26px',
            fontWeight: 700,
            color: '#1A1A1A',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}
        >
          Password Reset Successful
        </h2>
        <p style={{ fontSize: '13.5px', color: '#6B6B6B', marginBottom: '20px' }}>
          Your password has been updated. You can now log in with your new password.
        </p>
        <Link
          to="/auth/login"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: '12px',
            background: '#C89B3C',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 6px 20px rgba(200, 155, 60, 0.35)',
          }}
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate({ token, password: data.password });
  };

  return (
    <div>
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
        Reset your password
      </h2>
      <p style={{ fontSize: '12.5px', fontWeight: 500, color: '#6B6B6B', marginBottom: '20px' }}>
        Enter your new password below
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* New Password */}
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
            New Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
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

        {/* Confirm Password */}
        <div>
          <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#333333', marginBottom: '6px' }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              {...register('confirmPassword')}
              style={{
                ...inputStyle,
                paddingRight: '40px',
                borderColor: errors.confirmPassword ? '#DC3545' : '#DADADA',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#C89B3C';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(200, 155, 60, 0.15)';
                e.currentTarget.style.background = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = errors.confirmPassword ? '#DC3545' : '#DADADA';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = '#FAF8F5';
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
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
              {showConfirm ? <EyeOff style={{ width: '17px', height: '17px' }} /> : <Eye style={{ width: '17px', height: '17px' }} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p style={{ fontSize: '11px', color: '#DC3545', marginTop: '3px', paddingLeft: '2px' }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Error message */}
        {resetPassword.isError && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(220,53,69,0.08)',
              border: '1px solid rgba(220,53,69,0.2)',
              color: '#DC3545',
              fontSize: '12px',
            }}
          >
            Failed to reset password. The link may have expired.
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={resetPassword.isPending}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '12px',
            border: 'none',
            background: resetPassword.isPending ? '#DADADA' : '#C89B3C',
            color: '#FFFFFF',
            fontSize: '14.5px',
            fontWeight: 600,
            cursor: resetPassword.isPending ? 'not-allowed' : 'pointer',
            boxShadow: resetPassword.isPending ? 'none' : '0 6px 20px rgba(200, 155, 60, 0.35)',
            transition: 'all 0.2s ease',
            marginTop: '4px',
          }}
        >
          {resetPassword.isPending ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      <div style={{ marginTop: '14px', textAlign: 'center' }}>
        <Link
          to="/auth/login"
          style={{
            color: '#C89B3C',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '12.5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <ArrowLeft style={{ width: '14px', height: '14px' }} />
          Back to login
        </Link>
      </div>
    </div>
  );
}
