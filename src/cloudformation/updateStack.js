const updateStack = ({ provider, params, options }) =>
  provider.request('CloudFormation', 'updateStack', params, {
    region: options.region,
  });

module.exports = { updateStack };
