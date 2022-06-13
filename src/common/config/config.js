export default {
	slideBar: {
		list: [{
				name: "工作台",
				icons: "el-icon-monitor",
				menuActive:'1',
				submenu: [{
					icon: 'el-icon-house',
					name: '主页',
					pathname: 'home',
				}]
			},
			{
				name: "系统设置",
				icons: "el-icon-setting",
				menuActive:'2',
				submenu: [{
						icon: 'el-icon-user-solid',
						name: '管理员列表',
						pathname: 'admin',

					},
					{
						icon: 'el-icon-user',
						name: '角色管理',
						pathname: 'role',
					},
					{
						icon: 'el-icon-menu',
						name: '菜单管理',
						pathname: 'menu',
					},
					{
						icon: 'el-icon-s-operation',
						name: 'SQL监控',
						pathname: 'monitoring',
					},
					{
						icon: 'el-icon-time',
						name: '定时任务',
						pathname: 'time',
					},
					{
						icon: 'el-icon-tickets',
						name: '参数管理',
						pathname: 'param',
					},
					{
						icon: 'el-icon-notebook-2',
						name: '系统日志',
						pathname: 'systemLg',
					},
					{
						icon: 'el-icon-upload',
						name: '文件上传',
						pathname: 'upload'
					}
				]
			},
			{
				name: "功能示例",
				icons: "el-icon-more-outline",
				menuActive:'3',
				submenu: [
					{
						icon: 'el-icon-collection-tag',
						name: 'ECharts',
						pathname: 'echarts',
					},
					{
						icon: 'el-icon-data-board',
						name: 'Ueditor',
						pathname: 'ueditor',
					}
				]
			},
			{
				name: "权限管理",
				icons: "el-icon-lock",
				menuActive:'4',
				submenu: [{
						icon: 'el-icon-s-custom',
						name: '用户管理',
						pathname: 'user',
					},
					{
						icon: 'el-icon-postcard',
						name: '岗位管理',
						pathname: 'post',
					},
					{
						icon: 'el-icon-bank-card',
						name: '部门管理',
						pathname: 'department',
					},
					{
						icon: 'el-icon-reading',
						name: '字典管理',
						pathname: 'dict',
					}
				]
			},
			{
				name: "开发者工具",
				icons: "el-icon-s-opportunity",
				menuActive:'5',
				submenu: [{
						icon: 'el-icon-collection-tag',
						name: '代码生成工具',
						pathname: 'code_create_tool',
					},
					{
						icon: 'el-icon-edit-outline',
						name: '页面表单设计',
						pathname: 'form_design',
					},
					{
						icon: 'el-icon-s-platform',
						name: '大屏设计',
						pathname: 'screen',
					},
					{
						icon: 'el-icon-setting',
						name: '配置信息',
						pathname: 'configuration',
					}
				]
			},
			{
				name: "支付管理",
				icons: "el-icon-chat-dot-round",
				menuActive:'6',
				submenu: [{
						icon: 'el-icon-s-grid',
						name: '订单管理',
						pathname: 'order',
					},
					{
						icon: 'el-icon-document-checked',
						name: '支付宝回调日志',
						pathname: 'log',
					}
				]
			},
			{
				name: "流程管理",
				icons: "el-icon-set-up",
				menuActive:'7',
				submenu: [{
						icon: 'el-icon-s-management',
						name: '流程管理',
						pathname: 'flow',
					},
					{
						icon: 'el-icon-s-grid',
						name: '模型管理',
						pathname: 'model',
					},
					{
						icon: 'el-icon-video-play',
						name: '运行中的流程',
						pathname: 'run',
					}
				]
			},
			{
				name: "办公管理",
				icons: "el-icon-user-solid",
				menuActive:'8',
				submenu: [{
						icon: 'el-icon-thumb',
						name: '发起流程',
						pathname: 'sponsor',
					},
					{
						icon: 'el-icon-stopwatch',
						name: '待办任务',
						pathname: 'wait',
					},
					{
						icon: 'el-icon-finished',
						name: '已办任务',
						pathname: 'finished',
					},
					{
						icon: 'el-icon-edit-outline',
						name: '我发起的',
						pathname: 'self_initiated',
					}
				]
			},
			{
				name: "系统监控",
				icons: "el-icon-s-platform",
				menuActive:'9',
				submenu: [{
						icon: 'el-icon-user',
						name: '在线用户',
						pathname: 'outline_user',
					},
					{
						icon: 'el-icon-document',
						name: '接口文档',
						pathname: 'document',
					},
					{
						icon: 'el-icon-location-information',
						name: '行政区域',
						pathname: 'location'
					}
				]
			},
			{
				name: "日志管理",
				icons: "el-icon-document-copy",
				menuActive:'10',
				submenu: [{
						icon: 'el-icon-mobile',
						name: '登录日志',
						pathname: 'login_log',
					},
					{
						icon: 'el-icon-notebook-2',
						name: '操作日志',
						pathname: 'handle_log',
					},
					{
						icon: 'el-icon-warning-outline',
						name: '异常日志',
						pathname: 'unusual',
					}
				]
			},
			{
				name: "站内通知",
				icons: "el-icon-message-solid",
				menuActive:'11',
				submenu: [{
						icon: 'el-icon-mobile',
						name: '我的通知',
						pathname: 'my_notice',
					},
					{
						icon: 'el-icon-message-solid',
						name: '通知管理',
						pathname: 'notice',
					}
				]
			}
		]
	}
}
