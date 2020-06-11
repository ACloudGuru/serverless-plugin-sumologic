const createStack = async ({ provider, params, region }) =>
  provider.request(
    'CloudFormation',
    'createStack',
    { ...params, onFailure: 'ROLLBACK' },
    { region }
  );

module.exports = { createStack };
