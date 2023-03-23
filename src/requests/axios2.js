import axios from "axios";
// import qs from "qs";

const service2 = axios.create({
    baseURL: '/api3', // 所有的请求地址前缀部分
    timeout: 60000, // 请求超时时间毫秒
    withCredentials: true, // 异步请求携带cookie
    // headers: {
    //     // 设置后端需要的传参类型
    //     'Content-Type': 'application/json',
    //     'Remote-User': 'Melissa.Lu',
    //     'Remote-Name': 'Daniel123',
    //     'Remote-Groups': 'a,b,versionManager'
    // },
})


//post请求头
// axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
// 添加请求拦截器
// axios.interceptors.request.use(
//     config => {
//         return config;
//     },
//     error => {
//         return Promise.reject(error);
//     }
// );
var flag = false;
// 添加响应拦截器
service2.interceptors.response.use(
    response => {
        // console.log("!!!!!!!!!!!!response", response, response.data.code, flag);
        if (response.status == 200) {
            if (response.data.status == "success" || response.data.code == 0) {
                flag = false;
                return Promise.resolve(response);
            } else if (response.data.status == undefined || response.data.code == undefined) {
                console.log("!!!!!!!!!!!!chongdingxiang ");
                if (flag == false) {
                    flag = true;
                    alert("登陆超时！点击确定后自动跳转登录页面,或者刷新页面立即跳转");
                    window.location = window.location.origin + "/authelia/?rd=" + window.location.href;
                }
            }
        } else {
            console.log(response);
            return Promise.reject(response);
        }
    },
    // function(response) {
    //     console.log('返回结果：', response);
    //     return Promise.resolve(response);
    // },
    error => {
        console.log("error.response", error);
        if (typeof error.response === 'undefined') {
            // window.location = 'https://qa.devfanruan.duckdns.org/'
        } else {
            console.log("interceptors error", error);
            return Promise.reject(error)
        }

        // return Promise.reject(error)
    },
);
export default service2