const logger = require('../../logger').getLogger('abs_fabric_api');
const uuid = require('node-uuid')

const helper = require('../utils/helper').func; //set the config file name here
const fcw = require('../utils/fc_wrangler').func;

const enroll = require('./enroll');
const basic = require('./basic');

module.exports = {
  /** 附件上传 */
  attachmentUpload: (attachmentInfo, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we upload attachment');
    console.log('---------------------------------------');


    const id = `attachment-bankcomm-${uuid.v4()}`;
    attachmentInfo.id = id;
    attachmentInfo.createTime = new Date().toLocaleString("zh-CN");

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'attachment_upload',
      cc_args: [        
        JSON.stringify(attachmentInfo)
      ]
    };
    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('attachment upload done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err, id);
    });
  },
  /** 查询附件列表 */
  queryAttachmentList: callback => {
    // TODO 处理分页条件
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query attachment list');
    console.log('---------------------------------------');

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'query_attachment_list',
      cc_args: [
      ]
    };
    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('query attachment list done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      if (!err && resp != null && resp.peer_payloads != null) {
        logger.info('response is:', resp.peer_payloads[0]);
        callback(null, resp.peer_payloads[0]);
        console.log('---------------------------------------');
      } else {
        callback(err);
      }
    });
  },
  /** 根据主键列表查询附件列表 */
  queryAttachmentListByIdList: (attachmentIdList,callback)=> {
    // TODO 处理分页条件
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query attachment list by id list');
    console.log('---------------------------------------');
    

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'query_attachment_list_by_id_list',
      cc_args:attachmentIdList,
    };
    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('query attachment list by id list done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      if (!err && resp != null && resp.peer_payloads != null) {
        logger.info('response is:', resp.peer_payloads[0]);
        callback(null, resp.peer_payloads[0]);
        console.log('---------------------------------------');
      } else {
        callback(err);
      }
    });
  },
}
