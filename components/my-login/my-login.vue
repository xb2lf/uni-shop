<template>
  <view class="login-container">
   <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
   <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
   <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    methods:{
      ...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
      //用户授权之后，获取微信用户基本信息
      async getUserInfo() {
        const [err,res] = await uni.getUserProfile({desc:'获取您的昵称、头像、地区及性別'}).catch(err => err)
        if(err || res.errMsg !== 'getUserProfile:ok') return uni.$showMsg('获取用户信息失败')
       // 判断是否成功获取用户信息
        if(res.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('您取消了授权！')
        //获取用户信息成功
        this.updateUserInfo(res.userInfo)
        this.getToken(res)
      },
      async getToken(info) {
        const [err,res] = await uni.login().catch(err => err)
        if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
        //准备参数对象
        const query = {
          code: res.code,
          encryptedData:info.encryptedData,
          iv:info.iv,
          rawData:info.rawData,
          signature:info.signature
        }
        //换取token
        const {data: loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin',{...query})
       /* this.updateToken('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o') */
        if(loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        this.updateToken(loginResult.message.token);
        /**
         * 判断vuex中的redirectInfo是否为null
         * 如果不为null,则登录成功之后，需要重新导航到对应的页面 
         */
        this.navigateBack()
      },
      navigateBack() {
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url:this.redirectInfo.from,
          complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      },
    },
    computed:{
      ...mapState('m_user',['redirectInfo'])
    },
  }
</script>

<style lang="scss">
.login-container {
  height: 750rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #F8F8F8;
  position: relative;
  overflow: hidden;
  &::after {
    content: ' ';
    display:block;
    width: 100%;
    height: 40px;
    background-color: #FFFFFF;
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 100%;
    transform: translateY(50%);
  }
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #C00000;
  }
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>
