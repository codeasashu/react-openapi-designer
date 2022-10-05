/* eslint-disable no-undef */
import '@testing-library/jest-dom/extend-expect';
import * as matchers from 'jest-extended';
import Worker from './workerStub';

window.Worker = Worker;

jest.mock('../src/Stores/lintStore', () => require('../__mocks__/lintStore'));

expect.extend(matchers);
//import {createSerializer} from 'enzyme-to-json';

//import {configure} from 'enzyme';
//import Adapter from 'enzyme-adapter-react-16';

//configure({adapter: new Adapter()});
//expect.addSnapshotSerializer(createSerializer({mode: 'deep'}));
//

process.on('unhandledRejection', (e) => {
  console.error('Unhandled Rejection', e);
});
