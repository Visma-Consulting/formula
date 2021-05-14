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
  return useAxios(`/field`).data;
}

export function useFormGroups() {
  const { useAxios } = useFormulaContext();
  return useAxios(`/formgroup`).data;
}
