const Parameters = {
  SumoEndPointURL: {
    Type: 'String',
    Description: 'SUMO_ENDPOINT created while configuring HTTP Source',
  },
  SumoIncludeLogGroupInfo: {
    Type: 'String',
    AllowedValues: ['true', 'false'],
    Description: 'Select true to get loggroup/logstream values in logs',
  },
};

module.exports = { Parameters };
