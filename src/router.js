// import Vue from "vue";
// import VueRouter from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';

// import User from './components/per/User.vue'
// import User2 from './components/per2/User2.vue'
// import UserHome from './components/per/UserHome.vue'
// import UserPosts from './components/per/UserPosts.vue'
// import UserTest from "./components/per2/UserTest.vue";
import PerforIndex from './components/perfor/Pindex.vue'
import PerforScript from './components/perfor/Script.vue'
import PerforScriptEdit from './components/perfor/ScriptEdit.vue'
import PerforTestAnalysis from './components/perfor/TestAnalysis.vue'
import PerforTestReport from './components/perfor/TestReport.vue'
import PerforTestReportDetail from './components/perfor/TestReportDetail.vue'
import PerforTestTask from './components/perfor/TestTask.vue'
import PerforTestTaskEdit from './components/perfor/TestTaskEdit.vue'
import Findex from './components/function/Findex.vue'
import BloodRate from './components/function/BloodRate.vue'
import BloodRateBi from "./components/function/BloodRateBi.vue";
import BloodRateFr from "./components/function/BloodRateFr.vue";
import VersionIndex from './components/version/Vindex.vue'
import VersionEngineMangeIndex from './components/version/enginemanage/VEindex.vue'
import VersionEngineMangeDatabase from './components/version/enginemanage/Database.vue'
import VersionEngineMangeDatabaseEdit from './components/version/enginemanage/DatabaseEdit.vue'
import VersionEngineMangeServer from './components/version/enginemanage/Server.vue'
import VersionEngineMangeServerEdit from './components/version/enginemanage/ServerEdit.vue'
import VersionEngineMangeTomcat from './components/version/enginemanage/Tomcat.vue'
import VersionEngineMangeTomcatEdit from './components/version/enginemanage/TomcatEdit.vue'
import VersionTaskNodeIndex from './components/version/tasknode/Tindex.vue'
import VersionNodeIndex from './components/version/versionnode/VVindex.vue'
import VersionNodeEdit from './components/version/versionnode/VersionEdit.vue'
import VersionIterate from './components/version/iterate/VIindex.vue'
import VersionIterateedit from './components/version/iterate/IterateEdit.vue'
import VersionEfficiencyIndex from './components/version/eefficiency/Efficiency.vue'
import VersionDefectIndex from './components/version/defect/Dindex.vue'
import VersionPersonalIndex from './components/version/personal/VPersonal.vue'
// const Maindemo =
//     import ("./components/Maindemo.vue")
// Vue.use(VueRouter);

const router = createRouter({
    history: createWebHistory(),
    mode: 'history',
    routes: [{
            path: "/",
            // component: PerTest,
            redirect: '/function/bloodrate',
        },
        {
            path: '/perfor',
            name: 'perfor',
            redirect: '/perfor/script',
            component: PerforIndex,
            children: [{
                    path: 'script',
                    component: PerforScript,
                    name: "perforscript",
                },
                { path: 'script/create', name: 'scriptCreate', component: PerforScriptEdit },
                {
                    path: 'script/edit/:scriptIdkey',
                    name: 'scriptEdit',
                    component: PerforScriptEdit,
                    props: true,
                },
                { path: 'testtask', name: "perfortesttask", component: PerforTestTask },
                { path: 'testtask/create', name: 'taskCreate', component: PerforTestTaskEdit },
                {
                    path: 'testtask/edit/:taskId',
                    name: 'taskEdit',
                    component: PerforTestTaskEdit,
                    props: true,
                },
                { path: 'testreport', component: PerforTestReport, name: "Perfortestreport" },
                {
                    path: 'testreport/:reportId',
                    name: 'taskDetail',
                    component: PerforTestReportDetail,
                    props: true,
                },
                { path: 'testanalysis', component: PerforTestAnalysis, name: "Perfortestanalysis" },
            ],
        },
        {
            path: '/version',
            name: 'version',
            redirect: "/version/engine",
            component: VersionIndex,
            children: [{
                    path: 'engine',
                    name: 'enginemange',
                    redirect: "/version/engine/tomcat",
                    component: VersionEngineMangeIndex,
                    children: [
                        { path: 'database', name: 'database', component: VersionEngineMangeDatabase },
                        { path: 'database/create', name: 'databaseCreate', component: VersionEngineMangeDatabaseEdit },
                        {
                            path: 'database/edit/:databaseId',
                            name: 'databaseEdit',
                            component: VersionEngineMangeDatabaseEdit,
                            props: true,
                        },
                        { path: 'server', name: 'server', component: VersionEngineMangeServer },
                        { path: 'server/create', name: 'serverCreate', component: VersionEngineMangeServerEdit },
                        {
                            path: 'server/edit/:serverId',
                            name: 'serverEdit',
                            component: VersionEngineMangeServerEdit,
                            props: true,
                        },
                        { path: 'tomcat', name: 'tomcat', component: VersionEngineMangeTomcat },
                        { path: 'tomcat/create', name: 'tomcatCreate', component: VersionEngineMangeTomcatEdit },
                        {
                            path: 'tomcat/edit/:tomcatId',
                            name: 'tomcatEdit',
                            component: VersionEngineMangeTomcatEdit,
                            props: true,
                        },
                    ]
                },
                {
                    path: 'task',
                    name: 'task',
                    component: VersionTaskNodeIndex,
                    children: []
                },
                {
                    path: 'version',
                    name: 'vversion',
                    component: VersionNodeIndex,
                },
                {
                    path: 'version/create',
                    name: 'versionCreate',
                    component: VersionNodeEdit
                },
                {
                    path: 'version/edit/:versionId',
                    name: 'versionEdit',
                    component: VersionNodeEdit,
                    props: true,
                },
                {
                    path: 'iterate',
                    name: 'iterate',
                    component: VersionIterate,
                },
                {
                    path: 'iterate/create',
                    name: 'iterateCreate',
                    component: VersionIterateedit
                },
                {
                    path: 'iterate/edit/:iterateId/:finished',
                    name: 'iterateEdit',
                    component: VersionIterateedit,
                    props: true,
                },
                {
                    path: 'efficiency',
                    name: 'efficiency',
                    component: VersionEfficiencyIndex,
                },
                {
                    path: 'defect',
                    name: 'defect',
                    component: VersionDefectIndex,
                },
                {
                    path: 'personal',
                    name: 'personal',
                    component: VersionPersonalIndex,
                }
            ],
        },
        {
            path: '/function',
            name: 'function',
            redirect: '/function/bloodrate',
            component: Findex,
            children: [{
                    path: 'bloodrate',
                    name: "bloodrate",
                    component: BloodRate,
                },
                {
                    path: 'bi',
                    name: "bloodratebi",
                    component: BloodRateBi,
                },
                {
                    path: 'fr',
                    name: "bloodratefr",
                    component: BloodRateFr,
                },
            ],
        },

    ],


});

// router.beforeEach((to, from, next) => {

//     redirectLoginPath(to.fullPath);

//     //解决localStorage清空，cookie没失效导致的卡死问题
//     if (!localStorage.getItem('Admin-Token')) {
//         // axios.get("/signout");
//         // console.log("signout");
//         localStorage.setItem('Admin-Token', "{}");
//         window.location.href = "/login";
//         next();
//     } else {
//         next();
//     }
// });

// //重复点击导航路由报错
// const routerPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//     return routerPush.call(this, location).catch(error => error);
// };


// // 登入后跳转至原路径
// function redirectLoginPath(originPath) {
//     let redirectUrl = sessionStorage.getItem('redirectUrl');
//     let loginSuccess = sessionStorage.getItem('loginSuccess');
//     sessionStorage.setItem('redirectUrl', originPath);
//     // 换一个用户登录同一个浏览器，跳转到 /
//     if (getCurrentUserId() !== sessionStorage.getItem('lastUser')) {
//         sessionStorage.setItem('lastUser', getCurrentUserId());
//         redirectUrl = '/';
//     }
//     if (redirectUrl && loginSuccess) {
//         sessionStorage.removeItem('loginSuccess');
//         router.push(redirectUrl);
//     }
//     sessionStorage.removeItem('loginSuccess');
// }


export default router;