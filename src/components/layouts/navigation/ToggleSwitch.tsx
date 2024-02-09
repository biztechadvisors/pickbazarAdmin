// ToggleSwitch.tsx
import { useProductQuery } from '@/data/product';
import React, {useState } from 'react';

const ToggleSwitch: React.FC = ({isChecked, handleToggle}) => {

  return (
    <div className="toggle-switch">
      <label className="switch">
        <input type="checkbox" onChange={handleToggle} checked={isChecked} />
        <span className="slider round">
          <span className="label">{isChecked ? 'Dealer' : 'Customer'}</span>
        </span>
      </label>
      <style jsx>{`
        .toggle-switch {
          margin: 10px; /* Add margin for better spacing */
        }

        .switch {
          position: relative;
          display: inline-block;
          width: 100px;
          height: 50px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          display: flex;
          align-items: center;
        }

        .slider:before {
          content: '';
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: 0.4s;
          position: absolute;
          border-radius: 50%; /* Moved border-radius here */
        }

        input:checked + .slider {
          background-color: #009f7f;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #009f7f;
        }

        input:checked + .slider:before {
          transform: translateX(75px);
        }

        .slider.round {
          border-radius: 12px;
        }

        .label {
          font-size: 0.8em;
          color: white;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default ToggleSwitch;
