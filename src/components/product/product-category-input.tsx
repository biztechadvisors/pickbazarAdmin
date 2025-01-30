// import SelectInput from '@/components/ui/select-input';
// import Label from '@/components/ui/label';
// import { Control, useFormState, useWatch } from 'react-hook-form';
// import { useEffect } from 'react';
// import { useTranslation } from 'next-i18next';
// import { useCategoriesQuery } from '@/data/category';
// import { useRouter } from 'next/router';
// import { useShopQuery } from '@/data/shop';
// import { useMeQuery } from '@/data/user';

// interface Props {
//   control: Control<any>;
//   setValue: any;
// }

// const ProductCategoryInput = ({ control, setValue }: Props) => {
//   const { locale } = useRouter();
//   const { t } = useTranslation('common');
//   const router = useRouter();  
//   const { data: meData } = useMeQuery(); 

//   const {
//     query: { shops },
//   } = useRouter();

//   const { data: shopData, isLoading: fetchingShop } = useShopQuery({
//     slug: shops as string,
//   });

//   const shopId = shopData?.id!; 

//   const shop: string | undefined = meData?.managed_shop?.id;

//   const type = useWatch({
//     control,
//     name: 'type',
//   });
//   const { dirtyFields } = useFormState({
//     control,
//   });
//   useEffect(() => {
//     if (type?.slug && dirtyFields?.type) {
//       setValue('categories', []);
//     }
//   }, [type?.slug]);

//   const { categories, loading } = useCategoriesQuery({
//     limit: 999,
//     type: type?.slug,
//     language: locale,
//     shopId: shop || shopId,
//   });

//   return (
//     <div className="mb-5">
//       <Label>{t('form:input-label-categories')}</Label>
//       <SelectInput
//         name="categories"
//         isMulti
//         control={control}
//         getOptionLabel={(option: any) => option.name}
//         getOptionValue={(option: any) => option.id}
//         // @ts-ignore
//         options={categories}
//         isLoading={loading}
//       />
//     </div>
//   );
// };

// export default ProductCategoryInput;

import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useFormState, useWatch } from 'react-hook-form';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useCategoriesQuery } from '@/data/category';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';

interface Props {
  control: Control<any>;
  setValue: any;
}

const ProductCategoryInput = ({ control, setValue }: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { data: meData } = useMeQuery();

  const {
    query: { shops },
  } = useRouter();

  const { data: shopData, isLoading: fetchingShop } = useShopQuery({
    slug: shops as string,
  });

  const shopId = shopData?.id!;
  const shop: string | undefined = meData?.managed_shop?.id;

  const type = useWatch({
    control,
    name: 'type',
  });

  const { dirtyFields } = useFormState({
    control,
  });

  useEffect(() => {
    if (type?.slug && dirtyFields?.type) {
      setValue('categories', []);
    }
  }, [type?.slug]);

  const { categories, loading } = useCategoriesQuery({
    limit: 999,
    type: type?.slug,
    language: locale,
    shopId: shop || shopId,
  });

  return (
    <div className="mb-5">
      <Label>{t('form:input-label-categories')}</Label>
      <SelectInput
        name="categories"
        isMulti
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={categories}
        isLoading={loading}
        onChange={(selectedOptions: any) =>
          setValue('categoryId', selectedOptions?.[0]?.id || null)
        }
      />
    </div>
  );
};

export default ProductCategoryInput;

