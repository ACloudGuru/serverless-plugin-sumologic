const { waitForStack } = require('./waitForStack');

const createStack = async ({ request, params, region }) =>
  request(
    'CloudFormation',
    'createStack',
    { ...params, OnFailure: 'DELETE' },
    { region }
  ).then(() => waitForStack({ request, name: params.StackName, region }));

module.exports = { createStack };
