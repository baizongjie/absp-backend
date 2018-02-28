const logger = require('../../logger').getLogger('abs_fabric_api');
const uuid = require('node-uuid')

const helper = require('../utils/helper'); //set the config file name here
const fcw = require('../utils/fc_wrangler')({
  block_delay: helper.func.getBlockDelay()
}, logger);

const enroll = require('./enroll');
const basic = require('./basic');

module.exports = {
  /** 查询列表 */
  queryAllProjects: callback => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we query all projects');
    console.log('---------------------------------------');

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'query_all_projects',
      cc_args: [

      ]
    };
    fcw.query_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
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
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we read a project');
    console.log('---------------------------------------');

    var opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'get_project_by_id',
      cc_args: [
        projectId
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
  /** 新增项目 */
  createProject: (projectInfo, callback) => {
    enroll.checkEnroll(callback);

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
      ...basic.getBasicFabricOpt(),
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
    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('create project done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err, id);
    });
  },
  /** 使用JSON新增项目 */
  createProjectJson: (projectInfo, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we create a project');
    console.log('---------------------------------------');

    const id = `project-bankcomm-${uuid.v4()}`;
    projectInfo.id = id;

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'create_project_json',
      cc_args: [
        JSON.stringify(projectInfo)
      ]
    };
    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('create project done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err, id);
    });
  },
  /** 删除项目 */
  removeProject: (projectId, callback) => {
    enroll.checkEnroll(callback);

    console.log('---------------------------------------');
    logger.info('Now we remove a project');
    console.log('---------------------------------------');

    const opts = {
      ...basic.getBasicFabricOpt(),
      cc_function: 'remove_project',
      cc_args: [
        projectId
      ]
    };

    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('remove a project done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  },
  /** 修改项目信息 */
  modifyProjectInfo: (projectInfo, callback) => {
    enroll.checkEnroll(callback);

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
      ...basic.getBasicFabricOpt(),
      cc_function: 'modify_project',
      cc_args: modifyArgs
    };

    fcw.invoke_chaincode(enroll.getEnrollInfo(), opts, (err, resp) => {
      console.log('---------------------------------------');
      logger.info('modify a workflow def done. Errors:', (!err) ? 'nope' : err);
      console.log('---------------------------------------');
      callback(err);
    });
  }
}
