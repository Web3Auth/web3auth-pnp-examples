import { FC, useState } from 'react';

interface DropdownProps {
  options: string[];
  label: string;
  onChange?: (value: string) => void;
}

const Dropdown: FC<DropdownProps> = ({ options, label, onChange }) => {
  const [selectedOption, setSelectedOption] = useState<string>(options[0] || '');

  const handleChange = (e: any) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (onChange) onChange(value);
  };

  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select
        value={selectedOption}
        onChange={handleChange}
        className="w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm  z-0"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
