// import {
//   ProductType,
//   Product,
//   CreateProduct,
//   Type,
//   Author,
//   Manufacturer,
//   Category,
//   Tag,
//   AttachmentInput,
//   VariationOption,
//   Variation,
// } from '@/types';
// import groupBy from 'lodash/groupBy';
// import orderBy from 'lodash/orderBy';
// import sum from 'lodash/sum';
// import cloneDeep from 'lodash/cloneDeep';
// import isEmpty from 'lodash/isEmpty';
// import omit from 'lodash/omit';
// import { omitTypename } from '@/utils/omit-typename';
// import { cartesian } from '@/utils/cartesian';

// export type ProductFormValues = Omit<
//   CreateProduct,
//   | 'author_id'
//   | 'type_id'
//   | 'manufacturer_id'
//   | 'shop_id'
//   | 'categories'
//   | 'tags'
//   | 'digital_file'
// > & {
//   type: Pick<Type, 'id' | 'name'>;
//   product_type: ProductTypeOption;
//   author: Pick<Author, 'id' | 'name'>;
//   manufacturer: Pick<Manufacturer, 'id' | 'name'>;
//   categories: Pick<Category, 'id' | 'name'>[];
//   tags: Pick<Tag, 'id' | 'name'>[];
//   digital_file_input: AttachmentInput;
//   is_digital: boolean;
//   slug: string;
//   // image: AttachmentInput;
// };

// export type ProductTypeOption = {
//   value: ProductType;
//   name: string;
// };
// export const productTypeOptions: ProductTypeOption[] = Object.entries(
//   ProductType
// ).map(([key, value]) => ({
//   name: key,
//   value,
// }));

// export function getFormattedVariations(variations: any) {
//   const variationGroup = groupBy(variations, 'attribute.slug');
//   return Object.values(variationGroup)?.map((vg) => {
//     return {
//       attribute: vg?.[0]?.attribute,
//       value: vg?.map((v) => ({ id: v.id, value: v.value })),
//     };
//   });
// }

// export function processOptions(options: any) {
//   try {
//     return JSON.parse(options);
//   } catch (error) {
//     return options;
//   }
// }

// export function calculateMinMaxPrice(variationOptions: any) {
//   if (!variationOptions || !variationOptions.length) {
//     return {
//       min_price: null,
//       max_price: null,
//     };
//   }
//   const sortedVariationsByPrice = orderBy(variationOptions, ['price']);
//   const sortedVariationsBySalePrice = orderBy(variationOptions, ['sale_price']);
//   return {
//     min_price:
//       sortedVariationsBySalePrice?.[0].sale_price <
//       sortedVariationsByPrice?.[0]?.price
//         ? sortedVariationsBySalePrice?.[0].sale_price
//         : sortedVariationsByPrice?.[0]?.price,
//     max_price:
//       sortedVariationsByPrice?.[sortedVariationsByPrice?.length - 1]?.price,
//   };
// }

// export function calculateQuantity(variationOptions: any) {
//   return sum(
//     variationOptions?.map(({ quantity }: { quantity: number }) => quantity)
//   );
// }

// export function getProductDefaultValues(
//   product: Product,
//   isNewTranslation: boolean = false
// ) {
//   if (!product) {
//     return {
//       product_type: productTypeOptions[0],
//       min_price: 0.0,
//       max_price: 0.0,
//       categories: [],
//       tags: [],
//       in_stock: true,
//       is_taxable: false,
//       image: [],
//       gallery: [],
//       video: [],
//       // isVariation: false,
//       variations: [],
//       variation_options: [],
//     };
//   }
//   const {
//     variations,
//     variation_options,
//     product_type,
//     is_digital,
//     digital_file,
//   } = product;
//   return cloneDeep({
//     ...product,
//     product_type: productTypeOptions.find(
//       (option) => product_type === option.value
//     ),
//     ...(product_type === ProductType.Simple && {
//       ...(is_digital && {
//         digital_file_input: {
//           id: digital_file?.attachment_id,
//           thumbnail: digital_file?.url,
//           original: digital_file?.url,
//           file_name: digital_file?.file_name,
//         },
//       }),
//     }),

//     ...(product_type === ProductType.Variable && {
//       variations: getFormattedVariations(variations),
//       variation_options: variation_options?.map(({ image, ...option }: any) => {
//         return {
//           ...option,
//           ...(!isEmpty(image) && { image: omitTypename(image) }),
//           ...(option?.digital_file && {
//             digital_file_input: {
//               id: option?.digital_file?.attachment_id,
//               thumbnail: option?.digital_file?.url,
//               original: option?.digital_file?.url,
//             },
//           }),
//         };
//       }),
//     }),
//     // isVariation: variations?.length && variation_options?.length ? true : false,

//     // Remove initial dependent value for new translation
//     ...(isNewTranslation && {
//       type: null,
//       categories: [],
//       author_id: null,
//       manufacturer_id: null,
//       tags: [],
//       author: [],
//       manufacturer: [],
//       variations: [],
//       variation_options: [],
//       digital_file: '',
//       digital_file_input: {},
//       ...(product_type === ProductType.Variable && {
//         quantity: null,
//       }),
//     }),
//   });
// }

// export function filterAttributes(attributes: any, variations: any) {
//   let res = [];
//   res = attributes?.filter((el: any) => {
//     return !variations?.find((element: any) => {
//       return element?.attribute?.slug === el?.slug;
//     });
//   });
//   return res;
// }

// export function getCartesianProduct(values: any) {
//   const formattedValues = values
//     ?.map((v: any) =>
//       v?.value?.map((a: any) => ({ name: v?.attribute?.name, value: a?.value }))
//     )
//     .filter((i: any) => i !== undefined);
//   if (isEmpty(formattedValues)) return [];
//   return cartesian(...formattedValues);
// }
// // export function getCartesianProduct(values: any, thirdDropdownValue: any) {
// //   const formattedValues = values
// //     ?.map((v: any) =>
// //       v?.value?.map((a: any) => ({ name: v?.attribute?.name, value: a?.value }))
// //     )
// //     .filter((i: any) => i !== undefined);

// //   // Include the selected value of the third dropdown
// //   if (thirdDropdownValue) {
// //     formattedValues.push([{ name: 'Third Dropdown', value: thirdDropdownValue }]);
// //   }

// //   if (isEmpty(formattedValues)) return [];
// //   return cartesian(...formattedValues);
// // }

// export function processFileWithName(file_input: any) {
//   // Process Digital File Name section
//   const splitArray = file_input?.original?.split('/');
//   let fileSplitName = splitArray?.[splitArray?.length - 1]?.split('.');
//   const fileType = fileSplitName?.pop(); // it will pop the last item from the fileSplitName arr which is the file ext
//   const filename = fileSplitName?.join('.'); // it will join the array with dot, which restore the original filename

//   return [
//     {
//       fileType: fileType,
//       filename: filename,
//     },
//   ];
// }

// export function getProductInputValues(
//   values: ProductFormValues,
//   initialValues: any
// ) {
//   const {
//     product_type,
//     type,
//     quantity,
//     author,
//     manufacturer,
//     image,
//     is_digital,
//     categories,
//     tags,
//     digital_file_input,
//     variation_options,
//     variations,
//     ...simpleValues
//   } = values;
//   // const { locale } = useRouter();
//   // const router = useRouter();
//   const processedFile = processFileWithName(digital_file_input);

//   return {
//     ...simpleValues,
//     is_digital,
//     // language: router.locale,
//     author_id: author?.id,
//     manufacturer_id: manufacturer?.id,
//     type_id: type?.id,
//     product_type: product_type?.value,
//     categories: categories.map((category) => category?.id),
//     tags: tags.map((tag) => tag?.id),
//     image: omitTypename<any>(image),
//     gallery: values.gallery?.map((gi: any) => omitTypename(gi)),

//     ...(product_type?.value === ProductType?.Simple && {
//       quantity,
//       ...(is_digital && {
//         digital_file: {
//           id: initialValues?.digital_file?.id,
//           attachment_id: digital_file_input.id,
//           url: digital_file_input.original,
//           file_name:
//             processedFile[0].filename + '.' + processedFile[0].fileType,
//         },
//       }),
//     }),
//     variations: [],
//     variation_options: {
//       upsert: [],
//       delete: initialValues?.variation_options?.map(
//         (variation: Variation) => variation?.id
//       ),
//     },
//     ...(product_type?.value === ProductType?.Variable && {
//       quantity: calculateQuantity(variation_options),
//       variations: variations?.flatMap(({ value }: any) =>
//         value?.map(({ id }: any) => ({ attribute_value_id: id }))
//       ),
//       variation_options: {
//         // @ts-ignore
//         upsert: variation_options?.map(
//           ({
//             options,
//             id,
//             digital_file,
//             image: variationImage,
//             digital_file_input: digital_file_input_,
//             ...rest
//           }: any) => ({
//             ...(id !== '' ? { id } : {}),
//             ...omit(rest, '__typename'),
//             ...(!isEmpty(variationImage) && {
//               image: omitTypename(variationImage),
//             }),
//             ...(rest?.is_digital && {
//               digital_file: {
//                 id: digital_file?.id,
//                 attachment_id: digital_file_input_?.id,
//                 url: digital_file_input_?.original,
//                 file_name: digital_file?.file_name,
//               },
//             }),
//             options: processOptions(options).map(
//               ({ name, value }: VariationOption) => ({
//                 name,
//                 value,
//               })
//             ),
//           })
//         ),
//         delete: initialValues?.variation_options
//           ?.map((initialVariationOption: Variation) => {
//             // @ts-ignore
//             const find = variation_options?.find(
//               (variationOption: Variation) =>
//                 variationOption?.id === initialVariationOption?.id
//             );
//             if (!find) {
//               return initialVariationOption?.id;
//             }
//           })
//           .filter((item?: number) => item !== undefined),
//       },
//     }),
//     ...calculateMinMaxPrice(variation_options),
//   };
// }

import {
  ProductType,
  Product,
  CreateProduct,
  Type,
  Author,
  Manufacturer,
  Category,
  Tag,
  AttachmentInput,
  VariationOption,
  Variation,
} from '@/types';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import sum from 'lodash/sum';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import { omitTypename } from '@/utils/omit-typename';
import { cartesian } from '@/utils/cartesian';

export type ProductFormValues = Omit<
  CreateProduct,
  | 'author_id'
  | 'type_id'
  | 'manufacturer_id'
  | 'shop_id'
  | 'categories'
  | 'tags'
  | 'digital_file'
> & {
  type: Pick<Type, 'id' | 'name'>;
  product_type: ProductTypeOption;
  author: Pick<Author, 'id' | 'name'>;
  manufacturer: Pick<Manufacturer, 'id' | 'name'>;
  categories: Pick<Category, 'id' | 'name'>[];
  tags: Pick<Tag, 'id' | 'name'>[];
  digital_file_input: AttachmentInput;
  is_digital: boolean;
  slug: string;
  // image: AttachmentInput;
};

export type ProductTypeOption = {
  value: ProductType;
  name: string;
};
export const productTypeOptions: ProductTypeOption[] = Object.entries(
  ProductType
).map(([key, value]) => ({
  name: key,
  value,
}));

export function getFormattedVariations(variations: any) {
  const variationGroup = groupBy(variations, 'attribute.slug');
  return Object.values(variationGroup)?.map((vg) => {
    return {
      attribute: vg?.[0]?.attribute,
      value: vg?.map((v) => ({ id: v.id, value: v.value })),
    };
  });
}

export function processOptions(options: any) {
  try {
    return JSON.parse(options);
  } catch (error) {
    return options;
  }
}

export function calculateMinMaxPrice(variationOptions: any) {
  if (!variationOptions || !variationOptions.length) {
    return {
      min_price: null,
      max_price: null,
    };
  }
  const sortedVariationsByPrice = orderBy(variationOptions, ['price']);
  const sortedVariationsBySalePrice = orderBy(variationOptions, ['sale_price']);
  return {
    min_price:
      sortedVariationsBySalePrice?.[0].sale_price <
      sortedVariationsByPrice?.[0]?.price
        ? sortedVariationsBySalePrice?.[0].sale_price
        : sortedVariationsByPrice?.[0]?.price,
    max_price:
      sortedVariationsByPrice?.[sortedVariationsByPrice?.length - 1]?.price,
  };
}

export function calculateQuantity(variationOptions: any) {
  return sum(
    variationOptions?.map(({ quantity }: { quantity: number }) => quantity)
  );
}

export function getProductDefaultValues(
  product: Product,
  isNewTranslation: boolean = false
) {
  if (!product) {
    return {
      product_type: productTypeOptions[0],
      min_price: 0.0,
      max_price: 0.0,
      categories: [],
      tags: [],
      in_stock: true,
      is_taxable: false,
      image: [],
      gallery: [],
      video: [],
      // isVariation: false,
      variations: [],
      variation_options: [],
    };
  }
  const {
    variations,
    variation_options,
    product_type,
    is_digital,
    digital_file,
  } = product;
  return cloneDeep({
    ...product,
    product_type: productTypeOptions.find(
      (option) => product_type === option.value
    ),
    ...(product_type === ProductType.Simple && {
      ...(is_digital && {
        digital_file_input: {
          id: digital_file?.attachment_id,
          thumbnail: digital_file?.url,
          original: digital_file?.url,
          file_name: digital_file?.file_name,
        },
      }),
    }),

    ...(product_type === ProductType.Variable && {
      variations: getFormattedVariations(variations),
      variation_options: variation_options?.map(({ image, ...option }: any) => {
        return {
          ...option,
          ...(!isEmpty(image) && { image: omitTypename(image) }),
          ...(option?.digital_file && {
            digital_file_input: {
              id: option?.digital_file?.attachment_id,
              thumbnail: option?.digital_file?.url,
              original: option?.digital_file?.url,
            },
          }),
        };
      }),
    }),
    // isVariation: variations?.length && variation_options?.length ? true : false,

    // Remove initial dependent value for new translation
    ...(isNewTranslation && {
      type: null,
      categories: [],
      author_id: null,
      manufacturer_id: null,
      tags: [],
      author: [],
      manufacturer: [],
      variations: [],
      variation_options: [],
      digital_file: '',
      digital_file_input: {},
      ...(product_type === ProductType.Variable && {
        quantity: null,
      }),
    }),
  });
}

// export function filterAttributes(attributes: any, variations: any) {

//   console.log(attributes,variations ,'======================123')
//   let res = [];
//   res = attributes?.filter((el: any) => {
//     return !variations?.find((element: any) => {
//       return element?.attribute?.slug === el?.slug;
//     });
//   });
//   console.log(res,'res==============')
//   return res;
// }
export function filterAttributes(
  attributes: any,
  variations: any,
  fieldIndex: number
) {
  console.log(attributes, variations, '======================123');

  // Get selected attributes from the **current card only**
  const selectedAttributes =
    variations[fieldIndex]?.attributes?.map(
      (attr: any) => attr?.attribute?.slug
    ) || [];

  // Filter attributes to exclude already selected in the current card
  const res = attributes?.items?.filter((el: any) => {
    return !selectedAttributes.includes(el?.slug);
  });

  console.log(res, 'res==============');
  return res;
}

//correct code for return array
// export function getCartesianProduct(values: any) {
//   console.log('values', values);
//   const formattedValues = values
//     ?.map((v: any) => {
//       const { attribute } = v;

//       console.log('DATA ____________________', attribute);
//       // Create a comma-separated string for the values
//       const valueString: string = v?.value?.map((a: any) => a.value).join(', ');

//       return {
//         attribute: { name: attribute?.name ? attribute?.name : null },
//         value: valueString ? valueString : null, // Wrap the string in an array
//       };
//     })
//     .filter((i: any) => i !== undefined);

//   if (isEmpty(formattedValues)) return {};
//   return formattedValues; // Return the formatted values directly
// }

//just for checking purpose

// export function getCartesianProduct(values: any) {
//   console.log('values', values);

//   const formattedValues = values
//     ?.map((v: any) => {
//       const { attributes } = v;

//       console.log('DATA ____________________', attributes);
//       // Create a comma-separated string for the values
//       const valueString: string = v?.value?.map((a: any) => a.value).join(', ');

//       return {
//         attribute: {
//           name: attributes?.map((e) => {
//             return e?.attribute?.name;
//           })
//             ? attributes?.map((e: any) => {
//                 return e?.attribute?.name;
//               })
//             : null,
//         },
//         value: attributes?.map((e: any) => {
//           return e?.attribute?.values?.[0].value;
//         })
//           ? attributes?.map((e: any) => {
//               return e?.attribute?.values?.[0].value;
//             })
//           : null, // Wrap the string in an array
//       };
//     })
//     .filter((i: any) => i !== undefined);

//   console.log('formattedValuesformattedValues', formattedValues);

//   if (isEmpty(formattedValues)) return {};
//   return formattedValues; // Return the formatted values directly
// }


// export function getCartesianProduct(values: any) {
//   console.log('values', values);

//   const formattedValues = values
//     ?.map((v: any) => {
//       const { attributes } = v;

//       // Ensure proper mapping of attributes to their names and values
//       const nameArray = attributes?.map((e: any) => e?.attribute?.name) || [];
//       const valueArray = attributes?.map((e: any) => e?.attribute?.values?.[0]?.value) || [];

//       // Return formatted object for each attribute
//       return nameArray.map((name: string, index: number) => ({
//         name: name || null,
//         value: [valueArray[index] || null].filter((val) => val !== null), // Ensure array values are non-null
//       }));
//     })
//     .flat()
//     .filter((i: any) => i?.name); // Filter out any invalid entries

//   console.log('formattedValues', formattedValues);

//   if (isEmpty(formattedValues)) return [];
//   return formattedValues;
// }

export function getCartesianProduct(values: any) {
  console.log('values', values);

  const formattedValues = values
    ?.map((v: any) => {
      const { attributes } = v;

      // Ensure proper mapping of attributes to their names and values
      const nameArray = attributes?.map((e: any) => e?.attribute?.name) || [];
      const valueArray = attributes?.map((e: any) => e?.attribute?.values?.[0]?.value) || [];

      // Return formatted object for each attribute
      return nameArray.map((name: string, index: number) => ({
        name: name || null,
        value: valueArray[index] || null, // Assign non-array value
      }));
    })
    .flat()
    .filter((i: any) => i?.name); // Filter out any invalid entries

  console.log('formattedValues', formattedValues);

  if (isEmpty(formattedValues)) return [];
  return formattedValues;
}


// export function getCartesianProduct(values: any) {
//   const formattedValues = values
//     ?.map((v: any) =>
//       v?.value?.map((a: any) => ({ name: v?.attribute?.name, value: a?.value }))
//     )
//     .filter((i: any) => i !== undefined);
//   if (isEmpty(formattedValues)) return [];
//   return cartesian(...formattedValues);
// }

// export function getCartesianProduct(values: any, thirdDropdownValue: any) {
//   const formattedValues = values
//     ?.map((v: any) =>
//       v?.value?.map((a: any) => ({ name: v?.attribute?.name, value: a?.value }))
//     )
//     .filter((i: any) => i !== undefined);

//   // Include the selected value of the third dropdown
//   if (thirdDropdownValue) {
//     formattedValues.push([{ name: 'Third Dropdown', value: thirdDropdownValue }]);
//   }

//   if (isEmpty(formattedValues)) return [];
//   return cartesian(...formattedValues);
// }

export function processFileWithName(file_input: any) {
  // Process Digital File Name section
  const splitArray = file_input?.original?.split('/');
  let fileSplitName = splitArray?.[splitArray?.length - 1]?.split('.');
  const fileType = fileSplitName?.pop(); // it will pop the last item from the fileSplitName arr which is the file ext
  const filename = fileSplitName?.join('.'); // it will join the array with dot, which restore the original filename

  return [
    {
      fileType: fileType,
      filename: filename,
    },
  ];
}

// export function getProductInputValues(
//   values: ProductFormValues,
//   initialValues: any
// ) {
//   const {
//     product_type,
//     type,
//     quantity,
//     author,
//     manufacturer,
//     image,
//     is_digital,
//     categories,
//     tags,
//     digital_file_input,
//     variation_options,
//     variations,
//     ...simpleValues
//   } = values;
//   // const { locale } = useRouter();
//   // const router = useRouter();
//   const processedFile = processFileWithName(digital_file_input);
// console.log("variation+++++++++option", variation_options);
//   return {
//     ...simpleValues,
//     is_digital,
//     // language: router.locale,
//     author_id: author?.id,
//     manufacturer_id: manufacturer?.id,
//     type_id: type?.id,
//     product_type: product_type?.value,
//     categories: categories.map((category) => category?.id),
//     tags: tags.map((tag) => tag?.id),
//     image: omitTypename<any>(image),
//     gallery: values.gallery?.map((gi: any) => omitTypename(gi)),

//     ...(product_type?.value === ProductType?.Simple && {
//       quantity,
//       ...(is_digital && {
//         digital_file: {
//           id: initialValues?.digital_file?.id,
//           attachment_id: digital_file_input.id,
//           url: digital_file_input.original,
//           file_name:
//             processedFile[0].filename + '.' + processedFile[0].fileType,
//         },
//       }),
//     }),
//     variations: [],
//     variation_options: {
//       upsert: [],
//       delete: initialValues?.variation_options?.map(
//         (variation: Variation) => variation?.id
//       ),
//     },
//     ...(product_type?.value === ProductType?.Variable && {
//       quantity: calculateQuantity(variation_options),
//       variations: variations?.flatMap(({ value }: any) =>
//         value?.map(({ id }: any) => ({ attribute_value_id: id }))
//       ),
//       variation_options: {
//         // @ts-ignore
//         upsert: variation_options?.map(
//           ({
//             options,
//             id,
//             digital_file,
//             image: variationImage,
//             digital_file_input: digital_file_input_,
//             ...rest
//           }: any) => ({
//             ...(id !== '' ? { id } : {}),
//             ...omit(rest, '__typename'),
//             ...(!isEmpty(variationImage) && {
//               image: omitTypename(variationImage),
//             }),
//             ...(rest?.is_digital && {
//               digital_file: {
//                 id: digital_file?.id,
//                 attachment_id: digital_file_input_?.id,
//                 url: digital_file_input_?.original,
//                 file_name: digital_file?.file_name,
//               },
//             }),

//             options: processOptions(options).map(
//               ({ name, value }: VariationOption) => ({
//                 name,
//                 value,
//               })
//             ),
//           })
//         ),
//         delete: initialValues?.variation_options
//           ?.map((initialVariationOption: Variation) => {
//             // @ts-ignore
//             const find = variation_options?.find(
//               (variationOption: Variation) =>
//                 variationOption?.id === initialVariationOption?.id
//             );
//             if (!find) {
//               return initialVariationOption?.id;
//             }
//           })
//           .filter((item?: number) => item !== undefined),
//       },
//     }),
//     ...calculateMinMaxPrice(variation_options),
//   };
// }

// export function getProductInputValues(
//   values: ProductFormValues,
//   initialValues: any
// ) {
//   const {
//     product_type,
//     type,
//     quantity,
//     author,
//     manufacturer,
//     image,
//     is_digital,
//     categories,
//     tags,
//     digital_file_input,
//     variation_options,
//     variations,
//     ...simpleValues
//   } = values;

//   const processedFile = processFileWithName(digital_file_input);

//   return {
//     ...simpleValues,
//     is_digital,
//     author_id: author?.id,
//     manufacturer_id: manufacturer?.id,
//     type_id: type?.id,
//     product_type: product_type?.value,
//     categories: categories.map((category) => category?.id),
//     tags: tags.map((tag) => tag?.id),
//     image: omitTypename<any>(image),
//     gallery: values.gallery?.map((gi: any) => omitTypename(gi)),

//     ...(product_type?.value === ProductType?.Simple && {
//       quantity,
//       ...(is_digital && {
//         digital_file: {
//           id: initialValues?.digital_file?.id,
//           attachment_id: digital_file_input.id,
//           url: digital_file_input.original,
//           file_name:
//             processedFile[0].filename + '.' + processedFile[0].fileType,
//         },
//       }),
//     }),
//     variations: [],
//     variation_options: {
//       upsert: [],
//       delete: initialValues?.variation_options?.map(
//         (variation: Variation) => variation?.id
//       ),
//     },
//     ...(product_type?.value === ProductType?.Variable && {
//       quantity: calculateQuantity(variation_options),
//       variations: variations?.flatMap(({ value }: any) =>
//         value?.map(({ id }: any) => ({ attribute_value_id: id }))
//       ),
//       variation_options: {
//         // @ts-ignore
//         upsert: variation_options?.map(
//           ({
//             options,
//             id,
//             digital_file,
//             image: variationImage,
//             digital_file_input: digital_file_input_,
//             ...rest
//           }: any) => ({
//             ...(id !== '' ? { id } : {}),
//             ...omit(rest, '__typename'),
//             ...(!isEmpty(variationImage) && {
//               image: omitTypename(variationImage),
//             }),
//             ...(rest?.is_digital && {
//               digital_file: {
//                 id: digital_file?.id,
//                 attachment_id: digital_file_input_?.id,
//                 url: digital_file_input_?.original,
//                 file_name: digital_file?.file_name,
//               },
//             }),
//             options: processOptions(options).map(
//               ({ name, value }: VariationOption) => ({
//                 name,
//                 value,
//               })
//             ),
//           })
//         ),
//         delete: initialValues?.variation_options
//           ?.map((initialVariationOption: Variation) => {
//             // @ts-ignore
//             const find = variation_options?.find(
//               (variationOption: Variation) =>
//                 variationOption?.id === initialVariationOption?.id
//             );
//             if (!find) {
//               return initialVariationOption?.id;
//             }
//           })
//           .filter((item?: number) => item !== undefined),
//       },
//     }),
//     ...calculateMinMaxPrice(variation_options),
//   };
// }
//first//
//////////////////////////////////////////////////////////////////////////////////////////

export function getProductInputValues(
  values: ProductFormValues,
  initialValues: any
) {
  const {
    product_type,
    type,
    quantity,
    author,
    manufacturer,
    image,
    is_digital,
    categories,
    tags,
    digital_file_input,
    variation_options,
    variations,
    ...simpleValues
  } = values;
  console.log('data&&&&&', values);
  const processedFile = processFileWithName(digital_file_input);

  return {
    ...simpleValues,
    is_digital,
    author_id: author?.id,
    manufacturer_id: manufacturer?.id,
    type_id: type?.id,
    product_type: product_type?.value,
    categories: categories.map((category) => category?.id),
    tags: tags.map((tag) => tag?.id),
    image: omitTypename<any>(image),
    gallery: values.gallery?.map((gi: any) => omitTypename(gi)),

    ...(product_type?.value === ProductType?.Simple && {
      quantity,
      ...(is_digital && {
        digital_file: {
          id: initialValues?.digital_file?.id,
          attachment_id: digital_file_input.id,
          url: digital_file_input.original,
          file_name:
            processedFile[0].filename + '.' + processedFile[0].fileType,
        },
      }),
    }),

    variations,

    variation_options: {
      upsert: [],
      delete: initialValues?.variation_options?.map(
        (variation: Variation) => variation?.id
      ),
    },

    ...(product_type?.value === ProductType?.Variable && {
      quantity: calculateQuantity(variation_options),

      variations: variations?.flatMap(({ attributes }: any) =>
        attributes.flatMap(({ value }: any) =>
          value?.map(({ id }: any) => ({ attribute_value_id: id }))
        )
      ),
      

      // variation_options: {
      //   // @ts-ignore
      //   upsert: variation_options?.map(
      //     ({
      //       options,
      //       id,
      //       digital_file,
      //       image: variationImage,
      //       digital_file_input: digital_file_input_,
      //       ...rest
      //     }: any) => ({
      //       ...(id !== '' ? { id } : {}),
      //       ...omit(rest, '__typename'),
      //       ...(!isEmpty(variationImage) && {
      //         image: omitTypename(variationImage),
      //       }),
      //       ...(rest?.is_digital && {
      //         digital_file: {
      //           id: digital_file?.id,
      //           attachment_id: digital_file_input_?.id,
      //           url: digital_file_input_?.original,
      //           file_name: digital_file?.file_name,
      //         },
      //       }),

      //       options: processOptions(options).map(
      //         ({ attribute, values }: VariationOption) => ({
      //           name: attribute || '',  // Handle undefined names
      //           value: values || '', // Handle undefined values
      //         })
      //       ),
      //     })
      //   ),
      //   delete: initialValues?.variation_options
      //     ?.map((initialVariationOption: Variation) => {
      //       // Check if the variation option exists in the current `variation_options`
      //       // @ts-ignore
      //       const find = variation_options?.find(
      //         (variationOption: Variation) =>
      //           variationOption?.id === initialVariationOption?.id
      //       );
      //       if (!find) {
      //         return initialVariationOption?.id;
      //       }
      //     }).filter((item?: number) => item !== undefined),
      // },

      variation_options: {
        // @ts-ignore
        upsert: variation_options?.map(
          ({
            options,
            id,
            digital_file,
            image: variationImage,
            digital_file_input: digital_file_input_,
            price,
            quantity,
            sale_price,
            sku,
            title,
            ...rest
          }: any) => ({
            // Include the `id` if it exists, otherwise omit it
            // ...(id !== '' ? { id } : {}),
            ...omit(rest, '__typename'),

            ...(!isEmpty(variationImage) && {
              image: omitTypename(variationImage),
            }),

            // Handle digital file logic dynamically
            ...(rest?.is_digital && {
              digital_file: {
                id: digital_file?.id,
                attachment_id: digital_file_input_?.id,
                url: digital_file_input_?.original,
                file_name: digital_file?.file_name,
              },
            }),

            options: options?.map(({ attribute, values }: VariationOption) => ({
              name: attribute || '',
              value: values || '',
            })),

            is_digital: rest?.is_digital || false,
            is_disable: rest?.is_disable || false,
            price: price || 0,
            quantity: quantity || 0,
            sale_price: sale_price || 0,
            sku: sku || '',
            // title: title || options?.map((opt: any) => opt.value).join('/'),
            title:
              title ||
              (options
                ? options
                    .map((opt: { value: any }) => opt.value)
                    .join('/')
                    .replace(/,\s*/g, '/')
                : ''),
          })
        ),
        delete:
          initialValues?.variation_options
            ?.map((initialVariationOption: Variation) => {
              // Check if the variation option exists in the current `variation_options`
              //@ts-ignore
              const find = variation_options?.find(
                (variationOption: Variation) =>
                  variationOption?.id === initialVariationOption?.id
              );
              if (!find) {
                return initialVariationOption?.id;
              }
            })
            .filter((item?: number) => item !== undefined) || null,
      },
    }),
    ...calculateMinMaxPrice(variation_options),
  };
}
