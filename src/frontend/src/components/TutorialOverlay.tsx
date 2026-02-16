import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';

interface TutorialOverlayProps {
  open: boolean;
  onComplete: () => void;
}

const tutorialSteps = [
  {
    title: 'Welcome to Velocity Shift',
    description: 'Navigate your ship through an endless obstacle course. The longer you survive, the higher your score!',
  },
  {
    title: 'Controls',
    description: 'Use Arrow Keys or WASD to move your ship. On mobile, swipe in any direction to navigate.',
  },
  {
    title: 'Objectives',
    description: 'Avoid red obstacles and collect yellow orbs for bonus points. Your score increases with distance traveled.',
  },
  {
    title: 'Game Modes',
    description: 'Play Standard mode for practice, or try the Daily Challenge to compete with players worldwide on the same course!',
  },
];

export default function TutorialOverlay({ open, onComplete }: TutorialOverlayProps) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const currentStep = tutorialSteps[step];

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            {currentStep.title}
          </DialogTitle>
          <DialogDescription>{currentStep.description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={handlePrev} disabled={step === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            {step + 1} / {tutorialSteps.length}
          </div>
          <Button onClick={handleNext}>
            {step === tutorialSteps.length - 1 ? (
              'Get Started'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
