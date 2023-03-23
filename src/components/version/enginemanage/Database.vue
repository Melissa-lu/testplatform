<template>
  <!-- <n-p> 你选中了 {{ checkedRowKeys.length }} 行。 </n-p> -->
  <!-- {{pagination.pageCount}} -->
  
  <n-space vertical :size="12">
  
    <n-button strong secondary round type="success" @click="create" style="height: 38px;margin: 10px;margin-left:15px">
         <template #icon>
            <n-icon><AddCircleOutline /></n-icon>
          </template>
      {{$t("common.add")}}
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
import { h, defineComponent, ref,reactive,onMounted  } from "vue";
import { RouterLink,useRouter,  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useDialog,NTooltip,useMessage  } from "naive-ui";
import service from '../../../requests/axios';
import { LogInOutline as LogInIcon,AddCircleOutline } from "@vicons/ionicons5";
import { EditNoteRound,DeleteOutlined } from "@vicons/material"

function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}
export default {
  name: "Database",
  data() {
    return {
      result:{},
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
      editdatabase,deletedatabase
    }) => {
      return [
        // {
        //   type: "selection",
        // },
        {
          title: t("version.enginemanage.sqlcname"),
          key: "cname",
        },
        {
          title: t("version.enginemanage.sqlip"),
          key: "ip",
        },
        {
          title: t("version.enginemanage.sqlport"),
          key: "port"
        },
        {
          title: t("version.enginemanage.osname"),
          key: "username",
        },
        {
          title: t("version.enginemanage.sqlname"),
          key: "sqlname",
        },
        {
          title: t("version.enginemanage.sqltype"),
          key: "sqltype",
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
                        onClick: () => editdatabase(row)
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
                        onClick: () => deletedatabase(row)
                      },
                      renderIcon2(DeleteOutlined)
                    ),
                  default: () =>  t("common.delete")
                }
              )
          },
        },
        {
          title: "id",
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
        service.get('/loadtest/connections').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            // 解析url
            // let reg= new RegExp('(.*?)@(.*?)','g');
            let reg= /(.*?):(.*?):(.*?)@tcp\((.*?):(.*?)\)\/(.*?)$/g;
            let tomatch = reg.exec(data1[i].connection);
            // console.log("tomatch",i,tomatch,data1[i].connection);
            // console.log("tomatch",i,"mysql:root:12345678@tcp(127.0.0.1:3306)/test".match(/*@>/g));
            // 形成新的显示json
            let rowjson ={
              key: data1[i].id,//后面要改成真的id
              cname: data1[i].name,
              sqlname: tomatch[6],
              ip:tomatch[4],
              port: tomatch[5],
              username:tomatch[2],
              // ospasswd:tomatch[3],
              sqltype:tomatch[1],
              id:data1[i].id,
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
          setTimeout(
            () =>
              resolve({
                pageCount,
                data: datalist,//文档错误，文档为 pagedData
                total
              }),
            200
          )
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
        editdatabase(rowData) {
          console.log("555 send mail to " + rowData.id);
          router.push({
            path: '/version/engine/database/edit/' + rowData.id,//test.id需要改成project的name
            // path: '/perfor/script/create/',
          });
        },
        deletedatabase(rowData) {
          console.log("666 send mail to " + rowData.id);
          service.delete('/loadtest/connections/'+rowData.id).then(res=>{
            message.success(t("common.deletesuc"));
            location.reload() ; 
          }).catch(e=>{
            // console.log("essrormessage",e.response.data);
            // alert(e.response.data);
            message.error(t("common.deleteerr"));
          });
          // // this.reload();
          
        },
      }),
      // 可调的
      pagination: paginationReactive,
      checkedRowKeys: checkedRowKeysRef,
      rowKey (row) {
        return row.id
      },
      rowKey: (row) => row.name,
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
  },
  computed: {

  },
  methods: {
    create(){
      this.$router.push({
        path: '/version/engine/database/create',
      });
    }
  }
}
</script>
<style scoped>
:deep .n-data-table__pagination{
  padding-right:15px;
}
</style>
