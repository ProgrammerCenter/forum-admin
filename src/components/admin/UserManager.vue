<style scoped>
.admin-user {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
</style>
<template>
  <div class="admin-user">
    <Breadcrumb :style="{marginBottom: '10px'}">
        <BreadcrumbItem>用户</BreadcrumbItem>
        <BreadcrumbItem>用户管理</BreadcrumbItem>
    </Breadcrumb>
    <Row :style="{marginBottom: '10px'}">
      <Col span="4">
        <Select v-model="filter.role" style="width:90%;" placeholder="用户角色">
          <Option v-for="role in roles" :value="role.value" :key="role.value">{{ role.label }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Select v-model="filter.state" style="width:90%;" placeholder="用户状态">
          <Option v-for="state in states" :value="state.value" :key="state.value">{{ state.label }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Input v-model="filter.nickname" style="width:90%;" placeholder="昵称" />
      </Col>
      <Col span="4">
        <Input v-model="filter.email" style="width:90%;" placeholder="邮箱" />
      </Col>
      <Col span="8">
        &nbsp;&nbsp;&nbsp;<Button type="primary" @click="search">查询</Button>
      </Col>
    </Row>
    <Table border :columns="tableColumns" :data="tableData">
      <template slot-scope="{ row, index }" slot="action">
        <Button v-if="row.state === '禁用'" type="success" size="small" @click="enable(row)">启用</Button>
        <Button v-if="row.state !== '禁用'" type="error" size="small" @click="disable(row)">禁用</Button>

        <Button v-if="row.role === '用户'" type="success" size="small" @click="updateRole(row.id, true)">设为管理员</Button>
        <Button v-if="row.role === '管理员'" type="error" size="small" @click="updateRole(row.id, false)">设为用户</Button>
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
      roles: [{
        value: '',
        label: '全部用户'
      }, {
        value: 'SUPER_ADMIN',
        label: '超级管理员'
      }, {
        value: 'ADMIN',
        label: '管理员'
      }, {
        value: 'USER',
        label: '普通用户'
      }],
      states: [{
        value: '',
        label: '全部状态'
      }, {
        value: 'ENABLE',
        label: '启用'
      }, {
        value: 'DISABLE',
        label: '禁用'
      }, {
        value: 'UN_ACTIVATION',
        label: '未激活'
      }],
      filter: {
        email: null,
        nickname: null,
        role: null,
        state: null
      },
      tableColumns: [{
        title: 'id',
        key: 'id',
        fixed: 'left',
        width: 60
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
        title: '角色',
        key: 'role',
        width: 80
      }, {
        title: '性别',
        key: 'sex',
        width: 70
      }, {
        title: '状态',
        key: 'state',
        width: 80
      }, {
        title: '描述',
        key: 'signature',
        width: 300
      }, {
        title: '创建时间',
        key: 'createAt',
        width: 150
      }, {
        title: '更新时间',
        key: 'updateAt',
        width: 150
      }, {
        title: '操作',
        fixed: 'right',
        slot: 'action',
        width: 200,
        align: 'center'
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
      this.$http.post('/admin-rest/user/page', {
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
    },
    updateRole (id, is) {
      this.$Loading.start()
      this.$http.post(`/admin-rest/user/update-role`, { id, is }).then(res => {
        if (res.code !== 200) {
          this.$Loading.error()
          this.$Message.error(res.message)
          return
        }
        this.$Loading.finish()
        this.$Message.success(res.message)
        this.loadData()
      })
    }
  },
  created () {
    document.title = '用户管理'
    this.tablePageNo = 1
    this.loadData()
  }
}
</script>
