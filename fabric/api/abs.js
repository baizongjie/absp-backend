const path = require('path');
const logger = require('../../logger').getLogger('abs_fabric_api');
const uuid =require('node-uuid')

// --- Set Details Here --- //
const config_file = 'marbles_local.json';					//set config file name
const chaincode_id = 'test_abs_ledger';						//set desired chaincode id to identify this chaincode
const chaincode_ver = 'v0.0.1';										//set desired chaincode version

const helper = require('../utils/helper')(config_file, logger);			//set the config file name here
const fcw = require('../utils/fc_wrangler')({ block_delay: helper.getBlockDelay() }, logger);

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
    if(!enrollFlag){
        log.error('The server has not enrolled yet...')
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
    queryAllProjects : callback => {
        checkEnroll(callback);

        console.log('---------------------------------------');
		logger.info('Now we query all projects');
		console.log('---------------------------------------');

		const opts = {
			...basicFabricOpt,
			cc_function: 'query_all_projects',
			cc_args: [
				"100",
				"0"
			]
		};
		fcw.query_chaincode(enrollInfo, opts, (err, resp) => {
			console.log('---------------------------------------');
			logger.info('query all projects done. Errors:', (!err) ? 'nope' : err);
			console.log('---------------------------------------');
			if (!err && resp!=null && resp.peer_payloads!=null){
                logger.info('response is:', resp.peer_payloads[0]);
                callback(null, resp.peer_payloads[0]);
				console.log('---------------------------------------');
			}else{
                callback(err);
            }
		});
    },
    /** 新增项目 */
    createProject: (projectInfo,callback) => {
        checkEnroll(callback);

        console.log('---------------------------------------');
		logger.info('Now we create a project');
		console.log('---------------------------------------');

        
        const id = `project-bankcomm-${uuid.v4()}`;
        const { projectName, scale, basicAssets, initiator, trustee, depositary, agent, assetService, assessor, creditRater, 
            liquiditySupporter, underwriters, lawyer, accountant } = projectInfo;

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
				underwriters,
				lawyer,
				accountant
			]
		};
		fcw.invoke_chaincode(enrollInfo, opts, function (err, resp) {
            console.log('---------------------------------------');
            logger.info('create project done. Errors:', (!err) ? 'nope' : err);
            console.log('---------------------------------------');
            callback(err);
        });
    },
    removeProject: (projectId,callback) => {
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

		fcw.invoke_chaincode(enrollInfo, opts, function (err, resp) {
			console.log('---------------------------------------');
			logger.info('remove a project done. Errors:', (!err) ? 'nope' : err);
            console.log('---------------------------------------');
            callback(err);
		});
    }
}