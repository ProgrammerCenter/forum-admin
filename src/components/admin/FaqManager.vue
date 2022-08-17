<style scoped>
.admin-faq-manager {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
</style>
<template>
  <div class="admin-faq-manager">
    <Breadcrumb :style="{marginBottom: '10px'}">
        <BreadcrumbItem>问答管理</BreadcrumbItem>
    </Breadcrumb>
    <Row :style="{marginBottom: '10px'}">
      <Col span="2">
        <Select v-model="filter.auditState" style="width:90%;" placeholder="审核状态">
          <Option v-for="auditState in auditStates" :value="auditState.value" :key="auditState.value">{{ auditState.label }}</Option>
        </Select>
      </Col>
      <Col span="2">
        <Select v-model="filter.commentId" style="width:90%;" placeholder="是否解决">
          <Option v-for="commentId in commentIds" :value="commentId.value" :key="commentId.value">{{ commentId.label }}</Option>
        </Select>
      </Col>
      <Col span="2">
        <Input v-model="filter.userId" style="width:90%;" placeholder="作者ID" />
      </Col>
      <Col span="4">
        <Input v-model="filter.title" style="width:90%;" placeholder="标题" />
      </Col>
      <Col span="14">
        <Button type="primary" @click="search">查询</Button>
      </Col>
    </Row>
    <Table border :columns="tableColumns" :data="tableData">
      <template slot-scope="{ row, index }" slot="action">
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
      commentIds: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '未解决'
      }, {
        value: '2',
        label: '已解决'
      }],
      filter: {
        auditState: null,
        userId: null,
        title: null,
        commentId: null
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
        title: '是否解决',
        key: 'solutionDesc',
        width: 100
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
        width: 180,
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
      this.$http.post('/admin-rest/faq/page', {
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
    auditState (id, pass) {
      this.$Loading.start()
      this.$http.post('/admin-rest/faq/audit-state', { id, is: pass }).then(res => {
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
    document.title = '问答管理'
    this.tablePageNo = 1
    this.loadData()
  }
}
</script>
