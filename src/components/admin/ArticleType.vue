<style scoped>
.admin-article-type {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
</style>
<template>
  <div class="admin-article-type">
    <Modal
      :loading="true"
      title="新增类别"
      v-model="showCreateMode"
      :mask-closable="false"
      @on-ok="createOk"
      @on-cancel="createCancel">
      <Form ref="newForm" :model="newForm" :rules="newFormValidate" :label-width="80">
        <FormItem label="名称" prop="name">
          <Input v-model="newForm.name" placeholder="请输入类别名称..."/>
        </FormItem>
        <FormItem label="作用域" prop="scope">
          <Select v-model="newForm.scope">
            <Option v-for="scope in scopes" v-if="scope.value !== ''" :value="scope.value" :key="scope.value">{{ scope.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="newForm.description" type="textarea" :autosize="{minRows: 5,maxRows: 15}" placeholder="请输入类别描述..."/>
        </FormItem>
      </Form>
    </Modal>
    <Breadcrumb :style="{marginBottom: '10px'}">
        <BreadcrumbItem>文章</BreadcrumbItem>
        <BreadcrumbItem>文章类别</BreadcrumbItem>
    </Breadcrumb>
    <Row :style="{marginBottom: '10px'}">
      <Col span="2">
        <Select v-model="filter.scope" style="width:90%;" placeholder="作用域">
          <Option v-for="scope in scopes" :value="scope.value" :key="scope.value">{{ scope.label }}</Option>
        </Select>
      </Col>
      <Col span="2">
        <Select v-model="filter.auditState" style="width:90%;" placeholder="审核状态">
          <Option v-for="auditState in auditStates" :value="auditState.value" :key="auditState.value">{{ auditState.label }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Input v-model="filter.name" style="width:90%;" placeholder="名称" />
      </Col>
      <Col span="6">
        <Input v-model="filter.description" style="width:90%;" placeholder="描述" />
      </Col>
      <Col span="2">
        <Button type="primary" @click="search">查询</Button>
      </Col>
      <Col span="6" :style="{textAlign: 'left'}">
        <Button type="success" @click="showCreateMode = true">新增</Button>
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
      showCreateMode: false,
      newForm: {
        name: '',
        description: '',
        scope: ''
      },
      newFormValidate: {
        name: [
          { required: true, message: '类别名称不能为空', trigger: 'blur' },
          { type: 'string', max: 10, message: '最大长度不得超过10个字', trigger: 'blur' }
        ],
        scope: [
          { required: true, message: '列别作用域不能为空', trigger: 'blur' },
          { type: 'string', max: 20, message: '最大长度不得超过20个字', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '类别描述不能为空', trigger: 'blur' },
          { type: 'string', max: 100, message: '最大长度不得超过100个字', trigger: 'blur' }
        ]
      },
      newScopes: [{
        value: 'OFFICIAL',
        label: '官方'
      }, {
        value: 'USER',
        label: '用户'
      }],
      scopes: [{
        value: '',
        label: '全部类别'
      }, {
        value: 'OFFICIAL',
        label: '官方'
      }, {
        value: 'USER',
        label: '用户'
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
      filter: {
        name: null,
        auditState: null,
        description: null,
        scope: null
      },
      tableColumns: [{
        title: 'id',
        key: 'id',
        fixed: 'left',
        width: 60
      }, {
        title: '名称',
        key: 'name',
        fixed: 'left',
        width: 100
      }, {
        title: '作用域',
        key: 'scope',
        width: 100,
        fixed: 'left'
      }, {
        title: '审核状态',
        key: 'auditState',
        fixed: 'left',
        width: 100
      }, {
        title: '引用次数',
        key: 'refCount',
        width: 100
      }, {
        title: '创建人ID',
        key: 'creatorId',
        width: 100
      }, {
        title: '描述',
        key: 'description',
        width: 300
      }, {
        title: '创建时间',
        key: 'createAt',
        width: 180
      }, {
        title: '更新时间',
        key: 'updateAt',
        width: 180
      }, {
        title: '操作',
        fixed: 'right',
        slot: 'action',
        width: 250,
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
      this.$http.post('/admin-rest/article/type-page', {
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
      this.$http.post('/admin-rest/article/type-audit-state', { id, is: pass }).then(res => {
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
    createOk () {
      this.$refs.newForm.validate((valid) => {
        if (!valid) {
          return
        }
        this.$Loading.start()
        this.$http.post('/admin-rest/article/type-add', this.newForm).then(res => {
          if (res.code !== 200) {
            this.$Loading.error()
            this.$Message.error(res.message)
            return
          }
          this.$refs.newForm.resetFields()
          this.showCreateMode = false
          this.$Loading.finish()
          this.$Message.success(res.message)
          this.tablePageNo = 1
          this.loadData()
        })
      })
    },
    createCancel () {
      this.$refs.newForm.resetFields()
    }
  },
  created () {
    document.title = '文章类别管理'
    this.tablePageNo = 1
    this.loadData()
  }
}
</script>
