const getResources = ({ stage }) => ({
  SumoCWLogGroup: {
    Type: 'AWS::Logs::LogGroup',
    Properties: {
      LogGroupName: 'SumoCWLogGroup',
      RetentionInDays: 7,
    },
  },
  SumoCWLogSubsriptionFilter: {
    Type: 'AWS::Logs::SubscriptionFilter',
    Properties: {
      LogGroupName: {
        Ref: 'SumoCWLogGroup',
      },
      DestinationArn: {
        'Fn::GetAtt': ['SumoCWLogsLambda', 'Arn'],
      },
      FilterPattern: '',
    },
    DependsOn: ['SumoCWLogGroup', 'SumoCWLambdaPermission', 'SumoCWLogsLambda'],
  },
  SumoCWLambdaPermission: {
    Type: 'AWS::Lambda::Permission',
    Properties: {
      FunctionName: {
        'Fn::GetAtt': ['SumoCWLogsLambda', 'Arn'],
      },
      Action: 'lambda:InvokeFunction',
      Principal: {
        'Fn::Join': [
          '.',
          [
            'logs',
            {
              Ref: 'AWS::Region',
            },
            'amazonaws.com',
          ],
        ],
      },
      SourceAccount: {
        Ref: 'AWS::AccountId',
      },
    },
  },
  SumoCWDeadLetterQueue: {
    Type: 'AWS::SQS::Queue',
    Properties: {
      QueueName: 'SumoCWDeadLetterQueue',
    },
  },
  SumoCWLambdaExecutionRole: {
    Type: 'AWS::IAM::Role',
    Properties: {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: ['lambda.amazonaws.com'],
            },
            Action: ['sts:AssumeRole'],
          },
        ],
      },
      Path: '/',
      Policies: [
        {
          PolicyName: 'SQSCreateLogsRolePolicy',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'sqs:DeleteMessage',
                  'sqs:GetQueueUrl',
                  'sqs:ListQueues',
                  'sqs:ChangeMessageVisibility',
                  'sqs:SendMessageBatch',
                  'sqs:ReceiveMessage',
                  'sqs:SendMessage',
                  'sqs:GetQueueAttributes',
                  'sqs:ListQueueTags',
                  'sqs:ListDeadLetterSourceQueues',
                  'sqs:DeleteMessageBatch',
                  'sqs:PurgeQueue',
                  'sqs:DeleteQueue',
                  'sqs:CreateQueue',
                  'sqs:ChangeMessageVisibilityBatch',
                  'sqs:SetQueueAttributes',
                ],
                Resource: [
                  {
                    'Fn::GetAtt': ['SumoCWDeadLetterQueue', 'Arn'],
                  },
                ],
              },
            ],
          },
        },
        {
          PolicyName: 'CloudWatchCreateLogsRolePolicy',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: [
                  'logs:CreateLogGroup',
                  'logs:CreateLogStream',
                  'logs:PutLogEvents',
                  'logs:DescribeLogStreams',
                ],
                Resource: [
                  {
                    'Fn::Join': [
                      ':',
                      [
                        'arn',
                        'aws',
                        'logs',
                        {
                          Ref: 'AWS::Region',
                        },
                        {
                          Ref: 'AWS::AccountId',
                        },
                        'log-group',
                        '*',
                      ],
                    ],
                  },
                ],
              },
            ],
          },
        },
        {
          PolicyName: 'InvokeLambdaRolePolicy',
          PolicyDocument: {
            Version: '2012-10-17',
            Statement: [
              {
                Effect: 'Allow',
                Action: ['lambda:InvokeFunction'],
                Resource: [
                  {
                    'Fn::Join': [
                      ':',
                      [
                        'arn',
                        'aws',
                        'lambda',
                        {
                          Ref: 'AWS::Region',
                        },
                        {
                          Ref: 'AWS::AccountId',
                        },
                        'function',
                        'SumoCWProcessDLQLambda',
                      ],
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  },
  SumoCWLogsLambda: {
    Type: 'AWS::Lambda::Function',
    DependsOn: ['SumoCWLambdaExecutionRole', 'SumoCWDeadLetterQueue'],
    Properties: {
      FunctionName: {
        'Fn::Sub': `sumologic-${stage}`,
      },
      Code: {
        S3Bucket: {
          'Fn::FindInMap': [
            'RegionMap',
            {
              Ref: 'AWS::Region',
            },
            'bucketname',
          ],
        },
        S3Key: 'cloudwatchlogs-with-dlq.zip',
      },
      Role: {
        'Fn::GetAtt': ['SumoCWLambdaExecutionRole', 'Arn'],
      },
      Timeout: 300,
      DeadLetterConfig: {
        TargetArn: {
          'Fn::GetAtt': ['SumoCWDeadLetterQueue', 'Arn'],
        },
      },
      Handler: 'cloudwatchlogs_lambda.handler',
      Runtime: 'nodejs12.x',
      MemorySize: 128,
      Environment: {
        Variables: {
          SUMO_ENDPOINT: {
            Ref: 'SumoEndPointURL',
          },
          LOG_FORMAT: 'VPC-JSON',
          INCLUDE_LOG_INFO: {
            Ref: 'SumoIncludeLogGroupInfo',
          },
        },
      },
    },
  },
  SumoCWEventsInvokeLambdaPermission: {
    Type: 'AWS::Lambda::Permission',
    Properties: {
      FunctionName: {
        Ref: 'SumoCWProcessDLQLambda',
      },
      Action: 'lambda:InvokeFunction',
      Principal: 'events.amazonaws.com',
      SourceArn: {
        'Fn::GetAtt': ['SumoCWProcessDLQScheduleRule', 'Arn'],
      },
    },
  },
  SumoCWProcessDLQScheduleRule: {
    Type: 'AWS::Events::Rule',
    Properties: {
      Description: 'Events rule for Cron',
      ScheduleExpression: 'rate(5 minutes)',
      State: 'ENABLED',
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': ['SumoCWProcessDLQLambda', 'Arn'],
          },
          Id: 'TargetFunctionV1',
        },
      ],
    },
  },
  SumoCWProcessDLQLambda: {
    Type: 'AWS::Lambda::Function',
    DependsOn: ['SumoCWLambdaExecutionRole', 'SumoCWDeadLetterQueue'],
    Properties: {
      FunctionName: {
        'Fn::Sub': `sumologic-DLQ-${stage}`,
      },
      Code: {
        S3Bucket: {
          'Fn::FindInMap': [
            'RegionMap',
            {
              Ref: 'AWS::Region',
            },
            'bucketname',
          ],
        },
        S3Key: 'cloudwatchlogs-with-dlq.zip',
      },
      Role: {
        'Fn::GetAtt': ['SumoCWLambdaExecutionRole', 'Arn'],
      },
      Timeout: 300,
      Handler: 'DLQProcessor.handler',
      DeadLetterConfig: {
        TargetArn: {
          'Fn::GetAtt': ['SumoCWDeadLetterQueue', 'Arn'],
        },
      },
      Runtime: 'nodejs12.x',
      MemorySize: 128,
      Environment: {
        Variables: {
          SUMO_ENDPOINT: {
            Ref: 'SumoEndPointURL',
          },
          TASK_QUEUE_URL: {
            'Fn::Join': [
              '',
              [
                'https://sqs.',
                {
                  Ref: 'AWS::Region',
                },
                '.amazonaws.com/',
                {
                  Ref: 'AWS::AccountId',
                },
                '/',
                {
                  'Fn::GetAtt': ['SumoCWDeadLetterQueue', 'QueueName'],
                },
              ],
            ],
          },
          NUM_OF_WORKERS: 4,
          LOG_FORMAT: 'VPC-JSON',
          INCLUDE_LOG_INFO: {
            Ref: 'SumoIncludeLogGroupInfo',
          },
        },
      },
    },
  },
});

module.exports = { getResources };
