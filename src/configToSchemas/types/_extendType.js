import produce from 'immer';

export default (type, callback) => (props) =>
  type(props) |> (props |> callback |> produce);
