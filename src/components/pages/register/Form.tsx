'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { 
  kenyanUniversities, 
  universityHasBranches, 
  getUniversityBranches 
} from '@/types/universities';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const RegistrationFormSection = () => {
  const { signUp, user } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
    university: '',
    branch: '',
    institution: '',
    studentId: '',
    phoneNumber: '',
    acceptTerms: false,
    acceptMarketing: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);

  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);
  
   useEffect(() => {
    if (formData.university && formData.university !== 'Other / Not Listed') {
      handleInputChange('institution', 'N/A');
      
      // Update available branches when university changes
      if (universityHasBranches(formData.university)) {
        setAvailableBranches(getUniversityBranches(formData.university));
      } else {
        setAvailableBranches([]);
        handleInputChange('branch', ''); // Clear branch if university doesn't have branches
      }
    } else if (formData.institution === 'N/A' && formData.university === 'Other / Not Listed') {
      handleInputChange('institution', '');
      setAvailableBranches([]);
      handleInputChange('branch', '');
    }
  }, [formData.university]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.repeatPassword) newErrors.repeatPassword = 'Passwords do not match';
    if (!formData.university) newErrors.university = 'University or institution is required';
    
    // Validate branch selection if university has branches
    if (availableBranches.length > 0 && !formData.branch) {
      newErrors.branch = 'Please select a university branch';
    }
    
    // Validate custom institution if "Other" is selected
    if (formData.university === 'Other / Not Listed' && !formData.institution.trim()) {
      newErrors.institution = 'Please enter your institution name';
    }
    
    // Validate student ID for university students
    if (formData.university && formData.university !== 'Other / Not Listed' && !formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    
    if (!formData.username.trim()) newErrors.username = 'Username/Gamertag is required';
    if (!formData.dob.trim()) newErrors.dob = 'Date of birth is required';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Prepare university data with branch if applicable
      const universityData = formData.university === 'Other / Not Listed' 
        ? formData.institution 
        : formData.branch 
          ? `${formData.university} - ${formData.branch}`
          : formData.university;

      const { error, user } = await signUp(
        formData.email,
        formData.password,
        {
          fullname: formData.fullName,
          email: formData.email,
          university: universityData,
          student_id: formData.studentId,
          phone_number: formData.phoneNumber,
        }
      );

      if (error) {
        const errorMessage = (error as any)?.message || 'Registration failed. Please try again.';
        if (errorMessage.includes('User already registered') || errorMessage.includes('already exists')) {
          setErrors({ general: 'An account with this email already exists. Please sign in instead.' });
        } else {
          setErrors({ general: errorMessage });
        }
      } else if (user) {
        alert('Registration successful! Please check your email to confirm your account.');
        router.push('/verify-email');
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <section className="w-full py-12 relative bg-black">
        <div className="max-w-[577px] mx-auto">
          <h2 className="text-center [font-family:'Hind',Helvetica] font-bold text-[#961c18] text-[32px] mb-8">
            Loading...
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 md:py-12 relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-no-repeat bg-center" style={{ backgroundImage: "url('/images/Mask Group.png')" }}></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-cover bg-no-repeat bg-center transform -scale-x-100" style={{ backgroundImage: "url('/images/Mask Group.png')" }}></div>
      </div>

      <div className="max-w-[577px] mx-auto px-4 md:px-0 relative z-10">
        <h2 className="text-center [font-family:'Hind',Helvetica] font-bold text-[#961c18] text-2xl md:text-[32px] mb-6 md:mb-8">
          CREATE A NEW ACCOUNT
        </h2>

        {errors.general && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="[font-family:'Hind',Helvetica] font-medium text-[#961c18] text-base">Full Name</Label>
            <input id="fullName" type="text" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: `2px solid ${errors.fullName ? '#ef4444' : '#961c18'}`, backgroundColor: 'black', color: 'white', padding: '0 12px', outline: 'none' }} placeholder="Enter your full name" disabled={isLoading} />
            {errors.fullName && (<p className="text-red-400 text-sm">{errors.fullName}</p>)}
          </div>
          
          {/* D.O.B and Gender */}
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="dob" className="[font-family:'Hind',Helvetica] font-medium text-[#961c18] text-base">D.O.B</Label>
                <DatePicker
                        id="dob"
                        selected={formData.dob ? new Date(formData.dob) : null}
                        onChange={(date) => handleInputChange("dob", date ? date.toISOString().split("T")[0] : "")}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select" // makes year/month selectable via dropdown
                        placeholderText="Select your date of birth"
                        className="w-full h-9 rounded-lg border-2 border-[#961c18] bg-black text-white px-3 outline-none"
                        calendarClassName="bg-black text-white border-[#961c18]"
                        wrapperClassName="w-full"
                        />
                        {errors.dob && <p className="text-red-400 text-sm">{errors.dob}</p>}


              {errors.dob && (<p className="text-red-400 text-sm">{errors.dob}</p>)}
            </div>
            <div className="space-y-2 flex-1">
              <Label htmlFor="gender" className="[font-family:'Hind',Helvetica] font-medium text-[#961c18] text-base">Gender</Label>
              <select id="gender" value={formData.gender} onChange={(e) => handleInputChange('gender', e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: '2px solid #961c18', backgroundColor: 'black', color: 'white', padding: '0 12px', outline: 'none' }}>
                <option value="">Select gender</option>
                {genderOptions.map((option) => (<option key={option} value={option.toLowerCase()}>{option}</option>))}
              </select>
            </div>
          </div>

          {/* Username/Gamertag */}
          <div className="space-y-1">
            <Label htmlFor="username" className="[font-family:'Hind',Helvetica] font-normal text-[#961c18] text-xl">Username/Gamertag*</Label>
            <input id="username" type="text" value={formData.username} onChange={(e) => handleInputChange('username', e.target.value)} maxLength={12} style={{ width: '100%', height: '36px', borderRadius: '8px', border: `2px solid ${errors.username ? '#ef4444' : '#961c18'}`, backgroundColor: 'black', color: 'white', padding: '0 12px', outline: 'none' }} placeholder="Enter username" disabled={isLoading} />
            <p className="[font-family:'Hind',Helvetica] font-normal text-[#961c18] text-xs">(Max. 12 characters) - {formData.username.length}/12</p>
            {errors.username && (<p className="text-red-400 text-sm">{errors.username}</p>)}
          </div>

          {/* Email, Password, Repeat Password... */}
          <div className="space-y-2">
            <Label htmlFor="email" className="[font-family:'Hind',Helvetica] font-normal text-[#961c18] text-xl">Email Address*</Label>
            <input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: `2px solid ${errors.email ? '#ef4444' : '#961c18'}`, backgroundColor: 'black', color: 'white', padding: '0 12px', outline: 'none' }} placeholder="you@email.com" disabled={isLoading} />
            {errors.email && (<p className="text-red-400 text-sm">{errors.email}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="[font-family:'Hind',Helvetica] font-normal text-[#961c18] text-xl">Password*</Label>
            <input id="password" type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: `2px solid ${errors.password ? '#ef4444' : '#961c18'}`, backgroundColor: 'black', color: 'white', padding: '0 12px', outline: 'none' }} placeholder="Enter password" disabled={isLoading} />
            {errors.password && (<p className="text-red-400 text-sm">{errors.password}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="repeatPassword" className="[font-family:'Hind',Helvetica] font-normal text-[#961c18] text-xl">Repeat Password*</Label>
            <input id="repeatPassword" type="password" value={formData.repeatPassword} onChange={(e) => handleInputChange('repeatPassword', e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: `2px solid ${errors.repeatPassword ? '#ef4444' : '#961c18'}`, backgroundColor: 'black', color: 'white', padding: '0 12px', outline: 'none' }} placeholder="Repeat password" disabled={isLoading} />
            {errors.repeatPassword && (<p className="text-red-400 text-sm">{errors.repeatPassword}</p>)}
          </div>

          {/* University/Institution */}
          <div className="space-y-2">
            <Label htmlFor="university" className="[font-family:'Hind',Helvetica] font-normal text-[#961c18] text-xl">University*</Label>
            <select id="university" value={formData.university} onChange={(e) => handleInputChange('university', e.target.value)} style={{ width: '100%', height: '36px', borderRadius: '8px', border: `2px solid ${errors.university ? '#ef4444' : '#961c18'}`, backgroundColor: 'black', color: formData.university ? 'white' : '#9ca3af', padding: '0 12px', outline: 'none' }} disabled={isLoading}>
              <option value="" disabled>Select your university or institution</option>
              {kenyanUniversities.map((uni) => (<option key={uni.id} value={uni.name}>{uni.name}</option>))}
            </select>
            {errors.university && (<p className="text-red-400 text-sm">{errors.university}</p>)}
          </div>

          {/* Conditional Branch Selection */}
          {availableBranches.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="branch" className="[font-family:'Hind',Helvetica] font-normal text-[#961c18] text-xl">University Branch*</Label>
              <select 
                id="branch" 
                value={formData.branch} 
                onChange={(e) => handleInputChange('branch', e.target.value)} 
                style={{ 
                  width: '100%', 
                  height: '36px', 
                  borderRadius: '8px', 
                  border: `2px solid ${errors.branch ? '#ef4444' : '#961c18'}`, 
                  backgroundColor: 'black', 
                  color: formData.branch ? 'white' : '#9ca3af', 
                  padding: '0 12px', 
                  outline: 'none' 
                }}
                disabled={isLoading}
              >
                <option value="" disabled>Select branch</option>
                {availableBranches.map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
              {errors.branch && (<p className="text-red-400 text-sm">{errors.branch}</p>)}
            </div>
          )}

          {/* Student ID - Show after university selection */}
          {formData.university && formData.university !== 'Other / Not Listed' && (
            <div className="space-y-2">
              <Label htmlFor="studentId" className="[font-family:'Hind',Helvetica] font-normal text-[#961c18] text-xl">Student ID*</Label>
              <input 
                id="studentId" 
                type="text" 
                value={formData.studentId} 
                onChange={(e) => handleInputChange('studentId', e.target.value)} 
                style={{ 
                  width: '100%', 
                  height: '36px', 
                  borderRadius: '8px', 
                  border: `2px solid ${errors.studentId ? '#ef4444' : '#961c18'}`, 
                  backgroundColor: 'black', 
                  color: 'white', 
                  padding: '0 12px', 
                  outline: 'none' 
                }} 
                placeholder="Enter your student ID"
                disabled={isLoading}
              />
              <p className="[font-family:'Hind',Helvetica] font-normal text-[#961c18] text-xs">
                Enter your unique student ID as provided by your university
              </p>
              {errors.studentId && (<p className="text-red-400 text-sm">{errors.studentId}</p>)}
            </div>
          )}
          {formData.university === 'Other / Not Listed' && (
            <div className="space-y-1">
              <Label htmlFor="institution" className="[font-family:'Hind',Helvetica] font-normal text-[#961c18] text-xl">Institution*</Label>
              <input 
                id="institution" 
                type="text" 
                value={formData.institution} 
                onChange={(e) => handleInputChange('institution', e.target.value)} 
                style={{ 
                  width: '100%', 
                  height: '36px', 
                  borderRadius: '8px', 
                  border: `2px solid ${errors.institution ? '#ef4444' : '#961c18'}`, 
                  backgroundColor: 'black', 
                  color: 'white', 
                  padding: '0 12px', 
                  outline: 'none' 
                }} 
                placeholder="Enter institution name"
                disabled={isLoading}
              />
              {errors.institution && (<p className="text-red-400 text-sm">{errors.institution}</p>)}
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-2 pt-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" className="mt-1 border-[#961c18]" checked={formData.acceptTerms} onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)} />
              <Label htmlFor="terms" className="[font-family:'Hind',Helvetica] font-normal text-white text-sm">When you register you confirm that you have read and accept the terms of the terms and conditions, privacy policy and cookie policy.</Label>
            </div>
            {errors.acceptTerms && (<p className="text-red-400 text-sm">{errors.acceptTerms}</p>)}
            <div className="flex items-start space-x-2">
              <Checkbox id="marketing" className="mt-1 border-[#961c18]" checked={formData.acceptMarketing} onCheckedChange={(checked) => handleInputChange('acceptMarketing', checked as boolean)} />
              <Label htmlFor="marketing" className="[font-family:'Hind',Helvetica] font-normal text-white text-sm">Would you like to receive information of interest and commercial information?</Label>
            </div>
          </div>

          {/* Register Button */}
          <div className="flex justify-center pt-6">
            <Button type="submit" disabled={isLoading} className="w-full max-w-[574px] h-12 bg-[#961c18] hover:bg-[#7a1514] disabled:bg-gray-600 rounded text-white font-bold text-2xl [font-family:'Hind',Helvetica]">
              {isLoading ? 'CREATING ACCOUNT...' : 'REGISTER'}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-4">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-[#961c18] hover:text-[#7a1514]">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};
