import Card from '@/components/common/card';
import AdminLayout from '@/components/layouts/admin';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import { adminOwnerAndStaffOnly } from '@/utils/auth-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import { useForm } from 'react-hook-form';

const BlogCreate = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateBlogDto>({
    title: '',
    content: '',
    shopId: 0,
    attachmentIds: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'shopId' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  const { control } = useForm();

  return (
    <>
      <form>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:input-label-image')}
            details={t('form:blog-image-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="image" control={control} multiple={false} />
          </Card>
        </div>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title={t('form:input-label-blog')}
            details={t('Create Blog')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Label>{t('form:input-label-title')}</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              variant="outline"
              className="mb-5"
              required
            />

            <Label>{t('form:input-label-content')}</Label>
            <TextArea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your content here..."
              className="mb-5 h-40 w-full rounded-lg border border-gray-300 p-2"
              required
            />

            <Button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              {t('form:button-label-submit')}
            </Button>
          </Card>
        </div>
      </form>
    </>
  );
};

BlogCreate.authenticate = {
  permissions: adminOwnerAndStaffOnly,
};

BlogCreate.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

export default BlogCreate;
