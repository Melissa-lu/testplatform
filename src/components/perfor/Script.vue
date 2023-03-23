<template>
  <!-- <n-p> 你选中了 {{ checkedRowKeys.length }} 行。 </n-p> -->
  <!-- {{pagination.pageCount}} -->
  <n-space vertical :size="12">
    <n-button strong secondary round type="tertiary" style="height: 38px;margin: 10px 0 5px;" @click="createscript">
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
      :scroll-x="1600"
      @update:page="handlePageChange"
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
import { LogInOutline as LogInIcon,AddCircleOutline } from "@vicons/ionicons5";
import { EditNoteRound,DeleteOutlined,AutoAwesomeMosaicOutlined,ContentCopyRound} from "@vicons/material"
import service from '../../requests/axios';

function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}

export default {
  name: "Script",
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
  },
  setup() {
    const { t } = useI18n();
    var datalist = [];
    const router = useRouter();
    const dialog = useDialog();
    const message = useMessage();
    const createColumns = ({
      datailsScript,editScript,copyScript,deleteScript
    }) => {
      return [
        
        {
          title: t("perfor.script.name"),
          key: "name",
          width: 200,
          fixed: "left"
        },
        // {
        //   title: t("perfor.script.uploader"),
        //   key: "uploader",
        //   //  width: 150,
        // },
        {
          title: t("perfor.script.scenario"),
          key: "scenario",
          //  width: 150,
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
            const workid = row.workid.map((workid) => {
              return h(NTag, {
                style: {
                  marginRight: "6px",
                  textalign:"center",
                },
                type: "success",
                bordered: false
              }, {
                default: () => workid
              });
            });
            return workid;
          }
        },
        {
          title: t("perfor.script.assets"),
          key: "assets",
          // width: 250,
          render(row) {
            const assets = row.assets.map((assetsKey) => {
              return h(NTag, {
                style: {
                  marginRight: "6px",
                  textalign:"center",
                  display:"inline-flex",
                },
                type: "info",
                bordered: false
              }, {
                default: () => assetsKey
              });
            });
            return assets;
          }
        },
        {
          title: t("common.updated"),
          key: "updated",
          // width: 200,
        },
        {
          title:t("common.action"),
          key: "datails",
          // titleColSpan: 3,//合并 3列表头
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
                        width: "38px",padding: 0,
                      },
                      onClick: () => datailsScript(row)
                    },
                    renderIcon2(AutoAwesomeMosaicOutlined)
                  ),
                default: () =>  t("perfor.script.details")
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
                        onClick: () => editScript(row)
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
                        onClick: () => copyScript(row)
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
                        onClick: () => deleteScript(row)
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
    const dataRef = ref([]);
    const loadingRef = ref(true);
    // const columnsRef = ref(columns)
    // 初始、切换数据加载
    function query (page, pageSize) {
      return new Promise((resolve) => {
        datalist = [] ;//清空再赋值，不然每次查询会累加   
        service.get('/loadtest/scripts').then(res=>{
          let data1 = res.data.data;
          for(let i=0;i<data1.length;i++){
            let changjinglist = data1[i].scenario??[];
            let changjing = '';
            // console.log("00",changjinglist);
            for(let j=0;j<changjinglist.length;j++){
              if(j!=0)
                changjing=changjing+" - "+changjinglist[j];
              else
                changjing=changjing+changjinglist[j];
            }
            // 形成新的显示json
            let rowjson ={
              id: data1[i].id,//后面要改成真的id
              name: data1[i].name,
              // uploader: data1[i].uploader,
              scenario: changjing,
              updated: data1[i].updated_at,
              assets:data1[i].assets??[],
              workid:data1[i].work_ids??[],
              // scripturl:data1[i].data1[i].url,
              tags:data1[i].tags??[],
              //没有显示的
              comment:data1[i].comment,
              path:data1[i].path,
              created:data1[i].created_at,
            }
            datalist.push(rowjson);
            // console.log("11",rowjson,data1[i].tags)
          }
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
        datailsScript(rowData) {
          console.log("send mail to " + rowData.name);
          dialog.info({
            // title: "脚本备注",
            title:t("perfor.script.comment"),
            content: () => rowData.comment,
            // action: () => "Action"
          });
        },
        editScript(rowData) {
          // console.log("555 send mail to " + rowData.id);
          router.push({
            path: '/perfor/script/edit/' + rowData.id,//test.id需要改成project的name
          });
        },
        copyScript(rowData) {
          service.get('/loadtest/scripts/'+rowData.id+'/copy').then(res=>{
            if(res.data.code==0)
              message.success(t("common.copysuc")); 
            else
              message.error(t("common.copyerr")); 
            query(
              paginationReactive.page,
              paginationReactive.pageSize,
            ).then((data) => {
              dataRef.value = data.data
              paginationReactive.pageCount = data.pageCount
              paginationReactive.itemCount = data.total
              loadingRef.value = false;
            })          
          }).catch(e=>{
            // console.log("essrormessage",e.response.data);
            // alert(e.response.data);
            message.error(t("common.copyerr"));
            query(
              paginationReactive.page,
              paginationReactive.pageSize,
            ).then((data) => {
              dataRef.value = data.data
              paginationReactive.pageCount = data.pageCount
              paginationReactive.itemCount = data.total
              loadingRef.value = false;
            })  
          });

        },
        deleteScript(rowData) {
          // console.log("666 send mail to " + rowData.id);
          dialog.error({
            // title: "脚本备注",
            title:t("common.delete"),
            content: () => t("version.iterate.ifsuredelete"),
            positiveText: t("common.sure"),
            negativeText: t("common.cancel"),
            maskClosable: false,
            onMaskClick: () => {
              message.success( t("common.checktips"))
            },
            onPositiveClick: () => {
              // d.loading = true;
              service.delete('/loadtest/scripts/'+rowData.id).then(res=>{
                message.success(t("common.deletesuc"));
                query(
                  paginationReactive.page,
                  paginationReactive.pageSize,
                ).then((data) => {
                  dataRef.value = data.data
                  paginationReactive.pageCount = data.pageCount
                  paginationReactive.itemCount = data.total
                  loadingRef.value = false
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
                  loadingRef.value = false
                })
              });
            }
          });
        },
      }),
      // 可调的
      pagination: paginationReactive,
      // checkedRowKeys: checkedRowKeysRef,
      rowKey (row) {
        return row.id
      },
      rowKey: (row) => row.id,
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
      },
      createscript(){
        // console.log("到站了111")
        router.push({
          path: '/perfor/script/create',
        });
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
   
  }
}
</script>
<style scoped>
:deep .n-data-table .n-data-table-td,:deep .n-data-table .n-data-table-th{
  text-align: center !important;
}
</style>
