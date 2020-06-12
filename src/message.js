const MESSAGE = {
  CLI_DONE: 'stack deployment complete.',
  CLI_START: 'stack deploying...',
  INVALID_CONFIGURATION: 'Invalid serverless configuration!!',
  NO_SUMOLOGIC_CONFIG: 'Configuration not found!!',
  ONLY_AWS_SUPPORT: 'Only supported for AWS provider',
  NO_SUMOLOGIC_NAME: '%s: configuration missing - custom.sumologic.name',
  NO_SUMOLOGIC_ENDPOINT_URL:
    '%s: configuration missing - custom.sumologic.endpointUrl',
};

module.exports = { MESSAGE };
