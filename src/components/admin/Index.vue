<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
<template>
  <div class="admin" :style="{height: containerHeight}">
    <Layout :style="{height: '100%'}">
      <Sider
        ref="side1"
        hide-trigger
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
      >
        <Menu
          active-name="home"
          theme="dark"
          width="auto"
          :class="menuitemClasses"
          @on-select="menuSelect"
        >
          <MenuItem name="home">
            <Icon type="ios-home" />
            <span>首页</span>
          </MenuItem>
          <Submenu name="user">
            <template slot="title">
                <Icon type="ios-man" />
                <span>用户</span>
            </template>
            <MenuItem name="user-manager">用户管理</MenuItem>
            <MenuItem name="user-opt-log">操作日志</MenuItem>
          </Submenu>
          <Submenu name="article">
            <template slot="title">
                <Icon type="ios-paper" />
                <span>文章</span>
            </template>
            <MenuItem name="article-manager">文章管理</MenuItem>
            <MenuItem name="article-type">文章类别</MenuItem>
          </Submenu>
          <MenuItem name="faq-manager">
            <Icon type="ios-help-circle" />
            <span>问答管理</span>
          </MenuItem>
          <Submenu name="config">
            <template slot="title">
                <Icon type="ios-paper" />
                <span>配置</span>
            </template>
            <MenuItem name="tag-manager">标签管理</MenuItem>
            <MenuItem name="config-carousel">轮播图配置</MenuItem>
          </Submenu>
        </Menu>
      </Sider>
      <Layout>
        <Header :style="{ padding: 0 }" class="layout-header-bar">
          <Icon
            @click.native="collapsedSider"
            :class="rotateIcon"
            :style="{ margin: '0 20px' }"
            type="md-menu"
            size="24"
          ></Icon>
        </Header>
        <Content :style="{ margin: '20px', padding: '20px', background: '#fff', minHeight: '260px' }">
          <router-view/>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isCollapsed: false,
      containerHeight: '500px'
    }
  },
  computed: {
    rotateIcon () {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    },
    menuitemClasses () {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    }
  },
  methods: {
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
    },
    menuSelect (name) {
      if (location.href.endsWith(name)) {
        return
      }
      if (name === 'home') {
        this.$router.push('/admin/')
      } else {
        this.$router.push('/admin/' + name)
      }
    }
  },
  created () {
    let allHeight = window.innerHeight
    this.containerHeight = allHeight + 'px'
  }
}
</script>
