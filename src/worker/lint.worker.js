const {Spectral} = require('@stoplight/spectral-core');
const {oas} = require('@stoplight/spectral-rulesets');

self.onmessage = async ({data}) => {
  if (Object.prototype.hasOwnProperty.call(data, 'spec') && data.spec) {
    const results = await lintSpec(data.spec);
    self.postMessage({msg: 'worker', spec: data.spec, results});
  }
};

const lintSpec = (spec) => {
  const spectral = new Spectral();
  spectral.setRuleset({
    extends: oas,
  });
  return spectral.run(spec);
};
