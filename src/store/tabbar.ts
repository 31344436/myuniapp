import { defineStore } from 'pinia'
import { computed, reactive } from 'vue';

export interface TabbarItem {
  name: string;
  value: number | null;
  active: boolean;
  titleCN: string;
  title: string;
  icon: string;
  iconActive: string;
}

export const useTabbarStore = defineStore('tabbar', ()=>{

  const tabbarItems = reactive<TabbarItem[]>([
    { name: 'home', value: null, active: true, titleCN: '首页', title: 'Home', 
      icon: 'i-local-home-gray', iconActive: 'i-local-home' },
    { name: 'usercenter', value: null, active: false, titleCN: '我的', 
      title: 'User Center', icon: 'i-local-me-gray', iconActive: 'i-local-me' }
  ]);
 
  const getTabbarItems = computed( ()=> {
    return tabbarItems;
  })

  const getActive = computed ( () => {
    const item = tabbarItems.find((item) => item.active);
    return item || tabbarItems[0];
  })
 
  const getTabbarItemValue = computed ( () => {
    return (name: string) => {
      const item = tabbarItems.find((item) => item.name === name);
      return item && item.value ? item.value : null;
    }
  })

  function setTabbarItem(name: string, value: number) {
    const tabbarItem = tabbarItems.find((item) => item.name === name)
    if (tabbarItem) {
      tabbarItem.value = value
    }
  }

  function setTabbarItemActive(name: string) {
    tabbarItems.forEach((item) => {
      if (item.name === name) {
        item.active = true
      } else {
        item.active = false
      }
    })
  }

  return { setTabbarItemActive,setTabbarItem,getTabbarItemValue,
            getActive,getTabbarItems,tabbarItems};
 
} 
);
