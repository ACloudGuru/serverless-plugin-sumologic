const { describeStack } = require('./describeStack');
const { createStack } = require('./createStack');
const { updateStack } = require('./updateStack');

const deployStack = async ({ request, config, template }) => {
  const { name, region, stage, endpointUrl, includeLogGroupInfo } = config;

  const stack = await describeStack({ request, name, region });

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
    return createStack({ request, params, region });
  }

  return updateStack({ request, params, region });
};

module.exports = { deployStack };
