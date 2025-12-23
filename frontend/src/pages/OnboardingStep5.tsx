import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import OnboardingLayout from '../components/OnboardingLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useOnboardingStore } from '../store/onboardingStore';
import { useUserStore } from '../store/userStore';
import type { AssessmentScores } from '../types';

const step5Schema = z.object({
  pushLevel: z.coerce.number().min(1).max(10),
  pullLevel: z.coerce.number().min(1).max(10),
  squatLevel: z.coerce.number().min(1).max(10),
  hingeLevel: z.coerce.number().min(1).max(10),
  coreLevel: z.coerce.number().min(1).max(10),
});

type Step5FormData = z.infer<typeof step5Schema>;

const movementPatterns = [
  {
    key: 'pushLevel' as keyof AssessmentScores,
    label: 'Horizontal Push',
    description: 'Push-ups and variations',
  },
  {
    key: 'pullLevel' as keyof AssessmentScores,
    label: 'Vertical Pull',
    description: 'Pull-ups, chin-ups, hanging',
  },
  {
    key: 'squatLevel' as keyof AssessmentScores,
    label: 'Squat',
    description: 'Bodyweight squats and variations',
  },
  {
    key: 'hingeLevel' as keyof AssessmentScores,
    label: 'Hinge',
    description: 'Hip hinge movements, hamstring work',
  },
  {
    key: 'coreLevel' as keyof AssessmentScores,
    label: 'Core Stability',
    description: 'Planks, hollow holds, anti-rotation',
  },
];

export default function OnboardingStep5() {
  const navigate = useNavigate();
  const { data, updateAssessment, setCurrentStep, getProfileData, reset } = useOnboardingStore();
  const { createProfile } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Step5FormData>({
    resolver: zodResolver(step5Schema),
    defaultValues: data.assessmentScores,
  });

  useEffect(() => {
    setCurrentStep(5);
    // Set default values
    Object.entries(data.assessmentScores).forEach(([key, value]) => {
      setValue(key as keyof AssessmentScores, value);
    });
  }, []);

  const onSubmit = async (formData: Step5FormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Update assessment scores
      updateAssessment(formData);

      // Get complete profile data
      const profileData = getProfileData();

      if (!profileData) {
        setError('Please complete all required fields in previous steps. Check the browser console for details on which fields are missing.');
        setIsSubmitting(false);
        return;
      }

      console.log('Submitting profile data:', profileData);

      // Submit profile to backend
      await createProfile(profileData);

      // Clear onboarding data
      reset();

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Profile creation error:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to create profile. Please try again.';
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/onboarding/step4');
  };

  return (
    <OnboardingLayout
      title="Movement assessment"
      description="Rate your current capability for each movement pattern so we can place you in the right progression. Be honest - it's better to start easier and progress quickly!"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="space-y-4">
          {movementPatterns.map((pattern) => (
            <div key={pattern.key}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {pattern.label}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-2">{pattern.description}</p>
              <select
                {...register(pattern.key)}
                className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors[pattern.key] ? 'border-red-500' : ''
                }`}
              >
                <option value="1">1 - Novice (never tried or very difficult)</option>
                <option value="2">2 - Early beginner</option>
                <option value="3">3 - Beginner</option>
                <option value="4">4 - Developing foundation</option>
                <option value="5">5 - Foundation established</option>
                <option value="6">6 - Intermediate</option>
                <option value="7">7 - Confident intermediate</option>
                <option value="8">8 - Advanced</option>
                <option value="9">9 - Very advanced</option>
                <option value="10">10 - Elite</option>
              </select>
              {errors[pattern.key] && (
                <p className="mt-1 text-sm text-red-600">{errors[pattern.key]?.message}</p>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• We'll create your personalized 12-week training program</li>
            <li>• Exercises will be selected based on your assessment and equipment</li>
            <li>• You'll be able to start training immediately</li>
            <li>• Track your progress and adjust as you improve</li>
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button type="button" variant="ghost" onClick={handleBack} disabled={isSubmitting}>
            Back
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Complete profile and generate plan
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
