<template>
  <!-- <div v-show='flag'>test {{flag}}</div> -->
  <!-- <n-card  style="margin-bottom: 16px;margin-left: -110px;width: 196%;border: none;">
    <n-tabs type="line" animated style="margin-top: -10px;margin-left: -10px;"  :on-update:value="chengetabs">
      <n-tab-pane :name="111" :tab="$t('version.enginemanage.enginemanage')"  >
        
        <router-view></router-view>
      </n-tab-pane>
      <n-tab-pane :name="222" :tab="$t('version.nodewatch.nodewatch')"   >
        <router-view></router-view>
      </n-tab-pane>
      
      
      <n-tab-pane :name="333" :tab="$t('version.versionnode.versionnode')"    >
        <router-view></router-view>
      </n-tab-pane>
      <n-tab-pane :name="555" :tab="$t('version.iterate.iterate')"   >
        <router-view></router-view>
      </n-tab-pane>
      <n-tab-pane :name="444" :tab="$t('version.efficiency.efficiency')"   >
        <router-view></router-view>
      </n-tab-pane>

    </n-tabs>
  </n-card> -->
  <n-menu  mode="horizontal" :options="menuOptions"  :on-update:value="changecolor" :username="username" 
    style="margin-left: -100px;margin-top: 10px;"/>
  <n-divider style="margin: 0px -90px 0 ; width: 190%;" />
  <router-view style="margin-left: -80px;width: 190%;"></router-view>
 
</template>
<script>
import { defineComponent, h,onMounted,ref} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute,RouterLink  } from "vue-router";
import VVindex from "./versionnode/VVindex.vue";
import VEindex from "./enginemanage/VEindex.vue";
import VEfficiency from  "./eefficiency/Efficiency.vue";
import Tindex from "./tasknode/Tindex.vue";
import service from '../../requests/axios';
// import TIindex from "./taskinput/TIindex.vue";

export default {
  name: "Vindex",
  data() {
    return {
      flag: false
    };
  },
  props: {
    username:String,
  },
  components: {
    VEindex,
    VVindex,
    VEfficiency,
    Tindex,
    // TIindex,
  },
  created() {
    let  to =this.$route
    // console.log(to);
    // this.getgroup();
  },
  setup() {
    const route = useRoute();
    const { t } = useI18n();
    const ifversionRef = ref(false);
    function getgroup() {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var stageoptions = [];
        // 获取用户列表
        service.get('/user/current').then(res=>{
          let group1 = res.data.data.groups;
          let flag = false;
          for(let i=0;i<group1.length;i++){
            if(group1[i]=='versionManager'){
              flag = true;
              break;
            }
            // console.log("!!!!!!!!group",group1[i],this.flag);
          }
          resolve({
              data: flag,
            })
        });
      })
      
      // return group;
    }
    const menuOptionsRef = ref( [
          {
            label: () => h(RouterLink, {
              to: {
                name: "enginemange",
              },
            },{ default: () => t("version.enginemanage.enginemanage") }),
            key: "enginemange",
          },
          {
            // label: t("headermenus.functiontest"),
            label: () => h(RouterLink, {
              to: {
                name: "task",
              }
            }, { default: () => t("version.nodewatch.nodewatch") }),
            key: "task",
          },
          {
            label: t("version.versionnode.versionnode"),
            label: () => h(RouterLink, {
              to: {
                name: "vversion",
              }
            }, { default: () => t("version.versionnode.versionnode") }),
            key: "vversion",
            disabled: true,
          },
          {
            // label: t("headermenus.functiontest"),
            label: () => h(RouterLink, {
              to: {
                name: "iterate",
              }
            }, { default: () => t("version.iterate.iterate") }),
            key: "iterate",
          },
          {
            label: t("version.efficiency.efficiency"),
            // label: () => h(RouterLink, {
            //   to: {
            //     name: "efficiency",
            //   }
            // }, { default: () => t("version.efficiency.efficiency") }),
            key: "efficiency",
            disabled: true,
          },
          {
            // label: t("headermenus.functiontest"),
            label: () => h(RouterLink, {
              to: {
                name: "defect",
              }
            }, { default: () => t("version.defect.defect") }),
            key: "defect",
          },
          {
            // label: t("headermenus.functiontest"),
            label: () => h(RouterLink, {
              to: {
                name: "personal",
              }
            }, { default: () => t("version.personal.personal") }),
            key: "personal",
          },
        ]);
    onMounted(() => {
      getgroup().then((data) => {
        ifversionRef.value = data.data;// data.data
        menuOptionsRef.value = [
          {
            label: () => h(RouterLink, {
              to: {
                name: "enginemange",
              },
            },{ default: () => t("version.enginemanage.enginemanage") }),
            key: "enginemange",

          },
          {
            // label: t("headermenus.functiontest"),
            label: () => h(RouterLink, {
              to: {
                name: "task",
              }
            }, { default: () => t("version.nodewatch.nodewatch") }),
            key: "task",
          },
          // data.data?{ //正式环境
          data.data?{
            label: () => h(RouterLink, {
              to: {
                name: "vversion",
              }
            }, { default: () => t("version.versionnode.versionnode") }),
            key: "vversion",
          }:{
            label: t("version.versionnode.versionnode"),
            key: "vversion",
            disabled: true,
          },
          {
            // label: t("headermenus.functiontest"),
            label: () => h(RouterLink, {
              to: {
                name: "iterate",
              }
            }, { default: () => t("version.iterate.iterate") }),
            key: "iterate",
          },
          {
            label: t("version.efficiency.efficiency"),
            // label: () => h(RouterLink, {
            //   to: {
            //     name: "efficiency",
            //   }
            // }, { default: () => t("version.efficiency.efficiency") }),
            key: "efficiency",
            disabled: true,
          },
          {
            // label: t("headermenus.functiontest"),
            label: () => h(RouterLink, {
              to: {
                name: "defect",
              }
            }, { default: () => t("version.defect.defect") }),
            key: "defect",
          },
          {
            // label: t("headermenus.functiontest"),
            label: () => h(RouterLink, {
              to: {
                name: "personal",
              }
            }, { default: () => t("version.personal.personal") }),
            key: "personal",
          },
        ];
      });
    })
    return {
      route,
      menuOptions:menuOptionsRef,
      ifversion:ifversionRef,
    };
  },
  watch: {

  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      // this.getgroup()
      // console.log("default-value",this.route.path,this.route)
      // let tabs = document.getElementsByClassName(" n-tabs-tab");
      // let bottom = document.getElementsByClassName(" n-tabs-bar");
      // let ppath = this.route.path;
      // // console.log("22route!!!!!!!",tabs,ppath,bottom);
      // if(ppath.indexOf("task")!=-1){
      //   tabs[1].classList.add("n-tabs-tab--active");
      //   tabs[0].classList.remove("n-tabs-tab--active");
      //   bottom[0].classList.add("task_bottom");
      // }else if(ppath.indexOf("version/version")!=-1){
      //   tabs[2].classList.add("n-tabs-tab--active");
      //   tabs[0].classList.remove("n-tabs-tab--active");
      //   bottom[0].classList.add("version_bottom");
      // }else if(ppath.indexOf("iterate")!=-1){
      //   tabs[3].classList.add("n-tabs-tab--active");
      //   tabs[0].classList.remove("n-tabs-tab--active");
      //   bottom[0].classList.add("iterate_bottom");
      // }else if(ppath.indexOf("efficiency")!=-1){
      //   tabs[4].classList.add("n-tabs-tab--active");
      //   tabs[0].classList.remove("n-tabs-tab--active");
      //   bottom[0].classList.add("efficiency_bottom");
      // }
      let menus = document.getElementsByClassName(" n-menu-item-content");
      let ppath = this.route.path;
      console.log("route!!!!!!!",menus,this.route.path);
      if(ppath.indexOf("tomcat")!=-1 || ppath.indexOf("database")!=-1 ||ppath.indexOf("server")!=-1){
        menus[4].children[0].children[0].style.color = "#18A058";
        menus[4].style.borderBottom=" 2px solid #18A058";
      }else if(ppath.indexOf("task")!=-1){
        menus[5].children[0].children[0].style.color = "#18A058";
        menus[5].style.borderBottom=" 2px solid #18A058";
      }else if(ppath.indexOf("version/version")!=-1){
        menus[6].children[0].children[0].style.color = "#18A058";
        menus[6].style.borderBottom=" 2px solid #18A058";
        // console.log("duidudi",menus[6].children[0].children[0],"333");
      }else if(ppath.indexOf("iterate")!=-1){
        menus[7].children[0].children[0].style.color = "#18A058";
        menus[7].style.borderBottom=" 2px solid #18A058";
      }else if(ppath.indexOf("efficiency")!=-1){
        menus[8].children[0].children[0].style.color = "#18A058";
        menus[8].style.borderBottom=" 2px solid #18A058";
      }else if(ppath.indexOf("defect")!=-1){
        menus[9].children[0].children[0].style.color = "#18A058";
        menus[9].style.borderBottom=" 2px solid #18A058";
      }else if(ppath.indexOf("personal")!=-1){
        menus[10].children[0].children[0].style.color = "#18A058";
        menus[10].style.borderBottom=" 2px solid #18A058";
      }

      // if(ppath.indexOf("task")!=-1){
      //   menus[4].children[0].children[0].style.color = "#18A058";
      //   menus[4].style.borderBottom=" 2px solid #18A058";
      // }else if(ppath.indexOf("version/version")!=-1){
      //   menus[5].children[0].children[0].style.color = "#18A058";
      //   menus[5].style.borderBottom=" 2px solid #18A058";
      // }else if(ppath.indexOf("iterate")!=-1){
      //   // menus[6].children[0].children[0].style.color = "#18A058";
      //   // menus[6].style.borderBottom=" 2px solid #18A058";
      //   console.log("duidudi",menus.length,"333");
      // }
      // else if(ppath.indexOf("iterate")!=-1){
      //   menus[7].children[0].children[0].style.color = "#18A058";
      //   menus[7].style.borderBottom=" 2px solid #18A058";
      // }else if(ppath.indexOf("efficiency")!=-1){
      //   menus[8].children[0].children[0].style.color = "#18A058";
      //   menus[8].style.borderBottom=" 2px solid #18A058";
      // }
      

    })
  },
  computed: {

  },
  methods: {
    // chengetabs(value){
    //   let tabs = document.getElementsByClassName(" n-tabs-tab");
    //   let bottom = document.getElementsByClassName(" n-tabs-bar");
    //   bottom[0].classList.remove("task_bottom");
    //   bottom[0].classList.remove("iterate_bottom");
    //   bottom[0].classList.remove("version_bottom");
    //   bottom[0].classList.remove("efficiency_bottom");
    //   for(let i=0;i<tabs.length;i++){
    //     tabs[i].classList.remove("n-tabs-tab--active");
    //   }
    //   if(value=="111"){
    //     this.$router.push({ name: 'enginemange'});
    //   }
    //   else if(value=="222"){
    //     this.$router.push({ name: 'task'});
    //   }else if(value=="333"){
    //     this.$router.push({ name: 'vversion'});
    //   }else if(value=="444"){
    //     this.$router.push({ name: 'efficiency'});
    //   }else if(value=="555"){
    //     this.$router.push({ name: 'iterate'});
    //   }
    // },
    changecolor(key, value){
      let menus = document.getElementsByClassName(" n-menu-item-content");
      console.log("essrormessage",this.ifversion);
      // console.log("222",menus[8]);
      // let flagindex = 10;//大于7就行
      for(let i=4;i<11;i++){ //！！！！！用4he 7是因为只选择到头部 tab是3个，不然容易多选到子页面的元素，后面改了个数这里需要改
      // for(let i=4;i<7;i++){
        if(i==5 || i==7 || i==9 || i==10 ||i==4 ){
          // console.log("222",i,menus[i],menus[i].children[0].children[0]);
          menus[i].children[0].children[0].style.color = "#333639";
          menus[i].style.borderBottom="none";
        }else if( i==8){
          menus[i].children[0].style.color = "#333639";
          menus[i].style.borderBottom="none";
        }else if(this.ifversion ==true){
          menus[i].children[0].children[0].style.color = "#333639";
          menus[i].style.borderBottom="none";
        }else if(this.ifversion ==false){
          menus[i].children[0].style.color = "#333639";
          menus[i].style.borderBottom="none";
        }
      }
      if(key == "enginemange"){
        menus[4].children[0].children[0].style.color = "#18A058";
        menus[4].style.borderBottom=" 2px solid #18A058";
      }else if(key == "task"){
        menus[5].children[0].children[0].style.color = "#18A058";
        menus[5].style.borderBottom=" 2px solid #18A058";
      }else if(key == "vversion"){
        menus[6].children[0].children[0].style.color = "#18A058";
        menus[6].style.borderBottom=" 2px solid #18A058";
      }else if(key == "iterate"){
        menus[7].children[0].children[0].style.color = "#18A058";
        menus[7].style.borderBottom=" 2px solid #18A058";
      }
      else if(key == "efficiency"){
        menus[8].children[0].children[0].style.color = "#18A058";
        menus[8].style.borderBottom=" 2px solid #18A058";
      }else if(key == "defect"){
        menus[9].children[0].children[0].style.color = "#18A058";
        menus[9].style.borderBottom=" 2px solid #18A058";
      }else if(key == "personal"){
        menus[10].children[0].children[0].style.color = "#18A058";
        menus[10].style.borderBottom=" 2px solid #18A058";
      }
    },
    
  }
}
</script>
<style scoped>
</style>

