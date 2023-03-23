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
    <!-- ip 端口-->
    <n-grid :cols="24" :x-gap="24" style="margin:25px 0 0px">
      <n-form-item-gi :span="9" :label="$t('version.enginemanage.serverip')"  path="ip" >
        <n-input v-model:value="model.ip" clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="9" :label="$t('version.enginemanage.serverport')"  path="port" >
        <n-input v-model:value="model.port" clearable />
      </n-form-item-gi> 
    </n-grid>
    <!-- 用户名 密码-->
    <n-grid :cols="24" :x-gap="24" >
      <n-form-item-gi :span="9" :label="$t('version.enginemanage.osname')"  path="username" >
        <n-input v-model:value="model.username" clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="9" :label="$t('version.enginemanage.ospasswd')"  path="password" >
        <n-input v-model:value="model.password" type="password" clearable />
      </n-form-item-gi> 
    </n-grid>
    <!-- 最大并发数 -->
    <n-grid :cols="24" :x-gap="24" >
      <n-form-item-gi  :span="9" :label="$t('version.enginemanage.serverthreads')"  path="threads" >
        <n-input-number v-model:value="model.threads" clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="9" :label="$t('version.enginemanage.agent_resource_url')"  path="username" >
        <n-select v-model:value="model.agent_resource_url" tag  filterable :options="resourceoptions" />
      </n-form-item-gi>
    </n-grid>
    <!-- 机器类型 -->
    <n-grid :cols="24" :x-gap="24" >
      <n-form-item-gi :span="9" :label="$t('version.enginemanage.servertype')"  path="type" >
        <n-select v-model:value="model.type" multiple :options="options" />
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>
<script>
// import axios from 'axios';
import { h, defineComponent, ref,reactive,  } from "vue";
import { RouterLink,useRoute ,useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useMessage, } from "naive-ui";
import { LogInOutline as LogInIcon } from "@vicons/ionicons5";
import service from '../../../requests/axios';
import { isValid } from "date-fns";

export default {
  name: "ServerEdit",
  data() {
    return {
      id:"",
    };
  },
  props: {
  },
  components: {
    LogInIcon
  },
  created() {
    // console.log(this.$route.name,this.$route.params.tomcatName);
    // this.getTest(this.$route.params.serverId);
    console.log("created",this.model);
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
    const model = reactive({
        name: "",
        ip:"",
        port:"",
        username:"",
        password:"",
        threads:0,// 预计并发数
        type:[],
        agent_resource_url:"http://192.168.101.21",
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
            // type: {
            //   required: true,
            //   message: "请输入",
            //   trigger: ["input"]
            // },
        },
        options: [
          {
            label: t("version.enginemanage.asserver"),
            value: "server",
          },
          {
            label: t("version.enginemanage.asperfor"),
            value: "stress"
          },
        ],
        resourceoptions:[
          {
            label: "http://192.168.101.21",
            value: "http://192.168.101.21",
          },
          {
            label: "https://qa.fineres.com",
            value: "https://qa.fineres.com"
          },
        ],
        handleSubmit(e) {
          formRef.value?.validate((errors) => {
            if (!errors) {
              if(formRef.value.model.name!=''){
                console.log("formRef:",formRef.value.model)
                //判断编辑还是新建
                //编辑
                if(route.path.indexOf("edit")!=-1){
                  // console.log("shifou",route.path,route.params.scriptIdkey);
                  service.put('/loadtest/machines/'+route.params.serverId,formRef.value.model).then(res=>{             
                    message.success(t("common.updatesuc"));   
                    router.push({
                        path: '/version/engine/server',
                    });             
                  }).catch(e=>{
                    // console.log("essrormessage",e.response.data);
                    // alert(e.response.data);
                    message.error(t("common.updateerr"));
                    router.push({
                        path: '/version/engine/server',
                    });
                  });
                }
                //新建
                else{
                  //先新建条目
                  service.post('/loadtest/machines',formRef.value.model).then(res=>{
                    message.success(t("common.createsuc"));
                    router.push({
                    path: '/version/engine/server',
                    });
                    console.log("444",);
                      
                  }).catch(e=>{
                    // console.log("essrormessage",e.response.data);
                    // alert(e.response.data);
                    message.error(t("common.createerr"));
                    router.push({
                    path: '/version/engine/server',
                    });  
                  });
                  
                }
              }
            } else {
                console.log("errors",errors);
            }
              // 

              // 
          });

        },
        handleCancel(e){
          router.push({
            path: '/version/engine/server',
          });
        },
    };
  },
  watch: {
    '$route'(to) {
      // 如果是创建测试
      if (to.name === 'serverCreate') {
        this.reload();
        return;
      }
      if (to.name !== 'serverEdit') {
        // this.nodeslist=[];
        this.id= to.params.serverId;
        return;
      }
      // this.getTest(to.params.serverId);
    }
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      this.getTest(this.$route.params.serverId);
      // console.log("1222222",this.model,this.$route.params.serverId);
    })
  },
  computed: {

  },
  methods: {
    getTest(serverId) {
      if (serverId!= undefined) {
        service.get('/loadtest/machines/'+serverId).then(response=>{
          // console.log("getTest res:",response.data.data);
          if (response.data) {
              // 只能一个个赋值，不然不生效，即使是一样的结构
              // console.log("接口获取详细信息:",response.data.data);
              // this.model = response.data.data;
              this.model.name = response.data.data.name;
              this.model.ip = response.data.data.ip;
              this.model.port = response.data.data.port;
              this.model.username = response.data.data.username;
              this.model.password = response.data.data.password;
              this.model.type = response.data.data.type;
              this.model.threads = response.data.data.threads;
              this.model.agent_resource_url = response.data.data.agent_resource_url??"";
          }
        })
      }
    },
  }
}
</script>
<style scoped>
</style>
