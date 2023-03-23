const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: 8080,
        proxy: {
            '/api2': {
                target: 'http://ip:port', // 主要的接口来源
                ws: true,
                secure: false, // false为http访问，true为https访问
                changeOrigin: true, // 跨域访问设置，true代表跨域
                pathRewrite: { // 路径改写规则
                    '^/api2': '' // 以/proxy/为开头的改写为''
                },
                // ws: false,
            },
            '/api3': {
                target: 'http://ip:port', // bug分析部分的接口服务器
                // ws: true,
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/api3': ''
                }
            },
            '/api4': {
                target: 'http://ip:port', // 工程管理的数据字典的接口服务器
                // ws: true,
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/api4': ''
                }
            },
        },
        allowedHosts: "all",
    },
})