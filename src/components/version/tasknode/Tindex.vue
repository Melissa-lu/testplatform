<template>
  <n-space vertical :size="12" style="max-width: 190%;width: 190%;margin-left: -80px;margin-bottom: 10px">
    <!-- 我自己的 -->
     <!-- <n-card  hoverable :title="$t('version.nodewatch.personal')" style="min-height:400px" >
      <div style="float: left;height: 34px;line-height: 34px;padding-right: 20px;padding-left: 10px;color: gray;">
        {{$t("version.nodewatch.version")}}
      </div>
      <n-select v-model:value="selectedversion"  :options="versionoptions" @update:value="minorversionchange" style="width:30%;margin-bottom: 15px;float: left;" clearable />
      <n-button tertiary round type="warning" style="height: 34px;float: left;margin-left: 40px;" @click="yvjing">
          <template #icon>
              <n-icon><warning /></n-icon>
            </template>
      {{$t("version.nodewatch.warning")}}
      </n-button>

      <n-button tertiary round type="error" style="height: 34px;float: left;margin-left: 30px;" @click="delay">
          <template #icon>
              <n-icon><MdCloseCircleOutline /></n-icon>
            </template>
      {{$t("version.nodewatch.delay")}}
      </n-button>

      <n-button tertiary  round  style="height: 34px;float: left;margin-left: 30px;" @click="nomal">
          <template #icon>
              <n-icon><IosList /></n-icon>
            </template>
      {{$t("version.nodewatch.all")}}
      </n-button>
      <div style="color: #888a8c8c;margin-left: 20px;float: left;height: 34px;line-height: 34px;">{{$t("version.nodewatch.flitertips")}}</div>

      <n-button tertiary round  style="height: 34px;float: right;margin-right: 50px;" @click="clearselect">
          <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
      {{$t("version.nodewatch.selecttip")}}
      </n-button> 
       <div style="float: left;height: 34px;line-height: 34px;margin-left: 50px;padding-left: 10px;color: gray;">
        {{$t("version.nodewatch.selecttip")}}
      </div> 

      <n-data-table
        size="small"  striped 
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
      <div v-show="ifshowloading" style="background-color: #fdfdfd;color: #fdfdfd;width: 97%;height: 55%;position: absolute;top: 157px;z-index: 999;">11
        <n-spin  size="large" style="position: absolute;left: 47%;top: 60px;" />
      </div>
    </n-card> -->
    <!-- 与我有关的 :title="$t('version.nodewatch.aboutme')" -->
    <n-card  hoverable  style="height:720px;margin-top: 20px;;" >
      <!-- 视角选择 -->
      <div style="float: left;height: 34px;line-height: 34px;padding-right: 20px;padding-left: 10px;color: gray;">
        {{$t("version.nodewatch.rolelist")}}
      </div>
      <n-select v-model:value="selecteduser" multiple :options="useroptions" @update:value="rolechange2" style="min-width:15%;max-width:25%;margin-bottom: 15px;float: left;" clearable />
      <!-- 版本选择 -->
      <div style="float: left;height: 34px;line-height: 34px;padding-right: 20px;padding-left: 10px;color: gray;">
        {{$t("version.nodewatch.version")}}
      </div>
      <n-select v-model:value="selectedversion2"  :options="versionoptions" @update:value="minorversionchange2" style="width:10%;margin-bottom: 15px;float: left;" clearable />
      <!-- 状态选择 -->
      <div style="float: left;height: 34px;line-height: 34px;padding-right: 20px;padding-left: 10px;color: gray;">
        {{$t("version.nodewatch.typelist")}}
      </div>
      <n-select v-model:value="selectedtype2" :render-label="rendertypeLabel" :options="typeoptions" @update:value="typechange2" style="width:10%;margin-bottom: 15px;float: left;" clearable />
      <!-- <n-button tertiary  round type="warning" style="height: 34px;float: left;margin-left: 40px;" @click="yvjing2">
          <template #icon>
              <n-icon><Warning /></n-icon>
            </template>
      {{$t("version.nodewatch.warning")}}
      </n-button>

      <n-button tertiary  round type="error" style="height: 34px;float: left;margin-left: 30px;" @click="delay2">
          <template #icon>
              <n-icon><MdCloseCircleOutline /></n-icon>
            </template>
      {{$t("version.nodewatch.delay")}}
      </n-button>
      
      <n-button tertiary  round  style="height: 34px;float: left;margin-left: 30px;" @click="nomal2">
          <template #icon>
              <n-icon><IosList /></n-icon>
            </template>
      {{$t("version.nodewatch.all")}}
      </n-button> -->
      <!-- 重置选择 -->
      <div style="color: #888a8c8c;margin-left: 20px;float: left;height: 34px;line-height: 34px;">{{$t("version.nodewatch.flitertips")}}</div>
      <n-button tertiary round  style="height: 34px;float: right;margin-right: 50px;" @click="clearselect2">
          <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
      {{$t("version.nodewatch.selecttip")}}
      </n-button>
      
      <!-- <div style="float: left;height: 34px;line-height: 34px;margin-left: 50px;padding-left: 10px;color: gray;">
        {{$t("version.nodewatch.selecttip")}}
      </div> -->

    <n-data-table
      size="small"  striped 
      ref="table"
      :bordered="false"
      :columns="columns"
      :data="data2"
      :row-key="rowKey"
      :pagination="pagination2"
      :loading="loading"
      :scroll-x="1600"
      @update:page="handlePageChange2"
      @update:filters="handleUpdateFilter"
    />
    <!-- ifshowloading2 -->
      <div v-show="ifshowloading2" style="background-color: #fdfdfd;color: #fdfdfd;width: 97%;height: 550px;position: absolute;top: 110px;z-index: 999;">11
      <!-- <div v-show="true"  style="background-color: #fdfdfd;color: #fdfdfd;width: 100%;height: 100%;position: absolute;top: 136px;">11 -->
        <n-spin  size="large" style="position: absolute;left: 47%;top: 60px;" />
      </div>
    </n-card>

    <!-- 评论 -->
    <n-modal v-model:show="showModal" :title="$t('common.comment')" preset="dialog" :mask-closable="false" style="width: 50%;margin-top:0px;margin-bottom:50px;">
      <div
        v-for="(item, index) in commentlist"
        :key="index"    
        style="margin-left:15px;borderLeft: 1px dashed #aeaeae;padding: 10px 20px 4px;height: auto"
      >
        <div style="width:10px;height:10px;borderRadius:10px;border:2px solid #18a058 ;
          backgroundColor:#fff;position: absolute;left: 8px;"> </div>                     
        <div style="color: #18a058;fontSize: 16px">
          {{item.user}} - {{item.stage}}
        </div>
        <n-input v-model:value="item.comment" :disabled="!item.ifshowbt" type="textarea" size="tiny"  autosize="minRows: 1" style="margin: 8px 0;" />
        <div style="color: #aeaeae;float:left;font-size:12px;">
          {{$t("common.createdat")}}{{item.created_at}}
        </div>
        <!-- float:right; -->
        <div style="color: #aeaeae;font-size:12px;margin-left: 50%;">
          {{$t("common.updatedat")}}{{item.updated_at}}
        </div>
        <n-button quaternary type="error" v-show="item.ifshowbt" size="tiny"  style="height: 20px;top: -20px;float: right" @click="deletecomment(index,item)">
          {{$t("common.delete")}}
        </n-button>
        <n-button quaternary type="warning" v-show="item.ifshowbt" size="tiny"  style="height: 20px;top: -20px;float: right" @click="editcomment(index,item)">
          {{$t("common.update")}}
        </n-button>
        
        <!--  -->
      </div>
      <div>
        <h4>{{$t('common.comment')}}</h4>
        <!-- @update:value="minorversionchange"  -->
        <n-select v-model:value="nowstage"  :options="stageoptions" size="small"
          style="width:30%;margin-bottom: 15px;float: left;" clearable />
        <n-input v-model:value="tocomment" type="textarea" size="tiny"  style="margin: 0 0 20px 0; width: calc( 100% - 40px );" />
        <n-button strong secondary round type="success" style="float: right;margin-right: 25px;" @click="edittocomment(rowData)">
          {{$t("common.comment")}}
        </n-button>
      </div>
    </n-modal>
    <!-- 详情 -->
    <n-modal v-model:show="showModal2"  :title="$t('common.details')" preset="dialog" :mask-closable="false" style="width: 80%;margin-top:50px;margin-bottom:50px;padding: 30px;">
      <div  style="font-size: 18px;">
        <div :v-model="detailobj" class="details" >
          {{detailobj.work_id+"  "+detailobj.title}}
          <!-- {{commentlist[0].created_at}} -->
          <!-- 1111{{ JSON.stringify(detailobj, null, 2) }}2222 -->
        </div>
        <div :v-model="detailobj" :class="detailobj.finished!=2?'successf':'errf'" class="finished " >
          {{(detailobj.finished==0||detailobj.finished==3)?"进行中":detailobj.finished==1?"完成":"终止"}}
        </div>
        <div class="tohref" >
          <n-button strong secondary round type="success" @click="tohref(detailobj)" >
            <template #icon>
              <n-icon><EditNoteRound /></n-icon>
            </template>
          </n-button>
          
        </div>
      </div>
      <!-- 基本信息 -->
      <h3 style="color: #333333;clear: both;">{{$t('version.nodewatch.details.basic')}}</h3> 
      <div>
        <n-descriptions label-placement="top"  size="medium" :column="6" bordered :id="basictable">
          <template v-for="(item, index) in detailobj.imported_fields" :key="index">
            <n-descriptions-item :label="item.name" :span="1">
              {{item.value}}
            </n-descriptions-item>
          </template>
        </n-descriptions>
      </div>
      <!-- 任务计划 -->
      <h3 style="color: #333333;">{{$t('version.nodewatch.details.plan')}}</h3> 
      <div>
        <n-data-table
          size="medium"  striped  
          ref="table"
          :bordered="true"
          :columns="detailscolumns"
          :data="detailobj.stages"
          :row-key="rowKey"
          :loading="loading"
          @update:checked-row-keys="handleCheck"
          style=""
        />
      </div>
    </n-modal>
  </n-space>

</template>
<script>
// import axios from 'axios';
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRouter  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useDialog,useLoadingBar ,NDialogProvider,useMessage,NInput,NTooltip } from "naive-ui";
import { inject } from 'vue'
import { LogInOutline as LogInIcon,Warning,Refresh,NewspaperOutline } from "@vicons/ionicons5";
import { MdCloseCircleOutline,IosList } from "@vicons/ionicons4";
import { NotStartedOutlined,RestartAltRound ,EditNoteRound,DeleteOutlined,AutoAwesomeMosaicOutlined} from "@vicons/material"
import service from '../../../requests/axios';
import apartFliter from '../../../assets/data/apartFliter.json'
import { pxfy } from 'seemly';
function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}
export default {
  name: "Tindex",
  data() {
    return {
      result:{},
    };
  },
  props: {
  },
  components: {
    LogInIcon,Warning,MdCloseCircleOutline,Refresh,IosList,EditNoteRound
  },
  watch: {

  },
  created() {
  },
  setup() {
    const { t } = useI18n();
    const loadingBar = useLoadingBar();
    var datalist2 = [];
    var datalist2all = [];
    var datalist2fliter = [];
    var datalist2plus = [];
    var commentlist = [] ;
    // var detailobj = {} ;
    // const detailsobjstagesRef = ref([]);
    const router = useRouter();
    const dialog = useDialog();
    const message = useMessage();
    const showModalRef = ref(false);
    const showModal2Ref = ref(false);
    const stageoptionsRef = ref([]);
    const jira_components = {
      title: t("function.apart"),
      key: "jira_components",
      width: 100,
      filter: true,
      filterOptionValues: [],
      filterOptions: apartFliter.value,
      render(row) {
        if(row.jira_components!=null){
          const jira_components = row.jira_components.map((tagKey) => {
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
          return jira_components;
        }
      }
    };
    const jira_componentsReactive = reactive(jira_components);
    const createColumns = ({
    //  commentItem,
     commentdetailsItem,detailsItem
    }) => {
      return [
        {
          title: t("version.nodewatch.type"),
          key: "status",
          fixed: "left",
          width: 70,
          render(row) {
            if(row.status == 1){
              return h(NTag, {
                style: {
                  // marginRight: "6px",
                  textalign:"center",
                },
                type: "warning",
                bordered: false
              }, {
                default: () => "预警"
              });
            }else if(row.status == 3){
              return h(NTag, {
                style: {
                  // marginRight: "6px",
                  textalign:"center",
                },
                // type: "warning",
                bordered: false
              }, {
                default: () => "正常"
              });
            }else{
               return h(NTag, {
                style: {
                  // marginRight: "6px",
                  textalign:"center",
                },
                type: "error",
                bordered: false
              }, {
                default: () => "超期"
              });
            }
          }
        },
        {
          title: t("version.nodewatch.reportkey"),
          key: "id",
          width: 120,
          // fixed: "left",
          ellipsis: true,
          render(row) {
            return h(NButton, {
              size: "small",
              tag:"a",
              style:"width: 120px;",
              text:true,
              href:'https://work.fineres.com/browse/'+row.id,
              target:"_blank",
              // onClick: () => checkbugdetail(row)
            }, 
            { default: () => row.id });
          },
        },
        jira_components,
        {
          title: t("version.nodewatch.reportname"),
          key: "name",
          width: 350,
          // fixed: "left"
        }, 
        {
          type: "expand",
          expandable: (rowData) => rowData.name !== "Jim Green",
          // 这边最后替换实际组合出来的一个负责任人数组
          renderExpand: (rowData) => {
            const all_notify_users = rowData.all_notify_users.map((user) => {
              return h(NTag, {
                style: {
                  marginRight: "8px",
                  textalign:"center",
                  display:"inline-flex",
                  // display:"grid"
                },
                type: "info",
                bordered: false
              }, {
                default: () => user
              });
            });
            console.log( "all_notify_users",rowData.all_notify_users);
            return all_notify_users;
            // return `${rowData.name} is a good guy.`;
          }
        },
        {
          title: t("version.nodewatch.reportstatus"),
          key: "current_stage",
          // fixed: "right",
          width:100,
        },
        {
          title: t("version.versionnode.minorversion"),
          key: "minor_version",
          width:100,
        },
        {
          title: t("version.nodewatch.reportstatusddl"),
          key: "end_time",
          width: 150,
        },
        {
          title: t("version.nodewatch.nextpeople"),
          key: "current_notify_users",
           width: 200,
          render(row) {
            if(row.current_notify_users!=null){
              const current_notify_users = row.current_notify_users.map((tagKey) => {
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
            }
          }
        },
        {
          title: t("common.action"),
          key: "comment",
          fixed: "right",
          width: 60,
          render(row) {
            return h(NTooltip,{
                trigger:"hover",
                placement: 'bottom',
              }, {
                trigger: () =>
                  h( NButton, {
                      style:{
                        width: "38px",padding: 0,margin: "0 0 0 0px"
                      },
                      onClick: () => commentdetailsItem(row)
                    },
                    renderIcon2(EditNoteRound)
                  ),
                default: () =>  t("common.comment")
              }
            )
          },
        },
        {
          title: "",
          key: "details",
          fixed: "right",
          width: 70,
          render(row) {
            return h(NTooltip,{
                trigger:"hover",
                placement: 'bottom',
              }, {
                trigger: () =>
                  h( NButton, {
                      style:{
                        width: "38px",padding: 0,margin: "0 0 0 0px"
                      },
                      onClick: () => detailsItem(row)
                    },
                    renderIcon2(NewspaperOutline)
                  ),
                default: () =>  t("common.details")
              }
            )
          },
        },
        {
          title: t("perfor.script.scriptid"),
          key: "iter_id",
          width: 1,
          ellipsis: true
        },
      ];
    };
    const createdetailsColumns = ({}) => {
      return [
        {
          title: t("version.nodewatch.details.stagename"),
          key: "stage_name",
          fixed: "left",
          width: 80,
        },
        {
          title: t("version.nodewatch.details.finished"),
          key: "status",
          width: 120,
          fixed: "left",
          render(row) {
            if(row.status == 3){
              return h(NTag, {
                style: {
                  // marginRight: "6px",
                  textalign:"center",
                },
                type: "success",
                bordered: false
              }, {
                default: () => "正常"
              });
            }else if(row.status == 1){
              return h(NTag, {
                style: {
                  // marginRight: "6px",
                  textalign:"center",
                },
                type: "warning",
                bordered: false
              }, {
                default: () => "预警 "
              });
            }else if(row.status == 2){
               return h(NTag, {
                style: {
                  // marginRight: "6px",
                  textalign:"center",
                },
                type: "error",
                bordered: false
              }, {
                default: () => "超期"
              });
            }else if(row.status == 4){
               return h(NTag, {
                style: {
                  // marginRight: "6px",
                  textalign:"center",
                },
                bordered: false
              }, {
                default: () => "未至"
              });
            }
          }
        },
        {
          title: t("version.nodewatch.details.notify_users"),
          key: "notify_users",
          width: 250,
          fixed: "left",
          render(row) {
            const notify_users = row.notify_users.map((tagKey) => {
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
            return notify_users;
          }
        }, 
        {
          title: t("version.nodewatch.details.overtime_day"),
          key: "overtime_day",
          // fixed: "right",
          width:100,
        },
        {
          title: t("version.nodewatch.details.end_date"),
          key: "end_date",
          width: 150,
        },
        {
          title: t("version.nodewatch.details.comment"),
          key: "comment",
          width: 300,
          render(row) {
            // console.log("row.comment",row,row.comment);
            if(row.comment!=undefined){
              const comment = row.comment.map((item) => {
                return h(NTag, {
                  style: {
                    // margin: "0 3px !important",
                    marginRight: "2px",
                    textalign:"center",
                    display: "flex",
                    height:"32px",
                  },
                  color:{ color: '#fff', textColor: '#555' },
                  // type: "success",
                  bordered: false
                }, {
                  default: () => "@"+item.user+" : "+item.comment
                });
              });
              return comment;
            }
            
          }
        },
        {
          title: t("perfor.script.scriptid"),
          key: "work_id",
          width: 1,
          ellipsis: true
        },
      ];
    };
    const paginationReactive2 = reactive({
      page: 1,
      pageSize: parseInt(process.env.VUE_APP_PAGE_SIZE_NOMAL2),
      pageCount: 1,
      showSizePicker: true,
      prefix ({ itemCount }) {
        return `一共有 ${itemCount}个`
      },
      pageSizes:[parseInt(process.env.VUE_APP_PAGE_SIZE_NOMAL1),parseInt(process.env.VUE_APP_PAGE_SIZE_NOMAL2),parseInt(process.env.VUE_APP_PAGE_SIZE_NOMAL3)],//分页选项
      onChange: (page) => {
        paginationReactive2.page = page;
      },
      onUpdatePageSize: (pageSize) => {
        paginationReactive2.pageSize = pageSize;
        paginationReactive2.page = 1;
      }
    });
    // 可调每页展示的over
    // 右键菜单
    // 右键菜单over
    const dataRef = ref([]);
    const data2Ref = ref([]);
    const selectedversionRef=ref("");
    const selectedversion2Ref=ref("");
    const selecteduserRef = ref([]);
    const selectedtype2Ref=ref("");
    const selectstageRef = ref("");
    const versionoptionsRef= ref([]);
    const useroptionsRef =ref([]);
    const loadingRef = ref(true);
    const ifshowloadingRef = ref(false);
    const ifshowloading2Ref = ref(false);
    const inputvalueRef = ref(null);
    const commentlistRef = ref([]);
    const detailobjRef = ref({});
    const tocommentRef = ref('');
    const tocommentidRef =ref('');
    const nowstageRef = ref('');
    // 初始、切换数据加载
    function query2 (){//page, pageSize) {//selectedversion ="",tiptype ="") {
      return new Promise((resolve) => {
        //清空再赋值，不然每次查询会累加   
        datalist2 = [] ;
        // datalist2plus = [];
        console.log("selecteduserRef.value",selecteduserRef.value,typeof(selecteduserRef.value))
        if(selecteduserRef.value!=""){//其他角色视角
          let selectlist = [];
          for(let i=0;i<selecteduserRef.value.length;i++){
            selectlist.push(selecteduserRef.value[i]);
          }
          service.get('/dashboard/notify?notify_type=1&user_view='+encodeURIComponent(JSON.stringify(selectlist))).then(res=>{
            // console.log("33333333333333333333333",res.data,res)
            if(res.data.code != 0){
              //错误处理
              // reject({ status: 500, msg: 'error' })
            }else{
              let data1 = res.data.data;
              if(data1!=null){
                for(let i=0;i<data1.length;i++){
                  let all_notify_userslist = [];
                  let allusers = data1[i].all_notify_users
                  for(let j=0;j< allusers.length;j++){
                    let onelist = "";
                    let onename = "";
                    for (let x in allusers[j]) {
                      onelist = onelist +allusers[j][x];
                      onename = x; 
                    }
                    all_notify_userslist.push(onename+":"+onelist);
                  }
                  let rowjson ={
                    id: data1[i].work_id,
                    name: data1[i].title,
                    // notify_type:2,
                    current_notify_users:data1[i].current_notify_users,
                    jira_components:data1[i].jira_components,
                    all_notify_users:all_notify_userslist,
                    status:data1[i].status,
                    current_stage:data1[i].current_stage,
                    stage:data1[i].stage,
                    end_time:data1[i].end_time,
                    minor_version:data1[i].minor_version,
                    iter_id:data1[i].iter_id
                  }
                  datalist2.push(rowjson);
                }
              }
              resolve({
                // pageCount,
                data: datalist2//plus,//文档错误，文档为 pagedData
                // total,
              })
            }
          }).catch((err) =>{
            console.log("errrrrr",err);
            ifshowloading2Ref.value = false;
            if(err.response.status == 500)
              message.error( t("common.loaderr"), { duration: 5000 })
          });
        }else{
          service.get('/dashboard/notify?notify_type=1').then(res=>{
            // console.log("33333333333333333333333",res.data,res)
            if(res.data.code != 0){
              //错误处理
              // reject({ status: 500, msg: 'error' })
            }else{
              let data1 = res.data.data;
              if(data1!=null){
                for(let i=0;i<data1.length;i++){
                  let all_notify_userslist = [];
                  let allusers = data1[i].all_notify_users
                  for(let j=0;j< allusers.length;j++){
                    let onelist = "";
                    let onename = "";
                    for (let x in allusers[j]) {
                      onelist = onelist +allusers[j][x];
                      onename = x; 
                    }
                    all_notify_userslist.push(onename+":"+onelist);
                  }
                  let rowjson ={
                    id: data1[i].work_id,
                    name: data1[i].title,
                    // notify_type:2,
                    current_notify_users:data1[i].current_notify_users,
                    jira_components:data1[i].jira_components,
                    all_notify_users:all_notify_userslist,
                    status:data1[i].status,
                    current_stage:data1[i].current_stage,
                    stage:data1[i].stage,
                    end_time:data1[i].end_time,
                    minor_version:data1[i].minor_version,
                    iter_id:data1[i].iter_id
                  }
                  datalist2.push(rowjson);
                }
              }
              resolve({
                // pageCount,
                data: datalist2//plus,//文档错误，文档为 pagedData
                // total,
              })
            }
          }).catch((err) =>{
            console.log("errrrrr",err);
            ifshowloading2Ref.value = false;
            if(err.response.status == 500)
              message.error( t("common.loaderr"), { duration: 5000 })
          });
        }
        // // console.log("aaaaaaaaaaaaaaaaaaaaaaaaa",selectedversion)
        // service.get('/dashboard/notify?notify_type=1').then(res=>{
        //   // console.log("33333333333333333333333",res.data,res)
        //   if(res.data.code != 0){
        //     //错误处理
        //     // reject({ status: 500, msg: 'error' })
        //   }else{
        //     let data1 = res.data.data;
        //     if(data1!=null){
        //       for(let i=0;i<data1.length;i++){
        //         let all_notify_userslist = [];
        //         let allusers = data1[i].all_notify_users
        //         for(let j=0;j< allusers.length;j++){
        //           let onelist = "";
        //           let onename = "";
        //           for (let x in allusers[j]) {
        //             onelist = onelist +allusers[j][x];
        //             onename = x; 
        //           }
        //           all_notify_userslist.push(onename+":"+onelist);
        //         }
        //         let rowjson ={
        //           id: data1[i].work_id,
        //           name: data1[i].title,
        //           // notify_type:2,
        //           current_notify_users:data1[i].current_notify_users,
        //           all_notify_users:all_notify_userslist,
        //           status:data1[i].status,
        //           current_stage:data1[i].current_stage,
        //           stage:data1[i].stage,
        //           end_time:data1[i].end_time,
        //           minor_version:data1[i].minor_version,
        //           iter_id:data1[i].iter_id
        //         }
        //         datalist2.push(rowjson);
        //       }
        //     }
        //     resolve({
        //       // pageCount,
        //       data: datalist2//plus,//文档错误，文档为 pagedData
        //       // total,
        //     })
        //   }
        // }).catch((err) =>{
        //   console.log("errrrrr",err);
        //   ifshowloading2Ref.value = false;
        //   if(err.response.status == 500)
        //     message.error( t("common.loaderr"), { duration: 5000 })
        // });
        
      })
    };
    function queryversion () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var versionoptions = [];
        // 获取用户列表
        service.get('/dashboard/version/minor').then(res=>{
          let data1 = res.data.data;//版本数组
          for(let i=0;i<data1.length;i++){
            versionoptions.push({label:data1[i].minor_version,value:data1[i].minor_version});
          }
          resolve({
            data: versionoptions,
          })
        });
        
      })
    };
    function queryuser () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var useroptions = [];
        // 获取用户列表
        service.get('/dashboard/notify/user_list?notify_type=1').then(res=>{
          let data1 = res.data.data;//版本数组
          for(let i=0;i<data1.length;i++){
            useroptions.push({label:data1[i],value:data1[i]});
          }
          resolve({
            data: useroptions,
          })
        });
      })
    };
    function querystage () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var stageoptions = [];
        // 获取用户列表
        service.get('/dashboard/task/config/stages').then(res=>{
          stageoptions = [];
          for(let i=0;i<res.data.data.length;i++){
            let rowj = {
              label:res.data.data[i].label,
              value:res.data.data[i].value
            }
            stageoptions.push(rowj)
          }
          // console.log("stageoptions",stageoptions);
          resolve({
            data: stageoptions,
          })
        });
        
      })
    };
    function querycommentlist(item){
      return new Promise((resolve) => {
        commentlist = [] ;
        service.get('/dashboard/task/'+item.iter_id+'/comment').then(res=>{
          // let editvalue = "";
          if(res.data.code != 0){
            //错误处理
            // reject({ status: 500, msg: 'error' })
            ifshowloadingRef.value = false;
            message.error( t("common.loadcodenot0"), { duration: 5000 })
          }else{
            let data1 = res.data.data;
            console.log("ififif",data1)
            service.get('/user/current').then(r=>{
              let nowname = r.data.data.user;
              if(data1!=null){
                for(let i=0;i<data1.length;i++){
                  let rowjson ={
                    comment:data1[i].comment,
                    stage:data1[i].stage_name,
                    user:data1[i].user,
                    created_at:data1[i].created_at,
                    updated_at:data1[i].updated_at,
                    iter_id:item.iter_id,
                    ifshowbt:data1[i].user!=nowname?false:true,
                  }
                  // console.log("ififif",data1[i].user,nowname,data1[i].user!=nowname?false:true)
                  commentlist.push(rowjson); 
                }
              }
              resolve({
                data: commentlist,
                id:item.iter_id,
                stage:item.stage
              })
            })     
            
          }
          // commentlistRef.value = res.data.data;
          // setTimeout(
          //   () =>
          //     resolve({
          //       data: commentlist,
          //       id:item.iter_id,
          //       stage:item.current_stage
          //     }),
          //   100
          // )
        })

      }) 
    };
    function querydetailslist(row){
      return new Promise((resolve) => {
        let detailobj1 = {} ;//清空再赋值，不然每次查询会累加
        service.get('/dashboard/task/'+row.iter_id+'/detail').then(res=>{
          if(res.data.code != 0){
            //错误处理
            // reject({ status: 500, msg: 'error' })
          }else{
            detailobj1 = res.data.data;
            // 增加传过来的bug title值
            detailobj1.title = row.name;
            detailobj1.iter_id= row.iter_id;
            console.log("``````````````````````detailobj1",detailobj1);
            // console.log("pageCount: ",detailobj1,row.name);
            resolve({
              data: detailobj1,
              // datadetails:detailobj1.stages
            })
          }
        }).catch((err) =>{
          console.log("errrrrr",err);
          if(err.response.status == 500)
            message.error( t("common.loaderr"), { duration: 5000 })
        });
        
      })
    };
    function query2fliter(data,page, pageSize,selectedversion ="",tiptype ="",selectjira_components=[],){//data就是dataRef.value
      return new Promise((resolve) => {
        datalist2fliter = [];
        datalist2plus = [];
        var datalist3 = [];
        let total = 0;
        let pageCount =0;
        let data1 = JSON.parse(JSON.stringify(data));
        console.log("data1:",data1.length,data1,selectedversion2Ref.value);
        for(let i=0;i< data1.length;i++){
          // 没选择就不过滤
          if(selectedversion2Ref.value == ""||selectedversion2Ref.value ==null){
            // 新存个显示json
            let rowjson ={
              id: data1[i].id,
              name: data1[i].name,
              current_notify_users:data1[i].current_notify_users,
              jira_components:data1[i].jira_components,
              all_notify_users:data1[i].all_notify_users,
              status:data1[i].status,
              current_stage:data1[i].current_stage,
              stage:data1[i].stage,
              end_time:data1[i].end_time,
              minor_version:data1[i].minor_version,
              iter_id:data1[i].iter_id
            }
            datalist2fliter.push(rowjson);
              // console.log("无过滤！datalist2：",datalist2)
            // }
          }
          else{ //有选择值就过滤
            // console.log("要过滤！selectedversion: ",selectedversion)
            // if("11.0.9" == selectedversion) {
            if(data1[i].minor_version == selectedversion) {
              // if(notify_type ==2){
                // console.log("aaaaaaa notify_type ==2")
              let rowjson ={
                id: data1[i].id,
                name: data1[i].name,
                // notify_type:2,
                current_notify_users:data1[i].current_notify_users,
                jira_components:data1[i].jira_components,
                all_notify_users:data1[i].all_notify_users,
                status:data1[i].status,
                current_stage:data1[i].current_stage,
                end_time:data1[i].end_time,
                minor_version:data1[i].minor_version,
                iter_id:data1[i].iter_id
              }
              datalist2fliter.push(rowjson);
              // console.log("过滤了的列表",datalist2fliter)
              // }
            }
          }
        }
        console.log("tiptype:",tiptype);
        if(tiptype == "warntype"){
          for(let i = 0;i<datalist2fliter.length;i++){
            if(datalist2fliter[i].status == 1){
              datalist2plus.push(datalist2[i]);
            }      
          }
        }else if(tiptype == "delaytype"){
          for(let i = 0;i<datalist2fliter.length;i++){
            if(datalist2fliter[i].status == 2){
              datalist2plus.push(datalist2[i]);
            }      
          }
        }else if(tiptype == "alltype"){
          datalist2plus = datalist2fliter;
        }else{//默认变全部了
          // for(let i = 0;i<datalist2fliter.length;i++){
          //   if(datalist2fliter[i].status == 1 || datalist2fliter[i].status == 2){
          //     datalist2plus.push(datalist2fliter[i]);
          //   }      
          // }
          datalist2plus = datalist2fliter;
        }
        // 模块的过滤 selectjira_components为选中的模块值
        if(selectjira_components.length){
          for(let j=0;j<datalist2plus.length;j++){
            // let flag = false;//是否匹配上的标志，匹配上就不需要再
            // console.log("row: ",filteredData1[j]);
            for(let i=0;i<selectjira_components.length;i++){
              if(datalist2plus[j].jira_components.indexOf(selectjira_components[i])!= -1){//匹配上了
                datalist3.push(datalist2plus[j]);
                break;
              } 
            }
            // console.log("row: ",row);
          }
        }
        else{
          datalist3 = datalist2plus;
        }
        console.log("datalist3:",datalist3.length,datalist3,datalist2plus,datalist2,selectjira_components);
        total = datalist3.length;
        pageCount = Math.ceil(datalist3.length / pageSize)
        console.log("pageCount: ",datalist3.length,pageCount,total);
        resolve({
          pageCount,
          data: datalist3,//文档错误，文档为 pagedData
          total,
        })
      })
    }
  
    onMounted(() => {
      query2().then((data) => {
        // data2Ref.value = data.data
        datalist2all = data.data;
        query2fliter(
          datalist2all,//data2Ref.value,
          paginationReactive2.page,
          paginationReactive2.pageSize,
          selectedversion2Ref.value,"",
          jira_componentsReactive.filterOptionValues
        ).then((datadata) => {
          data2Ref.value =datadata.data,
          paginationReactive2.pageCount = data.pageCount
          paginationReactive2.itemCount = data.total
          loadingRef.value = false
        })
       
      })
      queryversion().then((data) => {
        versionoptionsRef.value = data.data
        loadingRef.value = false
      })
      queryuser().then((data) => {
        useroptionsRef.value = data.data
        loadingRef.value = false
      })
      querystage().then((data) => {
        stageoptionsRef.value = data.data
      })
    })
    return {
      // data: dataRef,
      data2: data2Ref,
      showModal: showModalRef,
      showModal2: showModal2Ref,
      inputvalue:inputvalueRef,
      commentlist:commentlistRef,
      detailobj:detailobjRef,
      // detailsobjstages:detailsobjstagesRef,
      tocomment:tocommentRef,
      tocommentid:tocommentidRef,
      stageoptions:stageoptionsRef,
      nowstage:nowstageRef,
      detailscolumns: createdetailsColumns({}),
      columns: createColumns({
        commentdetailsItem(rowData){
          console.log("777 send mail to " + rowData.iter_id);
          loadingBar.start();
          querycommentlist(rowData).then((data) => {
            commentlistRef.value = data.data;
            tocommentidRef.value = data.id;
            nowstageRef.value = data.stage;
            showModalRef.value = true;
            loadingBar.finish();
            // console.log("888",commentlistRef.value)
          })        
        },
        detailsItem(rowData){
          // console.log("888 send mail to " + rowData.iter_id);
          // loadingBar.start();
          querydetailslist(rowData).then((data) => {
            detailobjRef.value = data.data;
            // detailsobjstagesRef.value = data.datadetails;
            showModal2Ref.value = true;
            // loadingBar.finish();
            // console.log("888999",detailobjRef.value)
          }) 
        }
      }),
      editcomment(index,item){
        console.log("666 send mail to " ,index,item);
        if(item.comment!=''){
          service.put('/dashboard/task/'+item.iter_id+'/comment/'+index,{comment:item.comment}).then(res=>{
            message.success(t("common.updatesuc"));
            console.log("222222222222222");
          })
        }else{
          message.error(t("common.commentnonull"));
        }
         
      },
      deletecomment(index,item){
        console.log("777 send mail to " ,index);
        service.delete('/dashboard/task/'+item.iter_id+'/comment/'+index).then(res=>{
          message.success(t("common.deletesuc"));
          querycommentlist(item).then((data) => {
            commentlistRef.value = data.data;
            showModalRef.value = true;
          })  
        })
      },
      edittocomment(){
        // console.log("888 send mail to " ,tocommentRef.value,tocommentidRef.value,nowstageRef.value);
        let bodydata = {
          stage : parseInt(nowstageRef.value),
          comment : tocommentRef.value,
        }
        // console.log("message",bodydata);
        if(tocommentRef.value!='' && nowstageRef.value!=null){
          service.post('/dashboard/task/'+tocommentidRef.value+'/comment',bodydata).then(res=>{
            // console.log("111111111111111");
            message.success(t("version.nodewatch.commentsuc"));
            let rowlist ={
              stage:parseInt(nowstageRef.value),
              iter_id:tocommentidRef.value
            }
            // console.log("111111111111111");
            querycommentlist(rowlist).then((data) => {
              commentlistRef.value = data.data;
              // console.log("11111112222",data.data,commentlistRef.value) 
              // showModalRef.value = true;
            })  
            // tocommentidRef.value='';
            // tocommentRef.value='';
            // location.reload() ; 
          })
        }else{
          message.error(t("common.stagenonull"));
        }
        // .catch(e=>{
        //   // console.log("essrormessage",e.response.data);
        //   // alert(e.response.data);
        //   message.error(t("version.nodewatch.commenterr"));
        // });
      },
      // 可调的
      // pagination: paginationReactive,
      pagination2: paginationReactive2,
      // selectedversion:selectedversionRef,
      selectedversion2:selectedversion2Ref,
      selectedtype2:selectedtype2Ref,
      selecteduser:selecteduserRef,
      // selectedstage:selectedstageRef,
      versionoptions:versionoptionsRef,
      useroptions:useroptionsRef,
      typeoptions:ref([
        {
          label:"预警",
          value:"warntype",
          type: "warning"
        },{
          label:"超期",
          value:"delaytype",
          type: "error"
        },{
          label:"全部",
          value:"alltype",
          type: "success"
        }
      ]),
      rendertypeLabel: (option) => {
        if(option.value=="warntype"){
          return [
            h(NIcon,
              {
                style: {
                  verticalAlign: "-0.15em",
                  marginRight: "4px"
                }
              },
              {
                default: () => h(Warning)
              }
            ),
            option.label
          ];
        }else if(option.value=="delaytype"){
          return [
            h(NIcon,
              {
                style: {
                  verticalAlign: "-0.15em",
                  marginRight: "4px"
                }
              },
              {
                default: () => h(MdCloseCircleOutline)
              }
            ),
            option.label
          ];
        }else if(option.value=="alltype"){
          return [
            h(NIcon,
              {
                style: {
                  verticalAlign: "-0.15em",
                  marginRight: "4px"
                }
              },
              {
                default: () => h(IosList)
              }
            ),
            option.label
          ];
        }else{
          return [option.label];
        }
      },
      // ifshowloading:ifshowloadingRef,
      ifshowloading2:ifshowloading2Ref,
      // checkedRowKeys: checkedRowKeysRef,
      rowKey: (row) => row.id,
      handlePageChange2 (currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          // console.log("data000:" ,data);
          query2fliter(
            datalist2all,//data2Ref.value,
            currentPage,
            paginationReactive2.pageSize,
            selectedversion2Ref.value,
            selectedtype2Ref.value,
            jira_componentsReactive.filterOptionValues
          ).then((data) => {
            // console.log("data111:" ,data);
            // console.log("dataRef:" ,dataRef.value);
            data2Ref.value = data.data;
            ifshowloading2Ref.value = false;
            // console.log("dataRefhou:" ,dataRef.value);
            paginationReactive2.page = currentPage
            paginationReactive2.pageCount = data.pageCount
            paginationReactive2.itemCount = data.total
            loadingRef.value = false;
          })
        }
      },
      handleUpdateFilter (filters) {
        console.log("3333333333",filters)
        if (!loadingRef.value) {
          loadingRef.value = true
          const jira_componentsfilter = filters.jira_components || [];
          // const notify_usersfilter = filters.notify_users || [];
          query2fliter(
            datalist2all,//data2Ref.value,
            paginationReactive2.page,
            paginationReactive2.pageSize,
            selectedversion2Ref.value,
            selectedtype2Ref.value,
            jira_componentsfilter
          ).then((data) => {
            data2Ref.value = data.data;
            ifshowloading2Ref.value = false;
            // console.log("dataRefhou:" ,dataRef.value);
            paginationReactive2.pageCount = data.pageCount
            paginationReactive2.itemCount = data.total
            loadingRef.value = false;
          })
        }
      },
      rolechange2(){
        query2().then((data) => {
        // data2Ref.value = data.data
        datalist2all = data.data;
        query2fliter(
          datalist2all,//data2Ref.value,
          paginationReactive2.page,
          paginationReactive2.pageSize,
          selectedversion2Ref.value,
          selectedtype2Ref.value,
          jira_componentsReactive.filterOptionValues
        ).then((datadata) => {
          data2Ref.value =datadata.data,
          paginationReactive2.pageCount = data.pageCount
          paginationReactive2.itemCount = data.total
          loadingRef.value = false
        })
      })
      },
      // minorversionchange(value,option){
      //   // console.log("222222222222222",value,option);
      //   ifshowloadingRef.value = true;
      //   query(
      //     paginationReactive.page,
      //     paginationReactive.pageSize,
      //     selectedversionRef.value
      //   ).then((data) => {
      //     dataRef.value = data.data
      //     ifshowloadingRef.value = false;
      //     paginationReactive.pageCount = data.pageCount
      //     paginationReactive.itemCount = data.total
      //     loadingRef.value = false
      //   })
      // },
      minorversionchange2(value,option){
        ifshowloading2Ref.value = true;
        // console.log("minorversionchange2",value,selectedversion2Ref.value);
        query2fliter(
          datalist2all,//data2Ref.value,
          paginationReactive2.page,
          paginationReactive2.pageSize,
          selectedversion2Ref.value,
          selectedtype2Ref.value,
          jira_componentsReactive.filterOptionValues
        ).then((data) => {
          data2Ref.value =data.data,
          ifshowloading2Ref.value = false;
          paginationReactive2.pageCount = data.pageCount
          paginationReactive2.itemCount = data.total
          loadingRef.value = false
        })
      },
      typechange2(){
        ifshowloading2Ref.value = true;
        // console.log("minorversionchange2",value,selectedversion2Ref.value);
        query2fliter(
          datalist2all,//data2Ref.value,
          paginationReactive2.page,
          paginationReactive2.pageSize,
          selectedversion2Ref.value,
          selectedtype2Ref.value,
          jira_componentsReactive.filterOptionValues
        ).then((data) => {
          data2Ref.value =data.data,
          ifshowloading2Ref.value = false;
          paginationReactive2.pageCount = data.pageCount
          paginationReactive2.itemCount = data.total
          loadingRef.value = false
        })
      },
      clearselect2(){
        ifshowloading2Ref.value = true;
        selectedversion2Ref.value = "";
        selectedtype2Ref.value = "";
        selecteduserRef.value = [];
        // console.log("minorversionchange2",value,selectedversion2Ref.value);
        query2().then((data) => {
          // data2Ref.value = data.data
          datalist2all = data.data;
          query2fliter(
            datalist2all,//data2Ref.value,
            paginationReactive2.page,
            paginationReactive2.pageSize,
            selectedversion2Ref.value,
            selectedtype2Ref.value,
            jira_componentsReactive.filterOptionValues
          ).then((datadata) => {
            data2Ref.value =datadata.data
            ifshowloading2Ref.value = false;
            paginationReactive2.pageCount = data.pageCount
            paginationReactive2.itemCount = data.total
            loadingRef.value = false
          })
        })
        // query2fliter(
        //   datalist2all,//data2Ref.value,
        //   paginationReactive2.page,
        //   paginationReactive2.pageSize,
        //   selectedversion2Ref.value,
        //   selectedtype2Ref.value,
        // ).then((data) => {
        //   data2Ref.value = data.data;
        //   ifshowloading2Ref.value = false;
        //   paginationReactive2.pageCount = data.pageCount
        //   paginationReactive2.itemCount = data.total
        //   loadingRef.value = false
        // })
      },
    };
  },
  mounted() {
  },
  computed: {

  },
  methods: {
    tohref(rowData){
      console.log("xwahisqfdefeqfqe",rowData);
      this.$router.push({
        path: '/version/iterate/edit/'+rowData.iter_id+'/'+rowData.finished,
      });
    }
  }
}
</script>
<style scoped>
:deep .n-card > .n-card-header .n-card-header__main{
  font-weight:bold !important;
}

:deep n-card--hoverable{
  box-shadow: 2px 2px 12px  gray !important;
}
::v-deep .n-dialog__content .n-timeline .n-timeline-item .n-timeline-item-content .n-timeline-item-content__content{
  color: #18a058 !important;
  font-size: 14px !important;
}
:deep .n-dialog__content .n-timeline-item--default-line-type .n-timeline-item-content .n-timeline-item-content__content{
  color: #000000 !important;
}
 .details{
  float: left;
  height: 34px;
  line-height: 34px;
  padding-right: 50px;
  /* padding-left: 10px; */
  color: #000000;
  font-weight: bold;
 }
 .finished{
  float: left;
  height: 34px;
  line-height: 34px;
  /* margin-left: 50%; */
  width: 150px;
  text-align: center;
 }
 .tohref{
  float: right;
  height: 34px;
  line-height: 34px;
  /* margin-left: 50%; */
  width: 100px;
  text-align: center;
 }
 .successf{
  background-color: #dfefe8;
  color: #18a058;
 }
 .errf{
  background-color: #f3dddd;
  color: #e50d0d;
 }
</style>