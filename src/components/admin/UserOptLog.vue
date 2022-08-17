<style scoped>
.admin-user {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
</style>
<template>
  <div class="admin-user-opt-log">
    <Breadcrumb :style="{marginBottom: '10px'}">
        <BreadcrumbItem>用户</BreadcrumbItem>
        <BreadcrumbItem>操作日志</BreadcrumbItem>
    </Breadcrumb>
    <Row :style="{marginBottom: '10px'}">
      <Col span="4">
        <Select v-model="filter.type" style="width:90%;" placeholder="操作类型">
          <Option v-for="type in types" :value="type.value" :key="type.value">{{ type.label }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Input v-model="filter.operatorId" style="width:90%;" placeholder="操作人ID" />
      </Col>
      <Col span="16">
        &nbsp;&nbsp;&nbsp;<Button type="primary" @click="search">查询</Button>
      </Col>
    </Row>
    <Table border :columns="tableColumns" :data="tableData">
      <template slot-scope="{ row, index }" slot="action">
        <Button v-if="row.state === '禁用'" type="success" size="small" @click="enable(row)">启用</Button>
        <Button v-if="row.state !== '禁用'" type="error" size="small" @click="disable(row)">禁用</Button>
      </template>
    </Table>
    <Page
      :total="tableTotal"
      show-total
      show-sizer
      :page-size="tablePageSize"
      :page-size-opts="[10, 20, 30, 40]"
      @on-change="goPage"
      @on-page-size-change="pageSizeChange"
      :style="{marginTop: '10px', textAlign: 'right'}" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      types: [{
        value: '',
        label: '全部类型'
      }, {
        value: 'USER_LOGIN',
        label: '用户登录'
      }, {
        value: 'USER_LOGOUT',
        label: '用户登出'
      }, {
        value: 'USER_REGISTER',
        label: '用户注册'
      }],
      filter: {
        operatorId: null,
        type: null
      },
      tableColumns: [{
        title: '用户id',
        key: 'userId',
        fixed: 'left',
        width: 80
      }, {
        title: '头像',
        key: 'avatar',
        width: 70,
        fixed: 'left',
        render: (h, params) => {
          return h('Avatar', {
            props: {
              src: params.row.avatar
            }
          }, params.row.nickname)
        }
      }, {
        title: '邮箱',
        key: 'email',
        fixed: 'left',
        width: 180
      }, {
        title: '昵称',
        key: 'nickname',
        width: 100
      }, {
        title: '操作类型',
        key: 'type',
        width: 150
      }, {
        title: '内容',
        key: 'content',
        width: 800
      }, {
        title: '操作时间',
        key: 'createAt',
        fixed: 'right',
        width: 150
      }],
      tableData: [],
      tableTotal: 0,
      tablePageSize: 10,
      tablePageNo: 1
    }
  },
  methods: {
    loadData () {
      this.$Loading.start()
      this.$http.post('/admin-rest/user/page-opt-log', {
        pageSize: this.tablePageSize,
        pageNo: this.tablePageNo,
        filter: this.filter
      }).then(res => {
        if (res.code !== 200) {
          this.$Message.error(res.message)
          this.$Loading.error()
          return
        }
        this.$Loading.finish()
        this.tableData = res.data.list
        this.tableTotal = res.data.total
      })
    },
    search () {
      this.tablePageNo = 1
      this.loadData()
    },
    goPage (pageNo) {
      this.tablePageNo = pageNo
      this.loadData()
    },
    pageSizeChange (pageSize) {
      this.tablePageSize = pageSize
      this.tablePageNo = 1
      this.loadData()
    },
    enable (row) {
      this.updateState('enable', row.id)
    },
    disable (row) {
      this.updateState('disable', row.id)
    },
    updateState (path, id) {
      this.$Loading.start()
      this.$http.post(`/admin-rest/user/${path}/${id}`, {}).then(res => {
        if (res.code !== 200) {
          this.$Loading.error()
          return
        }
        this.$Loading.finish()
        this.$Message.success('更新状态成功!')
        this.loadData()
      })
    }
  },
  created () {
    document.title = '操作日志管理'
    this.tablePageNo = 1
    this.loadData()
  }
}
</script>
