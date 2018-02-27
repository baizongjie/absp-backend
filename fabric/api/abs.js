const path = require('path');
const logger = require('../../logger').getLogger('abs_fabric_api');
const uuid = require('node-uuid')

// --- Set Details Here --- //
const config_file = 'config_local.json'; //set config file name
const chaincode_id = 'test_abs_ledger'; //set desired chaincode id to identify this chaincode
const chaincode_ver = 'v0.0.1'; //set desired chaincode version

const helper = require('../utils/helper')(config_file, logger); //set the config file name here
const fcw = require('../utils/fc_wrangler')({
  block_delay: helper.getBlockDelay()
}, logger);

let enrollFlag = false;
let enrollInfo;

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

const checkEnroll = failback => {
  if (!enrollFlag) {
    logger.error('The server has not enrolled yet...')
    failback && failback("NOT enroll");
  }
}

module.exports = {
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
  /** 查询列表 */
  queryAllProjects: callback => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query all projects');
    console.log('---------------------------------------');

    const opts = {
      ...basicFabricOpt,
      cc_function: 'query_all_projects',
      cc_args: [

      ]
    };
    fcw.query_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('query all projects done. Errors:', (!err) ? 'nope' : err);
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
  /** 根据ID查询项目 */
  queryProjectById: (projectId, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we read a project');
    console.log('---------------------------------------');

    var opts = {
      ...basicFabricOpt,
      cc_function: 'get_project_by_id',
      cc_args: [
        projectId
      ]
    };

    fcw.query_chaincode(enrollInfo, opts, (err, resp) => {
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
  /** 新增项目 */
  createProject: (projectInfo, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we create a project');
    console.log('---------------------------------------');

    const id = `project-bankcomm-${uuid.v4()}`;
    const {
      projectName,
      scale,
      basicAssets,
      initiator,
      trustee,
      depositary,
      agent,
      assetService,
      assessor,
      creditRater,
      liquiditySupporter,
      underwriter,
      lawyer,
      accountant
    } = projectInfo;

    const opts = {
      ...basicFabricOpt,
      cc_function: 'create_project',
      cc_args: [
        id,
        projectName,
        scale,
        basicAssets,
        initiator,
        trustee,
        depositary,
        agent,
        assetService,
        assessor,
        creditRater,
        liquiditySupporter,
        underwriter,
        lawyer,
        accountant
      ]
    };
    fcw.invoke_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('create project done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err, id);
    });
  },
  /** 使用JSON新增项目 */
  createProjectJson: (projectInfo, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we create a project');
    console.log('---------------------------------------');

    const id = `project-bankcomm-${uuid.v4()}`;
    projectInfo.id = id;

    const opts = {
      ...basicFabricOpt,
      cc_function: 'create_project_json',
      cc_args: [
        JSON.stringify(projectInfo)
      ]
    };
    fcw.invoke_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('create project done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err, id);
    });
  },
  /** 删除项目 */
  removeProject: (projectId, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we remove a project');
    console.log('---------------------------------------');

    const opts = {
      ...basicFabricOpt,
      cc_function: 'remove_project',
      cc_args: [
        projectId
      ]
    };

    fcw.invoke_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('remove a project done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 修改项目信息 */
  modifyProjectInfo: (projectInfo, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we modify a project');
    console.log('---------------------------------------');

    //根据chaincode逻辑规则生成修改参数
    const {
      projectId,
      ...info
    } = projectInfo;
    const modifyArgs = [projectId];
    for (let key in info) {
      modifyArgs.push(key, info[key]);
    }
    var opts = {
      ...basicFabricOpt,
      cc_function: 'modify_project',
      cc_args: modifyArgs
    };

    fcw.invoke_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('modify a workflow def done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 新增线性工作流 */
  createLinearWorkflow: (workflowInfo, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we create a linear workflow');
    console.log('---------------------------------------');

    const id = `linear-workflow-${uuid.v4()}`;
    workflowInfo.workflowDef.id = id;

    var args = [JSON.stringify(workflowInfo.workflowDef)]
    for (let node in workflowInfo.nodeList){
      args.concat(JSON.stringify(node))
    }

    const opts = {
      ...basicFabricOpt,
      cc_function: 'create_linear_workflow',
      cc_args: args
    };
    fcw.invoke_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('create linear workflow done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err, id);
    });
  },
  /** 根据ID查询工作流 */
  queryWorkflowById: (workflowId, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we read a workflow');
    console.log('---------------------------------------');

    var opts = {
      ...basicFabricOpt,
      cc_function: 'get_workflow_by_id',
      cc_args: [
        workflowId
      ]
    };

    fcw.query_chaincode(enrollInfo, opts, (err, resp) => {
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
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query all workflows');
    console.log('---------------------------------------');

    const opts = {
      ...basicFabricOpt,
      cc_function: 'query_all_workflows',
      cc_args: [
      ]
    };
    fcw.query_chaincode(enrollInfo, opts, (err, resp) => {
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
  /** 修改工作流信息 */
  modifyWorkflowInfo: (workflowInfo, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we modify a workflow def');
    console.log('---------------------------------------');

    //根据chaincode逻辑规则生成修改参数
    const {
      workflowId,
      ...info
    } = workflowInfo;
    const modifyArgs = [workflowId];
    for (let key in info) {
      modifyArgs.push(key, info[key]);
    }
    var opts = {
      ...basicFabricOpt,
      cc_function: 'modify_workflow_def',
      cc_args: modifyArgs
    };

    fcw.invoke_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('modify a workflow def done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 启用或禁用工作流 */
  enableOrDisableWorkflow: (workflowInfo, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we enable or disable a workflow');
    console.log('---------------------------------------');

    const {
      workflowId,
      enabled
    } = workflowInfo;

    var enabledStr = enabled ? "true" : "false";

    var opts = {
      ...basicFabricOpt,
      cc_function: 'enable_or_disable_workflow',
      cc_args: [
        workflowId,
        enabledStr
      ]
    };

    fcw.invoke_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('enable or disable a workflow done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 开始一个流程 */
  startProcess: (processInfo, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we start a process');
    console.log('---------------------------------------');

    const id = `${processInfo.workflowId}:process-${uuid.v4()}`;
    processInfo.id = id;

    const opts = {
      ...basicFabricOpt,
      cc_function: 'start_process',
      cc_args: [
        JSON.stringify(processInfo)
      ]
    };
    fcw.invoke_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('start a process done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err, id);
    });
  },
  /** 根据ID查询流程实例 */
  queryProcessById: (processId, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query a process');
    console.log('---------------------------------------');

    var opts = {
      ...basicFabricOpt,
      cc_function: 'get_process_by_id',
      cc_args: [
        processId
      ]
    };

    fcw.query_chaincode(enrollInfo, opts, (err, resp) => {
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
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query process logs');
    console.log('---------------------------------------');

    const opts = {
      ...basicFabricOpt,
      cc_function: 'query_logs_by_process_id',
      cc_args: [
        processId
      ]
    };
    fcw.query_chaincode(enrollInfo, opts, (err, resp) => {
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
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we transfer process');
    console.log('---------------------------------------');

    const {
      processId,
      nextNodeId,
      nextOwner
    } = transferInfo;

    var opts = {
      ...basicFabricOpt,
      cc_function: 'transfer_process',
      cc_args: [
        processId,
        nextNodeId,
        nextOwner
      ]
    };

    fcw.invoke_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('transfer process done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 取消流程实例 */
  cancelProcess: (processId, callback) => {
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we cancel a process');
    console.log('---------------------------------------');

    var opts = {
      ...basicFabricOpt,
      cc_function: 'cancel_process',
      cc_args: [
        processId
      ]
    };

    fcw.invoke_chaincode(enrollInfo, opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('cancel a process done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 查询待办流程列表 */
  queryTodoList: callback => {
    // TODO 处理分页条件
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query todo list');
    console.log('---------------------------------------');

    const opts = {
      ...basicFabricOpt,
      cc_function: 'query_todo_process',
      cc_args: [
      ]
    };
    fcw.query_chaincode(enrollInfo, opts, (err, resp) => {
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
    checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query done list');
    console.log('---------------------------------------');

    const opts = {
      ...basicFabricOpt,
      cc_function: 'query_done_process',
      cc_args: [
      ]
    };
    fcw.query_chaincode(enrollInfo, opts, (err, resp) => {
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
