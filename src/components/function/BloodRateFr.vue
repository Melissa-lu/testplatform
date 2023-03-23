<template>
<n-space  style="height:100%">
  <!-- <span>.stringify(columns)}}</span> -->
  <!-- <n-form-item :label="$t('function.searchbugid')" style="margin:15px 0 -10px" label-placement="left">
    <n-input v-model:value="selectedfrbugid" @blur="bugidchange" :placeholder="$t('function.bugdemo')" clearable />
  </n-form-item> -->
  <n-form-item style="width: 150%;">
    <n-input-group style="width: 150%;">
      <n-input-group-label >{{$t('function.searchbugid')}}</n-input-group-label>
      <n-input :style="{ width: '100%' }" v-model:value="selectedfrbugid" clearable />
      <n-button type="primary" ghost @click="bugidchange" >
        {{$t('common.search')}}
      </n-button>
    </n-input-group>
  </n-form-item>
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
    :scroll-x="1000"
    @update:page="handlePageChange"
  />
   <!-- <n-dialog
    title="确认"
    content="你确定"
    negative-text="不确认"
    positive-text="确认"
    @positive-click="handlePositiveClick"
    @negative-click="handleNegativeClick"
  /> -->
  <!-- 页面加载的动画 -->
  <div v-show="ifshowloading" style="background-color: #fdfdfd;color: #fdfdfd;width: 94%;height: 70%;position: absolute;top: 228px;min-height: 300px;z-index: 999;">11
  <!-- <div v-show="ifshowloading"  style="background-color: #fdfdfd;color: #fdfdfd;width: 100%;height: 100%;position: absolute;top: 136px;">11 -->
    <n-spin  size="large" style="position: absolute;left: 47%;top: 60px;" />
  </div>
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
    <template #action>
      <div>
        <!-- <n-button @click="onPositiveClick" >11</n-button>
        <n-button @click="onNegativeClick">22</n-button> -->
      </div>
    </template>
  </n-modal>
</n-space>
</template>
<script>
// import axios from 'axios';
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRouter,useRoute  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useDialog,NDialogProvider,useMessage } from "naive-ui";
import { inject } from 'vue'
import { LogInOutline as LogInIcon } from "@vicons/ionicons5";
import service2 from '../../requests/axios2';

export default {
  name: "BloodRateFr",
  data() {
    return {
      fileobj:{}
    };
  },
  props: {
  },
  components: {
    LogInIcon
  },
  created() {
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const dialog = useDialog();
    const message = useMessage();
    var datalist = [];
    var details=[];
    const expandedKeysRef = ref([1]);
    const checkedKeysRef = ref([]);
    const versionoptionsRef= ref([]);
    const createColumns = ({
      checkbugdetail
    }) => {
      return [
        {
          title: t("function.bugid"),
          key: "bugid",
          width: 150,
          // rowSpan: (rowData, rowIndex) => (rowData === 0 ? 2 : 1),
          rowSpan: (rowData, rowIndex) => (rowData.ifflag==true?rowData.comlen:1),
        },
        // {
        //   title: t("function.bugtitle"),
        //   key: "bugtitle",
        //   width: 450,
        //   rowSpan: (rowData, rowIndex) => (rowData.ifflag==true?rowData.comlen:1),
        // },
        {
          title: t("function.linkbugid"),
          key: "linkbugid",
          width: 150,
					render(row) {
            return h(NButton, {
              size: "small",
              tag:"a",
              style:"width: 100px;",
              text:true,
              href:'https://work.fineres.com/browse/'+row.linkbugid,
              target:"_blank",
              // onClick: () => checkbugdetail(row)
            }, 
            { default: () => row.linkbugid });
          },
        },
        {
          title: t("function.linkbugtitle"),
          key: "linkbugtitle",
          width: 450,
        },
        {
          title:t("common.action"),
          key: "datails",
          // titleColSpan: 3,//合并 3列表头
          width: 140,
          fixed: "right",
          render(row) {
            return h(NButton, {
              size: "small",
              style:"width: 100px;",
              onClick: () => checkbugdetail(row)
            }, 
            { default: () => t("function.analyze") });
          }
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
      ];
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
    const ifshowloadingRef = ref(false);
    // 初始、切换数据加载
    function query (page, pageSize) {
      return new Promise((resolve) => {
        datalist = [] ;//清空再赋值，不然每次查询会累加
        // console.log("vbanben!!!!!!!",minorversionRef.value)
        // 默认是最新解决版本-1
        // if(minorversionRef.value==null){
       
				service2.get('/ScenarioAnalysis/byid/'+selectedfrbugidRef.value+'/').then(res=>{
          if(res.data.code != 0){
            //错误处理
            // reject({ status: 500, msg: 'error' })
            ifshowloadingRef.value = false;
            message.error( t("common.loadcodenot0"), { duration: 5000 })
          }else{
            let data1 = res.data.data;
            let arrindex = 0;
            // 接口返回值的循环，原生数组
            let i=0;
            let last =0;
            if(data1[i].children == ''){
                message.error( t("function.errortips"), { duration: 5000 })
            }
            // 每个数组元素项的关联bug数组
            for(let j=0;j<data1[i].children.length;j++){   
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
                if(j ==0 && data1[i].children.length > 1){
                // 然后需要看能否在一页内放下，即当前位置+子项长度是否大于pagesize
                // 如果小于等于，就正常的
                if((arrindex % pageSize + data1[i].children.length -1) <= pageSize){
                    comlennow = data1[i].children.length; //需要合并的长度
                    ifflagindex=true;
                    // console.log("meifen   ",i,arrindex,data1[i].children.length,comlennow,);
                }
                // 如果大于，要处理第二页
                else if((arrindex % pageSize + data1[i].children.length - 1) > pageSize ){
                    comlennow = pageSize - arrindex % pageSize +1; //需要合并的长度,本页
                    ifflagindex=true;
                    //剩余的个数
                    last = data1[i].children.length - comlennow;
                    // console.log("hebingde 1111",i,arrindex,data1[i].children.length,comlennow,last);
                }
                }
                // 或者是在当前页的第一个（跨页的合并）
                else if( j !=0 && data1[i].children.length > 1 && arrindex % pageSize ==1 && pageSize < arrindex){
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
                id:data1[i].id,
                // bugid: (j==0 || (arrindex % pageSize ==1 && pageSize < arrindex))?data1[i].id:'',
                bugid: data1[i].id,//只有每组第一个赋值
                linkapart:data1[i].children[j].apart,
                linkbugid:data1[i].children[j].bugid,
                linkbugtitle:data1[i].children[j].bugtitle,
                ifcheck:data1[i].children[j].ifcheck,
                comlen:comlennow,
                ifflag:ifflagindex,
                }
                datalist.push(rowjson);
                comlennow = 0;
                
                // console.log("data",i,j,rowjson,"")
                
            }
            // console.log("datalistindex",i,datalist)
            // console.log("11",rowjson,data1[i].tags)
            
            // console.log("5555555555555555552222222",filteredData2)
            const total = datalist.length;
            const pageCount = Math.ceil(datalist.length / pageSize)
            console.log("pageCount: ",datalist.length,pageCount,total);
            resolve({
                    pageCount,
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

      })
    }
    function querydetails (reportid = null,fatherid = null) {
      return new Promise((resolve) => {
        details = [] ;//清空再赋值，不然每次查询会累加
        // console.log("vbanben!!!!!!!",)
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
            console.log("lennnnnnn",data1)
            for(let i=0;i<data1.length;i++){
              // 排除掉父子bug显示
              if(data1[i].bugid!=reportid && data1[i].bugid!= fatherid){
                // 形成新的显示json
                let rowjson ={
                  label: data1[i].apart+" : "+data1[i].bugid+" : "+data1[i].bugtitle ,
                  key: data1[i].bugid,
                  isLeaf: false,
                }
                details.push(rowjson);
                fathersonRef.value.push(data1[i].bugid);
              }
            }
            console.log("5555555555555555552222222",details)
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
			if(selectedfrbugidRef.value != ""){
				query(
					paginationReactive.page,
					paginationReactive.pageSize,
				).then((data) => {
					dataRef.value = data.data
					paginationReactive.pageCount = data.pageCount
					paginationReactive.itemCount = data.total
					loadingRef.value = false
				})
			}
    //   queryversion().then((data) => {
    //     versionoptionsRef.value = data.data
    //     loadingRef.value = false
    //   })
    })
    // const treedataRef = ref(createData());
    const treedataRef = ref([]);
    const selectedfrbugidRef=ref("");
    return {
      router,route,
      checkStrategy: ref("all"),
      cascade: ref(true),
      showModal: showModalRef,
      data: dataRef,
      treedata: treedataRef,
      selectedfrbugid:selectedfrbugidRef,
      fatherson:fathersonRef,
      ifshow:ifshowRef,
      ifshowloading:ifshowloadingRef,
      columns: createColumns({
        checkbugdetail(rowData) {
          ifshowRef.value = true;
          treedataRef.value =[];
					querydetails(rowData.linkbugid,rowData.bugid).then((data) => {
            if(data.data==''){
              // console.log("44444444444 ");
              message.error( t("function.errortips"), { duration: 5000 })
            }else{
              // console.log("555555");
              treedataRef.value = data.data;
              // console.log("send mail to22222 " ,ifshowRef.value, treedataRef.value,data);
            } 
						// console.log("send mail to22222 " ,ifshowRef.value, treedataRef.value,data);
						loadingRef.value = false;
						ifshowRef.value = false;
						// console.log("send 22222 " ,ifshowRef.value);
					})
					showModalRef.value = true;
					console.log("send mail to " + rowData.linkbugid);
          // dialog.info({
          //   // title: "脚本备注",
          //   title:t("perfor.script.comment"),
          //   content: () => rowData.comment,
          //   // action: () => "Action"
          //   positiveText: t("function.checktrue"),
          //   negativeText: t("function.checkfalse"),
          //   maskClosable: false,
          //   onMaskClick: () => {
          //     message.success( t("common.checktips"))
          //   },
          //   onPositiveClick: () => {
          //     // d.loading = true;
          //     // return new Promise((resolve) => {
          //     //   // 传已经check的请求
          //     // });
              
          //   }
          // });
        },
      }),
      bugidchange(value){
        console.log("222222222222222",value,selectedfrbugidRef.value);
        ifshowloadingRef.value = true;
				if(selectedfrbugidRef.value == ""){
					message.error( t("function.notputnull"), { duration: 3000 });
					ifshowloadingRef.value = false;
				}
				else if(selectedfrbugidRef.value.indexOf("bi-")!=-1 || selectedfrbugidRef.value.indexOf("BI-")!=-1){
					message.error( t("function.startfrerr"), { duration: 3000 });
					ifshowloadingRef.value = false;
				}
				else{
					query(
						paginationReactive.page,
						paginationReactive.pageSize,
					).then((data) => {
						dataRef.value = data.data
						ifshowloadingRef.value = false;
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
        return new Promise((resolve) => {
          details = [] ;//清空再赋值，不然每次查询会累加
          // console.log("vbanben!!!!!!!",node);
          //先保存下已出现的bug号
          fathersonRef.value.push(node.key);
          console.log("vbanben!!!!!!!",fathersonRef.value);
          // 默认是最新解决版本-1
          // if(minorversionRef.value==null){
          service2.get('/ScenarioAnalysis/byid/'+node.key+'/').then(res=>{
            let data1 = res.data.data[0].children;
            // //异常处理
            // if(res.data.code==0){
            //   data1 = res.data.data[0].children;
            // }
            // console.log("2lennnnnnn",data1)
            for(let i=0;i<data1.length;i++){
              // 排除掉已经出现的bug的显示
              let flag = false;//默认是可以显示的
              for(let j=0;j<fathersonRef.value.length;j++){
                if(data1[i].bugid==fathersonRef.value[j]){
                  flag = true;
                  break;
                }
              }
              fathersonRef.value.push(data1[i].bugid);
              if(flag == false){
                  // 形成新的显示json
                  let rowjson ={
                    label: data1[i].bugid+" "+data1[i].bugtitle+" "+data1[i].apart ,
                    key: data1[i].bugid,
                    isLeaf: false,
                  }
                  details.push(rowjson);
                }
            }
            console.log("5555555555555555552222222",details)
            if(details=='' && data1!=[]){
              message.info( t("function.nulltips"));
            }else if(data1==[] || data1==''){
              // console.log("44444444444 ");
              message.error( t("function.errortips"), { duration: 5000 })
            }
            // console.log("pageCount: ",filteredData2.length,pageCount,total);
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

</style>
