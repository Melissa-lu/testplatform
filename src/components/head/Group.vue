<template>
<n-config-provider :theme="darkTheme">
  <n-space>
    <n-dropdown
      :options="groupoptions"
      placement="bottom-start"
      trigger="hover"
      @select="handleSelect"
    >
      <n-button strong secondary style="margin-top:4px;" color="#fff" >
        {{group}} <!--// 当前用户组 -->
      </n-button>
    </n-dropdown>
  </n-space>
</n-config-provider>
</template>
<script>
import { darkTheme, useMessage  } from "naive-ui";
import { h, defineComponent } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "Group",
  data() {
    return {
      // username:"aaa",
    };
  },
  components: {
  },
  props: {
    color: String,
    group:Array,
  },
  setup() {
    const message = useMessage();
    const { t } = useI18n();
    // var username = "";
    const groupoptions = [];//待获取
    return {
      darkTheme,
      groupoptions,
      handleSelect(key) {
        // message.info(String(key));
        // 如果要切换
        // if(key == "logout"){
        //   service.get('/user/logout').then(res=>{
        //     // 登出的操作
        //   }).catch(e=>{
        //     // console.log("essrormessage",e.response.data);
        //     // alert(e.response.data);
        //   });
        // }
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

