<template>
  <wd-toast></wd-toast>
  <view class="mt-10vh text-center p-5">
    <image class="h-45vh mb-10vh" src="https://codemeteors.oss-cn-beijing.aliyuncs.com/quiz/login_bg.jpg" mode="aspectFit" />
    <button block :round="false" hairline class="myBtn" size="large" @click="doLogin">普通登录</button>

    <button block :round="false" hairline class="myBtn" size="large"
     open-type="getPhoneNumber" @getphonenumber="getPhone" >手机号登录</button>
  </view>
</template>

<script lang="ts" setup>
import { useToast } from 'wot-design-uni/components/wd-toast'
import useAuthUserStore from '@/store/auth-user';
import {useRouter} from 'uni-mini-router'

const toast = useToast();
const myRouter = useRouter(); 
const authUserStore = useAuthUserStore();


function getPhone(e:any)  {
  if (e.detail.errMsg == 'getPhoneNumber:fail user deny') //用户点击拒绝
  {
    toast.error("请绑定手机号");
    return;
  }  

  console.log(JSON.stringify(e));  // 动态令牌
    
  console.log(e.detail.code);  // 动态令牌
  console.log(e.detail.errno);  // 错误码（失败时返回）
  console.log(e.detail.encryptedData);
  console.log(e.detail.iv);
  console.log(e.detail.errMsg); // 回调信息（成功失败都会返回）
  
    return;
  }

// 登录接口
async function doLogin() {

  let res :boolean = true;

  res = await authUserStore.autoLogin();
  
  if (res) {
    toast.success('登录成功hahaahahahhah哈哈哈');
    console.log("登录成功");
    //myRouter.replaceAll({ name: 'home' })
  }
  else
  {
    console.log("login error");
  }
  toast.close(); 
}
</script>

<style lang="scss" scoped>
.myBtn {
  padding: 10px auto;
  background: #f9bd26;
  color: #323333;
  border: 1px solid #323333;
  font-size: 20px;
}
</style>