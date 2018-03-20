const path = require('path');
const logger = require('../../logger').getLogger('abs_fabric_api');
const uuid = require('node-uuid')

// --- Set Details Here --- //
const config_file = 'config_local.json'; //set config file name
const chaincode_id = 'test_abs_ledger'; //set desired chaincode id to identify this chaincode
const chaincode_ver = 'v0.0.1'; //set desired chaincode version

const helper = require('../utils/helper').func; //set the config file name here
const fcw = require('../utils/fc_wrangler').func;

let enrollFlag = false;
let enrollInfo;

module.exports = {
  checkEnroll: failback => {
    if (!enrollFlag) {
      logger.error('The server has not enrolled yet...')
      failback && failback("NOT enroll");
    }
  },

  enroll: () => {
    logger.info('First we enroll');
    fcw.enrollWithAdminCert(helper.makeEnrollmentOptionsUsingCert(), (enrollErr, enrollResp) => {
      logger.info('Enroll Success!!');
      if (enrollErr) {
        logger.error('error enrolling', enrollErr, enrollResp);
      } else {
        enrollFlag = true;
        enrollInfo = enrollResp;
      }
    });
  },

  getEnrollInfo: () => {
    return enrollInfo;
  }
}
