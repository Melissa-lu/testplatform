// import Vue from 'vue';
import { createI18n } from 'vue-i18n'
// import zh_CN from "./ch";
// import en_US from "./en";

// 切换——$i18n.locale = 'en'
const i18n = createI18n({
    locale: 'ch', //默认显示的语言 
    // fallbackLocale: 'ch',
    legacy: false, //国际化多语言时报错修复——Uncaught SyntaxError: Not available in legacy mode
    messages: {
        ch: require('./ch.js'), //引入语言文件
        en: require('./en.js')
    }
    // zh_CN,
    // en_US
})
export default i18n;
// Vue.use(VueI18n);

// Vue.locale = () => {}

// var locale = localStorage.getItem('lang')
// export const i18n = new VueI18n({
//     locale: locale,
//     fallbackLocale: 'zh-CN',
//     messages: {
//         'zh-CN': Object.assign(zh_CN, iviewZH),
//         'en-US': Object.assign(en_US, iviewEN)
//     }, // 本地与iview国际结合
//     silentTranslationWarn: process.NODE_ENV === 'production' // true 去除console中黄色报错
// })

// Vue.use(iView, {
//     i18n: (key, value) => i18n.t(key, value)
// })

// // 切换中英文调用该方法
// export function setI18nLanguage(lang) {
//     i18n.locale = lang
//     document.querySelector('html').setAttribute('lang', lang)
//     return lang
// }





// const messages = {
//     'en_US': {
//         ...enLocale,
//         ...en_US
//     },
//     'zh_CN': {
//         ...zh_CNLocale,
//         ...zh_CN
//     }
// };

// const i18n = new VueI18n({
//     locale: 'zh_CN',
//     messages,
//     silentTranslationWarn: true
// });

// const loadedLanguages = ['en_US', 'zh_CN', 'zh_TW'];

// function setI18nLanguage(lang) {
//     i18n.locale = lang;
//     axios.defaults.headers.common['Accept-Language'] = lang;
//     document.querySelector('html').setAttribute('lang', lang);
//     return lang;
// }

// Vue.prototype.$setLang = function(lang) {
//     if (i18n.locale !== lang) {
//         if (!loadedLanguages.includes(lang)) {
//             let file = lang.replace("_", "-");
//             return import (`./${file}`).then(response => {
//                 i18n.mergeLocaleMessage(lang, response.default);
//                 loadedLanguages.push(lang);
//                 return setI18nLanguage(lang)
//             })
//         }
//         return Promise.resolve(setI18nLanguage(lang))
//     }
//     return Promise.resolve(lang)
// };