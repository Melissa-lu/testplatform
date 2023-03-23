<template>
  <n-form
    ref="formRef"
    :model="model"
    :rules="rules"
    label-placement="left"
    label-width="auto"
    require-mark-placement="right-hanging"
    :size="size"
    :style="{
      maxWidth: '2400px',
      minWidth: '850px',
      padding: '20px 10px',
    }"
  >
    <!-- 名称和保存取消按钮 -->
    <n-grid :cols="24" :x-gap="24" style="border-bottom:2px dotted #bfd7ca">
      <n-form-item-gi :span="12" :label="$t('perfor.script.name')"  path="name" style="font-weight: bold;">
        <n-input v-model:value="model.name" :placeholder="$t('perfor.script.namevalue')" clearable />
      </n-form-item-gi> 
      <n-form-item-gi :span="2" >
        <n-button attr-type="button" @click="handleSubmit" type="primary" strong secondary>
            {{$t('common.save')}}
        </n-button>
      </n-form-item-gi>
      <n-form-item-gi :span="2" >
        <n-button attr-type="button" @click="handleCancel" type="warning" strong secondary>
            {{$t('common.cancel')}}
        </n-button>
      </n-form-item-gi>
    </n-grid>
    <!-- 功能场景 标签  关联bug id -->
    <n-grid :cols="24" :x-gap="24" style="margin:25px 0 0px">
      <n-form-item-gi :span="8" :label="$t('perfor.script.scenario')"  path="scenario" >
        <n-input v-model:value="model.scenario" :placeholder="$t('perfor.script.scenarioinfo')" clearable />
      </n-form-item-gi>
      <n-form-item-gi :span="8" :label="$t('perfor.tags')"  path="tags" >
        <!-- <n-input v-model:value="model.tags" :placeholder="$t('perfor.script.tagsinfo')" clearable /> -->
        <n-dynamic-tags v-model:value="model.tags" />
      </n-form-item-gi> 
      <n-form-item-gi :span="8" :label="$t('perfor.script.workid')"  path="workid" >
        <!-- <n-input v-model:value="model.workid" :placeholder="$t('perfor.script.buginfo')" clearable /> -->
        <n-dynamic-tags v-model:value="model.workid" />
      </n-form-item-gi> 
    </n-grid>
    <!-- 备注 -->
    <n-form-item :span="12" :label="$t('perfor.script.comment')" path="comment" style="margin-bottom:-15px">
        <n-input
          v-model:value="model.comment"
          type="textarea"
          :autosize="{
            minRows: 2,
            maxRows: 5
          }"
        />
      </n-form-item>
    <!-- 配置文件 -->
    <h3 style="color: #333;">{{$t('perfor.script.configfile')}}</h3> 

    <n-grid :cols="24" :x-gap="24">
      <!-- 脚本 -->
      <n-form-item-gi :span="8" >
        <n-upload
            ref="uploadjmx"
            :default-upload="false"
            show-download-button
            @change="handleChangejmx"
            @before-upload="beforeUpload"
        >
          <n-button style="margin-left:15px;">{{$t('perfor.script.uploadjmx')}}</n-button>
        </n-upload>
      </n-form-item-gi>
      <!-- 附件 -->
      <n-form-item-gi :span="8" >
        <n-upload
            ref="upload"
            :default-upload="false"
            show-download-button
            multiple
            @change="handleChange"
        >
          <n-button style="margin-left:15px;">{{$t('perfor.script.uploadfile')}}</n-button>
        </n-upload>
      </n-form-item-gi>
    </n-grid>
    <!-- 显示已有文件 -->
    <n-data-table
      :columns="filecolumns"
      :data="model.filenamelist"
      :bordered="false"
      style="width:70%;margin-bottom: 25px;"
    />
    
    <!-- 场景参数 -->
    <h3 style="margin-top:-5px;color: #333;">{{$t('perfor.script.pscenario')}}</h3> 
    <!-- 增加的按钮 -->
    <n-form-item>
      <n-space>
        <n-button attr-type="button" @click="addItem" style="margin-left:15px;">
          {{$t('perfor.script.addp')}}
        </n-button>
      </n-space>
    </n-form-item>
    <!-- 显示的列表 -->
    <n-form
      v-for="(item, index) in model.plist"
      inline
      :show-label="(index==0?ture:false)"
      :key="index"   
      style="margin-left:15px;"
    >
      <n-form-item :path="`plist[${index}].pname`" :label="$t('perfor.script.pname')">
        <n-input v-model:value="item.pname" clearable />
      </n-form-item>
      <n-form-item :path="`plist[${index}].pvalue`" :label="$t('perfor.script.pvalue')">
        <n-input v-model:value="item.pvalue" clearable />
      </n-form-item>
      <n-form-item :path="`plist[${index}].enabled`" :label="$t('common.ifuse')">
        <n-switch v-model:value="item.enabled"  />
      </n-form-item>
      <n-form-item >
        <n-button  @click="removeItem(index)">{{$t('common.delete')}}</n-button>
      </n-form-item>

     
    </n-form>

    
  </n-form>

  <!-- <pre>{{ JSON.stringify(model, null, 2) }}</pre> -->
</template>
<script>
import axios from 'axios';
import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted  } from "vue";
import { RouterLink,useRouter,useRoute  } from "vue-router";
import { useI18n } from "vue-i18n";
import { NIcon,NTag, NButton,useMessage, } from "naive-ui";
import { inject } from 'vue'
import { LogInOutline as LogInIcon } from "@vicons/ionicons5";
import service from '../../requests/axios';
import servicefile from '../../requests/axiosfile';

export default {
  name: "ScriptEdit",
  data() {
    return {
      fileobj:{},
      idkey:"",
    };
  },
  props: {
  },
  components: {
    LogInIcon
  },
  created() {
    // console.log("1222222",formRef,model)
    // this.getTest(this.$route.params.scriptIdkey);
    // console.log(this.$route.name,this.$route.params.tomcatName);
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const message = useMessage();
    // const handleDownload = (file) => {
    //   console.log(`下载成功：${file.name}`);
    // };
    const uploadRef = ref(null);
    const uploadjmxRef = ref(null);
    const formRef = ref(null);
    const fileListRef = ref(0);
    const fileListjmxRef = ref(0);
    const removeItem = (index) => {
      model.plist.splice(index, 1);
    };
    const addItem = () => {
      console.log("00model.plist",model.plist,)
      model.plist.push({ pname: "",pvalue:"",enabled:false });
    };
    const model = reactive({
        name: "",
        scenario:"",
        workid:[],
        comment:"",
        filenamelist:[{filename:"",}],
        tags:[],
        plist: [{ pname: "",pvalue:"",enabled:false }]
    });
    const createColumns = ({
      downloadfile,deletefile
    }) => {
      return [  
        {
          title: t("perfor.script.filenamelist"),
          key: "filename",
          // width: 300,
        },
        {
          title: t("common.action"),
          key: "edit",
          width: 70,
          fixed: "right",
          render(row) {
            return h(NButton, {
              size: "small",
              style: { 
                display:row.filename==''?"none":"block"// 如果没有文件 就不显示按钮
              },
              onClick: () => downloadfile(row)
            }, 
            { default: () => t("common.download") });
          }
        },
        {
          title: '',
          key: "delete",
          width: 80,
          fixed: "right",
          render(row) {
            return h(NButton, {
              size: "small",
              style: { 
                color: "red",
                display:(row.filename.indexOf("jmx")!=-1||row.filename=='')?"none":"block"// 如果是 脚本 就没有删除按钮，如果没有文件 就不显示按钮
              },
              onClick: () => deletefile(row)
            }, 
            { default: () => t("common.delete") });
          }
        },
      ];
    };
    return {
        formRef,
        model,
        upload: uploadRef,
        uploadjmx: uploadjmxRef,
        fileList: fileListRef,
        fileListjmx: fileListjmxRef,
        addItem,
        removeItem,
        // handleDownload,
        handleChange(options) {
          fileListRef.value = options.fileList;
          console.log("file",options.fileList,options);
          console.log("uploadRef.value",uploadRef.value)
        },
        handleChangejmx(options) {
          fileListjmxRef.value = options.fileList;
          // fileListjmxRef.value = uploadjmxRef.value;
          console.log("jmx change",options.fileList,options);
          console.log("uploadjmxRef.value",uploadjmxRef.value)
        },
        rules: {
            name: {
              required: true,
              message: t("common.placeholder1"),
              trigger: ["input"]
            }
        },
        filecolumns: createColumns({
          downloadfile(rowData) {//下载文件

            // service.get('/loadtest/scripts/'+route.params.scriptIdkey+'/assets/'+rowData.filename).then(res=>{
            //   // message.success(t("perfor.script.deletesuc"));
            //   // location.reload() ; 
            //   window.open(res.data, "_blank");
            // }).catch(e=>{
            //   // console.log("essrormessage",e.response.data);
            //   // alert(e.response.data);
            //   message.error(t("perfor.script.deleteerr"));
            // });
            window.open(window.location.origin+"/api2/loadtest/scripts/"+route.params.scriptIdkey+"/assets/"+rowData.filename, "_blank");
          },
          deletefile(rowData) {
            // console.log(rowData.filename,);
            service.delete('/loadtest/scripts/'+route.params.scriptIdkey+'/assets/'+rowData.filename).then(res=>{
              message.success(t("perfor.script.deletesuc"));
              location.reload() ; 
            }).catch(e=>{
              // console.log("essrormessage",e.response.data);
              // alert(e.response.data);
              message.error(t("perfor.script.deleteerr"));
            });
            // this.reload();
            
          },
        }),
        async beforeUpload(data) {//确保只能上传jmx文件
          // console.log("filetype",data.file.file)
          // 如果有脚本的话，能新上传脚本，这个被覆盖
          // formRef.value.model.filenamelist.filename = data.file.file.name;
          // let ffilenamelist = formRef.value.model.filenamelist;
          let ffilenamelist = data.fileList;
          let ifjmxlen = 0;// 记录jmx文件数量
          // let ifjmx = false;
          // console.log("00脚本:",ffilenamelist);
          if(ffilenamelist.length > 0 ){//说明已有脚本，就不能再上传
            message.error(t("perfor.script.filelimit")); 
            return false;
          }
          let namelength = data.file.file.name.split(".").length;
          console.log("jmx wenjian:",data,data.file.file.name.split(".")[namelength-1])
          if (data.file.file.name.split(".")[namelength-1] !== "jmx") {
            message.error(t("perfor.script.filetypelimit"));
            return false;
          }
          return true;
        },
        handleSubmit(e) {
          formRef.value?.validate((errors) => {
            if (!errors) {
              if(formRef.value.model.name!=''){
                console.log("formRef:",formRef.value.model)
                let tagslist = [];
                let workidlist = [];
                let scenariolist =[];
                let rowobj = formRef.value.model;
                tagslist = rowobj.tags;
                workidlist= rowobj.workid;
                // if(formRef.value.model.workid.length){
                //   // console.log("work_ids",rowobj.workid);
                //   if(rowobj.workid.indexOf(",")!=-1){
                //     workidlist = rowobj.workid.split(',');
                //   }else{
                //     workidlist= rowobj.workid;
                //   }
                // }
                if(formRef.value.model.scenario){
                  if(rowobj.scenario.indexOf("-")!=-1){
                    scenariolist = rowobj.scenario.split('-');
                  }else{
                    scenariolist= rowobj.scenario;
                  }
                }
                  // scenariolist = rowobj.scenario.split('-');
                // 定义要传的结构数据data
                let data = {
                  name: rowobj.name,
                  scenario: scenariolist,
                  work_ids:workidlist,
                  tags:tagslist,
                  //没有显示的
                  comment:rowobj.comment,
                  plist:rowobj.plist,
                }
                // console.log("work_ids",data.work_ids,workidlist);
                // console.log("scenario",data.scenario,scenariolist);
                // console.log("tags",data.tags,tagslist);
                //判断编辑还是新建
                //编辑
                if(route.path.indexOf("edit")!=-1){
                  // console.log("shifou",route.path,route.params.scriptIdkey);
                  service.put('/loadtest/scripts/'+route.params.scriptIdkey,data).then(res=>{
                    if(res.data.code==0){
                      message.success(t("common.updatesuc"));  
                    }else{
                      message.error(t("common.updateerr")); 
                    }              
                  }).catch(e=>{
                    // console.log("essrormessage",e.response.data);
                    // alert(e.response.data);
                    message.error(t("common.updateerr"));
                  });
                  //*********开始文件部分
                  // console.log("444",fileListjmxRef.value[0].file);
                  //！！！很重要 —— fileListjmxRef.value[xx].file 才是文件类型，要上传的
                  //附件的时候要for循环列表

                  // 脚本没有更新的话，不需要上传，path不变，不需要操作
                  //               ——》filelist里为空
                  // 脚本是新的话，需要上传保存新的 
                  //               ——》filelist里肯定有东西，无所谓 filenamelist里jmx为空或者不空
                  // ****上传脚本部分
                  // 如果fileListjmx里有文件，就要更新上传
                  if(fileListjmxRef.value.length>0){
                    let formdata = new FormData();
                    formdata.append('file', fileListjmxRef.value[0].file);//只可能有一个，所以直接 [0]
                    // 上传文件和脚本
                    let scriptid = route.params.scriptIdkey;
                    servicefile.post('/loadtest/scripts/'+scriptid+'/file',formdata).then(res=>{
                      // console.log(res);
                      if(res.data.code==0)
                        message.success(t("perfor.script.putjmxsuc"));  
                      else
                        message.error(t("perfor.script.putjmxerr"));
                      // router.push({
                      //   path: '/perfor',
                      // });                      
                    }).catch(e=>{
                        // console.log("essrormessage",e.response.data);
                        // alert(e.response.data);
                        message.error(t("perfor.script.putjmxerr"));
                        // router.push({
                        //   path: '/perfor',
                        // });  
                    });
                  }
                  // 不改脚本就直接返回列表了
                  else{
                    message.info(t("perfor.script.jmxinfo"));
                    // router.push({
                    //   path: '/perfor',
                    // });  
                  }
                  // *******上传附件部分
                  // 如果fileList里有文件，就要更新上传
                  if(fileListRef.value.length>0){
                    // 因为一次只传一个文件，所以for
                    for(let i=0;i<fileListRef.value.length;i++){
                      let formdata = new FormData();
                      console.log("*******",fileListRef.value[i])
                      formdata.append('file', fileListRef.value[i].file);
                      // 上传文件
                      let scriptid = route.params.scriptIdkey;
                      servicefile.post('/loadtest/scripts/'+scriptid+'/assets',formdata).then(res=>{
                        // console.log(res);
                        if(res.data.code==0)
                          message.success(t("perfor.script.putfile")+fileListRef.value[i].file.name+t("common.succ"));  
                        else
                          message.error(t("perfor.script.putfile")+fileListRef.value[i].file.name+t("common.err"));
                        if(i== fileListRef.value.length - 1){
                          router.push({
                            path: '/perfor',
                          });  
                        }                
                      }).catch(e=>{
                          console.log("essrormessage",e.response.data);
                          // alert(e.response.data);
                          message.error(t("perfor.script.putfile")+fileListRef.value[i].file.name+t("common.err"));
                          // 清空附件数组
                          fileListRef.value = [];
                          router.push({
                            path: '/perfor',
                          });  
                      });
                    }
                  }
                  // 不改脚本就直接返回列表了
                  else{
                    // message.info(t("perfor.script.jmxinfo"));
                    router.push({
                      path: '/perfor',
                    });  
                  }
                }
                //新建
                else{
                  // 先判断下有没有上传脚本
                  if(!fileListjmxRef.value){
                    message.info(t("perfor.script.prejmxinfo"));
                  }
                  // console.log("data:",data);
                  // 保存脚本条目
                  //先新建条目
                  service.post('/loadtest/scripts',data).then(res=>{
                    //成功后获取id
                    if(res.data.code==0){  
                      let scriptid = res.data.data.id;         
                      message.success(t("common.createsuc"));
                      //获取上传脚本和附件文件
                      // console.log("444",fileListjmxRef.value[0].file);
                      //！！！很重要 —— fileListjmxRef.value[xx].file 才是文件类型，要上传的
                      //后面补文件的时候要for循环列表
                      let formdatajmx = new FormData();
                      formdatajmx.append('file', fileListjmxRef.value[0].file);
                      // 上传脚本
                      servicefile.post('/loadtest/scripts/'+scriptid+'/file',formdatajmx).then(res=>{
                        // console.log(res);
                        message.success(t("perfor.script.putjmxsuc"));       
                        router.push({
                          path: '/perfor',
                        });  
                      }).catch(e=>{
                        console.log("essrormessage",e);
                        // alert(e.response.data);
                        message.error(t("perfor.script.putjmxerr"));
                        // 清空附件数组
                        fileListjmxRef.value = [];
                        router.push({
                          path: '/perfor',
                        });  
                      });
                      // 上传文件
                      for(let i=0;i<fileListRef.value.length;i++){
                        let formdata = new FormData();
                        console.log("*******",fileListRef.value[i])
                        formdata.append('file', fileListRef.value[i].file);
                        servicefile.post('/loadtest/scripts/'+scriptid+'/assets',formdata).then(res=>{
                          // console.log(res);
                          message.success(t("perfor.script.putfile")+fileListRef.value[i].file.name+t("common.succ"));  
                          if(i== fileListRef.value.length - 1){
                            router.push({
                              path: '/perfor',
                            });  
                          }                
                        }).catch(e=>{
                            console.log("essrormessage",e.response.data);
                            // alert(e.response.data);
                            message.error(t("perfor.script.putfile")+fileListRef.value[i].file.name+t("common.err"));
                            // 清空附件数组
                            fileListRef.value = [];
                            router.push({
                              path: '/perfor',
                            });  
                        });
                      }
                    }else{
                      message.success(t("common.createerr"));
                    }
                  }).catch(e=>{
                      console.log("essrormessage",e.response.data);
                      // alert(e.response.data);
                      message.error(t("common.crtateerr"));
                      router.push({
                        path: '/perfor',
                      });  
                  });
                  
                }
              }
            } else {
                console.log("errors",errors);
            }
              // 

              // 
          });

        },
        handleCancel(e){
          router.push({
            path: '/perfor',
          });
        }
    };
  },
  watch: {
    '$route'(to) {
      // 如果是创建测试
      if (to.name === 'scriptCreate') {
        this.reload();  
        return;
      }
      if (to.name !== 'scriptEdit') {
        this.idkey= to.params.scriptIdkey;
        return;
      }
    //   document.getElementById('projectname').setAttribute("disabled","disabled");
    // //   this.isReadOnly = false;
      // console.log("到站了",to.params.scriptIdkey)
       this.getTest(to.params.scriptIdkey);
      // console.log("到站了2")
    }
  },
  mounted() {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      
      this.getTest(this.$route.params.scriptIdkey);
      console.log("1222222",this.model,this.$route.params.scriptIdkey);
    })
  },
  computed: {

  },
  methods: {
    getTest(scriptIdkey) {
        // console.log("1222222",formRef.value)
        // 如果是编辑的情况下
        if (scriptIdkey!= undefined) {
          // console.log("222222",scriptIdkey)
          //接口获取详细信息
          service.get('/loadtest/scripts/'+scriptIdkey).then(response=>{
            // console.log("getTest res:",response.data.data);
            if (response.data) {
              // console.log("lalal",this.model)
              let scenariostrlen = 0;
              if(response.data.data.scenario){
                scenariostrlen = response.data.data.scenario.length;
              }
              let assetslist = [];
              if(response.data.data.assets != null){
                assetslist = response.data.data.assets;
              }
              let jmxpre = [];
              if(response.data.data.path){
                // 拆分为数组，获取脚本名
                jmxpre = response.data.data.path.split("/");
              }
              let jmxprelen = jmxpre.length;
              let jmxname = jmxpre[jmxprelen-1];
              console.log("22jmxname",jmxname)
              // 把脚本的名字放进附件的数组里
              if(jmxname!=undefined){
                assetslist.push(jmxname);
              }      
              // console.log("jmxname:",jmxname,jmxpre,jmxprelen);
              let scenariostr= "";
              for(let i = 0;i<scenariostrlen;i++){
                if(i==scenariostrlen-1)
                  scenariostr = scenariostr + response.data.data.scenario[i];
                else 
                  scenariostr = scenariostr + response.data.data.scenario[i]+"-"
              }
              this.model.name = response.data.data.name;
              this.model.scenario = scenariostr;//
              this.model.workid = response.data.data.work_ids;//workidstr;
              this.model.tags =response.data.data.tags;
              this.model.comment = response.data.data.comment;
              // console.log("22lalal",this.model.filenamelist,assetslist.length,assetslist)
              this.model.plist = response.data.data.plist;
              // console.log("chushi:",assetslist)
              for(let i=0;i<assetslist.length;i++){
                if(i==0){
                  this.model.filenamelist[0].filename = assetslist[0];
                }else{
                  this.model.filenamelist.push({filename:assetslist[i],});
                }
                // console.log("22222222",this.model.filenamelist)
              }
              // console.log("list:",this.model.filenamelist);
            }
          })
        }
        // console.log("1322222")
    },
  }
}
</script>
<style scoped>
</style>
