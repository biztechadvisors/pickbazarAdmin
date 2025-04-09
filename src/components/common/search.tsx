import { CloseIcon } from '@/components/icons/close-icon';
import { SearchIcon } from '@/components/icons/search-icon';
import { BarcodeIcon } from '@/components/icons/scanbarcode'; // You need to create or import this
import cn from 'classnames';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';

const classes = {
  root: 'ps-10 pe-4 h-12 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0',
  normal:
    'bg-gray-100 border border-border-base focus:shadow focus:bg-light focus:border-accent',
  solid:
    'bg-gray-100 border border-border-100 focus:bg-light focus:border-accent',
  outline: 'border border-border-base focus:border-accent',
  shadow: 'focus:shadow',
};

type SearchProps = {
  className?: string;
  shadow?: boolean;
  variant?: 'normal' | 'solid' | 'outline';
  inputClassName?: string;
  onSearch: (data: SearchValue) => void;
  barcode?: string; // 👈 Optional prop for scanned barcode
};

type SearchValue = {
  searchText: string;
};

const Search: React.FC<SearchProps> = ({
  className,
  onSearch,
  variant = 'outline',
  shadow = false,
  inputClassName,
  barcode,
  ...rest
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SearchValue>({
    defaultValues: {
      searchText: '',
    },
  });

  const searchText = watch('searchText');
  const { t } = useTranslation();

  // Auto-set barcode if passed
  useEffect(() => {
    if (barcode) {
      setValue('searchText', barcode);
      onSearch({ searchText: barcode });
    }
  }, [barcode]);

  // Trigger empty search if input cleared
  useEffect(() => {
    if (!searchText) {
      onSearch({ searchText: '' });
    }
  }, [searchText]);

  const rootClassName = cn(
    classes.root,
    {
      [classes.normal]: variant === 'normal',
      [classes.solid]: variant === 'solid',
      [classes.outline]: variant === 'outline',
    },
    {
      [classes.shadow]: shadow,
    },
    inputClassName
  );

  function clear() {
    reset();
    onSearch({ searchText: '' });
  }

  const isBarcode =
    !!barcode ||
    /^\d{8,}$/.test(searchText) ||
    /^\d+-\d+-\d+-[a-zA-Z0-9]+$/.test(searchText);

  return (
    <form
      noValidate
      role="search"
      className={cn('relative flex w-full items-center', className)}
      onSubmit={handleSubmit(onSearch)}
    >
      <label htmlFor="search" className="sr-only">
        {t('form:input-label-search')}
      </label>

      {/* Instructional Text */}
      <span className="absolute -top-6 start-1 text-sm font-semibold text-orange-500">
        {'⚠️ If using a barcode scanner, please click the input field first.'}
      </span>


      {/* Icon */}
      <button className="start-1 absolute p-2 text-body outline-none focus:outline-none active:outline-none">
        {isBarcode ? (
          <BarcodeIcon className="h-5 w-5 text-accent" />
        ) : (
          <SearchIcon className="h-5 w-5" />
        )}
      </button>

      {/* Input */}
      <input
        type="text"
        id="search"
        {...register('searchText')}
        className={rootClassName}
        placeholder={t('form:input-placeholder-search')}
        aria-label="Search"
        autoComplete="off"
        {...rest}
      />

      {/* Error Message */}
      {errors.searchText && <p>{errors.searchText.message}</p>}

      {/* Clear Button */}
      {!!searchText && (
        <button
          type="button"
          onClick={clear}
          className="end-1 absolute p-2 text-body outline-none focus:outline-none active:outline-none"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      )}
    </form>

  );
};
export default Search;
