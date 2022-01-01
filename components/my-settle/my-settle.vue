<template>
  <view class="my-settle-container">
    <label class="radio" @click="changeAllstate">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>
    <view class="amount-box">合计：<text class="amount">￥{{checkedGoodsAmount}}</text></view>
    <view class="btn-settle">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import { mapGetters,mapMutations} from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
        
      };
    },
    methods:{
      ...mapMutations('m_cart',['updateAllGoodsState']),
      //label的点击回调函数，处理全选和反选
      changeAllstate() {
        /**
         * 修改购物车中所有商品的选中状态，
         * !this.isFullCheck表示，当前全选按钮的状态取反，就是最新的勾选状态 
         */
        this.updateAllGoodsState(!this.isFullCheck)
      },
    },
    computed:{
      ...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
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
