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

export const useFormData = (id, options) => useEndpoint(`/formdata/${id}`);

export function useMutations() {
  const { axios, refetch } = useFormulaContext();

  // Trigger refetching paths on update. Only the paths that are currently
  // loaded by the app, will be refetched.
  const refetchPaths = (paths) =>
    Promise.all(paths.map((path) => refetch(path)));

  const refetchForms = (id) =>
    refetchPaths([
      `/form/${id}`,
      '/form',
      '/form/draft',
      '/form/published',
      '/form/published/public',
    ]);

  const refetchFormGroups = (id) =>
    refetchPaths([`/formgroup/${id}`, '/formgroup']);

  const refetchFields = (id) => refetchPaths([`/field/${id}`, '/field']);

  return {
    async submit({ config, formData }) {
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

    async postForm(data) {
      await axios.post(`/form`, data);
      await refetchForms(data._id);
    },
    async putForm(data) {
      await axios.put(`/form`, data);
      await refetchForms(data._id);
    },
    async deleteForm(id) {
      await axios.delete(`/form/${id}`);
      await refetchForms(id);
    },

    async postFormGroup(data) {
      await axios.post(`/formgroup`, data);
      await refetchFormGroups(data._id);
    },
    async putFormGroup(data) {
      await axios.put(`/formgroup`, data);
      await refetchFormGroups(data._id);
    },
    async deleteFormGroup(id) {
      await axios.delete(`/formgroup/${id}`);
      await refetchFormGroups(id);
    },

    async postField(data) {
      await axios.post(`/field`, data);
      await refetchFields(data._id);
    },
    async putField(data) {
      await axios.put(`/field`, data);
      await refetchFields(data._id);
    },
    async deleteField(id) {
      await axios.delete(`/field/${id}`);
      await refetchFields(id);
    },
  };
}
