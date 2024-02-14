import { useState } from 'react';

const ToggleButton = ({margin}) => {
  const [isActive, setIsActive] = useState(false);

  const toggleButton = () => {
    setIsActive(!isActive);
  };

  console.log('checkMar', margin)
  return (
    <div className="flex items-center">
      <label
        className={`${
          isActive ? 'bg-blue-500' : 'bg-gray-300'
        } relative inline-block w-12 h-6 rounded-full cursor-pointer`}
        onClick={toggleButton}
      >
        <span
          className={`${
            isActive ? 'translate-x-6' : 'translate-x-0'
          } inline-block w-6 h-6 transform bg-white rounded-full transition-transform`}
        />
      </label>
      <span className="ml-2">{isActive ? `$ ${margin}` : 'Show'}</span>
    </div>
  );
};

export default ToggleButton;

