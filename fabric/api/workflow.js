const logger = require('../../logger').getLogger('abs_fabric_api');
const uuid = require('node-uuid')

const helper = require('../utils/helper').func; //set the config file name here
const fcw = require('../utils/fc_wrangler').func;

let enroll = require('./enroll');
let basic = require('./basic');

module.exports = {
  /** 新增线性工作流 */
  createLinearWorkflow: (workflowInfo, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we create a linear workflow');
    console.log('---------------------------------------');

    const id = `linear-workflow-${uuid.v4()}`;
    workflowInfo.workflowDef.id = id;
    workflowInfo.workflowDef.createTime = new Date().toLocaleString("zh-CN");

    const args = [JSON.stringify(workflowInfo.workflowDef)];
    workflowInfo.nodeList.forEach((element) => {
      args.push(JSON.stringify(element))
    });

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'create_linear_workflow',
      cc_args: args
    };
    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('create linear workflow done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err, id);
    });
  },
  /** 根据ID查询工作流 */
  queryWorkflowById: (workflowId, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we read a workflow');
    console.log('---------------------------------------');

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'get_workflow_by_id',
      cc_args: [
        workflowId
      ]
    };

    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('read done. Errors:', (!err) ? 'nope' : err);
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
  /** 查询工作流列表 */
  queryAllWorkflows: callback => {
    // TODO 处理分页条件
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query all workflows');
    console.log('---------------------------------------');

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'query_all_workflows',
      cc_args: [
      ]
    };
    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('query all workflows done. Errors:', (!err) ? 'nope' : err);
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
  /** 查询可发起的工作流列表 */
  queryAccessableWorkflows: callback => {
    // TODO 处理分页条件
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query accessable workflows');
    console.log('---------------------------------------');

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'query_accessable_workflows',
      cc_args: [
      ]
    };
    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('query accessable workflows done. Errors:', (!err) ? 'nope' : err);
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
  /** 修改工作流信息 */
  modifyWorkflowInfo: (workflowInfo, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we modify a workflow def');
    console.log('---------------------------------------');

    //根据chaincode逻辑规则生成修改参数
    const {
      workflowId,
      ...info
    } = workflowInfo;
    const modifyArgs = [workflowId, new Date().toLocaleString("zh-CN")];
    for (let key in info) {
      modifyArgs.push(key, info[key]);
    }
    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'modify_workflow_def',
      cc_args: modifyArgs
    };

    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('modify a workflow def done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 启用或禁用工作流 */
  enableOrDisableWorkflow: (workflowInfo, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we enable or disable a workflow');
    console.log('---------------------------------------');

    const {
      workflowId,
      enabled
    } = workflowInfo;

    var enabledStr = enabled ? "true" : "false";

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'enable_or_disable_workflow',
      cc_args: [
        workflowId,
        enabledStr,
        new Date().toLocaleString("zh-CN")
      ]
    };

    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('enable or disable a workflow done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  }
}
