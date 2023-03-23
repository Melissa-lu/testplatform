<template>
	<n-space vertical >
		<n-card  :bordered="false">
      <div class="col-5">
        <!--使用draggable组件-->
        <div class="dragList">
          <n-layout has-sider  >
            <n-layout-sider :width="280" content-style="background-color:#eaf3ee;">
              <!-- 用例选择 -->
              <n-layout-header style="text-align:center;background-color:#eaf3ee;"><h3>{{$t("perfor.task.selectitem")}}</h3></n-layout-header>
              <n-layout-content content-style="background-color:#eaf3ee;text-align:center;max-height: 500px;" >
                <!-- <div v-if="jmxlist.length>8" class="forheight" :style="{'--height':jmxlist.length,}">aaa{{jmxlist.length}}</div> -->
                <!--  @end="end1" -->
                <Draggable :list="model.select_list" item-key="id"  :sort='false' class="dragAreafrom" ghost-class="ghost" chosen-class="chosenClass"
                  :animation="300" :touch-start-threshold="10" :fallback-tolerance="10" :force-fallback="true"
                  :group="{name: 'article',pull:'clone',put: false, }" > 
                  <template #item="{ element }"  >
                    <div class="list-jmx">
                      <n-tooltip placement="bottom" trigger="hover" :style="{ height: 'auto' }">
                        <template #trigger>
                          <n-button text style="overflow: hidden;width: 87%;"> {{element.name}} </n-button>
                        </template>
                        <span> {{element.name}}</span>
                      </n-tooltip>
                    </div>
                  </template>
                </Draggable>
              </n-layout-content>
            </n-layout-sider>
            <n-layout>
              <n-layout-header class="queuetitle"><h2>{{$t("perfor.task.queue")}}</h2></n-layout-header>
              <n-layout-header class="queuetips" >{{$t("perfor.task.queuetips")}}</n-layout-header>
              <n-layout-header class="deleteall" >
                <n-button type="error" size="small" tertiary  @click="handleDelall" style="float:right;height: 36px;width: 105px;">
                  <template #icon><n-icon><delete /></n-icon></template>
                  {{ $t("perfor.task.deletequeue") }}
                </n-button>
              </n-layout-header>
              <!-- 实际待形成队列 -->
              <n-layout-content content-style="padding: 24px;min-height: 400px;max-height:500px;border: 1px dashed #aec9ba;margin:0 20px;">
                <!-- @start="start2" @end="end2" -->
                <Draggable :list="queue" item-key="id" :disabled="false"  class="dragArea2"  ghost-class="ghost" chosen-class="chosenClass"
                  :group="{name: 'article',pull:'',put: true, }"  :force-fallback="true" :scroll="true" :scroll-fensitivity="20"
                  animation="300" :touch-start-threshold="6" :fallback-tolerance="6" :onSort="onSortQueue">
                  <template #item="{ element,index }" >
                    <div class="list-select">
                      <div v-if="(element.name?(element.name.indexOf('：') ==-1):false)" style="width: 35px;float: left;"><n-icon><IosFolderOpen /></n-icon></div>
                      <n-tooltip placement="bottom" trigger="hover" :style="{ height: 'auto' }">
                        <template #trigger>
                          <n-button text :class="[(element.name?(element.name.indexOf('：') ==-1):false)?'isjmx':'isnotjmx','list-complete-item-handle']"> {{element.name}} </n-button>
                        </template>
                        <span> {{element.fullname}}</span>
                      </n-tooltip>
                      <n-button type="error" size="small" quaternary @click="handleDel(index, element.id)" style="float:right;height: 36px;width: 35px;">
                        <template #icon><n-icon><delete /></n-icon></template>
                      </n-button>
                    </div>
                  </template>
                </Draggable>
              </n-layout-content>
            </n-layout>
            <n-layout-sider :width="370" sider-placement="right" content-style="background-color:#eaf3ee;">  
              <!-- 重启等组件 -->
              <n-layout-header style="text-align:center;background-color:#eaf3ee;"><h3>{{$t("perfor.task.addzujian")}}</h3></n-layout-header>
              <!-- 添加部分 -->
              <n-layout-content content-style="background-color:#eaf3ee;" >
                <n-button-group size="small" style="margin:0 5% 20px">
                  <!-- 添加重启组件的按钮 -->
                  <n-button type="primary" round @click="addrestart">
                    <template #icon>
                      <n-icon><add /></n-icon>
                    </template>{{$t("version.enginemanage.tomcatrestart")}}
                  </n-button>
                  <!-- 添加换包组件的按钮 -->
                  <n-button type="primary" @click="addreplacejar">
                    <template #icon>
                      <n-icon><add /></n-icon>
                    </template>{{$t("perfor.task.replacejar")}}
                  </n-button>
                  <!-- 添加关闭组件的按钮 -->
                  <n-button type="primary" round @click="addstop">
                    <template #icon>
                      <n-icon><add /></n-icon>
                    </template>{{$t("common.stopp")}}
                  </n-button>
                  <!-- 添加入库组件的按钮 -->
                  <n-button type="primary" round @click="addsql">
                    <template #icon>
                      <n-icon><add /></n-icon>
                    </template>{{$t("perfor.task.insertdb")}}
                  </n-button>
                </n-button-group>
                <n-button-group size="small" style="margin:0 5% 20px">
                  <!-- 添加等待组件的按钮 -->
                  <n-button type="primary" round @click="addtime" >
                    <template #icon>
                      <n-icon><add /></n-icon>
                    </template>{{$t("perfor.task.waittime")}}
                  </n-button>
                  <!-- 添加清洗组件的按钮 -->
                  <n-button type="primary" round @click="addfliter">
                      <template #icon>
                        <n-icon><add /></n-icon>
                      </template>{{$t("perfor.task.cleardata")}}
                  </n-button>
                </n-button-group>
              </n-layout-content>
              <!-- 罗列部分 -->
              <n-layout-content content-style="background-color:#eaf3ee;max-height: 450px;" >
                <!--  @end="end1" -->
                <Draggable :list="zujianlist" item-key="id"  :sort='false'  class="dragAreafrom" ghost-class="ghost" chosen-class="chosenClass"
                  :animation="300" :touch-start-threshold="10" :fallback-tolerance="10" :force-fallback="true"
                  :group="{name: 'article',pull:'clone',put: false, }"   >
                  <template #item="{ element,index }"  >
                    <div class="list-top">
                      <n-tooltip placement="bottom" trigger="hover" :style="{ height: 'auto' }">
                        <template #trigger>
                          <n-button text style="overflow: hidden;width: 78%;"> {{element.name}} </n-button>
                        </template>
                        <span> {{element.fullname}}</span>
                      </n-tooltip>
                      <n-button type="error" @click="handleDeladd(index,element.id)"  size="tiny" quaternary style="float:right;height:50px;">
                        <template #icon>
                          <n-icon><delete/></n-icon>
                        </template>
                      </n-button>
                      <n-button  @click="handleeditadd(index,element.id)"  size="tiny" quaternary style="float:right;height:50px;">
                        <template #icon>
                          <n-icon><EditNoteRound/></n-icon>
                        </template>
                      </n-button>
                    </div>
                    
                  </template>
                </Draggable>
              </n-layout-content>           
              <!-- <div style="width:20px;color:#eaf3ee;">1</div> -->
            </n-layout-sider>
          </n-layout>
        </div>
      </div>
    </n-card>
    <TestTaskEditS5Model @loadjar="loadjar" @onNegativeClick="onNegativeClick" @addQueueComponent="addQueueComponent" 
    :showModal="showModal" :showModaltomcat="showModaltomcat" :showModaltomcatstop="showModaltomcatstop"
      :showModaltomcatjar="showModaltomcatjar" :showModalsql="showModalsql" :showModaltime="showModaltime"  :showModalfilter="showModalfilter" :addmodel="addmodel" 
      :tomcatoptions="tomcatoptions" :filteroptions="filteroptions" :productoptions="productoptions" :branchoptions="branchoptions" 
      :sqloptions="sqloptions" :ifswiftlist="ifswiftlist" :ifversionlist="ifversionlist" :jaroptions="jaroptions"></TestTaskEditS5Model>
	</n-space>
</template>
<script>
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRouter,useRoute  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useMessage,NInput ,NInputNumber } from "naive-ui";
import { MdArrowRoundBack, MdArrowRoundForward,IosFolderOpen } from "@vicons/ionicons4";
import service from '../../requests/axios';
import service3 from '../../requests/axios3';
import Draggable from 'vuedraggable'
import { LogInOutline as LogInIcon ,Add} from "@vicons/ionicons5";
import { EditNoteRound} from "@vicons/material"
import { Delete} from "@vicons/carbon";
import TestTaskEditS5Model from './TestTaskEditS5Model'

export default {
  name: "TestTaskEditStep5",
  data() {
    return {
      fileobj:{},
      idkey:"",
    };
  },
  props:['zujianlist','queue','tomcatoptions','filteroptions','productoptions','branchoptions','sqloptions','ifswiftlist','ifversionlist'],
  components: {
    TestTaskEditS5Model,
    LogInIcon,
    Draggable,
    LogInIcon,Add,Delete,MdArrowRoundBack,MdArrowRoundForward,EditNoteRound,IosFolderOpen
  },
  created() {
    // console.log("1222222",formRef,modelss)
    // console.log(this.$route.name,this.$route.params.tomcatName);
  },
  setup() {
		const { t } = useI18n();
    const message = useMessage();
    const jaroptionsRef = ref([]);
    const showModalRef = ref(false);
    const showModalsqlRef = ref(false);
    const showModaltimeRef = ref(false);
    const showModalfilterRef = ref(false);
    const showModaltomcatRef = ref(false);
    const showModaltomcatjarRef = ref(false);
		const model = ref({
        name: "",
        comment:"",
        tags:"",
        typeselectvalue:"1",
        ifversion:true,//定时换包-是否指定换包的版本
        jar:{
          product:"",
          branch:"",
          ifswift:false,
          startat:undefined,
          stopat:undefined,
          selectjar:"",
          tomcatid:""
        },
        global:[{
          pname:'',pvalue:'',enabled:true
        }],
        globalj:{
          ifjstack:false,
          ifdump:false,
          jstackrate:0,
          selectedserverid:"",
          selectedtomcatid:"",
        },
        select_list:[
          // {
          //   id:"",
          //   name:"",
          //   typevalue:1,//表明是脚本
          //   parameter:[{pname:'',pvalue:'',enabled:true}],
          //   ifjstack:false,
          //   ifdump:false,
          //   jstackrate:0,
          //   selectedserverid:""//压测机选择
          //   selectedtomcatid:"",
          // }
        ],
        plist: [{ pname: "",pvalue:"",enabled:false }],
        selectedserverid:[],
        circlecount:0,
        cornstr:"",
        auto_enabled:true,
    });
    const addmodel = ref({
      name:"",
      selectsql:"",
      selecttomcat:"",//重启的
      selecttomcat2:"",//关闭的
      table_name:"",
      jar_suffix:"",
      filter_name:"",//过滤组件
      wait_time:0,//等待时间
      typevalue:0,//区分是否编辑，默认新建就是0
      index:-1,//如果是编辑，需要记录数组中第几个的位置信息，新建是-1
      ifversion:true,//是否指定换包的版本
      jar:{
        product:"",
        branch:"",
        ifswift:false,
        startat:undefined,
        stopat:undefined,
        selectjar:"",
        tomcatid:""
      }
    });
    function queryjar (data) {
      return new Promise((resolve) => {
        // datalist = [] ;//清空再赋值，不然每次查询会累加   
        var jaroptions = [];
        // // console.log("notifyoptionsRef",formRef.value.model.jar.startat);
        let starttime = new Date(Number(data.startat));
        let stoptime = new Date(Number(data.stopat));
        let ys=starttime.getFullYear()+ '-';
        let ms=(starttime.getMonth()+1 < 10 ? '0' + (starttime.getMonth() + 1) : starttime.getMonth() + 1) + '-';
        let ds=starttime.getDate()<10 ? '0' + starttime.getDate():starttime.getDate();
        let yp=stoptime.getFullYear()+ '-';
        let mp=(stoptime.getMonth()+1 < 10 ? '0' + (stoptime.getMonth() + 1) : stoptime.getMonth() + 1) + '-';
        let dp=stoptime.getDate()<10 ? '0' + stoptime.getDate():stoptime.getDate();
        let startt = ys+ms+ds;
        let stopt = yp+mp+dp;
        // // console.log("notifyoptionsRef3333",starttime,ms,startt);
        // start=2022-08-01&end=2022-08-11&prefix=finereport%2F11.0%2Fstable
        service3.get('/jar/list?op=date&start='+startt +'&end='+ stopt +'&prefix='+data.product+'/'+ data.branch).then(res=>{
          let data1 = res.data.data;
          if(data1!=null){
            for(let i=0;i<data1.length;i++){
              jaroptions.push({label:data1[i],value:data1[i]});
            }
          }
          resolve({
            data: jaroptions,
          })
        });
        
      })
    }
    return {
			t,
      message,
      model,
      addmodel,
      selectInstRef:ref(null),
      queryjar,
      jaroptions:jaroptionsRef,
      showModal: showModalRef,
      showModaltomcat: showModaltomcatRef,
      showModaltomcatjar:showModaltomcatjarRef ,
      showModalsql: showModalsqlRef,
      showModaltime: showModaltimeRef,
      showModalfilter:showModalfilterRef,
      rowKey: (row) => row.id,
		}
	},
	watch: {
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      this.getTest();
      // // console.log("1222222",this.modelss,this.$route.params.taskId);
    })
  },
  computed: {

  },
  methods: {
		getTest() {
			this.model = this.$parent.model;
			// console.log("TestTaskEditStep2",this.models,this.datas,this.defaultselectjmxs);
    },
    handleDeladd (index,id)  {
      // for(let i=0;i<zujianlistRef.value.length;i++){
      //   if(zujianlistRef.value[i].id==id){
      //     zujianlistRef.value.splice(i, 1);
      //     break;
      //   }
      // }
      // 性能更好
      // console.log("zujianlistRef",this.zujianlist[index]);
      this.zujianlist.splice(index,1);
    },
    handleDel (index, id) {
      // console.log("***********queue",index,this.queue[index],this.queue);
      this.queue.splice(index,1);
      // console.log("***********queue hou",this.queue);
      // console.log("5555555555555",index,queueRef.value);
    },
    handleDelall(){
      this.queue.splice(0,this.queue.length);
      console.log("***********queue",this.queue);
    },
    onSortQueue (e) {
      console.log("*************",this.queue);
      // state.message = JSON.stringify(state.modules.arr2);
    },
    readdmodel(){
      this.addmodel={
        name:"",
        selectsql:"",
        selecttomcat:"",//重启的
        selecttomcat2:"",//关闭的
        table_name:"",
        jar_suffix:"",
        filter_name:"",//过滤组件
        typevalue:0,//区分是否编辑，默认新建就是0
        index:-1,//如果是编辑，需要记录数组中第几个的位置信息，新建是-1
        ifversion:true,//是否指定换包的版本
        jar:{
          product:"",
          branch:"",
          ifswift:false,
          startat:undefined,
          stopat:undefined,
          selectjar:"",
          tomcatid:""
        }
      };
      this.showModal = true;
      this.showModaltime = false;
      this.showModalfilter=false;
      this.showModalsql = false;
      this.showModaltomcat = false;
      this.showModaltomcatjar = false;
      this.showModaltomcatstop = false;
    },
    addrestart(){
      this.readdmodel();
      this.showModaltomcat = true;
    },
    addstop(){
      this.readdmodel();
      this.showModaltomcatstop = true;
      // // console.log("tomcat222",showModalsqlRef.value,showModaltomcatRef.value);
    },
    addsql(){
      this.readdmodel();
      this.showModalsql = true;
    },
    addreplacejar(){
      this.readdmodel();
      this.showModaltomcatjar = true;
    },
    // 添加数据清洗组件
    addfliter(){
      this.readdmodel();
      this.showModalfilter=true;
      // // console.log("sql2222",sqloptionsRef.value);
    },
    //添加等待时间组件
    addtime(){
      this.readdmodel();
      this.showModaltime = true;
    },
    // 添加组件大类的取消操作
    onNegativeClick(){
      this.showModal = false;
      this.showModalsql = false;
      this.showModaltime = false;
      this.showModalfilter=false;
      this.showModaltomcat = false;
      this.showModaltomcatjar = false;
      this.showModaltomcatstop = false;
    },
    // 编辑组件
    handleeditadd(index,id){
      // 需要先区分是哪种，然后再调起来遮罩层改
      // console.log("zujianlistRef.value[index]",zujianlistRef.value[index]);
      this.showModalsql = false;
      this.showModaltime = false;
      this.showModalfilter=false;
      this.showModaltomcat = false;
      this.showModaltomcatjar = false;
      this.showModaltomcatstop = false;
      this.addmodel.typevalue = this.zujianlist[index].typevalue;
      this.addmodel.index = index;//新建这边就是-1
      switch(this.zujianlist[index].typevalue){
        case 2://数据清洗
          this.showModal=true;
          this.showModalfilter=true;
          this.addmodel.filter_name = this.zujianlist[index].filter;
          // this.message.info(this.$t("perfor.task.nootherfliter"), { duration: 3000 });
          break;
        case 3://入库
          this.showModal = true;
          this.showModalsql = true;
          this.addmodel.table_name = this.zujianlist[index].table_name;
          this.addmodel.selectsql = this.zujianlist[index].id; 
          this.addmodel.jar_suffix= this.zujianlist[index].jar_suffix;
          break;
        case 4:
          // 重启
          this.showModal = true;
          if(this.zujianlist[index].op ==3){
            this.showModaltomcat = true;
            this.addmodel.selecttomcat = this.zujianlist[index].id;
          }
          // 关闭
          else if(this.zujianlist[index].op ==2){
            this.showModaltomcatstop = true;
            this.addmodel.selecttomcat2 = this.zujianlist[index].id;
          }
          // 换包
          else if(this.zujianlist[index].op == 4){
            this.showModaltomcatjar = true;
            this.addmodel.jar.tomcatid = this.zujianlist[index].id;
            this.addmodel.jar.branch = this.zujianlist[index].params.prefix.split("/")[2];
            this.addmodel.jar.product = this.zujianlist[index].params.prefix.split("/")[0]+"/"+this.zujianlist[index].params.prefix.split("/")[1];
            this.addmodel.jar.ifswift = this.zujianlist[index].params.exclude_jar=="swift"?true:false;
            this.addmodel.ifversion = this.zujianlist[index].params.jartime!=""?true:false;
            this.addmodel.jar.selectjar = this.zujianlist[index].params.jartime;
          }
          break;
        case 7:
          //waittime组件
          this.showModal = true;
          this.showModaltime = true;
          this.addmodel.wait_time = this.zujianlist[index].id;
      }
    },
    // 添加组件大类的确认操作
    addQueueComponent(){
      // // console.log("selectsql:",this.addmodel,addformRef.value.model);
      let ii =  this.addmodel.index;//-1 是新建
      // // console.log("ii11111111111111111:",ii,this.addmodel.typevalue);
      // 数据库入库组件
      if(this.showModalsql){
        service.get('/loadtest/connections/'+this.addmodel.selectsql).then(res=>{
          let data1 = res.data.data;
          let newjson ={
            id:this.addmodel.selectsql,
            name:"入库-"+data1.name+"："+this.addmodel.table_name,
            fullname:"入库-"+data1.name+"："+this.addmodel.table_name+"："+this.addmodel.jar_suffix,
            typevalue:3,
            table_name:this.addmodel.table_name,
            jar_suffix :this.addmodel.jar_suffix,
          };
          //判断是否有重复的
          let flag =true; 
          for(let i=0;i<this.zujianlist.length;i++){
            if(this.zujianlist[i].id ==this.addmodel.selectsql ){
              if(this.zujianlist[i].table_name == this.addmodel.table_name ){
                if(this.zujianlist[i].jar_suffix == this.addmodel.jar_suffix ){
                  if(this.addmodel.typevalue!=0){//如果不是编辑且不是对应的那个的话，就不能重复
                    // // console.log("chongful",ii,i,this.addmodel.typevalue);
                    if(i!=ii){// 不是编辑的这个
                      flag =false;
                      this.message.error( this.$t("perfor.task.zujianerrtips"));
                      // console.log("message",ii,i,this.addmodel.typevalue);
                      break;
                    }
                  }else{//新建
                    flag =false;
                    this.message.error( this.$t("perfor.task.zujianerrtips"));
                    // console.log("message",ii,i,this.addmodel.typevalue);
                    break;
                  }
                }
              }
            }
          };
          if(flag){
            //编辑
            if(this.addmodel.typevalue!=0){
              this.zujianlist[ii] = newjson;
              this.message.success( this.$t("common.updatesuc"));
            }
            //新加
            else{
              this.zujianlist.push(newjson);
              this.message.success( this.$t("common.createsuc"));
            }
          }
          this.showModalsql = false;
        });
      }
      // 工程重启组件
      else if(this.showModaltomcat){
        // // console.log("selectsql:",addformRef.value);
        service.get('/loadtest/project/'+this.addmodel.selecttomcat).then(res=>{
          let data1 = res.data.data;
          let newjson={
            id:this.addmodel.selecttomcat,
            name:"重启："+data1.name,
            fullname:"重启："+data1.name,
            typevalue:4,
            op:3
          };
          //判断是否有重复的
          let flag =true; 
          for(let i=0;i<this.zujianlist.length;i++){
            if(this.zujianlist[i].id == this.addmodel.selecttomcat && this.zujianlist[i].op==3){
              if(this.addmodel.typevalue!=0){//如果不是编辑且不是对应的那个的话，就不能重复
                if(i!=ii){// 不是编辑的这个
                  flag =false;
                  this.message.error( this.$t("perfor.task.zujianerrtips"));
                  // console.log("message1",ii,i,this.addmodel.typevalue);
                  // console.log("zujianlistRef",this.zujianlist[i].id,this.addmodel.selecttomcat)
                  break;
                }
              }else{//新建
                flag =false;
                this.message.error( this.$t("perfor.task.zujianerrtips"));
                // console.log("message2",ii,i,this.addmodel.typevalue);
                // console.log("zujianlistRef",this.zujianlist[i].id,this.addmodel.selecttomcat)
                break;
              }
            }
          };
          if(flag){
            //编辑
            if(this.addmodel.typevalue!=0){
              this.zujianlist[ii] = newjson;
              this.message.success( this.$t("common.updatesuc"));
              // console.log("zujianlistRefdeitsucc",this.zujianlist[ii])
            }
            //新加
            else{
              this.zujianlist.push(newjson);
              this.message.success( this.$t("common.createsuc"));
            }
          }
          this.showModaltomcat = false;
        });
      }
      // 工程关闭组件
      else if(this.showModaltomcatstop){
        // // console.log("selectsql:",addformRef.value);
        service.get('/loadtest/project/'+this.addmodel.selecttomcat2).then(res=>{
          let data1 = res.data.data;
          let newjson={
            id:this.addmodel.selecttomcat2,
            name:"关闭："+data1.name,
            fullname:"关闭："+data1.name,
            typevalue:4,
            op:2
          };
          //判断是否有重复的
          let flag =true; 
          for(let i=0;i<this.zujianlist.length;i++){
            if(this.zujianlist[i].id == this.addmodel.selecttomcat2 && this.zujianlist[i].op==2){
              if(this.addmodel.typevalue!=0){//如果不是编辑且不是对应的那个的话，就不能重复
                if(i!=ii){// 不是编辑的这个
                  flag =false;
                  this.message.error( this.$t("perfor.task.zujianerrtips"));
                  break;
                }
              }else{//新建
                flag =false;
                this.message.error( this.$t("perfor.task.zujianerrtips"));
                break;
              }
            }
          };
          if(flag){
            //编辑
            if(this.addmodel.typevalue!=0){
              this.zujianlist[ii] = newjson;
              this.message.success( this.$t("common.updatesuc"));
              // console.log("zujianlistRefdeitsucc",this.zujianlist[ii])
            }
            //新加
            else{
              this.zujianlist.push(newjson);
              this.message.success( this.$t("common.createsuc"));
            }
          }
          this.showModaltomcat2 = false;
        });
      }
      // 工程换包组件
      else if(this.showModaltomcatjar){
        service.get('/loadtest/project/'+this.addmodel.jar.tomcatid).then(res=>{
          let data1 = res.data.data;
          let newjson={
            id:this.addmodel.jar.tomcatid,
            name:"换包："+data1.name+":"+this.addmodel.jar.branch,
            fullname:data1.name+":"+this.addmodel.jar.branch+":"+this.addmodel.jar.selectjar+(this.addmodel.jar.ifswift?":swift":""),
            params:{
              jartime:this.addmodel.jar.selectjar,
              prefix:this.addmodel.jar.product+"/"+this.addmodel.jar.branch,
              exclude_jar:(this.addmodel.jar.ifswift?"swift":"")
            },
            typevalue:4,
            op:4
          };
          //判断是否有重复的
          let flag =true; 
          for(let i=0;i<this.zujianlist.length;i++){
            if(this.zujianlist[i].id == this.addmodel.selecttomcat && this.zujianlist[i].op==4){
              // // console.log("selectjar:",this.zujianlist[i]);
              // 这边就对比 jartime 和 swift了
              if(this.zujianlist[i].params.jartime == this.addmodel.jar.selectjar && this.zujianlist[i].params.exclude_jar == (this.addmodel.jar.ifswift?"swift":"") ) {
                if(this.addmodel.typevalue!=0){//如果不是编辑且不是对应的那个的话，就不能重复
                  if(i!=ii){// 不是编辑的这个
                    flag =false;
                    this.message.error( this.$t("perfor.task.zujianerrtips"));
                    // // console.log("message1",ii,i,this.addmodel.typevalue);
                    // // console.log("zujianlistRef",this.zujianlist[i].id,this.addmodel.selecttomcat)
                    break;
                  }
                }else{//新建
                  flag =false;
                  this.message.error( this.$t("perfor.task.zujianerrtips"));
                  // // console.log("message2",ii,i,this.addmodel.typevalue);
                  // // console.log("zujianlistRef",this.zujianlist[i].id,this.addmodel.selecttomcat)
                  break;
                }
              }
            }
          };
          if(flag){
            //编辑
            if(this.addmodel.typevalue!=0){
              this.zujianlist[ii] = newjson;
              this.message.success( this.$t("common.updatesuc"));
              // console.log("zujianlistRefdeitsucc",this.zujianlist[ii])
            }
            //新加
            else{
              this.zujianlist.push(newjson);
              this.message.success( this.$t("common.createsuc"));
            }
          }
          this.showModaltomcatjar = false;
        });
      }
      // 等待时间组件
      else if(this.showModaltime){
        let newjson ={
          id:this.addmodel.wait_time,
          name:"等待："+this.addmodel.wait_time+"秒",
          fullname:"等待："+this.addmodel.wait_time+"秒",
          typevalue:7,
        };
        //判断是否有重复的
        let flag =true; 
        for(let i=0;i<this.zujianlist.length;i++){
          if(this.zujianlist[i].wait_time == this.addmodel.wait_time ){
            if(this.addmodel.typevalue!=0){//如果不是编辑且不是对应的那个的话，就不能重复
              // // console.log("chongful",ii,i,this.addmodel.typevalue);
              if(i!=ii){// 不是编辑的这个
                flag =false;
                this.message.error( this.$t("perfor.task.zujianerrtips"));
                // console.log("message",ii,i,this.addmodel.typevalue);
                break;
              }
            }else{//新建
              flag =false;
              this.message.error( this.$t("perfor.task.zujianerrtips"));
              // console.log("message",ii,i,this.addmodel.typevalue);
              break;
            }
          }
        };
        if(flag){
          //编辑
          if(this.addmodel.typevalue!=0){
            this.zujianlist[ii] = newjson;
            // this.message.success( t("common.updatesuc"));
          }
          //新加
          else{
            this.zujianlist.push(newjson);
            // this.message.success( t("common.createsuc"));
          }
        }
        this.showModaltime = false;
      }
      else if(this.showModalfilter){
        let newjson={
          id:this.addmodel.filter_name,
          name:"过滤名称："+this.addmodel.filter_name,
          fullname:"过滤名称："+this.addmodel.filter_name,
          typevalue:2,
        };
        //判断是否有重复的
        let flag =true; 
        for(let i=0;i<this.zujianlist.length;i++){
          if(this.zujianlist[i].id ==this.addmodel.filter_name ){
            if(this.addmodel.typevalue!=0){//如果不是编辑且不是对应的那个的话，就不能重复
              // // console.log("chongful",ii,i,this.addmodel.typevalue);
              if(i!=ii){// 不是编辑的这个
                flag =false;
                this.message.error( this.$t("perfor.task.zujianerrtips"));
                // console.log("message",ii,i,this.addmodel.typevalue);
                break;
              }
            }else{//新建
              flag =false;
              this.message.error( this.$t("perfor.task.zujianerrtips"));
              // console.log("message",ii,i,this.addmodel.typevalue);
              break;
            }
          }
        };
        if(flag){
          //编辑
          if(this.addmodel.typevalue!=0){
            this.zujianlist[ii] = newjson;
            this.message.success( this.$t("common.updatesuc"));
            // console.log("zujianlistRefdeitsucc",this.zujianlist[ii])
          }
          //新加
          else{
            this.zujianlist.push(newjson);
            this.message.success( this.$t("common.createsuc"));
          }
        }
        this.showModalfilter = false;
      }
      this.showModal = false;
      console.log("ii11111111111111111:",ii,this.zujianlist);
    },
    loadjar(num){
      console.log("TestTaskEditStep5",num);
      this.queryjar(this.addmodel.jar).then((data) => {   
        // console.log("aaaa",data.data,jaroptionsRef.value);
        if(data.data.length == 0){
          this.message.error( this.$t("perfor.task.jarlisterr"), { duration: 3000 });
        }else{
          this.message.success( this.$t("perfor.task.jarlistsuc"), { duration: 3000 });
        }
        this.jaroptions = data.data;
        // // console.log("cccc",jaroptionsRef.value);

      });
    }
	}
}

</script>
<style scoped>
/*定义要拖拽元素的样式*/
  .dragList{
    min-width: 500px;
    /* max-width: 1000px; */
    height:auto;
    /* padding: 20px; */
  }
  /* .dragList .n-layout--static-positioned  .n-layout-scroll-container aside{ */
    /* width: 370px !important; */
    /* max-width: 500px !important; */
  /* } */
  .list-top{
    cursor: pointer;
    font-size: 14px;
    padding: 0 12px;
    display: inline-block;
    margin-bottom: 10px;
    min-width: 100px;
    height: 45px;
    line-height: 45px;
    border: 1px solid #bfd9c2;
    border-radius:10px;
    transition: all 1s;
    width: 80%;
  }
  .list-zujian{
    overflow:hidden;
    width: 85%;
    text-align: center;
    height: 45px;
  }
  .list-jmx{
    cursor: pointer;
    font-size: 12px;
    padding: 0 12px;
    display: inline-block;
    margin-bottom: 10px;
    min-width: 100px;
    max-width: 180px;
    height: 35px;
    line-height: 35px;
    border: 1px solid #bfd9c2;
    border-radius:10px;
    transition: all 1s;
    /* overflow:hidden; */
    width: 80%;
    max-width: 400px !important;
  }
  .dragAreafrom{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .dragArea2{
    display: grid;
    align-items: center;
  }
  .list-select {
    cursor: pointer;
    font-size: 14px;
    padding: 0 12px;
    display: inline-block;
    margin: 5px 10px;
    background-color: #fff;
    width: 90%;
    height:40px;
    line-height: 40px;
    border-radius:10px;
    text-align: center;
    border: 1px solid #bfcbd9;
    /* transition: all 1s; */
    /* 很重要！规定是否能选取元素的文本 */
    user-select: none;
  }
  .isjmx{
    /* text-align: center; */
    width: calc(100% - 70px);    /*75%;*/
  }
  .isnotjmx{
    /* text-align: left; */
    width:calc(100% - 35px);/*75%;*/
  }
  .list-complete-item-handle{
    /* width: 75%; */
    /* text-align: center; */
    border-radius:10px;
    overflow:hidden;
    height: 40px;
  }
  :deep .n-dynamic-input .n-dynamic-input-item{
    float: left;
    width: 23%;
    margin-right: 15px;
  }
  :deep .jstack .n-form-item .n-form-item-label{
    color: #18a058;
  }

  .ghost{
    border: solid 1px #a7ef13 !important;
    background-color: #e1f6e3 !important;
    opacity: 1 !important;
  }
  .chosenClass {
    opacity: 0.5;
    /* border: solid 1px red; */
    border: solid 2px #f7e411 ;
    font-weight: bold;
    /* background-color: #e2fcde; */
  }
  /* .fallbackClass {
    background-color: aquamarine;
  } */
  .queuetitle{
    text-align:center;
    min-width: 400px;
    margin-left: 20px;
    color:#1c9555;
  }
  .queuetips{
    text-align:left;
    padding-left: 40px;
    color:#aec9ba;
    font-size: 14px;
    margin-bottom: 5px;
    width: calc(100% - 75px);
  }
  .deleteall{
    color:#aec9ba;
    font-size: 14px;
    height: 30px;
    width: 75px !important;
    float: right;
    margin: -35px 20px 0 0;
  }
</style>