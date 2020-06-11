const { describeStack } = require('./describeStack');
const { createStack } = require('./createStack');
const { updateStack } = require('./updateStack');

const deployStack = async ({ provider, config, template }) => {
  const { name, region, stage, endpointUrl, includeLogGroupInfo } = config;

  const stack = await describeStack({ provider, name, region });

  const params = {
    StackName: name,
    Capabilities: ['CAPABILITY_IAM', 'CAPABILITY_NAMED_IAM'],
    Parameters: [
      { ParameterKey: 'Stage', ParameterValue: stage },
      { ParameterKey: 'SumoEndPointURL', ParameterValue: endpointUrl },
      {
        ParameterKey: 'SumoIncludeLogGroupInfo',
        ParameterValue: includeLogGroupInfo.toString(),
      },
    ],
    TemplateBody: JSON.stringify(template),
  };

  if (!stack) {
    return createStack({ provider, params, region });
  }

  return updateStack({ provider, params, region });
};

module.exports = { deployStack };
