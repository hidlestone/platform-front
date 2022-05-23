<template>
  <div class="menuManagement-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="8" :lg="4" :xl="4">
        <!-- TODO 搜索框及列表 -->
      </el-col>
      <!-- 数据字典列表 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="20" :xl="20">
        <vab-query-form>
          <vab-query-form-top-panel :span="12">
            <el-button icon="el-icon-plus" type="primary" @click="handleEdit">
              添加
            </el-button>
          </vab-query-form-top-panel>
        </vab-query-form>
        <el-table
          ref="dictTable"
          v-fit-columns
          v-loading="listLoading"
          style="width: 100%"
          :data="list"
          border
        >
          <el-table-column label="ID" align="center">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="字典项ID" align="center">
            <template slot-scope="scope">{{ scope.row.dict_id }}</template>
          </el-table-column>
          <el-table-column label="编码" align="center">
            <template slot-scope="scope">{{ scope.row.code }}</template>
          </el-table-column>
          <el-table-column label="描述" align="center">
            <template slot-scope="scope">{{ scope.row.desc }}</template>
          </el-table-column>
          <el-table-column label="是否启用" align="center">
            <template slot-scope="scope">{{ scope.row.status }}</template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
// 数据字典接口
import { deleteDict, getDict, listDict, saveDict, updateDict } from '@/api/system-manage/dict'

export default {
  // name: 'MenuManagement',
  data() {
    return {
      data: [],
      list: [],
      listLoading: true,
      elementLoadingText: '正在加载...'
    }
  },
  async created() {
    // 查询所有的数据字典项
    const roleData = await getTree()
    this.data = roleData.data
    this.fetchData()
  },
  methods: {
    handleEdit(row) {
      if (row.path) {
        this.$refs['edit'].showEdit(row)
      } else {
        this.$refs['edit'].showEdit()
      }
    },
    handleDelete(row) {
      if (row.id) {
        this.$baseConfirm('你确定要删除当前项吗', null, async() => {
          const { msg } = await doDelete({ ids: row.id })
          this.$baseMessage(msg, 'success')
          this.fetchData()
        })
      }
    },
    async fetchData() {
      this.listLoading = true

      const { data } = await getList()
      this.list = data
      setTimeout(() => {
        this.listLoading = false
      }, 300)
    },
    handleNodeClick(data) {
      this.fetchData()
    }
  }
}
</script>
