const describeStack = async ({ provider, name, region }) => {
  try {
    const response = await provider.request(
      'CloudFormation',
      'describeStacks',
      { StackName: name },
      { region }
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
