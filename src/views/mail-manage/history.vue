<template>
  <div class="app-container">
    <div>
      <!-- 搜索 -->
      <el-input v-model="searchParam.title" placeholder="请输入标题" style="width: 200px" />
      <el-button type="primary" style="margin-left: 10px" @click="list">查询</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="clearAndSearch">清空</el-button>
    </div>
    <!--    <el-button type="primary" @click="handleAddRole">New Config</el-button>-->
    <!-- 表格 -->
    <el-table :data="historyList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="标题" width="220">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="发送者" width="220">
        <template slot-scope="scope">
          {{ scope.row.from }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="接收用户名称">
        <template slot-scope="scope">
          {{ scope.row.receiveUserName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="接收邮箱">
        <template slot-scope="scope">
          {{ scope.row.receiveMail }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="抄送者">
        <template slot-scope="scope">
          {{ scope.row.cc }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="密送者">
        <template slot-scope="scope">
          {{ scope.row.bcc }}
        </template>
      </el-table-column>
      <!--      <el-table-column align="header-center" label="内容">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.content }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="header-center" label="文件组ID">
        <template slot-scope="scope">
          {{ scope.row.fileGroupId }}
        </template>
      </el-table-column>
      <!--      <el-table-column align="header-center" label="失败原因">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.msg }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="header-center" label="最后一次发送时间">
        <template slot-scope="scope">
          {{ scope.row.lastSendTime }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="是否成功">
        <template slot-scope="scope">
          {{ scope.row.sendFlag }}
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="操作">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>-->
      <!--          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="page.total"
      :current-page="page.current"
      @current-change="pageChange"
    />

    <!-- 对话框 -->
    <!--    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Role':'New Role'">
      <el-form :model="history" label-width="80px" label-position="left">
        <el-form-item label="ID">
          <el-input v-model="role.id" placeholder="Role ID" />
        </el-form-item>
        <el-form-item label="Code">
          <el-input v-model="role.roleCode" placeholder="Role Code" :disabled="dialogType==='edit'? true:false" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="role.roleName" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="role.roleDesc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        &lt;!&ndash; 菜单树 &ndash;&gt;
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="menusData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>-->

  </div>
</template>

<script>
import path from 'path'
// import { deepClone } from '@/utils'
import { list } from '@/api/mail-manage/history'
// import { addRole, deleteRole, getMenuTree, updateRole } from '@/api/role'

// 默认角色初始化数据
const defaultHistory = {
  key: '',
  name: '',
  description: '',
  menus: []
}

export default {
  // 组件的 data 选项是一个函数。Vue 会在创建新组件实例的过程中调用此函数。
  // 它应该返回一个对象，然后 Vue 会通过响应性系统将其包裹起来，并以 $data 的形式存储在组件实例中。
  // 为方便起见，该对象的任何顶级 property 也会直接通过组件实例暴露出来：
  data() {
    return {
      history: Object.assign({}, defaultHistory),
      searchParam: { pageSize: 10, pageNum: 1 },
      menus: [],
      historyList: [],
      page: {},
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      // 菜单树中使用的字段
      defaultProps: {
        children: 'children',
        label: 'menuName'
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
    menusData() {
      // `this` 指向 vm 实例
      return this.menus
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    // this.getRoutes()
    // this.getMenuTree()
    this.list(this.searchParam)
  },
  // 用 methods 选项向组件实例添加方法，它应该是一个包含所需方法的对象：
  methods: {
    // async getMenuTree() {
    //   const res = await getMenuTree()
    //   this.menus = res.data
    //   // this.serviceRoutes = res.data
    //   // this.routes = this.generateRoutes(res.data)
    // },
    async list() {
      const res = await list(this.searchParam)
      this.historyList = res.data.records
      this.page = res.data
    },
    pageChange(currentPage) {
      // debugger
      this.searchParam.pageNum = currentPage
      this.list(this.searchParam)
    },
    clearAndSearch() {
      this.searchParam.title = ''
      this.pageChange(1)
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) {
          continue
        }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(menus) {
      let data = []
      menus.forEach(menu => {
        data.push(menu)
        if (menu.children) {
          const temp = this.generateArr(menu.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    // 新增角色页
    // handleAddRole() {
    //   this.role = Object.assign({}, defaultRole)
    //   if (this.$refs.tree) {
    //     this.$refs.tree.setCheckedNodes([])
    //   }
    //   this.dialogType = 'new'
    //   this.dialogVisible = true
    // },
    // // 编辑角色信息
    // async handleEdit(scope) {
    //   this.dialogType = 'edit'
    //   this.dialogVisible = true
    //   this.checkStrictly = true
    //   this.role = deepClone(scope.row)
    //   // 根据角色id查询菜单树
    //   var param = {
    //     'roleIds': [this.role.id]
    //   }
    //   const { success, data } = await getMenuTree(param)
    //   if (success) {
    //     this.$nextTick(() => {
    //       // const menus = this.generateRoutes(this.role.menus)
    //       this.$refs.tree.setCheckedNodes(this.generateArr(data))
    //       // set checked state of a node not affects its father and child nodes
    //       this.checkStrictly = false
    //     })
    //   }
    // },
    // handleDelete({ $index, row }) {
    //   this.$confirm('Confirm to remove the role?', 'Warning', {
    //     confirmButtonText: 'Confirm',
    //     cancelButtonText: 'Cancel',
    //     type: 'warning'
    //   })
    //     .then(async() => {
    //       const { success } = await deleteRole(row.id)
    //       if (success) {
    //         this.rolesList.splice($index, 1)
    //         this.$message({
    //           type: 'success',
    //           message: 'Delete succed!'
    //         })
    //       }
    //     })
    //     .catch(err => {
    //       console.error(err)
    //     })
    // },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    // async confirmRole() {
    //   const isEdit = this.dialogType === 'edit'
    //   // 获取菜单选中项
    //   const checkedNodes = this.$refs.tree.getCheckedNodes()
    //   if (!checkedNodes || checkedNodes.length < 1) {
    //     this.$message.error('请选择菜单')
    //     return false
    //   }
    //   // const checkedKeys = this.$refs.tree.getCheckedKeys()
    //   // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
    //   var menuReqList = []
    //   for (var i = 0, len = checkedNodes.length; i < len; i++) {
    //     var menu = {
    //       'id': checkedNodes[i].id
    //     }
    //     menuReqList.push(menu)
    //   }
    //   this.role.menuReqList = menuReqList
    //   // 编辑
    //   if (isEdit) {
    //     // 更新角色信息
    //     const { success } = await updateRole(this.role)
    //     if (success) {
    //       for (let index = 0; index < this.rolesList.length; index++) {
    //         if (this.rolesList[index].roleCode === this.role.roleCode) {
    //           this.rolesList.splice(index, 1, Object.assign({}, this.role))
    //           break
    //         }
    //       }
    //     }
    //   } else {
    //     // 新增角色
    //     const { success, data } = await addRole(this.role)
    //     if (success) {
    //       this.role.id = data.id
    //       this.role.roleCode = data.roleCode
    //       this.role.roleName = data.roleName
    //       this.role.roleDesc = data.roleDesc
    //       this.rolesList.push(this.role)
    //     }
    //   }
    //   // 通知提示
    //   const { roleDesc, roleCode, roleName } = this.role
    //   this.dialogVisible = false
    //   this.$notify({
    //     title: 'Success',
    //     dangerouslyUseHTMLString: true,
    //     message: `
    //         <div>Role Code: ${roleCode}</div>
    //         <div>Role Name: ${roleName}</div>
    //         <div>Description: ${roleDesc}</div>
    //       `,
    //     type: 'success'
    //   })
    // },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
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
</style>
