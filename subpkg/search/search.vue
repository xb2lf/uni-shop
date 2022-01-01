<template>
  <view>
     <!-- 搜索栏-->
   <view class="search-box">
      <uni-search-bar @input="input" radius="100" cancelButton="none" :focus="true"></uni-search-bar>
   </view>
   <!-- 搜索建议列表-->
   <view class="sugg-list" v-if="searchResults.length !== 0">
     <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="goToDetail(item)">
       <view class="goods-name">{{item.goods_name}}</view>
       <uni-icons type="arrowright" size="16"></uni-icons>
     </view>
   </view>
   <!-- 搜索历史区域-->
   <view class="history-box" v-else>
     <view class="history-title">
       <text>搜索历史</text>
       <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
     </view>
     <view class="history-list">
       <uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="goToGoodsList(item)"></uni-tag>
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
        historyList:[],
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
        this.saveSearchHistory()
      },
      goToDetail(item) {
        uni.navigateTo({
          url:`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
        })
      },
      saveSearchHistory() {
        /* this.historyList.push(this.keyWord) */
        const set = new Set(this.historyList);
        set.delete(this.keyWord);
        set.add(this.keyWord);
        this.historyList = Array.from(set);
        uni.setStorageSync('kw',JSON.stringify(this.historyList))
      },
      cleanHistory() {
        this.historyList = [];
        uni.setStorageSync('kw','[]')
      },
      goToGoodsList(kw) {
        uni.navigateTo({
          url:`/subpkg/goods_list/goods_list?query=${kw}`
        })
      }
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    computed:{
      histories() {
        return [...this.historyList].reverse()
      }
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
.history-box {
  padding: 0 5px;
  .history-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
    margin-bottom: 5px;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      background-color: #f7f7f7;
      border-color: #f7f7f7;
      color: #333;
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
