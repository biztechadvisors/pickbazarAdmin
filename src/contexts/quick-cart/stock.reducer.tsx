import {
  Item,
  UpdateItemInput,
  addItemWithQuantity,
  removeItemOrQuantity,
  addItem,
  updateItem,
  removeItem,
  calculateUniqueItems,
  calculateItemTotals,
  calculateTotalItems,
  calculateTotal,
} from './cart.utils';
import { cartsClient } from '@/data/client/carts';
import { stat } from 'fs';
import { toast } from 'react-toastify';
import { addItemWithQuant } from './stock.utils';

interface Metadata {
  [key: string]: any;
}

type Action =
  | { type: 'ADD_ITEM_WITH_QUANT'; item: Item; quantity: number }
  | { type: 'REMOVE_ITEM_OR_QUANTITY'; id: Item['id']; quantity?: number }
  | { type: 'ADD_ITEM'; id: Item['id']; item: Item }
  | { type: 'UPDATE_ITEM'; id: Item['id']; item: UpdateItemInput }
  | { type: 'REMOVE_ITEM'; id: Item['id'] }
  | { type: 'RESET_CART' };

export interface State {
  items: Item[];
  isEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  total: number;
  meta?: Metadata | null;
}
export const initState: State = {
  items: [],
  isEmpty: true,
  totalItems: 0,
  totalUniqueItems: 0,
  total: 0,
  meta: null,
};

let updateCartTimeout: NodeJS.Timeout | null = null;

export function stockReducer(state: State, action: Action): State {
  console.log('state', state);
  console.log('action', action);
  switch (action.type) {
    case 'ADD_ITEM_WITH_QUANT': {
      const items = addItemWithQuant(
        state.items,
        action.item.cartData,
        action.quantity
      );
      if (updateCartTimeout) {
        clearTimeout(updateCartTimeout);
      }
      return generateFinalState(state, action, items);
    }
    case 'REMOVE_ITEM_OR_QUANTITY': {
      const items = removeItemOrQuantity(
        state.items,
        action.id,
        (action.quantity = 1)
      );
      return generateFinalState(state, action, items);
    }
    case 'ADD_ITEM': {
      const items = addItem(state.items, action.item);
      return generateFinalState(state, action, items);
    }
    case 'REMOVE_ITEM': {
      const items = removeItem(state.items, action.id);
      return generateFinalState(state, action, items);
    }
    case 'UPDATE_ITEM': {
      const items = updateItem(state.items, action.id, action.item);
      return generateFinalState(state, action, items);
    }
    case 'RESET_CART':
      return initState;
    default:
      return state;
  }
}

const generateFinalState = (state: State, action: Action, items: Item[]) => {
  const totalUniqueItems = calculateUniqueItems(items);
  return {
    ...state,
    items: calculateItemTotals(items),
    customerId: action.customerId,
    email: action.email,
    phone: action.phone,
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    total: calculateTotal(items),
    isEmpty: totalUniqueItems === 0,
  };
};
