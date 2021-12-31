<template>
  <view>
     <!-- 搜索栏-->
   <view class="search-box">
      <uni-search-bar @input="input" radius="100" cancelButton="none" :focus="true"></uni-search-bar>
   </view>
   <!-- 搜索建议列表-->
   <view class="sugg-list">
     <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="goToDetail(item)">
       <view class="goods-name">{{item.goods_name}}</view>
       <uni-icons type="arrowright" size="16"></uni-icons>
     </view>
   </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer:null,
        keyWord:'',
        searchResults:[],
      };
    },
    methods:{
      //针对输入进行防抖处理
      input(e) {
        //清除对应的定时器
        clearTimeout(this.timer);
        // 重启启动一个定时器，并把timerId赋值给this.timer
        this.timer = setTimeout(() =>{
          //如果是500毫秒以内，没有新的输入事件，则为搜索关键词赋值
          this.keyWord = e;
          this.getSearchResults();
        },500)
      },
    async getSearchResults() {
        //判断关键词是否为空
        if(this.keyWord === '') {
          this.searchResults = [];
          return 
        }
        const {data: res} = await uni.$http.get(`/api/public/v1/goods/qsearch?query=${this.keyWord}`);
        if(res.meta.status !== 200) return uni.$showMsg();
        this.searchResults = res.message
      },
      goToDetail(item) {
        uni.navigateTo({
          url:`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
        })
      },
    },
  }
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 5px;
  .sugg-item {
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .goods-name {
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      margin-right: 3px;
    }
  }
}
</style>
