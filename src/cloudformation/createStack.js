const createStack = ({ provider, waitForStack }) => ({ params, region }) =>
  provider
    .request(
      'CloudFormation',
      'createStack',
      { ...params, OnFailure: 'DELETE' },
      { region }
    )
    .then(() => waitForStack({ name: params.StackName, region }));

module.exports = { createStack };
