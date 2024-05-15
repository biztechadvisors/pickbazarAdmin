import * as yup from 'yup';

export const subcategoryValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  type: yup.object().nullable().required('form:error-type-required'),
});
