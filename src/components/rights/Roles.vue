<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 列表视图 -->
      <el-table
        :data="rolesList"
        border
        stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="slotProps">
            <!-- 通过 for 循环渲染一级权限 -->
            <el-row
              :class="['borderBottom', i1 === 0 ? 'borderTop' : '', 'vcenter']"
              v-for="(item1, i1) in slotProps.row.children" 
              :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag 
                  closable
                  @close="deleteRightById(slotProps.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级、三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环渲染二级权限 -->
                <el-row 
                  :class="[i2 === 0 ? '' : 'borderTop', 'vcenter']"
                  v-for="(item2, i2) in item1.children" 
                  :key="item2.id">
                  <el-col :span="6">
                    <el-tag 
                      type="success" 
                      closable
                      @close="deleteRightById(slotProps.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag 
                      type="warning"
                      v-for="(item3, i3) in item2.children" 
                      :key="item3.id"
                      closable
                      @close="deleteRightById(slotProps.row, item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{slotProps.row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="slotProps">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightsDialog(slotProps.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="setRightsDialogClose">
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultKeys"></el-tree>
      <!-- node-key="id" 指我需要通过 id 为依据来勾选 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色数据
      rolesList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightsDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      // 树形控件绑定的属性对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认勾选的节点的 key 的数组
      defaultKeys: [],
      // 当前角色 id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    async deleteRightById(roleInfo, rightId) {
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确定删除 则返回字符串 confirm
      // 如果取消删除 则返回字符串 cancel
      if(confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${roleInfo.id}/rights/${rightId}`)
      if(res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      // this.getRolesList()
      // !!注意
      roleInfo.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightsDialog(role) {
      const { data: res } = await this.$http.get('rights/tree')
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.rightsList = res.data
      // console.log(this.rightsList)
      this.getDefaultKeys(role, this.defaultKeys)
      this.setRightsDialogVisible = true
      this.roleId = role.id
    },
    // 通过递归获取三级节点的 id
    getDefaultKeys(node, arr) {
      // 终止条件：如果当前节点不包含 children，则是三级节点
      if(!node.children) {
        arr.push(node.id)
        return
      }
      node.children.forEach((item) => {
        this.getDefaultKeys(item, arr)
      })
    },
    // 监听对话框关闭
    setRightsDialogClose() {
      this.defaultKeys = []
    },
    // 分配角色
    async assignRoles() {
      const selectedKeys = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      // console.log(selectedKeys)

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: selectedKeys.join(',')
      })
      if(res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.setRightsDialogVisible = false
      this.getRolesList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}
.borderTop {
  border-top: 1px solid #eee;
}
.borderBottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>