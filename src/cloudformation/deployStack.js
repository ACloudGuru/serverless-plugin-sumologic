const deployStack = ({ describeStack, createStack, updateStack }) => async ({
  config,
  template,
}) => {
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

  if (!stack) {
    return createStack({ params, region });
  }

  return updateStack({ params, region });
};

module.exports = { deployStack };
