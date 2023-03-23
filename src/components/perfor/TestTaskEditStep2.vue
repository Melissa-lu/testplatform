<template>
	<n-space vertical >
		<!-- 压测 -->
    <!-- <div style="height:300px;width:100%">1111111111111{{JSON.stringify(defaultselectjmxs, null, 2) }}</div> -->
    <n-card  :bordered="false" v-show="models.typeselectvalue==1?true:false">
      <!-- :default-checked-row-keys="defaultselectjmxs" -->
      <n-data-table
        size="small"  striped 
        ref="table"
        :bordered="false"
        :columns="columnss"
        :data="datas"
        :row-key="rowKey"
        :pagination="paginations"
        :loading="loading"
        :scroll-x="1000"
        :default-checked-row-keys="defaultselectjmxs"
        @update:page="handlePageChange"
        @update:checked-row-keys="checkedJmx"
      />
    </n-card>
    <!-- 换包的 -->
    <n-card  :bordered="false" v-show="models.typeselectvalue==2?true:false" >
      <!--  工程选择 -->
      <n-grid :cols="24" :x-gap="24" >
        <n-form-item-gi :span="8" :label="$t('perfor.task.tomcatselect')" >
          <n-select v-model:value="models.jar.tomcatid" :options="tomcatoptions" clearable />
        </n-form-item-gi>
      </n-grid>
      <!-- 产品版本 分支选择 -->
      <n-grid :cols="24" :x-gap="24" >
        <n-form-item-gi :span="8" :label="$t('perfor.task.product')" >
          <n-select v-model:value="models.jar.product" :options="productoptions" clearable />
        </n-form-item-gi> 
        <n-form-item-gi :span="8" :label="$t('perfor.task.branch')" >
          <n-select v-model:value="models.jar.branch" :options="branchoptions" clearable />
        </n-form-item-gi>
      </n-grid>
      <!--  swift 是否指定版本 -->
      <n-grid :cols="24" :x-gap="24" >
        <n-form-item-gi :span="8" :label="$t('perfor.task.ifswift')"  >
          <n-radio-group v-model:value="models.jar.ifswift" name="radiogroup">
            <n-space>
              <n-radio v-for="item in ifswiftlist" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item-gi>
        <n-form-item-gi :span="8" :label="$t('perfor.task.ifversion')"  >
          <n-radio-group v-model:value="models.ifversion" name="radiogroup">
            <n-space>
              <n-radio v-for="item in ifversionlist" :key="item.value" :value="item.value">
                {{ item.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item-gi>
      </n-grid>
      <!--起始和截至 -->
      <n-grid :cols="24" :x-gap="24" v-if="models.ifversion">
        <n-form-item-gi :span="8" :label="$t('perfor.task.startat')" >
          <n-date-picker v-model:value="models.jar.startat" type="date" clearable style="width: 90%;" />
        </n-form-item-gi>
        <n-form-item-gi :span="8" :label="$t('perfor.task.stopat')" >
          <n-date-picker v-model:value="models.jar.stopat" type="date" clearable style="width: 90%;" />
        </n-form-item-gi>
      </n-grid>
      <!-- 点击加载 -->
      <n-grid :cols="24" :x-gap="24" style="margin-top:-20px;" v-if="models.ifversion" >
        <n-form-item-gi :span="12" >
          <n-button attr-type="button" @click="loadjar" type="primary" strong secondary>
            {{$t('perfor.task.loadtips')}}
        </n-button>
        </n-form-item-gi>
      </n-grid>
      <!-- jar列表 -->
      <n-grid :cols="24" :x-gap="24" v-if="models.ifversion" >
        <n-form-item-gi :span="8" :label="$t('perfor.task.selectjar')"  >
          <n-select ref="selectInstRef" v-model:value="models.jar.selectjar" :options="jaroptions" clearable  />
        </n-form-item-gi>
      </n-grid>
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
  name: "TestTaskEditStep2",
  data() {
    return {
      fileobj:{},
      idkey:"",

    };
  },
  props:['datas','defaultselectjmxs','columnss','paginations','jaroptions','tomcatoptions','productoptions',
          'branchoptions','ifswiftlist','ifversionlist'],
  components: {
    LogInIcon,
    Draggable,
    LogInIcon,Add,Delete,MdArrowRoundBack,MdArrowRoundForward,EditNoteRound
  },
  created() {
    // // console.log("1222222",formRef,modelss)
    // // console.log(this.$route.name,this.$route.params.tomcatName);
  },
  setup() {
		const { t } = useI18n();
    // const checkedRowKeysRef = ref([]);
    // const checkedRowsRef = reactive([{}]);
    const jmxlistRef= ref([]);
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
			models,
			t,
      // checkedRowKeys: checkedRowKeysRef,
      // checkedRows: checkedRowsRef,
      jmxlist:jmxlistRef,
      // selectInstRef:ref(null),
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
			this.models = this.$parent.model;
			// console.log("TestTaskEditStep2",this.models,this.datas,this.defaultselectjmxs);
    },
    checkedJmx(rowKeys,rows) {
      let alldata = {
        "checkedRowKeys":rowKeys,
        "checkedRows":rows
      };
      this.$emit('changeselectjmx',alldata);
    },
    loadjar(){
      this.$emit('loadjar',1);
      // 现在是没聚焦效果了
      // selectInstRef.value?.focus();
      // // 聚焦 1 秒 
      // setTimeout(() => {
      //   selectInstRef.value?.blur();
      // }, 1000);
    }
	}
}

</script>
<style scoped>

</style>