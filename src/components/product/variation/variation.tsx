import { useMemo } from 'react';
import { getVariations } from './get-variations';
import { isVariationSelected } from './is-variation-selected';
import VariationGroups from './variation-groups';
import VariationPrice from './variation-price';
import isEqual from 'lodash/isEqual';
import { AttributesProvider, useAttributes } from './attributes.context';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import { useProductQuery } from '@/data/product';
import { useRouter } from 'next/router';
import { useMeQuery } from '@/data/user';

interface Props {
  product: any;
  id: any;
  email: any;
  contact: any;
}

const Variation = ({ product, id, email, contact }: Props) => {
  const { attributes } = useAttributes();
  const variations = useMemo(
    () => getVariations(product?.variations),
    [product?.variations]
  );

  const isSelected = isVariationSelected(variations, attributes);
  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );

    // Extract variation_id from the selected variation option attribute values
    if (selectedVariation) {
      const variationTitleParts = selectedVariation.title.split('/');
      const variationId = variationTitleParts[variationTitleParts.length - 1].trim();
      selectedVariation.variation_id = variationId;

      // Include the variation_id in the product's pivot data
      if (product.pivot) {
        product.pivot.variation_id = variationId;
      }
    }
  }

  return (
    <div className="w-[95vw] max-w-lg rounded-md bg-white p-8">
      <h3 className="mb-2 text-center text-2xl font-semibold text-heading">
        {product?.name}
      </h3>
      <div className="mb-8 flex items-center justify-center">
        <VariationPrice
          selectedVariation={selectedVariation}
          minPrice={product.min_price}
          maxPrice={product.max_price}
        />
      </div>
      <div className="mb-8">
        <VariationGroups variations={variations} />
      </div>
      <AddToCart
        data={product}
        id={id}
        email={email}
        phone={contact}
        variant="big"
        variation={selectedVariation}
        disabled={selectedVariation?.is_disable || !isSelected}
      />
    </div>
  );
};

const ProductVariation = ({ productSlug }: { productSlug: any }) => {
  const { locale } = useRouter();

  const { data }: any = useMeQuery();
  const userId = data?.dealer?.id;
  const { id, email, contact } = data || {};

  const { slug, product_id, shop_id } = productSlug || {};

  const { product, isLoading: loading } = useProductQuery({
    slug: slug || '',
    id: product_id || '',
    shop_id: shop_id || '',
    userId,
    language: locale!,
  });


  if (loading || !product) return <div>Loading</div>;
  return (
    <AttributesProvider>
      <Variation product={product} id={id} email={email} contact={contact} />
    </AttributesProvider>
  );
};

export default ProductVariation;