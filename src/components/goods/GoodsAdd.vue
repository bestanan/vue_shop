<template>
  <div>
    <bread-crumb :breadList="breadText"></bread-crumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>

      <!-- 步骤条 -->
      <el-steps :active="activeIndex - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
      </el-steps>

      <!-- ！！form 需要包裹在 Tabs 外面 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-position="top" label-width="100px">
        <!-- Tabs 标签页 -->
        <el-tabs 
          v-model="activeIndex" 
          :tab-position="'left'" 
          :before-leave="tabBeforeLeave"
          @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="cateChange"
                clearable></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyData" :key="item.attr_id">
              <el-checkbox v-model="item.attr_vals" :label="param" border v-for="(param, i) in item.attr_vals" :key="i"></el-checkbox>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="actionPath"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
      title="提示"
      :visible.sync="previewImgVisible"
      width="50%">
      <img :src="imgPath" alt="" width="100%">
    </el-dialog>
  </div>
</template>

<script>
import { _getCateList, _getParamsList, _addGoods } from '../../api/goods'
import _ from 'lodash'

export default {
  data() {
    return {
      breadText: ['商品管理', '添加商品'],
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 1,
        goods_weight: 0,
        goods_number: 1,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      // 级联选择器数据
      cateList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        checkStrictly: false,
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 参数列表
      manyData: [],
      // 属性列表
      onlyData: [],
      // 图片提交地址
      actionPath: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewImgVisible: false,
      imgPath: ''
    }
  },
  computed: {
    // 分类 id
    cateId() {
      if(this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 商品分类列表
    async getCateList() {
      const res = await _getCateList()
      this.cateList = res.data
      
    },
    // 商品参数列表
    async getParamsList(val) {
      const res = await _getParamsList(this.cateId, { sel: val })

      if(val === 'many') {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
        });
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
      console.log(this.manyData)
      console.log(this.onlyData)
    },
    // 商品分类改变
    cateChange() {
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 切换标签页时
    tabBeforeLeave(activeName, oldActiveName) {
      // console.log(oldActiveName,activeName)
      // 即将离开第一个标签页
      if(oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类奥~')
        return false
      }
    },
    // 选择标签页时
    tabClick() {
      // console.log(this.activeIndex)
      if(this.activeIndex === '1') {
        this.getParamsList('many')
      } else if(this.activeIndex === '2') {
        this.getParamsList('only')
      }
    },
    // 图片预览
    handlePreview(file) {
      // console.log(file)
      this.previewImgVisible = true
      this.imgPath = file.response.data.url
    },
    // 图片删除
    handleRemove(file) {
      // 图片临时地址
      const temPath = file.response.data.tmp_path
      const picIndex = this.addForm.pics.findIndex(item => item.pic === temPath)
      this.addForm.pics.splice(picIndex, 1)
      console.log(this.addForm.pics)
    },
    // 图片上传成功
    handleSuccess(res) {
      console.log(res)
      const pic = {
        "pic": res.data.tmp_path
      }
      this.addForm.pics.push(pic)
      // console.log(this.addForm.pics)
    },
    add() {
      this.$refs.addFormRef.validate(valid => {
        if(!valid) {
          return this.$message.error('请填写必要的选项~')
        }

        // 使用 lodash 进行深拷贝
        let addForm = _.cloneDeep(this.addForm)
        addForm.goods_cat = addForm.goods_cat.join(',')
        

        // 动态属性 静态属性
        this.manyData.forEach(item => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          })
        });
        this.onlyData.forEach(item => {
          this.addForm.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          })
        });
        addForm.attrs = this.addForm.attrs
        console.log(addForm)
        this.addGoods(addForm)
      })
    },
    async addGoods(data) {
      const res = await _addGoods(data)
      console.log(res)
      if(res.meta.status === 201) {
        this.$message.success('添加成功~')
        this.$router.push('/goods')

      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0;
}

</style>