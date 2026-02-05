import { useState, Children, type ReactNode, isValidElement } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './Stepper.css'

export interface StepperProps {
  initialStep?: number
  onStepChange?: (step: number) => void
  onFinalStepCompleted?: () => void
  backButtonText?: string
  nextButtonText?: string
  finalButtonText?: string
  onFinalButtonClick?: () => void
  children: ReactNode
}

export interface StepProps {
  children: ReactNode
}

export function Step({ children }: StepProps) {
  return <>{children}</>
}

export default function Stepper({
  initialStep = 1,
  onStepChange,
  onFinalStepCompleted,
  backButtonText = 'Previous',
  nextButtonText = 'Next',
  finalButtonText = 'Submit',
  onFinalButtonClick,
  children,
}: StepperProps) {
  const steps = Children.toArray(children).filter((child) => isValidElement(child))
  const totalSteps = steps.length
  const [currentStep, setCurrentStep] = useState(initialStep)

  const goToNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      onStepChange?.(nextStep)
    }
  }

  const handleFinalButtonClick = () => {
    if (onFinalButtonClick) {
      onFinalButtonClick()
    } else {
      onFinalStepCompleted?.()
    }
  }

  const goToPrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      onStepChange?.(prevStep)
    }
  }

  const currentStepContent = steps[currentStep - 1]

  return (
    <div className="stepper">
      {/* Step indicators */}
      <div className="stepper__indicators">
        {steps.map((_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={stepNumber} className="stepper__indicator-wrapper">
              <div
                className={`stepper__indicator ${isActive ? 'stepper__indicator--active' : ''} ${isCompleted ? 'stepper__indicator--completed' : ''}`}
              >
                {isCompleted ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3333 4L6 11.3333L2.66667 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`stepper__line ${isCompleted ? 'stepper__line--completed' : ''}`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step content */}
      <div className="stepper__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="stepper__step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentStepContent}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="stepper__navigation">
        <button
          type="button"
          className="stepper__button stepper__button--back"
          onClick={goToPrevious}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="stepper__button-icon" />
          {backButtonText}
        </button>

        {currentStep === totalSteps ? (
          <button
            type="button"
            className="stepper__button stepper__button--next"
            onClick={handleFinalButtonClick}
          >
            {finalButtonText}
          </button>
        ) : (
          <button
            type="button"
            className="stepper__button stepper__button--next"
            onClick={goToNext}
          >
            {nextButtonText}
            <ChevronRight className="stepper__button-icon" />
          </button>
        )}
      </div>
    </div>
  )
}
