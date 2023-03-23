<template>
<n-space>
  <!-- <span>.stringify(columns)}}</span> -->
  <!-- 版本筛选 -->
  <n-form-item :label="$t('function.minorversion')" style="margin:25px 0 -15px;width: 265px;" label-placement="left">
    <n-select v-model:value="selectedversion"  :options="versionoptions" 
      @update:value="versionchange"
      style="margin-bottom: 15px;float: left;min-width: 100px;" clearable />
    <n-select v-model:value="selectedminorversion" :disabled="ifdisabled"  :options="minorversionoptions" 
      @update:value="minorversionchange"
      style="margin-bottom: 15px;float: left;min-width: 120px;" clearable />
  </n-form-item>
  <!-- 标题筛选 -->
  <n-form-item :label="$t('function.fliterttle')" style="margin:25px 0px -25px 35px;min-width: 500px;" label-placement="left">
    <n-input-group style="width: 150%;">
      <n-select :style="{ width: '30%' }" v-model:value="flitertype"  :options="flitertypeoptions" clearable
        @update:value="flitertypechange" />
      <n-input :style="{ width: '70%' }" v-model:value="fliterword" clearable />
      <n-button type="primary" ghost @click="flitersearch" >
        {{$t('common.search')}}
      </n-button>
    </n-input-group>
  </n-form-item>
  <!-- 列显示选择 -->
  <n-form-item  style="margin: 25px 0px -30px;position: absolute;right: 50px;" label-placement="left">
    <!-- <n-select v-model:value="selectedversion"  :options="versionoptions" 
      @update:value="versionchange"
      style="margin-bottom: 15px;float: left;min-width: 100px;" clearable /> -->
    <n-popconfirm
      :show-icon="false" @positive-click="flitercollick"
      @negative-click="handleNegativeClick"
    >
      <template #trigger>
        <!-- <n-button>退出游戏</n-button> -->
        <n-button>{{$t('function.col')}}
          <template #icon>
            <n-icon><AddCircleOutline /></n-icon>
          </template>
        </n-button>
      </template>
      <!-- <n-checkbox-group :v-model:value="colvalue" @update:value="colvaluechange"> -->
      <!-- <div :v-model:value="colvalue" ></div> -->
      <n-button size="small" @click="ifcolvalue" style="margin-right:20px" >全选/全不选</n-button>
      <n-space  item-style="display: flex;" v-for="(item, index) in coloptions" :key="index" >
        <!-- :v-model:checked="ifchecked[index]" -->
        <n-checkbox :value="item.value" :label="item.label" :checked="item.ifchecked" @update:checked="colvaluechange(!item.ifchecked,index)" 
          style="margin-right:10px" />
      </n-space>
      <!-- </n-checkbox-group> -->
    </n-popconfirm>
  </n-form-item>
  <!-- 主体表格 -->
  <n-data-table  
    size="small"  
    ref="table"
    :bordered="false"
    :columns="columns"
    :data="data"
    :row-key="rowKey"
    :row-class-name="rowClassName"
    :pagination="pagination"
    :loading="loading"
    :scroll-x="2200"
    @update:page="handlePageChange"
    @update:filters="handleUpdateFilter"
  />
  <!-- 点击分析后的部分 -->
  <n-modal v-model:show="showModal" preset="dialog" style="min-width: 60% !important;width:auto;"
    title="Dialog"  
    :maskClosable=false 
    :onMaskClick="onMaskClick" 
    :onPositiveClick="onPositiveClick"
    :onNegativeClick="onNegativeClick"
    :on-after-leave="cleartreedata">
    <template #header>
      <div>{{$t('function.title')}}</div>
    </template>
    <div>
      <!-- checkable  :checked-keys="checkedKeys" -->
      <n-tree
      block-line
      :data="treedata"
      :on-load="handleLoad"
      :expanded-keys="expandedKeys"
      :check-strategy="checkStrategy"
      :allow-checking-not-loaded="cascade"
      :cascade="cascade"
      expand-on-click
      @update:checked-keys="handleCheckedKeysChange"
      @update:expanded-keys="handleExpandedKeysChange"
      virtual-scroll
      style="max-height: 450px"
    />
      <n-spin v-show="ifshow"  size="medium" style="  position: absolute;top: -20px;left: 47%;" />
      <!-- <n-spin v-show="false" size="medium" style="  position: absolute;top: -15%;left: 47%;" /> -->
    </div>
    <!-- <template #action>
      <div></div>
    </template> -->
  </n-modal>
  </n-space>
</template>
<script>
// import axios from 'axios';
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRouter  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useDialog,NDialogProvider,useMessage,NTooltip  } from "naive-ui";
import { inject } from 'vue'
import { LogInOutline as LogInIcon ,AddCircleOutline,CheckmarkDoneSharp} from "@vicons/ionicons5";
import { IncompleteCircleFilled,AirlineStopsSharp,BackHandOutlined } from "@vicons/material";
import service from '../../requests/axios';
import service2 from '../../requests/axios2';
import apartFliter from '../../assets/data/apartFliter.json'
function renderIcon2(icon) {
  return () => h(NIcon,{ size : 20 }, { default: () => h(icon) });
}
export default {
  name: "BloodRate",
  data() {
    return {
      fileobj:{}
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
    const router = useRouter();
    const dialog = useDialog();
    const message = useMessage();
    var datalist = [];
    var details=[];
    const expandedKeysRef = ref([1]);
    const checkedKeysRef = ref([]);
    const minorversionoptionsRef= ref([]);
    const fliterwordRef = ref("");
    const flitertypeRef = ref("0");
    // const ifcheckedRef =ref([false,false,false,false,false,false]);
    const colvalueRef = ref([]);
    const coloptionsRef =ref([
      {
        label: "父模块",
        value: "0",
        ifchecked:false,
      },{
        label: "bug id",
        value: "1",
        ifchecked:false,
      },{
        label: "父场景",
        value: "2",
        ifchecked:false,
      },{
        label: "父标题",
        value: "3",
        ifchecked:false,
      },{
        label: "关联bug",
        value: "4",
        ifchecked:false,
      },{
        label: "子模块",
        value: "5",
        ifchecked:false,
      },{
        label: "子场景",
        value: "6",
        ifchecked:false,
      },{
        label: "子标题",
        value: "7",
        ifchecked:false,
      } 
    ]);
    const apart = {
      title: t("function.apart"),
      key: "apart",//模块
      width: 100,
      ellipsis: true,
      rowSpan: (rowData, rowIndex) => (rowData.ifflag==true?rowData.comlen:1),
      filter: true,
      filterOptionValues: [],
      filterOptions: apartFliter.value,
    };
    const linkapart = {
      title: t("function.apart"),
      key: "linkapart",//模块
      width: 100,
      ellipsis: true,
      // rowSpan: (rowData, rowIndex) => (rowData.ifflag==true?rowData.comlen:1),
      filter: true,
      filterOptionValues: [],
      filterOptions: apartFliter.value,
    };
    const apartReactive = reactive(apart);
    const linkapartReactive = reactive(linkapart);
    // 分析bug关联,必须在这边声明，不然就是黑户
    function  analysisbugdetail(rowData) {
      ifshowRef.value = true;
      treedataRef.value =[];
      querydetails(rowData.linkbugid,rowData.bugid).then((data) => {
        // console.log("data send 22222 " ,data);
        if(data.data==''){
          // console.log("44444444444 ");
          message.error( t("function.errortips"), { duration: 5000 })
        }else{
          // console.log("555555");
          treedataRef.value = data.data;
          // console.log("send mail to22222 " ,ifshowRef.value, treedataRef.value,data);
        } 
        loadingRef.value = false;
        ifshowRef.value = false; 
      })
      showModalRef.value = true;

    }
    function checkbug(rowData){
      let flag = !rowData.ifcheck?1:"";
      console.log("222看一下send mail to " + rowData.bugid+"  "+rowData.ifcheck+"  "+flag);
      let formdata = new FormData();
      formdata.append('fix_version', selectedminorversionRef.value);
      formdata.append('bugid', rowData.linkbugid);
      formdata.append('check', flag);
      service2.post('/ScenarioAnalysis/check',formdata).then(res=>{
        if(res.data.code != 0){
          //错误处理
          // reject({ status: 500, msg: 'error' })
        }else{
          // bug确认状态改变
          // console.log("435cscvdv",rowData.ifcheck);
          rowData.ifcheck = !rowData.ifcheck;
          // console.log("435cscvdvhou",rowData.ifcheck);
        }
      }).catch((err) =>{
        console.log("errrrrr",err);
        if(err.response.status == 500)
          message.error( t("common.loaderr"), { duration: 5000 })
      });
    }
    var createColumnslist = ref( [
        apart,
        {
          title: t("function.bugid"),
          key: "bugid",
          width: 100,
          ellipsis: {
            tooltip: true,
          },
          // rowSpan: (rowData, rowIndex) => (rowData === 0 ? 2 : 1),
          rowSpan: (rowData, rowIndex) => (rowData.ifflag==true?rowData.comlen:1),
          render(row) {
            return h(NButton, {
              size: "small",
              tag:"a",
              style:"width: 110px;background-color:#fff;",
              text:true,
              href:'https://work.fineres.com/browse/'+row.bugid,
              target:"_blank",
            }, 
            { default: () => row.bugid });
          },
        },
        {
          title: t("function.scenes"),
          key: "scene",
          // width: 450,
          width: 150,
          ellipsis: true,
          rowSpan: (rowData, rowIndex) => (rowData.ifflag==true?rowData.comlen:1),
        },
        {
          title: t("function.bugtitle"),
          key: "bugtitle",
          // width: 450,
          width: 450,
          ellipsis: true,
          rowSpan: (rowData, rowIndex) => (rowData.ifflag==true?rowData.comlen:1),
        },
        {
          title: t("function.linkbugid"),
          key: "linkbugid",
          width: 100,
          ellipsis: {
            tooltip: true
          },
          render(row) {
            return h(NButton, {
              size: "small",
              tag:"a",
              style:"width: 100px;",
              text:true,
              href:'https://work.fineres.com/browse/'+row.linkbugid,
              target:"_blank",
            }, 
            { default: () => row.linkbugid });
          },
        },
        linkapart,
        {
          title: t("function.scenes"),
          key: "linkscene",
          // width: 450,
          width: 150,
          ellipsis: {
            tooltip: true
          },
        },
        {
          title: t("function.linkbugtitle"),
          key: "linkbugtitle",
          width: 450,
          ellipsis: {
            tooltip: true
          },
        },
        {
          title:t("common.action"),
          key: "datails",
          // titleColSpan: 3,//合并 3列表头
          width: 50,
          fixed: "right",
          render(row) {
          //   return h(NButton, {
          //     size: "small",
          //     style:"width: 100px;",
          //     onClick: () => analysisbugdetail(row)
          //   }, 
          //   { default: () => t("function.analyze") });
          // }
            return h(NTooltip,{
                trigger:"hover",
                placement: 'bottom',
              }, {
                trigger: () =>
                  h( NButton, {
                      style:{
                        width: "38px",padding: 0,margin: "0 0 0 0px"
                      },
                      onClick: () => analysisbugdetail(row)
                    },
                    renderIcon2(AirlineStopsSharp)
                  ),
                default: () => t("function.analyze")
              }
            )
          }
        },
        {
          title:"",
          key: "checkedstatus",
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
                        width: "38px",padding: 0,margin: "0 0 0 0px"
                      },
                      ghost:true,
                      color:!row.ifcheck? undefined:"#b1dfc5",
                      onClick: () => checkbug(row)
                    },
                    renderIcon2(!row.ifcheck? BackHandOutlined: CheckmarkDoneSharp)
                  ),
                default: () => !row.ifcheck?t("function.checkfalse"):t("function.checktrue")
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
        // 下面两列都是为合并单元格服务
        {
          title: '',
          key: "comlen",
          width: 1,
          ellipsis: true
        },
        {
          title:'',
          key: "ifflag",
          width: 1,
          ellipsis: true
        },
        // 是否分析的标志
        {
          title: '',
          key: "ifcheck",
          width: 1,
          ellipsis: true
        },
        {
          title: t("function.minorversion"),
          key: "minorversion",
          width: 1,
          ellipsis: true
          // fixed: "left",
          // rowSpan: (rowData, rowIndex) => (rowData.ifflag==true?rowData.comlen:1),
        },
      ]);
    const createColumns = ({
      analysisbugdetail,checkbug
    }) => {
      return createColumnslist;
    };
    
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
    const showModalRef = ref(false);
    const loadingRef = ref(true);
    // const minorversionRef = ref(null);
    // const columnsRef = ref(columns)
    const fathersonRef = ref([]);
    const ifshowRef = ref(true);
    const ifdisabledRef = ref(false);
    // 初始、切换数据加载
    function query (page, pageSize,filterValues = [],filterValues2 = [],filterValues3 = "",filterValues4 = "") {
      return new Promise((resolve) => {
        datalist = [] ;//清空再赋值，不然每次查询会累加
        console.log("vbanben!!!!!!!",selectedminorversionRef.value,"vbanben!!!!!!!");
        // 默认是最新解决版本-1
        // if(minorversionRef.value==null){
        if(selectedminorversionRef.value!=""){
          console.log("vbanben!!!!!!!2");
          service2.get('/ScenarioAnalysis/basic/'+selectedminorversionRef.value+'/').then(res=>{
            if(res.data.code != 0){
              //错误处理
              // reject({ status: 500, msg: 'error' })
              ifshowloadingRef.value = false;
              message.error( t("common.loadcodenot0"), { duration: 5000 })
            }else{
              let data1 = res.data.data;
              //试下先过滤
              const filteredData = filterValues.length? data1.filter((row) => filterValues.includes(row.apart)): data1;
              // console.log("555555555555555555filteredData",filteredData)
              let filteredData2 = filteredData;
              if(filterValues2.length){
                for(let i=0;i<filteredData2.length;i++){
                  filteredData2[i].children = data1[i].children.filter((row) => { 
                    // console.log("vbanben!!!!!!!2",row);
                    return filterValues2.includes(row.apart)
                  })
                }   
              }
              // const filteredData2 = filterValues2.length? filteredData.filter((row) => filterValues2.includes(row.linkapart)): filteredData;
              // const filteredData3 = filterValues3.length? filteredData2.filter((row) => filterValues3.includes(row.bugtitle)): filteredData2
              let filteredData3 = filteredData2;
              if(filterValues3 != ""){
                // console.log("vbanben!!!!!!!2.2",);
                if(filterValues4 != ""){
                  console.log("vbanben!!!!!!!2.3",);
                  if(filterValues4 == "1"){ //包含
                    filteredData3 = filteredData2.filter((row) => {
                      return row.bugtitle.indexOf(filterValues3)!= -1;
                      // console.log("vbanben!!!!!!!2.31",row.bugtitle);
                    });
                    // console.log("vbanben!!!!!!!2.31",filterValues3,filteredData3);
                  }else if(filterValues4 == "0"){ //不包含
                    filteredData3 = filteredData2.filter((row) => {
                      return row.bugtitle.indexOf(filterValues3) == -1;
                      console.log("vbanben!!!!!!!2.31",row.bugtitle);
                    });
                  }
                }else{
                  filteredData3 = filteredData2;
                  // console.log("vbanben!!!!!!!2.6",);
                }
                // console.log("vbanben!!!!!!!3",filteredData3);
              }
              //记录下length
              let arrindex = 0;
              console.log("data1111111111",filteredData3);
              // 接口返回值的循环，原生数组
              for(let i=0;i<filteredData3.length;i++){
                // 加个标志量，标记是否为跨页合并处理
                let ifpages = false;
                let last =0;
                // 现在是有一些返回值没有children的
                // if(filteredData3[i].children.length==0)
                //   console.log("11111111111111111data1111111111",i,filteredData3[i]);
                // 每个数组元素项的关联bug数组
                for(let j=0;j<filteredData3[i].children.length;j++){   
                  // console.log("jlen",data1[i].children.length)
                  arrindex = arrindex + 1;
                  let ifflagindex = false;
                  let comlennow = 0;
                  // 就是个打印
                  // if(j==0 && data1[i].children.length > 1){
                  //   console.log("changdu   ",i,arrindex,data1[i].children.length);
                  // }
                  // 如果是第一个子项，且子项个数大约 1 =》才需要合并单元格 ,所以记录位置和长度
                  // 还有一种是翻页之后，第一个在上一页，但是按规矩这一页也需要合并的
                  //满足第一要求，有子项
                  
                  if(j ==0 && filteredData3[i].children.length > 1){
                    // 然后需要看能否在一页内放下，即当前位置+子项长度是否大于pagesize
                    // 如果小于等于，就正常的
                    if(((arrindex-1 )% pageSize + filteredData3[i].children.length ) <= pageSize){
                      comlennow = filteredData3[i].children.length; //需要合并的长度
                      ifflagindex=true;
                      // console.log("meifen   ",data1[i].id,i,arrindex,data1[i].children.length,comlennow,);
                    }
                    // 如果大于，要处理第二页
                    else if(((arrindex-1 ) % pageSize + filteredData3[i].children.length) > pageSize ){
                      comlennow = pageSize - (arrindex-1 ) % pageSize ; //需要合并的长度,本页
                      ifflagindex=true;
                      //剩余的个数
                      last = filteredData3[i].children.length - comlennow;
                      // console.log("hebingde 1111",filteredData3[i].id,i,arrindex,filteredData3[i].children.length,comlennow,last);
                    }
                  }
                  // 或者是在当前页的第一个（跨页的合并）
                  else if( j !=0 && filteredData3[i].children.length > 1 && arrindex % pageSize ==1 && pageSize < arrindex){
                    // console.log("last   ",comlennow,last);
                    ifflagindex=true;
                    if(last <= pageSize){ // 清 0了，没有剩余单元格需要合并
                      comlennow = last; 
                      // console.log("wu l ");
                      last = 0;
                    }
                    else{ //还需要下一次
                      comlennow = pageSize ;
                      last = last - pageSize;
                    }
                  }
                  // 不需要合并的
                  else{
                    ifflagindex=false;
                    comlennow=0;
                  }
                  // console.log("ifflagindex",i,j,comlennow)
                  // 形成新的显示json
                  let rowjson ={
                    id:filteredData3[i].id,
                    minorversion:filteredData3[i].minorversion,
                    apart:filteredData3[i].apart,
                    scene:filteredData3[i].scene,
                    // bugid: (j==0 || (arrindex % pageSize ==1 && pageSize < arrindex))?data1[i].id:'',
                    bugid: filteredData3[i].id,//只有每组第一个赋值
                    // bugtitle:(j==0 || (arrindex % pageSize ==1 && pageSize < arrindex))?data1[i].bugtitle:'',
                    bugtitle: filteredData3[i].bugtitle,
                    linkapart:filteredData3[i].children[j].apart,
                    linkscene:filteredData3[i].children[j].scene,
                    linkbugid:filteredData3[i].children[j].bugid,
                    linkbugtitle:filteredData3[i].children[j].bugtitle,
                    ifcheck:filteredData3[i].children[j].ifcheck,
                    comlen:comlennow,
                    ifflag:ifflagindex,
                  }
                  datalist.push(rowjson);
                  comlennow = 0;
                  
                  // console.log("data",i,j,rowjson,"")
                  
                }
                // console.log("datalistindex",i,datalist)
                // console.log("11",rowjson,data1[i].tags)
              }
              // const filteredData = filterValues.length? datalist.filter((row) => filterValues.includes(row.apart)): datalist
              // // console.log("555555555555555555filteredData",filteredData)
              // const filteredData2 = filterValues2.length? filteredData.filter((row) => filterValues2.includes(row.linkapart)): filteredData
              // console.log("5555555555555555552222222",filteredData2)
              // const total = filteredData2.length;
              // const pageCount = Math.ceil(filteredData2.length / pageSize);
              const total = datalist.length;
              const pageCount = Math.ceil(datalist.length / pageSize)
              // console.log("pageCount: ",datalist);
              resolve({
                pageCount,
                // data: filteredData2,//文档错误，文档为 pagedData
                data: datalist,//文档错误，文档为 pagedData
                total
              })
            }
          }).catch((err) =>{
            console.log("errrrrr",err);
            ifshowloadingRef.value = false;
            if(err.response.status == 500)
              message.error( t("common.loaderr"), { duration: 5000 })
          });
        }
      })
    }
    function queryversion () {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var versionoptions = [];
        // 获取用户列表
        service2.get('/ScenarioAnalysis/get_versions').then(res=>{
          if(res.data.data == null){
            //错误处理
            // reject({ status: 500, msg: 'error' })
          }else{
            let data1 = [];
            if(selectedversionRef.value == "ten"){
              data1 = res.data.data.ten;
              // console.log("1111111111111111data1",data1)
            }else if(selectedversionRef.value == "eleven"){
              data1 = res.data.data.eleven;
            }
            //版本数组
            for(let i=0;i<data1.length;i++){
              versionoptions.push({label:data1[i],value:data1[i]});
              // console.log("1111111111versionoptions")
            }
            // console.log("1111111111111111111versionoptions",versionoptions);
            resolve({
              data: versionoptions,
            })
          }
        }).catch((err) =>{
          console.log("errrrrr",err);
          if(err.response.status == 500)
            message.error( t("common.loaderr"), { duration: 5000 })
        });;
        
      })
    }
    function querydetails (reportid = null,fatherid = null) {
      return new Promise((resolve) => {
        details = [] ;//清空再赋值，不然每次查询会累加
        // console.log("fathersonRef.value  vbanben!!!!!!!",fathersonRef.value);
        fathersonRef.value = [];
        //先保存下已出现的bug号
        if(reportid!=null)
          fathersonRef.value.push(reportid);
        if(fatherid!=null)
          fathersonRef.value.push(fatherid);
        // 默认是最新解决版本-1
        // if(minorversionRef.value==null){
        service2.get('/ScenarioAnalysis/byid/'+reportid+'/').then(res=>{ 
          if(res.data.code != 0){
            //错误处理
            // reject({ status: 500, msg: 'error' })
          }else{ 
            let data1 = res.data.data[0].children;
            // console.log("lennnnnnn",data1)
            for(let i=0;i<data1.length;i++){
              // 排除掉父子bug显示
              if(data1[i].bugid!=reportid && data1[i].bugid!= fatherid){
                // 形成新的显示json
                let rowjson ={
                  label: data1[i].apart+" : "+data1[i].bugid+" : "+data1[i].bugtitle ,
                  key: data1[i].bugid,
                  isLeaf: false,
                  // children:[],
                }
                // console.log("5555555555555555552222222",i,data1[i].bugid,rowjson)
                details.push(rowjson);
                fathersonRef.value.push(data1[i].bugid);
              }
            }
            // console.log("5555555555555555552222222",details)
            // console.log("pageCount: ",filteredData2.length,pageCount,total);
            resolve({
              data: details,//文档错误，文档为 pagedData
            })
          }
        }).catch((err) =>{
          console.log("errrrrr",err);
          if(err.response.status == 500)
            message.error( t("common.loaderr"), { duration: 5000 })
        });;
        
      })
    }
    onMounted(() => {
      if(selectedminorversionRef.value!=""){
        query(
        paginationReactive.page,
        paginationReactive.pageSize,
        apartReactive.filterOptionValues,
        linkapartReactive.filterOptionValues,
      ).then((data) => {
        dataRef.value = data.data
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false;
      })
      }
      queryversion().then((data) => {
        minorversionoptionsRef.value = data.data
        loadingRef.value = false
      })
    })
    // const treedataRef = ref(createData());
    const treedataRef = ref([]);
    const selectedversionRef = ref("eleven");
    const selectedminorversionRef =ref("");
    return {
      checkStrategy: ref("all"),
      cascade: ref(true),
      showModal: showModalRef,
      data: dataRef,
      treedata: treedataRef,
      selectedversion:selectedversionRef,
      // selectedversion: ref("ee38f637-4660-488e-a5d5-c7535eb7aab8"),
      versionoptions: ref([
        {
          label: "10",
          value: "ten"
        },{
          label: "11",
          value: "eleven"
        }
      ]),
      ifdisabled:ifdisabledRef,
      flitertype:flitertypeRef,
      minorversionoptions:minorversionoptionsRef,
      apart:apartReactive,
      linkapart:linkapartReactive,
      fatherson:fathersonRef,
      ifshow:ifshowRef,
      fliterword:fliterwordRef,
      flitertypeoptions: ref([
        {
          label: "包含",
          value: "1"
        },{
          label: "不含",
          value: "0"
        }
      ]),
      coloptions:coloptionsRef,
      colvalue:colvalueRef,
      // ifchecked:ifcheckedRef,
      rowClassName(row) {
        if (row.ifcheck==true) {
          return "over-checked";
        }else
          return "no-checked";
      },
      columns: createColumns({
        // analysisbugdetail(rowData) {
        //   ifshowRef.value = true;
        //   treedataRef.value =[];
        //   querydetails(rowData.linkbugid,rowData.bugid).then((data) => {
        //     // console.log("data send 22222 " ,data);
        //     if(data.data==''){
        //       // console.log("44444444444 ");
        //       message.error( t("function.errortips"), { duration: 5000 })
        //     }else{
        //       // console.log("555555");
        //       treedataRef.value = data.data;
        //       // console.log("send mail to22222 " ,ifshowRef.value, treedataRef.value,data);
        //     } 
        //     loadingRef.value = false;
        //     ifshowRef.value = false; 
        //   })
        //   showModalRef.value = true;
        //   // console.log("send mail to " + rowData.linkbugid);
        //   // dialog.info({
        //   //   // title: "脚本备注",
        //   //   title:t("perfor.script.comment"),
        //   //   content: () => rowData.comment,
        //   //   // action: () => "Action"
        //   //   positiveText: t("function.checktrue"),
        //   //   negativeText: t("function.checkfalse"),
        //   //   maskClosable: false,
        //   //   onMaskClick: () => {
        //   //     message.success( t("common.checktips"))
        //   //   },
        //   //   onPositiveClick: () => {
        //   //     // d.loading = true;
        //   //     // return new Promise((resolve) => {
        //   //     //   // 传已经check的请求
        //   //     // });
              
        //   //   }
        //   // });
        // },
        // checkbug(rowData){
        //   // console.log("send mail to " + rowData.ifchecked);
        // }
      }),
      minorversionchange(value,option){
        console.log("222222222222222",value,option,fliterwordRef.value,flitertypeRef.value);
        selectedminorversionRef.value = value;
        query(
          paginationReactive.page,
          paginationReactive.pageSize,
          apartReactive.filterOptionValues,
          linkapartReactive.filterOptionValues,
          fliterwordRef.value,
          flitertypeRef.value
        ).then((data) => {
          dataRef.value = data.data;
          console.log("222222222333333333333",data.data);
          paginationReactive.pageCount = data.pageCount
          paginationReactive.itemCount = data.total
          loadingRef.value = false;
        //   test(() =>{
        //   console.log("yes!")
        // })
        })
      },
      versionchange(){
        ifdisabledRef.value = true;
        queryversion().then((data) => {
          minorversionoptionsRef.value = data.data
          loadingRef.value = false;
          ifdisabledRef.value = false;
        })
      },
      flitertypechange(value,option){
        // console.log("222222222222222",value,option);
        flitertypeRef.value =  value;
      },
      flitersearch(){
        console.log("3333333333333333333",fliterwordRef.value,flitertypeRef.value);
        query(
          paginationReactive.page,
          paginationReactive.pageSize,
          apartReactive.filterOptionValues,
          linkapartReactive.filterOptionValues,
          fliterwordRef.value,
          flitertypeRef.value
        ).then((data) => {
          dataRef.value = data.data
          paginationReactive.pageCount = data.pageCount
          paginationReactive.itemCount = data.total
          loadingRef.value = false
        })
      },
      // // 选择展示列
      colvaluechange(value,i){
        coloptionsRef.value[i].ifchecked = value;
        // console.log("sel",value,i,coloptionsRef.value[i].ifchecked)
      },
      ifcolvalue(){
        // console.log("222222222222222",coloptionsRef.value);
        let falg = false;//默认都没选
        for(let i=0;i<coloptionsRef.value.length;i++){
          if(coloptionsRef.value[i].ifchecked == false){//只要有一个false，就要全选
            falg = true;
            break;
          }
        }
        if(falg == true){//都没选就全选
          for(let i=0;i<coloptionsRef.value.length;i++){
            coloptionsRef.value[i].ifchecked=true;
          }
        }
        else{
          for(let i=0;i<coloptionsRef.value.length;i++){
            coloptionsRef.value[i].ifchecked=false;
          }
        }
        // console.log("222222222222222", coloptionsRef.value);
      },
      flitercollick(){
        // console.log("colvalueRef",colvalueRef.value);
        // let flaglist = [false,false,false,false,false,false]; //默认未匹配
        let falg = false;//默认都没选
        for(let i=0;i<coloptionsRef.value.length;i++){
          if(coloptionsRef.value[i].ifchecked == true){//只要选择不是空的，就要重新显示
            falg = true;
            break;
          }
        }
        if(falg==true){//有值要过滤
          for(let i=0;i<coloptionsRef.value.length;i++){
            // if(flaglist[i]==true){ //要展示
            if(coloptionsRef.value[i].ifchecked == true){
              switch(i){
                case 0 :
                  if(createColumnslist.value[i].width ==1)
                    createColumnslist.value[i].width = 100;
                  break;
                case 1 :
                  if(createColumnslist.value[i].width ==1)
                    createColumnslist.value[i].width = 130;
                  break;
                case 2  :
                  if(createColumnslist.value[i].width ==1)
                    createColumnslist.value[i].width = 130;
                  break;
                case 3:
                  if(createColumnslist.value[i].width ==1)
                    createColumnslist.value[i].width = 450;
                  break;
                case 4 :
                  if(createColumnslist.value[i].width ==1)
                    createColumnslist.value[i].width = 100;
                  break;
                case 5  :
                  if(createColumnslist.value[i].width ==1)
                    createColumnslist.value[i].width = 130;
                  break;
                case 6  :
                  if(createColumnslist.value[i].width ==1)
                    createColumnslist.value[i].width = 130;
                  break;
                case 7:
                  if(createColumnslist.value[i].width ==1)
                    createColumnslist.value[i].width = 450;
                  break;

              }
            }else{//要隐藏
              // console.log("no",i);
              switch(i){
                case 0 :
                  createColumnslist.value[i].width = 1;
                  // console.log("no createColumnslist.value",i,createColumnslist.value[i]);
                  break;
                case 1  :
                  createColumnslist.value[i].width = 1;
                  // console.log("no createColumnslist.value",i,createColumnslist.value[i]);
                  break;
                case 2 :
                  // console.log("no qian createColumnslist.value",i,createColumnslist.value[i]);
                  createColumnslist.value[i].width = 1;
                  // console.log("no createColumnslist.value",i,createColumnslist.value[i]);
                  break;
                case 3  :
                  createColumnslist.value[i].width = 1;
                  // console.log("no createColumnslist.value",i,createColumnslist.value[i]);
                  break;
                case  4 :
                  createColumnslist.value[i].width = 1;
                  // console.log("no createColumnslist.value",i,createColumnslist.value[i]);
                  break;
                case 5:
                  // console.log("no qian createColumnslist.value",i,createColumnslist.value[i]);
                  createColumnslist.value[i].width = 1;
                  // console.log("no createColumnslist.value",i,createColumnslist.value[i]);
                  break;
                case  6 :
                  createColumnslist.value[i].width = 1;
                  break;
                case 7:
                  createColumnslist.value[i].width = 1;
                  break;
              }
            }
          }
        }else{
          message.error("需要选择至少一列！", { duration: 5000 })
        }
      },
      handleUpdateFilter (filters) {
        console.log("3333333333",filters)
        if (!loadingRef.value) {
          loadingRef.value = true
          const apartfilter = filters.apart || [];
          const linkapartfilter = filters.linkapart || [];
          query(
            paginationReactive.page,
            paginationReactive.pageSize,
            apartfilter,
            linkapartfilter,
            fliterwordRef.value,
            flitertypeRef.value
          ).then((data) => {
            apartReactive.filterOptionValues = apartfilter
            linkapartReactive.filterOptionValues = linkapartfilter
            console.log("3444444444",linkapartReactive.filterOptionValues)
            dataRef.value = data.data
            paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
            loadingRef.value = false
          })
        }
      },
      // 可调的
      pagination: paginationReactive,
      // checkedRowKeys: checkedRowKeysRef,
      handlePageChange (currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          console.log("data000:" ,apartReactive);
          query(
            currentPage,
            paginationReactive.pageSize,
            apartReactive.filterOptionValues,
            linkapartReactive.filterOptionValues,
            fliterwordRef.value,
            flitertypeRef.value
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
      expandedKeys: expandedKeysRef,
      checkedKeys: checkedKeysRef,
      defaultExpandedKeys: ref(["1"]),
      handleExpandedKeysChange(expandedKeys) {//展开项发生变化时的回调函数
        expandedKeysRef.value = expandedKeys;
        console.log("expandedKeysRef:",expandedKeysRef.value)
        //在此处写获取的接口
        // querydetails(rowData.linkbugid).then((data) => {
        //   treedataRef.value = data.data;
        //   console.log("send mail to22222 " + treedataRef.value,data);
        //   loadingRef.value = false;
        // })
      },
      handleCheckedKeysChange(checkedKeys) { //勾选项发生变化时的回调函数
        checkedKeysRef.value = checkedKeys;
        console.log("checkedKeysRef:",checkedKeysRef.value)
      },
      cleartreedata(){
        // console.log("guan l  555555555555555555555555555");
        expandedKeysRef.value = 
        treedataRef.value = [1]; 
      },
      handleLoad(node) {//加载数据的回调函数
        // console.log("触发加载辣！！！！！！！！！！！",node,expandedKeysRef.value)
        return new Promise((resolve) => {
          details = [] ;//清空再赋值，不然每次查询会累加
          // console.log("vbanben!!!!!!!",node);
          console.log("fathersonRef.value  vbanben!!!!!!!",fathersonRef.value);
          //先保存下已出现的bug号
          fathersonRef.value.push(node.key);
          // console.log("vbanben!!!!!!!",fathersonRef.value);
          // 默认是最新解决版本-1
          // if(minorversionRef.value==null){
          service2.get('/ScenarioAnalysis/byid/'+node.key+'/').then(res=>{
            let data1 = res.data.data[0].children;
            //异常处理
            // console.log("vbanben!!!!!!!",res.data);
            // // if(res.data.code==0){
            //   data1 = ;
            // // }
            // console.log("222lennnnnnn",data1,fathersonRef.value)
            for(let i=0;i<data1.length;i++){
              // 排除掉已经出现的bug的显示
              let flag = false;//默认是可以显示的
              for(let j=0;j<fathersonRef.value.length;j++){
                if(data1[i].bugid==fathersonRef.value[j]){
                  flag = true;
                  // console.log("4444444444444444444444",data1[i].bugid,fathersonRef.value[j])
                  break;
                }
              }
              // console.log("flag",flag);
              fathersonRef.value.push(data1[i].bugid);
              if(flag == false){
              // if(!flag){
                // 形成新的显示json
                let rowjson ={
                  label: data1[i].bugid+" "+data1[i].bugtitle+" "+data1[i].apart ,
                  key: data1[i].bugid,
                  isLeaf: false,
                }
                details.push(rowjson);
              }
            }
            // console.log("5555555555555555552222222",data1!=[],!details,details)
            if(details=='' && data1!=[]){
              message.info( t("function.nulltips"), { duration: 5000 });
              node.isLeaf = true;
              details = '';
            }else if(data1==[] || data1==''){
              // console.log("44444444444 ");
              message.error( t("function.errortips"), { duration: 5000 })
            }
            // console.log("node: ",node);
            setTimeout(
              () =>{
                node.children = details;
                resolve();
              },100
            )
            
          }); 
        })

        // });
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
:deep( .over-checked td){
  background-color: #eeeeee !important;
  color: #7a7d7c !important;
}
:deep( .over-checked td span span a){
  background-color: #eeeeee !important;
  color: #7a7d7c !important;
}
/* :deep(.over-read td) {
  color: #b2b3b2 !important;
  background-color: #f9f9f987 !important;
} */
 /* :deep .n-pagination-prefix{
  color:#5a5a5a;
 } */
 /* :deep .v-binder-follower-container .v-binder-follower-content .n-popover-shared--show-arrow {
  color: #fff !important;
 } */
</style>
