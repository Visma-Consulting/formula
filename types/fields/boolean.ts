import { FieldBase } from '.';

export default interface Boolean extends FieldBase {
  type: 'boolean';
  widget?: 'checkbox' | 'radio' | 'switch' | 'switchWithEmptyOption';
}
