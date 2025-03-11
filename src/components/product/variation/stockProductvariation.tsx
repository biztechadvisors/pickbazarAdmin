import React, { useMemo, useState } from 'react';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import { Product } from '@/types';
import { useMeQuery } from '@/data/user';
import { AddToStock } from '@/components/stock/add-to-stock';

const StockProductVariation = ({ item }: any) => {
    const { t } = useTranslation();
    const { closeModal } = useModalAction();
    const [selectedVariation, setSelectedVariation] = useState(null); // State to track selected variation

    const { data }: any = useMeQuery();
    const { id, email, contact } = data || {};

    const inStockVariations = useMemo(() => {
        return item.item.variation_options?.filter(() => item.item.quantity > 0) || [];
    }, [item.item.variation_options]);

    // Handle variation selection
    const handleVariationSelect = (variation) => {
        setSelectedVariation(variation.id === selectedVariation ? null : variation.id);
    };

    return (
        <div className="w-[90vw] max-w-3xl rounded-lg bg-white p-6 shadow-lg sm:p-8">
            {/* Modal Header */}
            <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-heading sm:text-2xl">
                    {item.item.product?.name}
                </h3>
                <div className="mt-2 flex items-center justify-center space-x-2">
                    <span className="text-sm font-semibold text-heading sm:text-base">
                        {item.item.product?.min_price}
                    </span>
                    <span className="text-sm text-gray-500">-</span>
                    <span className="text-sm font-semibold text-heading sm:text-base">
                        {item.item.product?.max_price}
                    </span>
                </div>
            </div>

            {/* Variation List */}
            <div className="max-h-[60vh] overflow-y-auto">
                {inStockVariations.map((variation) => (
                    <div
                        key={variation.id}
                        className={`mb-4 rounded-lg border border-border-200 bg-gray-50 p-4 transition-all hover:shadow-md sm:p-6 ${selectedVariation === variation.id ? 'border-accent bg-accent-50' : ''
                            }`}
                        onClick={() => handleVariationSelect(variation)}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h4 className="text-sm font-semibold text-heading sm:text-base">
                                    {variation.title}
                                </h4>
                                <p className="mt-1 text-xs text-body sm:text-sm">
                                    {variation.options.map((opt) => opt.value).join(' / ')}
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedVariation === variation.id}
                                onChange={() => handleVariationSelect(variation)}
                                className="h-5 w-5 rounded border-border-200 text-accent focus:ring-accent"
                            />
                        </div>
                        {selectedVariation === variation.id && (
                            <div className="mt-4">
                                <AddToStock
                                    data={item.item.product}
                                    id={id}
                                    email={email}
                                    phone={contact}
                                    variant="big"
                                    variation={variation}
                                    disabled={variation.is_disable}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Close Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={closeModal}
                    className="w-full rounded bg-accent px-4 py-2 text-sm font-semibold text-light transition-colors hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:w-auto"
                >
                    {t('text-close')}
                </button>
            </div>
        </div>
    );
};

export default StockProductVariation;
