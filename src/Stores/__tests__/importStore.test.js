import ImportStore from '../importStore.js';

describe('import store tests', () => {
  it('throws error on invalid openapi url', () => {
    const importStore = new ImportStore(this);
    const mockPostMessage = jest.spyOn(importStore.worker, 'postMessage');
    expect(() => importStore.convert_openapi_url('abc')).toThrow(
      'Invalid url abc',
    );
    expect(mockPostMessage).not.toHaveBeenCalled();
  });

  it('converts on valid openapi url', () => {
    const importStore = new ImportStore(this);
    const mockPostMessage = jest.spyOn(importStore.worker, 'postMessage');
    importStore.convert_openapi_url('http://localhost/abc');
    expect(mockPostMessage.mock.calls).toHaveLength(1);
    expect(mockPostMessage).toHaveBeenCalledWith({
      msg: 'import_url',
      params: {kind: 'openapi', url: 'http://localhost/abc'},
    });
  });

  it('converts on valid postman', () => {
    const mockFile = new FileReader();
    mockFile.readAsText(new Blob());
    const importStore = new ImportStore(this);
    const mockPostMessage = jest.spyOn(importStore.worker, 'postMessage');
    importStore.convert_postman_file(mockFile);
    expect(mockPostMessage.mock.calls).toHaveLength(1);
    expect(mockPostMessage).toHaveBeenCalledWith({
      msg: 'import_file',
      params: {kind: 'postman', file: mockFile},
    });
  });
});
