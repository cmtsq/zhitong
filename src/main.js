import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import store from '@/store'
import router from './router.js'
import '@/assets/scss/index.scss'
import API from '@/API/httpRequest.js'
//引入全局配置文件
import $conf from './common/config/config.js'
Vue.prototype.$conf=$conf
Vue.config.productionTip = false
//全局挂载
Vue.prototype.$http = API

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
