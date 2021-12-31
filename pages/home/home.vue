<template>
  <view>
    <!-- 轮播图区域-->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in swiperList" :key="i">
        <navigator class="swiper-item" :url="`/subpkg/goods_detail/goods_detail?good_id=${item.goods_id}`" :open-type="item.open_type">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区域-->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>
    <!-- 楼层区域-->
    <view class="floor-list">
      <view class="floot-item" v-for="(item,i) in floorList" :key="i">
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <view class="floor-img-box">
          <navigator class="left-img-box" :open-type="item.product_list[0].open_type" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width:`${item.product_list[0].image_width}rpx`}" mode="widthFix"></image>
          </navigator>
          <view class="right-img-box">
            <navigator class="right-img-item" v-for="(el,index) in item.product_list" :key="index" v-if="index !== 0" :open-type="el.open_type" :url="el.url">
              <image :src="el.image_src" mode="widthFix" :style="{width:`${el.image_width}rpx`}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        swiperList: [],
        navList:[],
        floorList:[],
      };
    },
    methods: {
      async getSwiperList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/home/swiperdata')
        if (res.meta.status !== 200) return uni.$showMsg()
        uni.$showMsg("数据请求成功",1500,"success")
        this.swiperList = res.message
      },
      async getNavList() {
        const {data: res} = await uni.$http.get('/api/public/v1/home/catitems')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      navClickHandler(item) {
        //判断点击的是哪个nav
        if(item.name === '分类') {
          uni.switchTab({
            url:'/pages/cate/cate'
          })
        }
      },
      async getFloorList() {
        const {data:res} = await uni.$http.get('/api/public/v1/home/floordata')
        if (res.meta.status !== 200) return uni.$showMsg()
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      
    },
    onLoad() {
      this.getSwiperList();
      this.getNavList();
      this.getFloorList();
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 300rpx;
  .swiper-item,
    image {
      width: 100%;
      height: 100%;
    }
  }
  .nav-list {
    display: flex;
    justify-content: space-around;
    margin: 15rpx 0;
    .nav-img {
      width: 128rpx;
      height: 140rpx;
    }
    }
  .floor-title {
    width: 100%;
    height: 60rpx;
    display: flex;
  }
  .floor-img-box {
    display: flex;
    padding-left: 10rpx;
    .right-img-box {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
</style>
