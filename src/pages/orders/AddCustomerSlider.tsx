// AddCustomerSlider.tsx
import { useState } from 'react';

interface AddCustomerSliderProps {
    onClose: () => void;
    onSubmit: (formData: { email: string; phone: string }) => void;
}

const AddCustomerSlider: React.FC<AddCustomerSliderProps> = ({ onClose, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ email, phone });
    };

    return (
        <div className="bg-white p-8">
            <h2 className="text-lg font-semibold mb-4">Add Customer</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone
                    </label>
                    <input
                        type="text"
                        id="phone"
                        className="mt-1 p-2 block w-full border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="mr-4 py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCustomerSlider;