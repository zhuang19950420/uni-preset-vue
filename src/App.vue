<script>
import "./extension/native";
import um from "./manager/userManager";
import versionChecker from "./manager/versionChecker";

export default {
  onLaunch: function () {
    console.log("App Launch");
    // 版本更新
    versionChecker.update();
    // um.getUserInfo().then(user => {
    //   const { authorized,mobileAuthorized,avatarUrl } = user
    //   if (!!authorized && !!mobileAuthorized && !!avatarUrl ) {
    //     uni.$router.switchTab({
    //       url: `pages/dashboard/dashboard`
    //     })
    //   } else {
    //     uni.$router.redirectTo({
    //       url:  `pages/login/login`
    //     })
    //   }
    // })
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  globalData: {
    isBoundObj: null,
    storeInfo: {
      storeName: "",
      storeNumber: "",
    },
    reportIds: null,
  },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "./style/page.common.scss";
</style>
