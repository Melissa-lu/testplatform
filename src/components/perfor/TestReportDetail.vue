<template>
    <n-space vertical >
			<!-- 标题和按钮 -->
			<div style="padding:20px 30px 10px 20px !important;background-color: rgb(249, 249, 249);margin-bottom: -10px;
				font-weight:bold;font-size: 18px;color: #333;height: 35px;">
				<n-button text  @click="cancel" strong secondary style="float:left;line-height: 35px;margin-right: 20px;font-size: 18px;">
					<template #icon>
						<n-icon><IosArrowBack /></n-icon>
					</template>{{$t('perfor.report.back')}}
				</n-button>
				<div style="font-weight:bold;font-size: 18px;color: #333;float: left;line-height: 35px;">
					{{model.name??$t('common.create')}}
				</div>
				<n-button-group  style="float:left">
					<n-button quaternary @click="totask" type="primary" style="margin-left:20px;" >
						{{$t('perfor.report.totask')}}
					</n-button>
				</n-button-group>
				<n-button-group  style="float:right">
					<n-button v-if="model.status=='运行中'" @click="handlestop" type="error" strong secondary >
						{{$t('perfor.report.tostop')}}
					</n-button>
					<n-button v-if="model.status=='运行中'" @click="handlerefresh" type="info" strong secondary >
						{{$t('common.refresh')}}
					</n-button>
				</n-button-group>
			</div>
			<n-layout has-sider>
				<n-layout>
					<!-- 具体信息展示 -->
					<n-card class="showcard" hoverable  style="height:50px;margin-top: 20px;;"  >
						<!-- 运行状态 -->
						<div>
							<div  style="margin-top: -20px;">
								<div class="showitempre">{{$t('perfor.report.status')+ " : " }}</div>
								<div :class="['showitem',(model.status=='完成')?'completed':((model.status=='运行中')?'running':'error')]">{{model.status}}</div>
							</div>
						</div>
					</n-card>
					<!-- height:150px; -->
					<n-card  hoverable  style="margin-top: 10px;;" >
						<!-- 目前任务/中止时任务/error时任务 -->
						<div style="margin-top: -20px;">
							<div  class="showcard" v-if="model.status!='完成'">
								<div class="showitempre">
									{{ (model.status=="运行中"?($t('perfor.report.currentjob')):(model.status=="出错"?($t('perfor.report.errorjob')):($t('perfor.report.canceljob'))))+ " : " }}
								</div>
								<div class="showitem">{{model.currentjob.split(':')[1]}}</div>
							</div>
							<!-- 开始时间   执行时长 -->
							<div class="showcard">
								<div class="showitempre">{{$t('perfor.report.startdate')+ " : " }}</div>
								<div class="showitem" style="margin-right: 30%;">{{model.start_date}}</div>
								<div class="showitempre">{{$t('perfor.report.duration')+ " : " }}</div>
								<div class="showitem">{{model.duration}}</div>
							</div>
							<!-- 除running外的结束时间 -->
							<div class="showcard" v-if="model.status!='运行中'">
								<div class="showitempre">{{$t('perfor.report.enddate')+ " : " }}</div>
								<div class="showitem">{{model.end_date}}</div>
							</div>
							<!-- 此时的循环次数 -->
							<div class="showcard" v-if="model.status!='完成'">
								<div class="showitempre">
									{{(model.status=="运行中"?($t('perfor.report.currentloop')):(model.status=="出错"?($t('perfor.report.errorloop')):($t('perfor.report.cancelloop'))))+ " : " }}
								</div>
								<div class="showitem">{{model.currentloop}}</div>
							</div>
						</div>
					</n-card>
					<!-- 这边如果有了analysis_template 需要注意下v-if的条件 -->
					<n-card  hoverable v-if="model.status!='运行中'" style="min-height:100px;margin-top: 10px;padding-bottom: 20px;" >
						<!-- 分析模板--完成的和中止的 -->
						<div class="showcard" v-if="model.status=='完成'||model.status=='取消'">
							<div class="showitempre">{{$t('perfor.report.analysis_template')+ " : " }}</div>
							<div class="showitem">{{model.analysis_template}}</div>
							<n-button text  @click="tolink" strong secondary type="primary"
								style="">
								{{$t('perfor.report.analysis_template_url')}}
							</n-button>
						</div>
						<!-- 错误信息 -->
						<div class="showcard" v-if="model.status=='出错'">
							<div class="showitempre">{{$t('perfor.report.errormes')+ " : " }}</div>
							<div class="showitem">{{model.errormessage}}</div>
						</div>
					</n-card>
				</n-layout>
				<n-layout-sider style="border: 2px dashed #efeff5;margin: 20px 0px 0 10px;">
					<!-- 展示队列 -->
					<div style="">
						<!-- 小标题 -->
						<div class="queuetitle">
							{{$t('perfor.report.queuetitle')}}
						</div>
						<!-- 队列 -->
						<div style="padding:15px 20px;max-height: 600px;overflow: auto;">
							<template v-for="(item, index) in queuelist" :key="index"  >
								<n-button quaternary  style="display: flex;" :class="[((model.status=='运行中'||model.status=='出错'|| model.status=='取消') && model.current_index == index )?'running1':'']"
									:type="(model.status=='运行中' && model.current_index == index )?'success':(((model.status=='出错'||model.status=='取消')&& model.current_index == index)?'error':'tertiary')">
									<template #icon>
										<n-icon><KeyboardDoubleArrowRightSharp /></n-icon>
									</template>{{ item }}
								</n-button>
							</template>
						</div>
					</div>
				</n-layout-sider>
			</n-layout>
    </n-space>
  </template>
  
  <script>
  import { h, defineComponent, ref,nextTick ,getCurrentInstance,reactive,onMounted,onUnmounted  } from "vue";
  import { RouterLink,useRouter,useRoute  } from "vue-router";
  import { useI18n } from "vue-i18n";
  import { NIcon,NTag, NButton,useDialog,NDialogProvider,useMessage,NTooltip  } from "naive-ui";
  import service from '@/requests/axios';
	import { IosArrowBack } from "@vicons/ionicons4";
  import { KeyboardDoubleArrowRightSharp } from "@vicons/material"

  export default {
    name: "TestReportDetail",
    data() {
      return {
				queuelist :[],
				taskId:"",
      };
    },
    props: {
    },
    components: {
      IosArrowBack,KeyboardDoubleArrowRightSharp
    },
    created() {
      // let  to =this.$route
      // console.log(to);
    },
    setup() {
      const { t } = useI18n();
      const router = useRouter();
      const message = useMessage();
			const dialog = useDialog();
			const jmxlistRef =ref([]);
			const model = ref({
				id: "",
				status:"",
				// task_id:data1[i].task_id,
				start_date :"",
				currentjob:"",
        current_index:0,
				currentloop:0,
				duration :"",
				name: "",
				count: 0,
				end_date :"" ,
				analysis_template_url:"",//data1[i].nalysis_template_url,//分析模板的地址
				errormessage:"",
				typeselectvalue:"1",// 压测是1 ，换包是2
				select_list:[],// 队列
			});
      // 刷新执行时间的定时器
      function duration_timer(data1,index){
        return new Promise((resolve) => {
          let timer = setInterval(() =>{
            // 当前时间
            let nowtimes = new Date(Date.now());
            let start_date = new Date(data1.start_date);
            let durationtime = parseInt((nowtimes - start_date)/1000);
            let durationmin = parseInt(durationtime/60)>60?( parseInt(durationtime/3600)+"时"+(parseInt(durationtime/60)-parseInt(durationtime/3600)*60)):(parseInt(durationtime/60));
            let durationsec = parseInt(durationtime) % 60;
            let durationstr = durationmin+"分"+durationsec+"秒";
            // 之前直接改是有问题的，不知道为什么
            dataRef.value[index].duration = durationstr;
            // console.log("***************data1",data1.name,durationstr,durationsec,dataRef.value[index].duration);
            // resolve({
            //   data: durationstr
            // })
          }, 1000 );
          resolve({
            timer: timer,
          })
          
        })
      }
      // 刷新执行时间的定时器的上级，for循环 + 判断是否 running
      //  # # # # # 需要记录定时器id，方便销毁
      function duration_ing(data1){
        return new Promise((resolve) => {
          // 存计时器id的数组
          let timerlist = [];
          for(let i=0;i<data1.length;i++){
            // 如果是running，动态显示。如果是完成的，直接显示，就不走这个函数了
            if(data1[i].status=="running"){
              duration_timer(data1[i],i).then((data) => {
                let timeritem = data.timer;
                timerlist.push(timeritem);
              });   
            }
          }
          resolve({
            data: timerlist,
          })
        })
      }
			// 存脚本名称和脚本id对应关系的数组
			function query () {
				return new Promise((resolve) => {
					let jmxlist = [] ;//清空再赋值，不然每次查询会累加     
					service.get('/loadtest/scripts').then(res=>{
						if(res.data.code != 0){
						}else{
							let data1 = res.data.data;
							if(!data1){
								message.error(t("perfor.report.noreport"), { duration: 5000 })
							}else{
								for(let i=0;i<data1.length;i++){
									let jmxpre = [];
									if(data1[i].path){
										// 拆分为数组，获取脚本名
										jmxpre = data1[i].path.split("/");
									}
									let jmxprelen = jmxpre.length;
									let jmxname = jmxpre[jmxprelen-1];
									jmxlist.push({label:jmxname,value:data1[i].id});
								}
								// console.log("******jmxidlist1",jmxlist);
								resolve({
									data: jmxlist,//文档错误，文档为 pagedData
								})
							}
						}
					}).catch((err) =>{
						console.log("errrrrr",err); 
						if(err.response.status == 500)
							message.error( t("common.loaderr"), { duration: 5000 })
					});
					
				})
			}
      onMounted(() => {
        query().then((data) => { 
          jmxlistRef.value = data.data;
					console.log("******jmxlist2",jmxlistRef.value);
        })
      });
      // onUnmounted(() => {
      //   // 清除定时器
      //   for(let i=0;i<timerlistRef.value.length;i++){
      //     clearInterval(timerlistRef.value[i]);
      //   }
      // });
      return {
        duration_ing,
				model,
				dialog,
				message,
				jmxlist:jmxlistRef,
				t,
        rowKey (row) {
          return row.id
        },
				router,
				cancel(){
					router.push({
						path: '/perfor/testreport',
					});
				},
      };
    },
    watch: {
  
    },
    mounted() {
      // this.getgroup();
      this.$nextTick(function () {
				this.getTest(this.$route.params.reportId);
      })
    },
    computed: {
  
    },
    methods: {
      getTest(reportId) {
				let jmxidlist =[];
				service.get('/loadtest/task_reports/'+reportId).then(res=>{
					if(res.data.code != 0){
						//错误处理
						// reject({ status: 500, msg: 'error' })
					}else{
						let data1 = res.data.data;
						if(!data1){
							message.error(t("perfor.report.noreport"), { duration: 5000 })
						}else{
							let taskId = "";
							// 形成新的显示json
							// 转换下时分秒
							let durationmin = parseInt(data1.duration/60)>60?(parseInt(data1.duration/3600)+"时"+(parseInt(data1.duration/60)-parseInt(data1.duration/3600)*60)):(parseInt(data1.duration/60));
							let durationsec = data1.duration%60;
							let durationstr = durationmin+"分"+durationsec+"秒";
							this.model.id= data1.report_id;
							this.model.status=data1.status==0?"完成":(data1.status==1?"运行中":(data1.status==2?"出错":"取消"));
							// this.model.task_id=data1.task_id,
							this.model.start_date =data1.start_date;
							this.model.currentjob=data1.details.current_job??"获取异常";
							let aaa = 0;
							if(data1.status!=0){
								aaa = data1.details.current_index % (data1.details.exec_queue.length/data1.count);
							}
							this.model.current_index = aaa;
							if(data1.details.exec_queue){
								this.model.currentloop=(parseInt(data1.details.current_index/(data1.details.exec_queue.length/data1.count))+1)??"获取异常";
							}
							this.model.duration =durationstr;
							this.model.name= data1.name;
							this.model.count= data1.count;
							this.model.end_date =data1.end_date;
							this.model.errormessage=data1.details.error_message??"";
							taskId = data1.task_id;
							this.taskId = taskId;
							// 查找对应任务
							service.get('/loadtest/tasks/'+taskId).then(res=>{
								if (res.data) {
									let data1=res.data.data;
									// 只能一个个赋值，不然不生效，即使是一样的结构
									this.model.typeselectvalue = (data1.machine_id?"1":"2");
									// 如果是压测的定时任务
									if(this.model.typeselectvalue==1){
										// 队列部分
                    this.queuelist = [];
										let jmxname ="";
										let j=1;
										for(let i=0;i<data1.queue.length;i++){
											switch(data1.queue[i].job_id){
												case 1://脚本
													this.queuelist.push("脚本 "+j);
													if(jmxidlist.indexOf(data1.queue[i].script_id)==-1){
														jmxidlist.push(data1.queue[i].script_id);
													}
													j++;
													// j++;
													break;
												case 2://数据处理
													// this.queuelist.push("数据清洗");
													if(data1.queue[i].filter_name =="melissa" ){
														this.queuelist.push("数据清洗：melissa");
													}// 关闭
													else if(data1.queue[i].filter_name =="nofilter" ){
														this.queuelist.push("数据清洗：nofilter");
													}
													break;
												case 3://入库
                        this.queuelist.push("入库");
													break;
												case 4://重启 关闭 换包 等
													// 重启
													if(data1.queue[i].op ==3 ){
														this.queuelist.push("重启");
													}// 关闭
													else if(data1.queue[i].op ==2 ){
														this.queuelist.push("关闭");
													}// 换包
													else if(data1.queue[i].op ==4){
														this.queuelist.push("换包");
													}                 
													break;
												case 7://等待时间
													this.queuelist.push("等待："+data1.queue[i].wait_time+"秒");
													break;
											}
										}
                    console.log("******jmxidlist",jmxidlist,this.jmxlist,this.jmxlist.length);
										for(let i=0;i<this.jmxlist.length;i++){
											if(jmxidlist.indexOf(this.jmxlist[i].value)>-1){
												jmxname = jmxname + this.jmxlist[i].label +","
											}
										}
										console.log("******jmxname",jmxname);
										let url_name = "http://47.97.179.77:8088/webroot/decision/view/report?viewlet=analysis%252Fflier_bug.cpt&ref_t=design&op=write&ref_c=75c4c1d5-6680-4509-9d98-8771cbe8b31b&jmx="+jmxname;
										this.model.analysis_template_url=url_name;//分析模板的地址
										console.log("******urlname",this.model.analysis_template_url);
									}
								}
							})


						}
					}
				})
           
			},
			handlerefresh(){
				this.getTest(this.$route.params.reportId);
			},
			totask(){
				if(this.taskId){
					this.router.push({
						path: '/perfor/testtask/edit/'+this.taskId,
					});
				}
			},
			handlestop(){
				this.dialog.error({
					title:this.$t("common.cancel"),
					content: () => this.$t("perfor.report.ifsurecancel"),
					// action: () => "Action"
					positiveText: this.$t("common.sure"),
					negativeText: this.$t("common.cancel"),
					maskClosable: false,
					onMaskClick: () => {
						message.success( this.$t("common.checktips"))
					},
					onPositiveClick: () => {
						// d.loading = true;
						service.get('/loadtest/task_reports/'+this.$route.params.reportId+'/cancel').then(res=>{
							if(res.data.code != 0){
								//错误处理
								this.message.error(this.$t("perfor.report.cancelerr")+res.data.message?(" :"+res.data.message):"");
							}else{
								this.message.success(this.$t("perfor.report.cancelsuc"));
								location.reload() ; 
							}
						}).catch(e=>{
							// console.log("essrormessage",e.response.data);
							// alert(e.response.data);
							this.message.error(this.$t("perfor.report.cancelerr"));
						});
					}
				});
			},
			tolink(){
				window.open(this.model.analysis_template_url, "_blank");
			}
    }
  }
  </script>
  <style scoped>
	.showcard{
		font-size: 16px;
    /* color: #217037; */
    /* float: left; */
    line-height: 50px;
		min-height: 50px;
	}
	.showitempre{
		float: left;
		font-size: 16px;
	}
	.showitem{
    float: left;
    margin: 10px;
    padding: 0 20px;
    min-height: 30px;
    line-height: 30px;
	}
	.error{
		background-color: #f7dee3;
		color:#d03050;
	}
	.running{
		background-color: #daf0e4;
		color: #18a058;
	}
	.completed{
		background-color:#f9f9f9;
	}
  .running1{
    font-size: 20px;
  }
	.queuetitle{
		font-weight: bold;
    font-size: 16px;
    color: #416954;
    line-height: 30px;
    height: 30px;
    padding: 10px 20px;
    background-color: #f9f9f9;
		text-align: center;
		margin-left: 4px;
	}
  </style>
  