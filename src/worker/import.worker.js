import postmanToOpenApi from 'postman-to-openapi';

self.onmessage = async ({data: {file}}) => {
  readFile(file, async (result) => {
    let spec;
    try {
      spec = JSON.parse(result);
    } catch (err) {
      console.error('[ParseError]: JSON error parsing imported collection');
      return;
    }
    const schema = await postmanToOpenApi(spec, 'raw', {
      defaultTag: 'General',
    });
    self.postMessage({msg: 'import_worker', schema});
  });
};

const readFile = (file, callback) => {
  const reader = new FileReader();

  reader.addEventListener(
    'load',
    () => {
      callback(reader.result);
    },
    false,
  );

  if (file) {
    reader.readAsText(file);
  }
};
