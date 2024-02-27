import { useState } from 'react';

const ToggleButton = ({ margin }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleButton = () => {
    setIsActive(!isActive);
  };
  return (
    <div className="flex items-center">
      <label
        className={`${
          isActive ? 'bg-blue-500' : 'bg-gray-300'
        } relative inline-block h-6 w-12 cursor-pointer rounded-full`}
        onClick={toggleButton}
      >
        <span
          className={`${
            isActive ? 'translate-x-6' : 'translate-x-0'
          } inline-block h-6 w-6 transform rounded-full bg-white transition-transform`}
        />
      </label>
      <span className="ml-2">{isActive ? `$ ${margin}` : 'Show'}</span>
    </div>
  );
};

export default ToggleButton;
