<template>
  <!-- <n-p> 你选中了 {{ checkedRowKeys.length }} 行。 </n-p> -->
  <!-- {{pagination.pageCount}} -->
  
  <n-space vertical :size="12">
    <!-- 添加按钮 -->
    <n-button strong secondary round type="success" @click="createtomcat" style="height: 38px;margin: 10px;margin-left:15px">
         <template #icon>
            <n-icon><AddCircleOutline /></n-icon>
          </template>
      {{$t("common.add")}}
    </n-button>
    <!-- 主列表 -->
    <n-data-table
      size="large"  striped 
      ref="table"
      :scroll-x="1600"
      :bordered="false"
      :columns="columns"
      :data="data"
      :row-key="rowKey"
      :pagination="pagination"
      :loading="loading"
      @update:checked-row-keys="handleCheck"
      @update:page="handlePageChange"
      style="margin-left:15px"
    />
    <!-- 操作开始 -->
    <!-- 换jar -->
    <n-modal v-model:show="showModal" :title="$t('perfor.task.replacejar')" preset="dialog" :mask-closable="false" style="width: 50%;margin-top:0px;margin-bottom:50px;padding-bottom:50px;">
      <!-- <n-select v-model:value="nowstage"  :options="stageoptions" size="small"
        style="width:30%;margin-bottom: 15px;float: left;" clearable /> -->
      <!-- <n-input v-model:value="tocomment" type="textarea" size="tiny"  style="margin: 0 0 20px 0; width: calc( 100% - 40px );" /> -->
      <n-form
        ref="formRef"
        :model="model"
        :rules="rules"
        label-align="left"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
        size="medium"
      >
        <!-- 产品 版本 分支选择 style="margin-left: 15px;margin-top: 20px;"  -->
        <n-form-item  :label="$t('version.enginemanage.product')" style="margin: 25px 10% 0;" >
          <n-select v-model:value="model.prefix_p"  clearable filterable
            :options="productoptions" 
          />
        </n-form-item>
        <n-form-item :label="$t('version.enginemanage.version')" style="margin: 5px 10% 0;" >
          <n-select v-model:value="model.prefix_v"  clearable 
            :options="versionoptions" 
          />
        </n-form-item>
        <n-form-item :label="$t('version.enginemanage.branch')" style="margin: 5px 10% 0;" >
          <n-select v-model:value="model.prefix_f"  clearable filterable
            :options="branchoptions" 
          />
        </n-form-item>
        <!-- swift -->
        <n-form-item :label="$t('version.enginemanage.ifswift')" style="margin: 5px 10% 0;" >
          <n-switch v-model:value="model.ifswift" />
        </n-form-item>
        <!-- date -->
        <n-form-item  :label="$t('common.start_date')" style="margin: 5px 10% 0;">
          <n-date-picker v-model:value="model.startdate" type="date" clearable />
        </n-form-item>
        <n-form-item :label="$t('common.end_date')" style="margin: 5px 10% 0;">
          <n-date-picker v-model:value="model.enddate" type="date"  clearable />
        </n-form-item>
        <!-- cancel -->
        <n-button strong secondary round v-show="model.selectjar.length?false:true" style="float: right;margin-right: 25px;" @click="cancel">
          {{$t("common.cancel")}}
        </n-button>
        <!-- load -->
        <n-button strong secondary round type="success" style="float: left;margin-left: 30%;width: 30%;" @click="loadjarlist">
          {{$t("version.enginemanage.loadjarlist")}}
        </n-button>
        <!-- jarlist -->
        <n-form-item  :label="$t('version.enginemanage.jarlist')" v-show="jaroptions.length?true:false" style="margin: 60px 10% 0;clear: both;" >
          <n-select v-model:value="model.selectjar"  clearable filterable
            :options="jaroptions" />
        </n-form-item>
        <!-- cancel -->
        <n-button strong secondary round  style="float: right;margin-right: 25px;" @click="cancel" v-show="jaroptions.length?true:false">
          {{$t("common.cancel")}}
        </n-button>
        <!-- submit -->
        <n-button strong secondary round type="success" v-show="jaroptions.length?true:false" style="float: right;margin-right: 25px;width: 30%;" @click="replacejar">
          {{$t("common.sure")}}
        </n-button>
      </n-form>
    </n-modal>
    
  </n-space>
  
</template>

<script>
import axios from 'axios';
import { h, defineComponent, ref,reactive,onMounted,onUnmounted  } from "vue";
import { RouterLink,useRouter,  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useDialog,NTooltip,useMessage  } from "naive-ui";
import service from '../../../requests/axios';
import service3 from '../../../requests/axios3';
import { LogInOutline as LogInIcon,AddCircleOutline} from "@vicons/ionicons5";
import { NotStartedOutlined,EditNoteRound,DeleteOutlined,StopCircleOutlined,
   RestartAltFilled,PublishedWithChangesRound,ContentCopyRound } from "@vicons/material"

function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}
export default {
  name: "Tomcat",
  data() {
    return {
      result:{},
      // datalist:[],
    };
  },
  props: {
  },
  components: {
    LogInIcon,AddCircleOutline
  },
  created() {
    // let  to =this.$route
    // console.log(to);
    
  },
  setup() {
    const { t } = useI18n();
    var datalist = [];
    var lastid = "";
    const dialog = useDialog();
    const router = useRouter();
    const message = useMessage();
    //ws
    let wsstr = "wss://"+window.location.origin.split("//")[1]+"/loadtest/project/ws";
    var ws = new WebSocket(wsstr);
    
    // var ws = new WebSocket("ws://192.168.101.229:8000/loadtest/project/ws");
    // if (!ws) {
    //   console.log('您的浏览器不支持websocket协议！');
    // }
    // 连接失败时触发
    ws.onerror = function(e) {
      console.log("连接失败",e)
    }
    ws.onmessage = function (e) {
      // console.log("服务器返回的信息: " ,JSON.parse(e.data));
      // 需要转为json,不然是字符串格式
      let data1 = JSON.parse(e.data).data;
      // console.log("data1: " ,data1);
      for(let i=0;i<data1.length;i++){
        dataRef.value[i].status = [];
        if(data1[i].nodes){
          for(let j=0;j<data1[i].nodes.length;j++){
            switch(data1[i].nodes[j].is_up){
              case 0:
                let jarstr = data1[i].nodes[j].jar_time.split("#")[1];
                let jar=jarstr.split("-")[0]+"-"+jarstr.split("-")[1].substring(0,10);
                dataRef.value[i].status.push(jar);
                break;
              case 1:
                dataRef.value[i].status.push("DOWN");
                break;
              case 2:
                dataRef.value[i].status.push("ERROR");
                break;
              case 3:
                dataRef.value[i].status.push("OTHER");
                break;
              case 5:
                dataRef.value[i].status.push("START");
                break;
              default:
                dataRef.value[i].status.push("OTHER");
            }
          }
        }
      }
    };
    const formRef = ref(null);
    var versionoptions = [];
    var productoptions = [];
    const showModalRef = ref(false);
    const versionoptionsRef= ref([]);
    const jaroptionsRef= ref([]);
    const branchoptionsRef= ref([]);
    const productoptionsRef= ref([]);
    const timerRef = ref(0);
    const model = reactive({
      id:"",
      prefix_p: "",
      prefix_v: "",
      prefix_f: "",
      ifswift:false,
      startdate:undefined,
      enddate:undefined,
      selectjar:"",
    });
    const createColumns = ({
      replaceTomcatJar,restartTomcat,startTomcat,stopTomcat,editTomcat,deleteTomcat,copyTomcat
    }) => {
      return [
        {
          title: t("version.enginemanage.tomcatname"),
          key: "name",
          width:70,
          fixed: "left"
        },
        {
          title: t("version.enginemanage.tomcatstatus"),
          key: "status",
          width: 120,
          render(row) {
            const tags = row.status.map((item) => {
              return h(NTag, {
                style: {
                  marginRight: "6px"
                },
                // type: "warning",
                type: item =="DOWN"?"warning":((item =="UP")||(item.indexOf("-")>-1)?"success":(item =="START"?"info":(item =="ERROR"?"error":"default"))),//标签的颜色
                bordered: false
              }, {
                default: () => item
              });
            });
            return tags;
          }
        },
        {
          title: t("version.enginemanage.tomcatnode"),
          key: "ipport",
          width:180,
          render(row) {
            const tags = row.ipport.map((item) => {
              return h(NTag, {
                style: {
                  marginRight: "6px"
                },
                checkable:true,
                bordered: false
              }, {
                default: () => item
              });
            });
            return tags;
          }
        },
        {
          title: t("version.enginemanage.tomcaturl"),
          key: "tomcaturl",
          width:350,
          render(row) {
            return h(NButton, {
              size: "small",
              tag:"a",
              style:"width: 100px;",
              text:true,
              href:row.tomcaturl,
              target:"_blank",
            }, 
            { default: () => row.tomcaturl });
          },
        },
        {
          title:t("common.action"),
          key: "replacejar",
          fixed: "right",
          // titleColSpan: 6,//合并 4列表头
          width: 60,
          render(row) {
            return h(NTooltip,{
                  trigger:"hover",
                  placement: 'bottom',
                }, {
                  trigger: () =>
                    h( NButton, {
                        style:{
                          width: "38px",padding: 0
                        },
                        onClick: () => replaceTomcatJar(row)
                      },
                      renderIcon2(PublishedWithChangesRound)
                    ),
                  default: () =>  t("version.enginemanage.tomcatreplace")
                }
              )
          },
        },
        {
          title: "",
          key: "restart",
          width: 50,
          fixed: "right",
           render(row) {
            return h(NTooltip,{
                  trigger:"hover",
                  placement: 'bottom',
                }, {
                  trigger: () =>
                    h( NButton, {
                        style:{
                          width: "38px",padding: 0,margin: "0 0 0 -10px"
                        },
                        onClick: () => restartTomcat(row)
                      },
                      renderIcon2(RestartAltFilled)
                    ),
                  default: () =>  t("version.enginemanage.tomcatrestart")
                }
              )
          },
        },
        {
          title: "",
          key: "start",
          width: 50,
          fixed: "right",
          render(row) {
            return h(NTooltip,{
                  trigger:"hover",
                  placement: 'bottom',
                }, {
                  trigger: () =>
                    h( NButton, {
                        style:{
                          width: "38px",padding: 0,margin: "0 0 0 -10px"
                        },
                        onClick: () => startTomcat(row)
                      },
                      renderIcon2(NotStartedOutlined  )
                    ),
                  default: () =>  t("common.start")
                }
              )
          },
        },
        {
          title: "",
          key: "stop",
          width: 50,
          fixed: "right",
          render(row) {
            return h(NTooltip,{
                  trigger:"hover",
                  placement: 'bottom',
                }, {
                  trigger: () =>
                    h( NButton, {
                        style:{
                          width: "38px",padding: 0,color:"red" ,margin: "0 0 0 -10px"
                        },
                        onClick: () => stopTomcat(row)
                      },
                      renderIcon2(StopCircleOutlined)
                    ),
                  default: () =>  t("common.stopp")
                }
              )
          },
        },
        {
          title: "",
          key: "edit",
          width: 50,
          fixed: "right",
          render(row) {
            return h(NTooltip,{
                  trigger:"hover",
                  placement: 'bottom',
                }, {
                  trigger: () =>
                    h( NButton, {
                        style:{
                          width: "38px",padding: 0,margin: "0 0 0 -10px"
                        },
                        onClick: () => editTomcat(row)
                      },
                      renderIcon2(EditNoteRound)
                    ),
                  default: () =>  t("common.edit")
                }
              )
          },
        },
        {
          title: "",
          key: "copy",
          width: 50,
          fixed: "right",
          render(row) {
            return h(NTooltip,{
                  trigger:"hover",
                  placement: 'bottom',
                }, {
                  trigger: () =>
                    h( NButton, {
                        style:{
                          width: "38px",padding: 0,margin: "0 0 0 -10px"
                        },
                        onClick: () => copyTomcat(row)
                      },
                      renderIcon2(ContentCopyRound)
                    ),
                  default: () =>  t("common.copy")
                }
              )
          },
        },
        {
          title: "",
          key: "delete",
          width: 50,
          fixed: "right",
          render(row) {
            return h(NTooltip,{
                  trigger:"hover",
                  placement: 'bottom',
                }, {
                  trigger: () =>
                    h( NButton, {
                        style:{
                          width: "38px",padding: 0,color:"red" ,margin: "0 0 0 -10px"
                        },
                        onClick: () => deleteTomcat(row)
                      },
                      renderIcon2(DeleteOutlined)
                    ),
                  default: () =>  t("common.delete")
                }
              )
          },
        },
        //隐藏部分，为了编辑和复制
        {
          title: t("perfor.script.scriptid"),
          key: "id",
          width: 1,
          ellipsis: true
        },
        {
          title: '',
          key: "nodes",
          width: 1,
          ellipsis: true
        },
        {
          title: '',
          key: "user",
          width: 1,
          ellipsis: true
        },
        {
          title: '',
          key: "password",
          width: 1,
          ellipsis: true
        },
      ];
    };
    const checkedRowKeysRef = ref([]);
    // 可调每页展示的
    const paginationReactive = reactive({
      page: 1,
      pageSize: parseInt(process.env.VUE_APP_PAGE_SIZE_NOMAL2),
      pageCount: 1,
      showSizePicker: true,
      prefix ({ itemCount }) {
        return `一共有 ${itemCount}个`
      },
      pageSizes:[parseInt(process.env.VUE_APP_PAGE_SIZE_NOMAL1),parseInt(process.env.VUE_APP_PAGE_SIZE_NOMAL2),parseInt(process.env.VUE_APP_PAGE_SIZE_NOMAL3)],//分页选项
      onChange: (page) => {
        paginationReactive.page = page;
      },
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize;
        paginationReactive.page = 1;
      }
    });
    // 可调每页展示的over
    // 右键菜单
    // 右键菜单over
    const dataRef = ref([]);
    const loadingRef = ref(true); 
    // const columnsRef = ref(columns)
    // 初始、切换数据加载
    function query (page, pageSize) {
      return new Promise((resolve) => {
        datalist = [] ;//清空再赋值，不然每次查询会累加     
        service.get('/loadtest/project').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            // 因为返回的数据结构和展示的不一样，所以node和libpath需要处理
            let ipportlist = [];
            let resstatus = ["DOWN"];
            let nodeslist = data1[i].nodes;
            //先处理下nodes
            for(let y=0;y< nodeslist.length;y++){
              // resstatus = "DOWN";
              ipportlist.push(nodeslist[y].ip+":"+nodeslist[y].port);
            }
            // 形成新的显示json
            let rowjson ={
              id:data1[i].id,
              name: data1[i].name,
              tomcaturl:data1[i].url,
              user:data1[i].user,
              password:data1[i].password,
              status: resstatus,
              proj_type	:data1[i].proj_type	,
              ipport: ipportlist,
              nodes :JSON.stringify(data1[i].nodes),
            }
            datalist.push(rowjson);
          }
          console.log("datalist: ",datalist);
          const total = datalist.length;
          const pageCount = Math.ceil(datalist.length / pageSize)
          console.log("pageCount: ",datalist.length,pageCount,total);
          resolve({
            pageCount,
            data: datalist,//文档错误，文档为 pagedData
            total
          })
        });
        
      })
    }
    function queryversion () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        versionoptions = [];
        productoptions = [];
        let versionlist =[];
        // 获取用户列表
        service3.get('/jar/list?op=version').then(res=>{
          let data1 = res.data.data;//版本数组
          for(let i=0;i<data1.length;i++){
            versionlist.push(data1[i].split('/')[0]);//纯产品名字的数组
            if(versionlist.indexOf(data1[i].split('/')[0])==-1 && i>0 ){
              productoptions.push({label:data1[i].split('/')[0],value:data1[i].split('/')[0]});
            }else if(i==0){
              productoptions.push({label:data1[i].split('/')[0],value:data1[i].split('/')[0]});
            }
            // console.log("dewgewvabwav",versionlist,versionlist.indexOf(data1[i].split('/')[0]),i,data1[i].split('/')[0])
            versionoptions.push({label:data1[i].split('/')[1],value:data1[i].split('/')[1]});
          }
          resolve({
            datap: productoptions,
            datav: versionoptions
          })
        });
        
      })
    };
    function querybranch () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var branchoptions = [];
        // 获取用户列表
        service3.get('/jar/list?op=branch').then(res=>{
          let data1 = res.data.data;//版本数组
          for(let i=0;i<data1.length;i++){
            branchoptions.push({label:data1[i],value:data1[i]});
          }
          resolve({
            data: branchoptions,
          })
        });
        
      })
    };
    function queryjar () {
      return new Promise((resolve) => {
        var jaroptions = [];
        // 处理时间戳转换
        let endtime = new Date(Number(formRef.value.model.enddate));
        let starttime = new Date(Number(formRef.value.model.startdate));
        let y=endtime.getFullYear()+ '-';
        let m=(endtime.getMonth()+1 < 10 ? '0' + (endtime.getMonth() + 1) : endtime.getMonth() + 1) + '-';
        let d=(endtime.getDate() < 10 ?  '0' + (endtime.getDate() ) : endtime.getDate() ) ;
        let ys=starttime.getFullYear()+ '-';
        let ms=(starttime.getMonth()+1 < 10 ? '0' + (starttime.getMonth() + 1) : starttime.getMonth() + 1) + '-';
        let ds=(starttime.getDate() < 10 ?  '0' + (starttime.getDate() ) : starttime.getDate() );
        let end_date = y+m+d;
        let start_date = ys+ms+ds;
        service3.get('/jar/list?op=date&start='+start_date +'&end='+end_date +'&prefix='+formRef.value.model.prefix_p+'/'+formRef.value.model.prefix_v+'/'+formRef.value.model.prefix_f).then(res=>{
          let data1 = res.data.data;//版本数组
          if(data1==null){
            message.error(t("perfor.task.jarlisterr"));
          }else{
            for(let i=0;i<data1.length;i++){
              jaroptions.push({label:data1[i],value:data1[i]});
            }
          }
          resolve({
            data: jaroptions,
          })
        });
        
      })
    };
    //ws轮询 ，传递定时器id
    function ws_loop(){
      return new Promise((resolve) => {
        let timer = setInterval(() =>{
          if(ws.readyState!=1){
            console.log("Connection not open ..."); 
            // flag = false;
          }else{
            ws_communication();
          }
        }, 5000 )
        // console.log("*************************************timer" ,timer);
        resolve({
          data: timer,
        })
        
      })
    }
    // ws传参
    function ws_communication(){
      let idlist = [];
      for(let i=0;i<dataRef.value.length;i++){
        idlist.push(dataRef.value[i].id)
      }
      // console.log("idlist",idlist);
      let parmsdata = JSON.stringify({
        op: "status",
        params: idlist
      });
      //添加状态判断，当为OPEN时，发送消息
      console.log("ws状态 ...",ws.readyState);
      if(ws.readyState==1){
        // console.log("Connection open ...",parmsdata); 
        ws.send(parmsdata);
      }else if(ws.readyState==0){
        // 是否继续循环的标志，不能用setInterval，不然无限循环
        setTimeout(() =>{
          console.log("...ws状态  ",ws.readyState);
          if(ws.readyState==1){
            console.log("Connection open ..."); 
            ws.send(parmsdata);
          }else{
            console.log("毁灭吧,再来一次");
            setTimeout(() =>{
              console.log("...ws状态-2 ",ws.readyState);
              if(ws.readyState==1){
                console.log("Connection open ..."); 
                ws.send(parmsdata);
              }else{
              }
            }, 1000 );
            // clearInterval(timer2);
          }
        }, 1000 );
      }
    }
    onMounted(() => {
      query(
        paginationReactive.page,
        paginationReactive.pageSize,
      ).then((data) => {
        dataRef.value = data.data
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false;
        //websocket 处理发送返回
        ws_communication();
      })
      queryversion().then((data) => {
        productoptionsRef.value = data.datap;
        versionoptionsRef.value = data.datav
      })
      querybranch().then((data) => {
        branchoptionsRef.value = data.data
      })
      // 需要获取定时器的id并传下去到 onUnmounted
      ws_loop().then((data) => {
        timerRef.value = data.data
      })
    });
    onUnmounted(() => {
      // 清除定时器
      clearInterval(timerRef.value);
      ws.close();
    });
    return {
      model,
      formRef,
      data: dataRef,
      timer:timerRef,
      showModal: showModalRef,
      versionoptions:versionoptionsRef,
      branchoptions:branchoptionsRef,
      productoptions:productoptionsRef,
      jaroptions:jaroptionsRef,
      ws_loop,
      columns: createColumns({
        replaceTomcatJar(rowData) {
          model.id = rowData.id;
          console.log("777 send mail to " + model.id);
          // 如果和上次打开的一样，那就不清空
          if(lastid != model.id){
            model.prefix_p= "";
            model.prefix_v= "";
            model.prefix_f= "";
            model.ifswift=false;
            model.startdate=undefined;
            model.enddate=undefined;
            model.selectjar="";
          }
          showModalRef.value = true;
          // console.log("888",commentlistRef.value)      
        },
        restartTomcat(rowData) {
          // console.log("222 send mail to " + rowData.name);
          service.post('/loadtest/project/'+ rowData.id +'/action?op=restart').then(res=>{
            message.success(t("version.enginemanage.suc"));
          }).catch(e=>{
            // console.log("essrormessage",e.response.data);
            message.error(t("version.enginemanage.err"));
          });
        },
        startTomcat(rowData) {
          // console.log("333 send mail to " + rowData.name);
          service.post('/loadtest/project/'+ rowData.id +'/action?op=start').then(res=>{
            message.success(t("version.enginemanage.suc"));
          }).catch(e=>{
            // console.log("essrormessage",e.response.data);
            message.error(t("version.enginemanage.err"));
          });
        },
        stopTomcat(rowData) {
          // console.log("444 send mail to " + rowData.name);
          service.post('/loadtest/project/'+ rowData.id +'/action?op=stop').then(res=>{
            message.success(t("version.enginemanage.suc"));
          }).catch(e=>{
            // console.log("essrormessage",e.response.data);
            message.error(t("version.enginemanage.err"));
          });
        },
        editTomcat(rowData) {
          // console.log("555 send mail to " + rowData.id);
          router.push({
            path: '/version/engine/tomcat/edit/' + rowData.id,//test.id需要改成project的name
          });
        },
        copyTomcat(rowData) {
          let bodydata ={
            name: rowData.name +"_copy",
            proj_type	:rowData.proj_type,
            url:rowData.tomcaturl,
            nodes :JSON.parse(rowData.nodes),
            user:rowData.user,
            password:rowData.password,
          };
          console.log("555 send mail to ", bodydata,rowData.nodes);
          service.post('/loadtest/project',bodydata).then(res=>{             
            message.success(t("common.updatesuc"));   
            // location.reload() ;  
            query(
              paginationReactive.page,
              paginationReactive.pageSize,
            ).then((data) => {
              dataRef.value = data.data
              paginationReactive.pageCount = data.pageCount
              paginationReactive.itemCount = data.total
              loadingRef.value = false;
              //websocket 处理发送返回
              ws_communication();
            })          
          }).catch(e=>{
            // console.log("essrormessage",e.response.data);
            // alert(e.response.data);
            message.error(t("common.updateerr"));
            query(
              paginationReactive.page,
              paginationReactive.pageSize,
            ).then((data) => {
              dataRef.value = data.data
              paginationReactive.pageCount = data.pageCount
              paginationReactive.itemCount = data.total
              loadingRef.value = false;
              //websocket 处理发送返回
              ws_communication();
            })  
          });
        },
        deleteTomcat(rowData) {
          // console.log("666 send mail to " + rowData.id);
          dialog.error({
            // title: "脚本备注",
            title:t("common.delete"),
            content: () => t("version.iterate.ifsuredelete"),
            // action: () => "Action"
            positiveText: t("common.sure"),
            negativeText: t("common.cancel"),
            maskClosable: false,
            onMaskClick: () => {
              message.success( t("common.checktips"))
            },
            onPositiveClick: () => {
              // d.loading = true;
              service.delete('/loadtest/project/'+rowData.id).then(res=>{
                message.success(t("common.deletesuc"));
                query(
                  paginationReactive.page,
                  paginationReactive.pageSize,
                ).then((data) => {
                  dataRef.value = data.data
                  paginationReactive.pageCount = data.pageCount
                  paginationReactive.itemCount = data.total
                  loadingRef.value = false;
                  //websocket 处理发送返回
                  ws_communication();
                })   
              }).catch(e=>{
                // console.log("essrormessage",e.response.data);
                // alert(e.response.data);
                message.error(t("common.deleteerr"));
                query(
                  paginationReactive.page,
                  paginationReactive.pageSize,
                ).then((data) => {
                  dataRef.value = data.data
                  paginationReactive.pageCount = data.pageCount
                  paginationReactive.itemCount = data.total
                  loadingRef.value = false;
                  //websocket 处理发送返回
                  ws_communication();
                }) 
              });
            }
          });
        },
      }),
      // 可调的
      pagination: paginationReactive,
      checkedRowKeys: checkedRowKeysRef,
      rowKey: (row) => row.id,
      loadjarlist(){
        queryjar().then((data) => {
          jaroptionsRef.value = data.data;
          console.log("88888888",jaroptionsRef.value,);
        })
      },
      replacejar(){
        let querystr = "op=replaceJar&prefix="+ formRef.value.model.prefix_p +"/"+ formRef.value.model.prefix_v+"/"+ formRef.value.model.prefix_f+"&jarTime="+ formRef.value.model.selectjar+(formRef.value.model.ifswift?'&deleteJar=swift':'')
        service.post('/loadtest/project/'+ formRef.value.model.id +'/action?'+querystr).then(res=>{
          message.success(t("version.enginemanage.replacejarsuc"));
          showModalRef.value = false;
        }).catch(e=>{
          // console.log("essrormessage",e.response.data);
          message.error(t("version.enginemanage.replacejarerr"));
          showModalRef.value = false;
        });
      },
      cancel(){
        showModalRef.value = false;
        lastid = model.id;
      },
      handleCheck(rowKeys) {
        checkedRowKeysRef.value = rowKeys;
        console.log(rowKeys,checkedRowKeysRef)
        // console.log(checkedRowKeys)
      },
      handlePageChange (currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          // console.log("data000:" ,data);
          query(
            currentPage,
            paginationReactive.pageSize,
          ).then((data) => {
            console.log("data111:" ,data);
            // console.log("dataRef:" ,dataRef.value);
            dataRef.value = data.data
            // console.log("dataRefhou:" ,dataRef.value);
            paginationReactive.page = currentPage
            paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
            loadingRef.value = false;
            //websocket 处理发送返回
            ws_communication();
          })
        }
      }
    };
  },
  watch: {

  },
  mounted() {
  },
  computed: {

  },
  methods: {
    createtomcat(){
      this.$router.push({
        path: '/version/engine/tomcat/create',
      });
    }
  },
  // Unmounted(){
  //   ws.close();
  //   console.log("*************************************this.timer" ,timer);
  //   clearInterval(timer);
  // }
}
</script>
<style scoped>
:deep .n-data-table__pagination{
  padding-right:15px;
}
</style>
