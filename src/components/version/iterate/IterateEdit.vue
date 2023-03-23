<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-align="left"
    label-placement="top"
    label-width="auto"
    require-mark-placement="right-hanging"
    size="medium"
    :style="{
      maxWidth: '2400px',
      minWidth: '850px',
      padding: '20px 10px',
    }"
  >
    <!-- 名称和保存取消按钮 -->
    <n-grid :cols="24" :x-gap="24" style="border-bottom:2px dotted #bfd7ca">
      <n-form-item-gi :span="14" :label="$t('version.iterate.work_id')" label-placement="left" label-width="100"  path="name" style="font-weight: bold;">
        <n-input v-model:value="model.work_id" :placeholder="$t('perfor.script.namevalue')+' , '+$t('version.iterate.work_id_tips')" clearable />
        <n-button attr-type="button" @click="handleSubmit" type="primary" strong secondary style="margin:0 20px">
            {{$t('common.save')}}
        </n-button>
        <n-button attr-type="button" @click="handleCancel" type="warning" strong secondary>
            {{$t('common.cancel')}}
        </n-button>
      </n-form-item-gi>
    </n-grid>
    <!-- 基本信息 -->
    <h3 style="margin:30px 0 -5px;color: #333333;;">{{$t('version.nodewatch.details.basic')}}</h3> 
    <!-- excel修改项 -->
    <!-- aaa和 bbb 控制margin  ccc 和 ddd 控制宽度：换行-->
    <n-form inline style="width: auto !important;"
      v-for="(item, index) in model.imported_fields" :key="index"
      :class="[(index !=0 && index !=4 &&index !=19)?'aaa':'bbb',(index !=18 && index !=12)?'ccc':'ddd']"
    >
      <!-- 普通文本输入 -->
      <template v-if="(index !=0 && index !=4 && index < 12) ">
        <n-form-item :label="item.name" >
          <n-input v-model:value="item.value"  clearable />
        </n-form-item>
      </template>
      <!-- 输入内容较多 ：模块影响、变更申请-->
      <template v-if="index ==18  || index==12">
        <n-form-item :label="item.name" >
          <n-input v-model:value="item.value" style="min-width:700px;" clearable />
        </n-form-item>
      </template>
      <!-- 产研测人选 -->
      <template v-if="(index <18 && index >= 13)">
        <n-form-item :label="item.name" >
          <n-select v-model:value="item.value"  :style="(index ==16 || index ==17 )?'min-width:300px;':'min-width:150px;'"
            :options="notifyoptions" clearable filterable multiple />
        </n-form-item>
      </template>
    </n-form>
    <!-- 版本选择 版本提醒人-->
    <n-grid :cols="24" :x-gap="24" style="margin-left: 15px;margin-top: 20px;" >
      <n-form-item-gi :span="4" :label="$t('version.versionnode.minorversion')"  >
        <n-select v-model:value="model.version_id"  clearable filterable
          :options="minoroptions" :on-update:value="update_version"
          :placeholder="$t('version.versionnode.searchversion')"
        />
      </n-form-item-gi>
      <n-form-item-gi :span="10" :label="$t('version.versionnode.notify_users')"   >
        <n-select v-model:value="model.notify_users" clearable filterable multiple
          :options="notifyoptions"
         />
      </n-form-item-gi>
     
    </n-grid>
    <!-- 参考信息 控制显示隐藏 -->
    <div v-show="ifshow">
      <h3 style="margin:-5px  0px 10px;color: grey;">{{$t('version.iterate.stagestandard')}}</h3> 
      <!-- 展示版本标准信息 -->
      <n-form
        v-for="(item, index) in model.stages_standard"  
        inline
        :show-label="(index==0?ture:false)"
        :key="index"  
        size="small" 
        style="margin-left:15px;"
      >
        <n-form-item :path="`stages[${index}].stage`" :label="$t('version.versionnode.stagename')" style="min-width:200px;">
          <!-- <n-input v-model:value="item.stage"  clearable :disabled="true" /> -->
          <n-select v-model:value="item.stage" 
            :options="s_stageoptions"
            :disabled="true"
            style="min-width:200px;color: grey;"
          />
        </n-form-item>
        <n-form-item :path="`stages[${index}].start_date`" :label="$t('common.start_date')" >
          <n-input v-model:value="item.start_date" clearable :disabled="true" />
        </n-form-item>
        <n-form-item :path="`stages[${index}].end_date`" :label="$t('common.end_date')">
          <n-input v-model:value="item.end_date"  clearable :disabled="true" />
        </n-form-item>
        <n-form-item :path="`stages[${index}].notify_date`" :label="$t('version.versionnode.notify_date')">
          <n-input v-model:value="item.notify_date" clearable :disabled="true" />
        </n-form-item>
      </n-form>
    </div>
    <!-- 各个节点信息录入 -->
    <h3 style="margin-top:15px;color: #333333;;">{{$t('version.iterate.stageinput')}}</h3> 
    <!-- 增加的按钮 -->
    <n-form-item style="margin-top: -20px;">
      <n-button attr-type="button" @click="addItem" strong secondary round  size="small" type="primary" style="margin-left:15px;">
        <template #icon>
          <n-icon><AddCircleOutline /></n-icon>
        </template>
        {{$t('version.iterate.stageadd')}}
      </n-button>
      <!-- 展开选项按钮 -->
      <n-button :disabled="model.version_id!=''?false:true" strong secondary round size="small" type="primary"  @click="upversionstd"  style="margin-left:20px;"   >
        {{ifshow?$t('version.iterate.getversionstd2'):$t('version.iterate.getversionstd1')}}
      </n-button>
    </n-form-item>
    
    <!-- 显示的列表 -->
    <n-form
      v-for="(item, index) in model.stages"
      inline
      :show-label="(index==0?ture:false)"
      :key="index"   
      style="margin-left:15px;"
    >
      <n-form-item :path="`stages[${index}].stage`" :label="$t('version.versionnode.stagename')" >
        <n-select v-model:value="item.stage" 
          :options="stageoptions"
          clearable
          filterable
          style="min-width:200px;"
        />
      </n-form-item>
      <!-- <n-form-item :path="`stages[${index}].start_date`" :label="$t('common.start_date')" style="min-width:200px;">
        <n-date-picker v-model:value="item.start_date" type="date" clearable />
      </n-form-item> -->
      <n-form-item :path="`stages[${index}].end_date`" :label="$t('common.end_date')">
        <n-date-picker v-model:value="item.end_date" type="date"  @update:value="toChangeNotifyAt" clearable />
      </n-form-item>
      <n-form-item :path="`stages[${index}].notify_date`" :label="$t('version.versionnode.notify_date')">
        <n-date-picker v-model:value="item.notify_date" type="date" clearable/>
      </n-form-item>
      <n-form-item :path="`stages[${index}].notify_users`" :label="$t('version.versionnode.notify_users')" style="min-width:200px;">
        <n-select v-model:value="item.notify_users"  disabled
          :options="notifyoptions"
          clearable
          filterable
          multiple
        />
      </n-form-item>
      <n-form-item >
        <n-button  @click="removeItem(index)">{{$t('common.delete')}}</n-button>
      </n-form-item>
    </n-form>
  </n-form>
</template>
<script>
// import axios from 'axios';
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { useRoute ,useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useMessage, } from "naive-ui";
import { inject } from 'vue'
import { LogInOutline as LogInIcon ,AddCircleOutline} from "@vicons/ionicons5";
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
  name: "IterateEdit",
  data() {
    return {
      iid:"",
    };
  },
  props: {
  },
  components: {
    LogInIcon,AddCircleOutline
  },
  created() {
    var ifimported = false;
    // console.log(this.$route.name,this.$route.params.iterateId);
    if(this.$route.params.iterateId!=undefined){
      ifimported = true;
      this.getTest(this.$route.params.iterateId);
    }else
      ifimported = false;
      // console.log("lalala");
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const message = useMessage();
    // const handleDownload = (file) => {
    //   console.log(`下载成功：${file.name}`);
    // };
    const ifshowRef = ref(false);
    const formRef = ref(null);
    const removeItem = (index) => {
      model.stages.splice(index, 1);
    };
    const addItem = () => {
      console.log("00model.stages",model.stages,)
      model.stages.push(
        { 
          stage:undefined,
          start_date:undefined,
          end_date:Date.now(),
          notify_date:Date.now(),
          notify_users:[]
        }
      );
    };
    const model = reactive({
      work_id: "",
      version_id:"",
      notify_users:[],
      imported_fields:[],
      stages:[{
        stage:undefined,
        start_date:Date.now(),
        end_date:Date.now(),
        notify_date:Date.now(),
        notify_users:[]
      }],
      stages_standard:[{
        stage:undefined,
        start_date:Date.now(),
        end_date:Date.now(),
        notify_date:Date.now(),
      }]
    });
    const loadingRef = ref(false);
    const minoroptionsRef = ref([]);
    const notifyoptionsRef = ref([]);
    const stageoptionsRef = ref([]);
    const s_stageoptionsRef = ref([]);
    var preversionid = "";
    function queryminorversion () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        // formRef.value.model.minoroptions = [];
        var minoroptions = [];
        service.get('/dashboard/version/minor').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            minoroptions.push({
              // lable是显示的，所以用minor_version
              label:data1[i].minor_version,
              value:data1[i].id
            });
            // console.log("11",rowjson,data1[i].tags)
          }
          // console.log("3333",formRef.value.model.minoroptions);
          resolve({
            data: minoroptions,
          })
        });
        
      })
    }
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
          resolve({
            data: notifyoptions,
          })
        });
        
      })
    }
    function querystage () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var stageoptions = [];
        // 获取用户列表
        service.get('/dashboard/task/config/stages').then(res=>{
          stageoptions = res.data.data;
          resolve({
            data: stageoptions,
          })
        });
        
      })
    }
    function querystage_s () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var s_stageoptions = [];
        // 获取列表
        service.get('/dashboard/version/config/stages').then(res=>{
          s_stageoptions = res.data.data;
          resolve({
            data: s_stageoptions,
          })
        });
        
      })
    }
    onMounted(() => {
      queryminorversion().then((data) => {
        minoroptionsRef.value = data.data
        // loadingRef.value = false
      });
      querynotifyusers().then((data) => {
        notifyoptionsRef.value = data.data
        // loadingRef.value = false
      });
      querystage().then((data) => {
        stageoptionsRef.value = data.data
        // loadingRef.value = false
      })
      querystage_s().then((data) => {
        s_stageoptionsRef.value = data.data
        // loadingRef.value = false
      })
    })
    return {
        loading: loadingRef,
        minoroptions: minoroptionsRef,
        formRef,
        model,
        ifshow:ifshowRef,
        notifyoptions:notifyoptionsRef,
        stageoptions:stageoptionsRef,
        s_stageoptions:s_stageoptionsRef,
        rules: {
          work_id: {
            required: true,
            message: "请输入",
            trigger: ["input"]
          },
        },
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
            if (!errors) {
              if(formRef.value.model.name!=''){
                console.log("formRef:",formRef.value.model);
                let formlist = formRef.value.model;
                // 处理下imported_fields里产研测部分的
                let cycusers = formlist.imported_fields;
                if(formlist.imported_fields.length>0){
                  for(let i=13;i<18;i++){
                    let cysstr ="";
                    // 如果人员不是空的话，需要拆解组合为字符串
                    if(cycusers[i].value!=""){
                      cysstr = cycusers[i].value[0];
                      for(let j=1;j<cycusers[i].value.length;j++){
                        cysstr = cycusers[i].value[j]+","+cysstr;
                      }
                    }
                    cycusers[i].value =cysstr;  
                  }
                }
                // console.log("555555",cycusers);
                let allnotifyusers=formlist.notify_users[0]?formlist.notify_users[0]:"";
                for(let i=1;i<formlist.notify_users.length;i++){
                  allnotifyusers=formlist.notify_users[i]+","+allnotifyusers;
                }
                //处理提醒用户部分 -> 同步到imported_fields里的提醒用户-19
                cycusers[19].value=allnotifyusers;
                // 先去掉formRef.value.model 的stages_standard,再传
                let bodydata = {
                  work_id : formlist.work_id,
                  version_id : formlist.version_id,
                  notify_users: formlist.notify_users,
                  imported_fields:cycusers,
                  stages : JSON.parse(JSON.stringify(formlist.stages)),
                  finished:parseInt(route.params.finished)
                }
                let flag = true;
                // 处理下时间戳和字符串的转换
                for(let i=0;i<formlist.stages.length;i++){
                  // 先判断下每个阶段的日期都填没填
                  if(formlist.stages[i].end_date == undefined || formlist.stages[i].notify_date == undefined){
                    message.error("结束时间和预警时间都必须填写！缺失的阶段信息在第 "+(i+1)+"行！！");
                    flag = false;
                  }else{
                    let endtime = new Date(Number(formlist.stages[i].end_date));
                    let starttime = new Date(Number(formlist.stages[i].start_date));
                    let notifytime = new Date(Number(formlist.stages[i].notify_date));
                    let y=endtime.getFullYear()+ '-';
                    let m=(endtime.getMonth()+1 < 10 ? '0' + (endtime.getMonth() + 1) : endtime.getMonth() + 1) + '-';
                    // let d=endtime.getDate()+ ' ';
                    let d=(endtime.getDate() < 10 ?  '0' + (endtime.getDate() ) : endtime.getDate() )  + ' ';
                    let others = "16:00:00";
                    let ys=starttime.getFullYear()+ '-';
                    let ms=(starttime.getMonth()+1 < 10 ? '0' + (starttime.getMonth() + 1) : starttime.getMonth() + 1) + '-';
                    let ds=(starttime.getDate() < 10 ?  '0' + (starttime.getDate() ) : starttime.getDate() )  + ' ';
                    let yn=notifytime.getFullYear()+ '-';
                    let mn=(notifytime.getMonth()+1 < 10 ? '0' + (notifytime.getMonth() + 1) : notifytime.getMonth() + 1) + '-';
                    let dn=(notifytime.getDate() < 10 ?  '0' + (notifytime.getDate() ) : notifytime.getDate() )  + ' ';
                    bodydata.stages[i].end_date = y+m+d+others;
                    bodydata.stages[i].start_date = ys+ms+ds+others;
                    bodydata.stages[i].notify_date = yn+mn+dn+others;
                  }
                }
                // 先验证下各阶段日期区间对不对,并设置flag
                // let flag = true;//见上方flag
                // let dateTimetest = new Date();
                for(let i=0;i<bodydata.stages.length;i++){
                  //  
                  for(let j=0;j<formlist.stages_standard.length;j++){
                    // let xingnnegddl = dateTimetest.setDate(new Date(bodydata.stages[i].end_date).getDate()+3);
                    let xingnnegddl = new Date(Number(formlist.stages[i].end_date));;
                    let y=xingnnegddl.getFullYear()+ '-';
                    let m=(xingnnegddl.getMonth()+1 < 10 ? '0' + (xingnnegddl.getMonth() + 1) : xingnnegddl.getMonth() + 1) + '-';
                    let d=xingnnegddl.getDate()+3+ ' ';
                    let others = "16:00:00";
                    let xingnengddlstr = y+m+d+others;
                    // 如果是同一阶段
                    // console.log("formlist.stages[i].stage:",formlist.stages[i],formlist.stages_standard[j])
                    if(bodydata.stages[i].stage == formlist.stages_standard[j].stage ){
                      if(bodydata.stages[i].end_date > formlist.stages_standard[j].end_date){
                        message.error("结束时间不得晚于版本排期对应节点时间！=>"+formlist.stages_standard[j].end_date);
                        console.log("11***********1",bodydata.stages[i].end_date,formlist.stages_standard[j].end_date);
                        flag = false;
                      }
                      break;
                    }
                    // 如果是性能验收，需要前三天，版本节点没有同一阶段
                    else if(bodydata.stages[i].stage == 20 && formlist.stages_standard[j].stage == 15){
                      console.log("formlist.stages[i].stage:",xingnengddlstr,formRef.value.model.stages_standard[j].end_date)
                      if(xingnengddlstr > formRef.value.model.stages_standard[j].end_date){
                        message.error("转测性能时间不得晚于结束验收时间前三天！=>"+formlist.stages_standard[j].end_date);
                        flag = false;
                      }
                      break;
                    }else{
                      // console.log("wei pi pei",i,j)
                    }
                  }
                }
                // flag为 true才能提交
                if(flag==true){
                  //判断编辑还是新建
                  //编辑
                  if(route.path.indexOf("edit")!=-1){
                    // console.log("shifou",route.path,route.params.scriptIdkey);
                    service.put('/dashboard/task/'+route.params.iterateId,bodydata).then(res=>{   
                      if(res.data.message!=""){
                        message.error(t("common.updateerr")+":"+res.data.message);
                      }else{      
                        message.success(t("common.updatesuc"));   
                      }           
                      router.push({
                        path: '/version/iterate',
                        query:{
                          word:route.query.word,
                          type:route.query.type,
                          ifself:route.query.ifself
                        }
                      });       
                      // location.reload() ;      
                    }).catch(e=>{
                      // console.log("essrormessage",e.response.data);
                      // alert(e.response.data);
                      message.error(t("common.updateerr"));
                      router.push({
                        path: '/version/iterate',
                        query:{
                          word:route.query.word,
                          type:route.query.type,
                          ifself:route.query.ifself
                        }
                      });
                    });
                  }
                  //新建
                  else{
                    //先新建条目
                    service.post('/dashboard/task',bodydata).then(res=>{
                      console.log("res",res)
                      if(res.data.code!=0){
                        message.error(t("common.createerr")+":"+res.data.message);
                        console.log("新建失败",res.data.message)
                      }else{      
                        message.success(t("common.createsuc"));   
                      }
                      router.push({
                        path: '/version/iterate',
                        query:{
                          word:route.query.word,
                          type:route.query.type,
                          ifself:route.query.ifself
                        }
                      });
                      console.log("444",);
                      // location.reload() ;
                    }).catch(e=>{
                      // console.log("essrormessage",e.response.data);
                      // alert(e.response.data);
                      console.log("555",e,e.data);
                      message.error(t("common.createerr")+(e.data.message?':'+e.data.message:''));
                      console.log("555",);
                      router.push({
                        path: '/version/iterate',
                        query:{
                          word:route.query.word,
                          type:route.query.type,
                          ifself:route.query.ifself
                        }
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
          console.log("333",route.query);
          router.push({
            path: '/version/iterate',
            query:{
              word:route.query.word,
              type:route.query.type,
              ifself:route.query.ifself
            }
          });
        },
        update_version(value,option){
          // console.log("33333333333333333",value,option);
          if(option!=null)
            formRef.value.model.version_id = option.value;
          else
            formRef.value.model.version_id ="";
          // console.log("4444333333",formRef.value.model.version_id);
          if(formRef.value.model.version_id==""){
            ifshowRef.value = false;
            preversionid ="";
          }
          //如果在展开状态下，需要及时更新展开的信息
          if(ifshowRef.value==true){
            ifshowRef.value = false;
            preversionid ="";
            service.get('/dashboard/version/'+ formRef.value.model.version_id).then(res=>{
              if(res.data.code != 0){
                //错误处理
                message.error( "获取错误！"+res.data.message, { duration: 5000 })
              }else{
                formRef.value.model.stages_standard = res.data.data.stages;
                ifshowRef.value = true;
              }
            }).catch((err) =>{
              console.log("errrrrr",err); 
              if(err.response.status == 500)
                message.error( t("version.iterate.getversionstderr"), { duration: 5000 })
            });
          }
        },
        upversionstd(){
          if(formRef.value.model.version_id!="" && ifshowRef.value==false){
            // preversionid 为上一次隐藏的时候的version_id ，相同的话，就不用再请求一次了
            if(preversionid != formRef.value.model.version_id){
              // 不一样的话，置空不保存
              preversionid ="";
              service.get('/dashboard/version/'+ formRef.value.model.version_id).then(res=>{
                // console.log("getTest res:",response.data.data);
                if(res.data.code != 0){
                  //错误处理
                  message.error( "获取错误！"+res.data.message, { duration: 5000 })
                }else{
                  formRef.value.model.stages_standard = res.data.data.stages;
                  ifshowRef.value = true;
                }
              }).catch((err) =>{
                console.log("errrrrr",err); 
                if(err.response.status == 500)
                  message.error( t("version.iterate.getversionstderr"), { duration: 5000 })
              });
            }else{
              ifshowRef.value = true;
            }
          }else if(formRef.value.model.version_id!="" && ifshowRef.value==true){
            ifshowRef.value = false;
            preversionid = formRef.value.model.version_id;
          }
        }
    };
  },
  watch: {
    '$route'(to) {
      // 如果是创建测试
      if (to.name === 'iterateCreate') {
        this.reload();
        return;
      }
      if (to.name !== 'iterateEdit') {
        // this.nodeslist=[];
        this.iid= to.params.iterateId;
        console.log("1111shijian!!!!!!!!!!!!!!",this.iid,"888888888",to.params.iterateId);
        return;
      }
      // this.getTest(to.params.iterateId);
    }
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      // this.getTest(this.$route.params.iterateId);
      // console.log("1222222",this.model,this.$route.params.serverId);
      // this.getusername();
    })
  },
  computed: {

  },
  methods: {
    getTest(iterateId) {
      // console.log("shijian!!!!!!!!!!!!!!",this.iid,"888888888",this.$route.params.iterateId);
      //测试日期比较
      // let dt1 = Date.now();
      // let dt2 = Date.now();
      // let dateTimetest = new Date();
      // let dt3 = dateTimetest.setDate(dateTimetest.getDate()+1);
      // // let dt4 = Date.setDate(Date.getDate()+1);
      // let res12 = (dt1==dt2?11:22);
      // let res13 =(dt1 < dt3?11:22);
      // console.log("shijian!!!!!!!!!!!!!!",typeof(dt1),res13,dt3,dateTimetest.getDate());
      // console.log("shijian!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      if (iterateId!= undefined) {
        service.get('/dashboard/task/'+iterateId).then(response=>{
          // console.log("getTest res:",response.data.data);
          if (response.data) {
            // 只能一个个赋值，不然不生效，即使是一样的结构
            // console.log("接口获取详细信息:",response.data.data);
            // this.model = response.data.data;
            this.model.work_id = response.data.data.work_id;
            this.model.version_id = response.data.data.version_id;
            this.model.notify_users = response.data.data.notify_users;
            this.model.stages = response.data.data.stages;
            this.model.imported_fields= response.data.data.imported_fields!=[]?response.data.data.imported_fields:[];
            console.log("this.model.imported_fields",response.data.data.imported_fields,this.model.imported_fields)
            if(this.model.imported_fields.length!=0){
              for(let i=13;i<18;i++){
                this.model.imported_fields[i].value = response.data.data.imported_fields[i].value?response.data.data.imported_fields[i].value.split(","):"";
              }
            }
            service.get('/dashboard/version/'+response.data.data.version_id).then(res=>{
              // console.log("getTest res:",response.data.data);
              if (res.data) {
                this.model.stages_standard = res.data.data.stages;
              }
            })
            let stageslist = response.data.data.stages;
            let reg = /^(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/;
            // console.log("this.model:",this.model);
            for(let i=0;i<stageslist.length;i++){
              let ends  = response.data.data.stages[i].end_date.match(reg);
              let sstart = response.data.data.stages[i].start_date.match(reg);
              let snotify = response.data.data.stages[i].notify_date.match(reg);
              if(ends && sstart && snotify){
                this.model.stages[i].end_date = Date.parse(new Date(ends[1],ends[2] - 1,ends[3],ends[4],ends[5],ends[6]));
                this.model.stages[i].start_date = Date.parse(new Date(sstart[1],sstart[2] - 1,sstart[3],sstart[4],sstart[5],sstart[6])); 
                this.model.stages[i].notify_date = Date.parse(new Date(snotify[1],snotify[2] - 1,snotify[3],snotify[4],snotify[5],snotify[6]));      
              }
              // 录入的是小于2000年的时间，所以需要置空不显示
              if(946699200000 - this.model.stages[i].end_date >= 0){//时间早于 2000-01-01 12:00:00
                this.model.stages[i].end_date = undefined;
                this.model.stages[i].notify_date = undefined;
                console.log("zhi kong le")
              }else{
                // console.log("mei zhi kong ",this.model.stages[i].end_date,946699200000 - this.model.stages[i].end_date)
              }
            }
            // 控制显示参考信息
            // if(this.model.version_id!=""){
            //   this.ifshow= true;
            // }   
              // console.log("this.model:",this.model);
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
  .aaa{
    margin: 25px 0px -30px 15px;
  }
  .bbb{
    margin:  0px;
  }
  .ccc{}
  .ddd{
    min-width: 100% !important;
  }
</style>
