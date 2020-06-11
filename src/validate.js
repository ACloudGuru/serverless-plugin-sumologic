const assert = require('assert');
const { MESSAGE } = require('./message');

const validate = ({ serverless }) => {
  assert(serverless, MESSAGE.INVALID_CONFIGURATION);
  assert(serverless.service, MESSAGE.INVALID_CONFIGURATION);
  assert(serverless.service.provider, MESSAGE.INVALID_CONFIGURATION);
  assert(serverless.service.provider.name, MESSAGE.INVALID_CONFIGURATION);
  assert(serverless.service.provider.name === 'aws', MESSAGE.ONLY_AWS_SUPPORT);

  assert(serverless.service.custom, MESSAGE.NO_SUMOLOGIC_CONFIG);
  assert(serverless.service.custom.sumologic, MESSAGE.NO_SUMOLOGIC_CONFIG);
  assert(serverless.service.custom.sumologic.name, MESSAGE.NO_SUMOLOGIC_NAME);
  assert(serverless.service.custom.sumologic.endpointUrl, MESSAGE.NO_SUMOLOGIC_ENDPOINT_URL);
};

module.exports = { validate };
