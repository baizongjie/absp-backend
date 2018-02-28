const logger = require('../../logger').getLogger('abs_fabric_api');

// --- Set Details Here --- //
const chaincode_id = 'test_abs_ledger'; //set desired chaincode id to identify this chaincode
const chaincode_ver = 'v0.0.1'; //set desired chaincode version

const helper = require('../utils/helper'); //set the config file name here

const channel = helper.func.getChannelId();
const first_peer = helper.func.getFirstPeerName(channel);
const basicFabricOpt = {
  peer_urls: [helper.func.getPeersUrl(first_peer)],
  peer_tls_opts: helper.func.getPeerTlsCertOpts(first_peer),
  channel_id: helper.func.getChannelId(),
  chaincode_id: chaincode_id,
  chaincode_version: chaincode_ver,
  event_urls: ['grpc://localhost:7053'],
};

module.exports = {
  getBasicFabricOpt: () => {
    return basicFabricOpt;
  }
}
