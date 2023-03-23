<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
    :size="size"
    :style="{
      maxWidth: '2400px',
      minWidth: '850px',
      padding: '20px 10px',
    }"
  >
    <!-- 名称和保存取消按钮 -->
    <n-grid :cols="24" :x-gap="24" style="border-bottom:2px dotted #bfd7ca">
      <n-form-item-gi :span="12" :label="$t('version.enginemanage.servername')"  path="name" style="font-weight: bold;">
        <n-input v-model:value="model.name" :placeholder="$t('perfor.script.namevalue')" clearable />
      </n-form-item-gi> 
      <n-form-item-gi :span="2" >
        <n-button attr-type="button" @click="handleSubmit" type="primary" strong secondary>
            {{$t('common.save')}}
        </n-button>
      </n-form-item-gi>
      <n-form-item-gi :span="2" >
        <n-button attr-type="button" @click="handleCancel" type="warning" strong secondary>
            {{$t('common.cancel')}}
        </n-button>
      </n-form-item-gi>
    </n-grid>
    <!-- 登录url-->
    <n-grid :cols="24" :x-gap="24" style="margin:25px 0 0px">
      <n-form-item-gi :span="18" :label="$t('version.enginemanage.tomcaturl')"  path="url" >
        <n-input v-model:value="model.url" clearable />
      </n-form-item-gi>
    </n-grid>
    <!-- 用户名 密码 工程类型-->
    <n-grid :cols="24" :x-gap="24" >
      <n-form-item-gi :span="6" :label="$t('version.enginemanage.osname')"  path="user" >
        <n-input v-model:value="model.user" clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="6" :label="$t('version.enginemanage.ospasswd')"  path="password" >
        <n-input v-model:value="model.password" type="password" clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="6" :label="$t('version.enginemanage.tomcattype')"  path="type" >
        <n-select v-model:value="model.proj_type" :options="options" />
      </n-form-item-gi> 
    </n-grid>
    <!-- 增加的按钮 -->
    <n-form-item style="margin-top: 0px;">
      <n-button attr-type="button" @click="addItem" strong secondary round  size="small" type="primary" style="margin-left:15px;">
        <template #icon>
          <n-icon><AddCircleOutline /></n-icon>
        </template>
        {{$t('version.iterate.stageadd')}}
      </n-button>
    </n-form-item>
    
    <!-- 显示的列表 -->
    <n-form
      v-for="(item, index) in model.nodes"
      
      :show-label="(index==0?ture:false)"
      :key="index"   
      style="margin-left:15px;clear:both;"
    >
      <n-form-item   style="margin-right: 10px;float: left;">
        {{ $t('version.enginemanage.indextomcatnode')+(index+1) }}
      </n-form-item>
      <n-form-item  :label="$t('version.enginemanage.tomcatnode')" class="node_form_item" >
        <n-input v-model:value="item.serverurl" clearable />
      </n-form-item>
      <n-form-item  :label="$t('version.enginemanage.tomcatlib')" class="node_form_item" >
        <n-input v-model:value="item.lib_path" clearable />
      </n-form-item>
      <!-- style="min-width:200px;" -->
      <n-form-item  :label="$t('version.enginemanage.tomcatbin')" class="node_form_item">
        <n-input v-model:value="item.bin_path" clearable />
      </n-form-item>
      <n-form-item  :label="$t('version.enginemanage.tomcatname')" v-if="model.proj_type==3"
        class="node_form_item" style="margin-left: 46px;">
        <n-input v-model:value="item.attrs.user" clearable />
      </n-form-item>
      <n-form-item  :label="$t('version.enginemanage.tomcatpasswd')" v-if="model.proj_type==3" class="node_form_item">
        <n-input v-model:value="item.attrs.pwd" clearable />
      </n-form-item>
      <n-form-item style="margin-right: 10px;float: left;">
        <n-button  @click="removeItem(index)" type="error" strong secondary   size="small" style="width:50px !important;">
          <template #icon>
            <n-icon><DeleteOutlined /></n-icon>
          </template>
        </n-button>
      </n-form-item>
    </n-form>
  </n-form>
</template>
<script>
import { h, defineComponent, ref,reactive,  } from "vue";
import { RouterLink,useRoute ,useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMessage, } from "naive-ui";
import { LogInOutline as LogInIcon,AddCircleOutline } from "@vicons/ionicons5";
import { DeleteOutlined } from "@vicons/material"
import service from '../../../requests/axios';
export default {
  name: "TomcatEdit",
   data() {
    return {
      id:"",
    };
  },
  props: {
  },
  components: {
    LogInIcon,AddCircleOutline,DeleteOutlined
  },
  created() {
    // console.log(this.$route.name,this.$route.params.tomcatName);
    this.getTest(this.$route.params.serverId);
    // console.log("created",this.model);
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const message = useMessage();
    // const handleDownload = (file) => {
    //   console.log(`下载成功：${file.name}`);
    // };
    const formRef = ref(null);
    const removeItem = (index) => {
      model.nodes.splice(index, 1);
    };
    const addItem = () => {
      // console.log("00model.nodes",model.nodes,)
      model.nodes.push(
        { 
          serverurl:"",
          lib_path:"",
          bin_path:"",
          attrs:{user:"",pwd:""}
        }
      );
    };
    const model = reactive({
        id:"",
        name: "",
        url:"",
        user:"",
        password:"",
        proj_type:1,
        nodes:[{
          serverurl:"",
          lib_path:"",
          bin_path:"",
          attrs:{user:"",pwd:""}
        }]
    });
    return {
      formRef,
      model,
      rules: {
          name: {
            required: true,
            message: "请输入",
            trigger: ["input"]
          },
      },
      options: [
        {
          label: "tomcat",
          value: 1,
        },
        {
          label:"tongweb",
          value: 2
        },
        {
          label:"bes",
          value: 3
        },
        {
          label:"apusic",
          value: 4
        },
        {
          label:"tas",
          value: 5
        },
        {
          label:"infors",
          value: 6
        },
        {
          label:"docker",
          value: 7
        }
      ],
      addItem,
      removeItem,
      handleSubmit(e) {
        formRef.value?.validate((errors) => {
          if (!errors) {
            if(formRef.value.model.name!=''){
              let flag = true;
              // console.log("formRef:",formRef.value.model);
              //先处理下节点服务器的部分  url格式的校验
              let bodydata = formRef.value.model;
              if(formRef.value.model.nodes){
                for(let i=0;i<formRef.value.model.nodes.length;i++){
                  let reg= /http:\/\/(.*?):(.*?)\/(.*?)\/(.*?)$/g;
                  let tomatch = reg.exec(formRef.value.model.nodes[i].serverurl);
                  // console.log("bodydata:",i,tomatch,333);
                  if(tomatch==null){
                    flag =false;
                    message.error(t("version.enginemanage.urlerr"), { duration: 5000 })
                  }else{
                    bodydata.nodes[i]={
                      ip :tomatch[1],
                      port :tomatch[2],
                      webapps:tomatch[3],
                      servlet:tomatch[4],
                      bin_path :formRef.value.model.nodes[i].bin_path,
                      lib_path:formRef.value.model.nodes[i].lib_path,
                      attrs:(formRef.value.model.proj_type==3?formRef.value.model.nodes[i].attrs:{})
                    };
                  }
                }
              }
              // 还有登录url格式的校验
              let reg= /http:\/\/(.*?):(.*?)\/(.*?)\/(.*?)$/g;
              let tomaturlch = reg.exec(formRef.value.model.url);
              if(tomaturlch==null){
                flag =false;
                message.error(t("version.enginemanage.urlerr"), { duration: 5000 })
              }
              // console.log("222 bodydata:",formRef.value.model.proj_type,bodydata);
              if(flag){
                //判断编辑还是新建
                // 编辑
                if(route.path.indexOf("edit")!=-1){
                  // console.log("shifou",route.path,route.params.scriptIdkey);
                  service.put('/loadtest/project/'+route.params.tomcatId,bodydata).then(res=>{             
                    message.success(t("common.updatesuc"));   
                    router.push({
                        path: '/version/engine/tomcat',
                    });             
                  }).catch(e=>{
                    // console.log("essrormessage",e.response.data);
                    // alert(e.response.data);
                    message.error(t("common.updateerr"));
                    router.push({
                        path: '/version/engine/tomcat',
                    });
                  });
                }
                //新建
                else{
                  //先新建条目
                  service.post('/loadtest/project',bodydata).then(res=>{
                    message.success(t("common.createsuc"));
                    router.push({
                    path: '/version/engine/tomcat',
                    });
                    // console.log("444",);
                      
                  }).catch(e=>{
                    // console.log("essrormessage",e.response.data);
                    // alert(e.response.data);
                    message.error(t("common.createerr"));
                    router.push({
                    path: '/version/engine/tomcat',
                    });  
                  });
                  
                }
              }
            }
          } else {
              console.log("errors",errors);
          }
        });

      },
      handleCancel(e){
        router.push({
          path: '/version/engine/tomcat',
        });
      },
    };
  },
  watch: {
    '$route'(to) {
      // 如果是创建测试
      if (to.name === 'tomcatCreate') {
        this.reload();
        return;
      }
      if (to.name !== 'tomcatEdit') {
        // this.nodeslist=[];
        this.id= to.params.tomcatId;
        return;
      }
      // this.getTest(to.params.tomcatId);
    }
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      this.getTest(this.$route.params.tomcatId);
      // console.log("1222222",this.model,this.$route.params.serverId);
    })
  },
  computed: {

  },
  methods: {
    getTest(tomcatId) {
      if (tomcatId!= undefined) {
        service.get('/loadtest/project/'+tomcatId).then(response=>{
          // console.log("getTest res:",response.data.data);
          if (response.data) {
            // 只能一个个赋值，不然不生效，即使是一样的结构
            // console.log("接口获取详细信息:",response.data.data);
            // this.model = response.data.data;
            // console.log("this.model:",this.model.proj_type);
            this.model.name = response.data.data.name;
            this.model.id = response.data.data.id;
            this.model.url = response.data.data.url;
            this.model.user = response.data.data.user;
            this.model.password = response.data.data.password;
            this.model.proj_type = response.data.data.proj_type;
            // console.log("this.model:",this.model.proj_type,response.data.data.proj_type);
            if(this.model.nodes){
              for(let i=0;i<response.data.data.nodes.length;i++){
                this.model.nodes[i]={
                  serverurl :'http://'+ response.data.data.nodes[i].ip+':'+response.data.data.nodes[i].port+'/'+response.data.data.nodes[i].webapps+'/'+response.data.data.nodes[i].servlet,
                  lib_path: response.data.data.nodes[i].lib_path,
                  bin_path: response.data.data.nodes[i].bin_path,
                  attrs : {
                    user : response.data.data.nodes[i].attrs.user??"",
                    pwd: response.data.data.nodes[i].attrs.pwd??""
                  }
                }
                // console.log("this.model2:",this.model.nodes[i].attrs);
              }
            }
          }
        })
      }
    },
  }
}
</script>
<style scoped>
.node_form_item{
  min-width:29% !important;
  margin-right: 10px;
  float: left;
}
</style>
