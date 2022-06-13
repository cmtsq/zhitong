import Vue from 'vue'
import Router from 'vue-router'
import routes from './common/config/router.js'
Vue.use(Router)

const router = new Router({
	mode: "history",
	routes
})

// 注册全局前置守卫
// 在访问路由之前进行拦截
router.beforeEach((to, from, next) => {
	// 获取 token, 登录的标识
	var token = localStorage.getItem("token");
	if (token) { // 判断是否已经登录过
		if(to.name==="login"){
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			next()
		}else{
			next()
		}
	} else {
		if (to.name === 'login') { // 如果有此资源且是登录页
			next();
		}else { // 有此资源，没有登陆过，也不是登录页
			next({name: 'login'})
		}
	}
})

export default router
