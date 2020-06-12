const { Mappings } = require('./mappings');
const { getOutputs } = require('./getOutputs');
const { Parameters } = require('./parameters');
const { getResources } = require('./getResources');
const { toCamelCase } = require('../util');

const generateTemplate = ({ config }) => ({
  AWSTemplateFormatVersion: '2010-09-09',
  Description:
    'Cloudformation stack for streaming Cloudwatch logs to Sumologic',
  Parameters,
  Mappings,
  Resources: getResources({ ...config, prefix: toCamelCase(config.name) }),
  Outputs: getOutputs({ prefix: toCamelCase(config.name) }),
});

module.exports = { generateTemplate };
