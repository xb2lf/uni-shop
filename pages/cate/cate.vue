<template>
  <view>
    <my-search @click="goSearch"></my-search>
    <view class="scroll-view-container">
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height:`${wh}px`}">
        <block v-for="(item,i) in cateList" :key="i">
          <view :class="['left-srcoll-view-item',i === active ? 'active' :'']" @click="activeChanged(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <scroll-view class="right-scroll-view" scroll-y="true" :scroll-top="scrollTop" :style="{height:`${wh}px`}">
        <view class="right-scroll-view-item" v-for="(el,index) in cateLevel2" :key="index">
          <view class="right-scroll-item-title">/{{el.cat_name}}/</view>
          <view class="cate-lv3-list">
            <view class="cate-lv3-item" v-for="(cate,index2) in el.children" :key="index2" @click="goToGoodsList(cate)">
              <image :src="cate.cat_icon"></image>
              <text>{{cate.cat_name}}</text>
            </view> 
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //当前设备可用高度
        wh: 0,
        cateList:[],
        active:0,
        cateLevel2:[],
        scrollTop:0,
      };
    },
    methods:{
      async getCateList() {
        const {data:res} = await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        this.cateLevel2 = res.message[0].children
      },
      activeChanged(i) {
        this.active = i;
        this.cateLevel2 = this.cateList[i].children
        this.scrollTop = this.scrollTop === 0 ? 1: 0
        //可简化为
       /* this.scrollTop = this.scrollTop ? 0 : 1 */
      }, 
      goToGoodsList(item) {
        uni.navigateTo({
          url:`/subpkg/goods_list/goods_list?cid=${item.cat_id}`
        })
      },
      goSearch() {
        uni.navigateTo({
          url:'/subpkg/search/search'
        })
      },
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync();
      this.wh = sysInfo.windowHeight  - 50;
      this.getCateList();
    },
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;
      .left-srcoll-view-item {
        background-color: #F7F7F7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;
        &.active {
          background-color:#FFFFFF;
          position: relative;
          &::before{
            content: ' ';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #C00000;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  .right-scroll-item-title {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
  }
  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;
    .cate-lv3-item {
      width: 33.33%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      image {
        width: 60px;
        height: 60px;
      }
      text {
        font-size: 12px;
      }
    }
  }
</style>
