import React, { FC, useState } from "react";

interface DropdownProps {
  options: string[];
  displayOptions?: string[];
  rounded?: boolean;
  label?: string;
  selectedOption?: string;
  onChange?: (value: string) => void;
}

const Dropdown: FC<DropdownProps> = ({ options, displayOptions, rounded, label, onChange, selectedOption }) => {
  const [selection, updateSelection] = useState<string>(selectedOption || options[0]);
  let classSelect: string;
  if (rounded) {
    classSelect = "w-full pl-4	pr-12 text-sm border-gray-200 rounded-full z-0";
  } else {
    classSelect = "w-full p-4 pr-12 text-sm border-gray-200 rounded-lg shadow-sm z-0";
  }

  const handleChange = async (e: any) => {
    const { value } = e.target;
    if (onChange) await onChange(value);
    if (selectedOption) {
      updateSelection(selectedOption);
    } else {
      updateSelection(value);
    }
  };

  return (
    <div>
      {label ? <label className="text-sm font-medium">{label}</label> : null}
      <select value={selectedOption || selection} onChange={handleChange} className={classSelect}>
        {options.map((option) => (
          <option key={option} value={option}>
            {displayOptions[options.indexOf(option)] || option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
