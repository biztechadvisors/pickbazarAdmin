import Card from '@/components/common/card';
import { DownloadIcon } from '@/components/icons/download-icon';
import { useModalState } from '@/components/ui/modal/modal.context';
import { useTranslation } from 'next-i18next';
import ModalImportProducts from './modal-import-products';
import ImportVariationOptions from './import-variation-options';
import { heightCollapse } from '@/lib/motion/height-collapse';

const ModelImportView = () => {
  const { data: shopId } = useModalState();
  const { t } = useTranslation();
  return (
    <Card className="flex min-h-screen flex-col md:min-h-0">
      <div className="mb-5 w-full">
        <h1 className="text-lg font-semibold text-heading">
          {t('common:text-export-import')}
        </h1>
      </div>

      {/* <div className="grid grid-cols-2 gap-5 md:grid-cols-2" style={{height:'250px'}}> */}
      <div style={{height:'250px',width:'300px'}}>
      <ModalImportProducts />
        
      </div>
    </Card>
  );
};

export default ModelImportView;
