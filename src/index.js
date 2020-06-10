const { format } = require('util');

const message = {
  CLI_START: 'Serverless Sumologic Plugin:',
  CLI_SKIP: 'Skipping serverless sumologic plugin: %s!',
};

class ServerlessSumologicPlugin {
  constructor(serverless) {
    this.serverless = serverless;

    this.hooks = {
      'package:compileEvents': this.beforeDeployResources.bind(this),
    };
  }

  beforeDeployResources() {
    return Promise.resolve()
      .then(() => this.serverless.cli.log(format(message.CLI_START)))
      .catch(err => this.serverless.cli.log(format(message.CLI_SKIP, err.message)));
  }
}

module.exports = ServerlessSumologicPlugin;
