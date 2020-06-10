const get = require('lodash.get');

const defaults = {
  includeLogGroupInfo: false,
};

const getConfig = ({ serverless, options }) => {
  const stage = get(options, 'stage') || get(serverless, 'service.provider.stage');

  if (!stage) {
    throw new Error('Run serverless with --stage flag!');
  }

  const config = get(serverless, 'service.custom.sumologic', {});

  return { ...defaults, ...config, stage };
};

module.exports = { getConfig };
