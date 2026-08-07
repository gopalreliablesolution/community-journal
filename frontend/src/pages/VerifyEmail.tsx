import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useVerifyEmail, useResendVerification } from '../features/auth/hooks';
import Button from '../components/ui/Button';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();

  useEffect(() => {
    if (token) {
      verifyEmail.mutate(token);
    }
  }, [token]);

  if (token) {
    if (verifyEmail.isPending) {
      return (
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-neutral-heading">
            Verifying your email...
          </h2>
        </div>
      );
    }

    if (verifyEmail.isSuccess) {
      return (
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-status-success/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-status-success" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-neutral-heading mb-2">
            Email verified!
          </h2>
          <p className="text-neutral-darkgray mb-6">
            Your email has been verified successfully.
          </p>
          <Link
            to="/auth/login"
            className="inline-block bg-gold text-brown-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors"
          >
            Go to Login
          </Link>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-status-error/10 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-8 h-8 text-status-error" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-neutral-heading mb-2">
          Verification failed
        </h2>
        <p className="text-neutral-darkgray mb-6">
          The verification link is invalid or has expired.
        </p>
        <Link
          to="/auth/login"
          className="text-gold hover:text-gold-dark font-medium"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-heading font-bold text-neutral-heading mb-2">
        Verify your email
      </h2>
      <p className="text-neutral-darkgray mb-6">
        {email
          ? `We've sent a verification link to ${email}`
          : 'Please check your email for the verification link'}
      </p>

      {email && (
        <Button
          variant="secondary"
          onClick={() => resendVerification.mutate(email)}
          loading={resendVerification.isPending}
        >
          Resend verification email
        </Button>
      )}
    </div>
  );
}
