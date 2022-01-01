<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <my-address></my-address>
   <view class="cart-title">
     <uni-icons type="shop" size="18"></uni-icons>
     <text class="cart-title-text">购物车</text>
   </view>
   <uni-swipe-action>
     <block v-for="(goods,i) in cart" :key="i">
       <uni-swipe-action-item :right-options="options" :autoClose="true" @click="swipeActionClickHandler(goods)">
         <my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler" @num-change="numberChangeHandler"></my-goods>
       </uni-swipe-action-item>
     </block>
   </uni-swipe-action>
   <my-settle></my-settle>
  </view>
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也~</text>
  </view>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    //将badgeMix载入到当前的页面中使用
    mixins:[badgeMix],
    data() {
      return {
        options:[{
          text:'删除',  //显示的文本内容
          style:{
            backgroundColor:'#C00000', //按钮的背景颜色
          }
        }],
      };
    },
    methods:{
      ...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
      radioChangeHandler(e) {
        this.updateGoodsState(e);
      },
      numberChangeHandler(e) {
        this.updateGoodsCount(e);
      },
      swipeActionClickHandler(goods) {
        this.removeGoodsById(goods.goods_id)
      },
    },
    computed:{
      ...mapState('m_cart',['cart'])
    },
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
    .cart-title {
      height: 40px;
      display: flex;
      align-items: center;
      font-size: 14px;
      padding-left: 5px;
      border-bottom: 1px solid #efefef;
      .cart-title-text {
        margin-left: 10px;
      }
    }
  }
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
    .empty-img {
      width: 90px;
      height: 90px;
      margin-bottom: 15px;
    }
    .tip-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
