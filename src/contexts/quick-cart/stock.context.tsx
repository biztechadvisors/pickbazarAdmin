import React, { useCallback, useEffect } from 'react';
import { stockReducer, State, initState } from './stock.reducer';
import { Item, getItem, inStock } from './stock.utils';
import { useLocalStorage } from '@/utils/use-local-storage';
import { STOCK_KEY } from '@/utils/constants';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/contexts/checkout';
import { useCartsMutation } from '@/data/cart';

interface StockProviderState extends State {
  addItemToStock: (
    item: Item,
    quantity: number,
    customerId: number,
    email: string,
    phone: string
  ) => void;
  removeItemFromStock: (
    id: Item['id'],
    item: Item,
    quantity: number,
    customerId: number,
    email: string,
    phone: string
  ) => void;
  clearItemFromStock: (id: Item['id']) => void;
  getItemFromStock: (id: Item['id']) => any | undefined;
  isInCart: (id: Item['id']) => boolean;
  isInStock: (id: Item['id']) => boolean;
  resetStock: () => void;
}

export const stockContext = React.createContext<StockProviderState | undefined>(
  undefined
);

stockContext.displayName = 'StockContext';

export const useStock = () => {
  const context = React.useContext(stockContext);
  if (context === undefined) {
    throw new Error(`useStock must be used within a StockProvider`);
  }
  return context;
};

export const StockProvider: React.FC<{ children?: React.ReactNode }> = (
  props
) => {
    const [savedStock, saveStock] = useLocalStorage(
        STOCK_KEY,
        JSON.stringify(initState)
      );
      
      const [state, dispatch] = React.useReducer(
        stockReducer,
        JSON.parse(savedStock ?? JSON.stringify(initState))
      );

  const [, emptyVerifiedResponse] = useAtom(verifiedResponseAtom);
  const { mutate: createStock, isLoading: creating } = useCartsMutation();

  useEffect(() => {
    emptyVerifiedResponse(null);
  }, [emptyVerifiedResponse, state]);

  useEffect(() => {
    saveStock(JSON.stringify(state));
  }, [state, saveStock]);

  useEffect(() => {
    if (state.customerId) {
      const data = {
        customerId: state.customerId,
        email: state.email,
        phone: state.phone,
        stockData: {
          ...state.items,
        },
      };
      createStock(data);
    }
  }, [state, createStock]);

  const addItemToStock = (
    item: Item,
    quantity: number,
    customerId: number,
    email: string,
    phone: string
  ) =>
    dispatch({
      type: 'ADD_ITEM_WITH_QUANT',
      item,
      quantity,
      customerId,
      email,
      phone,
    });

  const removeItemFromStock = (
    id: Item['id'],
    item: Item,
    quantity: number,
    customerId: number,
    email: string,
    phone: string
  ) =>
    dispatch({
      type: 'REMOVE_ITEM_OR_QUANTITY',
      id,
      item,
      quantity,
      customerId,
      email,
      phone,
    });

  const clearItemFromStock = (id: Item['id']) =>
    dispatch({ type: 'REMOVE_ITEM', id });

  const isInCart = useCallback(
    (id: Item['id']) => !!getItem(state.items, id),
    [state.items]
  );

  const getItemFromStock = useCallback(
    (id: Item['id']) => getItem(state.items, id),
    [state.items]
  );

  const isInStock = useCallback(
    (id: Item['id']) => inStock(state.items, id),
    [state.items]
  );

  const resetStock = () => dispatch({ type: 'RESET_STOCK' });

  const value = React.useMemo(
    () => ({
      ...state,
      addItemToStock,
      removeItemFromStock,
      clearItemFromStock,
      getItemFromStock,
      isInCart,
      isInStock,
      resetStock,
    }),
    [getItemFromStock, isInCart, isInStock, state]
  );

  return <stockContext.Provider value={value} {...props} />;
};
