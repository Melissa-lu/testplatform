<template>
	<n-space vertical >
		<n-card :bordered="false" >
      <!-- 全局配置 -->
      <div style="background-color:#eaf3ee;min-height: 64px;padding: 20px 20px 0px;margin-bottom: 20px;">
        <!-- 按钮 -->
        <!-- top: 15px !important;;position: absolute !important; -->
        <n-form-item style="width: 100px;margin-top: -20px;">
          <n-button attr-type="button" @click="globalchange" type="primary" strong secondary>{{$t('perfor.task.globaltip')}}</n-button>
        </n-form-item>
        <!-- 参数 -->
        <!-- position: absolute !important;;left: 145px !important; -->
        <n-dynamic-input
          v-model:value="model.global" :on-create="onCreate_p" #="{ index,value  }"
          style="margin-top: -60px; margin-left: 145px !important; " item-style="margin-bottom: 0;" 
        >
          <div style="display: inherit;">
          <!-- <div style="display:inline-flex !important;"> -->
            <n-form-item ignore-path-change :show-label="false" >
              <n-input v-model:value="model.global[index].pname" placeholder="name" @keydown.enter.prevent />
            </n-form-item>
            <div style="height: 34px; line-height: 34px; margin: 0 8px"> = </div>
            <n-form-item ignore-path-change :show-label="false" >
              <n-input v-model:value="model.global[index].pvalue" placeholder="Value" @keydown.enter.prevent />
            </n-form-item>
          </div>
        </n-dynamic-input>
      </div>
      <h5 style="color:#18a058;">{{$t("perfor.task.scripttips")}}</h5>
      <!-- 选中的用例 配置 -->
      <!-- {{ JSON.stringify(model.select_list) }} -->
      <n-form
        v-for="(item, index2) in model.select_list"  :key="index2"  inline  
        style="margin-left:15px;margin: -10px 0;"
      >
        <n-form-item  style="top: -26px; position: relative;width: 15%;">
          <n-input v-model:value="item.name" clearable :disabled="true" />
        </n-form-item>
        <!-- ！！！！！！！！！  #="{ index,value  }"  里必须是 index 不能改名，不然用不了-->
        <n-dynamic-input
          v-model:value="item.parameter" :on-create="onCreate_p"  #="{ index,value  }"
          item-style=" margin-bottom: 0px;"
        >
          <div style="display: inherit;">
            <n-form-item ignore-path-change :show-label="false" >
              <n-input v-model:value="item.parameter[index].pname" placeholder="name" @keydown.enter.prevent />
            </n-form-item>
            <div style="height: 34px; line-height: 34px; margin: 0 8px"> = </div>
            <n-form-item ignore-path-change :show-label="false" >
              <n-input v-model:value="item.parameter[index].pvalue" placeholder="Value" @keydown.enter.prevent />
            </n-form-item>
          </div>
        </n-dynamic-input>
        <!-- 按钮 -->
        <n-form-item style="width: 100px;margin-top: -26px;">
          <n-button attr-type="button" @click="toglobalchange(item)" type="primary" strong secondary>{{$t('perfor.task.globaltip2')}}</n-button>
        </n-form-item>
        <!-- {{ JSON.stringify(item.parameter, null, 2) }} -->
      </n-form>
    </n-card>
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
  name: "TestTaskEditStep3",
  data() {
    return {
      fileobj:{},
      idkey:"",

    };
  },
  props:[],
  components: {
    LogInIcon,
    Draggable,
    LogInIcon,Add,Delete,MdArrowRoundBack,MdArrowRoundForward,EditNoteRound
  },
  created() {
    // console.log("1222222",formRef,modelss)
    // console.log(this.$route.name,this.$route.params.tomcatName);
  },
  setup() {
		const { t } = useI18n();
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
    // const paginationReactive = reactive({
    //   page: 1,
    //   pageSize: parseInt(process.env.VUE_APP_PAGE_SIZE_MEDIUM2),
    //   pageCount: 1,
    //   showSizePicker: true,
    //   prefix ({ itemCount }) {
    //     return `一共有 ${itemCount}个`
    //   },
    //   pageSizes:[parseInt(process.env.VUE_APP_PAGE_SIZE_MEDIUM1),parseInt(process.env.VUE_APP_PAGE_SIZE_MEDIUM2),parseInt(process.env.VUE_APP_PAGE_SIZE_MEDIUM3)],//分页选项
    //   onChange: (page) => {
    //     paginationReactive.page = page;
    //   },
    //   onUpdatePageSize: (pageSize) => {
    //     paginationReactive.pageSize = pageSize;
    //     paginationReactive.page = 1;
    //   }
    // });
    return {
			model,
			t,
      // checkedRowKeys: checkedRowKeysRef,
      // checkedRows: checkedRowsRef,
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
    // checkedJmx(rowKeys,rows) {
    //   let alldata = {
    //     "checkedRowKeys":rowKeys,
    //     "checkedRows":rows
    //   };
    //   this.$emit('changeselectjmx',alldata);
    // },
    globalchange(){
      this.$emit('globalchange');
    },
    toglobalchange(item,index){
      // console.log("globalchange1111",item);
      this.$emit('toglobalchange',item);
    },
    // 新建参数
    onCreate_p () {
      return {
        pname: '',
        pvalue: '',
        enabled:true,
      }
    },
	}
}

</script>
<style scoped>
:deep .n-dynamic-input .n-dynamic-input-item{
  display:inline-flex !important;
  margin-right: 10px;
}
</style>