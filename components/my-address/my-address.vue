<template>
  <view class="address-container">
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收件人：<text>{{address.userName}}</text></view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：<text>{{address.telNumber}}</text></view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <vew class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addstr}}</view>
      </vew>
    </view>
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import {mapState,mapMutations,mapGetters} from 'vuex'
  export default {
    name: "my-address",
    data() {
      return {
      };
    },
    methods:{
      ...mapMutations('m_user',['updateAddress']),
      // 选择收货地址
      async chooseAddress() {
        // 调用小程序提供的 chooseAddress()方法，即可使用选择收货地址的功能，
        // 返回值是一个数组，第1项为错误对象，第2项为成功之后的收货地址对象
        const [err,succ] = await uni.chooseAddress().catch(err => err)
        if(err === null && succ.errMsg === 'chooseAddress:ok') {
          this.updateAddress(succ)
        }
        if(err && (err.errMsg === "chooseAddress:fail auth deny" || err.errMsg === 'hooseAddress:fail authorize no response')) {
          this.reAuth(); //调用this.reAuth()方法，向用户重新发起收取申请
        }
      },
      //调用此方法，重新发起收货地址的授权
      async reAuth() {
        // 提示用户对地址进行授权
        const [err2,confirmResult] = await uni.showModal({
          content:'检测到您没打开地址权限，是否去设置打开？',
          confirmText:'确认',
          cancelText:'取消'
        });
        //如果弹窗异常，则直接退出
        if(err2) return
        //如果用户点击了'取消'按钮，则提示用户'您取消了地址授权！'
        if(confirmResult.cancel) return uni.$showMsg('您取消了地址授权！')
        // 如果用户点了'确认'按钮，则调用uni.openSetting()方法进入授权页面，让用户重新进行授权
        if(confirmResult.confirm) return uni.openSetting({
          success: (settingResult) => {
            // 地址授权的值为true，提示用户授权成功
            if(settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功，请选择收货地址',1500,'success')
            // 地址授权的值为false，提示用户'您取消了地址授权''
            if(!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
          }
        })
      },
    },
    computed:{
      ...mapState('m_user',['address']),
      ...mapGetters('m_user',['addstr'])
    },
  }
</script>

<style lang="scss">
  .address-choose-box {
    height: 90px;
    display: flex;
    justify-content: center;
    align-items: center;

    .btnChooseAddress {}
  }
  .address-info-box {
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 12px;
    padding: 0 5px;
    .row1 {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .row1-right {
        display: flex;
        justify-content: space-between;
      }
    }
    .row2 {
      display: flex;
      align-items: center;
      .row2-left {
        white-space: nowrap;
      }
    }
  }
  .address-border {
    display: block;
    width: 100%;
    height: 5px;
  }
</style>
