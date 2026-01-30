/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['CUSTOMER', 'PROVIDER']),
    shopName: z.string().optional(),
    address: z.string().optional(),
    cuisine: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === 'PROVIDER') {
        return !!data.shopName && !!data.address && !!data.cuisine;
      }
      return true;
    },
    {
      message: 'Shop Name, Address, and Cuisine are required for Providers',
      path: ['shopName'],
    }
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const initialRole =
    searchParams?.get('role') === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';

  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'PROVIDER'>(
    initialRole
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: initialRole },
  });

  const handleRoleChange = (role: 'CUSTOMER' | 'PROVIDER') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Cleanly structure the registration payload
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        ...(data.role === 'PROVIDER'
          ? {
              shopName: data.shopName,
              address: data.address,
              cuisine: data.cuisine,
            }
          : {}),
      };

      // Call our centralized auth service
      await authService.register(payload);

      toast.success('Account created successfully! Welcome to FoodHub.');
      router.push('/login');
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50'>
      {isLoading && (
        <FullPageLoader message='Creating your account...' transparent />
      )}
      <div className='w-full max-w-lg'>
        <Card className='shadow-xl border-gray-100'>
          <CardHeader className='text-center pt-10 pb-6'>
            <CardTitle className='text-3xl font-bold'>Create Account</CardTitle>
            <CardDescription className='text-gray-500'>
              Join the FoodHub community today
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-8 space-y-6'>
            <div className='flex p-1 bg-gray-100 rounded-md'>
              <button
                type='button'
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                  selectedRole === 'CUSTOMER'
                    ? 'bg-white text-orange-500 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleRoleChange('CUSTOMER')}
              >
                I am a Customer
              </button>
              <button
                type='button'
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                  selectedRole === 'PROVIDER'
                    ? 'bg-white text-orange-500 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => handleRoleChange('PROVIDER')}
              >
                I am a Provider
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium leading-none'>
                  Full Name
                </label>
                <Input placeholder='John Doe' {...register('name')} />
                {errors.name && (
                  <p className='text-xs text-red-500 font-medium'>
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium leading-none'>
                  Email
                </label>
                <Input
                  type='email'
                  placeholder='asif@example.com'
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-xs text-red-500 font-medium'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium leading-none'>
                  Password
                </label>
                <Input
                  type='password'
                  placeholder='••••••••'
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-xs text-red-500 font-medium'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {selectedRole === 'PROVIDER' && (
                <div className='space-y-4 pt-2 animate-in fade-in slide-in-from-top-2'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium leading-none'>
                      Shop Name
                    </label>
                    <Input
                      placeholder='My Delicious Food'
                      {...register('shopName')}
                    />
                    {errors.shopName && (
                      <p className='text-xs text-red-500 font-medium'>
                        {errors.shopName.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium leading-none'>
                      Shop Address
                    </label>
                    <Input
                      placeholder='123 Street, City'
                      {...register('address')}
                    />
                    {errors.address && (
                      <p className='text-xs text-red-500 font-medium'>
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium leading-none'>
                      Cuisine Type
                    </label>
                    <Input
                      placeholder='Italian, Bangladeshi, Fast Food...'
                      {...register('cuisine')}
                    />
                  </div>
                </div>
              )}

              <Button type='submit' className='w-full' isLoading={isLoading}>
                Register
              </Button>
            </form>

            <p className='text-center text-sm pb-4 text-gray-600'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-orange-500 font-bold hover:underline'
              >
                Login Here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
