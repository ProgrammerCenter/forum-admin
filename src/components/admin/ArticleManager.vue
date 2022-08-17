<style scoped>
.admin-article-manager {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
</style>
<template>
  <div class="admin-article-manager">
    <Breadcrumb :style="{marginBottom: '10px'}">
        <BreadcrumbItem>文章</BreadcrumbItem>
        <BreadcrumbItem>文章管理</BreadcrumbItem>
    </Breadcrumb>
    <Row :style="{marginBottom: '10px'}">
      <Col span="4">
        <Select v-model="filter.typeId" style="width:90%;" placeholder="文章类别">
          <Option v-for="type in types" :value="type.value" :key="type.value">{{ type.label }}</Option>
        </Select>
      </Col>
      <Col span="2">
        <Select v-model="filter.auditState" style="width:90%;" placeholder="审核状态">
          <Option v-for="auditState in auditStates" :value="auditState.value" :key="auditState.value">{{ auditState.label }}</Option>
        </Select>
      </Col>
      <Col span="2">
        <Select v-model="filter.official" style="width:90%;" placeholder="是否官方">
          <Option v-for="official in officialTypes" :value="official.value" :key="official.value">{{ official.label }}</Option>
        </Select>
      </Col>
      <Col span="2">
        <Select v-model="filter.top" style="width:90%;" placeholder="是否置顶">
          <Option v-for="top in topTypes" :value="top.value" :key="top.value">{{ top.label }}</Option>
        </Select>
      </Col>
      <Col span="2">
        <Select v-model="filter.marrow" style="width:90%;" placeholder="是否加精">
          <Option v-for="marrow in marrowTypes" :value="marrow.value" :key="marrow.value">{{ marrow.label }}</Option>
        </Select>
      </Col>
      <Col span="2">
        <Input v-model="filter.userId" style="width:90%;" placeholder="作者ID" />
      </Col>
      <Col span="4">
        <Input v-model="filter.title" style="width:90%;" placeholder="标题" />
      </Col>
      <Col span="6">
        <Button type="primary" @click="search">查询</Button>
      </Col>
    </Row>
    <Table border :columns="tableColumns" :data="tableData">
      <template slot-scope="{ row, index }" slot="action">
        <Button v-if="row.official" type="error" size="small" @click="official(row.id, false)">非官方</Button>
        <Button v-if="!row.official" type="success" size="small" @click="official(row.id, true)">官方</Button>

        <Button v-if="row.top" type="error" size="small" @click="top(row.id, false)">非置顶</Button>
        <Button v-if="!row.top" type="success" size="small" @click="top(row.id, true)">置顶</Button>

        <Button v-if="row.marrow" type="error" size="small" @click="marrow(row.id, false)">非加精</Button>
        <Button v-if="!row.marrow" type="success" size="small" @click="marrow(row.id, true)">加精</Button>

        <Button v-if="row.auditState === '待审核' || row.auditState === '审核通过'" type="error" size="small" @click="auditState(row.id, false)">审核不通过</Button>
        <Button v-if="row.auditState === '待审核' || row.auditState === '审核拒绝'" type="success" size="small" @click="auditState(row.id, true)">审核通过</Button>
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
        label: '全部类别'
      }],
      auditStates: [{
        value: '',
        label: '全部状态'
      }, {
        value: 'WAIT',
        label: '待审核'
      }, {
        value: 'PASS',
        label: '审核通过'
      }, {
        value: 'REJECT',
        label: '审核拒绝'
      }],
      officialTypes: [{
        value: '',
        label: '全部'
      }, {
        value: 'true',
        label: '官方'
      }, {
        value: 'false',
        label: '非官方'
      }],
      topTypes: [{
        value: '',
        label: '全部'
      }, {
        value: 'true',
        label: '置顶'
      }, {
        value: 'false',
        label: '未置顶'
      }],
      marrowTypes: [{
        value: '',
        label: '全部'
      }, {
        value: 'true',
        label: '加精'
      }, {
        value: 'false',
        label: '未加精'
      }],
      filter: {
        typeId: null,
        auditState: null,
        official: null,
        top: null,
        marrow: null,
        userId: null,
        title: null
      },
      tableColumns: [{
        title: 'id',
        key: 'id',
        fixed: 'left',
        width: 60
      }, {
        title: '作者id',
        key: 'authorId',
        fixed: 'left',
        width: 80
      }, {
        title: '头像',
        key: 'authorAvatar',
        width: 70,
        fixed: 'left',
        render: (h, params) => {
          return h('Avatar', {
            props: {
              src: params.row.authorAvatar
            }
          }, params.row.authorNickname)
        }
      }, {
        title: '作者昵称',
        key: 'authorNickname',
        fixed: 'left',
        width: 100
      }, {
        title: '官方',
        key: 'official',
        width: 80,
        render: (h, params) => {
          return h('div', params.row.official ? '官方' : '非官方')
        }
      }, {
        title: '置顶',
        key: 'top',
        width: 80,
        render: (h, params) => {
          return h('div', params.row.top ? '置顶' : '未置顶')
        }
      }, {
        title: '加精',
        key: 'marrow',
        width: 80,
        render: (h, params) => {
          return h('div', params.row.marrow ? '加精' : '未加精')
        }
      }, {
        title: '审核状态',
        key: 'auditState',
        width: 100
      }, {
        title: '标题',
        key: 'title',
        width: 180
      }, {
        title: '浏览量',
        key: 'views',
        width: 80
      }, {
        title: '点赞量',
        key: 'approvals',
        width: 80
      }, {
        title: '评论量',
        key: 'comments',
        width: 80
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
        width: 280,
        align: 'center'
      }],
      tableData: [],
      tableTotal: 0,
      tablePageSize: 10,
      tablePageNo: 1
    }
  },
  methods: {
    loadTypes () {
      this.$Loading.start()
      this.$http.post('/admin-rest/article/all-type', {}).then(res => {
        if (res.code !== 200) {
          this.$Message.error(res.message)
          this.$Loading.error()
          return
        }
        this.$Loading.finish()
        res.data.forEach(type => {
          this.types.push({
            value: type.id,
            label: type.name
          })
        })
      })
    },
    loadData () {
      this.$Loading.start()
      this.$http.post('/admin-rest/article/page', {
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
    official (id, is) {
      this.$Loading.start()
      this.$http.post('/admin-rest/article/official', { id, is }).then(res => {
        if (res.code !== 200) {
          this.$Message.error(res.message)
          this.$Loading.error()
          return
        }
        this.$Loading.finish()
        this.$Message.success(res.message)
        this.loadData()
      })
    },
    top (id, is) {
      this.$Loading.start()
      this.$http.post('/admin-rest/article/top', { id, is }).then(res => {
        if (res.code !== 200) {
          this.$Message.error(res.message)
          this.$Loading.error()
          return
        }
        this.$Loading.finish()
        this.$Message.success(res.message)
        this.loadData()
      })
    },
    marrow (id, is) {
      this.$Loading.start()
      this.$http.post('/admin-rest/article/marrow', { id, is }).then(res => {
        if (res.code !== 200) {
          this.$Message.error(res.message)
          this.$Loading.error()
          return
        }
        this.$Loading.finish()
        this.$Message.success(res.message)
        this.loadData()
      })
    },
    auditState (id, pass) {
      this.$Loading.start()
      this.$http.post('/admin-rest/article/audit-state', { id, is: pass }).then(res => {
        if (res.code !== 200) {
          this.$Message.error(res.message)
          this.$Loading.error()
          return
        }
        this.$Loading.finish()
        this.$Message.success(res.message)
        this.loadData()
      })
    }
  },
  created () {
    document.title = '文章管理'
    this.tablePageNo = 1
    this.loadData()
    this.loadTypes()
  }
}
</script>
