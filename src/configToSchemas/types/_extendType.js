import produce from 'immer';

export default (type, callback) => (config) =>
  type(config) |> (config |> callback |> produce);
