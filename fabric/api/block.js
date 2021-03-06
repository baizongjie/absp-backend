const logger = require('../../logger').getLogger('abs_fabric_api');
const uuid = require('node-uuid')
const pem = require('pem');

const helper = require('../utils/helper').func; //set the config file name here
const fcw = require('../utils/fc_wrangler').func;

const enroll = require('./enroll');
const blockDecoder = require('../utils/blockDecoder');

let orgInfoList = [];

module.exports = {
  getOrgAndPublicKeyList: (callback) => {
    if (callback) {
      callback(orgInfoList);
    }
  },

  // 获取密钥的过程需要异步执行
  reloadOrgAndPublicKeyList: (callback) => {
    enroll.checkEnroll(callback);
    const { client, channel } = enroll.getEnrollInfo();
    const txId = client.newTransactionID();
    const request = {
      txId,
    };
    // 获取创世区块
    channel.getGenesisBlock(request).then(returnBlock => {
      orgInfoList = [];

      const adminCerts = [];
      const blockData = blockDecoder.decodeBlock(returnBlock);
      const groupData = blockData.data.data[0].payload.data.config.channel_group.groups.Application.groups;
      const groupKeys = Object.keys(groupData);
      groupKeys.forEach(key => {
        adminCerts.push(groupData[key].values.MSP.value.config.admins[0]);
      });

      adminCerts.forEach(adminCert => {
        pem.getPublicKey(adminCert, (error, keyInfo) => {
          if (error) {
            return;
          }
          const { publicKey } = keyInfo;
          pem.readCertificateInfo(adminCert, (error, certValues) => {
            if (error) {
              return;
            }
            const { commonName } = certValues;
            const organization = commonName.substring(commonName.lastIndexOf('@'));
            const orgInfo = {
              organization,
              publicKey,
            };
            orgInfoList.push(orgInfo);
            logger.info('Got a org info: ', orgInfo);
          })
        });
      });

      if (callback) {
        callback();
      }
      return;
    }).catch(function (err) {
      // --- Failure --- //
      logger.error('Failed to get genesis block ', err);
      if (callback) {
        callback(err);
      }
      return;
    });

  },
}
