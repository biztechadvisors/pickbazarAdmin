import { capitalize } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import CheckboxGroup from '@/components/ui/checkbox/checkbox-group';
import { StripeIcon } from '@/components/icons/payment-gateways/stripe';
import { PayPalIcon } from '@/components/icons/payment-gateways/paypal';
import { RazorPayIcon } from '@/components/icons/payment-gateways/razorpay';
import { StarIcon } from '@/components/icons/star-icon';
import cn from 'classnames';
import Image from 'next/image';

interface PaymentSelectProps {
  options: OptionType[];
  control: any;
  rules?: any;
  name: string;
  defaultItem?: any;
  disable?: boolean;
}

type OptionType = {
  name: string;
  title: string;
  options: {
    client_id: string;
    client_secret: string;
    url: string;
  };
};

const PaymentMethodCard = ({
  name,
  value,
  isDefault,
  disable,
  ...rest
}: {
  name: string;
  value: string;
  isDefault?: boolean;
  disable?: boolean;
}) => {
  const icon: any = {
    stripe: <StripeIcon />,
    paypal: <PayPalIcon />,
    razorpay: <RazorPayIcon />,
  };
  return (
    <label
      key={name}
      aria-label={name}
      className={cn(
        isDefault || disable
          ? 'pointer-events-none cursor-not-allowed opacity-60'
          : 'cursor-pointer'
      )}
    >
      <input
        type="checkbox"
        className="peer invisible absolute -z-[1] opacity-0"
        value={value}
        name={name}
        {...rest}
      />
      <span className="relative block w-full overflow-hidden rounded-md bg-gray-100 pb-[52%] peer-checked:border-2 peer-checked:border-accent peer-checked:shadow-md">
        <span className="absolute flex h-full w-full items-center justify-center p-6 md:p-9">
          {icon[name] ? icon[name] : ''}
        </span>
        {isDefault && (
          <span className="absolute -top-7 -right-7 flex h-14 w-14 rotate-45 items-end justify-center bg-accent p-2 text-white">
            <StarIcon className="h-auto w-2.5" />
          </span>
        )}
      </span>
    </label>
  );
};

const PaymentSelect = ({
  options,
  control,
  rules,
  name,
  defaultItem,
  disable,
  ...rest
}: PaymentSelectProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      {...rest}
      render={({ field: { onChange, value } }) => {
        return (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5">
            <CheckboxGroup
              values={value?.map((val: any) => val?.name) || []}
              onChange={(selectedValues) => {
                // Merge existing gateways with new selections
                const selectedOptions = options
                  .filter(option => selectedValues.includes(option.name))
                  .map(option => {
                    // Find existing gateway data if it exists
                    const existingGateway = value?.find((g: any) => g.name === option.name);

                    return {
                      name: option.name,
                      title: capitalize(option.name),
                      options: {
                        client_id: existingGateway?.options?.client_id || option.options.client_id,
                        client_secret: existingGateway?.options?.client_secret || option.options.client_secret,
                        url: existingGateway?.options?.url || option.options.url,
                      },
                    };
                  });
                onChange(selectedOptions);
              }}
            >
              {options?.map((option) => (
                <PaymentMethodCard
                  key={option?.name}
                  value={option.name}
                  name={option.name}
                  isDefault={option?.name === defaultItem}
                  disable={disable}
                />
              ))}
            </CheckboxGroup>
          </div>
        );
      }}
    />
  );
};

export default PaymentSelect;