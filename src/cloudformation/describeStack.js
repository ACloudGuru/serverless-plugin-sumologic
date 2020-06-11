const describeStack = async ({ provider, config }) => {
  const { name, stage, region } = config;

  try {
    const response = await provider.request(
      'CloudFormation',
      'describeStacks',
      { StackName: name },
      stage,
      region
    );

    return response.Stacks && response.Stacks[0];
  } catch (err) {
    if (err.message && err.message.match(/does not exist$/)) {
      return null;
    }

    throw err;
  }
};

module.exports = { describeStack };
