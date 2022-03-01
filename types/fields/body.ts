import { ElementBase, Message } from '..';

export default interface Body extends ElementBase {
  type: 'body';
  content: Message;
}
