<!-- <template>
  <div>111</div>
  <router-link to="/PerTest">PerTest</router-link>
  <router-link to="/SettingMain">SettingMain</router-link>
  <router-view></router-view>
</template> -->

<template>
<n-loading-bar-provider>
<n-message-provider>
<n-dialog-provider>
<n-config-provider :locale="zhCN" :date-locale="dateZhCN">
  <div  id="header-top">
    <div  class="topheader">
      <img src="./assets/logo_1-2.png" class="logo" alt="" style="float:left;">
     <!-- <div>{{ $t('headermenus.performance') }}</div> -->
      <div style="float:left;width: 50%;height: 40px;"><top-menus /></div> 
      <!-- <div style="float:right;width: 60px;height: 42px;margin-right: 25px;"><group :color="color" :group="group"/></div>
      <div style="float:right;width: 48px;height: 42px;line-height: 42px;text-align: center; font-size: 10px;color: #6fc799;">{{$t("headermenus.group")}}</div> -->
      <div style="float:right;width: 100px;height: 42px;margin-right: 15px;margin-left: 10px;">
        <!-- <user :color="color" :username="username" /> -->
        <n-button strong secondary  style="margin-top:4px;" color="#fff" @click="tohelpkms()">
          {{ $t('common.help') }}
        </n-button>
        <!-- <a href="https://kms.fineres.com/pages/viewpage.action?pageId=465502828">{{ $t('common.help') }}</a> -->
      </div>
      <keep-alive> <div style="float:right;width: 100px;height: 42px;margin-right: 5px;"><user :color="color" :username="username" /></div></keep-alive>
      <div style="float:right;width: 100px;height: 42px;margin-right: 5px;"><language-switch :color="color"/></div>
    </div>
  </div>   
  <!-- <p>
    <router-link to="/users/eduardo">/users/eduardo</router-link>
    <br />
    <router-link to="/users/eduardo/posts">/users/eduardo/posts</router-link>
    <br />
    <router-link to="/users/eduardo/test">/users/eduardo/test</router-link>
  </p> -->

</n-config-provider>
</n-dialog-provider>
</n-message-provider>
</n-loading-bar-provider>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import PerformanceMain from './components/performance/Main1.vue'
// import RouteView from "./components/common/router/View";
import { getCurrentInstance } from 'vue';
import { zhCN, dateZhCN } from 'naive-ui'
import { useI18n } from "vue-i18n";
import TopMenus from "./components/head/HeaderTopMenus";
import LanguageSwitch from "./components/head/LanguageSwitch";
import User from "./components/head/User";
import Group from "./components/head/Group";
import {ORIGIN_COLOR} from "./components/common/js/constants";
import {setDefaultTheme} from "./components/common/js/utils";
import service from './requests/axios';

export default {
  name: 'App',
  props: {},
  components: {
    // HelloWorld,
    TopMenus,
    LanguageSwitch,
    User,
    Group,
  },
   data() {
    return {
      // licenseHeader: null,
      auth: false,
      // header: {},
      // logoId: '_blank',
      color: '',
      username:'@',
      group:[],
      // color1: '',
      // sessionTimer: null,//登录时间
      // isShow: true,
      isMenuShow: true,//顶部菜单显示
    };
  },
  setup() {
    const cns = getCurrentInstance();
    return {
      zhCN,
      dateZhCN,
      cns
    }
  },
  created() {
    // this.initSessionTimer();
    // if (!hasLicense()) {
      setDefaultTheme();
      this.color = ORIGIN_COLOR;
     
      // this.username = this.username+"aaa";
      // this.group = this.getgroup();
      this.group = ["test"];
      // this.color1 = "aaa";
      
  },
  beforeCreate() {
  },
  // 提供可注入子组件属性
  provide() {
    return {
      // reload: this.reload,
      // reloadTopMenus: this.reloadTopMenus,
    };
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      this.getusername();
    })
  },
  methods: {
    getusername(){
      let newname = "";
      service.get('/user/current').then(res=>{
        newname = res.data.data.username;
        console.log("username",newname);
        // this.username = "@ "+newname;
        this.username = "@ "+newname;
        // return username;
        // console.log("8888888888888888888899999",this.cns.appContext.config.globalProperties.$Name);
        this.cns.appContext.config.globalProperties.$Name = newname;
        // console.log("88809999999999999",this.cns.appContext.config.globalProperties.$Name);
      }).catch(e=>{
        console.log("essrormessage",e);
        this.username  = "err";
      });
    },
    getgroup(){
      let group = [];
      service.get('/user/current').then(res=>{
        group = res.data.data.group;
      }).catch(e=>{
        // console.log("essrormessage",e.response.data);
        // alert(e.response.data);
        group = t("common.geterr");
      });
      return group;
    },
    tohelpkms(){
      window.open("https://kms.fineres.com/pages/viewpage.action?pageId=465502828", "_blank");
    }
    // }
  },
}
</script>

<style>
body{
  margin-top:0px;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  margin-top: 0px;
}

#header-top {
  margin-top: 0px;
  /* width: 100%; */
  padding: 0 10px;
  background-color: var(--color);
  color: rgb(245, 245, 245);
  font-size: 14px;
  height: 41px;
}

.topheader{
  height: 100%;
}
.logo {
  width: 80px;
  margin-bottom: 0;
  border: 0;
  margin-right: 20px;
  margin-left: 15px;
  display: inline-block;
  line-height: 37px;
  background-size: 156px 30px;
  box-sizing: border-box;
  height: 37px;
  background-repeat: no-repeat;
  background-position: 50% center;
}
</style>
