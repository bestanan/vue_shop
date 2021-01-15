<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input 
            placeholder="请输入内容" 
            v-model="queryObj.query"
            clearable
            @clear="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table
        :data="userList"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- ！！作用域插槽 -->
          <template v-slot="slotProps">
            <el-switch  v-model="slotProps.row.mg_state" @change="switchStateChange(slotProps.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="slotProps">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(slotProps.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(slotProps.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryObj.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的 dialog -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addFormClose">
      <el-form 
        :model="addForm" 
        :rules="addFormRules" 
        ref="addFormRef" 
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户的 dialog -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editFormClose">
      <el-form 
        :model="editForm" 
        :rules="editFormRules" 
        ref="editFormRef" 
        label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校验规则--邮箱校验
    var checkEmail = (rule, value, cb) => {
      // rule 指向当前的规则对象
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/
      if(!regEmail.test(value)) {
        return cb(new Error('请输入合法的邮箱'))
      }
      cb()
    }
    // 自定义校验规则--手机号校验
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if(!regMobile.test(value)) {
        return cb(new Error('请输入合法的手机号'))
      }
      cb()
    }
    return {
      userList: [],
      queryObj: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 总条数
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 控制编辑用户对话框的显示与隐藏
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryObj
      })
      if(res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return
      }
      const resData = res.data
      this.queryObj.pagenum = resData.pagenum
      this.total = resData.total
      this.userList = resData.users
    },
    // 监听 pageSize 的改变
    handleSizeChange(newSize) {
      this.queryObj.pagesize = newSize
      this.getUserList()
    },
    // 监听当前页码值的改变
    handleCurrentChange(newPage) {
      this.queryObj.pagenum = newPage
      this.getUserList()
    },
    // 监听 switch 开关状态的改变
    async switchStateChange(userinfo) {
      // console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if(res.meta.status !== 200) {
        // **
        userinfo.mg_state = !userinfo.mg_state
        this.$message.error(res.meta.msg)
        return
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听表单关闭，重置表单
    addFormClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户
    addUser() {
      // 进行表单预校验
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if(!valid) return
        // 请求数据
        const { data: res } = await this.$http.post('users', this.addForm)
        console.log(res)
        if(res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
          return
        }
        // 隐藏表单
        this.addDialogVisible = false
        // 刷新列表
        this.getUserList()
        // 提示信息
        this.$message.success('添加用户成功')
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      // 根据 id 查询用户信息
      const { data: res } = await this.$http.get(`users/${id}`)
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      console.log(res.data)
      this.editDialogVisible = true
    },
    // 监听表单关闭，重置表单
    editFormClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑用户并提交
    editUser() {
      // 进行表单预校验
      this.$refs.editFormRef.validate(async (valid) => {
        if(!valid) return
        // 请求数据
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        console.log(res)
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 隐藏对话框
        this.editDialogVisible = false
        // 刷新列表
        this.getUserList()
        // 提示信息
        this.$message.success('修改用户成功')
      })
    },
    // 删除用户
    async deleteUserById(id) {
      console.log(id)
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果确定删除 则返回字符串 confirm
      // 如果取消删除 则返回字符串 cancel
      console.log(confirmRes)
      if(confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete(`users/${id}`)
      if(res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>

</style>