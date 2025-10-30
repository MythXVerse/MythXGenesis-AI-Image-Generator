
import React from 'react';

interface CustomizationState {
  hairColor: string;
  eyeColor: string;
  facialStructure: string;
}

interface CustomizationControlsProps {
  customization: CustomizationState;
  onCustomizationChange: (newState: CustomizationState) => void;
  disabled: boolean;
}

const CustomizationControls: React.FC<CustomizationControlsProps> = ({ customization, onCustomizationChange, disabled }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomizationChange({
      ...customization,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-4 p-4 border border-dark-border rounded-lg bg-dark-bg/50">
      <div>
        <label htmlFor="hairColor" className="block text-sm font-medium text-medium-text mb-1">Hair Color</label>
        <input
          type="text"
          id="hairColor"
          name="hairColor"
          value={customization.hairColor}
          onChange={handleChange}
          disabled={disabled}
          placeholder="e.g., platinum blonde, deep crimson"
          className="w-full bg-dark-bg border border-dark-border rounded-md p-2 focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition-colors disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="eyeColor" className="block text-sm font-medium text-medium-text mb-1">Eye Color</label>
        <input
          type="text"
          id="eyeColor"
          name="eyeColor"
          value={customization.eyeColor}
          onChange={handleChange}
          disabled={disabled}
          placeholder="e.g., emerald green, piercing blue"
          className="w-full bg-dark-bg border border-dark-border rounded-md p-2 focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition-colors disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="facialStructure" className="block text-sm font-medium text-medium-text mb-1">Facial Structure Adjustments</label>
        <input
          type="text"
          id="facialStructure"
          name="facialStructure"
          value={customization.facialStructure}
          onChange={handleChange}
          disabled={disabled}
          placeholder="e.g., sharper jawline, slightly fuller lips"
          className="w-full bg-dark-bg border border-dark-border rounded-md p-2 focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary outline-none transition-colors disabled:opacity-50"
        />
      </div>
    </div>
  );
};

export default CustomizationControls;