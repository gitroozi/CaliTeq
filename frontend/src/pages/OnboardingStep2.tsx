import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import OnboardingLayout from '../components/OnboardingLayout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useOnboardingStore } from '../store/onboardingStore';

const availableGoals = [
  { id: 'strength', label: 'Build strength' },
  { id: 'fat_loss', label: 'Lose body fat' },
  { id: 'muscle_gain', label: 'Gain muscle mass' },
  { id: 'flexibility', label: 'Improve mobility and flexibility' },
  { id: 'endurance', label: 'Increase endurance' },
  { id: 'athletic_performance', label: 'Athletic performance (skills, sports)' },
  { id: 'general_fitness', label: 'General fitness and health' },
];

export default function OnboardingStep2() {
  const navigate = useNavigate();
  const { data, updateGoals, setCurrentStep } = useOnboardingStore();
  const [selectedGoals, setSelectedGoals] = useState<string[]>(data.goals || []);
  const [error, setError] = useState('');

  useEffect(() => {
    setCurrentStep(2);
  }, []);

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals((prev) => {
      if (prev.includes(goalId)) {
        return prev.filter((g) => g !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
    setError(''); // Clear error when user makes a selection
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGoals.length === 0) {
      setError('Please select at least one goal');
      return;
    }

    updateGoals(selectedGoals);
    navigate('/onboarding/step3');
  };

  const handleBack = () => {
    navigate('/onboarding/step1');
  };

  return (
    <OnboardingLayout
      title="Goals"
      description="Select your primary objectives so we can prioritize programming. Choose as many as apply."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert variant="error">{error}</Alert>}

        <div className="grid gap-3 md:grid-cols-2">
          {availableGoals.map((goal) => (
            <label
              key={goal.id}
              className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors ${
                selectedGoals.includes(goal.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedGoals.includes(goal.id)}
                onChange={() => handleGoalToggle(goal.id)}
                className="mt-0.5 h-5 w-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700 font-medium">{goal.label}</span>
            </label>
          ))}
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
