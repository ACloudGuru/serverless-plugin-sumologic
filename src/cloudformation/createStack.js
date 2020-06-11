const { waitForStack } = require('./waitForStack');

const createStack = async ({ provider, template, config, parameters }) => {
  const { region, name } = config;

  const params = {
    StackName: name,
    OnFailure: 'ROLLBACK',
    Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
    Parameters: parameters,
    TemplateBody: JSON.stringify(template),
  };

  await provider.request('CloudFormation', 'createStack', params, { region });

  return waitForStack({ provider, config });
};

module.exports = { createStack };
