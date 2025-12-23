import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import OnboardingLayout from '../components/OnboardingLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useOnboardingStore } from '../store/onboardingStore';
import type { Gender, TrainingExperience, ActivityLevel } from '../types';

const step1Schema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'] as const),
  heightCm: z.coerce.number().min(100, 'Height must be at least 100 cm').max(250, 'Height must be at most 250 cm'),
  currentWeightKg: z.coerce.number().min(30, 'Weight must be at least 30 kg').max(300, 'Weight must be at most 300 kg'),
  targetWeightKg: z.coerce.number().min(30).max(300).optional().or(z.literal('')),
  trainingExperience: z.enum(['never', 'beginner', 'intermediate', 'advanced'] as const),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'] as const),
});

type Step1FormData = z.infer<typeof step1Schema>;

export default function OnboardingStep1() {
  const navigate = useNavigate();
  const { data, updatePersonalDetails, setCurrentStep } = useOnboardingStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
  });

  // Load existing data on mount
  useEffect(() => {
    setCurrentStep(1);
    if (data.dateOfBirth) setValue('dateOfBirth', data.dateOfBirth);
    if (data.gender) setValue('gender', data.gender);
    if (data.heightCm) setValue('heightCm', data.heightCm);
    if (data.currentWeightKg) setValue('currentWeightKg', data.currentWeightKg);
    if (data.targetWeightKg) setValue('targetWeightKg', data.targetWeightKg);
    if (data.trainingExperience) setValue('trainingExperience', data.trainingExperience);
    if (data.activityLevel) setValue('activityLevel', data.activityLevel);
  }, []);

  const onSubmit = (formData: Step1FormData) => {
    updatePersonalDetails({
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as Gender,
      heightCm: formData.heightCm,
      currentWeightKg: formData.currentWeightKg,
      targetWeightKg: formData.targetWeightKg || null,
      trainingExperience: formData.trainingExperience as TrainingExperience,
      activityLevel: formData.activityLevel as ActivityLevel,
    });
    navigate('/onboarding/step2');
  };

  return (
    <OnboardingLayout
      title="Personal details"
      description="Tell us about your background so we can tailor intensity and volume."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            {...register('dateOfBirth')}
            label="Date of Birth"
            type="date"
            error={errors.dateOfBirth?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              {...register('gender')}
              className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.gender ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            {...register('heightCm')}
            label="Height (cm)"
            type="number"
            placeholder="175"
            error={errors.heightCm?.message}
            required
          />

          <Input
            {...register('currentWeightKg')}
            label="Current Weight (kg)"
            type="number"
            placeholder="72"
            step="0.1"
            error={errors.currentWeightKg?.message}
            required
          />
        </div>

        <Input
          {...register('targetWeightKg')}
          label="Target Weight (kg)"
          type="number"
          placeholder="70"
          step="0.1"
          error={errors.targetWeightKg?.message}
          helperText="Optional - leave blank if not applicable"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Training Experience <span className="text-red-500">*</span>
            </label>
            <select
              {...register('trainingExperience')}
              className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.trainingExperience ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select experience</option>
              <option value="never">Never trained</option>
              <option value="beginner">Beginner (&lt; 6 months)</option>
              <option value="intermediate">Intermediate (6 months - 2 years)</option>
              <option value="advanced">Advanced (&gt; 2 years)</option>
            </select>
            {errors.trainingExperience && (
              <p className="mt-1 text-sm text-red-600">{errors.trainingExperience.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Activity Level <span className="text-red-500">*</span>
            </label>
            <select
              {...register('activityLevel')}
              className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.activityLevel ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary (little to no exercise)</option>
              <option value="lightly_active">Lightly active (1-3 days/week)</option>
              <option value="moderately_active">Moderately active (3-5 days/week)</option>
              <option value="very_active">Very active (6-7 days/week)</option>
              <option value="extremely_active">Extremely active (athlete)</option>
            </select>
            {errors.activityLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.activityLevel.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save and continue</Button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
