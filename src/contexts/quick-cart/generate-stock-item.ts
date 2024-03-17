import isEmpty from 'lodash/isEmpty';

interface Item {
  id: string | number;
  name: string;
  slug: string;
  image: {
    thumbnail: string;
    [key: string]: unknown;
  };
  price: number;
  sale_price?: number;
  quantity?: number;
  [key: string]: unknown;
}

interface Variation {
  id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
}

export function generateStockItem(
  item: Item,
  variation: Variation | undefined
) {
  const {
    id,
    name,
    slug,
    image,
    price,
    sale_price,
    quantity,
    unit,
    is_digital,
    margin,
  } = item;

  if (!isEmpty(variation)) {
    return {
      id: `${id}.${variation.id}`,
      productId: id,
      name: `${name} - ${variation.title}`,
      slug,
      unit,
      is_digital,
      stock: variation.quantity,
      price:
        variation.sale_price !== undefined
          ? variation.sale_price
          : variation.price,
      image: image?.thumbnail,
      variationId: variation.id,
      margin: variation.margin,
    };
  }

  return {
    id,
    productId: id,
    name,
    slug,
    unit,
    is_digital,
    stock: quantity || 0,
    price: sale_price !== undefined ? sale_price : price,
    image: image?.thumbnail,
    margin,
  };
}
