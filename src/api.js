import { useFormulaContext } from './Context';
import useFormConfig from './useForm';
import useForms from './useForms';

export function useFormRaw(id) {
  const { useAxios } = useFormulaContext();
  return useAxios(`/form/${id}`).data;
}

export const useForm = (...args) => useFormRaw(...args) |> useFormConfig;

export function usePublicFormsRaw() {
  const { useAxios } = useFormulaContext();
  return useAxios('/form/published/public').data;
}

export const usePublicForms = () => usePublicFormsRaw() |> useForms;

export function useFields() {
  const { useAxios } = useFormulaContext();
  return useAxios('/field').data;
}

export function useFormGroups() {
  const { useAxios } = useFormulaContext();
  return useAxios('/formgroup').data;
}

export function useApi() {
  const { axios } = useFormulaContext();

  return {
    async handleSubmit({ config, formData }) {
      const response = await axios.post('/formdata', {
        // _id: initialFormData?._id,
        // _rev: initialFormData?._rev,
        form: {
          id: config._id,
          rev: config._rev,
        },
        values: formData,
        status: 'SUBMITTED',
        // captchaChallenge: recaptcha,
      });
      return response.data;
    },
  };
}
