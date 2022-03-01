import { ElementBase, Message } from '..';

export default interface Title extends ElementBase {
  type: 'title';
  content: Message;
}
