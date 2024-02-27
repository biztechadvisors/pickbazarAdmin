import * as yup from 'yup';

export const dealerValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
});
