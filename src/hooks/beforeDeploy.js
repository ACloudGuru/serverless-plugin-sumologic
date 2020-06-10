const { format } = require('util');
const { validate } = require('../validate');
const { message } = require('../message');

const beforeDeploy = ({ serverless }) => {
  return Promise.resolve()
    .then(() => validate({ serverless }))
    .then(() => serverless.cli.log(format(message.CLI_START)))
    .catch(err => serverless.cli.log(format(message.CLI_SKIP, err.message)));
};

module.exports = { beforeDeploy };
