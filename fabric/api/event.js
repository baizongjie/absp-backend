const logger = require('../../logger').getLogger('abs_fabric_api');
const uuid = require('node-uuid')

const helper = require('../utils/helper').func; //set the config file name here
const fcw = require('../utils/fc_wrangler').func;

const enroll = require('./enroll');
const basic = require('./basic');

module.exports = {
  registerChaincodeEvent: (callback) => {
    enroll.checkEnroll(callback);
    logger.info('start register chaincode event');
    const channel = helper.getChannelId();
    const first_peer = helper.getFirstPeerName(channel);
    const options = {
      event_name: 'NewEvent',
      peer_tls_opts: helper.getPeerTlsCertOpts(first_peer),
      chaincode_id: basic.getChaincodeId(),
      target_event_url: 'grpc://localhost:7053',
    };
    const eventHub = fcw.register_chaincode_event(enroll.getEnrollInfo(), options, (eventString) => {
      const event = JSON.parse(eventString);
      logger.info('Received a event:', event.eventName);
      logger.info('TxID:', event.txId);
      logger.info('Event payload:', JSON.stringify(event.payload));
      callback(event);
    });
  },
}
