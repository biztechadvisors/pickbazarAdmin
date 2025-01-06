import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import ValidationError from '@/components/ui/form-validation-error';
import { Control } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useTypesQuery } from '@/data/type';
import { useRouter } from 'next/router';
import { useMeQuery } from '@/data/user';
import { useShopQuery } from '@/data/shop';

interface Props {
  control: Control<any>;
  error: string | undefined;
}

const ProductGroupInput = ({ control, error }: Props) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
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

  const { types, loading } = useTypesQuery({
    limit: 200,
    language: locale,
    shop_id: shop || shopId,
  });
  return (
    <div className="mb-5">
      <Label>{t('form:input-label-group')}*</Label>
      <SelectInput
        name="type"
        control={control}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={types?.items || []}
        isLoading={loading}
      />
      <ValidationError message={t(error!)} />
    </div>
  );
};

export default ProductGroupInput;
