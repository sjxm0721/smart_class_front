<!--<template>-->
<!--  <div :class="{'has-logo':showLogo}">-->
<!--    <logo v-if="showLogo" :collapse="isCollapse" />-->
<!--    <div class="true-logo">-->
<!--      <img src="https://sky-take-out-sjxm.oss-cn-hangzhou.aliyuncs.com/zjsu.jpg" alt="">-->
<!--    </div>-->
<!--    <el-scrollbar wrap-class="scrollbar-wrapper">-->
<!--      <el-menu-->
<!--        :default-active="activeMenu"-->
<!--        :collapse="isCollapse"-->
<!--        :background-color="variables.menuBg"-->
<!--        :text-color="variables.menuText"-->
<!--        :unique-opened="false"-->
<!--        :active-text-color="variables.menuActiveText"-->
<!--        :collapse-transition="false"-->
<!--        mode="vertical"-->
<!--      >-->
<!--        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />-->
<!--      </el-menu>-->
<!--    </el-scrollbar>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { mapGetters } from 'vuex'-->
<!--import Logo from './Logo'-->
<!--import SidebarItem from './SidebarItem'-->
<!--import variables from '@/styles/variables.scss'-->

<!--export default {-->
<!--  components: { SidebarItem, Logo },-->
<!--  computed: {-->
<!--    ...mapGetters([-->
<!--      'sidebar'-->
<!--    ]),-->
<!--    routes() {-->
<!--      return this.$router.options.routes-->
<!--    },-->
<!--    activeMenu() {-->
<!--      const route = this.$route-->
<!--      const { meta, path } = route-->
<!--      // if set path, the sidebar will highlight the path you set-->
<!--      if (meta.activeMenu) {-->
<!--        return meta.activeMenu-->
<!--      }-->
<!--      return path-->
<!--    },-->
<!--    showLogo() {-->
<!--      return this.$store.state.settings.sidebarLogo-->
<!--    },-->
<!--    variables() {-->
<!--      return variables-->
<!--    },-->
<!--    isCollapse() {-->
<!--      return !this.sidebar.opened-->
<!--    }-->
<!--  },-->
<!--}-->
<!--</script>-->

<!--<style>-->
<!--  .true-logo{-->
<!--    width: 100%;-->
<!--    height:100px;-->
<!--  }-->
<!--  .true-logo img{-->
<!--    width: 100%;-->
<!--    height: 100%;-->
<!--  }-->
<!--</style>-->
