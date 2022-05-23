<template>
  <div class="app-container">
    <!--<el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddMenu()"
        size="mini">
        添加
      </el-button>
    </el-card>-->
    <el-button type="primary" @click="handleAddMenu()">添加</el-button>

    <div class="table-container">
      <el-table
        ref="menuTable"
        v-fit-columns
        v-loading="listLoading"
        style="width: 100%"
        :data="list"
        border
      >
        <el-table-column label="ID" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="菜单级数" align="center">
          <template slot-scope="scope">{{ scope.row.level | levelFilter }}</template>
        </el-table-column>
        <el-table-column label="菜单编码" align="center">
          <template slot-scope="scope">{{ scope.row.menuCode }}</template>
        </el-table-column>
        <el-table-column label="菜单名称" align="center">
          <template slot-scope="scope">{{ scope.row.menuName }}</template>
        </el-table-column>
        <el-table-column label="菜单描述" align="center">
          <template slot-scope="scope">{{ scope.row.menuDesc }}</template>
        </el-table-column>
        <el-table-column label="访问路径" align="center">
          <template slot-scope="scope">{{ scope.row.path }}</template>
        </el-table-column>
        <el-table-column label="功能链接" align="center">
          <template slot-scope="scope">{{ scope.row.funcLink }}</template>
        </el-table-column>
        <el-table-column label="打开方式" align="center">
          <template slot-scope="scope">{{ scope.row.openType }}</template>
        </el-table-column>
        <el-table-column label="图标" align="center">
          <template slot-scope="scope">
            <svg-icon :icon-class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center">
          <template slot-scope="scope">{{ scope.row.order }}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{ scope.row.remark }}</template>
        </el-table-column>
        <el-table-column label="是否显示" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.hidden"
              :active-value="0"
              :inactive-value="1"
              @change="handleHiddenChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="设置" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.level | disableNextLevel"
              @click="handleShowNextLevel(scope.$index, scope.row)"
            >查看下级
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { deleteMenu, getMenu, listMenu, saveMenu, updateMenu } from '@/api/system-manage/menu'
// 表格内容宽度自适应实现，上述的表格不需要再添加宽度
import Vue from 'vue'
import Plugin from 'v-fit-columns'
Vue.use(Plugin)

export default {
  name: 'MenuList',
  filters: {
    levelFilter(value) {
      if (value === 1) {
        return '一级'
      } else if (value === 2) {
        return '二级'
      }
    },
    disableNextLevel(value) {
      if (value === 0) {
        return false
      } else {
        return true
      }
    }
  },
  // 数据
  data() {
    return {
      list: null,
      total: null,
      // 列表是否加载中，遮罩层
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      parentId: 0
    }
  },
  watch: {
    $route(route) {
      this.resetParentId()
      this.getList()
    }
  },
  created() {
    this.resetParentId()
    this.getList()
  },
  methods: {
    resetParentId() {
      this.listQuery.pageNum = 1
      console.info('$route.query.parentId:' + this.$route.query.parentId)
      if (this.$route.query.parentId != null) {
        this.parentId = this.$route.query.parentId
      } else {
        this.parentId = 0
      }
      console.info(this.parentId)
    },
    handleAddMenu() {
      this.$router.push('/system-manage/addMenu')
    },
    getList() {
      this.listLoading = true
      // 请求参数
      var param = {
        'parentId': this.parentId,
        'pageNum': this.listQuery.pageNum,
        'pageSize': this.listQuery.pageSize
      }
      listMenu(param).then(response => {
        this.listLoading = false
        this.list = response.data.records
        this.total = response.data.total
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleHiddenChange(index, row) {
      updateHidden(row.id, { hidden: row.hidden }).then(response => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 1000
        })
      })
    },
    handleShowNextLevel(index, row) {
      this.$router.push({ path: '/ums/menu', query: { parentId: row.id }})
    },
    handleUpdate(index, row) {
      this.$router.push({ path: '/ums/updateMenu', query: { id: row.id }})
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该菜单', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.id).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          })
          this.getList()
        })
      })
    }
  }
}
</script>
<style scoped>

</style>

