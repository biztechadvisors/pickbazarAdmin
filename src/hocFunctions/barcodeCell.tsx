import { useState } from 'react';
import Button from '../components/ui/button';
import { useTranslation } from 'react-i18next';

const BarcodeCell = ({ product, printBarcode }) => {
    const [selectedVariation, setSelectedVariation] = useState(null);
    const { t } = useTranslation();
    const handleVariationChange = (e) => {
        const variationId = Number(e.target.value);
        const selected = product.variation_options.find((v) => v.id === variationId);
        setSelectedVariation(selected);
    };

    return (
        <div className="flex flex-col gap-2">
            {product.product_type === 'variable' ? (
                <>
                    <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleVariationChange}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            {t('Select Variation')}
                        </option>
                        {product.variation_options.map((variation) => (
                            <option key={variation.id} value={variation.id}>
                                {variation.title}
                            </option>
                        ))}
                    </select>

                    {selectedVariation && (
                        <Button
                            variant="outline"
                            onClick={() => printBarcode(product, selectedVariation)}
                            size="small"
                        >
                            {t('Print Bar Code')}
                        </Button>
                    )}
                </>
            ) : (
                <Button
                    variant="outline"
                    onClick={() => printBarcode(product)}
                    size="small"
                >
                    {t('Print Bar Code')}
                </Button>
            )}
        </div>
    );
};

export default BarcodeCell;
