import * as yup from 'yup';

export const typeValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  accounttype: yup.string().required('Account type is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  banners: yup
    .array()
    .min(1, 'form:error-min-one-banner')
    .of(
      yup.object().shape({
        title: yup.string().required('form:error-title-required'),
      })
    ),
});
