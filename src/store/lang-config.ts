import { reactive ,computed } from 'vue'
import { defineStore } from 'pinia'

export const useLangConfigStore = defineStore('langConfigStore',() => {
    const lang = reactive({
      // 默认语言，可选值<zh-CN|en-US>
      defaultLang: 'zh-CN',
      // 当在默认语言包找不到翻译时，继续在 fallbackLang 语言包内查找翻译
      fallbackLang: 'zh-CN',
      // 支持的语言列表
      langArray: [
        { name: 'zh-CN', value: '中文简体' },
        { name: 'en-US', value: 'English' }
      ]
    })

    function setLang(val: string) {
      lang.defaultLang = val;
    }

    async function toggleLang() {
      lang.defaultLang = lang.defaultLang === 'zh-CN' ? 'en-US' : 'zh-CN';
    }

    const langSuffix = computed(() => {
      const [, suffix] = lang.defaultLang.split('-');

      return suffix === 'US' ? '' : suffix;
    })

    return { lang, langSuffix, setLang, toggleLang };
  },
  {
    // 网页端配置
    // persist: true,
    // 小程序端配置
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key);
        },
        setItem(key, value) {
          uni.setStorageSync(key, value);
        }
      }
    }
  }
  );
