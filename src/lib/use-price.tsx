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

  const {
    settings: { currency, currencyOptions },
  } = useSettings(shopSlug);  // ✅ Pass shopSlug correctly (not as an object)

  const { amount, baseAmount, currencyCode } = {
    ...data,
    currencyCode: currency ?? 'USD',
  };

  console.log("70 ", currencyOptions);

  const { formation, fractions } = currencyOptions!;

  const { locale } = useRouter();
  const value = useMemo(() => {
    if (typeof amount !== 'number' || !currencyCode) return '';
    const fractionalDigit = fractions ? fractions : 2;
    let currentLocale = formation ? formation : 'en';

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
  }, [amount, baseAmount, currencyCode, locale]);

  return typeof value === 'string'
    ? { price: value, basePrice: null, discount: null }
    : value;
}

