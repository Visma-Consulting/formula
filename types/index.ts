import { Field } from './fields';
import Body from './fields/body';
import Boolean from './fields/boolean';
import StepTitle from './fields/stepTitle';
import Title from './fields/title';
export * from './fields';

export interface Ref {
  _id: string;
  _rev: string;
}

export interface ElementBase {
  key?: string;
  type:
    | 'field'
    | 'formGroup'
    | 'bmi'
    | 'email'
    | 'file'
    | 'image'
    | 'multiselect'
    | 'number'
    | 'password'
    | 'range'
    | 'richtext'
    | 'select'
    | 'tableField'
    | 'text'
    | 'textarea'
    | Body['type']
    | Boolean['type']
    | StepTitle['type']
    | Title['type'];
}

export interface ElementRef extends ElementBase {
  id: string;
  type: 'field' | 'formGroup';
}

export type Message = string | { en: string; fi: string; sv: string };

export interface FormGroup extends ElementBase {
  type: 'formGroup';
  title?: Message;
  elements: Element[];
}

export interface Form {
  type?: 'form';
  title?: Message;
  elements: Element[];
}

export type Element = ElementRef | Field | FormGroup;

export type RemoteField = Field & Ref;
export type RemoteFormGroup = FormGroup & Ref;
export type RemoteForm = Form & Ref;
