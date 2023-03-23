<template>
	<n-space vertical >
		<!-- 步骤一 -->
		<n-card  :bordered="false">
			<!-- 名称 标签 -->
			<n-grid :cols="24" :x-gap="24" >
				<n-form-item-gi :span="8" :label="$t('perfor.task.name')"  path="name" style="font-weight: bold;">
					<n-input v-model:value="models.name" :placeholder="$t('perfor.script.namevalue')" clearable />
				</n-form-item-gi> 
				<n-form-item-gi :span="10" :label="$t('perfor.tags')"  path="tags" >
					<!-- <n-input v-model:value="models.tags" :placeholder="$t('perfor.script.tagsinfo')" clearable /> -->
          <n-dynamic-tags v-model:value="models.tags" />
				</n-form-item-gi>
			</n-grid>
			<!-- 备注 -->
			<n-form-item :span="12" :label="$t('perfor.script.comment')" path="comment" style="margin-bottom:-15px">
				<n-input
					v-model:value="models.comment"
					type="textarea"
					:autosize="{
						minRows: 2,
						maxRows: 5
					}"
				/>
			</n-form-item>
			<!--  对象选择 ——压测 / 换包 -->
			<n-grid :cols="24" :x-gap="24" >
				<n-form-item-gi :span="12" :label="$t('perfor.task.typeselect')"  >
					<n-radio-group v-model:value="models.typeselectvalue" name="radiogroup">
						<n-space>
							<n-radio v-for="item in typeselectlist" :key="item.value" :value="item.value">
								{{ item.label }}
							</n-radio>
						</n-space>
					</n-radio-group>
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
  name: "TestTaskEditStep1",
  data() {
    return {
      fileobj:{},
      idkey:"",
    };
  },
  props:['models'],

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
        tags:[],
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
		}
	},
	watch: {
    // '$route'(to) {
    //   // 如果是创建测试
    //   if (to.name === 'taskCreate') {
    //     this.reload();  
    //     return;
    //   }
    //   if (to.name !== 'taskEdit') {
    //     this.idkey= to.params.taskId;
    //     return;
    //   }
    // //   document.getElementById('projectname').setAttribute("disabled","disabled");
    // // //   this.isReadOnly = false;
    //   // // console.log("到站了",to.params.taskId)
    //   // this.getTest(to.params.taskId);
    //   // // console.log("到站了2")
    // }
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
			this.models = this.$parent.model;
			console.log("TestTaskEditStep1",this.models);
    },
	}
}

</script>
<style scoped>

</style>