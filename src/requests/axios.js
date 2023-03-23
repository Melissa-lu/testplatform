import axios from "axios";
// import qs from "qs";

const service = axios.create({
    baseURL: '/api2', // 所有的请求地址前缀部分
    timeout: 60000, // 请求超时时间毫秒
    withCredentials: true, // 异步请求携带cookie
    // headers: {
    //     // 设置后端需要的传参类型
    //     'Content-Type': 'application/json',
    //     'Remote-User': 'Melissa.Lu', //Melissa.Lu',
    //     'Remote-Name': 'Melissa.Lu', //Melissa.Lu',Daniel.Feng
    //     'Remote-Groups': 'a,b,versionManager',
    //     // 'X-Frame-Options': 'allow-from http://47.97.179.77:8088/'
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
service.interceptors.response.use(
    response => {
        // console.log("!!!!!!!!!!!!response", response, response.data.code);
        if (response.status == 200) {
            if (response.data.code == 0) {
                flag = false;
                return Promise.resolve(response);
            } else if (response.data.code == undefined) {
                console.log("!!!!!!!!!!!!chongdingxiang ");
                if (flag == false) {
                    flag = true;
                    alert("登陆超时！点击确定后自动跳转登录页面,或者刷新页面立即跳转");
                    window.location = window.location.origin + "/authelia/?rd=" + window.location.href;
                }
                // if (confirm("登陆超时！5秒后自动跳转登录页面，点击确定立即跳转") == true) {
                //     // 做你想做的事
                //     window.location = 'https://qa.devfanruan.duckdns.org/';
                // } else {
                //     //	做你想做的事
                //     setTimeout(() => {
                //         window.location = 'https://qa.devfanruan.duckdns.org/';
                //     }, 5000);
                // }

                // window.location = 'https://qa.devfanruan.duckdns.org/';
            }

            // } else if (response.status == 302) {
            //     console.log("!!!response", response);
            //     return Promise.resolve(response);
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
        // console.log("error.response", error);
        if (typeof error.response === 'undefined') {
            // window.location = 'https://qa.devfanruan.duckdns.org/'
        } else {
            console.log("interceptors error", error);
            return Promise.reject(error)
        }

        // return Promise.reject(error)
    },
);
export default service
// export default {
//     post(url, data) {
//         return new Promise((resolve, reject) => {
//             axios({
//                     method: 'post',
//                     url,
//                     data: qs.stringify(data),
//                 })
//                 .then(res => {
//                     resolve(res.data)
//                 })
//                 .catch(err => {
//                     reject(err)
//                 });
//         })
//     },
//     get(url, data) {
//         return new Promise((resolve, reject) => {
//             axios({
//                     method: 'get',
//                     url,
//                     params: data,
//                 })
//                 .then(res => {
//                     resolve(res.data)
//                 })
//                 .catch(err => {
//                     reject(err)
//                 })
//         })
//     }
// };