import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';

const signupSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['buyer', 'supplier']),
  companyName: z.string().min(2, 'Company name is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const { signup, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'buyer',
    }
  });

  const onSubmit = async (data: SignupFormValues) => {
    setServerError('');
    try {
      const user = await signup(data);
      if (user.role === 'supplier') {
        navigate('/seller/dashboard');
      } else {
        navigate('/buyer/dashboard');
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('Registration failed');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 text-foreground mt-16">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-foreground">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>
        
        {serverError && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {serverError}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
             <label className="block text-sm font-medium">Role</label>
             <select
               id="role-select"
               {...register('role')}
               className="mt-1 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm bg-card"
             >
               <option value="buyer">Buyer (Manufacturer/Recycler)</option>
               <option value="supplier">Supplier (Collector/Aggregator)</option>
             </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                {...register('fullName')}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm bg-card px-3"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                type="text"
                {...register('companyName')}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm bg-card px-3"
              />
              {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Email address</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-0 py-1.5 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm bg-card px-3"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                {...register('city')}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm bg-card px-3"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">State</label>
              <input
                type="text"
                {...register('state')}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm bg-card px-3"
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                {...register('password')}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm bg-card px-3"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-primary sm:text-sm bg-card px-3"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="flex justify-center w-full mt-4">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    // We need to know the role they want to signup with
                    // the form default is 'buyer' but they might have changed it.
                    // Instead of using watch(), we can just grab it from DOM to keep it simple, or use form methods.
                    // For safety, let's grab it by element ID.
                    const roleSelect = document.getElementById('role-select') as HTMLSelectElement;
                    const selectedRole = roleSelect ? roleSelect.value : 'buyer';
                    
                    const user = await googleLogin({ 
                      credential: credentialResponse.credential,
                      role: selectedRole
                    });
                    
                    if (user.role === 'supplier') {
                      navigate('/seller/dashboard');
                    } else {
                      navigate('/buyer/dashboard');
                    }
                  } catch (err) {
                    setServerError('Google Signup failed. Please ensure your email is not already registered via local signup.');
                  }
                }
              }}
              onError={() => {
                setServerError('Google Signup Failed');
              }}
              theme="filled_blue"
              shape="pill"
              text="signup_with"
            />
          </div>
        </form>
      </div>
    </div>
  );
};
