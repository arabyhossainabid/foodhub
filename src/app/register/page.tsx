"use client";

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
import { User, Mail, Lock, Building, MapPin, Utensils, Zap, ArrowRight } from "lucide-react";

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
      message: 'Provider details are required',
      path: ['shopName'],
    }
  );

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CUSTOMER' },
  });

  const handleRoleChange = (role: 'CUSTOMER' | 'PROVIDER') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        ...(data.role === 'PROVIDER' ? {} : { shopName: undefined, address: undefined, cuisine: undefined })
      };
      await authService.register(payload);
      toast.success('Account created! Please login.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 pt-32 pb-20 px-4 relative overflow-hidden'>
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

      {isLoading && <FullPageLoader message='Assembling your profile...' transparent />}
      
      <div className='w-full max-w-xl relative z-10'>
        <Card className='border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] bg-white overflow-hidden'>
          <div className="bg-gray-950 p-10 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl"></div>
             <CardTitle className='text-3xl font-black italic tracking-tighter mb-2'>Join Food<span className="text-orange-500">Hub</span></CardTitle>
             <CardDescription className='text-gray-400 font-medium'>Create an account to start your culinary journey</CardDescription>
          </div>

          <CardContent className='p-8 md:p-12 space-y-8'>
            {/* Role Switcher */}
            <div className='flex p-1.5 bg-gray-100 rounded-2xl'>
              <button
                type='button'
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all uppercase tracking-widest ${
                  selectedRole === 'CUSTOMER' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
                onClick={() => handleRoleChange('CUSTOMER')}
              >
                Customer
              </button>
              <button
                type='button'
                className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all uppercase tracking-widest ${
                  selectedRole === 'PROVIDER' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
                onClick={() => handleRoleChange('PROVIDER')}
              >
                Provider
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
              <div className='space-y-4'>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                   <Input 
                    placeholder='Full Name' 
                    className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                    {...register('name')} 
                   />
                </div>
                {errors.name && <p className='text-[10px] text-red-500 font-bold uppercase ml-2'>{errors.name.message}</p>}

                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                   <Input 
                    type="email"
                    placeholder='Email Address' 
                    className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                    {...register('email')} 
                   />
                </div>
                {errors.email && <p className='text-[10px] text-red-500 font-bold uppercase ml-2'>{errors.email.message}</p>}

                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                   <Input 
                    type="password"
                    placeholder='Password' 
                    className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                    {...register('password')} 
                   />
                </div>
                {errors.password && <p className='text-[10px] text-red-500 font-bold uppercase ml-2'>{errors.password.message}</p>}

                {selectedRole === 'PROVIDER' && (
                  <div className='space-y-4 pt-2 animate-in fade-in slide-in-from-top-2'>
                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-4 flex items-center gap-3">
                       <Zap size={20} className="text-orange-500" />
                       <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">Kitchen Details Required</p>
                    </div>
                    <div className="relative">
                       <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <Input placeholder='Shop/Kitchen Name' className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50" {...register('shopName')} />
                    </div>
                    <div className="relative">
                       <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <Input placeholder='Operational Address' className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50" {...register('address')} />
                    </div>
                    <div className="relative">
                       <Utensils className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                       <Input placeholder='Cuisine Specialties' className="h-12 pl-12 rounded-xl border-gray-100 bg-gray-50" {...register('cuisine')} />
                    </div>
                  </div>
                )}
              </div>

              <Button type='submit' className='w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-white shadow-lg shadow-orange-500/20 transition-all active:scale-95 group'>
                Create Account <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className='text-center pt-4'>
              <p className='text-gray-400 text-sm font-medium'>
                Already a member?{' '}
                <Link href='/login' className='text-gray-950 font-bold hover:underline underline-offset-4 decoration-orange-500 decoration-2 transition-all'>
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
