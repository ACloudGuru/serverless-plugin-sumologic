const { describeStack } = require('./describeStack');

const deployStack = ({ serverless, config, template }) => {
  const { provider } = serverless.getProvider('aws');

  return Promise.resolve(describeStack({ provider, config })).then(response => {
    console.log(response);
    return response;
  });
};

module.exports = { deployStack };
