<style scoped>
.admin-faq-manager {
  width: 100%;
  height: 100%;
  overflow: scroll;
}
</style>
<template>
  <div class="admin-config-carousel">
    <Modal
      :loading="true"
      title="新增轮播图"
      v-model="showCreateMode"
      :mask-closable="false"
      @on-ok="createOk"
      @on-cancel="createCancel">
      <Form ref="newForm" :model="newForm" :rules="newFormValidate" :label-width="80">
        <FormItem label="类型" prop="type">
          <Select v-model="newForm.type">
            <Option v-for="type in types" v-if="type.value !== ''" :value="type.value" :key="type.value">{{ type.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="newForm.name" placeholder="请输入名称..."/>
        </FormItem>
        <FormItem label="图片地址" prop="imgUrl">
          <Input v-model="newForm.imgUrl" placeholder="请输入图片地址..."/>
        </FormItem>
        <FormItem label="跳转连接" prop="actionUrl">
          <Input v-model="newForm.actionUrl" placeholder="请输入跳转连接..."/>
        </FormItem>
        <FormItem label="生效时间">
          <Row>
            <Col span="11">
              <DatePicker type="date" placeholder="开始日期" v-model="newForm.startAt"></DatePicker>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <DatePicker type="date" placeholder="结束日期" v-model="newForm.endAt"></DatePicker>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
    <Breadcrumb :style="{marginBottom: '10px'}">
        <BreadcrumbItem>配置</BreadcrumbItem>
        <BreadcrumbItem>轮播图配置</BreadcrumbItem>
    </Breadcrumb>
    <Row :style="{marginBottom: '10px'}">
      <Col span="2">
        <Select v-model="filter.state" style="width:90%;" placeholder="审核状态">
          <Option v-for="state in states" :value="state.value" :key="state.value">{{ state.label }}</Option>
        </Select>
      </Col>
      <Col span="2">
        <Select v-model="filter.type" style="width:90%;" placeholder="类型">
          <Option v-for="type in types" :value="type.value" :key="type.value">{{ type.label }}</Option>
        </Select>
      </Col>
      <Col span="4">
        <Input v-model="filter.name" style="width:90%;" placeholder="名称" />
      </Col>
      <Col span="2">
        <Button type="primary" @click="search">查询</Button>
      </Col>
      <Col span="14" :style="{textAlign: 'left'}">
        <Button type="success" @click="showCreateMode = true">新增</Button>
      </Col>
    </Row>
    <Table border :columns="tableColumns" :data="tableData">
      <template slot-scope="{ row, index }" slot="action">
        <Button v-if="row.state === '待审核' || row.state === '审核通过'" type="error" size="small" @click="auditState(row.id, false)">审核不通过</Button>
        <Button v-if="row.state === '待审核' || row.state === '审核拒绝'" type="success" size="small" @click="auditState(row.id, true)">审核通过</Button>
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
        type: '',
        name: '',
        imgUrl: '',
        actionUrl: '',
        startAt: '',
        endAt: ''
      },
      newFormValidate: {
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        imgUrl: [
          { required: true, message: '图片地址不能为空', trigger: 'blur' },
          { type: 'string', max: 1024, message: '最大长度不得超过1024个字', trigger: 'blur' }
        ],
        actionUrl: [
          { required: true, message: '跳转连接不能为空', trigger: 'blur' },
          { type: 'string', max: 1024, message: '最大长度不得超过1024个字', trigger: 'blur' }
        ],
        startAt: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' },
          { type: 'string', max: 100, message: '最大长度不得超过256个字', trigger: 'blur' }
        ],
        endAt: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' },
          { type: 'string', max: 100, message: '最大长度不得超过256个字', trigger: 'blur' }
        ]
      },
      states: [{
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
      types: [{
        value: '',
        label: '全部类型'
      }, {
        value: 'HOME_CAROUSEL',
        label: '首页轮播图'
      }, {
        value: 'SIDEBAR_CAROUSEL',
        label: '侧边栏轮播图'
      }],
      filter: {
        state: null,
        name: null,
        type: null
      },
      tableColumns: [{
        title: 'id',
        key: 'id',
        fixed: 'left',
        width: 60
      }, {
        title: '类型',
        key: 'type',
        fixed: 'left',
        width: 100
      }, {
        title: '审核状态',
        key: 'state',
        fixed: 'left',
        width: 100
      }, {
        title: '名称',
        key: 'name',
        width: 100
      }, {
        title: '内容',
        key: 'content',
        width: 300
      }, {
        title: '开始时间',
        key: 'startAt',
        width: 100
      }, {
        title: '结束时间',
        key: 'endAt',
        width: 100
      }, {
        title: '创建人ID',
        key: 'creator',
        width: 100
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
        width: 150,
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
      this.$http.post('/admin-rest/config/page', {
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
      this.$http.post('/admin-rest/config/state', { id, is: pass }).then(res => {
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
        this.$http.post('/admin-rest/config/add', {
          name: this.newForm.name,
          type: this.newForm.type,
          startAt: this.newForm.startAt,
          endAt: this.newForm.endAt,
          content: JSON.stringify({
            imgUrl: this.newForm.imgUrl,
            actionUrl: this.newForm.actionUrl
          })
        }).then(res => {
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
    document.title = '轮播图配置'
    this.tablePageNo = 1
    this.loadData()
  }
}
</script>
