<template>
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <!-- 轮播图区域-->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
       <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域-->
    <view class="goods-info-box">
      <view class="price">￥{{goods_info.goods_price}}</view>
      <view class="goods-info-body">
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <view class="yf">快递：免运费</view>
    </view>
    <!-- 商品详细信息-->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <!-- 商品导航区域-->
    <view class="goods_nav">
      <uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        goods_info:{},
        //左侧按钮组的配置对象
        options:[{
          icon:'shop',
          text:'店铺'
        },{
          icon:'cart',
          text:'购物车',
          info:2
        }],
        //右侧按钮组的配置对象
        buttonGroup:[{
          text:'加入购物车',
          backgroundColor:'#FF0000',
          color:'#FFF'
        },{
          text:'立即购买',
          backgroundColor:'#FFa200',
          color:'#FFF'
        }],
      };
    },
    methods:{
      async getGoodsDetail(goods_id) {
        const {data: res} = await uni.$http.get(`/api/public/v1/goods/detail?goods_id=${goods_id}`)
        if(res.meta.status !== 200) return uni.$showMsg()
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,'<img style="display:block;"').replace(/webp/g,'jpg')
        this.goods_info = res.message
      },
      preview(i) {
        //调用uni.previewImage() 方法预览图片
        uni.previewImage({
          // 预览时，默认显示图片的索引
          current:i,
          // 所有图片url地址的数组
          urls:this.goods_info.pics.map(pic => pic.pics_big)
        })
      },
      onClick(e) {
        if(e.content.text === '购物车') {
          uni.switchTab({
            url:`/pages/cart/cart`
          })
        }
      }
    },
    onLoad(options) {
     const goods_id = options.goods_id
     this.getGoodsDetail(goods_id)
    }
  }
</script>

<style lang="scss">
  .goods-detail-container {
    swiper {
      height: 750rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .goods-info-box {
      padding: 10px;
      padding-right: 0;
      .price {
        color: #c00000;
        font-size: 18px;
        margin: 10px 0;
      }
      .goods-info-body {
        display: flex;
        justify-content: space-between;
        .goods-name {
          font-size: 13px;
          margin-right: 10px;
        }
        .favi {
          width: 120px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-left: 1px solid #EFEFEF;
          color: gray;
        }
      }
      .yf {
        font-size: 12px;
        color: gray;
        margin: 10px 0;
      }
    }
    .goods_nav {
      position: sticky;
      bottom: 0;
      left: 0;
      z-index: 999;
    }
  }

</style>
