import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OnboardingLayout from '../components/OnboardingLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useOnboardingStore } from '../store/onboardingStore';

export default function OnboardingStep3() {
  const navigate = useNavigate();
  const { data, updateMedical, setCurrentStep } = useOnboardingStore();
  const [injuries, setInjuries] = useState<string>(
    data.injuries.map(i => i.type).join(', ')
  );
  const [medicalConditions, setMedicalConditions] = useState<string>(data.medicalConditions.join(', '));
  const [exerciseClearance, setExerciseClearance] = useState(data.exerciseClearance);
  const [error, setError] = useState('');

  useEffect(() => {
    setCurrentStep(3);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!exerciseClearance) {
      setError('Please confirm you have clearance to train');
      return;
    }

    // Parse comma-separated strings into arrays
    const injuriesArray = injuries
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((injury) => ({
        type: injury,
        severity: 'mild', // Default severity since we don't ask for it in the UI
        description: injury,
      }));

    const medicalConditionsArray = medicalConditions
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    updateMedical({
      injuries: injuriesArray,
      medicalConditions: medicalConditionsArray,
      exerciseClearance,
    });

    navigate('/onboarding/step4');
  };

  const handleBack = () => {
    navigate('/onboarding/step2');
  };

  return (
    <OnboardingLayout
      title="Medical screening"
      description="Let us know about injuries or limitations to adjust exercise selection and avoid contraindicated movements."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert variant="error">{error}</Alert>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Current injuries or pain points
          </label>
          <textarea
            value={injuries}
            onChange={(e) => setInjuries(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
            placeholder="Example: shoulder discomfort during overhead pressing, lower back pain
Separate multiple entries with commas"
          />
          <p className="mt-1 text-sm text-slate-500">Leave blank if none</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Medical conditions or relevant health information
          </label>
          <textarea
            value={medicalConditions}
            onChange={(e) => setMedicalConditions(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
            placeholder="Example: asthma, previous knee surgery, high blood pressure
Separate multiple entries with commas"
          />
          <p className="mt-1 text-sm text-slate-500">Leave blank if none</p>
        </div>

        <label
          className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
            exerciseClearance ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
          }`}
        >
          <input
            type="checkbox"
            checked={exerciseClearance}
            onChange={(e) => {
              setExerciseClearance(e.target.checked);
              setError('');
            }}
            className="mt-0.5 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-slate-700">
            I have been cleared by a medical professional to engage in physical exercise and will stop
            immediately if any pain or discomfort arises during training.{' '}
            <span className="text-red-500">*</span>
          </span>
        </label>

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
