const logger = require('../../logger').getLogger('abs_fabric_api');
const uuid = require('node-uuid')

const helper = require('../utils/helper').func; //set the config file name here
const fcw = require('../utils/fc_wrangler').func;

const enroll = require('./enroll');
const basic = require('./basic');

module.exports = {
  /** 保存RSA公开钥 */
  saveRsaPubKey: () => {
    enroll.checkEnroll();

    console.log('---------------------------------------');
    logger.info('Now we start save rsa public key');
    console.log('---------------------------------------');

    const channel = helper.getChannelId();
    const first_peer = helper.getFirstPeerName(channel);

    const org_2_use = helper.getClientOrg();
    const org_name = helper.getOrgsMSPid(org_2_use);
    const publicKey = helper.getRsaPublicKeyCertPEM(org_name);

    const modifyTime = new Date().toLocaleString("zh-CN");

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'save_org_public_key',
      cc_args: [
        publicKey,
        modifyTime
      ],
    };

    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, function (err, resp) {
      console.log('---------------------------------------');
      logger.info('save rsa public key done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
    });
  },
  /** RSA数据加密（JSON） */
  rsaEncrypt: (reqInfo, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we start rsa encrypt');
    console.log('---------------------------------------');

    const channel = helper.getChannelId();
    const first_peer = helper.getFirstPeerName(channel);

    const stateID = `rsa-encrypted:${uuid.v4()}`;
    const originDataJSON = JSON.stringify(reqInfo.originData);
    const targetOrgsJSON = JSON.stringify(reqInfo.targetOrgs);
    const modifyTime = new Date().toLocaleString("zh-CN");

    const oriDataBuffer = new Buffer(originDataJSON);
    const transientMap = {
      dataString: buffer,
    };

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'encrypt_data',
      cc_args: [
        stateID,
        targetOrgsJSON,
        modifyTime
      ],
      transient_map: transientMap,
    };

    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, function (err, resp) {
      console.log('---------------------------------------');
      logger.info('rsa encrypt done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err, stateID);
    });
  },
  /** RSA解密数据（JSON） */
  rsaDecrypt: (stateID, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we start rsa decrypt');
    console.log('---------------------------------------');

    const org_2_use = helper.getClientOrg();
    const org_name = helper.getOrgsMSPid(org_2_use);
    const privateKey = helper.getRsaPrivateKeyCertPEM(org_name);
    const buffer = new Buffer(privateKey);
    const transientMap = {
      privateKey: buffer,
    };

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'decrypt_data',
      cc_args: [
        stateID
      ],
      transient_map: transientMap,
    };

    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('rsa decrypt done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      if (!err && resp != null && resp.peer_payloads != null) {
        logger.info('response is:', resp.peer_payloads[0]);
        console.log('---------------------------------------');
        callback(null, JSON.parse(resp.peer_payloads[0]));
      } else {
        callback(err);
      }
    });
  },
}
