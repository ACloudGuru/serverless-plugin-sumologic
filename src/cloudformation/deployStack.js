const { format } = require('util');
const { MESSAGE } = require('../message');

const deployStack = ({
  logger,
  describeStack,
  createStack,
  updateStack,
}) => async ({ config, template }) => {
  const { name, region, stage, endpointUrl, includeLogGroupInfo } = config;

  const stack = await describeStack({ name, region });

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

  if (stack) {
    logger.log(format(MESSAGE.STACK_UPDATE, name));
    return updateStack({ params, region });
  }

  logger.log(format(MESSAGE.STACK_CREATE, name));
  return createStack({ params, region });
};

module.exports = { deployStack };
