import React, { useContext } from 'react';

export type TGoldContext = {
  isPremium: boolean;
  setPremium: (arg0: boolean) => void;
};

export const GoldContext = React.createContext<TGoldContext>({
  isPremium: false,
  setPremium: () => {},
});

export function useGoldContext() {
  const context = useContext(GoldContext);

  if (context === undefined) {
    throw new Error('Gold Context is undefined');
  }

  return context;
}
