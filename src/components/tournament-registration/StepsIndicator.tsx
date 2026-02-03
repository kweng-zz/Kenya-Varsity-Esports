'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed';
  icon?: React.ReactNode;
}

interface StepsIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export const StepsIndicator: React.FC<StepsIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const getStepColor = (status: Step['status'], isCurrent: boolean) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-gradient-to-br from-green-500 to-green-600',
          border: 'border-green-500',
          text: 'text-white',
          line: 'bg-green-500'
        };
      case 'current':
        return {
          bg: 'bg-gradient-to-br from-[#961c18] to-red-600',
          border: 'border-[#961c18]',
          text: 'text-white',
          line: 'bg-[#961c18]'
        };
      default:
        return {
          bg: 'bg-gray-700',
          border: 'border-gray-600',
          text: 'text-gray-400',
          line: 'bg-gray-600'
        };
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-4xl mx-auto mb-12"
    >
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-0 top-8 w-full h-1 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#961c18] to-green-500 rounded-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: (currentStep / (steps.length - 1)) * 0.8 + 0.1 
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ transformOrigin: 'left' }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isCompleted = index < currentStep;
            const isClickable = onStepClick && (isCompleted || index === currentStep + 1);
            const colors = getStepColor(step.status, isCurrent);

            return (
              <motion.div
                key={step.id}
                variants={stepVariants}
                className="flex flex-col items-center"
                style={{ width: `${100 / steps.length}%` }}
              >
                {/* Step Circle */}
                <motion.button
                  type="button"
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  whileHover={isClickable ? { scale: 1.1 } : {}}
                  whileTap={isClickable ? { scale: 0.9 } : {}}
                  className={`
                    relative w-16 h-16 rounded-full flex items-center justify-center
                    font-bold text-lg transition-all duration-300 shadow-lg
                    ${colors.bg} ${colors.text}
                    ${isClickable ? 'cursor-pointer hover:shadow-xl' : 'cursor-default'}
                    ${isCurrent ? 'ring-4 ring-[#961c18]/30' : ''}
                  `}
                  aria-label={`Go to ${step.title}`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {/* Step Number or Icon */}
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  ) : step.icon ? (
                    step.icon
                  ) : (
                    index + 1
                  )}

                  {/* Pulse Animation for Current Step */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#961c18] opacity-30"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>

                {/* Step Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: isCurrent || isCompleted ? 1 : 0.6,
                    y: 0
                  }}
                  transition={{ delay: index * 0.1 }}
                  className="mt-4 text-center max-w-[120px]"
                >
                  <h3 className={`
                    font-bold text-sm mb-1
                    ${isCurrent ? 'text-[#961c18]' : isCompleted ? 'text-green-400' : 'text-gray-400'}
                  `}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-tight">
                    {step.description}
                  </p>
                </motion.div>

                {/* Completed Indicator */}
                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Step Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full border border-gray-700">
          <span className="text-sm font-semibold text-[#961c18]">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-sm text-gray-400">
            {steps[currentStep]?.title}
          </span>
        </div>
      </motion.div>

      {/* Progress Percentage */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 flex justify-center"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {Math.round((currentStep / steps.length) * 100)}%
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">
            Complete
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};