const get = require('lodash.get');

const defaults = {
  includeLogGroupInfo: false,
};

const getConfig = ({ serverless }) => {
  const config = get(serverless, 'service.custom.sumologic', {});

  return { ...defaults, ...config };
};

module.exports = { getConfig };
