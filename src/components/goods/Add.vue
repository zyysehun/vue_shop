<template>
  <div>
    <template>
      <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
          <!-- 提示区域 -->
          <el-alert title="添加商品信息"
                    type="info"
                    center
                    show-icon
                    :closable="false"></el-alert>
          <!-- 步骤条 -->
          <el-steps :space="200"
                    :active="activeIndex - 0"
                    finish-status="success"
                    align-center="">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>

          <!-- tab栏区域 -->
          <el-form :model="addForm"
                   :rules="addFormRules"
                   ref="addFormRef"
                   label-width="100px"
                   label-position="top">

            <el-tabs v-model="activeIndex"
                     :tab-position="'left'"
                     :before-leave="beforeTabLeave"
                     @tab-click="tabClicked">
              <el-tab-pane label="基本信息"
                           name="0">
                <!--prop校验规则  -->
                <el-form-item label="商品名称"
                              prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格"
                              prop="goods_price">
                  <el-input v-model="addForm.goods_price"
                            type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量"
                              prop="goods_weight">
                  <el-input v-model="addForm.goods_weight"
                            type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量"
                              prop="goods_number">
                  <el-input v-model="addForm.goods_number"
                            type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类"
                              prop="goods_cat">
                  <el-cascader expand-trigger="hover"
                               v-model="addForm.goods_cat"
                               :options="cateList"
                               :props="cateProps"
                               @change="handleChange"></el-cascader>
                </el-form-item>
              </el-tab-pane>

              <el-tab-pane label="商品参数"
                           name="1">
                <!-- 渲染表单item项 -->
                <el-form-item :label="item.attr_name"
                              v-for="item in manyTableData"
                              :key="item.attr_id">
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox v-for="(cb, index) in item.attr_vals"
                                 :key="index"
                                 :label="cb"
                                 border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

              </el-tab-pane>
              <el-tab-pane label="商品属性"
                           name="2">
                <el-form-item :label="item.attr_name"
                              v-for="item in onlyTableData"
                              :key="item.attr_id">
                  <!-- <el-input v-model="item.attr_vals"></el-input> -->
                </el-form-item>
              </el-tab-pane>

              <el-tab-pane label="商品图片"
                           name="3">
                <!-- 图片上传模块 action表示上传的API地址 -->
                <el-upload :action="uploadURL"
                           :on-preview="handlePreview"
                           :on-remove="handleRemove"
                           list-type="picture"
                           :headers="headerObj"
                           :on-success="handleSuccess">
                  <el-button size="small"
                             type="primary">点击上传</el-button>
                </el-upload>

              </el-tab-pane>
              <el-tab-pane label="商品内容"
                           name="4">商品内容</el-tab-pane>
            </el-tabs>
          </el-form>

        </el-card>
        <!-- 图片预览 -->
        <el-dialog title="图片预览"
                   :visible.sync="previewVisible"
                   width="50%">
          <img :src="previewPath"
               alt=""
               class="priviewImg">
        </el-dialog>

      </div>
    </template>

  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '0',
      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        previewPath: '',
        previewVisible: false

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
      // 商品分类列表
      cateList: [],
      cateProps: {
        // expandTrigger: 'hover',
        label: 'cat_name', // 看到的属性
        value: 'cat_id', // 选中的是什么值
        children: 'children' // 指定属性实现父子节点嵌套
      },

      // 动态参数列表
      manyTableData: [],
      // 静态参数列表
      onlyTableData: [],
      // 上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的header请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false

    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  },

  methods: {
    // 获取所有商品分类数据
    async getCateList () {
      const { data: result } = await this.$http.get('categories')
      if (result.meta.status !== 200) {
        return this.$message.error('获取商品分类数据失败！')
      }

      this.cateList = result.data

      console.log(this.cateList)
    },
    // 级联选择器选中会触发
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    async tabClicked () {
      // 证明访问的是动态参数面板
      if (this.activeIndex === '1') {
        const { data: result } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (result.meta.status !== 200) {
          return this.$message.error('获取状态参数列表失败！')
        }
        console.log(result.data)
        result.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })

        this.manyTableData = result.data
      } else if (this.activeIndex === '2') {
        const { data: result } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (result.meta.status !== 200) {
          return this.$message.error('获取状态参数列表失败！')
        }
        console.log(result.data)
        result.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.onlyTableData = result.data
      }
    },
    // 处理图片预览效果
    handlePreview (file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },

    // 处理移除图片的操作
    handleRemove (file) {
      console.log(file)
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从pics数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的splice方法，把图片信息对象，从pics数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 监听图片上传成功的事件
    handleSuccess (responce) {
      // console.log(responce)
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: responce.data.temp_path }
      // 2. 将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
    }
    // add () {
    //   this.$refs.addFormRef.validate(valid => {
    //     if (!valid) {
    //       return this.$message.error('填写必要的表单项！')
    //     }
    //     // 执行添加的业务逻辑
    //   })

  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.priviewImg {
  width: 100%;
}
</style>
