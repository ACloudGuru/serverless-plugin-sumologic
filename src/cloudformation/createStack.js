const createStack = ({ provider, template, config, parameters }) => {
  const { name, stage, region } = config;

  const params = {
    StackName: name,
    OnFailure: 'ROLLBACK',
    Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
    Parameters: parameters,
    TemplateBody: JSON.stringify(template),
  };

  return provider.request(
    'CloudFormation',
    'createStack',
    params,
    stage,
    region
  );
};

module.exports = { createStack };
