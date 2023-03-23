<!-- <template>
  <div>p01</div>
  <br/>
  <p>
    <router-link to="/perfor/">ziyuanchi</router-link>
    <br />
    <router-link to="/perfor/script">/perfor/script</router-link>
    <br />
    <router-link to="/perfor/testreport">testreport</router-link>
    <br />
    <router-link to="/perfor/testtask">testtask</router-link>
    <br />
    <router-link to="/version">version</router-link>
  </p>
  <router-view></router-view>
  <br/>
  <div>p01</div>
</template> --> 
<template>
<!-- <div :value="this.tab2">test</div> -->
  <!-- <n-card  style="margin-bottom: 16px;margin-left: -110px;width: 196%;border: none;">
    <n-tabs type="line" animated style="margin-top: -10px;"  :on-update:value="chengetabs">
      <n-tab-pane :name="222" :tab="$t('perfor.scriptsmanger')"  >
        <router-view></router-view>
      </n-tab-pane>
      <n-tab-pane :name="333" :tab="$t('perfor.taskmanger')"   >
        <router-view></router-view>
      </n-tab-pane>
      <n-tab-pane :name="444" :tab="$t('perfor.testreport')"   >
        <router-view></router-view>
      </n-tab-pane>

    </n-tabs>
  </n-card> -->
  <n-menu  mode="horizontal" :options="menuOptions"  :on-update:value="changecolor" 
    style="margin-left: -100px;margin-top: 10px;"/>
  <n-divider style="margin: 0px -90px 0 ; width: 190%;" />
  <router-view style="margin-left: -80px;width: 190%;"></router-view>
</template>
<script>
import { defineComponent, h,ref,watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink,useRoute  } from "vue-router";
import ScriptVue from "./Script.vue";
import TestReport from "./TestReport.vue";
import TestTask from "./TestTask.vue";
import TestAnalysis from "./TestAnalysis.vue";

export default {
  name: "Pindex",
  data() {
    return {
      tab2:"qqqq",
    };
  },
  props: {
  },
  components: {
    // HelloWorld,
    ScriptVue,
    TestReport,
    TestTask,TestAnalysis
  },
  created() {
    let  to =this.$route
    console.log(to);
  },
  setup() {
    const route = useRoute();
    const { t } = useI18n();
    const menuOptions = [
      {
        label: () => h(RouterLink, {
          to: {
            name: "perforscript",
          },
        },{ default: () => t("perfor.scriptsmanger") }),
        key: "perforscript",
        // disabled: true,
      },
      {
        // label: t("headermenus.functiontest"),
        label: () => h(RouterLink, {
          to: {
            name: "perfortesttask",
          }
        }, { default: () => t("perfor.taskmanger") }),
        key: "perfortesttask",
      },
      {
        // label: t("headermenus.functiontest"),
        label: () => h(RouterLink, {
          to: {
            name: "Perfortestreport",
          }
        }, { default: () => t("perfor.testreport") }),
        key: "Perfortestreport",
      },
      {
        // label: t("headermenus.functiontest"),
        label: () => h(RouterLink, {
          to: {
            name: "Perfortestanalysis",
          }
        }, { default: () => t("perfor.testanalysis") }),
        key: "Perfortestanalysis",
      },
    ];
    return {
      route,
      menuOptions,
    };
  },
  watch: {
    '$route'(to) {
      // // console.log("route!!!!!!!",this.route.path)
      // let menus = document.getElementsByClassName(" n-menu-item-content");
      // let ppath = this.route.path;
      // console.log("route!!!!!!!",menus,this.route.path);
      // if(ppath.indexOf("script")!=-1){
      //   menus[4].style.color = "#416954";
      // }else if(ppath.indexOf("testtask")!=-1){
      //   menus[5].style.color = "#416954";
      // }else if(ppath.indexOf("testreport")!=-1){
      //   menus[6].style.color = "#416954";
      // }
      // let menus = document.getElementsByClassName(" n-menu-item-content");
      // let ppath = this.route.path;
      // console.log("route!!!!!!!",menus,this.route.path);
      // if(ppath.indexOf("script")!=-1){
      //   menus[4].children[0].children[0].style.color = "#18A058";
      // }else if(ppath.indexOf("testtask")!=-1){
      //   menus[5].children[0].children[0].style.color = "#18A058";
      // }else if(ppath.indexOf("testreport")!=-1){
      //   menus[6].children[0].children[0].style.color = "#18A058";
      //   // console.log("duidudi",menus[6].children[0].children[0],"333");
      // }
    }
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      // console.log("default-value",this.route.path,this.route)
      // let tabs = document.getElementsByClassName(" n-tabs-tab");
      // let bottom = document.getElementsByClassName(" n-tabs-bar");
      // let ppath = this.route.path;
      // // console.log("22route!!!!!!!",tabs,ppath,bottom);
      // if(ppath.indexOf("testtask")!=-1){
      //   tabs[1].classList.add("n-tabs-tab--active");
      //   tabs[0].classList.remove("n-tabs-tab--active");
      //   bottom[0].classList.add("testtask_bottom");
      // }
      // else if(ppath.indexOf("testreport")!=-1){
      //   tabs[2].classList.add("n-tabs-tab--active");
      //   tabs[0].classList.remove("n-tabs-tab--active");
      //   bottom[0].classList.add("testreport_bottom");
      // }
      let menus = document.getElementsByClassName(" n-menu-item-content");
      let ppath = this.route.path;
      console.log("route!!!!!!!",menus,this.route.path);
      if(ppath.indexOf("script")!=-1){
        menus[4].children[0].children[0].style.color = "#18A058";
        menus[4].style.borderBottom=" 2px solid #18A058";
      }else if(ppath.indexOf("testtask")!=-1){
        menus[5].children[0].children[0].style.color = "#18A058";
        menus[5].style.borderBottom=" 2px solid #18A058";
      }else if(ppath.indexOf("testreport")!=-1){
        menus[6].children[0].children[0].style.color = "#18A058";
        menus[6].style.borderBottom=" 2px solid #18A058";
        // console.log("duidudi",menus[6].children[0].children[0],"333");
      }else if(ppath.indexOf("testanalysis")!=-1){
        menus[7].children[0].children[0].style.color = "#18A058";
        menus[7].style.borderBottom=" 2px solid #18A058";
        // console.log("duidudi",menus[6].children[0].children[0],"333");
      }
    })
  },
  computed: {

  },
  methods: {
    changecolor(key, value){
      let menus = document.getElementsByClassName(" n-menu-item-content");
      let flagindex = 10;//大于7就行
      for(let i=4;i<8;i++){ //！！！！！用4he 7是因为只选择到头部 tab是3个，不然容易多选到子页面的元素，后面改了个数这里需要改
        if(flagindex != i){
          menus[i].children[0].children[0].style.color = "#333639";
          menus[i].style.borderBottom="none";
        }
      }
      if(key == "perforscript"){
        menus[4].children[0].children[0].style.color = "#18A058";
        menus[4].style.borderBottom=" 2px solid #18A058";
        flagindex = 4;
      }else if(key == "perfortesttask"){
        menus[5].children[0].children[0].style.color = "#18A058";
        menus[5].style.borderBottom=" 2px solid #18A058";
        flagindex = 5;
      }else if(key == "Perfortestreport"){
        menus[6].children[0].children[0].style.color = "#18A058";
        menus[6].style.borderBottom=" 2px solid #18A058";
        flagindex = 6;
      }else if(key == "Perfortestanalysis"){
        menus[7].children[0].children[0].style.color = "#18A058";
        menus[7].style.borderBottom=" 2px solid #18A058";
        flagindex = 7;
      }
      
      
    //   // let to =this.$route;//内容如下
    //   //{  fullPath: "/perfor"
    //     // hash: ""
    //     // href: "/perfor"
    //     // matched: (2) [{…}, {…}]
    //     // meta: {}
    //     // name: "perforresourcepool"
    //     // params: {}
    //     // path: "/perfor"
    //     // query: {}
    //     // redirectedFrom: undefined
    //     // [[Prototype]]: Object        }
    //   // console.log("1111",value);
    //   // console.log(to);
    //   let tabs = document.getElementsByClassName(" n-tabs-tab");
    //   let bottom = document.getElementsByClassName(" n-tabs-bar");
    //   bottom[0].classList.remove("testtask_bottom");
    //   bottom[0].classList.remove("testreport_bottom");
    //   for(let i=0;i<tabs.length;i++){
    //     tabs[i].classList.remove("n-tabs-tab--active");
    //   }
    //   if(value=="222"){
    //     this.$router.push({ name: 'perforscript'});
    //   }else if(value=="333"){
    //     this.$router.push({ name: 'perfortesttask'});
    //   }else if(value=="444"){
    //     this.$router.push({ name: 'Perfortestreport'});
    //   }
    }
  }
}
</script>
<style scoped>
/* :deep .n-tabs-nav-scroll-content .testreport_bottom{
  left: 184px !important;
}
:deep .n-tabs-nav-scroll-content .testtask_bottom{
  left: 92px !important;
} */
</style>
