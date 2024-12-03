import * as yup from 'yup';

export const RegionsValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
});
