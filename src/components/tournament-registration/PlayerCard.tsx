'use client';

import React from 'react';
import { useFieldArray, Control, UseFormRegister, FieldErrors } from 'react-hook-form';
import { PlayerInfo, TournamentRegistrationFormData } from './schema';
import { Game } from '@/lib/gamesData';

interface PlayerCardProps {
  index: number;
  field: {
    id: string;
    name: string;
  };
  register: UseFormRegister<TournamentRegistrationFormData>;
  errors: FieldErrors<TournamentRegistrationFormData>;
  onRemove: () => void;
  canRemove: boolean;
  isSubstitute?: boolean;
  gameSpecificFields?: Array<{
    name: string;
    label: string;
    type: 'text' | 'select' | 'number';
    options?: string[];
    required: boolean;
  }>;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  index,
  field,
  register,
  errors,
  onRemove,
  canRemove,
  isSubstitute = false,
  gameSpecificFields = []
}) => {
  const cardType = isSubstitute ? 'Substitute' : 'Player';
  const playerNumber = index + 1;

  const getFieldError = (fieldName: string) => {
    const errorPath = isSubstitute 
      ? `substitutes.${index}.${fieldName}` as keyof TournamentRegistrationFormData
      : `players.${index}.${fieldName}` as keyof TournamentRegistrationFormData;
    
    const error = errors[errorPath];
    return error?.message as string | undefined;
  };

  const getFieldName = (fieldName: string) => {
    return isSubstitute 
      ? `substitutes.${index}.${fieldName}`
      : `players.${index}.${fieldName}`;
  };

  // Dark theme input classes
  const inputClasses = `
    w-full px-4 py-3 rounded-xl border-2 border-gray-700 
    focus:outline-none focus:ring-2 focus:ring-[#961c18]/50 focus:border-[#961c18]
    transition-all duration-200 font-medium bg-gray-800 text-white placeholder-gray-500
  `;

  const errorInputClasses = `
    w-full px-4 py-3 rounded-xl border-2 border-red-500 
    focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500
    transition-all duration-200 font-medium bg-red-900/20 text-white placeholder-gray-500
  `;

  return (
    <div
      className={`
        relative bg-black border-2 border-gray-700 
        rounded-none p-6 shadow-lg transition-all duration-300
        hover:border-gray-600 hover:shadow-xl
        ${isSubstitute ? 'border-l-4 border-l-amber-500' : 'border-l-4 border-l-[#961c18]'}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
            ${isSubstitute 
              ? 'bg-gradient-to-br from-amber-500 to-amber-700' 
              : 'bg-gradient-to-br from-[#961c18] to-red-800'
            }
          `}>
            {playerNumber}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {cardType} {playerNumber}
            </h3>
            <p className="text-sm text-gray-400">
              {isSubstitute ? 'Backup player information' : 'Primary team member'}
            </p>
          </div>
        </div>
        
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 rounded-full bg-red-900/50 text-red-400 hover:bg-red-900 hover:text-red-300 transition-colors"
            aria-label={`Remove ${cardType.toLowerCase()} ${playerNumber}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            Full Name *
          </label>
          <input
            {...register(getFieldName('name') as any, { required: 'Player name is required' })}
            type="text"
            placeholder="Enter player's full name"
            className={getFieldError('name') ? errorInputClasses : inputClasses}
            aria-invalid={!!getFieldError('name')}
            aria-describedby={getFieldError('name') ? `name-error-${index}` : undefined}
          />
          {getFieldError('name') && (
            <p id={`name-error-${index}`} className="text-sm text-red-400 font-medium">
              {getFieldError('name')}
            </p>
          )}
        </div>

        {/* Student ID Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            Student ID *
          </label>
          <input
            {...register(getFieldName('studentId') as any, { required: 'Student ID is required' })}
            type="text"
            placeholder="University student ID"
            className={getFieldError('studentId') ? errorInputClasses : inputClasses}
            aria-invalid={!!getFieldError('studentId')}
            aria-describedby={getFieldError('studentId') ? `student-id-error-${index}` : undefined}
          />
          {getFieldError('studentId') && (
            <p id={`student-id-error-${index}`} className="text-sm text-red-400 font-medium">
              {getFieldError('studentId')}
            </p>
          )}
        </div>

        {/* University Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            University *
          </label>
          <input
            {...register(getFieldName('university') as any, { required: 'University is required' })}
            type="text"
            placeholder="University name"
            className={getFieldError('university') ? errorInputClasses : inputClasses}
            aria-invalid={!!getFieldError('university')}
            aria-describedby={getFieldError('university') ? `university-error-${index}` : undefined}
          />
          {getFieldError('university') && (
            <p id={`university-error-${index}`} className="text-sm text-red-400 font-medium">
              {getFieldError('university')}
            </p>
          )}
        </div>

        {/* In-Game ID Field */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-300">
            In-Game ID
          </label>
          <input
            {...register(getFieldName('inGameId') as any)}
            type="text"
            placeholder="Game-specific username/ID"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Game-Specific Fields */}
      {gameSpecificFields.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
            Game-Specific Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameSpecificFields.map((gameField, fieldIndex) => (
              <div key={gameField.name} className="space-y-2">
                <label className="block text-sm font-semibold text-gray-300">
                  {gameField.label} {gameField.required && '*'}
                </label>
                {gameField.type === 'select' ? (
                  <select
                    {...register(getFieldName('additionalInfo') as any)}
                    className={inputClasses}
                  >
                    <option value="">Select {gameField.label}</option>
                    {gameField.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    {...register(getFieldName('additionalInfo') as any)}
                    type={gameField.type}
                    placeholder={`Enter ${gameField.label.toLowerCase()}`}
                    className={inputClasses}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-6 space-y-2">
        <label className="block text-sm font-semibold text-gray-300">
          Additional Information
        </label>
        <textarea
          {...register(getFieldName('additionalInfo') as any)}
          rows={3}
          placeholder="Any additional notes or special requirements"
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* Decorative accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${
        isSubstitute ? 'bg-gradient-to-r from-amber-500/50 to-transparent' : 'bg-gradient-to-r from-[#961c18]/50 to-transparent'
      }`} />
    </div>
  );
};