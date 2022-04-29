<template>
  <div class="app-container">
    <div>
      <!-- 搜索 -->
      <el-input v-model="searchParam.username" placeholder="请输入用户名" style="width: 200px" />
      <el-button type="primary" style="margin-left: 10px" @click="list">查询</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="clearAndSearch">清空</el-button>
      <span class="newButton"><el-button type="primary" @click="handleAddConfig">新建</el-button></span>
    </div>
    <!-- 表格 -->
    <el-table :data="configList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主机名" width="220">
        <template slot-scope="scope">
          {{ scope.row.host }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="端口" width="220">
        <template slot-scope="scope">
          {{ scope.row.port }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="用户名">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="密码">
        <template slot-scope="scope">
          {{ scope.row.password }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="协议">
        <template slot-scope="scope">
          {{ scope.row.protocol }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="编码">
        <template slot-scope="scope">
          {{ scope.row.defaultEncoding }}
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
      <el-form ref="config" :model="config" :rules="rules" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="主机名称" prop="host">
              <el-input v-model="config.host" placeholder="主机名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="端口" prop="port">
              <el-input v-model="config.port" placeholder="端口" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="username">
              <el-input v-model="config.username" placeholder="账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="config.password" placeholder="密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="协议">
              <el-input v-model="config.protocol" placeholder="协议" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编码">
              <el-input v-model="config.defaultEncoding" placeholder="编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="其他配置（JSON）">
          <el-input v-model="config.properties" type="textarea" :rows="5" placeholder="其他配置" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmConfig">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { deleteConfig, updateConfig, addConfig, list } from '@/api/mail/config'

// 默认角色初始化数据
const defaultConfig = {
  id: '',
  host: '',
  port: '',
  username: '',
  password: '',
  protocol: '',
  defaultEncoding: '',
  properties: ''
}

export default {
  // 组件的 data 选项是一个函数。Vue 会在创建新组件实例的过程中调用此函数。
  // 它应该返回一个对象，然后 Vue 会通过响应性系统将其包裹起来，并以 $data 的形式存储在组件实例中。
  // 为方便起见，该对象的任何顶级 property 也会直接通过组件实例暴露出来：
  data() {
    return {
      searchParam: { pageNum: 1, pageSize: 10, protocol: '', defaultEncoding: '' },
      config: Object.assign({}, defaultConfig),
      menus: [],
      page: {},
      configList: [],
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
        host: [
          { required: true, message: '主机名不能为空', trigger: 'blur' }
        ],
        port: [
          { required: true, message: '端口不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
          // { min: 6, max: 30, message: '密码6-30位', trigger: 'blur' }
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
      this.configList = res.data.records
      this.page = res.data
    },
    handleAddConfig() {
      this.config = Object.assign({}, defaultConfig)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    pageChange(currentPage) {
      // debugger
      this.searchParam.pageNum = currentPage
      this.list(this.searchParam)
    },
    clearAndSearch() {
      this.searchParam.username = ''
      this.pageChange(1)
    },
    // handleAddRole() {
    //   this.role = Object.assign({}, defaultRole)
    //   if (this.$refs.tree) {
    //     this.$refs.tree.setCheckedNodes([])
    //   }
    //   this.dialogType = 'new'
    //   this.dialogVisible = true
    // },
    // 编辑角色信息
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.config = deepClone(scope.row)
      // // 根据角色id查询菜单树
      // var param = {
      //   'roleIds': [this.role.id]
      // }
      // const { success, data } = await getMenuTree(param)
      // if (success) {
      //   this.$nextTick(() => {
      //     // const menus = this.generateRoutes(this.role.menus)
      //     this.$refs.tree.setCheckedNodes(this.generateArr(data))
      //     // set checked state of a node not affects its father and child nodes
      //     this.checkStrictly = false
      //   })
      // }
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          const { success } = await deleteConfig(row.id)
          if (success) {
            this.configList.splice($index, 1)
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
    async confirmConfig() {
      let validFlag = true
      await this.$refs['config'].validate(valid => {
        // 验证通过为true，有一个不通过就是false
        if (!valid) {
          validFlag = false
        }
      })
      if (!validFlag) {
        return
      }
      const isEdit = this.dialogType === 'edit'
      // 编辑
      if (isEdit) {
        await updateConfig(this.config)
        for (let index = 0; index < this.configList.length; index++) {
          if (this.configList[index].id === this.config.id) {
            this.configList.splice(index, 1, Object.assign({}, this.config))
            break
          }
        }
      } else {
        // 新增
        await addConfig(this.config)
        await this.list()
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
