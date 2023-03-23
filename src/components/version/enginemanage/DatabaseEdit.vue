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
      <n-form-item-gi :span="12" :label="$t('version.enginemanage.sqlcname')"  path="name" style="font-weight: bold;">
        <n-input v-model:value="model.name" :placeholder="$t('perfor.script.namevalue')"  clearable />
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
      <n-form-item-gi :span="9" :label="$t('version.enginemanage.sqlip')"  path="ip" >
        <n-input v-model:value="model.ip" :on-blur="changeip" clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="9" :label="$t('version.enginemanage.sqlport')"  path="port" >
        <n-input v-model:value="model.port" :on-blur="changeport" clearable />
      </n-form-item-gi> 
    </n-grid>
    <!-- 用户名 密码-->
    <n-grid :cols="24" :x-gap="24" >
      <n-form-item-gi :span="9" :label="$t('version.enginemanage.osname')"  path="username" >
        <n-input v-model:value="model.username" :on-blur="changeusername" clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="9" :label="$t('version.enginemanage.ospasswd')"  path="password" >
        <n-input v-model:value="model.password" type="password" :on-blur="changepasswd" clearable />
      </n-form-item-gi> 
    </n-grid>
    <!-- 数据库名字 -->
    <n-grid :cols="24" :x-gap="24" >
        <n-form-item-gi  :span="9" :label="$t('version.enginemanage.sqlname')"  path="sqlname" >
        <n-input v-model:value="model.sqlname" :on-blur="changesqlname" clearable />
        </n-form-item-gi>
    </n-grid>
    <!-- 数据库类型 -->
    <n-grid :cols="24" :x-gap="24" >
        <n-form-item-gi :span="9" :label="$t('version.enginemanage.sqltype')"  path="sqltype" >
        <n-select v-model:value="model.type" :options="options" :on-blur="changesqltype" />
        </n-form-item-gi>
    </n-grid>
    <n-form-item  :label="$t('version.enginemanage.sqlurl')"  path="sqlurl" >
        <n-input v-model:value="model.sqlurl" :on-blur="changesqlurl" clearable />
    </n-form-item>
  </n-form>
</template>
<script>
// import axios from 'axios';
import { h, defineComponent, ref,reactive,  } from "vue";
import { RouterLink,useRoute ,useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useMessage, } from "naive-ui";
import { LogInOutline as LogInIcon } from "@vicons/ionicons5";
import service from '../../../requests/axios';

export default {
  name: "DatabaseEdit",
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
    this.getTest(this.$route.params.databaseId);
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
        sqlname:"",
        type:"",
        sqlurl:"",
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
            sqlurl:{
                // validator(rule, value) {
                //     // if (!/^\d*$/.test(value)) {
                //     if(!/(.*?):(.*?):(.*?)@tcp\((.*?):(.*?)\)\/(.*?)$/.test(value)){
                //         return new Error(t("common.sqlurlerrtip"));
                //     }else if(value.substring(0,4)=="jdbc"){
                //         return new Error(t("common.sqlurlerrtip"));
                //     }
                //     return true;
                // },
                // trigger: ["input", "blur"]
            }
        },
        options: [
          {
            label: "mysql",
            value: "mysql",
          },
          {
            label: "mariadb",
            value: "mariadb"
          },
          {
            label: "tidb",
            value: "tidb"
          },
        ],
        handleSubmit(e) {
          formRef.value?.validate((errors) => {
            if (!errors) {
              if(formRef.value.model.name!=''){
                console.log("formRef:",formRef.value.model);
                let reg= /(.*?):(.*?):(.*?)@tcp\((.*?):(.*?)\)\/(.*?)$/g;
                let tomatch = reg.exec(formRef.value.model.sqlurl);
                // if(!tomatch){
                //     message.error(t("common.sqlurlerrtip"));
                // }else{
               
                
                //判断编辑还是新建
                //编辑
                if(route.path.indexOf("edit")!=-1){
                  console.log("bianji",)
                  let connection1 = formRef.value.model.type+":"+formRef.value.model.username+":"+formRef.value.model.password+"@tcp("+formRef.value.model.ip+":"+formRef.value.model.port+")/"+formRef.value.model.sqlname;
                  let formdata = new FormData();
                  formdata.append('name', formRef.value.model.name);
                //   formdata.append('connection', formRef.value.model.sqlurl);
                  formdata.append('connection', connection1);
                  // console.log("shifou",route.path,route.params.scriptIdkey);
                  service.put('/loadtest/connections/'+route.params.databaseId,formdata).then(res=>{             
                    message.success(t("common.updatesuc"));   
                    router.push({
                        path: '/version/engine/database',
                    });             
                  }).catch(e=>{
                    // console.log("essrormessage",e.response.data);
                    // alert(e.response.data);
                    message.error(t("common.updateerr"));
                    router.push({
                        path: '/version/engine/database',
                    });
                  });
                }
                //新建
                else{
                  let connection1 = formRef.value.model.type+":"+formRef.value.model.username+":"+formRef.value.model.password+"@tcp("+formRef.value.model.ip+":"+formRef.value.model.port+")/"+formRef.value.model.sqlname;
                  let formdata = new FormData();
                  formdata.append('name', formRef.value.model.name);
                  formdata.append('connection', connection1);
                  //先新建条目
                  service.post('/loadtest/connections',formdata).then(res=>{
                    message.success(t("common.createsuc"));
                    router.push({
                    path: '/version/engine/database',
                    });
                    console.log("444",);
                      
                  }).catch(e=>{
                    // console.log("essrormessage",e.response.data);
                    // alert(e.response.data);
                    message.error(t("common.createerr"));
                    router.push({
                    path: '/version/engine/database',
                    });  
                  });
                  
                }

                // }
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
            path: '/version/engine/database',
          });
        },
        changesqlurl(){
        console.log("ip",formRef.value.model.ip);
        let reg= /(.*?):(.*?):(.*?)@tcp\((.*?):(.*?)\)\/(.*?)$/g;
        let tomatch = reg.exec(formRef.value.model.sqlurl);
        // if(this.model.sqlurl.substring(0,4)!="jdbc"){
        if(tomatch){
            formRef.value.model.ip = tomatch[4];
            formRef.value.model.port = tomatch[5];
            formRef.value.model.username = tomatch[2];
            formRef.value.model.password = tomatch[3];
            formRef.value.model.type = tomatch[1];
            formRef.value.model.sqlname = tomatch[6];
        // console.log("ip",this.model.ip);
        }else{
            message.error("url格式错误，正确格式参考：mysql:用户:密码@tcp(ip:port)/库名");
            // alert("common.sqlurlerrtip")
        }
    },
    };
  },
  watch: {
    '$route'(to) {
      // 如果是创建测试
      if (to.name === 'databaseCreate') {
        this.reload();
        return;
      }
      if (to.name !== 'databaseEdit') {
        // this.nodeslist=[];
        this.id= to.params.databaseId;
        return;
      }
      this.getTest(to.params.databaseId);
    },
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      this.getTest(this.$route.params.databaseId);
      // console.log("1222222",this.model,this.$route.params.serverId);
    })
  },
  computed: {

  },
  methods: {
    getTest(databaseId) {
      if (databaseId!= undefined) {
        service.get('/loadtest/connections/'+databaseId).then(response=>{
            // console.log("getTest res:",response.data.data);
            if (response.data) {
                let reg= /(.*?):(.*?):(.*?)@tcp\((.*?):(.*?)\)\/(.*?)$/g;
                let tomatch = reg.exec(response.data.data.connection);
                // 只能一个个赋值，不然不生效，即使是一样的结构
                console.log("接口获取详细信息:",response.data.data);
                // this.model = response.data.data;
                this.model.name = response.data.data.name;
                this.model.ip = tomatch[4];
                this.model.port = tomatch[5];
                this.model.username = tomatch[2];
                this.model.password = tomatch[3];
                this.model.type = tomatch[1];
                this.model.sqlname = tomatch[6];
                this.model.sqlurl= this.model.type+":"+this.model.username+":"+this.model.password+"@tcp("+this.model.ip+":"+this.model.port+")/"+this.model.sqlname;
                // console.log("this.model:",this.model);
            }
        })
      }
    },
    changeip(){
        // console.log("ip",this.model.ip);
        this.model.sqlurl= this.model.type+":"+this.model.username+":"+this.model.password+"@tcp("+this.model.ip+":"+this.model.port+")/"+this.model.sqlname;
    },
    changeport(){
        this.model.sqlurl= this.model.type+":"+this.model.username+":"+this.model.password+"@tcp("+this.model.ip+":"+this.model.port+")/"+this.model.sqlname;
    },
    changeusername(){
        this.model.sqlurl= this.model.type+":"+this.model.username+":"+this.model.password+"@tcp("+this.model.ip+":"+this.model.port+")/"+this.model.sqlname;
    },
    changepasswd(){
        this.model.sqlurl= this.model.type+":"+this.model.username+":"+this.model.password+"@tcp("+this.model.ip+":"+this.model.port+")/"+this.model.sqlname;
    },
    changetype(){
        this.model.sqlurl= this.model.type+":"+this.model.username+":"+this.model.password+"@tcp("+this.model.ip+":"+this.model.port+")/"+this.model.sqlname;
    },
    changesqlname(){
        this.model.sqlurl= this.model.type+":"+this.model.username+":"+this.model.password+"@tcp("+this.model.ip+":"+this.model.port+")/"+this.model.sqlname;
    },
    changesqltype(){
        this.model.sqlurl= this.model.type+":"+this.model.username+":"+this.model.password+"@tcp("+this.model.ip+":"+this.model.port+")/"+this.model.sqlname;
    },
  }
}
</script>
<style scoped>
</style>
