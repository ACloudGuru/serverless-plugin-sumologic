const Parameters = {
  Stage: {
    Description: 'Deployment Stage Name',
    Type: 'String',
  },
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
