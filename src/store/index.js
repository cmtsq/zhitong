import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		common
	},
	state: {
		visitedView: [],//用户访问过的页面，默认第一个标签为首页
		checkIndex:''//选中的索引
	},
	mutations: {
		//用户访问过的页面
		addVisitedView(state, view) {
			if (state.visitedView.some(v => v.path === view.path)) return
			if(view.name!=='home'){
				state.visitedView.push(view)
			}
		},
		//关闭用户访问过的页面
		delVisitedView(state, view) {
			for (const [i, v] of state.visitedView.entries()) {
				if (v.path === view.path) {
					state.checkIndex = i
					state.visitedView.splice(i, 1)
					break;
				}
			}
		},
	}
})
