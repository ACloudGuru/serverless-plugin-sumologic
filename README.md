![Build](https://github.com/ACloudGuru/serverless-plugin-sumologic/workflows/Build/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/ACloudGuru/serverless-plugin-sumologic/branch/master/graph/badge.svg)](https://codecov.io/gh/ACloudGuru/serverless-plugin-sumologic)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/0c8bbbf42fe0458bbf81f6c3f9f59895)](https://www.codacy.com/gh/ACloudGuru/serverless-plugin-sumologic?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ACloudGuru/serverless-plugin-sumologic&amp;utm_campaign=Badge_Grade)
[![Npm Version](https://img.shields.io/npm/v/serverless-plugin-sumologic.svg)](https://www.npmjs.com/package/serverless-plugin-sumologic)

# 📋 Serverless Plugin Alert

This Serverless plugin deploys Cloudformation Stack with resources required to send Cloudformation Logs to Sumologic. This stack uses AWS Lambda to subscribe to your CloudWatch Log Group and POSTs the log data directly to Sumo HTTP Source. 

You can read about it more [here](https://help.sumologic.com/03Send-Data/Collect-from-Other-Data-Sources/Amazon-CloudWatch-Logs).

## Installation
```
$ yarn add --dev serverless-plugin-sumologic
```

## Usage
1. Add the following configuration to your `serverless.yml`.

```
plugins:
  - serverless-plugin-sumologic

custom:
  sumologic:
    name: sumologic-logs 
    endpointUrl: sumologic-http-endpoint
    includeLogGroupInfo: true
```
2. Run `yarn sls deploy` to deploy your serverless stack.

Note: You can also run `yarn sls deploy sumologic` to deploy just the sumologic stack without deploying your serverless stack.

## Properties
1. **name:** required (must be unique per account if you are deploying multiple stacks)
2. **endpointUrl:** required (Sumologic HTTP endpoint)
3. **includeLogGroupInfo:**: optional

## Example Serverless Configuration
```
service: serverless-example
frameworkVersion: ">=1.11.0 <2.0.0"
provider:
  name: aws
  runtime: nodejs12.x
  region: us-east-1

plugins:
  - serverless-plugin-sumologic

custom:
  sumologic:
    name: sumologic-logs
    endpointUrl: sumologic-http-endpoint
    includeLogGroupInfo: true

functions:
  myfunction:
    handler: src/index.handler
    memorySize: 1536
    timeout: 30
```

## License
Feel free to use the code, it's released using the [MIT license](https://github.com/ACloudGuru/serverless-plugin-sumologic/blob/master/LICENSE).
