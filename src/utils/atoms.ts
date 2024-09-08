import { atom } from 'jotai';

export const toggleAtom = atom(false);

export const checkoutCustAtom = atom(null);

export const shopIdAtom = atom(null);

export const shop_slug = atom(null);

export const shopSlugAtom = atom<string | null>(null);

export const dealerAddress = atom<string | null>(null);

export const selectedOption = atom<string | null>(null);

export const addPermission = atom([]);
