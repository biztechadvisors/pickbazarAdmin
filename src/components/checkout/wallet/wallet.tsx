import { isNegative } from '@/utils/is-negative';
import usePrice from '@/utils/use-price';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { payableAmountAtom, walletAtom } from '@/contexts/checkout';
import Checkbox from '@/components/ui/checkbox/checkbox';
import { useTranslation } from 'next-i18next';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/input';
interface Props {
  totalPrice: number;
  walletAmount: number;
  walletCurrency: number;
}

const Wallet = ({ totalPrice, walletAmount, walletCurrency }: Props) => {
  // const { me }: any = useUser();
  const { t } = useTranslation('common');
  const [use_wallet, setUseWallet] = useAtom(walletAtom);
  const [calculatePayableAmount, setCalculatePayableAmount] =
    useAtom(payableAmountAtom);
  const [calculateCurrentWalletCurrency, setCalculateCurrentWalletCurrency] =
    useState(walletCurrency);
  const [inputCurrentWalletCurrency, setInputCurrentWalletCurrency] =
    useState(0);
  const [dealExtraDiscount, setDealExtraDiscount] =
    useState(0);


  const walletSchema = Yup.object().shape({
    walletCurrencyEdit: Yup.number()
      .min(0, 'Value must be greater than or equal to 0')
      .max(walletCurrency, 'Value must be less than or equal to current wallet currency')
  });

  const { register, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(walletSchema),
  });

  const { price: currentWalletCurrency } = usePrice({
    amount: Number(calculateCurrentWalletCurrency),
  });
  const { price: payableAmount } = usePrice({
    amount: calculatePayableAmount,
  });
  useEffect(() => {
    if (use_wallet) {
      const calculatedCurrentWalletCurrencyAfterPayment =
        inputCurrentWalletCurrency - totalPrice;
      if (isNegative(calculatedCurrentWalletCurrencyAfterPayment)) {
        // setCalculateCurrentWalletCurrency(0);
        setCalculatePayableAmount(
          Math.abs(calculatedCurrentWalletCurrencyAfterPayment + dealExtraDiscount)
        );
      } else {
        setCalculateCurrentWalletCurrency(
          calculatedCurrentWalletCurrencyAfterPayment
        );
        setCalculatePayableAmount(0);
      }
    } else {
      setCalculateCurrentWalletCurrency(walletCurrency);
      setCalculatePayableAmount(0);
    }
  }, [setCalculatePayableAmount, totalPrice, use_wallet, walletCurrency, inputCurrentWalletCurrency, dealExtraDiscount]);

  const handlewalletCurrency = (e: any) => {
    const inputValue = (e.target.value);
    if (inputValue >= 0 && inputValue <= walletCurrency) {
      setInputCurrentWalletCurrency(inputValue)
      setCalculateCurrentWalletCurrency(walletCurrency - inputValue);
    } else {
      setValue('walletCurrencyEdit', inputCurrentWalletCurrency);
    }
  }

  const handleExtraDiscount = (e: any) => {
    const inputValue = (e.target.value);
    if (inputValue >= 0 && inputValue <= 100) {
      const discount = totalPrice * inputValue / 100
      setDealExtraDiscount(discount)
    } else {
      setValue('extraDealDiscount', 0);
      setDealExtraDiscount(0)
    }
  }
  return (
    <div>
      <div className="mt-2 space-y-2">
        {/* <p>Wallet</p> */}
        <div className="flex justify-between text-sm text-body">
          <span>
            {t('text-wallet')}{' '}
            <span className="lowercase">{t('text-points')}</span>
          </span>
          <span>{walletAmount}</span>
        </div>
        <div className="flex justify-between text-sm text-body">
          <span>
            {t('text-wallet')} {t('text-currency')}
          </span>
          <span>{currentWalletCurrency}</span>
        </div>
      </div>

      <Checkbox
        name="use_wallet"
        label={t('text-wallet-use')}
        className="mt-3"
        onChange={setUseWallet}
        checked={use_wallet}
      // disabled={!walletAmount}
      />

      {use_wallet && (
        <div className='pt-4'>
          <Input
            {...register('walletCurrencyEdit')} // Use register with the correct field name
            placeholder={t('wallet currency')}
            type='number'
            error={t(errors.walletCurrencyEdit?.message!)}
            variant="outline"
            onChange={(e) => handlewalletCurrency(e)}
            className="col-span-2"
          />


          <div className="mt-4 flex justify-between border-t-4 border-double border-border-base pt-3">

            <span className="text-base font-semibold text-heading">
              {t('text-payable')}
            </span>
            <span className="text-base font-semibold text-heading">
              {payableAmount}
            </span>
          </div>
          <div className='pt-4'>
            {/* {me?.type === "Dealer" &&
              <Input
                {...register('extraDealDiscount')} // Use register with the correct field name
                placeholder={t('Extra Discount %')}
                type='number'
                error={t(errors.extraDealDiscount?.message!)}
                variant="outline"
                onChange={(e) => handleExtraDiscount(e)}
                className="col-span-2 pt-4"
              />
            } */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;


// import { isNegative } from '@/utils/is-negative';
// import usePrice from '@/utils/use-price';
// import { useAtom } from 'jotai';
// import { useEffect, useState } from 'react';
// import { payableAmountAtom, walletAtom } from '@/contexts/checkout';
// import Checkbox from '@/components/ui/checkbox/checkbox';
// import { useTranslation } from 'next-i18next';
// interface Props {
//   totalPrice: number;
//   walletAmount: number;
//   walletCurrency: number;
// }

// const Wallet = ({ totalPrice, walletAmount, walletCurrency }: Props) => {
//   const { t } = useTranslation('common');
//   const [use_wallet, setUseWallet] = useAtom(walletAtom);
//   const [calculatePayableAmount, setCalculatePayableAmount] =
//     useAtom(payableAmountAtom);
//   const [calculateCurrentWalletCurrency, setCalculateCurrentWalletCurrency] =
//     useState(walletCurrency);

//   const { price: currentWalletCurrency } = usePrice({
//     amount: Number(calculateCurrentWalletCurrency),
//   });
//   const { price: payableAmount } = usePrice({
//     amount: calculatePayableAmount,
//   });
//   useEffect(() => {
//     if (use_wallet) {
//       const calculatedCurrentWalletCurrencyAfterPayment =
//         walletCurrency - totalPrice;
//       if (isNegative(calculatedCurrentWalletCurrencyAfterPayment)) {
//         setCalculateCurrentWalletCurrency(0);
//         setCalculatePayableAmount(
//           Math.abs(calculatedCurrentWalletCurrencyAfterPayment)
//         );
//       } else {
//         setCalculateCurrentWalletCurrency(
//           calculatedCurrentWalletCurrencyAfterPayment
//         );
//         setCalculatePayableAmount(0);
//       }
//     } else {
//       setCalculateCurrentWalletCurrency(walletCurrency);
//       setCalculatePayableAmount(0);
//     }
//   }, [setCalculatePayableAmount, totalPrice, use_wallet, walletCurrency]);

//   return (
//     <div>
//       <div className="mt-2 space-y-2">
//         {/* <p>Wallet</p> */}
//         <div className="flex justify-between text-sm text-body">
//           <span>
//             {t('text-wallet')}{' '}
//             <span className="lowercase">{t('text-points')}</span>
//           </span>
//           <span>{walletAmount}</span>
//         </div>
//         <div className="flex justify-between text-sm text-body">
//           <span>
//             {t('text-wallet')} {t('text-currency')}
//           </span>
//           <span>{currentWalletCurrency}</span>
//         </div>
//       </div>

//       <Checkbox
//         name="use_wallet"
//         label={t('text-wallet-use')}
//         className="mt-3"
//         onChange={setUseWallet}
//         checked={use_wallet}
//         disabled={!walletAmount}
//       />

//       {use_wallet && (
//         <div className="mt-4 flex justify-between border-t-4 border-double border-border-base pt-3">
//           <span className="text-base font-semibold text-heading">
//             {t('text-payable')}
//           </span>
//           <span className="text-base font-semibold text-heading">
//             {payableAmount}
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Wallet;

