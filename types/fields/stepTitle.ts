import { ElementBase, Message } from '..';

export default interface StepTitle extends ElementBase {
  type: 'stepTitle';
  content: Message;
}
