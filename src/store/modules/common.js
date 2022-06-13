export default {
  namespaced: true,
  state: {
    // 侧边栏, 折叠状态
    sidebarFold: false,
  },
  mutations: {
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    }
  }
}
