import Vue from 'vue'
import Vuex from 'vuex'
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'
// 将Vuex安装为Vue的插件
Vue.use(Vuex)

// 创建store的实例对象
const store = new Vuex.Store({
  // TODO: 挂载 store模块
  modules:{
    // 挂载购物车的vuex模块，模块内成员的访问路径被调整为m_cart,例如：
    // 购物车模块中的cart数组的访问路径是m_cart/cart
    m_cart:moduleCart,
    m_user:moduleUser,
  },
})

//向外共享Store的实例对象
export default store