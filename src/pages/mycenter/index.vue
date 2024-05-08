<template>
  <wd-toast></wd-toast>
	<view class="center">
		
		<view class="center-list">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
	  	<image class="logo-img" :src="authUserStore.profile.avatarUrl != '' ? 
					authUserStore.profile.avatarUrl :avatarDefaultUrl"></image>
			</button> 
		</view>

		<view class="center-list">
			<input type="nickname" class="weui-input" @input="onNickeName"  placeholder="请输入昵称"/>
		</view>

		<view class="center-list">
			<button open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">使用微信手机号</button>
	  	
			<!--
			<input class="weui-input"  @input="ontelephone" placeholder="请输入手机号码"/>
			-->

		  <input  class="weui-input" v-model="authUserStore.profile.telephone" 
																								type="text" placeholder="请输入手机号码" />
  
		</view>

		<!-- <view class="logo" @click="goLogin" :hover-class="!login ? 'logo-hover' : ''">
			
			<image class="logo-img" :src="login ? authUserStore.profile.avatarUrl :avatarDefaultUrl"></image>
			<view class="logo-title">
				<text class="uer-name">Hi，{{login ? authUserStore.profile.nickName : '您未登录'}}</text>
				<text class="go-login navigat-arrow" v-if="!login">&#xe65e;</text>
			</view>
		</view> -->


		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe60f;</text>
				<text class="list-text">帐号管理</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view> 
		</view>
	</view>
</template>

<script lang="ts" setup>

import { useToast } from 'wot-design-uni/components/wd-toast';
import useAuthUserStore from '@/store/auth-user';
import {useRouter} from 'uni-mini-router';
import { onLoad } from '@dcloudio/uni-app';
import { ref , reactive , computed } from "vue"; 

const toast = useToast();
const authUserStore = useAuthUserStore();
const myRouter = useRouter(); 

//myRouter.replaceAll({ name: 'home' });
 
let login = ref(false) ;
let avatarDefaultUrl = ref("../../static/logo.png");

function onChooseAvatar(event:any) {
    
	 authUserStore.setAvatar(event.detail.avatarUrl);
   console.log("setAvatar :" + JSON.stringify(event));
 
}

async function onGetPhoneNumber(event:any) {

	console.log("onGetPhoneNumber :" + JSON.stringify(event));

	if (event.detail.errMsg == "getPhoneNumber:ok"){
		let res :string | undefined = await authUserStore.getTelephone(
																event.detail.code , authUserStore.profile.openid!);

		console.log("User telephone :" + res); 	
	}
}

function ontelephone(event:any) {
	//authUserStore.setNickname(event.target.value);
	console.log("setTelephone :" + JSON.stringify(event));
}

function onNickeName(event:any) {
	authUserStore.setNickname(event.target.value);
	console.log("setNickename :" + JSON.stringify(event));
}

onLoad(goLogin) ;

async function goLogin() {
  console.log('Page loaded');
  
  let res :boolean = true;

  res = await authUserStore.autoLogin();
  
  if (res) {
   
    // uni.getUserProfile({
    //   desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   success: (res) => {

    //     authUserStore.setProfile(res.userInfo);

    //     console.log('getUserProfile:' + JSON.stringify(res.userInfo));
        
    //     login.value = true;
       
    //   }
    // })


   
  }
  else
  {
    console.log("login error");
    console.log("获取信息不成功！");
    toast.success("获取信息不成功！");
  }
  toast.close(); 

};

 


</script>

<style lang="scss" scoped>
  .myBtn {
    padding: 10px auto;
    background: #f9bd26;
    color: #323333;
    border: 1px solid #323333;
    font-size: 20px;
  }
 
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}

	page,
	view {
		display: flex;
	}

	page {
		background-color: #f8f8f8;
	}

	.center {
		flex-direction: column;
	}

	.logo {
		width: 750upx;
		height: 240upx;
		padding: 20upx;
		box-sizing: border-box;
		background-color: #4cd964;
		flex-direction: row;
		align-items: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.logo-title {
		height: 150upx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20upx;
	}

	.uer-name {
		height: 60upx;
		line-height: 60upx;
		font-size: 38upx;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}

	.login-title {
		height: 150upx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20upx;
	}

	.weui-input {
		text-align:center ;
	}

	.center-list {
		background-color: #FFFFFF;
		margin-top: 20upx;
		width: 750upx;
		flex-direction: column;
	}

	.center-list-item {
		height: 90upx;
		width: 750upx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0upx 20upx;
	}

	.border-bottom {
		border-bottom-width: 1upx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #4cd964;
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}

	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90upx;
		width: 40upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
</style>