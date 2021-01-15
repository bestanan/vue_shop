<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/avatar.jpg" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>

    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >

          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item 
              :index="subItem.path + ''" 
              v-for="subItem in item.children" 
              :key="subItem.id"
              @click="saveActivePath(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-mn_kongjian_fill',
        '101': 'iconfont icon-goodsfill',
        '102': 'iconfont icon-icon-dingdan',
        '145': 'iconfont icon-baobiao',
      },
      // 是否折叠菜单
      isCollapse: false,
      // 被激活的二级菜单地址 用于高亮
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 销毁 token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const result = await this.$http.get('menus')
      const { data: res } = result
      if(res.meta.status !== 200) {
        this.$message.console.error(res.meta.msg)
        return
      }
      this.menuList = res.data
      // console.log(this.menuList)
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存被激活的二级菜单地址
    saveActivePath(activePath) {
      this.activePath = activePath
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373D41;
  div {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    span {
      margin-left: 20px;
      color: #fff;
      font-size: 20px;
    }
  }  
}
.el-aside {
  background-color: #333744;
  // 解决导航栏展开后子菜单宽度多出 1px
  .el-menu {
    border-right: none;
  }
  .toggle-btn {
    text-align: center;
    background-color: #4a5064;
    color: #fff;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    letter-spacing: 1px;
    cursor: pointer;
  }
}
.el-main {
  background-color: #EAEDF1;
}

.iconfont {
  margin-right: 8px;
}
</style>