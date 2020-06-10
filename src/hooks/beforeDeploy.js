const { format } = require('util');
const { validate } = require('../validate');
const { message } = require('../message');
const { getConfig } = require('../getConfig');
const { generateTemplate } = require('../template/generateTemplate');
const { deployStack } = require('../cloudformation/deployStack');

const beforeDeploy = ({ serverless, options }) => {
  return Promise.resolve()
    .then(() => validate({ serverless }))
    .then(() => serverless.cli.log(format(message.CLI_START)))
    .then(() => getConfig({ serverless, options }))
    .then(config => generateTemplate({ config }))
    .then(template => deployStack({ template }))
    .then(() => serverless.cli.log(format(message.CLI_DONE)))
    .catch(err => serverless.cli.log(format(message.CLI_SKIP, err.message)));
};

module.exports = { beforeDeploy };
