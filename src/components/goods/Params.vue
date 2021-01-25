<template>
  <div>
    <!-- 面包屑区域 -->
    <bread-crumb :breadList="breadList">商品管理</bread-crumb>
    
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="param_options">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="cateList"
            :props="cascaderProps"
            @change="cateChange"
            clearable></el-cascader>
        </el-col>
      </el-row>
      <!-- Tabs 标签面板 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addMany">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand">
              <template v-slot="slotProps">
                <el-tag v-for="(item, index) in slotProps.row.attr_vals" :key="index" closable @close="handleClose(index, slotProps.row)">{{item}}</el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="slotProps.row.inputVisible"
                  v-model="slotProps.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(slotProps.row)"
                  @blur="handleInputConfirm(slotProps.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(slotProps.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="slotProps">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(slotProps.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParam(slotProps.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addOnly">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyData" border stripe>
            <!-- 同上一样 -->
            <el-table-column type="expand">
              <template v-slot="slotProps">
                <el-tag v-for="(item, index) in slotProps.row.attr_vals" :key="index" closable @close="handleClose(index, slotProps.row)">{{item}}</el-tag>
                <!-- 输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="slotProps.row.inputVisible"
                  v-model="slotProps.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(slotProps.row)"
                  @blur="handleInputConfirm(slotProps.row)">
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(slotProps.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="slotProps">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(slotProps.row.attr_id)">编辑</el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteParam(slotProps.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 两个面板公用同一个添加dialog -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addFormClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 两个面板公用同一个编辑dialog -->
      <el-dialog
        :title="'编辑' + titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editFormClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { _getCateList, _getParamsList, _addParams, _getParamById, _updateParamById, _deleteParamById } from '../../api/goods'
export default {
  data() {
    return {
      breadList: ['商品管理', '分类参数'],
      selectedKeys: [],
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: false,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 被激活的页签
      activeName: 'many',
      // 动态参数的表格数据
      manyData: [],
      // 静态属性的表格数据
      onlyData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入动态参数/静态属性', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入动态参数/静态属性', trigger: 'blur' }
        ]
      },
      // inputVisible: false,
      // inputValue: ''
    }
  },
  computed: {
    // 按钮是否禁用 true 则禁用
    isBtnDisabled() {
      if(this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    // 分类 id
    cateId() {
      if(this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      }
      return null
    },
    titleText() {
      if(this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const res = await _getCateList()
      this.cateList = res.data
    },
    async getParamsList() {
      // 如果选择的不是三级分类
      if(this.selectedKeys.length !== 3) {
        this.selectedKeys = []
        this.manyData = []
        this.onlyData = []
        return
      }
      // 如果选择的是三级分类
      // const id = this.selectedKeys[2]
      const res = await _getParamsList(this.cateId, { sel: this.activeName })
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        item.inputVisible = false
        item.inputValue = ''
      });
      console.log(this.cateId, this.activeName, res)

      if(this.activeName === 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
    },
    cateChange() {
      this.getParamsList()
    },
    handleTabClick() {
      this.getParamsList()
    },
    // 添加参数
    addMany() {
      this.addDialogVisible = true  
    },
    // 添加属性
    addOnly() {
      this.addDialogVisible = true
    },
    addFormClose() {
      this.$refs.addFormRef.resetFields()
    },
    addParams() {
      this.$refs.addFormRef.validate( async valid => {
        if(!valid) {
          return
        }
        const res = await _addParams(this.cateId, { 
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if(res.meta.status === 201) {
          this.$message.success('添加成功')
          this.addDialogVisible = false
          this.getParamsList()
        }
      })
    },
    // 显示编辑对话框
    async showEditDialog(attr_id) {
      this.editDialogVisible = true
      const res = await _getParamById(this.cateId, attr_id, {
        attr_sel: this.activeName
      })
      // this.editForm.attr_name = res.data.attr_name
      this.editForm = res.data
    },
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) {
          return
        }
        const res = await _updateParamById(this.cateId, this.editForm.attr_id, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if(res.meta.status === 200) {
          this.$message.success('修改成功')
          this.editDialogVisible = false
          this.getParamsList()
        }
      })
    },
    async deleteParam(attr_id) {
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      
      if(confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const res = await _deleteParamById(this.cateId, attr_id)
      if(res.meta.status === 200) {
          this.$message.success('删除成功')
          this.getParamsList()
      }
    },
    // 失去焦点 或 Enter 触发
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }

      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    },
    async saveAttrVals(row) {
      const res = await _updateParamById(this.cateId, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals: row.attr_vals.join(',')
      })
      if(res.meta.status === 200) {
        this.$message.success('修改参数成功')
      }
    },
    showInput(row) {
      row.inputVisible = true
      // $nextTick 页面重新渲染完成后再执行回调内容
      this.$nextTick(_ => {
        // 输入框聚焦
        this.$refs.saveTagInput.$refs.input.focus();
      });
    }
  }
}
</script>

<style lang="less" scoped>
.param_options {
  margin: 15px 0;
}
.el-tag {
  margin: 8px;
}
.input-new-tag {
  width: 120px;
}
</style>