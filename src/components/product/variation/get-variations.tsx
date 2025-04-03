import groupBy from 'lodash/groupBy';

export function getVariations(variations: object | undefined) {
  console.log("variations-4",variations)
  if (!variations) return {};
  return groupBy(variations, 'attribute.slug');
}
