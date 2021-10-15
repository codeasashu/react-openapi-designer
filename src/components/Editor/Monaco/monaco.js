import * as monaco from 'monaco-editor';
import {dark} from './theme';

let a = (e) => '/' + e;
export {monaco as Monaco};

if (self) {
  self.MonacoEnvironment = {
    // eslint-disable-next-line no-unused-vars
    getWorkerUrl(e, t) {
      return a('yaml.worker.js');
    },
  };
}

monaco.editor.defineTheme('stoplight-dark', dark);

export const setGetWorkerUrlFunc = function (e) {
  a = e;
};

export default monaco;
