<template>
  <div class="app-container">
    <div>
      <!-- 搜索 -->
      <el-input v-model="searchParam.from" placeholder="请输入发送号码" style="width: 200px" />
      <el-button type="primary" style="margin-left: 10px" @click="list">查询</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="clearAndSearch">清空</el-button>
      <span class="newButton"><el-button type="primary" @click="handleAddTemplate">新建</el-button></span>
    </div>
    <!-- 表格 -->
    <el-table :data="templateList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送号码" width="220">
        <template slot-scope="scope">
          {{ scope.row.from }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="模板配置描述" width="220">
        <template slot-scope="scope">
          {{ scope.row.desc }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="内容类型">
        <template slot-scope="scope">
          {{ scope.row.contentType }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="文件组ID">
        <template slot-scope="scope">
          {{ scope.row.fileGroupId }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="重试次数">
        <template slot-scope="scope">
          {{ scope.row.retryCount }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="page.total"
      :current-page="page.current"
      @current-change="pageChange"
    />

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'" width="550px">
      <el-form ref="template" :model="template" label-width="80px" :rules="rules" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发送号码" prop="from">
              <el-input v-model="template.from" placeholder="发送号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文件组ID">
              <el-input v-model="template.fileGroupId" placeholder="文件组ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="内容类型" prop="contentType">
              <el-input v-model="template.contentType" placeholder="内容类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重试次数">
              <el-input v-model="template.retryCount" placeholder="重试次数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="模板描述">
          <el-input v-model="template.desc" type="textarea" :rows="5" placeholder="模板配置描述" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="template.content" type="textarea" :rows="5" placeholder="内容" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmTemplate">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { deleteTemplate, updateTemplate, addTemplate, list } from '@/api/sms/template'

// 默认角色初始化数据
const defaultTemplate = {
  id: '',
  contentType: '',
  desc: '',
  from: '',
  content: '',
  fileGroupId: 0,
  retryCount: 0
}

export default {
  // 组件的 data 选项是一个函数。Vue 会在创建新组件实例的过程中调用此函数。
  // 它应该返回一个对象，然后 Vue 会通过响应性系统将其包裹起来，并以 $data 的形式存储在组件实例中。
  // 为方便起见，该对象的任何顶级 property 也会直接通过组件实例暴露出来：
  data() {
    return {
      searchParam: { pageNum: 1, pageSize: 10 },
      template: Object.assign({}, defaultTemplate),
      menus: [],
      page: {},
      templateList: [],
      // rolesList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      // 菜单树中使用的字段
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      rules: {
        contentType: [
          { required: true, message: '内容类型不能为空', trigger: 'blur' }
        ],
        from: [
          { required: true, message: '发送者不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  // 声明计算属性
  // 更改应用程序 data 中 routes 数组的值，你将看到 routesData 如何相应地更改。
  // 当 vm.routes 发生改变时，所有依赖 vm.routesData 的绑定也会更新。而且最妙的是我们以声明的方式创建了这个依赖关系：计算属性的 getter 函数没有副作用，它更易于测试和理解。
  computed: {
    // 我们可以通过在表达式中调用方法来达到同样的效果：
    // 然而，不同的是计算属性将基于它们的响应依赖关系缓存。计算属性只会在相关响应式依赖发生改变时重新求值。这就意味着只要 author.books 还没有发生改变，多次访问
    // routesData 时计算属性会立即返回之前的计算结果，而不必再次执行函数。
    // 这也同样意味着下面的计算属性将永远不会更新，因为 Date.now () 不是响应式依赖：
    // 计算属性的 getter
    // menusData() {
    //   // `this` 指向 vm 实例
    //   return this.menus
    // }
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    // this.getMenuTree()
    // this.getRoles()
    this.list()
  },
  // 用 methods 选项向组件实例添加方法，它应该是一个包含所需方法的对象：
  methods: {

    async list() {
      const res = await list(this.searchParam)
      this.templateList = res.data.records
      this.page = res.data
    },
    handleAddTemplate() {
      this.template = Object.assign({}, defaultTemplate)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    pageChange(currentPage) {
      // debugger
      this.searchParam.pageNum = currentPage
      this.list(this.searchParam)
    },
    clearAndSearch() {
      this.searchParam.from = ''
      this.pageChange(1)
    },
    // 编辑角色信息
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.template = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          const { success } = await deleteTemplate(row.id)
          if (success) {
            this.templateList.splice($index, 1)
            this.$message({
              type: 'success',
              message: 'Delete succed!'
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    async confirmTemplate() {
      const isEdit = this.dialogType === 'edit'
      let validFlag = true
      await this.$refs['template'].validate(valid => {
        // 验证通过为true，有一个不通过就是false
        if (!valid) {
          validFlag = false
        }
      })
      // 校验不通过直接返回
      if (!validFlag) {
        return
      }
      // 编辑
      if (isEdit) {
        await updateTemplate(this.template)
        for (let index = 0; index < this.templateList.length; index++) {
          if (this.templateList[index].id === this.template.id) {
            this.templateList.splice(index, 1, Object.assign({}, this.template))
            break
          }
        }
      } else {
        // 新增
        await addTemplate(this.template)
        await this.list()
        // this.template.id = data.id
        // this.template.code = data.host
        // this.template.desc = data.port
        // this.template.title = data.username
        // this.template.from = data.password
        // this.template.content = data.protocol
        // this.template.fileGroupId = data.defaultEncoding
        // this.template.retryCount = data.properties
        // this.templateList.push(this.template)
      }
      // 通知提示
      // const { roleDesc, roleCode, roleName } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        // message: `
        //     <div>Role Code: ${roleCode}</div>
        //     <div>Role Name: ${roleName}</div>
        //     <div>Description: ${roleDesc}</div>
        //   `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
  .newButton {
    float: right;
  }
</style>
