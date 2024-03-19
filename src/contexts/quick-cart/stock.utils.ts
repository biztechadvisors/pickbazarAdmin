export interface Item {
  id: string | number;
  price: number;
  quantity?: number;
  stock?: number;
  [key: string]: any;
}

export interface UpdateItemInput extends Partial<Omit<Item, 'id'>> {}

export function addItemWithQuant(
  items: Item[],
  item: Item,
  quantity: number
): Item[] {
  if (quantity <= 0)
    throw new Error("cartQuantity can't be zero or less than zero");

  const existingItemIndex = items.findIndex(
    (existingItem) => existingItem.id === item.id
  );

  if (existingItemIndex > -1) {
    // If the item already exists, update its quantity
    const newItems = [...items];
    newItems[existingItemIndex] = {
      ...newItems[existingItemIndex],
      quantity: newItems[existingItemIndex].quantity! + quantity,
    };
    return newItems;
  }
  return [...items, { ...item, quantity }];
}

export function removeItemOrQuantity(
  items: Item[],
  id: Item['id'],
  quantity: number
): Item[] {
  return items.reduce((acc: Item[], item) => {
    if (item.id === id) {
      const newQuantity = item.quantity! - quantity;
      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
}

export function addItem(items: Item[], item: Item): Item[] {
  return [...items, item];
}

export function getItem(items: Item[], id: Item['id']): Item | undefined {
  return items.find((item) => item.id === id);
}

export function updateItem(
  items: Item[],
  id: Item['id'],
  item: UpdateItemInput
): Item[] {
  return items.map((existingItem) =>
    existingItem.id === id ? { ...existingItem, ...item } : existingItem
  );
}

export function removeItem(items: Item[], id: Item['id']): Item[] {
  return items.filter((existingItem) => existingItem.id !== id);
}

export function inStock(items: Item[], id: Item['id']): boolean {
  const item = getItem(items, id);
  if (item) return item.quantity! < item.stock!;
  return false;
}

export const calculateItemTotals = (items: Item[]): Item[] =>
  items.map((item) => ({
    ...item,
    itemTotal: item.price * item.quantity!,
  }));

export const calculateTotal = (items: Item[]): number =>
  items.reduce((total, item) => total + item.quantity! * item.price, 0);

export const calculateTotalItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + item.quantity!, 0);

export const calculateUniqueItems = (items: Item[]): number => items.length;

interface PriceValues {
  totalAmount: number;
  tax: number;
  shipping_charge: number;
}

export const calculatePaidTotal = (
  { totalAmount, tax, shipping_charge }: PriceValues,
  discount?: number
): number => {
  let paidTotal = totalAmount + tax + shipping_charge;
  if (discount) {
    paidTotal = paidTotal - discount;
  }
  return paidTotal;
};
