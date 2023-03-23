<template>
<!-- <div :value="this.tab2">test</div> -->
  <!-- <n-card  style="margin-bottom: 16px;margin-left: -110px;width: 196%;border: none;">
    <n-tabs type="line" animated   style="margin-top: -10px;" >
      <n-tab-pane :name="222" :tab="$t('function.blood')"  >
        <blood-rate></blood-rate>
      </n-tab-pane>
       <n-tab-pane :name="333" :tab="$t('function.bloodbi')"   >
        <blood-rate-bi></blood-rate-bi>
      </n-tab-pane>
      <n-tab-pane :name="444" :tab="$t('function.bloodfr')"   >
        <blood-rate-fr></blood-rate-fr>
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
import BloodRate from "./BloodRate.vue";
import BloodRateBi from "./BloodRateBi.vue";
import BloodRateFr from "./BloodRateFr.vue";

export default {
  name: "Findex",
  data() {
    return {
    };
  },
  props: {
  },
  components: {
   BloodRate,BloodRateBi,BloodRateFr
  },
  created() {
    let  to =this.$route
    console.log(to);
  },
  setup() {
    const route = useRoute();
    const { t } = useI18n();
    const selectvalueRef = ref("222");
    const tabsInstRef = ref(null);
    const menuOptions = [
      {
        label: () => h(RouterLink, {
          to: {
            name: "bloodrate",
          },
        },{ default: () => t("function.blood") }),
        key: "bloodrate",
        // disabled: true,
      },
      {
        // label: t("headermenus.functiontest"),
        label: () => h(RouterLink, {
          to: {
            name: "bloodratebi",
          }
        }, { default: () => t("function.bloodbi") }),
        key: "bloodratebi",
      },
      {
        // label: t("headermenus.functiontest"),
        label: () => h(RouterLink, {
          to: {
            name: "bloodratefr",
          }
        }, { default: () => t("function.bloodfr") }),
        key: "bloodratefr",
      },
    ];
    return {
      route,
      selectvalue:selectvalueRef,
      menuOptions,
      // selectvalue:"222",
      // tabsInstRef,
      // handleBeforeLeave: (tabName) => {
      //   console.log("2233333333333333333route!!!!!!!",tabName);
      //   return true;
      // },
    };
  },
  watch: {

  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      // console.log("default-value",this.route.path,this.route)
      // let tabs = document.getElementsByClassName(" n-tabs-tab");
      // let bottom = document.getElementsByClassName(" n-tabs-bar");
      // let ppath = this.route.path;
      // // console.log("22route!!!!!!!",ppath,this.tabsInstRef);

      // if(ppath.indexOf("bidetails")!=-1){
      //   tabs[1].classList.add("n-tabs-tab--active");
      //   tabs[0].classList.remove("n-tabs-tab--active");
      //   bottom[0].classList.add("bi_bottom");
      // }
      // else if(ppath.indexOf("frdetails")!=-1){
      //   tabs[2].classList.add("n-tabs-tab--active");
      //   tabs[0].classList.remove("n-tabs-tab--active");
      //   bottom[0].classList.add("fr_bottom");
      // }
      let menus = document.getElementsByClassName(" n-menu-item-content");
      let ppath = this.route.path;
      console.log("route!!!!!!!",menus,this.route.path);
      if(ppath.indexOf("bloodrate")!=-1){
        menus[4].children[0].children[0].style.color = "#18A058";
        menus[4].style.borderBottom=" 2px solid #18A058";
      }else if(ppath.indexOf("bi")!=-1){
        menus[5].children[0].children[0].style.color = "#18A058";
        menus[5].style.borderBottom=" 2px solid #18A058";
      }else if(ppath.indexOf("fr")!=-1){
        menus[6].children[0].children[0].style.color = "#18A058";
        menus[6].style.borderBottom=" 2px solid #18A058";
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
      for(let i=4;i<7;i++){ //！！！！！用4he 7是因为只选择到头部 tab是3个，不然容易多选到子页面的元素，后面改了个数这里需要改
        if(flagindex != i){
          menus[i].children[0].children[0].style.color = "#333639";
          menus[i].style.borderBottom="none";
        }
      }
      if(key == "bloodrate"){
        menus[4].children[0].children[0].style.color = "#18A058";
        menus[4].style.borderBottom=" 2px solid #18A058";
        flagindex = 4;
      }else if(key == "bloodratebi"){
        menus[5].children[0].children[0].style.color = "#18A058";
        menus[5].style.borderBottom=" 2px solid #18A058";
        flagindex = 5;
      }else if(key == "bloodratefr"){
        menus[6].children[0].children[0].style.color = "#18A058";
        menus[6].style.borderBottom=" 2px solid #18A058";
        flagindex = 6;
      }
    }
    
  }
}
</script>
<style scoped>
:deep .n-tabs-nav-scroll-content .bi_bottom{
  left: 129px !important;
}
:deep .n-tabs-nav-scroll-content .fr_bottom{
  left: 263px !important;
}
</style>
