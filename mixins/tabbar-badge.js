import {mapGetters} from 'vuex'

//导出一个mixin对象
export default {
  computed:{
    ...mapGetters('m_cart',['total'])
  },
  methods:{
    setBadge() {
      uni.setTabBarBadge({
        index: 2,
        text:this.total +'', //注意text的值必须是字符串，不能是数字
      })
    },
  },
  onShow() {
    // 在页面刚显示出来的时候，为tabBar设置数组徽标
    this.setBadge()
  },
  watch:{
    'total':{
      handler(newVal,oldVal) {
        if(+newVal !== +oldVal) {
          this.setBadge();
        }
      },
      //immediate属性用来生命侦听器，是否在页面初次加载完毕后就立即调用
      immediate:true,
    }
  },
}