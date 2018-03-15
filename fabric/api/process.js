const logger = require('../../logger').getLogger('abs_fabric_api');
const uuid = require('node-uuid')

const helper = require('../utils/helper').func; //set the config file name here
const fcw = require('../utils/fc_wrangler').func;

const enroll = require('./enroll');
const basic = require('./basic');

module.exports = {
  /** 开始一个流程 */
  startProcess: (processInfo, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we start a process');
    console.log('---------------------------------------');

    const id = `${processInfo.workflowId}:process-${uuid.v4()}`;
    processInfo.id = id;
    processInfo.createTime = new Date().toLocaleString("zh-CN");

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'start_process',
      cc_args: [
        JSON.stringify(processInfo)
      ]
    };
    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('start a process done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err, id);
    });
  },
  /** 根据ID查询流程实例 */
  queryProcessById: (processId, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query a process');
    console.log('---------------------------------------');

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'get_process_by_id',
      cc_args: [
        processId
      ]
    };

    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('query a process done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      if (!err && resp != null && resp.peer_payloads != null) {
        logger.info('response is:', resp.peer_payloads[0]);
        console.log('---------------------------------------');
        callback(null, resp.peer_payloads[0]);
      } else {
        callback(err);
      }
    });
  },
  /** 查询流程日志 */
  queryProcessLogs: (processId, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query process logs');
    console.log('---------------------------------------');

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'query_logs_by_process_id',
      cc_args: [
        processId
      ]
    };
    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('query process logs done. Errors:', (!err) ? 'nope' : err);
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
  /** 流程实例运行/传递 */
  transferProcess: (transferInfo, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we transfer process');
    console.log('---------------------------------------');

    const {
      processId,
      nextNodeId,
      nextOwner
    } = transferInfo;

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'transfer_process',
      cc_args: [
        processId,
        nextNodeId,
        nextOwner,
        new Date().toLocaleString("zh-CN")
      ]
    };

    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('transfer process done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 流程实例退回 */
  returnProcess: (returnInfo, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we return process');
    console.log('---------------------------------------');

    const {
      processId,
    } = returnInfo;

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'return_process',
      cc_args: [
        processId,
        new Date().toLocaleString("zh-CN")
      ]
    };

    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('return process done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 流程实例撤回 */
  withdrawProcess: (returnInfo, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we withdraw process');
    console.log('---------------------------------------');

    const {
      processId,
    } = returnInfo;

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'withdraw_process',
      cc_args: [
        processId,
        new Date().toLocaleString("zh-CN")
      ]
    };

    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('withdraw process done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 取消流程实例 */
  cancelProcess: (processId, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we cancel a process');
    console.log('---------------------------------------');

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'cancel_process',
      cc_args: [
        processId,
        new Date().toLocaleString("zh-CN")
      ]
    };

    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('cancel a process done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 查询待办流程列表 */
  queryTodoList: callback => {
    // TODO 处理分页条件
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query todo list');
    console.log('---------------------------------------');

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'query_todo_process',
      cc_args: [
      ]
    };
    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('query todo list done. Errors:', (!err) ? 'nope' : err);
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
  /** 查询已办流程列表 */
  queryDoneList: callback => {
    // TODO 处理分页条件
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query done list');
    console.log('---------------------------------------');

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'query_done_process',
      cc_args: [
      ]
    };
    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('query done list done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      if (!err && resp != null && resp.peer_payloads != null) {
        logger.info('response is:', resp.peer_payloads[0]);
        callback(null, resp.peer_payloads[0]);
        console.log('---------------------------------------');
      } else {
        callback(err);
      }
    });
  }
}
