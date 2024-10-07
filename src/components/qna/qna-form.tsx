import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { Qna } from '@/types'; // Assuming Qna type is defined in your types
import { useTranslation } from 'next-i18next';
import { useMeQuery } from '@/data/user';
import { useCreateQnaMutation, useUpdateQnaMutation } from '@/data/qna'; // Make sure these hooks are defined

const defaultValues = {
  question: '',
  answer: '',
};

type IProps = {
  initialValues?: Qna | null;
  faqId: number; // Add faqId to props
};

export default function CreateOrUpdateQnaForm({
  initialValues,
  faqId,
}: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: me } = useMeQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Qna>({
    shouldUnregister: true,
    defaultValues: initialValues ?? defaultValues,
  });

  console.log(faqId, 'ashish');

  const { mutate: createQna, isLoading: creating } = useCreateQnaMutation(); // Pass faqId to the mutation hook
  const { mutate: updateQna, isLoading: updating } = useUpdateQnaMutation(); // Assuming updateQna does not require faqId

  const onSubmit = async (values: Qna) => {
    if (initialValues) {
      updateQna({
        id: initialValues.id!,
        ...values,
      });
    } else {
      // Pass faqId to createQna mutation
      createQna(values, faqId); // Pass faqId here
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:form-title-qna')}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-question')}
            {...register('question')}
            error={t(errors.question?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-answer')}
            {...register('answer')}
            error={t(errors.answer?.message!)}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button
          variant="outline"
          onClick={router.back}
          className="me-4"
          type="button"
        >
          {t('form:button-label-back')}
        </Button>
        <Button loading={creating || updating}>
          {initialValues
            ? t('form:button-label-update')
            : t('form:button-label-add')}{' '}
          {t('form:form-title-qna')}
        </Button>
      </div>
    </form>
  );
}
