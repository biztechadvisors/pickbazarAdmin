import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { useSettings } from '@/framework/rest/settings';

export function formatPrice({
  amount,
  currencyCode,
  locale,
  fractions,
}: {
  amount: number;
  currencyCode: string;
  locale: string;
  fractions: number;
}) {

  const formatCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: fractions,
  });

  if (currencyCode === 'INR') {
    amount = amount * 83.05
  }
  return formatCurrency.format(amount);
}

export function formatVariantPrice({
  amount,
  baseAmount,
  currencyCode,
  locale,
  fractions = 2,
}: {
  baseAmount: number;
  amount: number;
  currencyCode: string;
  locale: string;
  fractions: number;
}) {
  const hasDiscount = baseAmount > amount;
  const formatDiscount = new Intl.NumberFormat(locale, { style: 'percent' });
  const discount = hasDiscount
    ? formatDiscount.format((baseAmount - amount) / baseAmount)
    : null;

  const price = formatPrice({ amount, currencyCode, locale, fractions });
  const basePrice = hasDiscount
    ? formatPrice({ amount: baseAmount, currencyCode, locale, fractions })
    : null;

  return { price, basePrice, discount };
}

export default function usePrice(
  data?: {
    amount: number;
    baseAmount?: number;
    currencyCode?: string;
  } | null
) {
  // Ensure localStorage is only accessed in the browser
  const shopSlug = typeof window !== 'undefined' ? localStorage.getItem("shopSlug") : null;

  // Fetch settings using the shopSlug
  const { settings } = useSettings(shopSlug);

  // Destructure currency and currencyOptions from settings with fallback values
  const { currency = 'USD', currencyOptions = { formation: 'en', fractions: 2 } } = settings;

  // Destructure amount, baseAmount, and currencyCode from data with fallback values
  const { amount, baseAmount, currencyCode = currency } = data || {};

  // Destructure formation and fractions from currencyOptions with fallback values
  const { formation = 'en', fractions = 2 } = currencyOptions;

  const { locale } = useRouter();

  // Format the price using useMemo
  const value = useMemo(() => {
    if (typeof amount !== 'number' || !currencyCode) return '';

    const fractionalDigit = fractions ?? 2; // Use fractions if defined, otherwise default to 2
    const currentLocale = formation ?? 'en'; // Use formation if defined, otherwise default to 'en'

    return baseAmount
      ? formatVariantPrice({
        amount,
        baseAmount,
        currencyCode,
        locale: currentLocale,
        fractions: fractionalDigit,
      })
      : formatPrice({
        amount,
        currencyCode,
        locale: currentLocale,
        fractions: fractionalDigit,
      });
  }, [amount, baseAmount, currencyCode, formation, fractions]);

  // Return the formatted price
  return typeof value === 'string'
    ? { price: value, basePrice: null, discount: null }
    : value;
}

