<template>
	<n-space vertical >
		<!-- {{JSON.stringify(addmodel, null, 2) }} -->
		<!-- 遮罩层  增加或修改组件 -->
    <n-modal v-model:show="showModal" preset="dialog" 
      title="Dialog"  
      :maskClosable=false 
      :onMaskClick="onMaskClick" 
      :onPositiveClick="addQueueComponent"
      :onNegativeClick="onNegativeClick">
      <template #header>
        <div>{{addmodel.typevalue==0?$t('common.add'):$t('common.edit')}}</div>
      </template>
      <n-form
        ref="addformRef"
        :model="addmodel"
        :size="small"
        label-placement="left"
      >
      <!-- 选择重启的工程 -->
        <n-form-item :span="12" v-show="showModaltomcat" :label="$t('perfor.task.tomcatname')" style="margin-top:25px;">
          <n-select  v-model:value="addmodel.selecttomcat" :options="tomcatoptions">
            <template #action>
              <n-button attr-type="button" @click="addtomcat" quaternary type="primary" >
                {{$t('common.add')}}
              </n-button>
            </template>
          </n-select>
        </n-form-item>
      <!-- 选择杀掉的工程 -->
        <n-form-item :span="12" v-show="showModaltomcatstop" :label="$t('perfor.task.tomcatname')" style="margin-top:25px;">
          <n-select  v-model:value="addmodel.selecttomcat2" :options="tomcatoptions">
            <template #action>
              <n-button attr-type="button" @click="addtomcat" quaternary type="primary" >
                {{$t('common.add')}}
              </n-button>
            </template>
          </n-select>
        </n-form-item>
      <!-- 填写等待时间 -->
        <n-form-item :span="12" v-show="showModaltime" :label="$t('perfor.task.waittime2')" style="margin-top:25px;">
          <n-input-number v-model:value="addmodel.wait_time"  clearable />
        </n-form-item>  
      <!-- 选择是否过滤 -->
        <n-form-item :span="12" v-show="showModalfilter" :label="$t('perfor.task.selectedfilter')" style="margin-top:25px;">
          <!-- <n-input-number v-model:value="addmodel.filter_name"  clearable /> -->
          <n-select  v-model:value="addmodel.filter_name" :options="filteroptions">
          </n-select>
        </n-form-item>  
      <!-- 选择入库的数据库,填数据表，后缀 -->
        <n-form-item :span="12" v-show="showModalsql" :label="$t('perfor.task.sqlname')" style="margin-top:25px;">
          <n-select v-model:value="addmodel.selectsql" clearable :options="sqloptions" >
            <template #action>
              <n-button attr-type="button" @click="addsql" quaternary type="primary" >
                {{$t('common.add')}}
              </n-button>
            </template>
          </n-select>
        </n-form-item>
        <n-form-item :span="12" v-show="showModalsql" :label="$t('perfor.task.tablename')" >
          <n-input v-model:value="addmodel.table_name" :disabled="!addmodel.selectsql"  clearable />
        </n-form-item>
        <n-form-item :span="12" v-show="showModalsql" :label="$t('perfor.task.jar_suffix')" >
          <n-input v-model:value="addmodel.jar_suffix" :disabled="!addmodel.selectsql"  clearable />
        </n-form-item>
      <!-- 选择换包一系列 -->
        <!--  工程选择 -->
        <n-form-item v-show="showModaltomcatjar" :label="$t('perfor.task.tomcatselect')" style="margin-top:25px;">
          <n-select v-model:value="addmodel.jar.tomcatid" :options="tomcatoptions" clearable >
            <template #action>
              <n-button attr-type="button" @click="addtomcat" quaternary type="primary" >
                {{$t('common.add')}}
              </n-button>
            </template>
          </n-select>
        </n-form-item>
        <!-- 产品版本 分支选择 -->
        <n-form-item v-show="showModaltomcatjar" :label="$t('perfor.task.product')" >
          <n-select v-model:value="addmodel.jar.product" :options="productoptions" clearable />
        </n-form-item> 
        <n-form-item v-show="showModaltomcatjar" :label="$t('perfor.task.branch')" >
          <n-select v-model:value="addmodel.jar.branch" :options="branchoptions" clearable />
        </n-form-item>
        <!--  swift -->
        <n-form-item v-show="showModaltomcatjar" :label="$t('perfor.task.ifswift')"  >
          <n-radio-group v-model:value="addmodel.jar.ifswift" name="radiogroup">
            <n-space>
              <n-radio v-for="item in ifswiftlist" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <!-- 是否指定版本 -->
        <n-form-item v-show="showModaltomcatjar" :label="$t('perfor.task.ifversion')"  >
          <n-radio-group v-model:value="addmodel.ifversion" name="radiogroup">
            <n-space>
              <n-radio v-for="item in ifversionlist" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <!--起始和截至 -->
        <n-form-item v-if="addmodel.ifversion" v-show="showModaltomcatjar" :label="$t('perfor.task.startat')" >
          <n-date-picker v-model:value="addmodel.jar.startat" type="date" clearable style="width: 90%;" />
        </n-form-item>
        <n-form-item v-if="addmodel.ifversion" v-show="showModaltomcatjar" :label="$t('perfor.task.stopat')" >
          <n-date-picker v-model:value="addmodel.jar.stopat" type="date" clearable style="width: 90%;" />
        </n-form-item>
        <!-- 点击加载 -->
        <n-form-item v-if="addmodel.ifversion" v-show="showModaltomcatjar">
          <n-button attr-type="button" @click="loadjar" type="primary" strong secondary>
            {{$t('perfor.task.loadtips')}}
        </n-button>
        </n-form-item>
        <!-- jar列表 -->
        <n-form-item v-if="addmodel.ifversion" v-show="showModaltomcatjar" :label="$t('perfor.task.selectjar')"  >
          <n-select ref="selectInstRef" v-model:value="addmodel.jar.selectjar" :options="jaroptions" clearable  />
        </n-form-item>
      </n-form>
      <template #action>
        <div>
          <n-button attr-type="button" @click="addQueueComponent" type="primary" strong secondary>
            {{$t('common.add')}}
          </n-button>
          <n-button attr-type="button" @click="onNegativeClick" type="warning" strong secondary style="margin-left:15px;">
            {{$t('common.cancel')}}
          </n-button>
        </div>
      </template>
    </n-modal> 
	</n-space>
</template>
<script>
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRouter,useRoute  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useMessage,NInput ,NInputNumber } from "naive-ui";
import { MdArrowRoundBack, MdArrowRoundForward } from "@vicons/ionicons4";
import service from '../../requests/axios';
import service3 from '../../requests/axios3';
import Draggable from 'vuedraggable'
import { LogInOutline as LogInIcon ,Add} from "@vicons/ionicons5";
import { EditNoteRound} from "@vicons/material"
import { Delete} from "@vicons/carbon";

// import { message } from '@/language/ch';
export default {
  name: "TestTaskEditS5Model",
  data() {
    return {
      fileobj:{},
      idkey:"",
    };
  },
  props:['showModal','showModaltomcat','showModaltomcatstop','showModaltomcatjar','showModalsql','showModaltime','showModalfilter','addmodel','tomcatoptions','filteroptions',
	  'productoptions','branchoptions','sqloptions','ifswiftlist','ifversionlist','jaroptions'],
  components: {
    LogInIcon,
    Draggable,
    LogInIcon,Add,Delete,MdArrowRoundBack,MdArrowRoundForward,EditNoteRound
  },
  created() {
    // // console.log("1222222",formRef,models)
    // // console.log(this.$route.name,this.$route.params.tomcatName);
  },
  setup() {
		const { t } = useI18n();
		const models = ref({
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
    return {
			models,
			t,
			typeselectlist:[
        {
          value: "1",
          label: t("perfor.task.yace")
        },
        {
          value: "2",
          label: t("perfor.task.replacejar")
        }
      ].map((s) => {
        s.value = s.value.toLowerCase();
        return s;
      }),
      addtomcat(){
        let routeUrl = window.location.origin +'/version/engine/tomcat/create';
        window.open(routeUrl, '_blank');
      },
      addsql(){
        let routeUrl = window.location.origin +'/version/engine/database/create';
        window.open(routeUrl, '_blank');
      }
		}
	},
	watch: {
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      this.getTest();
      // // console.log("1222222",this.models,this.$route.params.taskId);
    })
  },
  computed: {

  },
  methods: {
		getTest() {
			// this.models = this.$parent.model;
			// console.log("TestTaskEditStep1",this.models);
    },
		loadjar(){
      this.$emit('loadjar',2);
			console.log("TestTaskEditS5Model");
      // this.selectInstRef?.focus();
      // // 聚焦 1 秒 
      // setTimeout(() => {
      //   this.selectInstRef?.blur();
      // }, 1000);
    },
		onNegativeClick(){
			this.$emit('onNegativeClick');
		},
		addQueueComponent(){
      this.$emit('addQueueComponent');
      
		},
		
	}
}

</script>
<style scoped>

</style>