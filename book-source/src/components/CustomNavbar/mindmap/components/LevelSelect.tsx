import React from 'react';
import { LevelOption } from '../types';
import './LevelSelect.css';

interface LevelSelectProps {
  value: number;
  options: LevelOption[];
  onChange: (level: number) => void;
  disabled?: boolean;
}

const LevelSelect: React.FC<LevelSelectProps> = ({ value, options, onChange, disabled = false }) => {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="level-select">
      <label className="level-select__label">Level</label>
      <select
        className="level-select__dropdown"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedOption && (
        <p className="level-select__description">{selectedOption.description}</p>
      )}
    </div>
  );
};

export default LevelSelect;
