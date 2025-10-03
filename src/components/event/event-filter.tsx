import Select from '@/components/ui/select/select';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import Label from '@/components/ui/label';
import cn from 'classnames';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRegionsQuery } from '@/data/regions';
import { useMeQuery } from '@/data/user';
 

type Props = {
  onRegionFilter: (regionName: string) => void;
  onDateFilter: (startDate: string | null, endDate: string | null) => void;
  className?: string;
};

export default function DateRegionFilter({
  onRegionFilter,
  onDateFilter,
  className,
}: Props) {
  const { t } = useTranslation();
  const { data: meData } = useMeQuery();
  const { regions, loading, paginatorInfo, error } = useRegionsQuery({
    code: meData?.managed_shop?.slug,
  }); 
  const [startDate, setStartDate] = useState<Date | null>(null);
 
const handleDateChange = (date: Date | null) => {
    setStartDate(date);  
    const formattedDate = date ? date.toISOString().split('T')[0] : '';  
    onDateFilter(formattedDate); // Pass the formatted date back to parent component
  };
  const handleRegionChange = (selectedOption: any) => {
    if (selectedOption) {
      onRegionFilter(selectedOption.name);  
    } else {
      onRegionFilter(null);  
    }
  };
  
  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className
      )}
    >
      {/* Region Filter */}
<div className="w-full">
  <Label>{t('common:Filter-by-region')}</Label>
  <Select
    options={regions?.items || []}
    getOptionLabel={(option: any) => option.name}
    getOptionValue={(option: any) => option.name}
    placeholder={t('common:filter-by-region')}
    isClearable  
    onChange={handleRegionChange}
  />
</div>

      {/* Start Date Filter */}
      <div className="w-full">
        <Label>{t('common:Filter-by-start-date')}</Label>
        <DatePicker
          selected={startDate}
         onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="w-full border-gray-300 rounded"
          placeholderText={t('common:select-start-date')}
          isClearable
        />
      </div>
 
    </div>
  );
}
