<template>
  <div class="app-container">
    <div>
      <!-- 搜索 -->
      <el-input v-model="searchParam.receiveUserName" placeholder="请输入接收用户" style="width: 200px" />
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
      <el-table-column align="center" label="短信模板ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.templateId }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮件配置ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.configId }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="发送者">
        <template slot-scope="scope">
          {{ scope.row.from }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="接收用户名称">
        <template slot-scope="scope">
          {{ scope.row.receiveUserName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="接收号码">
        <template slot-scope="scope">
          {{ scope.row.receivePhoneNumber }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="发送次数">
        <template slot-scope="scope">
          {{ scope.row.tryCount }}
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
          {{ scope.row.status }}
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
  </div>
</template>

<script>
import { list } from '@/api/sms/history'

// 默认角色初始化数据
const defaultHistory = {
  templateId: '',
  configId: '',
  from: ''
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
      checkStrictly: false
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
