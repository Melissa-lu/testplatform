<template>
  <!-- <n-p> 你选中了 {{ checkedRowKeys.length }} 行。 </n-p> -->
  <!-- {{pagination.pageCount}} -->
  
  <n-space vertical :size="12">
    <div>
      <n-button strong secondary round type="success" @click="createmachine" style="float: left;height: 38px;margin: 20px 10px 10px 15px;">
        <template #icon>
          <n-icon><AddCircleOutline /></n-icon>
        </template>
        {{$t("common.input")}}
      </n-button>
      <n-upload ref="uploadxls" :show-file-list=false  :show-retry-button=false  @change="touploadxls" >
        <n-button strong secondary round type="success" style="float: left;height: 38px;margin: 20px 10px 10px 15px;">
          <template #icon>
                <n-icon><AddCircleOutline /></n-icon>
              </template>
          {{$t('common.uploadxls')}}
        </n-button>
      </n-upload>
      <!-- 仅显示自己的 -->
      <n-button strong secondary round type="success" :disabled="selfenable" @click="selffilter" style="float: left;height: 38px;margin:-53px 10px 10px 235px;">
        {{ifselfvalue=="ttt"?$t("common.onlyselfreset"):$t("common.onlyself")}}
      </n-button>
      <!-- 指定 任务id 查询 / 按版本查询-->
      <n-form-item  style="margin:-51px 0px -25px 375px;max-width: 440px;height: 38px;" label-placement="left">
        <n-input-group style="width: 150%;" >
          <n-input-group-label >{{$t('version.iterate.searchtype')}}</n-input-group-label>
          <n-select :style="{ width: '45%' }" v-model:value="flitertype"  :options="flitertypeoptions" clearable
        @update:value="flitertypechange" />
          <n-input :style="{ width: '55%' }" v-model:value="fliterword" clearable round />
          <n-button type="primary" ghost @click="searchchange" :disabled="wordenable" >{{$t('common.search')}}</n-button>
        </n-input-group>
      </n-form-item>
      <!-- 批量删除按钮 :disabled="true"-->
      <n-button strong secondary round type="error" :disabled="checkedRowKeys.length!=0?false:true" @click="alldelete" style="float: right;height: 38px;margin: -53px 10px 0px 15px;">
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
        @update:checked-row-keys="handleCheck"
        @update:page="handlePageChange"
        @update:filters="handleUpdateFilter"
        style="margin-left:15px"
      />
    
  </n-space>
  
</template>

<script>
import axios from 'axios';
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRouter,useRoute  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useDialog,NDialogProvider,useMessage,NTooltip  } from "naive-ui";
import { inject } from 'vue'
import service from '../../../requests/axios';
import { LogInOutline as LogInIcon,AddCircleOutline } from "@vicons/ionicons5";
import { EditNoteRound,DeleteOutlined} from "@vicons/material";
import pmFliter from '../../../assets/data/pmFliter.json';
import iterateStatusFliter from '../../../assets/data/iterateStatusFliter.json';
import servicefile from '@/requests/axiosfile';


function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}
export default {
  name: "VIindex",
  data() {
    return {
      result:{},
    };
  },
  props: {
  },
  components: {
    LogInIcon,AddCircleOutline,DeleteOutlined
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
    const fileListxlsRef = ref(0);
    const uploadxlsRef = ref(null);
    const notify_users={
      title: t("version.iterate.notify_users"),
      key: "notify_users",
      render(row) {
        const current_notify_users = row.notify_users.map((tagKey) => {
          return h(NTag, {
            style: {
              // margin: "0 3px !important",
              marginRight: "2px",
              textalign:"center",
              display: "inline-flex",
            },
            type: "success",
            bordered: false
          }, {
            default: () => tagKey
          });
        });
        return current_notify_users;
      },
      filter: true,
      filterOptionValues: [],
      filterOptions: pmFliter.value,
    };
    const finished ={
      title: t("common.status"),
      key: "finished",
      width: 100,
      render(row) {
        if(row.finished == 0 || row.finished == 1){
          return h(NTag, {
            style: {
              marginRight: "6px",
              textalign:"center",
            },
            type: "success",
            bordered: false
          }, {
            default: () => row.finished == 0?"正常":"已完成"
          });
        }else if(row.finished == 2){
            return h(NTag, {
            style: {
              marginRight: "6px",
              textalign:"center",
            },
            type: "error",
            bordered: false
          }, {
            default: () => "中止"
          });
        }else if(row.finished == 3){
            return h(NTag, {
            style: {
              marginRight: "6px",
              textalign:"center",
            },
            type: "info",
            bordered: false
          }, {
            default: () => "待完善"
          });
        }
      },
      filter: true,
      filterOptionValues: [],
      filterOptions: iterateStatusFliter.value,
    };
    const finishedReactive = reactive(finished);
    const notify_usersReactive = reactive(notify_users);
    const createColumns = ({
      edititerateItem,deleteiterateItem
    }) => {
      return [
      {
        type: "selection",
      },
      {
          title: t("version.iterate.work_id"),
          key: "work_id",
          width:160,
        },
        {
          title: t("version.versionnode.minorversion"),
          key: "minorversion",
          width:100,
          render(row) {
            let devalue = "";
            if(row.minorversion!=null){
              for(let i=0;i<row.minorversion.length;i++){
              // row.minorversion.map((item) => {
                if(row.minorversion[i].id == row.version_id){
                  devalue = row.minorversion[i].value;
                  break;
                }
              // });
              };
            };
            return h('span', {
              style: {},
            }, {
              default: () => devalue
            });
          }
        },
        notify_users,
        {
          title: t("common.updated"),
          key: "update_at",
        },
        finished,
        {
          title: t("common.created_user"),
          key: "created_by",
          width:140,
        },
        {
          title: t("common.modified_user"),
          key: "modified_by",
          width:140,
        },
        {
          title:t("common.action"),
          key: "edit",
          titleColSpan: 2,//合并 2列表头
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
                        onClick: () => edititerateItem(row)
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
          key: "delete",
          width: 60,
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
                        onClick: () => deleteiterateItem(row)
                      },
                      renderIcon2(DeleteOutlined)
                    ),
                  default: () =>  t("common.delete")
                }
              )
          },
        },
        {
          title: "Idkey",
          key: "id",
          width: 1,
          ellipsis: true,
        },
        {
          title: "",
          key: "version_id",
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
    // 按钮是否禁用
    const selfenableRef = ref(false);
    const wordenableRef = ref(false);
    // 传过来的什么就是什么，或者就是初始化
    const flitertypeRef = ref(route.query.type?route.query.type:"1");
    const fliterwordRef = ref(route.query.word?route.query.word:"");
    const ifselfvalueRef = ref(route.query.ifself?route.query.ifself:"fff");
    const loadingRef = ref(true);
    var versionlist = [];
    // const columnsRef = ref(columns)
    // 初始、切换数据加载
    function queryinitdata (versionlist) {
      return new Promise((resolve) => {
        datalist = [] ;//清空再赋值，不然每次查询会累加       
        service.get('/dashboard/task').then(res=>{
          if(res.data.code != 0){
            //错误处理
            // reject({ status: 500, msg: 'error' })
          }else{
            let data1 = res.data.data;
 
            for(let i=0;i<data1.length;i++){
              // 形成新的显示json
              let rowjson ={
                work_id: data1[i].work_id,
                created_by: data1[i].created_by,
                modified_by: data1[i].modified_by,
                minorversion:versionlist,
                version_id:data1[i].version_id,
                update_at:data1[i].updated_at,
                finished:data1[i].finished,//(filteredData[i].finished==null || filteredData[i].finished==undefined)?0:
                id:data1[i].id,
                notify_users:data1[i].notify_users,
                stages:data1[i].stages
              }
              datalist.push(rowjson);
            }
            // console.log("pageCount: ",datalist.length,pageCount,total);
            resolve({
              data: datalist,//文档错误，文档为 pagedData
            })
          }
        }).catch((err) =>{
          console.log("errrrrr",err); 
          if(err.response.status == 500)
            message.error( t("common.loaderr"), { duration: 5000 })
        });
        
      })
    }
    // filterValues 是finish状态,filterValues2 是pm筛选, ifidversion 是查询方式为版本还是id ，idorversion 是对应的值， ifself 是是否只查询自己
    function query (data,page, pageSize,versionlist,filterValues = [],filterValues2 = [],idorversion="",ifidversion=0,ifself=false) {
      return new Promise((resolve) => {
        var datalist2 = [] ;//清空再赋值，不然每次查询会累加       
        // 外部的过滤条件应该是优先处理
        let rowdata = data;
        // 是否仅自己的过滤
        let rowdata1 = [];
        console.log("188809999999999999",ifself,rowdata);//cns.appContext.config.globalProperties.$Name);
        let nowself = cns.appContext.config.globalProperties.$Name;
        if(ifself=="ttt"){
          for(let i=0;i<rowdata.length;i++){
            for(let j=0;j<rowdata[i].stages.length;j++){
              if(rowdata[i].stages[j].notify_users.includes(nowself)){
                rowdata1.push(rowdata[i]);
                break;
              }
            }
          }
        }else{
          rowdata1 = rowdata;
        }
        // console.log("rowdata1",idorversion,ifidversion,rowdata1);
        // id 和 版本的过滤
        // 0 :id     1 :version
        let rowdata2 = [];
        let idorversion_id = "";
        if(idorversion){
          if(ifidversion == 0){
            rowdata2 = rowdata1.filter((row) => idorversion.indexOf(row.work_id)!=-1);
          }else if(ifidversion == 1){
            // 获取输入版本对应的版本id
            console.log("188777771",versionlist,idorversion);
            for(let i=0;i<versionlist.length;i++){
              // 去除字符串的前后空格
              if(versionlist[i].value == idorversion.replace(/^\s+|\s+$/g,"")){
                idorversion_id = versionlist[i].id;
                // console.log("chenggong",idorversion_id);
              }
            }
            // id 匹配
            for(let i=0;i<rowdata1.length;i++){
              if(idorversion_id == rowdata1[i].version_id){
                rowdata2.push(rowdata1[i]);
              }
            }
          }
        }else{
          rowdata2 = rowdata1;
        }
        
        
        console.log("rowdata2?",rowdata2);
        // 表格里过滤状态开始
        let data1 = rowdata2;
        const filteredData1 = filterValues.length? data1.filter((row) => filterValues.includes(row.finished)): data1;
        let filteredData = [];//filteredData1;//filterValues2.length? filteredData1.filter((row) => filterValues2.includes(row.notify_users)): filteredData1;
        if(filterValues2.length){
          for(let j=0;j<filteredData1.length;j++){
            let flag = false;
            // console.log("row: ",filteredData1[j]);
            for(let i=0;i<filterValues2.length;i++){
              if(filteredData1[j].notify_users.indexOf(filterValues2[i])!= -1){
                if( flag == false){
                  filteredData.push(filteredData1[j]);
                  flag = true;
                }
              } 
            }
            // console.log("row: ",row);
          }
        }
        else{
          filteredData = filteredData1;
        }
        for(let i=0;i<filteredData.length;i++){
          // 形成新的显示json
          let rowjson ={
            work_id: filteredData[i].work_id,
            created_by: filteredData[i].created_by,
            modified_by: filteredData[i].modified_by,
            minorversion:versionlist,
            version_id:filteredData[i].version_id,
            update_at:filteredData[i].update_at,
            finished:filteredData[i].finished,//(filteredData[i].finished==null || filteredData[i].finished==undefined)?0:
            id:filteredData[i].id,
            notify_users:filteredData[i].notify_users,
          }
          datalist2.push(rowjson);
        }
        const total = datalist2.length;
        const pageCount = Math.ceil(datalist2.length / pageSize)
        // console.log("pageCount: ",datalist.length,pageCount,total);
        resolve({
          pageCount,
          data: datalist2,//文档错误，文档为 pagedData
          total
        })
      })
    }
    function queryminior (page, pageSize) {
      return new Promise((resolve) => {
        versionlist = [];
        service.get('/dashboard/version/minor').then(respose=>{
          if(respose.data.code != 0){
            //错误处理
            // reject({ status: 500, msg: 'error' })
          }else{
            let data1 = respose.data.data;
            for(let i=0;i<data1.length;i++){
              // 形成新的显示json
              let rowjson ={
                id: data1[i].id,
                value: data1[i].minor_version,
              }
              versionlist.push(rowjson);
            }
            resolve({
              data: versionlist,//文档错误，文档为 pagedData
            })

          }
        }).catch((err) =>{
          console.log("errrrrr",err);
          if(err.response.status == 500)
            message.error( t("common.loaderr"), { duration: 5000 })
        });         
      })
    }
    onMounted(() => {
      queryminior().then((data) =>{
        let versionlist = data.data;
        // flitertypeRef.value fliterwordRef.value,
        queryinitdata(versionlist).then((data) => { 
          datalistall = data.data;
          query(
            datalistall,
            paginationReactive.page,
            paginationReactive.pageSize,versionlist,
            finishedReactive.filterOptionValues,
            notify_usersReactive.filterOptionValues,
            fliterwordRef.value,
            flitertypeRef.value,
            ifselfvalueRef.value
          ).then((data) => {
            dataRef.value = data.data;
            paginationReactive.pageCount = data.pageCount;
            paginationReactive.itemCount = data.total;
            loadingRef.value = false;
          })
        
        })
        // query(
        //   paginationReactive.page,
        //   paginationReactive.pageSize,versionlist,
        //   finishedReactive.filterOptionValues,
        //   notify_usersReactive.filterOptionValues,
        //   fliterwordRef.value,
        //   flitertypeRef.value,
        //   ifselfvalueRef.value
        // ).then((data) => {
        //   dataRef.value = data.data;
        //   paginationReactive.pageCount = data.pageCount;
        //   paginationReactive.itemCount = data.total;
        //   loadingRef.value = false;
        // })
      })
    })
    return {
      data: dataRef,
      finished:finishedReactive,
      notify_users:notify_usersReactive,
      fileListxls: fileListxlsRef,
      uploadxls: uploadxlsRef,
      ifselfvalue:ifselfvalueRef,
      wordenable:wordenableRef,
      selfenable:selfenableRef,
      flitertype:flitertypeRef,
      fliterword:fliterwordRef,
      flitertypeoptions: ref([
        {
          label: "指定版本",
          value: "1"
        },{
          label: "指定任务id",
          value: "0"
        }
      ]),
      columns: createColumns({
        edititerateItem(rowData) {
          // console.log("555 send mail to " + rowData.id);
          router.push({
            path: '/version/iterate/edit/' + rowData.id+'/'+rowData.finished,//test.id需要改成project的name
            query:{
              word:fliterwordRef.value,
              type:flitertypeRef.value,
              ifself:ifselfvalueRef.value
            }
          });
          // 打开新窗口的方法
          // let routeUrl = router.resolve({
          //   path: '/version/iterate/edit/' + rowData.id+'/'+rowData.finished,
          // });
          // window.open(routeUrl.href, '_blank');
        },
        deleteiterateItem(rowData) {
          // // console.log("666 send mail to " + rowData.idkey);
          // service.delete('/dashboard/task/'+rowData.id).then(res=>{
          //   message.success(t("common.deletesuc"));
          //   location.reload() ; 
          // }).catch(e=>{
          //   // console.log("essrormessage",e.response.data);
          //   // alert(e.response.data);
          //   message.error(t("common.deleteerr"));
          // });
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
              service.delete('/dashboard/task/'+rowData.id).then(res=>{
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
      // 可调的
      pagination: paginationReactive,
      checkedRowKeys: checkedRowKeysRef,
      rowKey (row) {
        return row.id
      },
      handleCheck(rowKeys) {
        checkedRowKeysRef.value = rowKeys;
        // console.log(rowKeys,checkedRowKeysRef)
        console.log("checkedRowKeys",rowKeys.length,checkedRowKeysRef.value);
      },
      handlePageChange (currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          // console.log("data000:" ,data);
          query(
            datalistall,
            currentPage,
            paginationReactive.pageSize,versionlist,
            finishedReactive.filterOptionValues,
            notify_usersReactive.filterOptionValues,
            fliterwordRef.value,
            flitertypeRef.value,
            ifselfvalueRef.value
          ).then((data) => {
            // console.log("data111:" ,data);
            // console.log("dataRef:" ,dataRef.value);
            dataRef.value = data.data
            // console.log("dataRefhou:" ,dataRef.value);
            paginationReactive.page = currentPage
            paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
            loadingRef.value = false
          })
        }
      },
      handleUpdateFilter (filters) {
        console.log("3333333333",filters)
        if (!loadingRef.value) {
          loadingRef.value = true
          const finishedfilter = filters.finished || [];
          const notify_usersfilter = filters.notify_users || [];
          query(
            datalistall,
            paginationReactive.page,
            paginationReactive.pageSize,versionlist,
            finishedfilter,
            notify_usersfilter,
            fliterwordRef.value,
            flitertypeRef.value,
            ifselfvalueRef.value
          ).then((data) => {
            finishedReactive.filterOptionValues = finishedfilter;
            notify_usersReactive.filterOptionValues = notify_usersfilter;
            console.log("3444444444",finishedReactive.filterOptionValues)
            dataRef.value = data.data
            paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
            loadingRef.value = false
          })
        }
      },
      // 上传新的迭代信息，需要更新列表-》查询
      touploadxls(options){
        fileListxlsRef.value = options.fileList;
        // fileListxlsRef.value = uploadxlsRef.value;
        // console.log("jmx1 ",options,fileListxlsRef.value);
        // console.log("uploadxlsRef.value",uploadxlsRef.value);
        if(fileListxlsRef.value.length>0){
          let formdata = new FormData();
          console.log("fileListxlsRef.value",fileListxlsRef.value);
          formdata.append('file', fileListxlsRef.value[0].file);//只可能有一个，所以直接 [0]
          // 上传文件
          servicefile.post('/dashboard/task/import',formdata).then(res=>{
            if(res.data.code != 0 && res.data.code != 300){
              //错误处理
              message.error(t("version.iterate.putxlserr")+" : "+res.data.message,{ duration: 600000,closable: true, });
              // 清空上传excel的数组
              uploadxlsRef.value.clear();
            }else{
              if(res.data.code == 300){
                message.info(res.data.message+":"+JSON.stringify(res.data.data),{ duration: 600000,closable: true, });
                // console.log("res.data.message",res.data.message);
              }else{
                message.success(t("version.iterate.putxlssucc")); 
              } 
              // console.log("fileListxlsRef.value",fileListxlsRef.value);
              // 更新页面
              queryminior().then((data) =>{
                let versionlist = data.data;
                queryinitdata(versionlist).then((data) => { 
                  datalistall = data.data;
                  query(
                    datalistall,
                    paginationReactive.page,
                    paginationReactive.pageSize,versionlist,
                    finishedReactive.filterOptionValues,
                    notify_usersReactive.filterOptionValues,
                    fliterwordRef.value,
                    flitertypeRef.value,
                    ifselfvalueRef.value
                  ).then((data) => {
                    dataRef.value = data.data;
                    paginationReactive.pageCount = data.pageCount;
                    paginationReactive.itemCount = data.total;
                    loadingRef.value = false;
                  })
                })
              }) 
              // 清空上传excel的数组
              uploadxlsRef.value.clear();
              // console.log("filelist",fileListxlsRef.value);
            }               
          }).catch(err=>{
              // console.log("essrormessage",e.response.data);
              // alert(e.response.data);
              // 清空上传excel的数组
              uploadxlsRef.value.clear();
              message.error(t("version.iterate.putxlserr")+" : "+(err.data.message?res.data.message:""),{ duration: 600000,closable: true, });
              // router.push({
              //   path: '/perfor',
              // });  
          });
        }
      },
      alldelete(){
        dialog.error({
          // title: "脚本备注",
          title:t("common.delete"),
          content: () => t("version.iterate.ifsuredeleteall")+checkedRowKeysRef.value.length,
          // action: () => "Action"
          positiveText: t("common.sure"),
          negativeText: t("common.cancel"),
          maskClosable: false,
          onMaskClick: () => {
            message.success( t("common.checktips"))
          },
          onPositiveClick: () => {
            for(let i = 0;i<checkedRowKeysRef.value.length;i++){
              service.delete('/dashboard/task/'+checkedRowKeysRef.value[i]).then(res=>{
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
      searchchange(){
        wordenableRef.value = true;
        query(
          datalistall,
          paginationReactive.page,
          paginationReactive.pageSize,versionlist,
          finishedReactive.filterOptionValues,
          notify_usersReactive.filterOptionValues,
          fliterwordRef.value,
          flitertypeRef.value,
          ifselfvalueRef.value
        ).then((data) => {
          dataRef.value = data.data;
          paginationReactive.pageCount = data.pageCount;
          paginationReactive.itemCount = data.total;
          loadingRef.value = false;
          wordenableRef.value = false;
        })
      },
      selffilter(){
        selfenableRef.value = true;
        // 更新页面
        console.log("ifself?",ifselfvalueRef.value);
        let flag = "";
        if( ifselfvalueRef.value == "fff"){
          flag = "ttt";
        }else{
          flag="fff";
        }
        query(
          datalistall,
          paginationReactive.page,
          paginationReactive.pageSize,versionlist,
          finishedReactive.filterOptionValues,
          notify_usersReactive.filterOptionValues,
          fliterwordRef.value,
          flitertypeRef.value,
          flag
        ).then((data) => {
          dataRef.value = data.data;
          paginationReactive.pageCount = data.pageCount;
          paginationReactive.itemCount = data.total;
          loadingRef.value = false;
          selfenableRef.value = false;
        })
        ifselfvalueRef.value = flag; 
        console.log("ifself?2",ifselfvalueRef.value);
      }
    };
  },
  watch: {

  },
  mounted() {
    // this.getgroup();
    // this.$nextTick(function () {
    //   service.get('/dashboard/version/minor').then(respose=>{
    //     if(respose.data.code != 0){
    //       //错误处理
    //       // reject({ status: 500, msg: 'error' })
    //     }else{
    //       let versionlist = respose.data.data;
    //       // console.log("data1222",dataRef.value);
    //       for(let i=0;i<this.data.length;i++){
    //         for(let j=0;j< versionlist.length;j++){
    //           if(this.data[i].version_id == versionlist[j].id ){
    //             this.data[i].minorversion = versionlist[j].minor_version;
    //             continue;
    //             // console.log("3333333333333333",this.data[i].minorversion,versionlist[j].minor_version);
    //           }
    //         }
    //       }
    //     }
    //   })
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
