Name	Code	Comment	Data Type	Length	Precision	Primary	Foreign Key	Mandatory
自增ID	id	自增ID	bigint(19)	19		TRUE	FALSE	TRUE
运单编码	code	记录编码	varchar(100)	100		FALSE	FALSE	TRUE
原始单号	originalDocumentNumber	必填。上游货主委托给无车承运人企业的运输单号（订单编号，例：31314534223）	varchar(35)	35		FALSE	FALSE	TRUE
托运单号	shippingNoteNumber	必填。本电子路单号，也是无车承运人企业委托给实际承运人的运输单号（运单编号，例：532135）	varchar(20)	20		FALSE	FALSE	TRUE
承运人	carrier	必填。无车承运人试点企业的名称，请不要填写实际承运司机或车队的名称（例：浙江 XX 物流有限公司）	varchar(512)	512		FALSE	FALSE	TRUE
统一社会信用代码	unifiedSocialCreditIdentifier	选填，无车承运人的统一社会信用代码（例：11991000010647510A）	varchar(18)	18		FALSE	FALSE	FALSE
许可证编号	permitNumber	选填，无车承运人的道路运输经营许可证（无车承运）编号，若暂未领取到无车承运牌照，请填写现有的道路运输经营许可证号（例：310112002939）	varchar(50)	50		FALSE	FALSE	FALSE
托运日期时间	consignmentDateTime	必填。无车承运人系统正式生成运单的日期时间，YYYYMMDDhhmmss（例：20170228111023）	varchar(14)	14		FALSE	FALSE	TRUE
业务类型代码	businessTypeCode	必填（1002996：干线普货运输，1003997：城市配送，1003998：农村配送，1002998：集装箱运输，1003999：其他）	varchar(7)	7		FALSE	FALSE	TRUE
发运实际日期	despatchActualDateTime	必填。货物装车后的发车时间YYYYMMDDhhmmss（例：20170228123011）	varchar(14)	14		FALSE	FALSE	TRUE
收货日期时间	goodsReceiptDateTime	必填。货物运到后的签收时间。如签收时间无法确定，填货物运到收货地的时间YYYYMMDDhhmmss（例：20170301123001）	varchar(14)	14		FALSE	FALSE	TRUE
发货人	consignor	选填。单位或个人，如集装箱运输业务无法明确实际发货人可填货代信息（例：浙江新华书店）	varchar(512)	512		FALSE	FALSE	FALSE
个人证件号	personalIdentityDocument	选填（例：330102198402124417）	varchar(35)	35		FALSE	FALSE	FALSE
装货地点	placeOfLoading	选填。实际装货的地点（例：浙江省杭州市江干区新福路 123 号）	varchar(256)	256		FALSE	FALSE	FALSE
发货地点国家行政区划代码	consignorCountrySubdivisionCode	必填。装货地点的国家行政区划代码，参照GB/T 2260《中华人民共和国行政区划代码》的代码，精确到区县。(例：330104）	varchar(12)	12		FALSE	FALSE	TRUE
收货人	consignee	选填。单位或个人（例：台州新华书店）	varchar(512)	512		FALSE	FALSE	FALSE
收货地点	goodsReceiptPlace	选填。具体的收货详细地址（浙江省台州市椒江区迎宾大道 12 号）	varchar(256)	256		FALSE	FALSE	FALSE
收货地点国家行政区划代码	consigneeCountrySubdivisionCode	必填。收货地点的国家行政区划代码，参照GB/T 2260《中华人民共和国行政区划代码》的代码，精确到区县。（例：331002）	varchar(12)	12		FALSE	FALSE	TRUE
货币总金额	totalMonetaryAmount	必填。上游货主在货物签收后实际支付给无车承运人企业的运输费用。货币单位为人民币，保留 3 位小数，如整数的话，以.000 填充。如是一笔业务分几辆车运，需将托运人针对这笔业务付给无车承运人企业的运输费用分摊到每辆车上。（例：430.012）	decimal(18,3)	18	3	FALSE	FALSE	TRUE
上报运单备注	reportRemark	备注	varchar(256)	256		FALSE	FALSE	FALSE
牌照类型代码	licensePlateTypeCode	必填。（01：大型汽车号牌，02：小型汽车号牌，99：其他号牌）（例：01）	varchar(20)	20		FALSE	FALSE	TRUE
车辆牌照号	vehicleNumber	必填。（例：浙A32153）	varchar(35)	35		FALSE	FALSE	TRUE
车辆分类代码	vehicleClassificationCode	必填。（H01：普通货车，H02：厢式货车，H04：罐式货车，Q00：牵引车，G01：普通挂车，G03：罐式挂车，G05：集装箱挂车，H09：仓栅式货车，H03：封闭货车，H05：平板货车，H06：集装箱车，H07：自卸货车，H08：特殊结构货车，Z00：专项作业车，G02：厢式挂车，G07：仓栅式挂车，G04：平板挂车，G06：自卸挂车，G09：专项作业挂车，X91：车辆运输车，X92：车辆运输车(单排)）（例：H01）	varchar(12)	12		FALSE	FALSE	TRUE
车辆载质量	vehicleTonnage	必填。单位：吨，保留两位小数，如整数的话，以.00 填充。小数点不计入总长。若是牵引车，请填准牵引总质量（例：20.00）	decimal(9,2)	9	2	FALSE	FALSE	TRUE
道路运输证号	roadTransportCertificateNumber	必填。填车辆的道路运输证证件编号，证件号中的中文无需填写（例：330111003790）	varchar(15)	15		FALSE	FALSE	TRUE
挂车牌照号	trailerVehiclePlateNumber	选填。（例：浙RR527挂）	varchar(35)	35		FALSE	FALSE	FALSE
所有人	owner	选填。车辆所有人（或企业）的名称或姓名（例：温州市天地货运有限公司）	varchar(256)	256		FALSE	FALSE	FALSE
车辆所属业户的道路运输经营许可证编号	vehiclePermitNumber	选填。车辆所属业户的道路运输经营许可证编号（例：330301000307）	varchar(50)	50		FALSE	FALSE	FALSE
驾驶员姓名	nameOfPerson	选填。驾驶员姓名，如运输过程中有多个驾驶员，名称拼接（例：张三,李四）	varchar(300)	300		FALSE	FALSE	FALSE
从业资格证号	qualificationCertificateNumber	选填。驾驶员从业资格证号，如运输过程中有多个驾驶员，证号拼接（例：431224198708273098,431224198708273099）	varchar(190)	190		FALSE	FALSE	FALSE
电话号码	telephonNumber	选填。如运输过程中有多个驾驶员，电话号码拼接（例：15167338765,15167338766）	varchar(200)	200		FALSE	FALSE	FALSE
货物名称	descriptionOfGoods	必填。填货物大类即可，无需精确到某具体型号款式（例：教科书）	varchar(512)	512		FALSE	FALSE	TRUE
货物类型分类代码	cargoTypeClassificationCode	必填。（90：电子产品，92：商品汽车，93：冷藏货物，94：大宗货物，95：快速消费品，96：农产品，999：其他）（例：999）	varchar(3)	3		FALSE	FALSE	TRUE
货物项毛重	goodsItemGrossWeight	必填。重量单位以 KGM千克填写数值，保留 3位小数，如整数的话，以.000 填充。小数点不计入总长。请填写签收后确认的货物重量，不计算车重。如是轻泡货等货物，请估算重量。如是一笔业务分几辆车运，需报送每辆车实际运输的货物重量。（例：151.333）	decimal(14,3)	14	3	FALSE	FALSE	TRUE
体积	cube	选填。体积单位以 DMQ立方米填写数值，保留4 位小数，如整数的话，以.0000 填充。小数点不计入总长。如是轻泡货等货物，此项必填。（例：11.3333）	decimal(9,4)	9	4	FALSE	FALSE	FALSE
总件数	totalNumberOfPackages	选填。（例：12）	varchar(8)	8		FALSE	FALSE	FALSE
自由文本	freeText	选填。	text			FALSE	FALSE	FALSE
车辆校验状态	truckValidateStatus	（undo：未校验，success：校验成功，failed：校验失败）	varchar(100)	100		FALSE	FALSE	FALSE
车辆校验时间	truckValidateTime		datetime			FALSE	FALSE	FALSE
上报状态	reportStatus	（undo：未上报，reported：已上报）	varchar(100)	100		FALSE	FALSE	FALSE
上报人用户编码	reportUserCode	上报人用户编码	varchar(100)	100		FALSE	FALSE	FALSE
上报人姓名	reportUserFullName	上报人姓名	varchar(50)	50		FALSE	FALSE	FALSE
上报时间	reportTime	上报时间	datetime			FALSE	FALSE	FALSE
描述	description	描述	varchar(200)	200		FALSE	FALSE	FALSE
备注	remark	备注	varchar(200)	200		FALSE	FALSE	FALSE
是否禁用	disabled	是否禁用	tinyint(1)	1		FALSE	FALSE	TRUE
是否删除	deleted	是否删除	tinyint(1)	1		FALSE	FALSE	TRUE
操作模块编码	moduleCode	操作模块编码	varchar(50)	50		FALSE	FALSE	TRUE
创建人编码	creatorUserCode	创建人编码	varchar(100)	100		FALSE	FALSE	TRUE
创建人用户名	creatorUsername	创建人用户名	varchar(40)	40		FALSE	FALSE	TRUE
创建时间	createTime	创建时间	datetime			FALSE	FALSE	TRUE
更新人ID	updateUserCode	更新人编码	varchar(100)	100		FALSE	FALSE	TRUE
更新人用户名	updateUsername	更新人用户名	varchar(50)	50		FALSE	FALSE	TRUE
更新时间	updateTime	更新时间	datetime			FALSE	FALSE	TRUE
操作者IP	ip	操作者IP	varchar(30)	30		FALSE	FALSE	TRUE
操作者所处经度	operatorLongitude	操作者所处经度	double			FALSE	FALSE	FALSE
操作者所处纬度	operatorLatitude	操作者所处纬度	double			FALSE	FALSE	FALSE
所属用户编码	ownerUserCode	所属用户编码	varchar(100)	100		FALSE	FALSE	TRUE
所属公司编码	ownerOrgCode	所属公司编码	varchar(100)	100		FALSE	FALSE	TRUE
所属公司名字	ownerOrgName	所属公司名字	varchar(100)	100		FALSE	FALSE	TRUE
同步串号	synchronousId	同步串号	varchar(200)	200		FALSE	FALSE	TRUE
