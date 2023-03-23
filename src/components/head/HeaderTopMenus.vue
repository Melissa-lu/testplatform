<template>
  <n-config-provider :theme="darkTheme">
    <n-menu :value="actived" mode="horizontal" :options="menuOptions"  :on-update:value="changecolor" :username="username" />
  </n-config-provider>
  <!-- {{username}} -->
  <router-view></router-view>
</template>
<script>
import { defineComponent, h,ref,watch } from "vue";
import { darkTheme  } from "naive-ui";
import { useI18n } from "vue-i18n";
import { RouterLink,useRoute  } from "vue-router";

export default defineComponent({
  name: "TopMenus",
  data() {
    return {
      // textcolor:'',
      lang:'zh',
      // user:username,
    };
  },
  props: {
  },
  created() {
    // this.setColor();
    // console.log(headerwords);
    // console.log("!!!!!!!!{{username}}",username);
  },
  setup() {
    const route = useRoute();
    const { t } = useI18n();
    console.log(t("headermenus.language"));
    const menuOptions = [
      {
        // label: t("headermenus.performance"),
        label: () => h(RouterLink, {
          to: {
            name: "perfor",
          },
        },{ default: () => t("headermenus.performance") }),
        key: "xingnneng",
        // disabled: true,
      },
      {
        // label: t("headermenus.functiontest"),
        label: () => h(RouterLink, {
          to: {
            name: "function",
          }
        }, { default: () => t("headermenus.functiontest") }),
        key: "gongneng",
      },
      {
        label: t("headermenus.version"),
        label: () => h(RouterLink, {
          to: {
            name: "version",
          }
        }, { default: () => t("headermenus.version") }),
        key: "banben",
        
      },
      {
        label: "",//t("headermenus.basic"),
        key: "jichu",
        disabled: true,
      },
      
    ];
    // themeOverrides,
    // const uid = router.currentRoute.value;
    // !!!!追踪路由
    watch(() => route.path,(newPath, oldPath) => {
	      console.log("to",newPath);
	    },{ immediate: true });
    return {
      activeKey: ref(null),
      darkTheme,
      menuOptions,
      route,
      // uid,
    };
  },
  watch: {
    '$route'(to) {
      // console.log("route!!!!!!!",this.route.path)
      let menus = document.getElementsByClassName(" n-menu-item-content");
      let ppath = this.route.path;
      if(ppath.indexOf("perfor")!=-1){
        menus[0].style.backgroundColor = "#416954";
      }else if(ppath.indexOf("function")!=-1){
        menus[1].style.backgroundColor = "#416954";
      }else if(ppath.indexOf("basic")!=-1){
        menus[3].style.backgroundColor = "#416954";
      }else if(ppath.indexOf("version")!=-1){
        menus[2].style.backgroundColor = "#416954";
      }
    }
  },
  mounted() {
    // var that = this;
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      // console.log("default-value",this.route.path,this.route)
      
      
    })
  },
  computed: {
    // ...mapGetters([
    //   'isNewVersion',
    //   'isOldVersion',
    // ])
  },
  methods: {
    changecolor(key, value){
      // console.log("shi ",key,item);
      var menus = document.getElementsByClassName(" n-menu-item-content");
      // var menusselect = document.getElementsByClassName(" n-menu-item-content--selected")[0];
      // var menusselectwords = menusselect.children[0].children;
      // var menusselect = document.getElementsByClassName("router-link-exact-active")[0].parentNode.parentNode;
      // console.log("zu",menus);
      // console.log(menuOptions.length);
      // for(let i=0;i<4;i++){ //！！！！！用4是因为只选择到头部 tab是4个，不然容易多选到子页面的元素，后面改了个数这里需要改
      //   if(menus[i]== menusselect){
      //     menus[i].style.backgroundColor = "#416954";
      //     // console.log("zu",menus,menus[i].childNodes[1].childNodes[0]);
      //     // menus[i].childNodes[1].childNodes[0].style.color = "#416954";
      //     console.log("111111111111111111111",menus[i],menusselect);
      //   }else{
      //     menus[i].style.backgroundColor = "#18A058";
      //     menus[i].style.borderColor = "#fff";
      //     menus[i].style.border = "0 px";
      //     menus[i].childNodes[1].childNodes[0].style.color = "#fff";
      //   }
        
      // }
      let flagindex = 10;//大于4就行
      if(key == "xingnneng"){
        menus[0].style.backgroundColor = "#416954";
        flagindex = 0;
      }else if(key == "gongneng"){
        menus[1].style.backgroundColor = "#416954";
        flagindex = 1;
      }else if(key == "jichu"){
        menus[3].style.backgroundColor = "#416954";
        flagindex = 3;
      }else if(key == "banben"){
        menus[2].style.backgroundColor = "#416954";
        flagindex = 2;
      }
      for(let i=0;i<4;i++){ //！！！！！用4是因为只选择到头部 tab是4个，不然容易多选到子页面的元素，后面改了个数这里需要改
        if(flagindex != i){
          menus[i].style.backgroundColor = "#18A058";
          menus[i].style.borderColor = "#fff";
          menus[i].style.border = "0 px";
          // menus[i].childNodes[1].childNodes[0].style.color = "#fff";
        }
        
      }
      //  console.log("3333333333333333333333",key,value);
       
    }
  }
});
</script>

<style scoped>
/* 使用 :deep 匹配 */
#header-top .topheader .n-menu :deep .n-menu-item-content-header{
  /* color: var(--n-item-text-color) !important; */
  font-weight:bold !important;
  color: #fff !important;
}
#header-top .topheader .n-menu :deep .n-menu-item-content-header a{
  font-weight:bold !important;
  color: #fff !important;
  height: 40px !important;
}
#header-top .topheader .n-menu :deep .n-menu-item-content-header a:hover{
  font-weight:bold !important;
  color: #e7f5ee !important;
}
</style>