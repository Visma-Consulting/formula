import { useFormulaContext } from './Context';

export function usePublicForms() {
  const { useAxios } = useFormulaContext();
  return useAxios('/form/published/public').data;
}

export function useForm(id) {
  const { useAxios } = useFormulaContext();
  return useAxios(`/form/${id}`).data;
}

export function useFields() {
  const { useAxios } = useFormulaContext();
  return useAxios(`/field`).data;
}

export function useFormGroups() {
  const { useAxios } = useFormulaContext();
  return useAxios(`/formgroup`).data;
}
