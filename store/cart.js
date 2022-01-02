export default {
  //为当前模块开启命名空间
  namespaced: true,
  //模块的state数据
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下6个属性
    // {goods_id,goods_name,goods_name,goods_count,goods_small_logo,goods_state}
    cart: JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),
  // 模块的mutations方法
  mutations: {
    addToCart(state, goods) {
      // 根据提交商品的Id，查询购物车中是否存在这件商品
      // 如果不存在，则findResult为undefined，否则为找到的商品信息对象 
      const findResult = state.cart.find(item => item.goods_id === goods.goods_id)
      if (!findResult) {
        //如果购物车中没有这件商品，则直接push
        state.cart.push(goods)
      } else {
        // 如果购物车中有这件商品，则只更新数量即可
        findResult.goods_count++
      }
      this.commit('m_cart/saveToStorage')
    },
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(el => el.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage')
      }
    },
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(el => el.goods_id === goods.goods_id)
      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    removeGoodsById(state, goods_id) {
      state.cart = state.cart.filter(goods => goods.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage')
    },
    updateAllGoodsState(state, newState) {
      //循环更新购物车中每件商品的勾选状态
      state.cart.forEach(el => el.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    },
    //结算完成后，未勾选商品的总数量
    unCheckedGoods(state) {
      state.cart = state.cart.filter(el => !el.goods_state)
      this.commit('m_cart/saveToStorage')
    },
  },
  //模块的getters属性
  getters: {
    //统计购物车中商品的数量，累加到变量count中
    total(state) {
      /* let count = 0;
       state.cart.forEach(goods => count += goods.goods_count)
       return count */
      return state.cart.reduce((count, goods) => count += goods.goods_count, 0)
    },
    //勾选商品的总数量
    checkedCount(state) {
      /**
       * 先使用filter方法，从购物车中过滤已勾选的商品
       * 再使用reduce方法，将已勾选的商品总数量进行累加，
       * reduce()的返回值就是已勾选的商品的总数量
       */
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    //勾选商品的总金额
    checkedGoodsAmount(state) {
      /**
       *  先使用filter方法，从购物车中过滤已勾选的商品
       * 再使用reduce方法，将已勾选商品的商品数量 * 单价后，进行累加
       * reduce()的返回值就是已勾选商品的总价
       * 最后调用toFixed(2)方法，保留两位小数
       */
      return state.cart.filter(goods => goods.goods_state).reduce((amount, el) => amount += el.goods_count * el
        .goods_price, 0).toFixed(2)
    },
  },
  //模块的actions方法
  actions: {},
}
