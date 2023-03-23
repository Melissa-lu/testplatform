<template>
  <!-- <n-p> 你选中了 {{ checkedRowKeys.length }} 行。 </n-p> -->
  <!-- {{pagination.pageCount}} -->
  
  <n-space vertical :size="12">
  
    <n-button strong secondary round type="success" @click="createmachine" style="height: 38px;margin: 10px;margin-left:15px">
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
import { AddCircleOutline, } from "@vicons/ionicons5";
import { EditNoteRound,DeleteOutlined } from "@vicons/material"

function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}
export default {
  name: "Server",
  data() {
    return {
      result:{},
      // datalist:[],
    };
  },
  props: {
  },
  components: {
    AddCircleOutline
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
      editTomcat,deleteTomcat
    }) => {
      return [
        // {
        //   type: "selection",
        // },
        {
          title: t("version.enginemanage.servername"),
          key: "name",
        },
        {
          title: t("version.enginemanage.serverip"),
          key: "ip",
        },
        {
          title: t("version.enginemanage.serverport"),
          key: "port"
        },
        {
          title: t("version.enginemanage.osname"),
          key: "username",
        },
        {
          title: t("version.enginemanage.manger"),
          key: "manager",
        },
        {
          title: t("version.enginemanage.serverthreads"),
          key: "threads",
        },
        {
          title: t("version.enginemanage.servertype"),
          key: "type",
          // width:100,
          render(row) {
            if(row.type!=null){
              const type1 = row.type.map((tagKey) => {
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
              return type1;
            }
          }
        },
        {
          title: t("common.updated"),
          key: "updated_at",
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
                        onClick: () => deleteTomcat(row)
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
        service.get('/loadtest/machines').then(res=>{
          let data1 = res.data.data;
          datalist = data1;
          // console.log("datalist: ",datalist);
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
        editTomcat(rowData) {
          // console.log("555 send mail to " + rowData.id);
          router.push({
            path: '/version/engine/server/edit/' + rowData.id,//test.id需要改成project的name
            // path: '/perfor/script/create/',
          });
        },
        deleteTomcat(rowData) {
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
              service.delete('/loadtest/machines/'+rowData.id).then(res=>{
                message.success(t("common.deletesuc"));
                location.reload() ; 
              }).catch(e=>{
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
    createmachine(){
      this.$router.push({
        path: '/version/engine/server/create',
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
