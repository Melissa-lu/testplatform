<template>
  <!-- <div>ve1</div> -->
  <n-space vertical>
    <!-- <n-switch v-model:value="collapsed" /> -->
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="4"
        :width="110"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          :collapsed="collapsed"
          :collapsed-width="4"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :on-update:value="changecolor"
          :value="actived"
        />
      </n-layout-sider>
      <n-layout>
        <router-view></router-view>
        
      </n-layout>
      <!-- <router-view></router-view> -->
      
    </n-layout>
  </n-space>
</template>
<script>
import Database from "./Database.vue";
import Server from "./Server.vue";
import Tomcat from "./Tomcat.vue";
import { h, defineComponent, ref } from "vue";
import { RouterLink,useRoute  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon } from "naive-ui";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from "@vicons/ionicons5";

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
export default {
  name: "VEindex",
  data() {
    return {
    };
  },
  props: {
  },
  components: {
    Database,
    Server,
    Tomcat
  },
  created() {
    let  to =this.$route;
    console.log(to);
  },
  setup() {
    // const route = useRoute();
    const { t } = useI18n();
    const menuOptions = [
      {
        label: () => h(RouterLink, {
          to: {
            name: "tomcat",
          },
        },{ default: () => t("version.enginemanage.tomcat") }),
        key: "tomcat",
        icon: renderIcon(BookIcon)
      },
      {
        label: () => h(RouterLink, {
          to: {
            name: "server",
          },
        },{ default: () => t("version.enginemanage.server") }),
        key: "server",
        icon: renderIcon(BookIcon)
      },
      {
        label: () => h(RouterLink, {
          to: {
            name: "database",
          },
        },{ default: () => t("version.enginemanage.database") }),
        key: "database",
        icon: renderIcon(BookIcon)
      }
    ];
    return {
      // inverted: ref(false),
      menuOptions,
    };
  },
  watch: {
    '$route'(to) {
    }
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      console.log("default-value",this.$route.path);
      let menus = document.getElementsByClassName(" n-menu-item-content");
      let ppath = this.$route.path;
      if(ppath.indexOf("tomcat")!=-1){
        menus[11].style.backgroundColor = "#daf0e4";
        // console.log("88888888888888",menus[9].parentNode  );
        menus[11].children[1].children[0].style.color = "#18a058";
        menus[11].children[0].children[0].style.color = "#18a058";
      }else if(ppath.indexOf("server")!=-1){
        menus[12].style.backgroundColor = "#daf0e4";
        menus[12].children[1].children[0].style.color = "#18a058";
        menus[12].children[0].children[0].style.color = "#18a058";
      }else if(ppath.indexOf("database")!=-1){
        menus[13].style.backgroundColor = "#daf0e4";
        menus[13].children[1].children[0].style.color = "#18a058";
        menus[13].children[0].children[0].style.color = "#18a058";
      }
    })
  },
  computed: {

  },
  methods: {
    changecolor(key, value){
      // console.log("shi ",key,item);
      var menus = document.getElementsByClassName(" n-menu-item-content");
      let flagindex = 18;//大于11就行
      for(let i=11;i<14;i++){ //！！！！！用4是因为只选择到头部 tab是4个，不然容易多选到子页面的元素，后面改了个数这里需要改

          menus[i].style.backgroundColor = "#fff";
          menus[i].children[1].children[0].style.color = "#333639";
          menus[i].children[0].children[0].style.color = "#333639";
          // menus[i].style.border = "0 px";
          // menus[i].childNodes[1].childNodes[0].style.color = "#fff";
        
      }
      if(key == "tomcat"){
        // menus[9].parentNode.style.backgroundColor = "#daf0e4";
        menus[11].children[1].children[0].style.color = "#18a058";
        menus[11].children[0].children[0].style.color = "#18a058";
      }else if(key == "server"){
        // menus[10].parentNode.style.backgroundColor = "#daf0e4";
        menus[12].children[1].children[0].style.color = "#18a058";
        menus[12].children[0].children[0].style.color = "#18a058";
      }else if(key == "database"){
        // menus[11].parentNode.style.backgroundColor = "#daf0e4";
        menus[13].children[1].children[0].style.color = "#18a058";
        menus[13].children[0].children[0].style.color = "#18a058";
      }
      //  console.log("3333333333333333333333",key,value);
       
    },
    
  }
}
</script>
<style scoped>
:deep .n-menu-item-content{
  padding-left: 5px !important;
}
</style>
