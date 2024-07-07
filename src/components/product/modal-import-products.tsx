import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import ImportCsv from '@/components/ui/import-csv';
import { useShopQuery } from '@/data/shop';
import { useModelImportMutation } from '@/data/import';
// import { ProgressBar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ModalImportProducts() {
  const { t } = useTranslation('common');
  const { query: { shop } } = useRouter();
  const { data: shopData } = useShopQuery({ slug: shop as string });
  const shopSlug = shopData?.slug!;

  const [progress, setProgress] = useState(0);

  const { mutate: importProducts, isLoading: loading } = useModelImportMutation((progressEvent) => {
    const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setProgress(percentComplete);
  });

  const handleDrop = async (acceptedFiles) => {
    if (acceptedFiles.length) {
      console.log("File and shopSlug: ", acceptedFiles[0], shopSlug);
      importProducts({
        file: acceptedFiles[0],
        shopSlug,
      });
    }
  };

  return (
    <div>
      <ImportCsv
        onDrop={handleDrop}
        loading={loading}
        title={t('text-import-products')}
      />
      <div style={{ marginTop: '20px' }}>
        <ProgressBar now={progress} label={`${progress}%`} variant={progress > 0 ? 'success' : 'info'} />
      </div>
      {loading && <p>{t('Loading...')}</p>}
    </div>
  );
}
