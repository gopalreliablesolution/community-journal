import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useForgotPassword } from '../features/auth/hooks';
import Button from '../components/ui/Button';
import FormInput from '../components/ui/FormInput';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPassword.mutateAsync(data.email);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-status-success/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-8 h-8 text-status-success" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-neutral-heading mb-2">
          Check your email
        </h2>
        <p className="text-neutral-darkgray mb-6">
          We've sent a password reset link to <strong>{getValues('email')}</strong>
        </p>
        <Link
          to="/auth/login"
          className="text-gold hover:text-gold-dark font-medium inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-neutral-heading mb-2">
          Forgot your password?
        </h2>
        <p className="text-neutral-darkgray">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={forgotPassword.isPending}
        >
          Send reset link
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/auth/login"
          className="text-gold hover:text-gold-dark font-medium inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    </div>
  );
}
