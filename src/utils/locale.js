import {primary, languages} from '../datasets/languages';

export default (message) => {
  return languages[primary][message];
};
