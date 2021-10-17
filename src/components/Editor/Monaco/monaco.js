import * as monaco from 'monaco-editor';
import {dark} from './theme';

let getWorkerUrlFunc = (url) => '/' + url;
export {monaco as Monaco};

if (self) {
  self.MonacoEnvironment = {
    // eslint-disable-next-line no-unused-vars
    getWorkerUrl(e, t) {
      return getWorkerUrlFunc('yaml.worker.js');
    },
  };
}

monaco.editor.defineTheme('stoplight-dark', dark);

export const setGetWorkerUrlFunc = function (e) {
  getWorkerUrlFunc = e;
};

export default monaco;
