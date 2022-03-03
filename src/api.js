import * as client from './client';
import { handleLegacyConfig } from './legacyMode';
import useNormalizeConfig, { useNormalizeConfigs } from './useNormalizeConfig';
import { setDefaultType } from './utils';

export * from './client';

export const useForm = (formId, options) => {
  return client.useForm({ formId }) |> useNormalizeConfig(options);
}

export const useFormRev = (formId, formRev) => {
  return client.useFormRev({formId, formRev});
}

export const useFormSafe = (formId, options) => {
  const normalize = useNormalizeConfig(options);
  const [error, data] = client.useFormSafe({ formId });
  return [error, data ? normalize(data) : data];
};

export const useForms = ({ status, visibility } = {}, options) =>
  ({
    '': client.useForms,
    draft: client.useDraftForms,
    published: client.usePublishedForms,
    'published/public': client.usePublishedPublicForms,
  }[[status, visibility].filter(Boolean).join('/')]()
  |> useNormalizeConfigs(options));

export const useFormGroup = (formGroupId, options) =>
  client.useFormGroup({ formGroupId })
  |> useNormalizeConfig(options |> setDefaultType('formGroup'));

export const useFormGroups = (options) =>
  client.useFormGroups()
  |> useNormalizeConfigs(options |> setDefaultType('formGroup'));

export const useField = (fieldId, options) =>
  client.useField({ fieldId }) |> useNormalizeConfig(options);

export const useFields = (options) =>
  client.useFields() |> useNormalizeConfigs(options);

export const useFormData = (dataId) => client.useFormData({ dataId });

export const useTags = () => client.useFormTags();

export const useFormHandlers = () => client.useFormHandlers();

export function useMutations() {
  // Trigger refetching paths on update. Only the paths that are currently
  // loaded by the app, will be refetched.
  const refetch = (response) => Promise.all(response);

  const refetchForms = (id) =>
    refetch([
      client.refetchForm({ formId: String(id) }),
      client.refetchForms(),
      client.refetchDraftForms(),
      client.refetchPublishedForms(),
      client.refetchPublishedPublicForms(),
      client.refetchFormTags(),
    ]);

  const refetchFormGroups = (id) =>
    refetch([
      client.refetchFormGroup({ formGroupId: String(id) }),
      client.refetchFormGroups(),
    ]);

  const refetchFields = (id) =>
    refetch([
      client.refetchField({ fieldId: String(id) }),
      client.refetchFields(),
    ]);

  return {
    async submit(data) {
      if (data._id) {
        return client.putFormData({ dataId: data._id }, data);
      } else {
        return client.postFormData(null, data);
      }
    },

    async postForm(data) {
      await client.postForm(null, handleLegacyConfig(data));
      await refetchForms(data._id);
    },
    async putForm(data) {
      await client.putForm(null, handleLegacyConfig(data));
      await refetchForms(data._id);
    },
    async deleteForm(formId) {
      await client.deleteForm({ formId });
      await refetchForms(formId);
    },

    async postFormGroup(data) {
      await client.postFormGroup(null, handleLegacyConfig(data));
      await refetchFormGroups(data._id);
    },
    async putFormGroup(data) {
      await client.putFormGroup(null, handleLegacyConfig(data));
      await refetchFormGroups(data._id);
    },
    async deleteFormGroup(formGroupId) {
      await client.deleteFormGroup({ formGroupId });
      await refetchFormGroups(formGroupId);
    },

    async postField(data) {
      await client.postField(null, handleLegacyConfig(data));
      await refetchFields(data._id);
    },
    async putField(data) {
      await client.putField(null, handleLegacyConfig(data));
      await refetchFields(data._id);
    },
    async deleteField(fieldId) {
      await client.deleteField({ fieldId });
      await refetchFields(fieldId);
    },

    async importData(data) {
      await client.postConfigs(null, data);
    },
  };
}
