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
      <n-form-item-gi :span="12" :label="$t('version.versionnode.versionname')"  path="name" style="font-weight: bold;">
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
    <!-- 版本选择 版本发布时间 -->
    <n-grid :cols="24" :x-gap="24" style="margin-top:25px">
      <n-form-item-gi :span="5" :label="$t('version.versionnode.bigversion')"  path="bigversion" >
        <n-select v-model:value="model.version" :options="options" />
      </n-form-item-gi>
      <n-form-item-gi :span="7" :label="$t('version.versionnode.minorversion')"  path="minorversion" >
        <n-input v-model:value="model.minor_version"  clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="7" :label="$t('version.versionnode.minorversiondate')"  >
        <n-date-picker v-model:value="model.version_publish_date" type="datetime" clearable />
      </n-form-item-gi>
    </n-grid>
    <!-- 移动端解决版本-->
    <n-grid :cols="24" :x-gap="24" style="margin-bottom:15px">
      <n-form-item-gi :span="9" :label="$t('version.versionnode.mobileminorversion')"  >
        <n-input v-model:value="model.mobile_version"  clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="4"  style="color:#bfd7ca" >{{$t('version.versionnode.mobiletips')}}
        <!-- <n-date-picker v-model:value="model.version_publish_date" type="datetime" clearable /> -->
      </n-form-item-gi>
      
    </n-grid>
    <!-- 版本提醒人 -->
    <!-- <n-grid :cols="24" :x-gap="24">
      <n-form-item-gi :span="18" :label="$t('version.versionnode.notify_users')"  path="bigversion" >
        <n-select v-model:value="model.notify_users" 
          :options="notifyoptions"
          clearable
          filterable
          multiple
        />
      </n-form-item-gi>
    </n-grid> -->
    <!-- 各个节点信息录入 -->
    <h3 style="margin-top:-5px;color: #333333;">{{$t('version.iterate.stageinput')}}</h3> 
    <!-- 增加的按钮 -->
    <n-form-item>
      <n-space>
        <n-button attr-type="button" @click="addItem" style="margin-left:15px;">
          {{$t('version.iterate.stageadd')}}
        </n-button>
      </n-space>
    </n-form-item>
    <!-- 显示的列表 -->
    <n-form
      v-for="(item, index) in model.stages"
      inline
      :show-label="(index==0?ture:false)"
      :key="index"   
      style="margin-left:15px;"
    >
      <n-form-item :path="`stages[${index}].stage`" :label="$t('version.versionnode.stagename')">
        <n-select v-model:value="item.stage" 
          :options="stageoptions"
          :loading="loading"
          clearable
          filterable
          remote />
      </n-form-item>
      
      <n-form-item :path="`stages[${index}].start_date`" :label="$t('common.start_date')">
        <n-date-picker v-model:value="item.start_date" type="date" clearable />
      </n-form-item>
      <n-form-item :path="`stages[${index}].end_date`" :label="$t('common.end_date')">
        <!-- @update:value="toChangeNotifyAt" -->
        <n-date-picker v-model:value="item.end_date" type="date" @update:value="toChangeNotifyAt" clearable />
      </n-form-item>
      <n-form-item :path="`stages[${index}].notify_date`" :label="$t('version.versionnode.notify_date')">
        <n-date-picker v-model:value="item.notify_date" type="date"  clearable/>
      </n-form-item>
      <!-- <n-form-item :path="`stages[${index}].notify_users`" :label="$t('version.versionnode.notify_users')" style="width:200px;">
        <n-select v-model:value="item.notify_users" 
          :options="notifyoptions"
          clearable
          filterable
          multiple
         />
      </n-form-item> -->
      <n-form-item >
        <n-button  @click="removeItem(index)">{{$t('common.delete')}}</n-button>
      </n-form-item>
    </n-form>
  </n-form>
</template>
<script>
// import axios from 'axios';
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRoute ,useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useMessage, } from "naive-ui";
import { inject } from 'vue'
import { LogInOutline as LogInIcon } from "@vicons/ionicons5";
import service from '../../../requests/axios';
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from "@vicons/ionicons5";
import httpRequest from '../../../requests/axios'

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
export default {
  name: "VersionEdit",
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
    // this.getTest(this.$route.params.versionId);
    // console.log("created",this.model);
    // console.log("username22222222222",this.username)
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
      model.stages.splice(index, 1);
    };
    const addItem = () => {
      console.log("00model.stages",model.stages,)
      model.stages.push(
        { 
          stage:undefined,
          start_date:Date.now(),
          end_date:Date.now(),
          notify_date:Date.now()+259200000,
          notify_users:[]
        }
      );
    };
    const model = reactive({
      name: "",
      version:"",
      minor_version:"",
      mobile_version:"",
      version_publish_date:undefined,
      // notify_users:["Lipei"],
      notify_users:["Daniel123"],
      stages:[{
        stage:undefined,
        // start_date:Date.now(),
        // end_date:Date.now(),
        // notify_date:Date.now(),
        start_date:undefined,
        end_date:undefined,
        notify_date:undefined,
        notify_users:[]
      }]
    });
    const loadingRef = ref(false);
    const notifyoptionsRef = ref([]);
    const stageoptionsRef = ref([]);
    function querynotifyusers () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var notifyoptions = [];
        // 获取用户列表
        service.get('/user/list').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            notifyoptions.push({label:data1[i].user,value:data1[i].user});
            // console.log("11",rowjson,data1[i].tags)
          }
          setTimeout(
            () =>
              resolve({
                data: notifyoptions,
              }),
            100
          )
        });
        
      })
    }
    function querystage () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var stageoptions = [];
        // 获取用户列表
        service.get('/dashboard/version/config/stages').then(res=>{
          stageoptions = res.data.data;
          setTimeout(
            () =>
              resolve({
                data: stageoptions,
              }),
            100
          )
        });
        
      })
    }
    onMounted(() => {
      querynotifyusers().then((data) => {
        notifyoptionsRef.value = data.data;
        // console.log("notifyoptionsRef",data.data);
        // loadingRef.value = false
      });
      querystage().then((data) => {
        stageoptionsRef.value = data.data
        // loadingRef.value = false
      })
    })
    return {
        loading: loadingRef,
        formRef,
        model,
        notifyoptions:notifyoptionsRef,
        stageoptions:stageoptionsRef,
        rules: {
          name: {
            required: true,
            message: "请输入",
            trigger: ["input"]
          },
          version_publish_date:{
            required: true,
            message: "请输入",
            trigger: ["input"]
          }
        },
        options: [
          {
            label: "10.0",
            value: "10.0",
          },
          {
            label: "11.0",
            value: "11.0"
          },
        ],
        addItem,
        removeItem,
        toChangeNotifyAt(v){
          for(let i=0;i<formRef.value.model.stages.length;i++){
            if(formRef.value.model.stages[i].end_date == v){
              formRef.value.model.stages[i].notify_date = v - 259200000;//3天
              // break;
            }
          }
        },
        handleSubmit(e) {
          formRef.value?.validate((errors) => {
            // let endtime = new Date(formRef.value.model.stages[0].end_date);
            // let y=endtime.getFullYear();
            // let m=endtime.getMonth()+1;
            // let d=endtime.getDate();
            // let others = " 00:00:00";
            // let aaa = y+'-'+add0(m)+'-'+add0(d)+others;
            // console.log("datessss:",endtime,typeof(endtime),aaa);
            if (!errors) {
              let flag = false;
              // console.log("len",formRef.value.model.stages.length,stageoptionsRef.value.length);
              if(formRef.value.model.version.indexOf("11")!=-1 && formRef.value.model.minor_version.split(".").length==3 ){
                // console.log("len1");
                if(formRef.value.model.stages.length < stageoptionsRef.value.length){
                  message.error( t("version.versionnode.ifstagelen"), { duration: 5000 });
                }else{
                  flag = true;
                }
              }else if( formRef.value.model.version.indexOf("10")!=-1 ||(formRef.value.model.version.indexOf("11")!=-1 && formRef.value.model.minor_version.split(".").length>3 )){
                // console.log("len2");
                if(formRef.value.model.stages.length < 3){
                  message.error( t("version.versionnode.ifstagelen"), { duration: 5000 });
                }else{
                  flag = true;
                }
              }
              if(flag== true){
                if(formRef.value.model.name!=''){
                  console.log("formRef:",formRef.value.model)
                  let formlist = formRef.value.model;
                  let bodydata = {
                    minor_version:formlist.minor_version,
                    mobile_version:formlist.mobile_version,
                    version:formlist.version,
                    version_publish_date:JSON.parse(JSON.stringify(formlist.version_publish_date)),
                    name:formlist.name,
                    notify_users:formlist.notify_users,
                    stages: JSON.parse(JSON.stringify(formlist.stages)),
                  };
                  // 先处理下时间戳和字符串的转换
                  let publishdate = new Date(Number(formlist.version_publish_date));
                  let yp=publishdate.getFullYear()+ '-';
                  let mp=(publishdate.getMonth()+1 < 10 ? '0' + (publishdate.getMonth() + 1) : publishdate.getMonth() + 1) + '-';
                  let dp=publishdate.getDate()+ ' ';
                  let hp = publishdate.getHours() + ':';
                  let minp = publishdate.getMinutes() + ':';
                  let sp = publishdate.getSeconds();
                  bodydata.version_publish_date = yp+mp+dp+hp+minp+sp;
                  for(let i=0;i<formlist.stages.length;i++){
                    let endtime = new Date(Number(formlist.stages[i].end_date));
                    let starttime = new Date(Number(formlist.stages[i].start_date));
                    let notifytime = new Date(Number(formlist.stages[i].notify_date));
                    let y=endtime.getFullYear()+ '-';
                    let m=(endtime.getMonth()+1 < 10 ? '0' + (endtime.getMonth() + 1) : endtime.getMonth() + 1) + '-';
                    let d=endtime.getDate()+ ' ';
                    let others = "16:00:00";
                    let ys=starttime.getFullYear()+ '-';
                    let ms=(starttime.getMonth()+1 < 10 ? '0' + (starttime.getMonth() + 1) : starttime.getMonth() + 1) + '-';
                    let ds=starttime.getDate()+ ' ';
                    let yn=notifytime.getFullYear()+ '-';
                    let mn=(notifytime.getMonth()+1 < 10 ? '0' + (notifytime.getMonth() + 1) : notifytime.getMonth() + 1) + '-';
                    let dn=notifytime.getDate()+ ' ';
                    bodydata.stages[i].end_date = y+m+d+others;
                    // console.log( y+m+d+ h + mm + s)
                    bodydata.stages[i].start_date = ys+ms+ds+others;
                    bodydata.stages[i].notify_date = yn+mn+dn+others;
                    // console.log("shifou",typeof(endtime),endtime,y,m,d, bodydata.stages[i].end_date);
                  }
                  //判断编辑还是新建
                  //编辑
                  if(route.path.indexOf("edit")!=-1){
                    // console.log("shifou",typeof(bodydata.stages[0].end_date),bodydata.stages[0].end_date,bodydata);
                    service.put('/dashboard/version/'+route.params.versionId,bodydata).then(res=>{      
                      if(res.data.message!=""){
                        message.error(t("common.updateerr")+":"+res.data.message);
                      }else{      
                        message.success(t("common.updatesuc"));   
                      }   
                      router.push({
                        path: '/version/version',
                      });         
                    }).catch(e=>{
                      // console.log("essrormessage",e.response.data);
                      // alert(e.response.data);
                      message.error(t("common.updateerr"));
                      router.push({
                        path: '/version/version',
                      });
                    });
                  }
                  //新建
                  else{
                    //先新建条目
                    service.post('/dashboard/version',bodydata).then(res=>{
                      if(res.data.message!=""){
                        message.error(t("common.createerr")+":"+res.data.message);
                      }else{      
                        message.success(t("common.createsuc"));   
                      }    
                      router.push({
                        path: '/version/version',
                      }); 
                        
                    }).catch(e=>{
                      // console.log("essrormessage",e.response.data);
                      // alert(e.response.data);
                      message.error(t("common.createerr"));
                      router.push({
                      path: '/version/version',
                      });  
                    });
                  }
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
            path: '/version/version',
          });
        },
    };
  },
  watch: {
    '$route'(to) {
      // 如果是创建测试
      if (to.name === 'versionCreate') {
        this.reload();
        return;
      }
      if (to.name !== 'versionEdit') {
        // this.nodeslist=[];
        this.id= to.params.versionId;
        return;
      }
      this.getTest(to.params.versionId);
    }
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      this.getTest(this.$route.params.versionId);
      // console.log("1222222",this.model,this.$route.params.serverId);
      // this.getusername();
    })
  },
  computed: {

  },
  methods: {
    getTest(versionId) {
      if (versionId!= undefined) {
        service.get('/dashboard/version/'+versionId).then(response=>{
            // console.log("getTest res:",response.data.data);
            if (response.data) {
              // 只能一个个赋值，不然不生效，即使是一样的结构
              // console.log("接口获取详细信息:",response.data.data);
              // this.model = response.data.data;
              this.model.name = response.data.data.name;
              this.model.version = response.data.data.version;
              this.model.minor_version = response.data.data.minor_version;
              this.model.mobile_version = response.data.data.mobile_version;
              // this.model.version_publish_date = response.data.data.version_publish_date;
              // this.model.notify_users = response.data.data.notify_users;
              this.model.notify_users.push("Daniel123");
              this.model.stages = response.data.data.stages;
              let stageslist = response.data.data.stages;
              let reg = /^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/;
              // console.log("this.model:",this.model);
              let publish  = response.data.data.version_publish_date.match(reg);
              this.model.version_publish_date = Date.parse(new Date(publish[1],publish[2] - 1,publish[3],publish[4],publish[5],publish[6]));
              for(let i=0;i<stageslist.length;i++){
                let ends  = response.data.data.stages[i].end_date.match(reg);
                let sstart = response.data.data.stages[i].start_date.match(reg);
                let snotify = response.data.data.stages[i].notify_date.match(reg);
                if(ends && sstart && snotify){
                  this.model.stages[i].end_date = Date.parse(new Date(ends[1],ends[2] - 1,ends[3],ends[4],ends[5],ends[6]));
                  this.model.stages[i].start_date = Date.parse(new Date(sstart[1],sstart[2] - 1,sstart[3],sstart[4],sstart[5],sstart[6])); 
                  this.model.stages[i].notify_date = Date.parse(new Date(snotify[1],snotify[2] - 1,snotify[3],snotify[4],snotify[5],snotify[6]));      
                }
              }
              // let result="";
              // if(s){
              //   result = Date.parse(new Date(s[1],s[2] - 1,s[3],s[4],s[5],s[6]));                              
              // }
              // console.log("this.dates:",this.model.stages);

              // console.log("this.dates:",typeof(response.data.data.stages[0].end_date),response.data.data.stages[0].end_date);
              
            }
        })
      }
    },
    // getusername(){
    //   let newname = "";
    //   service.get('/user/current').then(res=>{
    //     newname = res.data.data.username;
    //     // formRef.value.model.notify_users = newname;
    //     this.model.notify_users.push(newname);
    //     // console.log("username22222",this.model);
    //     // this.username = "@ "+newname;
    //     // return username;
    //   }).catch(e=>{
    //     console.log("essrormessage",e);
    //     this.username  = "err";
    //   });
    // },
  }
}
</script>
<style scoped>
</style>
