<template>
<n-config-provider :theme="darkTheme">
  <n-space>
    <n-button strong secondary round style="margin-top:4px;" color="#fff"  @click="changelanguage()">
      <template #icon>
        <n-icon><cash-icon /></n-icon>
      </template>
      {{ $t('headermenus.language') }}
    </n-button>
  </n-space>
</n-config-provider>
</template>
<script>
import { CashOutline as CashIcon } from "@vicons/ionicons5";
// import { defineComponent,ref } from "vue";
// import { useI18n } from "vue-i18n";
import { darkTheme  } from "naive-ui";
// import {DEFAULT_LANGUAGE, EN_US, TokenKey, ZH_CN, ZH_TW} from '@/common/js/constants';
// import {getCurrentUser} from "@/common/js/utils";

export default {
  name: "LanguageSwitch",
  data() {
    return {
    };
  },
  components: {
   CashIcon
  },
  props: {
    color: String
  },
  setup() {
    // const message = useMessage();
    return {
      darkTheme,
    };
  },
  created() {
  },
  methods: {
    changelanguage(){
    //   console.log("i18n ",this.$i18n.locale);
      if(this.$i18n.locale == 'en'){
        this.$i18n.locale = 'zh'
      }else{
        this.$i18n.locale = 'en'
      }
    }
  }
}
</script>

<style scoped>

</style>

