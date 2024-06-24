import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import ImportCsv from '@/components/ui/import-csv';
import { useShopQuery } from '@/data/shop';
import { useModelImportMutation } from '@/data/import';
import { progress } from 'framer-motion';

export default function ModalImportProducts() {
  const { t } = useTranslation('common');
  const { query: { shop } } = useRouter();
  const { data: shopData } = useShopQuery({ slug: shop as string });
  const shopSlug = shopData?.slug!;
  
  const { mutate: importProducts, isLoading: loading } = useModelImportMutation();

  const handleDrop = async (acceptedFiles: any) => {
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
      <section className='loading-area'>
        <li className='mt-10' style={{borderRadius:'10px', display:'flex',justifyContent:'space-between', alignItems:'center',marginBottom:'10px', backgroundColor:'#d5ebff',listStyle:'none',padding:'10px'}}>
           <i className='fas fa-file-alt' style={{color:'#0086fe',fontSize:'30px'}}></i>
           <div className='content'>
            <div className='details' style={{fontSize:'12px'}}>
              <div className='name'>File Name</div>
              <div className='percent'></div>
              <div className='loading-bar'>
                <div className='loading'>
 
                </div>
              </div>
            </div>
           </div>
        </li>
      </section>
    </div>
  );
}
