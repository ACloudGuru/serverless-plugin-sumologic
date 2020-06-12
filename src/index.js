const assert = require('assert');
const { format } = require('util');
const { MESSAGE } = require('./message');
const { getConfig } = require('./getConfig');
const { generateTemplate } = require('./template/generateTemplate');
const { Cloudformation } = require('./cloudformation');

class ServerlessSumologicPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = serverless.getProvider('aws');
    this.config = getConfig({ serverless, options });

    this.logger = {
      log: msg => this.serverless.cli.log(format(this.config.prefix, msg)),
    };

    this.cloudformation = Cloudformation({
      provider: this.provider,
      logger: this.logger,
    });

    this.commands = {
      deploy: {
        commands: {
          sumologic: {
            usage: 'Deploy sumologic stack',
            lifecycleEvents: ['deploy'],
          },
        },
      },
    };

    this.hooks = {
      'before:deploy:deploy': this.beforeDeploy.bind(this),
    };
  }

  beforeDeploy() {
    return Promise.resolve()
      .then(() => this.validate())
      .then(() => this.logger.log(MESSAGE.CLI_START))
      .then(() => generateTemplate({ config: this.config }))
      .then(template =>
        this.cloudformation.deploy({ config: this.config, template })
      )
      .then(() => this.logger.log(MESSAGE.CLI_DONE))
      .catch(err => Promise.reject(err.message));
  }

  validate() {
    const { service } = this.serverless;

    assert(this.serverless, MESSAGE.INVALID_CONFIGURATION);
    assert(service, MESSAGE.INVALID_CONFIGURATION);
    assert(service.provider, MESSAGE.INVALID_CONFIGURATION);
    assert(service.provider.name, MESSAGE.INVALID_CONFIGURATION);
    assert(service.provider.name === 'aws', MESSAGE.ONLY_AWS_SUPPORT);

    assert(service.custom, MESSAGE.NO_SUMOLOGIC_CONFIG);
    assert(service.custom.sumologic, MESSAGE.NO_SUMOLOGIC_CONFIG);
    assert(service.custom.sumologic.name, MESSAGE.NO_SUMOLOGIC_NAME);
    assert(
      service.custom.sumologic.endpointUrl,
      MESSAGE.NO_SUMOLOGIC_ENDPOINT_URL
    );
  }
}

module.exports = ServerlessSumologicPlugin;
