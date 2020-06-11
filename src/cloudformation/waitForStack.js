const waitForStack = ({ provider, config }) => {
  const { name, stage, region } = config;

  const params = {
    StackName: name,
  };

  return provider.request(
    'CloudFormation',
    'waitFor',
    'stackCreateComplete',
    params,
    stage,
    region
  );
};

module.exports = { waitForStack };
