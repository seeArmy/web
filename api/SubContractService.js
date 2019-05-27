
import * as HTTP from './httpUtil';
var ApiConst= require('./ApiConst');
const apiDomain = ApiConst.apiLogisticsDomain;


function getListColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/subContract/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

function getListEditColumn(callback) {
  var success = require(`./fieldMetadata/${ApiConst.fieldMetadataDir}/logistics/subContract/card/list_render_info.json`)
 success = JSON.parse(JSON.stringify(success));
    callback(success);
}

function getManifestList(paramsObj, callback) {
	const data = {
		'code': 200,
		'content': [
			{
				'code': '111',
				'goodsName': '煤炭',
				'goodsCategory': '原料',
				'goodsNum': '8000',
				'goodsNumUnitCode': 'item',
				'tobeAssignedGoodsNumUnitCode': 'item',
				'goodsWeight': '6000',
				'goodsWeightUnitCode': 'ton',
				'tobeAssignedGoodsWeightUnitCode': 'ton',
				'goodsVolume': '4000',
				'goodsVolumeUnitCode': 'cube',
				'tobeAssignedGoodsVolumeUnitCode': 'cube',
				'description': '山西的煤炭原材料，质量保障。'
			},
			{
				'code': '222',
				'goodsName': '沙子',
				'goodsCategory': '原料',
				'goodsNum': '666',
				'goodsNumUnitCode': 'item',
				'tobeAssignedGoodsNumUnitCode': 'item',
				'goodsWeight': '444',
				'goodsWeightUnitCode': 'ton',
				'tobeAssignedGoodsWeightUnitCode': 'ton',
				'goodsVolume': '333',
				'goodsVolumeUnitCode': 'cube',
				'tobeAssignedGoodsVolumeUnitCode': 'cube',
				'description': '海南的西沙群岛的沙子，沙子细腻柔软。'
			},
			{
				'code': '333',
				'goodsName': '石灰',
				'goodsCategory': '原料',
				'goodsNum': '666',
				'goodsNumUnitCode': 'item',
				'tobeAssignedGoodsNumUnitCode': 'item',
				'goodsWeight': '444',
				'goodsWeightUnitCode': 'ton',
				'tobeAssignedGoodsWeightUnitCode': 'ton',
				'goodsVolume': '333',
				'goodsVolumeUnitCode': 'cube',
				'tobeAssignedGoodsVolumeUnitCode': 'cube',
				'description': '河北邯郸的生石灰，质量上乘。'
			},
			{
				'code': '444',
				'goodsName': '水泥',
				'goodsCategory': '原料',
				'goodsNum': '666',
				'goodsNumUnitCode': 'item',
				'tobeAssignedGoodsNumUnitCode': 'item',
				'goodsWeight': '444',
				'goodsWeightUnitCode': 'ton',
				'tobeAssignedGoodsWeightUnitCode': 'ton',
				'goodsVolume': '333',
				'goodsVolumeUnitCode': 'cube',
				'tobeAssignedGoodsVolumeUnitCode': 'cube',
				'description': '安徽合肥的水泥，钢筋混泥土的绝佳伴侣。'
			}
		]
	};
	callback(data);
}

export { getListColumn, getListEditColumn, getManifestList };
