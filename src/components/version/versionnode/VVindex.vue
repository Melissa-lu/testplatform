<template>
  <!-- <n-p> 你选中了 {{ checkedRowKeys.length }} 行。 </n-p> -->
  <!-- {{pagination.pageCount}} -->
  
  <n-space vertical :size="12">
    <!-- disabled = false 表示可用，true为禁用 -->
    <n-button strong secondary round type="success" 
      @click="createmachine" style="height: 38px;margin: 10px;margin-left:15px">
         <template #icon>
            <n-icon><AddCircleOutline /></n-icon>
          </template>
      {{$t("common.input")}}
    </n-button>
    
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
        style="margin-left:15px"
      />
    
  </n-space>
  
</template>

<script>
// import axios from 'axios';
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRouter  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useDialog,NDialogProvider,useMessage,NTooltip  } from "naive-ui";
import { inject } from 'vue'
import service from '../../../requests/axios';
import { LogInOutline as LogInIcon,AddCircleOutline } from "@vicons/ionicons5";
import { NotStartedOutlined,RestartAltRound ,EditNoteRound,DeleteOutlined,StopCircleOutlined,
   RestartAltFilled,PublishedWithChangesRound } from "@vicons/material"
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from "@vicons/ionicons5";
function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}
export default {
  name: "VVindex",
  data() {
    return {
      result:{},
      // flag:false
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
    const dialog = useDialog();
    const router = useRouter();
    const message = useMessage();
    const createColumns = ({
      editVersionItem,deleteVersionItem
    }) => {
      return [
        {
          title: t("version.versionnode.versionname"),
          key: "name",
        },
        {
          title: t("version.versionnode.bigversion"),
          key: "bigversion",
        },
        {
          title: t("version.versionnode.minorversion"),
          key: "minorversion"
        },
        {
          title: t("common.created_user"),
          key: "created",
        },
        {
          title: t("common.modified_user"),
          key: "modified",
        },
        {
          title: t("common.updated"),
          key: "update_at",
        },
        {
          title:t("common.action"),
          key: "edit",
          titleColSpan: 2,//合并 2列表头
          width: 50,
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
                        onClick: () => editVersionItem(row)
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
                        onClick: () => deleteVersionItem(row)
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
        service.get('/dashboard/version').then(res=>{
           if(res.data.code != 0){
            //错误处理
            // reject({ status: 500, msg: 'error' })
          }else{
          let data1 = res.data.data;
            for(let i=0;i<data1.length;i++){
              // 形成新的显示json
              let rowjson ={
                id: data1[i].id,
                name: data1[i].name,
                bigversion: data1[i].version,
                minorversion: data1[i].minor_version,
                modified: data1[i].modified_by,
                created:data1[i].created_by,
                update_at:data1[i].updated_at,
              }
              datalist.push(rowjson);
            }
            // datalist = data1;
            console.log("datalist: ",datalist);

            // const pagedData = datalist.slice((page - 1) * pageSize, page * pageSize);
            // console.log("filteredData: ", datalist ,typeof(datalist),typeof(pagedData));
            
            // console.log("pagedData: ",pagedData,pageSize,page);
            const total = datalist.length;
            const pageCount = Math.ceil(datalist.length / pageSize)
            // console.log("pageCount: ",datalist.length,pageCount,total);
            resolve({
                  pageCount,
                  data: datalist,//文档错误，文档为 pagedData
                  total
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
      query(
        paginationReactive.page,
        paginationReactive.pageSize,
      ).then((data) => {
        dataRef.value = data.data
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      })
    })
    return {
      data: dataRef,
      columns: createColumns({
        editVersionItem(rowData) {
          // console.log("555 send mail to " + rowData.id);
          router.push({
            path: '/version/version/edit/' + rowData.id,//test.id需要改成project的name
            // path: '/perfor/script/create/',
          });
        },
        deleteVersionItem(rowData) {
          // if(flag==true ){
          // console.log("666 send mail to " + rowData.idkey);
            service.get('/dashboard/task?version_id='+rowData.id).then(res=>{
              let datalen = 0;
              if(res.data.data!=null){
                datalen = res.data.data.length;
              }
              dialog.error({
                // title: "脚本备注",
                title:t("common.delete"),
                content: () => t("version.versionnode.assuredelete")+ datalen,
                // action: () => "Action"
                positiveText: t("common.sure"),
                negativeText: t("common.cancel"),
                maskClosable: false,
                onMaskClick: () => {
                  message.success( t("common.checktips"))
                },
                onPositiveClick: () => {
                  // d.loading = true;
                  service.delete('/dashboard/version/'+rowData.id).then(res=>{
                    message.success(t("common.deletesuc"));
                    location.reload() ; 
                  }).catch(e=>{
                    // console.log("essrormessage",e.response.data);
                    // alert(e.response.data);
                    message.error(t("common.deleteerr"));
                  });
                }
              });
            });
           // this.reload();
          // }else{
          //   message.error( t("version.versionnode.nodelete"), { duration: 5000 })
          // }
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
      }
    };
  },
  watch: {

  },
  mounted() {
    // this.getgroup();
  },
  computed: {

  },
  methods: {
    createmachine(){
      this.$router.push({
        path: '/version/version/create',
      });
    },
    // getgroup(){
    //   service.get('/user/current').then(res=>{
    //     let group1 = res.data.data.groups;
    //     // console.log("!!!!!!!!!!!!!!!this.group",group1);
    //     // 如果用户是版本管理组的，那就标志着可以使用，true
    //     for(let i=0;i<group1.length;i++){
    //       if(group1[i]=='versionManager'){
    //         // this.flag = true;
    //         break;
    //       }
    //       // console.log("!!!!!!!!group",group1[i],this.flag);
    //     }
    //   }).catch(e=>{
    //     // console.log("essrormessage",e.response.data);
    //     // alert(e.response.data);
    //     group1 = t("common.geterr");
    //   });
    //   // return group;
    // }
  }
}
</script>
<style scoped>
:deep .n-data-table__pagination{
  padding-right:15px;
}
</style>
