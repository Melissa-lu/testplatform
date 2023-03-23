<template>
  <!-- <n-p> 你选中了 {{ checkedRowKeys.length }} 行。 </n-p> -->
  <!-- {{pagination.pageCount}} -->
  <n-space vertical :size="12">
    <n-form-item style="padding: 0 20% 0 0;margin-bottom: -30px;margin-top: -25px;" >
      <n-button strong secondary round type="tertiary" style="height: 38px;margin: 10px 10px 10px 0px;" @click="createscript">
          <template #icon>
              <n-icon><AddCircleOutline /></n-icon>
            </template>
      {{$t("common.add")}}
      </n-button>
    <!-- 指定tags 查询 -->
    <!-- <n-form-item style="width: 100%;margin-bottom: -10px;" > -->
      <n-input-group style="width: 100%;margin-left: 20px;">
        <n-input-group-label >{{$t('perfor.task.searchtags')}}</n-input-group-label>
        <n-select  :style="{ width: '100%' }" v-model:value="selectedtags" :options="flitertagsoptions" clearable 
          @search="tagssearch" multiple filterable :loading="searchloading" @update:value="tagschange" 
          remote lear-filter-after-select="false" 
        />
      </n-input-group>
    <!-- </n-form-item> -->
    <!-- 包含name 查询 -->
    <!-- <n-form-item style="width: 100%;margin-bottom: -10px;" > -->
      <n-input-group style="width: 100%;margin-left: 20px;">
        <n-input-group-label >{{$t('perfor.task.searchname')}}</n-input-group-label>
        <n-input :style="{ width: '100%' }" v-model:value="selectedname" clearable />
        <n-button type="primary" ghost @click="namechange" >
          {{$t('common.search')}}
        </n-button>
      </n-input-group>
    </n-form-item>
    
    <n-data-table
      size="large"  striped 
      ref="table"
      :bordered="false"
      :columns="columns"
      :data="data"
      :row-key="rowKey"
      :pagination="pagination"
      :loading="loading"
      :scroll-x="1600"
      @update:page="handlePageChange"
    />
    <!-- 详情 -->
    <n-modal v-model:show="showModal"  :title="$t('common.details')" preset="dialog" :mask-closable="false" style="width: 50%;margin-top:50px;margin-bottom:50px;padding: 30px;">
      <div  style="font-size: 18px;">
        <div  :v-model="detailobj" style="margin: 10px 40px;color: #18a058;" >
          {{$t('perfor.task.taskname') +" : "+detailobj.name}}
        </div>
        <!-- 定时调度的表达式 -->
        <div  style="margin: 10px 40px;">
          {{$t('perfor.task.corn') +" : "+detailobj.cron}}
        </div>
        <!-- 备注 -->
        <div style="margin: 10px 40px;" >
          {{$t('perfor.script.comment') +" : "+detailobj.comment}}
        </div>
      </div>
    </n-modal>
  </n-space>

</template>
<script>
// import axios from 'axios';
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRouter  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useDialog,NDialogProvider,useMessage,NPopover,NTooltip } from "naive-ui";
import { inject } from 'vue'
import { LogInOutline as LogInIcon,AddCircleOutline,BookOutline as BookIcon ,StopCircleOutline,NewspaperOutline} from "@vicons/ionicons5";
import { NotStartedOutlined,RestartAltRound ,EditNoteRound,DeleteOutlined,AutoAwesomeMosaicOutlined,ContentCopyRound} from "@vicons/material"
import service from '../../requests/axios';

function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}
export default {
  name: "TestTask",
  data() {
    return {
      result:{},
    };
  },
  props: {
  },
  components: {
    // LogInIcon,NotStartedOutlined,RestartAltRound,StopCircleOutline
    AddCircleOutline
  },
  created() {
  },
  setup() {
    const { t } = useI18n();
    var datalist = [];
    const router = useRouter();
    const dialog = useDialog();
    const message = useMessage();
    // const checkedRowKeysRef = ref([]);
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
    // 右键菜单
    // 右键菜单over
    var datalistall = [];
    const dataRef = ref([]);
    const selectedtagsRef=ref([]);
    const selectednameRef=ref("");
    const flitertagsoptionsRef = ref([]);
    var flitertagsoptions_dic =[];
    const showModalRef = ref(false);
    const detailobjRef = ref({});
    const loadingRef = ref(true);
    const createColumns = ({
      timedtask,timedtaskonce,editTask,deleteTask,reportTask,copyTask,taskDetails
    }) => {
      return [
        {
          title: t("perfor.task.name"),
          key: "name",
          width: 180,
          fixed: "left"
        },
        {
          title: t("perfor.tags"),
          key: "tags",
          // fixed: "right",
          width:200,
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
          title: t("perfor.task.status"),
          key: "status",
           width: 150,
        },
        {
          title: t("common.start_date1"),
          key: "next_time",
          width: 150,
        },
        {
          title: t("common.updated"),
          key: "updated_at",
          width: 150,
        },
        {
          title:t("common.action"),
          key: "timedtask",
          // titleColSpan: 6,//合并 3列表头
          width: 60,
          fixed: "right",
          render(row) {
            return h(NTooltip, {
                  trigger:"hover",
                  placement: 'bottom',
                },{
                  trigger: () =>
                    h( NButton,{
                        slot:'content',
                        style:{
                          width: "38px",padding: 0
                        },
                        onClick: () => timedtask(row)
                      },
                      row.status=="待开启"?renderIcon2(RestartAltRound):renderIcon2(StopCircleOutline)
                      // row.name=="22234"?renderIcon2(RestartAltRound):{ default: () => "222" }
                    ),
                  default: () => row.status=="待开启"?t("perfor.task.timedtaskstart"):t("perfor.task.timedtaskstop")
                }
              )
          },
        },
        {
          title:"",
          key: "timedtaskonce",
          // titleColSpan: 3,//合并 3列表头
          width: 50,
          fixed: "right",
          render(row) {
            return h(NTooltip,{
                  trigger:"hover",
                  placement: 'bottom',
                }, {
                  trigger: () =>
                    h( NButton,{
                        slot:'content',
                        style:{
                          width: "38px",padding: 0,margin: "0 0 0 -10px"
                        },
                        onClick: () =>  timedtaskonce(row)
                      },
                      renderIcon2(NotStartedOutlined)
                    ),
                  default: () => t("perfor.task.timedtaskonce")
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
          key: "report",
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
                        onClick: () => reportTask(row)
                      },
                      renderIcon2(NewspaperOutline)
                    ),
                  default: () =>  t("perfor.task.report")
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
                        onClick: () => editTask(row)
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
                        onClick: () => copyTask(row)
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
                        onClick: () => deleteTask(row)
                      },
                      renderIcon2(DeleteOutlined)
                    ),
                  default: () =>  t("common.delete")
                }
              )
          },
        },
        {
          title: t("perfor.script.scriptid"),
          key: "id",
          width: 1,
          ellipsis: true
        },
      ];
    };
    // const columnsRef = ref(columns)
    // 初始、切换数据加载
    function query () {
      return new Promise((resolve) => {
        datalist = [] ;//清空再赋值，不然每次查询会累加  
        flitertagsoptions_dic=[]; 
        let flitertagsoptions_list =[];
        service.get('/loadtest/tasks/').then(res=>{
          let data1 = res.data.data;
          // 处理存标签
          for(let i=0;i<data1.length;i++){
            for(let j=0;j<data1[i].tags.length;j++){
              if(flitertagsoptions_list.indexOf(data1[i].tags[j])==-1){
                flitertagsoptions_list.push(data1[i].tags[j]);
              }
            }
            // 形成新的显示json
            let rowjson ={
              id: data1[i].id,//后面要改成真的id
              name: data1[i].name,
              tags: data1[i].tags,
              //日期待传待处理
              next_time: data1[i].next_time??"",
              status:data1[i].auto_enabled?"运行中":"待开启",
              // scripturl:data1[i].data1[i].url,
              tags:data1[i].tags,
              //没有显示的
              comment:data1[i].comment,
              cron:data1[i].cron,
              updated_at:data1[i].updated_at,
            }
            datalist.push(rowjson);
            // console.log("11",rowjson,data1[i].tags)
          }
          //标签变成字典
          for(let j=0;j<flitertagsoptions_list.length;j++){
            flitertagsoptions_dic.push({label:flitertagsoptions_list[j],value:flitertagsoptions_list[j]})
          }
          resolve({
            // pageCount,
            data: datalist,//文档错误，文档为 pagedData
            flitertags_dic:flitertagsoptions_dic
          })
        });
        
      })
    }
    function queryfilter (data,page, pageSize,tags=[],taskname="") {
      return new Promise((resolve) => {
        var datalist2 = [] ;//清空再赋值，不然每次查询会累加       
        let rowdata = data;
        let rowdata1 = [];
        // 标签过滤
        if(tags.length!=0){
          rowdata1 = rowdata.filter((row) => {
            for(let i=0;i<row.tags.length;i++){
              if(tags.indexOf(row.tags[i])!=-1){
                return true;
              }
            }
          });
        }else{
          rowdata1 = rowdata;
        }
        // 任务名称过滤
        if(taskname.length!=0){
          datalist2 = rowdata1.filter((row) => row.name.indexOf(taskname)!=-1);
        }else{
          datalist2 = rowdata1;
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
    onMounted(() => {
      query().then((data) => { 
        datalistall = data.data;
        flitertagsoptionsRef.value = data.flitertags_dic
        // console.log("***************flitertagsoptionsRef.value",flitertagsoptionsRef.value);
        queryfilter(
          datalistall,
          paginationReactive.page,
          paginationReactive.pageSize,
          selectedtagsRef.value,
          selectednameRef.value,
        ).then((data) => {
          dataRef.value = data.data;
          paginationReactive.pageCount = data.pageCount;
          paginationReactive.itemCount = data.total;
        })
        
      })
    })
    return {
      data: dataRef,
      showModal: showModalRef,
      detailobj:detailobjRef,
      selectedtags:selectedtagsRef,
      selectedname:selectednameRef,
      flitertagsoptions:flitertagsoptionsRef,
      columns: createColumns({
        // 开启关闭定时任务
        timedtask(rowData) {
          service.get('/loadtest/tasks/'+rowData.id).then(res=>{
            let bodydata = res.data.data;
            bodydata.auto_enabled = (bodydata.auto_enabled==false?true:false);
            service.put('/loadtest/tasks/'+rowData.id,bodydata).then(res=>{
              if(res.data.code!=0){
                message.error(t("perfor.task.timedtaskchangeerr")+":"+res.data.message,{duration: 5000 });
              }else{
                message.success(t("perfor.task.timedtaskchangesuc"));
                query().then((data) => { 
                  datalistall = data.data;
                  flitertagsoptionsRef.value = data.flitertags_dic
                  // console.log("***************flitertagsoptionsRef.value",flitertagsoptionsRef.value);
                  queryfilter(
                    datalistall,
                    paginationReactive.page,
                    paginationReactive.pageSize,
                    selectedtagsRef.value,
                    selectednameRef.value,
                  ).then((data) => {
                    dataRef.value = data.data;
                    paginationReactive.pageCount = data.pageCount;
                    paginationReactive.itemCount = data.total;
                  })
                  
                })


              } 
            }).catch(e=>{
              // console.log("essrormessage",e.response.data);
              message.error(t("perfor.task.timedtaskchangeerr"));
            });
          });
        },
        timedtaskonce(rowData){
          service.get('/loadtest/tasks/'+rowData.id+'/once').then(res=>{
            if(res.data.code!=0){
              message.error(t("version.enginemanage.err")+":"+res.data.message,{duration: 5000 });
            }else{
              message.success(t("version.enginemanage.suc"));
            }
          }).catch(e=>{
            // console.log("essrormessage",e.response.data);
            // alert(e.response.data);
            message.error(t("version.enginemanage.err"));
          });
        },
        editTask(rowData) {
          console.log("555 send mail to " + rowData.id);
          router.push({
            path: '/perfor/testtask/edit/' + rowData.id,//test.id需要改成project的name
          });
        },
        deleteTask(rowData) {
          // console.log("666 send mail to " + rowData.idkey);
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
              service.delete('/loadtest/tasks/'+rowData.id).then(res=>{
                if(res.data.code!=0){
                  message.error(t("common.deleteerr")+":"+res.data.message,{duration: 5000 });
                }else{
                  message.success(t("common.deletesuc"));
                }
                query().then((data) => { 
                  datalistall = data.data;
                  flitertagsoptionsRef.value = data.flitertags_dic
                  // console.log("***************flitertagsoptionsRef.value",flitertagsoptionsRef.value);
                  queryfilter(
                    datalistall,
                    paginationReactive.page,
                    paginationReactive.pageSize,
                    selectedtagsRef.value,
                    selectednameRef.value,
                  ).then((data) => {
                    dataRef.value = data.data;
                    paginationReactive.pageCount = data.pageCount;
                    paginationReactive.itemCount = data.total;
                  })
                  
                })
              }).catch(e=>{
                // console.log("essrormessage",e.response.data);
                message.error(t("common.deleteerr"));
                query().then((data) => { 
                  datalistall = data.data;
                  flitertagsoptionsRef.value = data.flitertags_dic
                  // console.log("***************flitertagsoptionsRef.value",flitertagsoptionsRef.value);
                  queryfilter(
                    datalistall,
                    paginationReactive.page,
                    paginationReactive.pageSize,
                    selectedtagsRef.value,
                    selectednameRef.value,
                  ).then((data) => {
                    dataRef.value = data.data;
                    paginationReactive.pageCount = data.pageCount;
                    paginationReactive.itemCount = data.total;
                  })
                  
                })
              });
            }
          });
          // this.reload();
          
        },
        copyTask(rowData) {
          service.get('/loadtest/tasks/'+rowData.id).then(res=>{
            let data1 = res.data.data;
            data1.name = res.data.data.name+"_copy";
            service.post('/loadtest/tasks',data1).then(res=>{             
              message.success(t("common.createsuc"));   
              query().then((data) => { 
                datalistall = data.data;
                flitertagsoptionsRef.value = data.flitertags_dic
                // console.log("***************flitertagsoptionsRef.value",flitertagsoptionsRef.value);
                queryfilter(
                  datalistall,
                  paginationReactive.page,
                  paginationReactive.pageSize,
                  selectedtagsRef.value,
                  selectednameRef.value,
                ).then((data) => {
                  dataRef.value = data.data;
                  paginationReactive.pageCount = data.pageCount;
                  paginationReactive.itemCount = data.total;
                })
                
              })        
            }).catch(e=>{
              // console.log("essrormessage",e.response.data);
              // alert(e.response.data);
              message.error(t("common.createerr"));
              query().then((data) => { 
                datalistall = data.data;
                flitertagsoptionsRef.value = data.flitertags_dic
                // console.log("***************flitertagsoptionsRef.value",flitertagsoptionsRef.value);
                queryfilter(
                  datalistall,
                  paginationReactive.page,
                  paginationReactive.pageSize,
                  selectedtagsRef.value,
                  selectednameRef.value,
                ).then((data) => {
                  dataRef.value = data.data;
                  paginationReactive.pageCount = data.pageCount;
                  paginationReactive.itemCount = data.total;
                })
                
              }) 
            });
          });
        },
        taskDetails(rowData){
          // querydetailslist(rowData).then((data) => {
          detailobjRef.value = {
            name:rowData.name,
            comment:rowData.comment,
            cron:rowData.cron
          };
          console.log("888999",rowData,detailobjRef.value);
          showModalRef.value = true;
            // console.log("888999",detailobjRef.value)
          // }) 
        },
        reportTask(rowData){
          // router.push({
          //   path: '/perfor/testreport',//test.id需要改成project的name
          //   query:{
          //     name:rowData.id
          //   }
          // });
          //新开页面就解决了tab页切换的问题
          let routeUrl = window.location.origin +'/perfor/testreport?name='+rowData.id;
          window.open(routeUrl, '_blank');//.href
        }
      }),
      // 可调的
      pagination: paginationReactive,
      // checkedRowKeys: checkedRowKeysRef,
      rowKey: (row) => row.id,
      handlePageChange (currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          // console.log("data000:" ,data);
          query().then((data) => { 
            datalistall = data.data;
            flitertagsoptionsRef.value = data.flitertags_dic
            // console.log("***************flitertagsoptionsRef.value",flitertagsoptionsRef.value);
            queryfilter(
              datalistall,
              currentPage,
              paginationReactive.pageSize,
              selectedtagsRef.value,
              selectednameRef.value,
            ).then((data) => {
              dataRef.value = data.data;
              paginationReactive.page = currentPage
              paginationReactive.pageCount = data.pageCount
              paginationReactive.itemCount = data.total
            })
            
          })
        }
      },
      createscript(){
        // console.log("到站了111")
        router.push({
          path: '/perfor/testtask/create',
        });
      },
      tagssearch: (query) => {
        if (!query.length) {
          flitertagsoptionsRef.value = [];
          return;
        }
        // searchloadingRef.value = true;
        flitertagsoptionsRef.value = flitertagsoptions_dic.filter(
          (item) => ~item.label.indexOf(query)
        );
        // searchloadingRef.value = false;
      },
      tagschange: (value) => {
        queryfilter(
          datalistall,
          paginationReactive.page,
          paginationReactive.pageSize,
          value,
          selectednameRef.value,
        ).then((data) => {
          dataRef.value = data.data;
          paginationReactive.pageCount = data.pageCount;
          paginationReactive.itemCount = data.total;
        })
      },
      namechange: () => {
        console.log("xsacsac",selectednameRef.value,)
        queryfilter(
          datalistall,
          paginationReactive.page,
          paginationReactive.pageSize,
          selectedtagsRef.value,
          selectednameRef.value,
        ).then((data) => {
          dataRef.value = data.data;
          paginationReactive.pageCount = data.pageCount;
          paginationReactive.itemCount = data.total;
        })
      },
      // initTableData() {
      // }
    };
  },
  watch: {

  },
  mounted() {
  },
  computed: {

  },
  methods: {
   
  }
}
</script>
<style scoped>
:deep .n-data-table .n-data-table-td,:deep .n-data-table .n-data-table-th{
  text-align: center !important;
}
</style>
