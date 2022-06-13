let routes = [{
		path: '/',
		name: 'layout',
		redirect: {
			name: 'home'
		},
		component: 'layout',
		children: [{
				meta: {
					title: '后台首页',
					keepAlive: false
				},
				component: 'index/home'
			},
			{
				meta: {
					title: '管理员列表',
					keepAlive: false
				},
				component: 'setting/admin',
			},
			{
				meta: {
					title: '角色管理',
					keepAlive: false
				},
				component: 'setting/role',
			},
			{
				meta: {
					title: '菜单管理',
					keepAlive: false
				},
				component: 'setting/menu',
			},
			{
				meta: {
					title: 'SQL监控',
					keepAlive: false
				},
				component: 'setting/monitoring',
			},
			{
				meta: {
					title: '定时任务',
					keepAlive: false
				},
				component: 'schedule/time',
			},
			{
				meta: {
					title: '参数管理',
					keepAlive: false
				},
				component: 'setting/param',
			},
			{
				meta: {
					title: '系统日志',
					keepAlive: false
				},
				component: 'setting/systemLg',
			},
			{
				meta: {
					title: 'Echarts',
					keepAlive: false
				},
				component: 'demo/echarts',
			},
			{
				meta: {
					title: 'Ueditor',
					keepAlive: false
				},
				component: 'demo/ueditor',
			},
		]
	},
	{
		meta: {
			title: '登录',
			keepAlive: false
		},
		component: 'index/login',
	},
	{
		path: '*',
		redirect: {
			name: 'home'
		}
	}
]

//获取路由信息方法
let getRoutes = function() {
	//自动生成路由
	createRoute(routes)
	return routes
}

//自动生成路由
function createRoute(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i].component) return
		//去除index
		let val = getValue(arr[i].component)
		//生成name
		arr[i].name = arr[i].name || val
		//生成path
		if (val === "home") {
			arr[i].path = arr[i].path || '/'
		} else {
			arr[i].path = arr[i].path || `/${val}`
		}
		//自动生成 component
		let componentFun = import(`../../views/${arr[i].component}.vue`)
		arr[i].component = () => componentFun
		if (arr[i].children && arr[i].children.length > 0) {
			createRoute(arr[i].children)
		}
	}
	// console.log(arr)
}
//去除index的方法
function getValue(str) {
	//str=login/index
	//获取到最后一个/索引
	let index = str.lastIndexOf('/')
	//获取到最后一个值
	let val = str.substring(index + 1, str.length)
	return val
}

export default getRoutes()
