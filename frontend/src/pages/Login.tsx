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

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showError, setShowError] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      setShowError(true);
      await login(data);
      // Navigate to dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      // Error is already set in the store
      console.error('Login failed:', error);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Pick up your training plan and log today's workout in minutes."
      footer={
        <p>
          New here?{' '}
          <NavLink to="/register" className="font-semibold text-primary-700 hover:text-primary-800">
            Create an account
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
          disabled={isLoading}
        />

        <Button type="submit" fullWidth isLoading={isLoading}>
          Log in
        </Button>

        <div className="text-xs text-slate-500 text-center">
          By continuing, you agree to the CaliFlow terms and privacy policy.
        </div>
      </form>
    </AuthLayout>
  );
}
