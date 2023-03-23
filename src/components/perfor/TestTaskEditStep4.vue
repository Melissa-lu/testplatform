<template>
	<n-space vertical >
		<n-card :bordered="false" class="jstack" >
			<!-- 全局配置 -->
			<div style="background-color:#eaf3ee;width: 99%;min-height: 64px;padding: 20px 20px 0px;margin-bottom: 40px;">
				<n-grid :cols="24" :x-gap="12" style="position: absolute !important;top: 34px;    width: 95%;">
					<!-- 按钮 -->
					<n-form-item-gi :span="4" style="top: -15px !important;position: relative !important;">
						<n-button attr-type="button" @click="globalchangej" type="primary" strong secondary>
							{{$t('perfor.task.globaltip')}}
						</n-button>
					</n-form-item-gi>
					<!-- dump等 -->
					<n-form-item-gi :span="4" :label="$t('perfor.task.ifjstack')"  >
						<n-switch v-model:value="model.globalj.ifjstack" />
					</n-form-item-gi> 
					<n-form-item-gi :span="4" :label="$t('perfor.task.ifdump')"  >
						<n-switch v-model:value="model.globalj.ifdump" />
					</n-form-item-gi>
					<!-- 堆栈频率 -->
					<n-form-item-gi :span="4" :label="$t('perfor.task.jstackrate')"  >
						<n-input-number v-model:value="model.globalj.jstackrate" :disabled="!model.globalj.ifjstack" style="width: 100%;"  clearable />
					</n-form-item-gi> 
					<!-- 压测机选择 -->
					<n-form-item-gi :span="4" :label="$t('perfor.task.selectedserver')"  >
						<n-select v-model:value="model.globalj.selectedserverid"  clearable filterable  :options="serveroptions" >
              <template #action>
                <n-button attr-type="button" @click="addserver" quaternary type="primary" >
                  {{$t('common.add')}}
                </n-button>
              </template>
            </n-select>
          </n-form-item-gi>
					<!-- 工程选择 -->
					<n-form-item-gi :span="4" :label="$t('perfor.task.selsecttomcat')"  >
						<n-select v-model:value="model.globalj.selectedtomcatid"  clearable filterable  :options="tomcatoptions" >
              <template #action>
                <n-button attr-type="button" @click="addtomcat" quaternary type="primary" >
                  {{$t('common.add')}}
                </n-button>
              </template>
            </n-select>
          </n-form-item-gi>
				</n-grid>
			</div>
			<!-- 选中的用例 配置 -->
			<n-form
				v-for="(item, index2) in model.select_list"
				inline
				:key="index2"   
				style="margin-left:15px;margin: -10px 0;"
			>
				<n-grid :cols="24" :x-gap="24" style="position: relative;top: -28px;">
					<n-form-item-gi :span="5"  >
						<n-input v-model:value="item.name" clearable :disabled="true" />
					</n-form-item-gi>
					<!-- 堆栈 dump -->
					<n-form-item-gi :span="3"  >
						<n-switch v-model:value="item.ifjstack" />
					</n-form-item-gi> 
					<n-form-item-gi :span="4" >
						<n-switch v-model:value="item.ifdump" />
					</n-form-item-gi>
					<!-- 堆栈频率 -->
					<n-form-item-gi :span="4"  >
						<n-input-number v-model:value="item.jstackrate" :disabled="!item.ifjstack" style="width: 100%;"  clearable />
					</n-form-item-gi> 
					<!-- 压测机选择 -->
					<n-form-item-gi :span="4" >
						<n-select v-model:value="item.selectedserverid"  clearable filterable :options="serveroptions" >
              <template #action>
                <n-button attr-type="button" @click="addserver" quaternary type="primary" >
                  {{$t('common.add')}}
                </n-button>
              </template>
            </n-select>
					</n-form-item-gi> 
					<!-- 工程选择 -->
					<n-form-item-gi :span="4" >
						<n-select v-model:value="item.selectedtomcatid"  clearable filterable :options="tomcatoptions" >
              <template #action>
                <n-button attr-type="button" @click="addtomcat" quaternary type="primary" >
                  {{$t('common.add')}}
                </n-button>
              </template>
            </n-select>
					</n-form-item-gi>        
				</n-grid>
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
  name: "TestTaskEditStep4",
  data() {
    return {
      fileobj:{},
      idkey:"",
    };
  },
  props:['serveroptions','tomcatoptions'],
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
    return {
			model,
			t,
      // checkedRowKeys: checkedRowKeysRef,
      // checkedRows: checkedRowsRef,
      rowKey: (row) => row.id,
      addserver(){
        let routeUrl = window.location.origin +'/version/engine/server/create';
        window.open(routeUrl, '_blank');
      },
      addtomcat(){
        let routeUrl = window.location.origin +'/version/engine/tomcat/create';
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
    globalchangej(){
      this.$emit('globalchangej');
    },
	}
}

</script>
<style scoped>

</style>