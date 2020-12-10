const get = require('lodash.get');

const defaults = {
  includeLogGroupInfo: false,
};

const getConfig = ({ serverless, options }) => {
  const stage =
    get(options, 'stage') || get(serverless, 'service.provider.stage');

  const region =
    get(options, 'region') || get(serverless, 'service.provider.region');

  const name = `sumologic-${get(
    serverless,
    'service.custom.sumologic.name'
  )}-${stage}`;

  if (!stage) {
    throw new Error('Serverless "stage" is missing');
  }

  if (!region) {
    throw new Error('Serverless "region" is missing');
  }

  const config = get(serverless, 'service.custom.sumologic', {});

  return { ...defaults, ...config, stage, region, name };
};

module.exports = { getConfig };
