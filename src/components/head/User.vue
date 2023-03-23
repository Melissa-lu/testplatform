<template>
<n-config-provider :theme="darkTheme">
  <n-space>
    <n-dropdown
      :options="options"
      placement="bottom-start"
      trigger="hover"
      @select="handleSelect"
    >
      <n-button strong secondary style="margin-top:4px;" color="#fff" >
        {{username}}
      </n-button>
    </n-dropdown>
  </n-space>
</n-config-provider>
</template>
<script>
import { darkTheme, useMessage  } from "naive-ui";
import { h, defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import service from '../../requests/axios';

export default {
  name: "User",
  data() {
    return {
      // username:"aaa",
    };
  },
  components: {
  },
  props: {
    color: String,
    username:String,
  },
  setup() {
    const message = useMessage();
    const { t } = useI18n();
    // var username = "";
    const options = [
      {
        label: t("headermenus.logout"),
        key: "logout"
      },
    ];
    return {
      darkTheme,
      options,
      handleSelect(key) {
        // message.info(String(key));
        // 如果要退出
        if(key == "logout"){
          service.get('/user/logout').then(res=>{
            // 登出的操作
            let tourl = res.data.data.redirect_url ;
            console.log("tourl",tourl);
            // location.reload() ;
            window.open(window.location.origin + tourl, "_self");
          }).catch(e=>{
            // console.log("essrormessage",e.response.data);
            // alert(e.response.data);
          });
        }
      }
    };
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>

