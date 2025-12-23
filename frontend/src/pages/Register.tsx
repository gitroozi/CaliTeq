import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuthStore } from '../store/authStore';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [showError, setShowError] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      setShowError(true);
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      // Navigate to onboarding after successful registration
      navigate('/onboarding/step1');
    } catch (error) {
      // Error is already set in the store
      console.error('Registration failed:', error);
    }
  };

  return (
    <AuthLayout
      title="Get started"
      subtitle="Create your account and start your personalized calisthenics journey."
      footer={
        <p>
          Already have an account?{' '}
          <NavLink to="/login" className="font-semibold text-primary-700 hover:text-primary-800">
            Log in
          </NavLink>
        </p>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && showError && (
          <Alert variant="error" onClose={() => setShowError(false)}>
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            {...register('firstName')}
            label="First name"
            placeholder="John"
            error={errors.firstName?.message}
            disabled={isLoading}
          />

          <Input
            {...register('lastName')}
            label="Last name"
            placeholder="Doe"
            error={errors.lastName?.message}
            disabled={isLoading}
          />
        </div>

        <Input
          {...register('email')}
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          disabled={isLoading}
        />

        <Input
          {...register('password')}
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          helperText="At least 8 characters with letters and numbers"
          disabled={isLoading}
        />

        <Input
          {...register('confirmPassword')}
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          Create account
        </Button>

        <div className="text-xs text-slate-500 text-center">
          By continuing, you agree to the CaliTeq terms and privacy policy.
        </div>
      </form>
    </AuthLayout>
  );
}
