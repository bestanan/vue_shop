<template>
  <div>
    <!-- 面包屑区域 -->
    <bread-crumb :breadList="breadList">商品管理</bread-crumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border>
        <!-- 是否有效 -->
        <template v-slot:isok="slotProps">
          <i class="el-icon-success" v-if="slotProps.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template v-slot:order="slotProps">
          <el-tag v-if="slotProps.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="slotProps.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:handle="slotProps">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
     
      <!-- 分页区域 -->
      <pagination 
        :total="total" 
        :currentPage.sync="query.pagenum"
        :pageSizes='[3, 5, 10, 15]'
        :pageSize.sync="query.pagesize"
        @pagination-change="getCateList"></pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addFormClose">
      <el-form 
        :model="addForm" 
        :rules="addFormRules" 
        label-width="100px"
        ref="addFormRef" 
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- 
            options 数据源
            props 配置选项
           -->
          <el-cascader
            v-model="selectedIds"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import Breadcrumb from '../../common/breadcrumb/Breadcrumb.vue'
import Pagination from '../../common/pagination/Pagination'
import { _getCateList, _addCate } from '../../api/goods'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      breadList: ['商品管理', '商品分类'],
      query: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类数据列表
      cateList: [],
      // 父级分类数据列表
      parentCateList: [],
      // 总条数
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 自定义列模板
          type: 'template',
          // 列模板名称
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'handle',
          minWidth: '130px'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addDialogVisible: false,
      addForm: {
        // 父级分类 id
        cat_pid: 0,
        // 添加的分类名称
        cat_name: '',
        // 分类层级，默认为一级分类
        cat_level: 0
      },
      addFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
      },
      // 级联选择器配置
      cascaderProps: {
        expandTrigger: 'hover', // click 或 hover
        checkStrictly: true, // 一二三级都可选
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择器选中的 id 数组
      selectedIds: []
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有分类数据列表
    async getCateList() {
      console.log(this.query)
      const { data: res } = await _getCateList(this.query)
      this.cateList = res.result
      this.total = res.total
    },
    // 展示添加分类的对话框
    showAddCateDialog() {
      this.getParentCateList()
      this.addDialogVisible = true
    },
    // 获取父级分类数据列表（最多三层，获取1、2级分类）
    async getParentCateList() {
      const { data: res } = await _getCateList({ type: 2 })
      this.parentCateList = res
      console.log(res)
    },
    parentCateChange() {
      console.log(this.selectedIds)
      if(this.selectedIds.length > 0) {
        this.addForm.cat_pid = this.selectedIds[this.selectedIds.length -1]
        this.addForm.cat_level = this.selectedIds.length
        return
      }
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    addCate() {
      this.$refs.addFormRef.validate(async (valid) => {
        if(!valid) return
        const res = await _addCate(this.addForm)
        if(res.meta.status === 201) {
          this.getCateList()
          this.$message.success('添加分类成功')
          this.addDialogVisible = false
        }
      })
    },
    // 监听表单关闭，重置表单
    addFormClose() {
      this.$refs.addFormRef.resetFields()
      this.selectedIds = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>