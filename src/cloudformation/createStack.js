const { waitForStack } = require('./waitForStack');

const createStack = async ({ provider, params, region }) =>
  provider
    .request(
      'CloudFormation',
      'createStack',
      { ...params, OnFailure: 'DELETE' },
      { region }
    )
    .then(() => waitForStack({ provider, name: params.stackName, region }));

module.exports = { createStack };
