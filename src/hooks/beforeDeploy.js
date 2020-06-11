const { format } = require('util');
const { validate } = require('../validate');
const { MESSAGE } = require('../message');
const { getConfig } = require('../getConfig');
const { generateTemplate } = require('../template/generateTemplate');
const { deployStack } = require('../cloudformation/deployStack');

const beforeDeploy = async ({ serverless, options }) => {
  try {
    validate({ serverless });

    const config = getConfig({ serverless, options });

    serverless.cli.log(format(config.prefix, MESSAGE.CLI_START));

    const template = generateTemplate({ config });

    const { provider } = serverless.getProvider('aws');
    await deployStack({ provider, config, template });

    serverless.cli.log(format(config.prefix, MESSAGE.CLI_DONE));
  } catch (err) {
    throw new Error(err.message);
  }
};
module.exports = { beforeDeploy };
