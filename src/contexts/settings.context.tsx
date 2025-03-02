import React, { useMemo } from 'react';

export interface State {
  settings: any;
}

const initialState = {
  siteTitle: 'PickBazar',
  siteSubtitle: '',
  currency: 'INR',
  currencyOptions: {
    formation: "en-IN",
    fractions: 2,
  },
  logo: {
    id: 1,
    thumbnail: '/logo.svg',
    original: '/logo.svg',
  },
  deliveryTime: [
    {
      title: "Express Delivery",
      description: "90 min express delivery"
    },
    {
      title: "Morning",
      description: "8.00 AM - 11.00 AM"
    },
    {
      title: "Noon",
      description: "11.00 AM - 2.00 PM"
    },
    {
      title: "Afternoon",
      description: "2.00 PM - 5.00 PM"
    },
    {
      title: "Evening",
      description: "5.00 PM - 8.00 PM"
    }
  ],
};

export const SettingsContext = React.createContext<State | any>(initialState);

SettingsContext.displayName = 'SettingsContext';

export const SettingsProvider: React.FC<{ initialValue: any }> = ({ initialValue, ...props }) => {
  const [state, updateSettings] = React.useState(initialValue ?? initialState);
  const value = useMemo(() => ({ ...state, updateSettings }), [state]);
  return <SettingsContext.Provider value={value} {...props} />;
};

export const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error(`useSettings must be used within a SettingsProvider`);
  }
  return context;
};
