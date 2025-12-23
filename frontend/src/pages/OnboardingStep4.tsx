import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import OnboardingLayout from '../components/OnboardingLayout';
import Button from '../components/ui/Button';
import { useOnboardingStore } from '../store/onboardingStore';
import type { Equipment } from '../types';

const step4Schema = z.object({
  daysPerWeek: z.coerce.number().min(1).max(7),
  minutesPerSession: z.coerce.number().min(10).max(180),
});

type Step4FormData = z.infer<typeof step4Schema>;

export default function OnboardingStep4() {
  const navigate = useNavigate();
  const { data, updateEquipmentAndAvailability, setCurrentStep } = useOnboardingStore();
  const [equipment, setEquipment] = useState<Equipment>(data.equipment);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
  });

  useEffect(() => {
    setCurrentStep(4);
    if (data.daysPerWeek) setValue('daysPerWeek', data.daysPerWeek);
    if (data.minutesPerSession) setValue('minutesPerSession', data.minutesPerSession);
  }, []);

  const handleEquipmentToggle = (key: keyof Omit<Equipment, 'other'>) => {
    setEquipment((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const onSubmit = (formData: Step4FormData) => {
    updateEquipmentAndAvailability({
      equipment,
      daysPerWeek: formData.daysPerWeek,
      minutesPerSession: formData.minutesPerSession,
    });
    navigate('/onboarding/step5');
  };

  const handleBack = () => {
    navigate('/onboarding/step3');
  };

  return (
    <OnboardingLayout
      title="Equipment and availability"
      description="Tell us what you have access to and how often you want to train."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-3">Available equipment</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <label
              className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                equipment.pullUpBar ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={equipment.pullUpBar}
                onChange={() => handleEquipmentToggle('pullUpBar')}
                className="mt-0.5 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700 font-medium">Pull-up bar</span>
            </label>

            <label
              className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                equipment.dipBars ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={equipment.dipBars}
                onChange={() => handleEquipmentToggle('dipBars')}
                className="mt-0.5 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700 font-medium">Dip bars or parallel bars</span>
            </label>

            <label
              className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                equipment.resistanceBands ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={equipment.resistanceBands}
                onChange={() => handleEquipmentToggle('resistanceBands')}
                className="mt-0.5 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700 font-medium">Resistance bands</span>
            </label>

            <label
              className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                equipment.elevatedSurface ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={equipment.elevatedSurface}
                onChange={() => handleEquipmentToggle('elevatedSurface')}
                className="mt-0.5 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700 font-medium">
                Elevated surface (box, bench, chair)
              </span>
            </label>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Don't worry if you don't have equipment - we'll design a bodyweight-only program for you!
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Days per week <span className="text-red-500">*</span>
            </label>
            <select
              {...register('daysPerWeek')}
              className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.daysPerWeek ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select days</option>
              <option value="2">2 days</option>
              <option value="3">3 days</option>
              <option value="4">4 days</option>
              <option value="5">5 days</option>
              <option value="6">6 days</option>
            </select>
            {errors.daysPerWeek && (
              <p className="mt-1 text-sm text-red-600">{errors.daysPerWeek.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Minutes per session <span className="text-red-500">*</span>
            </label>
            <select
              {...register('minutesPerSession')}
              className={`w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.minutesPerSession ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select duration</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="75">75 minutes</option>
              <option value="90">90 minutes</option>
            </select>
            {errors.minutesPerSession && (
              <p className="mt-1 text-sm text-red-600">{errors.minutesPerSession.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button type="button" variant="ghost" onClick={handleBack}>
            Back
          </Button>
          <Button type="submit">Save and continue</Button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
