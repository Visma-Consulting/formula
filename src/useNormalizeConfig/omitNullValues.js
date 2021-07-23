import { omitDeepBy } from '../utils';

export default (config) => omitDeepBy(config, (value) => value === null);
