<template>
  <n-space vertical :size="12">
    <div>
      <!-- 指定任务名称 查询 -->
      <n-form-item style="width: 100%;margin-bottom: -10px;" >
        <n-input-group style="width: 100%;margin-left: 20px;">
          <n-input-group-label >{{$t('perfor.report.searchname')}}</n-input-group-label>
          <n-select  :style="{ width: '50%' }" v-model:value="selectedreportname" :options="fliternameoptions" clearable 
          @search="reportnamesearch" multiple filterable :placeholder="$t('perfor.report.searchnametip')" 
          :loading="searchloading" @update:value="reportnamechange" 
          remote lear-filter-after-select="false" />
        </n-input-group>
      </n-form-item>
      <!-- 批量删除按钮 :disabled="true"-->
      <n-button strong secondary round type="error" :disabled="checkedRowKeys.length!=0?false:true" @click="alldelete" style="float: right;height: 38px;margin: -50px 10px 0px 15px;">
        <template #icon>
          <n-icon><DeleteOutlined /></n-icon>
        </template>
        {{$t("common.deleteall")}}
      </n-button>
    </div>
    <n-data-table
      size="large"  striped 
      ref="table"
      :bordered="false"
      :columns="columns"
      :data="data"
      :row-key="rowKey"
      :pagination="pagination"
      :loading="loading"
      :scroll-x="1500"
      @update:checked-row-keys="handleCheck"
      @update:page="handlePageChange"
      @update:filters="handleUpdateFilter"
      style="margin-left:15px"
    />

    <!-- 评论 -->
    <!-- <n-modal v-model:show="showModal" :title="$t('common.rename')" preset="dialog" :mask-closable="false" style="width: 50%;margin-top:0px;margin-bottom:50px;">
      <div>
        <n-input v-model:value="toname"   style="margin: 20px 0 30px 0; width: calc( 100% - 40px );" />
        <n-button strong secondary round type="success" style="float: right;margin-right: 35px;" @click="rename(rowData)">
          {{$t("common.save")}}
        </n-button>
      </div>
    </n-modal> -->
    
  </n-space>
  
</template>

<script>
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted,onUnmounted  } from "vue";
import { RouterLink,useRouter,useRoute  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useDialog,NDialogProvider,useMessage,NTooltip  } from "naive-ui";
import reportStatusFliter from '@/assets/data/reportStatusFliter.json';
import reportTriggerFliter from '@/assets/data/reportTriggerFliter.json';
import service from '@/requests/axios';
import { AddCircleOutline,StopCircleOutline } from "@vicons/ionicons5";
import { NotStartedOutlined,EditNoteRound,DeleteOutlined,AutoAwesomeMosaicOutlined,TableViewFilled,RestartAltFilled} from "@vicons/material";
// import pmFliter from '../../../assets/data/pmFliter.json';
// import iterateStatusFliter from '../../../assets/data/iterateStatusFliter.json';


function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}
export default {
  name: "TestReport",
  data() {
    return {
    };
  },
  props: {
  },
  components: {
    AddCircleOutline,DeleteOutlined,RestartAltFilled
  },
  created() {
    // let  to =this.$route
    // console.log(to);
    
  },
  setup() {
    const { t } = useI18n();
    const cns = getCurrentInstance();
    var datalist = [];
    var datalistall = [];
    const dialog = useDialog();
    const router = useRouter();
    const route = useRoute();
    const message = useMessage();
    const selectedreportnameRef=ref(route.query.name?[route.query.name]:[]);
    const fliternameoptionsRef = ref([]);
    // const showModalRef = ref(false);
    // const tonameRef = ref('');
    const timerlistRef = ref([]);
    const trigger_type = {
      title: t("perfor.report.trigger_type"),
      key: "trigger_type",
      width:100,
      filter: true,
      filterOptionValues: [],
      filterOptions: reportTriggerFliter.value,
    };
    const status = {
      title: t("perfor.report.status"),
      key: "status",
      width:100,
      render(row) {
        return h(NTag, {
          style: {
            marginRight: "6px",
            textalign:"center",
          },
          type: row.status=="running"?"success":(row.status!="completed"?"error":"default"),
          bordered: false
        }, {
          default: () => row.status
        });
      },
      filter: true,
      filterOptionValues: [],
      filterOptions: reportStatusFliter.value,
    };
    const trigger_typeReactive = reactive(trigger_type);
    const statusReactive = reactive(status);
    const createColumns = ({
      canceltask,retest,retosql,taskDetails,deleteItem
    }) => {
      return [
        {
          type: "selection",
          fixed: "left",
          width:30,
        },
        {
          title: t("perfor.report.name"),
          key: "name",
          width:160,
          fixed: "left",
          render(row) {
            return h(NButton, {
              size: "small",
              tag:"a",
              style:"width: 100px;",
              text:true,
              href:"testtask/edit/"+row.task_id,
              target:"_blank",
            }, 
            { default: () => row.name });
          },
        },
        {
          title: t("perfor.report.count"),
          key: "count",
          width:80,
        },
        {
          title: t("perfor.report.startdate"),
          key: "start_date",
          width:140,
        },
        {
          title: t("perfor.report.enddate"),
          key: "end_date",
          width:140,
        },
        trigger_type,
        {
          title: t("perfor.report.duration"),
          key: "duration",
          width:100,
        },
        status,
        {
          title:t("common.action"),
          key: "canceltask",
          fixed: "right",
          // titleColSpan: 2,//合并 2列表头
          width:60,
          render(row) {
            return h(NTooltip,{
                trigger:"hover",
                placement: 'bottom',
              }, {
                trigger: () =>
                  h( NButton, {
                      style:{
                        width: "38px",padding: 0,margin: "0 0 0 5px"
                      },
                      disabled:row.status!="running"?true:false,
                      onClick: () => canceltask(row)
                    },
                    renderIcon2(StopCircleOutline)
                  ),
                default: () =>  t("common.cancel")
              }
            )
          },
        },
        {
          title:"",
          key: "retest",
          fixed: "right",
          // titleColSpan: 2,//合并 2列表头
          width:50,
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
                      disabled:row.status=="running"?true:false,
                      onClick: () => retest(row)
                    },
                    renderIcon2(RestartAltFilled)
                  ),
                default: () =>  t("perfor.report.retest")
              }
            )
          },
        },
        {
          title:"",
          key: "retosql",
          fixed: "right",
          // titleColSpan: 2,//合并 2列表头
          width:50,
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
                      disabled:row.status!="error"?true:(row.error_type!=3?true:false),
                      onClick: () => retosql(row)
                    },
                    renderIcon2(TableViewFilled)
                  ),
                default: () =>  t("perfor.report.retosql")
              }
            )
          },
        },
        {
          title: "",
          key: "details",
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
                        onClick: () => taskDetails(row)
                      },
                      renderIcon2(AutoAwesomeMosaicOutlined)
                    ),
                  default: () =>  t("perfor.task.details")
                }
              )
          },
        },
        {
          title: "",
          key: "delete",
          width: 60,
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
                        onClick: () => deleteItem(row)
                      },
                      renderIcon2(DeleteOutlined)
                    ),
                  default: () =>  t("common.delete")
                }
              )
          },
        },
        {
          title: "",
          key: "id",
          width: 1,
          ellipsis: true,
        },
        {
          title: "",
          key: "task_id",
          width: 1,
          ellipsis: true,
        },
        {
          title: "",
          key: "error_type",
          width: 1,
          ellipsis: true,
        },
      ];
    };
    const checkedRowKeysRef = ref([]);
    // 可调每页展示的
    var paginationReactive = reactive({
      page: 1,
      pageSize: parseInt(process.env.VUE_APP_PAGE_SIZE_LARGE1),//10,
      pageCount: 1,
      showSizePicker: true,
      prefix ({ itemCount }) {
        return `一共有 ${itemCount}个`
      },
      pageSizes:[parseInt(process.env.VUE_APP_PAGE_SIZE_LARGE1),parseInt(process.env.VUE_APP_PAGE_SIZE_LARGE2),parseInt(process.env.VUE_APP_PAGE_SIZE_LARGE3)], //[10,20,30],//分页选项
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
    const searchloadingRef = ref(false);
    var fliternameoptions_dic = [];
    // 初始、切换数据加载
    function queryinitdata () {
      return new Promise((resolve) => {
        datalist = [] ;//清空再赋值，不然每次查询会累加     
        fliternameoptions_dic = [];
        service.get('/loadtest/task_reports').then(res=>{
          if(res.data.code != 0){
            //错误处理
            // reject({ status: 500, msg: 'error' })
          }else{
            let data1 = res.data.data;
            if(!data1){
              message.error(t("perfor.report.noreport"), { duration: 5000 })
            }else{
              for(let i=0;i<data1.length;i++){
                fliternameoptions_dic.push({label:data1[i].name,value:data1[i].task_id});
                // 形成新的显示json
                // 转换下时分秒
                let durationmin = parseInt(data1[i].duration/60)>60?(parseInt(data1[i].duration/3600)+"时"+(parseInt(data1[i].duration/60)-parseInt(data1[i].duration/3600)*60)):(parseInt(data1[i].duration/60));
                let durationsec = data1[i].duration%60;
                let durationstr = durationmin+"分"+durationsec+"秒";
                let rowjson ={
                  id: data1[i].report_id,
                  task_id:data1[i].task_id,
                  name: data1[i].name,
                  count: data1[i].count,
                  start_date :data1[i].start_date ,
                  end_date :data1[i].end_date ,
                  trigger_type:data1[i].trigger_type==0?"手动":"定时",
                  duration :durationstr ,//(filteredData[i].finished==null || filteredData[i].finished==undefined)?0:
                  status:data1[i].status==0?"completed":(data1[i].status==1?"running":(data1[i].status==2?"error":"cancel")),
                  error_type:2,//暂时先规定死，因为后端没实现，可用的是3
                }
                datalist.push(rowjson);
              }
              // dic去重
              let obj = {};
              let nameoptions_dic =fliternameoptions_dic.reduce(function(pre,item){
                obj[item.value]?'':(obj[item.value]=true && pre.push(item));
                return pre
              },[]); 
              if(selectedreportnameRef.value.length!=0){
                let ifid = [];
                ifid = nameoptions_dic.filter((row) => { 
                  // console.log("vbanben!!!!!!!2",row);
                  return selectedreportnameRef.value.includes(row.value)
                })
                if(ifid.length==0){
                  selectedreportnameRef.value=[];
                  message.error(t("perfor.report.thisnoreport"), { duration: 5000 })
                }
                // console.log("********************ifid",ifid);
              }
              // console.log("********************selectedreportnameRef.value.length",selectedreportnameRef.value.length);
              // console.log("********************nameoptions_dic",nameoptions_dic,selectedreportnameRef.value,3333);
              resolve({
                data: datalist,//文档错误，文档为 pagedData
                flitername_dic:nameoptions_dic
              })
            }
          }
        }).catch((err) =>{
          console.log("errrrrr",err); 
          if(err.response.status == 500)
            message.error( t("common.loaderr"), { duration: 5000 })
        });
        
      })
    }
    // idlist 是 查询的报告id数组
    function query (data,page, pageSize,idlist = [],trigger=[],statusl=[]) {
      return new Promise((resolve) => {
        var datalist2 = [] ;//清空再赋值，不然每次查询会累加       
        let rowdata = data;
        let rowdata1 = [];
        let rowdata2 = [];
        // 任务名称过滤
        if(idlist.length!=0){
          rowdata1 = rowdata.filter((row) => idlist.indexOf(row.task_id)!=-1);
        }else{
          rowdata1 = rowdata;
        }
        // 触发方式过滤
        if(trigger.length!=0){
          rowdata2 = rowdata1.filter((row) => trigger.indexOf(row.trigger_type)!=-1);
        }else{
          rowdata2 = rowdata1;
        }
        // 状态方式过滤
        if(statusl.length!=0){
          datalist2 = rowdata2.filter((row) => statusl.indexOf(row.status)!=-1);
        }else{
          datalist2 = rowdata2;
        }
        const total = datalist2.length;
        const pageCount = Math.ceil(datalist2.length / pageSize)
        // console.log("rowdata2: ",datalist.length,datalist2,rowdata2,statusl);
        resolve({
          pageCount,
          data: datalist2,//文档错误，文档为 pagedData
          total
        })
      })
    }
    // 刷新执行时间的定时器
    function duration_timer(data1,index){
      return new Promise((resolve) => {
        let timer = setInterval(() =>{
          // 当前时间
          let nowtimes = new Date(Date.now());
          let start_date = new Date(data1.start_date);
          let durationtime = parseInt((nowtimes - start_date)/1000);
          let durationmin = parseInt(durationtime/60)>60?( parseInt(durationtime/3600)+"时"+(parseInt(durationtime/60)-parseInt(durationtime/3600)*60)):(parseInt(durationtime/60));
          let durationsec = parseInt(durationtime) % 60;
          let durationstr = durationmin+"分"+durationsec+"秒";
          // 之前直接改是有问题的，不知道为什么
          dataRef.value[index].duration = durationstr;
          // console.log("***************data1",data1.name,durationstr,durationsec,dataRef.value[index].duration);
          // resolve({
          //   data: durationstr
          // })
        }, 1000 );
        resolve({
          timer: timer,
        })
        
      })
    }
    // 刷新执行状态的定时器
    function duration_status_timer(data1,index){
      return new Promise((resolve) => {
        let timer = setInterval(() =>{
          // 获取状态
          // console.log("        &&&& 检查状态开始：",data1);
          service.get('/loadtest/task_reports/'+data1.id).then(res=>{
            if(res.data.code != 0){
              //错误处理
              // reject({ status: 500, msg: 'error' })
            }else{
              // let ifend = res.data.data.end_date==null?false:true;
              // console.log("检查状态开始：",res.data.data.end_date!=null);
              if(res.data.data.end_date!=null){
                location.reload(); 
              }
            }
          })
        }, 300000 );//5分钟
        resolve({
          timer: timer,
        })
      })
    }
    // 刷新执行时间的定时器的上级，for循环 + 判断是否 running
    //  # # # # # 需要记录定时器id，方便销毁
    function duration_ing(data1){
      return new Promise((resolve) => {
        // 存计时器id的数组
        let timerlist = [];
        for(let i=0;i<data1.length;i++){
          // 如果是running，动态显示。如果是完成的，直接显示，就不走这个函数了
          if(data1[i].status=="running"){
            duration_timer(data1[i],i).then((data) => {
              let timeritem = data.timer;
              timerlist.push(timeritem);
            }); 
            duration_status_timer(data1[i],i).then((data) => {
              let timeritem = data.timer;
              timerlist.push(timeritem);
            });   
          }
        }
        resolve({
          data: timerlist,
        })
      })
    }
    onMounted(() => {
      queryinitdata().then((data) => { 
        datalistall = data.data;
        fliternameoptionsRef.value = data.flitername_dic
        // console.log("selectedreportnameRef.value",selectedreportnameRef.value);
        query(
          datalistall,
          paginationReactive.page,
          paginationReactive.pageSize,
          selectedreportnameRef.value,
          trigger_typeReactive.filterOptionValues,
          statusReactive.filterOptionValues
        ).then((data) => {
          dataRef.value = data.data;
          paginationReactive.pageCount = data.pageCount;
          paginationReactive.itemCount = data.total;
          duration_ing(dataRef.value).then((data) => {
            timerlistRef.value = data.data
          })
        })
        
      })
    });
    onUnmounted(() => {
      // 清除定时器
      for(let i=0;i<timerlistRef.value.length;i++){
        clearInterval(timerlistRef.value[i]);
      }
    });
    return {
      data: dataRef,
      // showModal: showModalRef,
      fliternameoptions:fliternameoptionsRef,
      searchloading: searchloadingRef,
      selectedreportname:selectedreportnameRef,
      // toname:tonameRef,
      checkedRowKeys: checkedRowKeysRef,
      pagination: paginationReactive,
      timerlist:timerlistRef,
      trigger_type:trigger_typeReactive,
      status:statusReactive,
      duration_ing,
      columns: createColumns({
        canceltask(rowData) {
          dialog.error({
            title:t("common.cancel"),
            content: () => t("perfor.report.ifsurecancel"),
            // action: () => "Action"
            positiveText: t("common.sure"),
            negativeText: t("common.cancel"),
            maskClosable: false,
            onMaskClick: () => {
              message.success( t("common.checktips"))
            },
            onPositiveClick: () => {
              // d.loading = true;
              service.get('/loadtest/task_reports/'+rowData.id+'/cancel').then(res=>{
                if(res.data.code != 0){
                  //错误处理
                  message.error(t("perfor.report.cancelerr")+res.data.message?(" :"+res.data.message):"");
                }else{
                  message.success(t("perfor.report.cancelsuc"));
                  location.reload() ; 
                }
              }).catch(e=>{
                // console.log("essrormessage",e.response.data);
                // alert(e.response.data);
                message.error(t("perfor.report.cancelerr"));
              });
            }
          });
        },
        retest(rowData){
          service.get('/loadtest/tasks/'+rowData.task_id+'/once').then(res=>{
            if(res.data.code!=0){
              message.error(t("version.enginemanage.err")+":"+res.data.message,{duration: 5000 });
            }else{
              message.success(t("version.enginemanage.suc"));
              location.reload() ; 
            }
          }).catch(e=>{
            // console.log("essrormessage",e.response.data);
            // alert(e.response.data);
            message.error(t("version.enginemanage.err"));
          });
        },
        retosql(rowData){

        },
        taskDetails(rowData){
          // V1.0
          // 打开新窗口的方法
          // let routeUrl = "http://192.168.101.20:7097/webroot/decision/view/report?viewlet=pfp%252F%25E6%25B1%2587%25E6%2580%25BB%252F1-10_remove_outlier_smoke.cpt&ref_t=design&op=write&ref_c=55a3c32a-b9e6-4d15-a753-39c0e6b0df51";
          // // router.resolve({
          // //   path: '/version/iterate/edit/' + rowData.id+'/'+rowData.finished,
          // // });
          // window.open(routeUrl, '_blank');//.href
          // V2.0  开新页面
          router.push({
            path: '/perfor/testreport/' + rowData.id,
          });
        },
        deleteItem(rowData) { // 接口结构还未实现
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
              service.delete('/loadtest/task_reports/'+rowData.id).then(res=>{
                message.success(t("common.deletesuc"));
                location.reload() ; 
              }).catch(e=>{
                // console.log("essrormessage",e.response.data);
                // alert(e.response.data);
                message.error(t("common.deleteerr"));
              });
            }
          });
        },
      }),
      reportnamesearch: (query) => {
        if (!query.length) {
          fliternameoptionsRef.value = [];
          return;
        }
        searchloadingRef.value = true;
        fliternameoptionsRef.value = fliternameoptions_dic.filter(
          (item) => ~item.label.indexOf(query)
        );
        searchloadingRef.value = false;
      },
      reportnamechange: (value) => {
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",selectedreportnameRef.value,value)
        query(
          datalistall,
          paginationReactive.page,
          paginationReactive.pageSize,
          value,
          trigger_typeReactive.filterOptionValues,
          statusReactive.filterOptionValues
        ).then((data) => {
          // console.log("data111:" ,data);
          // console.log("dataRef:" ,dataRef.value);
          dataRef.value = data.data;
          paginationReactive.pageCount = data.pageCount;
          paginationReactive.itemCount = data.total;
        })
      },
      rowKey (row) {
        return row.id
      },
      // rename(){
      //   service.put('/dashboard/task/'+tonameRef.value).then(res=>{
      //     message.success(t("common.updatesuc"));
      //     showModalRef.value = false;
      //     queryinitdata().then((data) => { 
      //       datalistall = data.data;
      //       console.log("selectedreportnameRef.value",selectedreportnameRef.value);
      //       query(
      //         datalistall,
      //         paginationReactive.page,
      //         paginationReactive.pageSize,
      //         selectedreportnameRef.value,
      //         trigger_typeReactive.filterOptionValues,
      //         statusReactive.filterOptionValues
      //       ).then((data) => {
      //         dataRef.value = data.data;
      //         paginationReactive.pageCount = data.pageCount;
      //         paginationReactive.itemCount = data.total;
      //         duration_ing(dataRef.value).then((data) => {
      //           timerlistRef.value = data.data
      //         })
      //       })
      //     })
      //   }).catch(e=>{
      //     // console.log("essrormessage",e.response.data);
      //     // alert(e.response.data);
      //     message.error(t("common.updateerr"));
      //     showModalRef.value = false;
      //     queryinitdata().then((data) => { 
      //       datalistall = data.data;
      //       console.log("selectedreportnameRef.value",selectedreportnameRef.value);
      //       query(
      //         datalistall,
      //         paginationReactive.page,
      //         paginationReactive.pageSize,
      //         selectedreportnameRef.value,
      //         trigger_typeReactive.filterOptionValues,
      //         statusReactive.filterOptionValues
      //       ).then((data) => {
      //         dataRef.value = data.data;
      //         paginationReactive.pageCount = data.pageCount;
      //         paginationReactive.itemCount = data.total;
      //         duration_ing(dataRef.value).then((data) => {
      //           timerlistRef.value = data.data
      //         })
      //       })
      //     })
      //   });
      // },
      handleCheck(rowKeys) {
        checkedRowKeysRef.value = rowKeys;
        // console.log(rowKeys,checkedRowKeysRef)
        console.log("checkedRowKeys",rowKeys.length,checkedRowKeysRef.value);
      },
      handlePageChange (currentPage) {
        // if (!loadingRef.value) {
          // loadingRef.value = true
          // console.log("data000:" ,data);
          query(
            datalistall,
            currentPage,
            paginationReactive.pageSize,
            selectedreportnameRef.value,
            trigger_typeReactive.filterOptionValues,
            statusReactive.filterOptionValues
          ).then((data) => {
            // console.log("data111:" ,data);
            // console.log("dataRef:" ,dataRef.value);
            dataRef.value = data.data
            // console.log("dataRefhou:" ,dataRef.value);
            paginationReactive.page = currentPage
            paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
          })
        // }
      },
      alldelete(){
        dialog.error({
          // title: "脚本备注",
          title:t("common.delete"),
          content: () => t("perfor.report.ifsuredeleteall")+checkedRowKeysRef.value.length,
          // action: () => "Action"
          positiveText: t("common.sure"),
          negativeText: t("common.cancel"),
          maskClosable: false,
          onMaskClick: () => {
            message.success( t("common.checktips"))
          },
          onPositiveClick: () => {
            for(let i = 0;i<checkedRowKeysRef.value.length;i++){
              service.delete('/loadtest/task_reports/'+checkedRowKeysRef.value[i]).then(res=>{
                if(i==checkedRowKeysRef.value.length-1){
                  message.success(t("common.deletesuc"));
                  location.reload();
                } 
              }).catch(e=>{
                // console.log("essrormessage",e.response.data);
                // alert(e.response.data);
                message.error(t("common.deleteerr"));
              });
            }
          }
        });
      },
      handleUpdateFilter (filters) {
        console.log("3333333333",filters)
        const triggerfilter = filters.trigger_type || [];
        const statusfilter = filters.status || [];
        query(
          datalistall,
          paginationReactive.page,
          paginationReactive.pageSize,
          selectedreportnameRef.value,
          triggerfilter,
          statusfilter
        ).then((data) => {
          trigger_typeReactive.filterOptionValues = triggerfilter;
          statusReactive.filterOptionValues = statusfilter;
          // console.log("3444444444",finishedReactive.filterOptionValues)
          dataRef.value = data.data
          paginationReactive.pageCount = data.pageCount
          paginationReactive.itemCount = data.total
          // loadingRef.value = false
        })
      },
    };
  },
  watch: {

  },
  mounted() {
    // this.getgroup();
    // this.$nextTick(function () {
    // })
  },
  computed: {

  },
  methods: {
    createmachine(){
      this.$router.push({
        path: '/version/iterate/create',
        query:{
          word:this.fliterword,
          type:this.flitertype,
          ifself:this.ifselfvalue
        }
      });
    },
    
  }
}
</script>
<style scoped>
:deep .n-data-table__pagination{
  padding-right:15px;
}
</style>
