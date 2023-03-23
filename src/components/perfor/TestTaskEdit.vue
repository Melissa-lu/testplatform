<template>
  <n-space vertical >
    <!-- 按钮组 -->
    <div style="padding:20px 30px 10px 20px !important;background-color: rgb(249, 249, 249);margin-bottom: -10px;
      font-weight:bold;font-size: 18px;color: #333;height: 35px;">
      <!-- <div > -->
        <div style="font-weight:bold;font-size: 18px;color: #333;float: left;">{{model.name??$t('common.create')}}</div>
        <n-button-group style="float:right">
          <n-button @click="handleCancel" type="warning" strong secondary >
            {{$t('common.cancel')}}
          </n-button>
          <n-button v-show="ifshow[1]&&model.typeselectvalue==1?true:false"  @click="handlerefresh" type="info" strong secondary style="margin-left:20px !important;">
            {{$t('common.refresh')}}
          </n-button>
          <n-button v-show="ifshow[3]"  @click="handlerefresh2" type="info" strong secondary style="margin-left:20px !important;">
            {{$t('common.refresh2')}}
          </n-button>
          <n-button v-show="ifshow[4]"  @click="handlerefresh3" type="info" strong secondary style="margin-left:20px !important;">
            {{$t('common.refresh3')}}
          </n-button>
          <n-button v-show="ifshow[5]" @click="handleSubmit" type="success" strong secondary style="margin-left:20px !important;">
            {{$t('common.save')}}
          </n-button>
          <n-button @click="prev" style="margin-left:20px !important;">
            <template #icon>
              <n-icon>
                <md-arrow-round-back />
              </n-icon>
            </template>
          </n-button>
          <n-button @click="next">
            <template #icon>
              <n-icon>
                <md-arrow-round-forward />
              </n-icon>
            </template>
          </n-button>
          
        </n-button-group>
        
      <!-- </div> -->
    </div>
    <!-- 正文步骤 -->
    <n-card >
      <n-steps  :current="current" :status="currentStatus" v-model:current="current" :on-update:current="changesteps">
        <n-step  :title="$t('perfor.task.basicmessags')" />     
        <n-step  :title="$t('perfor.task.itemselect')" />
        <n-step :title="$t('perfor.task.itemset')" :disabled="(model.typeselectvalue==2||model.select_list.length==0)?true:false" />
        <n-step :title="$t('perfor.task.itemset')" :disabled="(model.typeselectvalue==2||model.select_list.length==0)?true:false" />
        <n-step :title="$t('perfor.task.queue')" :disabled="model.typeselectvalue==2?true:false" />
        <n-step :title="$t('perfor.task.actionselect')" />
      </n-steps>
      <!-- 流程表单填写 -->
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="top"
        label-width="auto"
        require-mark-placement="right-hanging"
        :size="small"
      >
        <!-- 步骤一 -->
        <div v-show="ifshow[0]">
          <TestTaskEditStep1 ></TestTaskEditStep1>
        </div>
        <!-- 步骤二 -->
        <div v-show="ifshow[1]">
        <!-- {{JSON.stringify(data, null, 2) }} -->
          <TestTaskEditStep2 @changeselectjmx="changeselectjmx" :datas="data" @loadjar="loadjar" 
          :defaultselectjmxs="defaultselectjmx" :columnss="columns" :jaroptions="jaroptions"
          :paginations="pagination" :tomcatoptions="tomcatoptions" :productoptions="productoptions" 
          :branchoptions="branchoptions" :ifswiftlist="ifswiftlist" :ifversionlist="ifversionlist"></TestTaskEditStep2>
        </div>
        <!-- 步骤三 -->
        <div v-show="ifshow[2]">
          <TestTaskEditStep3 @globalchange="globalchange" @toglobalchange="toglobalchange"></TestTaskEditStep3>
        </div>
        <!-- 新步骤四 jstack和dump的 压测机选择 -->
        <div v-show="ifshow[3]">
          <TestTaskEditStep4 @globalchangej="globalchangej" :tomcatoptions="tomcatoptions" :serveroptions="serveroptions"></TestTaskEditStep4>
        </div>
        <!-- 步骤五 队列-->
        <div v-show="ifshow[4]">
          <TestTaskEditStep5 :zujianlist="zujianlist" :queue="queue" :tomcatoptions="tomcatoptions" :filteroptions="filteroptions"
            :productoptions="productoptions" :branchoptions="branchoptions" :sqloptions="sqloptions" 
            :ifswiftlist="ifswiftlist" :ifversionlist="ifversionlist"></TestTaskEditStep5>
        </div>
        <!-- 步骤六 -->
        <div v-show="ifshow[5]">
          <n-card :bordered="false">
            <!-- 是否开启定时任务-->
            <n-grid :cols="24" :x-gap="24"  > 
              <n-form-item-gi :span="4" :label="$t('perfor.task.auto_enabled')"  >
                <n-switch v-model:value="model.auto_enabled" />
              </n-form-item-gi>       
            </n-grid>
            <!-- 压测机选择 -->
            <n-grid :cols="24" :x-gap="24"  >
              <n-form-item-gi :span="8" :label="$t('perfor.task.selectedserver')" v-if="model.typeselectvalue==1?true:false" >
                <!-- :on-update:value="server" -->
                <n-select v-model:value="model.selectedserverid" disabled multiple :options="serveroptions" />
              </n-form-item-gi>         
            </n-grid>
            <!-- 循环次数 -->
            <n-grid :cols="24" :x-gap="24" >
              <n-form-item-gi :span="8" :label="$t('perfor.task.circlecount')" v-if="model.typeselectvalue==1?true:false" >
                <n-input-number v-model:value="model.circlecount" clearable style="width: 100%;" />
              </n-form-item-gi>     
            </n-grid>
            <!-- 定时表达式 -->
            <n-grid  :cols="24" :x-gap="24"  >    
              <n-form-item-gi :span="8" :label="$t('perfor.task.corn')"  >
                <n-input v-model:value="model.cornstr" clearable />
                <n-button text tag="a" href="https://cron.qqe2.com/" target="_blank" type="primary" style="margin-left:20px;" >
                  {{ $t('perfor.task.cornstr') }}
                </n-button>
              </n-form-item-gi> 
            </n-grid>
          </n-card>
        </div>
      </n-form>
    </n-card>
  </n-space>
</template>
<script>
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRouter,useRoute  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useMessage,NInput ,NInputNumber } from "naive-ui";
import { MdArrowRoundBack, MdArrowRoundForward } from "@vicons/ionicons4";
import service from '../../requests/axios';
import service3 from '../../requests/axios3';
import Draggable from 'vuedraggable'
import { LogInOutline as LogInIcon ,Add} from "@vicons/ionicons5";
import { EditNoteRound} from "@vicons/material"
import { Delete} from "@vicons/carbon";

import TestTaskEditStep1 from './TestTaskEditStep1'
import TestTaskEditStep2 from './TestTaskEditStep2'
import TestTaskEditStep3 from './TestTaskEditStep3'
import TestTaskEditStep4 from './TestTaskEditStep4'
import TestTaskEditStep5 from './TestTaskEditStep5'



export default {
  name: "TestTaskEdit",
  data() {
    return {
      fileobj:{},
      idkey:"",
      ifshow:[true,false,false,false,false,false],//步骤展示的默认值
      submitflag:true,
    };
  },
  props: {
  },
  components: {
    TestTaskEditStep1,TestTaskEditStep2,TestTaskEditStep3,TestTaskEditStep4,TestTaskEditStep5,
    LogInIcon,
    Draggable,
    LogInIcon,Add,Delete,MdArrowRoundBack,MdArrowRoundForward,EditNoteRound
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const message = useMessage();
    var datalist = [];
    const formRef = ref(null);
    // 增加数据库等组件节点
    const addformRef = ref(null);
    const sqloptionsRef = ref([]);
    const serveroptionsRef = ref([]);
    const tomcatoptionsRef = ref([]);
    const queuelenRef =ref(0);
    // 增加数据库节点结束
    const currentRef = ref(1);
    const addinput = ref([{
      name:"",
      value:"",
    }]);
    // 显示jarlist加载好了之后的聚焦效果变量
    const selectInstRef = ref(null);
    const addmodel = ref({
      name:"",
      selectsql:"",
      selecttomcat:"",
      table_name:"",
      jar_suffix:"",
      wait_time:0,//等待时间
      filter_name:"",//过滤组件
      typevalue:0,//区分是否编辑，默认新建就是0
      index:-1,//如果是编辑，需要记录数组中第几个的位置信息，新建是-1
      ifversion:true,//是否指定换包的版本
      jar:{
        product:"",
        branch:"",
        ifswift:false,
        startat:undefined,
        stopat:undefined,
        selectjar:"",
        tomcatid:""
      }
    });
    const model = ref({
        name: null,
        comment:"",
        tags:[],
        typeselectvalue:"1",
        ifversion:true,//定时换包-是否指定换包的版本
        jar:{
          product:"",
          branch:"",
          ifswift:false,
          startat:undefined,
          stopat:undefined,
          selectjar:"",
          tomcatid:""
        },
        global:[{
          pname:'',pvalue:'',enabled:true
        }],
        globalj:{
          ifjstack:false,
          ifdump:false,
          jstackrate:0,
          selectedserverid:"",
          selectedtomcatid:"",
        },
        //前期只有脚本的本分
        select_list:[
          // {
          //   id:"",
          //   name:"",
          //   typevalue:1,//表明是脚本
          //   parameter:[{pname:'',pvalue:'',enabled:true}],
          //   ifjstack:false,
          //   ifdump:false,
          //   jstackrate:0,
          //   selectedserverid:""//压测机选择
          //   selectedtomcatid:"",
          // }
        ],
        plist: [{ pname: "",pvalue:"",enabled:false }],
        selectedserverid:[],
        circlecount:0,
        cornstr:"",
        auto_enabled:true,
    });
    // 脚本用例展示的
    const createColumns = ({}) => {
      return [  
        {
          type: "selection",
        },
        {
          title: t("perfor.script.name"),
          key: "name",
          width: 180,
          fixed: "left"
        },
        {
          title: t("perfor.script.uploader"),
          key: "uploader",
           width: 120,
        },
        {
          title: t("perfor.script.scenario"),
          key: "scenario",
          width: 150,
        },
        {
          title: t("perfor.tags"),
          key: "tags",
          // fixed: "right",
          //  width:100,
          render(row) {
            const tags = row.tags.map((tagKey) => {
              return h(NTag, {
                style: {
                  marginRight: "6px",
                  textalign:"center",
                },
                type: "success",
                bordered: false
              }, {
                default: () => tagKey
              });
            });
            return tags;
          }
        },
        {
          title: t("perfor.script.workid"),
          key: "workid",
          // width: 250,
          render(row) {
            const workid = row.workid.map((workidKey) => {
              return h(NTag, {
                style: {
                  marginRight: "6px",
                  textalign:"center",
                },
                type: "success",
                bordered: false
              }, {
                default: () => workidKey
              });
            });
            return workid;
          }
        },
        {
          title: t("perfor.script.comment"),
          key: "comment",
          // width: 200,
          ellipsis: {
            tooltip: true
          }
        },
        {
          title: t("perfor.script.scriptid"),
          key: "id",
          width: 1,
          ellipsis: true
        },
      ];
    };
    // 选择的脚本用例编辑的
    const createEditColumns = ({}) => {
      return [  
        {
          title: t("perfor.script.name"),
          key: "name",
          width: 180,
          fixed: "left",
          disabled:true,
        },
        {
          title: t("perfor.task.threads"),
          key: "threads",
          width: 150,
          render(row, index) {
            return h(NInputNumber , {
              value: row.parameter.threads,
              min:1,
              onUpdateValue(v) {
                jmxlistRef.value[index].parameter.threads = v;
              }
            });
          }
        },
        {
          title: t("perfor.task.ip"),
          key: "ip",    
          render(row, index) {
            return h(NInput, {
              value: row.parameter.ip,
              onUpdateValue(v) {
                jmxlistRef.value[index].parameter.ip = v;
              }
            });
          }
        },
        {
          title: t("perfor.task.port"),
          key: "port",
          render(row, index) {
            return h(NInput, {
              value: row.parameter.port,
              onUpdateValue(v) {
                jmxlistRef.value[index].parameter.port = v;
              }
            });
          }
        },
        {
          title: t("perfor.task.duration"),
          key: "duration",
          render(row, index) {
            return h(NInputNumber, {
              value: row.parameter.duration,
              min:1000,
              onUpdateValue(v) {
                jmxlistRef.value[index].parameter.duration = v;
              }
            });
          }
        },
        {
          title: t("perfor.task.loop"),
          key: "loop",
          render(row, index) {
            return h(NInputNumber, {
              value: row.parameter.loop,
              min:-1,
              onUpdateValue(v) {
                jmxlistRef.value[index].parameter.loop = v;
              }
            });
          }
        },
        {
          title: t("perfor.script.scriptid"),
          key: "id",
          width: 1,
          ellipsis: true
        },
      ];
    };
    //换包的
    const productoptionsRef = ref([]);
    const branchoptionsRef = ref([]);
    const jaroptionsRef = ref([]);
    var sqloptions = [];
    var serveroptions = [];
    var tomcatoptions = [];
    // 可调每页展示的
    const paginationReactive = reactive({
      page: 1,
      pageSize: parseInt(process.env.VUE_APP_PAGE_SIZE_MEDIUM2),
      pageCount: 1,
      showSizePicker: true,
      prefix ({ itemCount }) {
        return `一共有 ${itemCount}个`
      },
      pageSizes:[parseInt(process.env.VUE_APP_PAGE_SIZE_MEDIUM1),parseInt(process.env.VUE_APP_PAGE_SIZE_MEDIUM2),parseInt(process.env.VUE_APP_PAGE_SIZE_MEDIUM3)],//分页选项
      onChange: (page) => {
        paginationReactive.page = page;
      },
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize;
        paginationReactive.page = 1;
      }
    });
    // 可调每页展示的over
    const dataRef = ref([]);
    const loadingRef = ref(true);
    const checkedRowKeysRef = ref([]);
    const checkedRowsRef = reactive([{}]);
    const defaultselectjmxRef = ref([]);
    // 拖拽相关
    const disabled = ref(false)
    //队列的数组
    const queueRef = ref([])
    const zujianlistRef = ref(
      [
        // {id: 1, name: '标签1'}, 
      ]
    )
    const jmxlistRef= ref([]);
    const handleDel = (index, id) => {
      queueRef.value.splice(index,1);
      // console.log("5555555555555",index,queueRef.value);
    }
    const handleDeladd = (index,id) => {
      // for(let i=0;i<zujianlistRef.value.length;i++){
      //   if(zujianlistRef.value[i].id==id){
      //     zujianlistRef.value.splice(i, 1);
      //     break;
      //   }
      // }
      // 性能更好
      zujianlistRef.value.splice(index,1);
    }
    // 拖拽相关结束
    function querysqllist () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        sqloptions = [];
        // 获取用户列表
        service.get('/loadtest/connections').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            sqloptions.push({label:data1[i].name,value:data1[i].id});
          }
          resolve({
            data: sqloptions,
          })
        });
        
      })
    }
    function queryserverlist () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        serveroptions = [];
        // 获取用户列表
        service.get('/loadtest/machines').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            serveroptions.push({label:data1[i].name,value:data1[i].id});
          }
          resolve({
            data: serveroptions,
          })
        });
        
      })
    }
    function querytomcatlist () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        tomcatoptions = [];
        // 获取用户列表
        service.get('/loadtest/project').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            tomcatoptions.push({label:data1[i].name,value:data1[i].id});
          }
          resolve({
            data: tomcatoptions,
          })
        });
        
      })
    }
    function queryproduct () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var productoptions = [];
        // 获取用户列表
        service3.get('/jar/list?op=version').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            productoptions.push({label:data1[i],value:data1[i]});
          }
          resolve({
            data: productoptions,
          })
        });
        
      })
    }
    function querybranch () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var branchoptions = [];
        // 获取用户列表
        service3.get('/jar/list?op=branch').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            branchoptions.push({label:data1[i],value:data1[i]});
          }
          resolve({
            data: branchoptions,
          })
        });
        
      })
    }
    function queryjar (data) {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var jaroptions = [];
        // // console.log("notifyoptionsRef",formRef.value.model.jar.startat);
        let starttime = new Date(Number(data.startat));
        let stoptime = new Date(Number(data.stopat));
        let ys=starttime.getFullYear()+ '-';
        let ms=(starttime.getMonth()+1 < 10 ? '0' + (starttime.getMonth() + 1) : starttime.getMonth() + 1) + '-';
        let ds=starttime.getDate()<10 ? '0' + starttime.getDate():starttime.getDate();
        let yp=stoptime.getFullYear()+ '-';
        let mp=(stoptime.getMonth()+1 < 10 ? '0' + (stoptime.getMonth() + 1) : stoptime.getMonth() + 1) + '-';
        let dp=stoptime.getDate()<10 ? '0' + stoptime.getDate():stoptime.getDate();
        let startt = ys+ms+ds;
        let stopt = yp+mp+dp;
        // // console.log("notifyoptionsRef3333",starttime,ms,startt);
        // start=2022-08-01&end=2022-08-11&prefix=finereport%2F11.0%2Fstable
        service3.get('/jar/list?op=date&start='+startt +'&end='+ stopt +'&prefix='+data.product+'/'+ data.branch).then(res=>{
          let data1 = res.data.data;
          if(data1!=null){
            for(let i=0;i<data1.length;i++){
              jaroptions.push({label:data1[i],value:data1[i]});
            }
          }
          resolve({
            data: jaroptions,
          })
        });
        
      })
    }
    // 查询所有jmx列表的
    function query (page, pageSize) {
      return new Promise((resolve) => {
        datalist = [] ;//清空再赋值，不然每次查询会累加   
        service.get('/loadtest/scripts').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            let changjinglist = data1[i].scenario;
            let changjing = '';
            // // console.log("00",changjinglist);
            for(let j=0;j<changjinglist.length;j++){
              if(j!=0)
                changjing=changjing+" - "+changjinglist[j];
              else
                changjing=changjing+changjinglist[j];
            }
            // 形成新的显示json
            let rowjson ={
              id: data1[i].id,
              name: data1[i].name,
              uploader: data1[i].uploader,
              scenario: changjing,
              workid:data1[i].work_ids,
              tags:data1[i].tags??[],
              comment:data1[i].comment,
            }
            datalist.push(rowjson);
            // // console.log("11",rowjson,data1[i].tags)
          }
          const total = datalist.length;
          const pageCount = Math.ceil(datalist.length / pageSize)
          // console.log("pageCount: ",datalist.length,pageCount,total);
          resolve({
            pageCount,
            data: datalist,//文档错误，文档为 pagedData
            total
          })
        });
        
      })
    };

    onMounted(() => {
      query(
        paginationReactive.page,
        paginationReactive.pageSize,
      ).then((data) => {
        dataRef.value = data.data
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      });
      querysqllist().then((data) => {
        sqloptionsRef.value = data.data
        loadingRef.value = false;
        // // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!querysqllist",data.data,sqloptionsRef.value);
      })
      queryserverlist().then((data) => {
        serveroptionsRef.value = data.data
        loadingRef.value = false;
      })
      querytomcatlist().then((data) => {
        tomcatoptionsRef.value = data.data
        loadingRef.value = false;
      })
      queryproduct().then((data) => {
        productoptionsRef.value = data.data;
        // loadingRef.value = false
      });
      querybranch().then((data) => {
        branchoptionsRef.value = data.data;
        // // console.log("notifyoptionsRef",data.data);
      });
    })
    return {
      message,
      t,
      selectInstRef,
      disabled,
      datalist,
      queuelen:queuelenRef,
      defaultselectjmx:defaultselectjmxRef,
      typeselectlist:[
        {
          value: "1",
          label: t("perfor.task.yace")
        },
        {
          value: "2",
          label: t("perfor.task.replacejar")
        }
      ].map((s) => {
        s.value = s.value.toLowerCase();
        return s;
      }),
      ifswiftlist:[
        {
          value: true,
          label: t("common.yes")
        },
        {
          value: false,
          label: t("common.no")
        }
      ],
      ifversionlist:[
        {
          value: true,
          label: t("perfor.task.versiont")
        },
        {
          value: false,
          label: t("perfor.task.versionf")
        }
      ],
      productoptions:productoptionsRef,
      branchoptions:branchoptionsRef,
      jaroptions:jaroptionsRef,
      zujianlist:zujianlistRef,
      queue:queueRef,
      jmxlist:jmxlistRef,
      sqloptions:sqloptionsRef,
      serveroptions:serveroptionsRef,
      tomcatoptions:tomcatoptionsRef,
      filteroptions:[{
        label:"nofilter",
        value:"nofilter"
      },{
        label:"melissa",
        value:"melissa"
      }],
      handleDel,
      handleDeladd,
      currentStatus: ref("process"),
      current: currentRef,
      formRef,
      addformRef,
      model,
      addmodel,
      addinput,
      rules: {
          name: {
            required: true,
            message: t("common.placeholder1"),
            trigger: ["input"]
          }
      },
      data: dataRef,
      columns: createColumns({}),
      columnsEdit: createEditColumns({}),
      checkedRowKeys: checkedRowKeysRef,
      checkedRows: checkedRowsRef,
      // 可调的
      pagination: paginationReactive,
      rowKey: (row) => row.id,
      // 第二步子页面传回的更改了的选中的脚本
      changeselectjmx(data){
        // console.log("************11data",data);
        // console.log("111111111111111111111改前:",formRef.value.model.select_list);//checkedRowKeysRef.value,data.checkedRowKeys,checkedRowsRef.value,data.checkedRows);// 这是后是改之前的数组
        // 得处理下，只新增新的，删除旧的，不变的不新赋值
        // jmxlistRef.value =[];
        // formRef.value.model.select_list = [];
        let checkarr = data.checkedRows;
        // 先把新数组中没有的脚本删掉
        let aaa = checkedRowKeysRef.value;
        checkedRowKeysRef.value = aaa.filter(item => data.checkedRowKeys.indexOf(item)!=-1);
        for(let i=0;i<formRef.value.model.select_list.length;i++){
          if(data.checkedRowKeys.indexOf(formRef.value.model.select_list[i].id)==-1){
            formRef.value.model.select_list.splice(i,1);//因为一次就改变一项，所以没问题
            break;
          }
        }
        // console.log("111111111111111111111删除没有脚本后的数组:",checkedRowKeysRef.value);
        for(let i=0;i<checkarr.length;i++){
          // 如果不是新增，就保留
          if(checkedRowKeysRef.value.indexOf(data.checkedRowKeys[i])==-1){
            let nowjson ={
              id:checkarr[i].id,
              name:checkarr[i].name,
              typevalue:1,//表明是脚本
              parameter:[{pname:'',pvalue:'',enabled:true}],
              ifjstack:false,
              ifdump:false,
              jstackrate:0,
            };
            // jmxlistRef.value.push(nowjson);
            // jmxlistRef.value = jmxlistRef.value; 
            formRef.value.model.select_list.push(nowjson);
          }
          
        }
        
        checkedRowKeysRef.value = data.checkedRowKeys;//这之后就变成改后的了
        checkedRowsRef.value = data.checkedRows;
        // jmxlistRef.value =[];
        // formRef.value.model.select_list = [];
        // let checkarr = checkedRowsRef.value;
        // console.log("111111111111111111111改后:",formRef.value.model.select_list);
        // console.log("111111111111111111111改后:",checkedRowKeysRef.value,data.checkedRowKeys,checkedRowsRef.value,data.checkedRows);
      },
      // 全局参数一键配置
      globalchange(){
        // // console.log("globalchange",formRef.value.model.global,formRef.value.model.select_list);
        for(let j=0;j<formRef.value.model.select_list.length;j++){
          formRef.value.model.select_list[j].parameter = JSON.parse(JSON.stringify(formRef.value.model.global));
        }
      },
      // 赋值全局参数
      toglobalchange(item){
        // console.log("globalchange",item);//,formRef.value.model.global,formRef.value.model.select_list);
        formRef.value.model.global = item.parameter;
      },
      // jstack一键配置
      globalchangej(){
        // // console.log("globalchange",formRef.value.model.global,formRef.value.model.select_list);
        for(let j=0;j<formRef.value.model.select_list.length;j++){
          formRef.value.model.select_list[j].ifjstack = JSON.parse(JSON.stringify(formRef.value.model.globalj.ifjstack));
          formRef.value.model.select_list[j].jstackrate = JSON.parse(JSON.stringify(formRef.value.model.globalj.jstackrate));
          formRef.value.model.select_list[j].ifdump = JSON.parse(JSON.stringify(formRef.value.model.globalj.ifdump));
          formRef.value.model.select_list[j].selectedserverid = JSON.parse(JSON.stringify(formRef.value.model.globalj.selectedserverid));
          formRef.value.model.select_list[j].selectedtomcatid = JSON.parse(JSON.stringify(formRef.value.model.globalj.selectedtomcatid));
        }
      },
      handlePageChange (currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          // // console.log("data000:" ,data);
          query(
            currentPage,
            paginationReactive.pageSize,
          ).then((data) => {
            // // console.log("data111:" ,data);
            // // console.log("dataRef:" ,dataRef.value);
            dataRef.value = data.data
            // // console.log("dataRefhou:" ,dataRef.value);
            paginationReactive.page = currentPage
            paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
            loadingRef.value = false
          })
        }
      },
      handleCancel(e){
        router.push({
          path: '/perfor/testtask',
        });
      },
      handlerefresh(e){
        query(
          paginationReactive.page,
          paginationReactive.pageSize,
        ).then((data) => {
          dataRef.value = data.data
          paginationReactive.pageCount = data.pageCount
          paginationReactive.itemCount = data.total
          loadingRef.value = false;
          message.success(t("common.refreshsuc"));
        });
      },
      handlerefresh2(e){
        queryserverlist().then((data) => {
          serveroptionsRef.value = data.data
          loadingRef.value = false;
          message.success(t("common.refreshsersuc"));
        })
        querytomcatlist().then((data) => {
          tomcatoptionsRef.value = data.data
          loadingRef.value = false;
          message.success(t("common.refreshtomsuc"));
        })
      },
      handlerefresh3(e){
        querysqllist().then((data) => {
          sqloptionsRef.value = data.data
          loadingRef.value = false;
          message.success(t("common.refreshsqlsuc"));
        })
        querytomcatlist().then((data) => {
          tomcatoptionsRef.value = data.data
          loadingRef.value = false;
          message.success(t("common.refreshtomsuc"));
        })
      },
      loadjar(num){
        // console.log("TestTaskEdit",num);
        let data = {};
        if(num==1){
          data = formRef.value.model.jar
        }
        // else if(num == 2){
        //   data = addformRef.value.model.jar
        // }
        queryjar(data).then((data) => {   
          // console.log("aaaa",data.data,jaroptionsRef.value);
          if(data.data.length == 0){
            message.error( t("perfor.task.jarlisterr"), { duration: 3000 });
          }
          jaroptionsRef.value = data.data;
          selectInstRef.value?.focus();
          // 聚焦 1 秒 
          setTimeout(() => {
            selectInstRef.value?.blur();
          }, 1000);
          // // console.log("cccc",jaroptionsRef.value);

        });
      },
    };
  },
  created() {
    // // console.log("1222222",formRef,model)
    // // console.log(this.$route.name,this.$route.params.tomcatName);
  },
  watch: {
    '$route'(to) {
      // 如果是创建测试
      if (to.name === 'taskCreate') {
        this.reload();  
        return;
      }
      if (to.name !== 'taskEdit') {
        this.idkey= to.params.taskId;
        return;
      }
    //   document.getElementById('projectname').setAttribute("disabled","disabled");
    // //   this.isReadOnly = false;
      // // console.log("到站了",to.params.taskId)
      // this.getTest(to.params.taskId);
      // // console.log("到站了2")
    }
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      this.getTest(this.$route.params.taskId);
      // // console.log("1222222",this.model,this.$route.params.taskId);
    })
  },
  computed: {},
  methods: {
    changesteps(index){
      let flag = true;
      // 必须写名字
      if(this.current ==1 && !this.model.name){
        if(index > this.current){
          flag=false;
          this.message.error( this.$t("perfor.task.nameerr"))
        }
      }
      // 如果是压测的，没选脚本，就不让到下一页
      // // console.log("csbli bvlsibv ldsjb vksd",this.model.select_list)
      else if(this.model.typeselectvalue == 1 && this.current ==2 && this.model.select_list.length==0){
        if(index > this.current){
          flag=false;
          this.message.error( this.$t("perfor.task.nexterr"))
        }
      }
      // 如果是压测的，没选压测机，就不让到下一页
      // 如果是压测的，没选工程，就不让到下一页
      else if(this.model.typeselectvalue == 1 && this.current ==4 ){
        for(let i=0;i<this.model.select_list.length;i++){
          if(this.model.select_list[i].selectedserverid ==undefined ||this.model.select_list[i].selectedserverid =="" ){
            if(index > this.current){
              flag=false;
              this.message.error( this.$t("perfor.task.nextserveriderr"));
            }
            break;
          }
          if(this.model.select_list[i].selectedtomcatid ==undefined ||this.model.select_list[i].selectedtomcatid =="" ){
            if(index > this.current){
              flag=false;
              this.message.error( this.$t("perfor.task.nextservertiderr"));
            }
            break;
          }
        }
      }
      if(flag){
        this.current = index;
        //先都不显示
        for(let i =0;i<6;i++){
          this.ifshow[i] = false;
        }
        //对应的显示
        // for(let i =0;i<6;i++){
          // if(==i+1){                                                                                                                                                                                                                                                                                                                                                                                                    
            this.ifshow[index-1] = true;
          // }
        // }
        // 需要给整体的压测机数组赋值
        if(index == 6){
          let selist = [];
          for(let i=0;i<this.model.select_list.length;i++){
            if(selist.indexOf(this.model.select_list[i].selectedserverid)==-1){
              selist.push(this.model.select_list[i].selectedserverid);
            }
          }
          this.model.selectedserverid = selist;
        }
      }
    },
    next() {
      let flag = true;
      // console.log("8888889999",this.model.select_list,this.model.typeselectvalue,this.current);
      if (this.current == 6)
        this.message.error( this.$t("perfor.task.next6err"))
      // 必须写名字
      else if(this.current ==1 && !this.model.name){
        this.message.error( this.$t("perfor.task.nameerr"))
      }
      // 属于换包的地方，跳过 3 4 步骤
      else if(this.model.typeselectvalue == 2 && this.current ==2)
        this.current=this.current+4;
      // 如果是压测的，没选脚本，就不让到下一页
      else if(this.model.typeselectvalue == 1 && this.current ==2 && this.model.select_list.length==0){
        this.message.error( this.$t("perfor.task.nexterr"));
      }
      // 如果是压测的，没选压测机，就不让到下一页
      // 如果是压测的，没选工程，就不让到下一页
      else if(this.model.typeselectvalue == 1 && this.current ==4 ){
        for(let i=0;i<this.model.select_list.length;i++){
          if(this.model.select_list[i].selectedserverid ==undefined ||this.model.select_list[i].selectedserverid =="" ){
            this.message.error( this.$t("perfor.task.nextserveriderr"));
            flag=false;
            break;
          }
          if(this.model.select_list[i].selectedtomcatid==""|| this.model.select_list[i].selectedtomcatid==undefined){
            this.message.error( this.$t("perfor.task.nextservertiderr"));
            flag=false;
            break;
          }
        }
        if(flag){
          this.current++;
        }
      }
      else
        this.current++;

      //先都不显示
      for(let i =0;i<6;i++){
        this.ifshow[i] = false;
      }
      //对应的显示
      // for(let i =0;i<6;i++){
      //   if(this.current==i+1){
      //     this.ifshow[i] = true;
      //   }
      // }
      this.ifshow[this.current-1] = true;
      
      // 需要给整体的压测机数组赋值
      if(this.current == 6){
        let selist = [];
        for(let i=0;i<this.model.select_list.length;i++){
          if(selist.indexOf(this.model.select_list[i].selectedserverid)==-1){
            selist.push(this.model.select_list[i].selectedserverid);
          }
        }
        this.model.selectedserverid = selist;
      }
    },
    prev() {
      if (this.current == 1)
        this.message.error( this.$t("perfor.task.prev1err"))
      // 属于换包的地方，跳过 3 4 步骤
      else if(this.model.typeselectvalue == 2 && this.current ==6)
        this.current=this.current-4;
      else
        this.current--;
      //先都不显示
      for(let i =0;i<6;i++){
        this.ifshow[i] = false;
      }
      //对应的显示
      // for(let i =0;i<6;i++){
      //   if(this.current==i+1){
      //     this.ifshow[i] = true;
      //   }
      // }
      this.ifshow[this.current-1] = true;
      // 需要给整体的压测机数组赋值
      if(this.current == 6){
        let selist = [];
        for(let i=0;i<this.model.select_list.length;i++){
          if(selist.indexOf(this.model.select_list[i].selectedserverid)==-1){
            selist.push(this.model.select_list[i].selectedserverid);
          }
        }
        this.model.selectedserverid = selist;
      }
    },
    getTest(taskId) {
      if (taskId!= undefined) {
        service.get('/loadtest/tasks/'+taskId).then(response=>{
          // // console.log("getTest res:",response.data.data);
          if (response.data) {
            let data1=response.data.data;
            // 只能一个个赋值，不然不生效，即使是一样的结构
            // // console.log("接口获取详细信息:",response.data.data);
            // // console.log("this.model:",this.model);
            this.model.name = data1.name;
            this.model.comment = data1.comment??"";
            this.model.tags = data1.tags;
            this.model.typeselectvalue = (data1.machine_id?"1":"2");
            this.model.cornstr = data1.cron;
            this.model.auto_enabled = data1.auto_enabled;
            this.model.circlecount = data1.count;
            // 如果是压测的定时任务
            if(this.model.typeselectvalue==1){
              let selectjmxidlist = [];
              // let distinct_queue = [];
              // 记录队列长度
              this.queuelen = data1.queue.length;
              // 先获取去重后的脚本id
              for(let i=0;i<data1.queue.length;i++){
                if(data1.queue[i].job_id==1 && selectjmxidlist.indexOf(data1.queue[i].script_id)==-1){//脚本
                  // 脚本选择部分
                  this.defaultselectjmx.push(data1.queue[i].script_id);
                  // console.log("**********this.defaultselectjmx:",i,this.defaultselectjmx)
                  // 步骤3 4
                  selectjmxidlist.push(data1.queue[i].script_id);
                  // console.log("**********this.selectjmxidlist:",i,selectjmxidlist)
                  // distinct_queue.push(data1.queue[i]);
                }
              }
              // console.log("***********************this.defaultselectjmx",this.defaultselectjmx,selectjmxidlist);
              if(!this.defaultselectjmx){
                this.message.error(this.$t("perfor.task.queueerror"));
                this.submitflag=false;
              }
              // *** 存选中的jmx的行值的数组，需要初始化数组长度
              let datalist_c = Array(selectjmxidlist.length).fill(0);
              // this.data 是现有jmx列表数组
              for(let i=0;i<this.data.length;i++){
                let num = selectjmxidlist.indexOf(this.data[i].id);
                // 如果 列表的key == 选中的 key，那就找到了对应的行的值了
                // console.log("***********************num",num,this.data[i],datalist_c);
                if( num >-1){
                  // 作为新增的方法不行，会乱序，废弃 ———— datalist_c.splice(num,0,this.data[i]);
                  // 作为替换
                  datalist_c.splice(num,1,this.data[i]);
                  // console.log("***********************num",num,this.data[i],datalist_c);
                }
              }
              // console.log("***********************datalist_c",datalist_c);
              // // console.log("xsv;indn!!!!!!!!!!!!!!!!!!!!!",this.defaultselectjmx,selectjmxidlist);
              // this.checkedJmx(selectjmxidlist,datalist_c);
              this.changeselectjmx({"checkedRowKeys":selectjmxidlist,"checkedRows":datalist_c});
              // console.log("********************checkedJmx",this.model.select_list);
              if(this.model.select_list[0].id==undefined){
                this.message.error(this.$t("perfor.task.queueerror"));
                this.submitflag=false;
              }
              // 选择的用例恢复完毕
              // 开始处理参数和堆栈部分，压测机
              let selist = [];
              for(let j=0;j<this.model.select_list.length;j++){
                for(let i=0;i<data1.queue.length;i++){
                  if(data1.queue[i].job_id==1){//是脚本的队列元素
                    if(data1.queue[i].script_id == this.model.select_list[j].id){
                      // // console.log("pi pei suc!!!!!!",i,j,data1.queue[i].jstack.enabled,typeof(data1.queue[i].jstack.enabled))
                      this.model.select_list[j].parameter = data1.queue[i].params;
                      let flagi = data1.queue[i].jstack.enabled;
                      this.model.select_list[j].ifjstack = flagi;//data1.queue[i].jatack.is_enabled?data1.queue[i].jatack.is_enabled:false;
                      this.model.select_list[j].ifdump = data1.queue[i].jmap;
                      this.model.select_list[j].jstackrate = data1.queue[i].jstack.interval;
                      this.model.select_list[j].selectedserverid = data1.queue[i].machine_id;
                      this.model.select_list[j].selectedtomcatid = data1.queue[i].project_id;
                      if(selist.indexOf(this.model.select_list[j].selectedserverid)==-1){
                        selist.push(this.model.select_list[j].selectedserverid);
                      }
                      // 增加一列为首次队列出现的位置，未出现为-1，为后面的队列去重打基础
                      // this.model.select_list[j].ifappear = false;
                      this.model.select_list[j].aindex=-1;
                      this.model.select_list[j].fullname = this.model.select_list[j].name;
                      // // console.log("pi pei suc!!!!!!",i,j,data1.queue[i].script_id,this.model.select_list[j].id)
                      break;
                    }
                  }
                }
              }
              // 需要给整体的压测机数组赋值
              this.model.selectedserverid = selist;
              // 队列部分
              // console.log("tomcatoptions",this.tomcatoptions)
              for(let i=0;i<data1.queue.length;i++){
                // // console.log("queueRef.value",this.queue);
                switch(data1.queue[i].job_id){
                  case 1://脚本
                    // 判断是否有重复的
                    for(let k=0;k<this.model.select_list.length;k++){
                      if(this.model.select_list[k].id == data1.queue[i].script_id){
                        // console.log("******this.model.select_list[aaa]",this.model.select_list[k].ifappear);
                        //首次就直接入队，然后aindex记录队列首次位置
                        // 重复了就入队首次出现的位置
                        if(this.model.select_list[k].aindex==-1){
                          this.model.select_list[k].aindex=i;
                          this.queue.push(this.model.select_list[k]);
                        }else{
                          this.queue.push(this.queue[this.model.select_list[k].aindex]);
                        }
                        break;
                      }
                    };
                    break;
                  case 2://数据处理
                    //判断是否有重复的
                    let flag1 =true; //默认无重复
                    for(let j=0;j<this.zujianlist.length;j++){
                      if(this.zujianlist[j].id == data1.queue[i].filter_name){
                        flag1 =false;//重复了就不添加
                        break;
                      }
                    };
                    if(flag1){
                      this.zujianlist.push({id:data1.queue[i].filter_name,name:"过滤名称："+data1.queue[i].filter_name,fullname:"过滤名称："+data1.queue[i].filter_name,typevalue:2});
                    }
                    this.queue.push({id:data1.queue[i].filter_name,name:"过滤名称："+data1.queue[i].filter_name,fullname:"过滤名称："+data1.queue[i].filter_name,typevalue:2});
                    break;
                  case 3://入库
                    let sqlname = "";
                    //判断是否有重复的
                    let flag2 =true; //默认无重复
                    for(let j=0;j<this.zujianlist.length;j++){
                      if(this.zujianlist[j].id == data1.queue[i].connection_id){
                        if( this.zujianlist[j].table_name == data1.queue[i].table_name){
                          if(this.zujianlist[i].jar_suffix == this.addmodel.jar_suffix ){
                            flag2 =false;//重复了就不添加
                            break;
                          }
                        }
                      }
                    };
                    // 获取数据库名字
                    for(let j=0;j<this.sqloptions.length;j++){
                        if(this.sqloptions[j].value==data1.queue[i].connection_id){
                          sqlname = this.sqloptions[j].label;
                          break;
                        }
                      }
                    if(flag2){
                      this.zujianlist.push({
                        id:data1.queue[i].connection_id,
                        name:"入库-"+sqlname+"："+data1.queue[i].table_name,
                        fullname:"入库-"+sqlname+"："+data1.queue[i].table_name+"："+(data1.queue[i].jar_suffix??""),
                        typevalue:3,
                        table_name:data1.queue[i].table_name,
                        jar_suffix : data1.queue[i].jar_suffix??"",
                      });
                    }
                    this.queue.push({
                      id:data1.queue[i].connection_id,
                      name:"入库-"+sqlname+"："+data1.queue[i].table_name,
                      fullname:"入库-"+sqlname+"："+data1.queue[i].table_name+"："+(data1.queue[i].jar_suffix??""),
                      typevalue:3,
                      table_name:data1.queue[i].table_name,
                      jar_suffix : data1.queue[i].jar_suffix??"",
                    })
                    break;
                  case 4://重启 关闭 换包 等
                    let tomcatname = "";
                    // 获取工程名字
                    for(let j=0;j<this.tomcatoptions.length;j++){
                      if(this.tomcatoptions[j].value==data1.queue[i].project_id){
                        tomcatname = this.tomcatoptions[j].label;
                        break;
                      }
                    }
                    // 重启
                    if(data1.queue[i].op ==3 ){
                      //判断是否有重复的
                      let flagre =true; 
                      for(let j=0;j<this.zujianlist.length;j++){
                        // console.log("********this.zujianlist判断",j,i,this.zujianlist[j].id,data1.queue[i].project_id,this.zujianlist)
                        if(this.zujianlist[j].id == data1.queue[i].project_id && !this.zujianlist[j].params){
                        // 然后判断是否同一个工程
                        // 重启,工程相同就行
                          flagre =false;
                          // console.log("********this.zujianlist判断",flagre)
                          break;
                        }
                      };
                      if(flagre){
                        this.zujianlist.push({id:data1.queue[i].project_id,name:"重启："+tomcatname,fullname:"重启："+tomcatname,typevalue:4,op:3});
                        // console.log("********this.zujianlist",this.zujianlist)
                      }
                      this.queue.push({id:data1.queue[i].project_id,name:"重启："+tomcatname,fullname:"重启："+tomcatname,typevalue:4,op:3})
                    }// 关闭
                    else if(data1.queue[i].op ==2 ){
                      //判断是否有重复的
                      let flag =true; 
                      for(let j=0;j<this.zujianlist.length;j++){
                        if(this.zujianlist[j].id == data1.queue[i].project_id){
                        // 然后判断是否同一个工程
                        // 重启,工程相同就行
                          flag =false;
                          break;
                        }
                      };
                      if(flag){
                        this.zujianlist.push({id:data1.queue[i].project_id,name:"关闭："+tomcatname,fullname:"关闭："+tomcatname,typevalue:4,op:2});
                      }
                      this.queue.push({id:data1.queue[i].project_id,name:"关闭："+tomcatname,fullname:"关闭："+tomcatname,typevalue:4,op:2})
                    }// 换包
                    else if(data1.queue[i].op ==4){
                      //判断是否有重复的
                      let flagr =true; 
                      for(let j=0;j<this.zujianlist.length;j++){
                        if(this.zujianlist[j].id == data1.queue[i].project_id && this.zujianlist[j].params){
                        // 然后判断是否同一个jartime
                          // console.log("this.zujianlist[j].params",this.zujianlist[j].params)
                          if(this.zujianlist[j].params.jartime == data1.queue[i].params.jartime){
                            flagr =false;
                            break;
                          }
                        }
                      };
                      if(flagr){
                        this.zujianlist.push({
                          id:data1.queue[i].project_id,
                          name:"换包："+tomcatname+":"+data1.queue[i].params.prefix.split("/")[2],
                          fullname:"换包："+tomcatname+" : "+data1.queue[i].params.prefix.split("/")[2]+" : "+data1.queue[i].params.jartime+(data1.queue[i].params.exclude_jar?(" : "+data1.queue[i].params.exclude_jar):""),
                          typevalue:4,
                          op:4,
                          params:{
                            jartime:data1.queue[i].params.jartime,
                            prefix:data1.queue[i].params.prefix,
                            exclude_jar:(data1.queue[i].params.exclude_jar?"swift":""),
                          }
                        });
                      }
                      this.queue.push({
                        id:data1.queue[i].project_id,
                        name:"换包："+tomcatname+":"+data1.queue[i].params.prefix.split("/")[2],
                        fullname:"换包："+tomcatname+" : "+data1.queue[i].params.prefix.split("/")[2]+" : "+data1.queue[i].params.jartime+(data1.queue[i].params.exclude_jar?(" : "+data1.queue[i].params.exclude_jar):""),
                        typevalue:4,
                        op:4,
                        params:{
                          jartime:data1.queue[i].params.jartime,
                          prefix:data1.queue[i].params.prefix,
                          exclude_jar:(data1.queue[i].params.exclude_jar=="swift"?"swift":""),
                        }
                      })
                    }                 
                    break;
                  case 7://等待时间
                    //判断是否有重复的
                    let flag5 =true; //默认无重复
                    for(let j=0;j<this.zujianlist.length;j++){
                      if(this.zujianlist[j].id == data1.queue[i].wait_time){
                        flag5 =false;//重复了就不添加
                        break;
                      }
                    };
                    if(flag5){
                      this.zujianlist.push({id:data1.queue[i].wait_time,name:"等待："+data1.queue[i].wait_time+"秒",fullname:"等待："+data1.queue[i].wait_time+"秒",typevalue:7});
                    }
                    this.queue.push({id:data1.queue[i].wait_time,name:"等待："+data1.queue[i].wait_time+"秒",fullname:"等待："+data1.queue[i].wait_time+"秒",typevalue:7});
                    break;
                }
              }
              if(this.queuelen!=data1.queue.length){
                this.message.error(this.$t("perfor.task.queueerror"));
                this.submitflag=false;
              }
              // console.log("************22bodydata.queue.length",this.queuelen,data1.queue.length);
            }
            // 如果是换包的定时任务
            else if(this.model.typeselectvalue==2){
              let prefix= data1.queue[0].params.prefix;
              this.model.ifversion = data1.queue[0].params.jartime?true:false;
              this.model.jar ={
                tomcatid:data1.queue[0].project_id,
                product:prefix.split("/")[0]+"/"+prefix.split("/")[1],
                branch:prefix.split("/")[2],
                ifswift:data1.queue[0].params.exclude_jar=="swift"?true:false,
                startat:undefined,
                stopat:undefined,
                selectjar:data1.queue[0].params.jartime,
              };
              // console.log("接口获取详细信息:",this.model);
            }
          }
        })
      }
    },
    // 提交、保存定时任务
    handleSubmit(e){
      // 要区分下 压测的定时任务 和  换包的定时任务
      // this.queue 里是队列
      // console.log("this.this.queue",this.queue)
      // formRef.value.model  里是一些配置信息
      let modell= this.model;
      let bodydata = {};
      // 新建没有id
      if(modell.id){
        bodydata.id = modell.id; 
      }
      bodydata.name = modell.name;
      bodydata.comment = modell.comment;
      bodydata.auto_enabled = modell.auto_enabled;
      bodydata.cron = modell.cornstr;
      // 如果是换包，就不需要压测机的id了
      bodydata.machine_id = modell.selectedserverid??[];//数组
      bodydata.tags = modell.tags;
      bodydata.queue=[];
      // 如果是压测
      if(modell.typeselectvalue==1){
        //先添加下压测循环次数
        bodydata.count = modell.circlecount;
        // 处理异常解析
        for(let i=0;i<this.queue.length;i++){
          if(this.queue[i].typevalue==1){
            if(this.queue[i].selectedserverid==undefined||this.queue[i].selectedtomcatid==undefined){
              this.message.error(t("perfor.task.queueerror"));
              this.submitflag=false;
              break;
            }
          }
        }
        // 处理压测队列
        for(let i=0;i<this.queue.length;i++){
          switch(this.queue[i].typevalue){
            case 1://脚本
              bodydata.queue.push({
                job_id:1,
                machine_id:this.queue[i].selectedserverid,
                script_id:this.queue[i].id,
                params:this.queue[i].parameter,
                jstack:{
                  enabled:this.queue[i].ifjstack,interval:this.queue[i].jstackrate
                },
                jmap:this.queue[i].ifdump,
                project_id:this.queue[i].selectedtomcatid,
              })
              break;
            case 2://数据处理
              bodydata.queue.push({
                job_id:2,
                filter_name:this.queue[i].id
              })
              break;
            case 3://入库
              bodydata.queue.push({
                job_id:3,
                connection_id:this.queue[i].id,
                table_name:this.queue[i].name.split("：")[1],
                jar_suffix : this.queue[i].jar_suffix ,
              })
              break;
            case 4://重启等
              // 重启
              if(this.queue[i].op==3){
                bodydata.queue.push({
                  job_id:4,
                  project_id:this.queue[i].id,
                  op:this.queue[i].op,
                  params:{}
                })
                break;
              }
              // 关闭
              else if(this.queue[i].op==2){
                bodydata.queue.push({
                  job_id:4,
                  project_id:this.queue[i].id,
                  op:this.queue[i].op,
                  params:{}
                })
                break;
              }
              // 换包
              else if(this.queue[i].op==4){
                bodydata.queue.push({
                  job_id:4,
                  project_id:this.queue[i].id,
                  op:this.queue[i].op,
                  params:this.queue[i].params
                })
                break;
              }
            case 7://等待时间
              bodydata.queue.push({
                job_id:7,
                wait_time:this.queue[i].id
              })
          }
        }
      }
      // 如果是定时换包
      else if(modell.typeselectvalue==2){
        bodydata.queue.push({
          job_id:4,
          project_id:modell.jar.tomcatid,
          op:4,
          params:{
            jartime:modell.ifversion?modell.jar.selectjar:"",
            prefix:modell.jar.product+"/"+modell.jar.branch,
            exclude_jar:(modell.jar.ifswift?"swift":""),
          }
        })
          
      }
      // bodydata.queue = queueRef.value;
      // // console.log("11111111111bodydata",bodydata);
      //判断编辑还是新建
      // 编辑
      if(this.$route.path.indexOf("edit")!=-1){
        // console.log("************bodydata.queue.length",queuelenRef.value,bodydata.queue.length);
        if(this.submitflag){
          service.put('/loadtest/tasks/'+this.$route.params.taskId,bodydata).then(res=>{
            this.message.success(this.$t("common.updatesuc"));
            this.$router.push({
              path: '/perfor/testtask',
            });         
          }).catch(e=>{
            // // console.log("essrormessage",e.response.data);
            // alert(e.response.data);
            this.message.error(this.$t("common.updateerr"));
            this.$router.push({
              path: '/perfor/testtask',
            });  
          });
        }
        // else{
        //   this.message.error(this.$t("perfor.task.queueerror"));
        // }
      }
      //新建任务
      else{
        service.post('/loadtest/tasks',bodydata).then(res=>{
          this.message.success(this.$t("common.createsuc"));
          this.$router.push({
            path: '/perfor/testtask',
          });         
        }).catch(e=>{
          // // console.log("essrormessage",e.response.data);
          // alert(e.response.data);
          this.message.error(this.$t("common.createerr"));
          this.$router.push({
            path: '/perfor/testtask',
          });  
        });
      }
      
      
    },
  }
}
</script>
<style scoped>
</style>