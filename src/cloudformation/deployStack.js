const { describeStack } = require('./describeStack');
const { createStack } = require('./createStack');

const deployStack = async ({ serverless, config, template }) => {
  const { provider } = serverless.getProvider('aws');

  const { stage, endpointUrl, includeLogGroupInfo } = config;

  const stack = await describeStack({ provider, config });

  const parameters = [
    { ParameterKey: 'Stage', ParameterValue: stage },
    { ParameterKey: 'SumoEndPointURL', ParameterValue: endpointUrl },
    {
      ParameterKey: 'SumoIncludeLogGroupInfo',
      ParameterValue: includeLogGroupInfo.toString(),
    },
  ];

  if (!stack) {
    await createStack({ provider, template, config, parameters });
  }
};

module.exports = { deployStack };
