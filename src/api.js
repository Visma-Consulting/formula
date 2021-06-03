import { useFormulaContext } from './Context';
import useNormalizeConfig from './useNormalizeConfig';
import { setDefaultType } from './utils';

function useEndpoint(path) {
  const { useAxios } = useFormulaContext();
  return useAxios(path).data;
}

export const useForm = (id, options) =>
  useEndpoint(`/form/${id}`) |> useNormalizeConfig(options);

export const useForms = ({ status, visibility } = {}, options) =>
  useEndpoint(['/form', status, visibility].filter(Boolean).join('/')).map(
    useNormalizeConfig(options)
  );

export const useFormGroup = (id, options) =>
  useEndpoint(`/formgroup/${id}`)
  |> useNormalizeConfig(options |> setDefaultType('formGroup'));

export const useFormGroups = (options) =>
  useEndpoint('/formgroup').map(
    useNormalizeConfig(options |> setDefaultType('formGroup'))
  );

export const useField = (id, options) =>
  useEndpoint(`/field/${id}`) |> useNormalizeConfig(options);

export const useFields = (options) =>
  useEndpoint('/field').map(useNormalizeConfig(options));

export function useApi() {
  const { axios, refetch } = useFormulaContext();

  // Trigger refetching paths on form update. Only the paths that are loaded
  // will be actually refetched.
  async function refetchForms(id) {
    await refetch(`/form/${id}`);
    await refetch('/form');
    await refetch('/form/draft');
    await refetch('/form/published');
    await refetch('/form/published/public');
  }

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
    async putForm(form) {
      await axios.put(`/form`, form);
      await refetchForms(form._id);
    },
    async deleteForm(id) {
      await axios.delete(`/form/${id}`);
      await refetchForms(id);
    },
  };
}
