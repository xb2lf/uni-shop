export default {
  //为当前模块开启命名空间
  namespaced:true,
  //模块的state数据
  state: () => ({
    address:JSON.parse(uni.getStorageSync('address') || '{}'),
  }),
  // 模块的mutations方法
  mutations:{
    updateAddress(state,address) {
      state.address = address
      this.commit('m_user/saveAddressToStorage')
    },
    saveAddressToStorage(state) {
      uni.setStorageSync('address',JSON.stringify(state.address))
    },
  },
  //模块的getters属性
  getters:{
    addstr(state) {
      if(!state.address.provinceName) return ''
      const {provinceName,cityName,countyName,detailInfo} = state.address;
      return provinceName + cityName + countyName + detailInfo
    }
  },
  //模块的actions方法
  actions: {},
}
