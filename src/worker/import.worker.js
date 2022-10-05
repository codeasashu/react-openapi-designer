import postmanToOpenApi from 'postman-to-openapi';

const readFileAsync = async(file) => {
  return new Promise((res, reject) => {
  readFile(file, async (result) => {
    let spec;
    try {
      spec = JSON.parse(result);
    } catch (err) {
      console.error('[ParseError]: JSON error parsing imported collection');
        reject(err)
      return;
    }
    const schema = postmanToOpenApi(spec, 'raw', {
      defaultTag: 'General',
    });
      res(schema);
  });
  })
};

const readUrlAsync = async(url) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((resp) => resp.json())
        .then((spec) => resolve(spec))
        .catch(reject)
    });
}

self.onmessage = async({data: {msg, params }}) => {
  const kind = params?.kind || "postman";
  if(msg == "import_file" && kind == "postman") {
    const schema = await readFileAsync(params.file);
    self.postMessage({msg: 'import_worker', schema});
    return;
  }

  if(msg == "import_url" && kind == "openapi") {
    try{
      const schema = await readUrlAsync(params.url);
      self.postMessage({msg: 'import_worker', schema});
    } catch(error) {
      self.postMessage({msg: 'import_worker', error});
    }
    return;
  }
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
