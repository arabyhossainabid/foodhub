"use client";

import { FullPageLoader } from '@/components/shared/FullPageLoader';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail, ShieldCheck, User, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      const { token, user } = response.data.data;
      login(token, user);
      toast.success(`Welcome back!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (role: 'USER' | 'ADMIN') => {
    if (role === 'USER') {
      setValue('email', 'customer@foodhub.com');
      setValue('password', 'password123');
    } else {
      setValue('email', 'admin@foodhub.com');
      setValue('password', 'admin123');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 bg-gray-50 pt-20 relative overflow-hidden'>
      {/* Decorative background elements */}
      <div className='absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full translate-x-1/3'></div>
      <div className='absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full -translate-x-1/4'></div>

      {isLoading && <FullPageLoader message='Securing access...' transparent />}
      
      <div className='w-full max-w-lg relative z-10'>
        <Card className='border-none shadow-2xl shadow-gray-200/50 rounded-[2rem] bg-white overflow-hidden'>
          <div className="bg-gray-950 p-8 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl"></div>
             <div className="mx-auto w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg mb-4">
               <ShieldCheck size={24} />
             </div>
             <CardTitle className='text-2xl font-black italic tracking-tight mb-1'>Welcome Back</CardTitle>
             <CardDescription className='text-gray-400 font-medium text-sm'>Access your culinary headquarters</CardDescription>
          </div>

          <CardContent className='p-8 space-y-6'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-4'>
                <div className='relative'>
                   <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                   <Input
                    type='email'
                    placeholder='Email Address'
                    className='h-12 pl-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium'
                    {...register('email')}
                   />
                </div>
                {errors.email && <p className='text-[10px] text-red-500 font-bold ml-2 uppercase'>{errors.email.message}</p>}
                
                <div className='relative'>
                   <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-300' size={18} />
                   <Input
                    type='password'
                    placeholder='Password'
                    className='h-12 pl-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium'
                    {...register('password')}
                   />
                </div>
                {errors.password && <p className='text-[10px] text-red-500 font-bold ml-2 uppercase'>{errors.password.message}</p>}
              </div>

              <div className="flex justify-end">
                 <Link href="#" className="text-xs font-bold text-orange-500 hover:underline">Forgot password?</Link>
              </div>

              <Button type='submit' className='w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-white shadow-lg transition-all active:scale-95 group'>
                Sign In <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            {/* Quick Demo Access */}
            <div className='grid grid-cols-2 gap-3 pt-2'>
               <Button 
                 variant="outline" 
                 onClick={() => setDemoCredentials('USER')}
                 className="h-11 rounded-xl font-bold border-gray-100 bg-gray-50 hover:bg-white transition-all text-xs gap-2"
               >
                 <User size={14} className="text-orange-500" /> User Demo
               </Button>
               <Button 
                 variant="outline" 
                 onClick={() => setDemoCredentials('ADMIN')}
                 className="h-11 rounded-xl font-bold border-gray-100 bg-gray-50 hover:bg-white transition-all text-xs gap-2"
               >
                 <Users size={14} className="text-orange-500" /> Admin Demo
               </Button>
            </div>

            <div className='relative py-2'>
              <div className='absolute inset-0 flex items-center'><span className='w-full border-t border-gray-100'></span></div>
              <div className='relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400'><span className='bg-white px-3'>Or connect with</span></div>
            </div>

            <Button
              variant='outline'
              className='w-full h-11 rounded-xl border-gray-100 bg-gray-50 hover:bg-white font-bold flex gap-3 text-sm'
              onClick={() => (window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/google`)}
            >
              <img src='https://www.google.com/favicon.ico' className='w-4 h-4' alt='Google' />
              Google Authentication
            </Button>

            <div className='text-center pt-4'>
              <p className='text-gray-400 text-sm font-medium'>
                New here?{' '}
                <Link href='/register' className='text-gray-950 font-bold hover:underline underline-offset-4 decoration-orange-500 decoration-2 transition-all'>
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
