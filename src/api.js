import { handleLegacyConfig } from './legacyMode';
import useNormalizeConfig from './useNormalizeConfig';
import { setDefaultType } from './utils';
import * as client from './client';

export * from './client';

export const useForm = (formId, options) =>
  client.useForm({ formId }) |> useNormalizeConfig(options);

export const useForms = ({ status, visibility } = {}, options) =>
  ({
    '': client.useForms,
    draft: client.useDraftForms,
    published: client.usePublishedForms,
    'published/public': client.usePublishedPublicForms,
  }
    [[status, visibility].filter(Boolean)]()
    .map(useNormalizeConfig(options)));

export const useFormGroup = (formGroupId, options) =>
  client.useFormGroup({ formGroupId })
  |> useNormalizeConfig(options |> setDefaultType('formGroup'));

export const useFormGroups = (options) =>
  client
    .useFormGroups()
    .map(useNormalizeConfig(options |> setDefaultType('formGroup')));

export const useField = (fieldId, options) =>
  client.useField({ fieldId }) |> useNormalizeConfig(options);

export const useFields = (options) =>
  client.useFields().map(useNormalizeConfig(options));

export const useFormData = (dataId) => client.useFormData({ dataId });

export const useTags = () => client.useFormTags();

export function useMutations() {
  // Trigger refetching paths on update. Only the paths that are currently
  // loaded by the app, will be refetched.
  const refetch = (response) => Promise.all(response);

  const refetchForms = (formId) =>
    refetch([
      client.refetchForm({ formId }),
      client.refetchForms(),
      client.refetchDraftForms(),
      client.refetchPublishedForms(),
      client.refetchPublishedPublicForms(),
      client.refetchFormTags(),
    ]);

  const refetchFormGroups = (formGroupId) =>
    refetch([
      client.refetchFormGroup({ formGroupId }),
      client.refetchFormGroups(),
    ]);

  const refetchFields = (fieldId) =>
    refetch([client.refetchField({ fieldId }), client.refetchFields()]);

  return {
    async submit(data) {
      return client.postFormData(null, data);
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
