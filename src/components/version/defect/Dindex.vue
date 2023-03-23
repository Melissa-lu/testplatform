<template>
  <n-space vertical :size="12" style="margin-top: 30px">
    <div style=" padding: 0 70px;">
      <div style="float: left;height: 34px;line-height: 34px;padding-right: 20px;padding-left: 10px;color: #000000;font-weight: bold;">
        {{$t("version.nodewatch.version")}}
      </div>
      <KeepAlive><n-select v-model:value="selectedversion"  :options="versionoptions" @update:value="minorversionchange" style="width:30%;margin-bottom: 15px;float: left;" clearable /></KeepAlive>
    </div>
    <div v-if="data.published==2" class="spantitle" style=" font-size:26px;color: #000;margin: 10px;float: left;height: 34px;line-height: 34px;padding:0px 0 0 15%;">
      距离<span v-if="data.end_date">{{data.end_date}}</span><span >{{data.minor_version}}</span><span >{{data.stage_name}}</span>节点剩余<span >{{data.date_delta}}</span> 天
    </div>
    <div v-if="data.published==1" class="spantitle" style=" font-size:26px;color: #000;margin: 10px;float: left;height: 34px;line-height: 34px;padding:0px 0 0 25%;">
      已发布，发布时间为<span >{{data.published_date}}</span>
    </div>
    <!-- 2个表格 -->
    <div style=" padding: 0 70px;">
      <n-grid x-gap="24" :cols="2">
        <n-gi>
          <n-card  hoverable  style="min-height:400px;max-height:600px;margin-top: 20px;text-align:center"  :title="$t('version.defect.kehubug')" >
            <n-data-table
              size="small"  striped 
              ref="table"
              :bordered="false"
              :columns="columns"
              :data="databug1"
              :max-height="450"
              :row-key="rowKey"
              :single-line="false"
              virtual-scroll
              :loading="loading"         
            />
          </n-card>
        </n-gi>
        <n-gi>
          <n-card  hoverable  style="min-height:400px;max-height:600px;margin-top: 20px;text-align:center;"  :title="$t('version.defect.neicebug')" >
          <n-data-table
              size="small"  striped 
              ref="table"
              :bordered="false"
              :columns="columns"
              :data="databug2"
              :max-height="450"
              :row-key="rowKey"
              :single-line="false"
              virtual-scroll
              :loading="loading"         
            />
          </n-card>
        </n-gi>
      </n-grid>
    </div>
    <!-- ifshow -->
    <div v-show="ifshowloading" style="background-color: #fdfdfd;color: #fdfdfd;width: 90%;min-height: 300px;
          height: 73%;position: absolute; top: 185px;left: 100px;z-index: 999;">11
      <n-spin  size="large" style="position: absolute;left: 47%;top: 60px;" />
    </div>
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
import { pxfy } from 'seemly';
function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}
export default {
  name: "Dindex",
  data() {
    return {
      result:{},
    };
  },
  props: {
  },
  components: {
    
  },
  watch: {

  },
  created() {
  },
  setup() {
    const { t } = useI18n();
    const loadingBar = useLoadingBar();
    const router = useRouter();
    const dialog = useDialog();
    const message = useMessage();
    var datazhu = {};
    var databug1 = [];
    var databug2 = [];
    const loadingRef = ref(true);
    const dataRef = ref({});
    const databug1Ref = ref([]);
    const databug2Ref = ref([]);
    const selectedversionRef=ref("");
    const versionoptionsRef= ref([]);
    const ifshowloadingRef = ref(false);
    const createColumns = ({}) => {
      return [
        {
          title: t("version.defect.assignee"),
          key: "assignee1",
          align:'center',
          // width: 200,
        },
        {
          title: t("version.defect.count"),
          key: "count1",
          align:'center',
          // width: 150,
          render(row) {
            return h(NButton, {
              size: "small",
              tag:"a",
              // style:"width: 100px;",
              text:true,
              // href:'https://work.fineres.com/browse/'+row.linkbugid,
              href: row.link1,
              target:"_blank",
            }, 
            { default: () => row.count1 });
          },
        },
        {
          title: t("version.defect.assignee"),
          key: "assignee2",
          align:'center',
          // width: 200,
        },
        {
          title: t("version.defect.count"),
          key: "count2",
          align:'center',
          // width: 150,
          render(row) {
            return h(NButton, {
              size: "small",
              tag:"a",
              // style:"width: 100px;",
              text:true,
              // href:'https://work.fineres.com/browse/'+row.linkbugid,
              href: row.link2,
              target:"_blank",
            }, 
            { default: () => row.count2 });
          },
        },
        
      ];
    };
    //可调每页展示的
    // const paginationReactive = reactive({
    //   page: 1,
    //   pageSize: 5,
    //   pageCount: 1,
    //   showSizePicker: true,
    //   prefix ({ itemCount }) {
    //     return `一共有 ${itemCount}个`
    //   },
    //   pageSizes: [5, 8, 10],//分页选项
    //   onChange: (page) => {
    //     paginationReactive.page = page;
    //   },
    //   onUpdatePageSize: (pageSize) => {
    //     paginationReactive.pageSize = pageSize;
    //     paginationReactive.page = 1;
    //   }
    // });
    // 可调每页展示的over
    // 右键菜单
    // 右键菜单over
    function queryversion () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var versionoptions = [];
        // 获取用户列表
        service.get('/dashboard/version/minor').then(res=>{
          if(res.data.code != 0){
            //错误处理
            // reject({ status: 500, msg: 'error' })
          }else{
            let data1 = res.data.data;//版本数组
            for(let i=0;i<data1.length;i++){
              versionoptions.push( { label:data1[i].minor_version , value:data1[i].id } );
              // console.log("11",rowjson,data1[i].tags)
            }
            resolve({
              data: versionoptions,
            })
          }
        }).catch((err) =>{
          console.log("errrrrr",err);
          if(err.response.status == 500)
            message.error( t("common.loaderr"), { duration: 5000 })
        });
        
      })
    }
    // function query (page, pageSize) {
    function query () {
      return new Promise((resolve,reject,time=10000) => {
        datazhu = {} ;//清空再赋值，不然每次查询会累加 
        databug1 = [];
        databug2 = [];
        // console.log("222222222222222",selectedversionRef.value);
        if(selectedversionRef.value!=''){
          service.get('/dashboard/version/'+selectedversionRef.value+'/bug').then(res=>{
            if(res.data.code != 0){
              //错误处理
              // reject({ status: 500, msg: 'error' });
              ifshowloadingRef.value = false;
              if(res.data.code == 65){
                message.error(t("version.defect.code65"), { duration: 5000 })
              }
            }else{
              let data1 = res.data.data;
              datazhu ={
                minor_version:data1.minor_version,
                end_date:data1.end_date,
                stage_name:data1.stage_name,
                date_delta:data1.date_delta,
                published:data1.published,
                published_date:data1.published_date,
              }
              
              let databug1len = (data1.bugs.cust_bug!=null && data1.bugs.cust_bug!='')?data1.bugs.cust_bug.length:0;
              let list1 = data1.bugs.cust_bug;
              let listlen1 = 0;
              let databug2len = (data1.bugs.itern_bug!=null && data1.bugs.itern_bug!='')?data1.bugs.itern_bug.length:0;
              let list2 = data1.bugs.itern_bug;
              let listlen2 = 0;
              let flag1 = false;//false为偶数，true为奇数，默认偶数
              let flag2 = false;//false为偶数，true为奇数，默认偶数
              if(databug1len>0){
                if(databug1len % 2 ==1){//奇数
                  listlen1 = Math.floor(databug1len / 2 )+1;
                  flag1 = true;
                }else{//偶数
                  listlen1 = databug1len / 2;
                }
              }
              if(databug2len>0){
                if(databug2len % 2 ==1){//奇数
                  listlen2 = Math.floor(databug2len / 2) +1;
                  flag2 = true;
                }else{//偶数
                  listlen2 = databug2len / 2;
                }
              }
              // console.log("xjbsciusb",listlen1,listlen2,flag1,flag2)
              // console.log("listlen",listlen1,datazhu)
              for(let i=0;i<listlen1;i++){
                let rowjson ={};
                if(i== (listlen1-1) && flag1 == true){
                  rowjson ={
                    assignee1:list1[i].assignee,
                    count1:list1[i].count,
                    link1:list1[i].link,
                    assignee2:'',
                    count2:'',
                    link2:'',
                  }
                }else{
                  rowjson ={
                    assignee1:list1[i].assignee,
                    count1:list1[i].count,
                    link1:list1[i].link,
                    assignee2:list1[i+listlen1].assignee,
                    count2:list1[i+listlen1].count,
                    link2:list1[i+listlen1].link,
                  }
                }
                databug1.push(rowjson);
              } 
              for(let i=0;i<listlen2;i++){
                let rowjson ={};
                if(i== (listlen2-1)&& flag2 == true){
                  rowjson ={
                    assignee1:list2[i].assignee,
                    count1:list2[i].count,
                    link1:list2[i].link,
                    assignee2:'',
                    count2:'',
                    link2:'',
                  }
                }else{
                  rowjson ={
                    assignee1:list2[i].assignee,
                    count1:list2[i].count,
                    link1:list2[i].link,
                    assignee2:list2[i+listlen2].assignee,
                    count2:list2[i+listlen2].count,
                    link2:list2[i+listlen2].link,
                  }
                }
                databug2.push(rowjson);
              } 
              let rowjsonnull ={
                assignee1:"",
                count1:"",
                link1:"",
                assignee2:"",
                count2:"",
                link2:"",
              }
              if(listlen1==0){
                databug1.push(rowjsonnull);
              }      
              if(listlen2==0){
                databug2.push(rowjsonnull);
              }      
              resolve({
                data: datazhu,//文档错误，文档为 pagedData
                buglist1:databug1,
                buglist2:databug2,
              })
            }
          }).catch((err) =>{
            console.log("errrrrr",err);
            ifshowloadingRef.value = false;
            if(err.response.status && err.response.status == 500)
              message.error( t("common.loaderr")+" 页面未变更", { duration: 5000 })
          });;
        }
      })
    }

    onMounted(() => {
      query().then((data) => {
        dataRef.value = data.data;
        databug1Ref.value = data.buglist1;
        databug2Ref.value = data.buglist2;
        loadingRef.value = false;
      })
      queryversion().then((data) => {
        versionoptionsRef.value = data.data
        loadingRef.value = false
      })
    })
    return {
      // data: dataRef,
      data: dataRef,
      databug1:databug1Ref,
      databug2:databug2Ref,
      selectedversion:selectedversionRef,
      versionoptions:versionoptionsRef,
      ifshowloading:ifshowloadingRef,
      columns: createColumns({}),
      // rowKey: (row) => row.id,
      minorversionchange(value,option){
        // console.log("222222222222222",value,option,selectedversionRef.value);
        ifshowloadingRef.value = true;
        // dataRef.value = {};
        // databug1Ref.value = [];
        // databug2Ref.value = [];
        query().then((data) => {
          dataRef.value = {};
          databug1Ref.value = [];
          databug2Ref.value = [];
          dataRef.value = data.data;
          // console.log("databug1Ref: ",data.buglist1,databug1Ref.value);
          databug1Ref.value = data.buglist1;
          databug2Ref.value = data.buglist2;
          // paginationReactive.pageCount = data.pageCount
          // paginationReactive.itemCount = data.total
          loadingRef.value = false;
          ifshowloadingRef.value = false;
        })
      },
    };
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
/* :deep  */
.spantitle span{
  color: #fff;
  margin: 0 10px;
  font-weight: bold;
  padding: 8px;
  border-radius: 8px;
  background-color: #18a058;
}

</style>