import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { Qna } from '@/types';
import { useTranslation } from 'next-i18next';
import { useMeQuery } from '@/data/user';
import { useCreateQnaMutation, useUpdateQnaMutation } from '@/data/qna';
import { useSingleQnaQuery } from '@/data/qna'; // Hook for fetching single QnA
import { useEffect } from 'react';

type IProps = {
  faqId: number;
  qnaId?: number; // Optional, for updating QnA
};

export default function CreateOrUpdateQnaForm({ faqId, qnaId }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: me } = useMeQuery();

  // Fetch QnA data when qnaId is present
  const { data: fetchedQna, isLoading: fetchingQna } = useSingleQnaQuery(
    qnaId!,
    {
      enabled: !!qnaId, // Fetch only if qnaId exists
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Qna>({
    shouldUnregister: true,
    defaultValues: fetchedQna ?? { question: '', answer: '' }, // Default form values
  });

  // Reset form when QnA data is fetched
  useEffect(() => {
    if (fetchedQna) {
      reset(fetchedQna); // Populate the form with fetched QnA
    }
  }, [fetchedQna, reset]);

  const { mutate: createQna, isLoading: creating } = useCreateQnaMutation();
  const { mutate: updateQna, isLoading: updating } = useUpdateQnaMutation();

  const onSubmit = async (values: Qna) => {
    if (qnaId) {
      // Update QnA
      updateQna({
        id: qnaId,
        ...values,
      });
    } else {
      // Create new QnA
      createQna({ ...values, faqId });
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
        <Button loading={creating || updating || fetchingQna}>
          {qnaId ? t('form:button-label-update') : t('form:button-label-add')}{' '}
          {t('form:form-title-qna')}
        </Button>
      </div>
    </form>
  );
}
