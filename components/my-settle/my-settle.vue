<template>
  <view class="my-settle-container">
    <label class="radio" @click="changeAllstate">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>
    <view class="amount-box">合计：<text class="amount">￥{{checkedGoodsAmount}}</text></view>
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import { mapGetters,mapMutations,mapState} from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
        seconds:3,
        timer:null,
      };
    },
    methods:{
      ...mapMutations('m_cart',['updateAllGoodsState','unCheckedGoods']),
      ...mapMutations('m_user',['updateRedirectInfo']),
      //label的点击回调函数，处理全选和反选
      changeAllstate() {
        /**
         * 修改购物车中所有商品的选中状态，
         * !this.isFullCheck表示，当前全选按钮的状态取反，就是最新的勾选状态 
         */
        this.updateAllGoodsState(!this.isFullCheck)
      },
      settlement() {
        //先判断是都勾选了结算的商品
        if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
        //然后判断用户是否已经选择了收货地址
        if(!this.addstr) return uni.$showMsg('请选择收货地址！')
        //最后判断用户是否登录
        /* if(!this.token) return uni.$showMsg('请先登录！') */
        if(!this.token) return this.delayNavigate()
        //实现微信支付功能
        this.payOrder();
      },
      showTips(n) {
        uni.showToast({
          icon:'none',
          title:`请先登录后再结算！${n}秒后自动跳转到登录页`,
          mask:true,
          duration:1500
        })
      },
      delayNavigate() {
        this.seconds = 3
        this.showTips(this.seconds)
        this.timer = setInterval(()=> {
          this.seconds --
          if(this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url:'/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  openType:'switchTab',
                  from:'pages/cart/cart'
                })
              }
            })
            return
          }
          this.showTips(this.seconds)
        },1000)
      },
      async payOrder() {
        const orderInfo = {
         order_price: this.checkedGoodsAmount,
          consignee_addr:this.addrstr,
          goods:this.cart.filter(x => x.goods_state).map(el =>({
            goods_id:el.goods_id,
            goods_number:el.goods_count,
            goods_price:el.goods_price
          })),
        }
        const {data: res} = await uni.$http.post('/api/public/v1/my/orders/create',{...orderInfo})
        if(res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        const orderNumber = res.message.order_number
        const {data:res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder',{order_number:orderNumber})
        if(res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
        const payInfo = res2.message.pay
        const [err,succ] = await uni.requestPayment({payInfo})
        if(err) return uni.$showMsg('订单未支付！')
        const {data:res3} = await uni.$http.post('/api/public/v1/my/orders/chkOrder',{order_number:orderNumber})
        if(res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        uni.$showMsg('支付完成！',1500,'success')
        this.unCheckedGoods()
      },
    },
    computed:{
      ...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
      ...mapGetters('m_user',['addstr']),
      ...mapState('m_user',['token']),
      ...mapState('m_cart',['cart']),
      //是否全选
      isFullCheck() {
        return this.total === this.checkedCount
      },
    }
  }
</script>

<style lang="scss">
.my-settle-container {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFFFFF;
  font-size: 14px;
  padding-left: 5px;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  .radio {
    display: flex;
    align-items: center;
  }
  .amount-box {
    .amount {
      color: #C00000;
      font-weight: bold;
    }
  }
  .btn-settle {
    min-width: 100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
    color: #FFFFFF;
    background-color: #C00000;
  }
}
</style>
