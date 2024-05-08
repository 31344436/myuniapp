
import pagesJson from '../pages.json'
import pagesJsonToRoutes from 'uni-parse-pages'
import {createRouter} from 'uni-mini-router'
import useAuthUserStore from '@/store/auth-user';
 
const staticRoutes = pagesJsonToRoutes(pagesJson);
const myRouter = createRouter({
  routes: [...staticRoutes] // 路由表信息
});

console.log("init routes!!");

myRouter.beforeEach((to, from, next) => {
  //console.log("beforeEach routes!!");
  next();

  return;
  
  const authStore = useAuthUserStore();
  if (!authStore.profile && to && to.name !== 'login') {
    // 如果没有登录信息且目标路由不是登录页面则跳转到登录页面
    next({ name: 'login', navType: 'replaceAll' });
  } else if (authStore.profile && to && to.name === 'login') {
    // 如果已经登录且目标页面是登录页面则跳转至首页
    next({ name: 'home', navType: 'replaceAll' });
  } else {
    next();
  }
});

myRouter.afterEach((to, from) => {
  //console.log("afterEach routes!!");
  return;

  const authStore = useAuthUserStore();
  if (!authStore.profile && to.name !== 'login') {
    // 如果没有登录信息且目标路由不是登录页面则跳转到登录页面
    myRouter.replaceAll({ name: 'login' })
  } else if (authStore.profile && to.name === 'login') {
    // 如果已经登录且目标页面是登录页面则跳转至首页
    myRouter.replaceAll({ name: 'home' })
  }
});

export default myRouter
