<template>
    <n-space vertical :size="12">
      <div>
        <iframe style="border: none;margin-left: -10px;width: 100%;"  height="800"  
					src="https://qa.fineres.com/webroot/decision/view/form?viewlet=%25E5%25A4%25A7%25E5%25B1%258F%252Fsmoke_11.frm&ref_t=design">
				</iframe>
      </div>
      
    </n-space>
    
  </template>
  
  <script>
  import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted,onUnmounted  } from "vue";
  import { RouterLink,useRouter,useRoute  } from "vue-router";
  import { useI18n } from "vue-i18n";
  import { NIcon,NTag, NButton,useDialog,NDialogProvider,useMessage,NTooltip  } from "naive-ui";
  import reportStatusFliter from '@/assets/data/reportStatusFliter.json';
  import reportTriggerFliter from '@/assets/data/reportTriggerFliter.json';
  import service from '@/requests/axios';
  import { AddCircleOutline,StopCircleOutline } from "@vicons/ionicons5";
  import { NotStartedOutlined,EditNoteRound,DeleteOutlined,AutoAwesomeMosaicOutlined,TableViewFilled,RestartAltFilled} from "@vicons/material";
  // import pmFliter from '../../../assets/data/pmFliter.json';
  // import iterateStatusFliter from '../../../assets/data/iterateStatusFliter.json';

  export default {
    name: "TestAnalysis",
    data() {
      return {
      };
    },
    props: {
    },
    components: {
      AddCircleOutline,DeleteOutlined,RestartAltFilled
    },
    created() {
      // let  to =this.$route
      // console.log(to);
      
    },
    setup() {
      const { t } = useI18n();
      const cns = getCurrentInstance();
      var datalist = [];
      var datalistall = [];
      const dialog = useDialog();
      const router = useRouter();
      const route = useRoute();
      const message = useMessage();
      return {
      
      };
    },
    watch: {
  
    },
    mounted() {
      // this.getgroup();
      // this.$nextTick(function () {
      // })
    },
    computed: {
  
    },
    methods: {
      
    }
  }
  </script>
  <style scoped>
  </style>
  