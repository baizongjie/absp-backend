const logger = require('../../logger').getLogger('abs_fabric_api');

// --- Set Details Here --- //
const chaincode_id = 'test_abs_ledger'; //set desired chaincode id to identify this chaincode
const chaincode_ver = 'v0.0.1'; //set desired chaincode version

const helper = require('../utils/helper').func; //set the config file name here

const channel = helper.getChannelId();
const first_peer = helper.getFirstPeerName(channel);
const basicFabricOpt = {
  peer_urls: [helper.getPeersUrl(first_peer)],
  peer_tls_opts: helper.getPeerTlsCertOpts(first_peer),
  channel_id: helper.getChannelId(),
  chaincode_id: chaincode_id,
  chaincode_version: chaincode_ver,
  event_urls: ['grpc://localhost:7053'],
};

module.exports = {
  getBasicFabricOpt: () => {
    return basicFabricOpt;
  },

  getChaincodeId: () => {
    return chaincode_id;
  },
}
