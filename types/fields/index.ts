import { ElementBase, Message } from '..';
import Body from './body';
import Boolean from './boolean';
import StepTitle from './stepTitle';
import Title from './title';

export interface FieldBase extends ElementBase {
  description?: Message;
  disabled?: boolean;
  help?: Message;
  hidden?: boolean;
  readOnly?: boolean;
  list?: boolean;
}

export type Field = FieldBase | Body | Boolean | StepTitle | Title;

export { Body, Boolean, StepTitle, Title };
