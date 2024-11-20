<!-- 种类选择标签的全局组件 -->
<template>
  <div>
    <!-- inline代表行内表单（一行可以放置多个表单元素） -->
    <el-form
      :inline="true"
      class="demo-form-inline"
      :model="cForm"
      size="medium"
    >
      <el-form-item label="一级分类" style="margin-right: 50px">
        <el-select
          placeholder="请选择"
          v-model="cForm.fatherAttrId"
          @change="handler1"
          :disabled="!show"
        >
          <el-option
            :label="fatherAttr.fieldValue"
            :value="fatherAttr.fieldId"
            v-for="(fatherAttr, index) in fatherAttrData"
            :key="fatherAttr.fieldId"
          ></el-option>
        </el-select> </el-form-item
      >
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.childrenAttrId"
          @change="handler2"
          :disabled="!cForm.fatherAttrId||!show"
        >
          <el-option
            :label="childrenAttr.value"
            :value="childrenAttr.id"
            v-for="(childrenAttr, index) in childrenAttrData"
            :key="childrenAttr.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      //一级分类的数据
      fatherAttrData:[],
      //二级分类的数据
      levelAttrData:{},
      organizationAttrData:{},
      categoryAttrData:{},
      //选择的一级、二级、三级分类的id
      cForm: {
        fatherAttrId: "",
        childrenAttrId: "",
      },
      show:true, //控制cs的显示与隐藏
    };
  },
  computed:{
    childrenAttrData(){
      if(this.cForm.fatherAttrId==1){
        return this.organizationAttrData['childrenValue'];
      }
      else if(this.cForm.fatherAttrId==2){
        return this.levelAttrData['childrenValue'];
      }
      else{
        return this.categoryAttrData['childrenValue']
      }
    }
  },
  mounted() {
    this.show=true;
    this.$bus.$on("changeCsShow",(show)=>{
          this.show=show;
        });
    this.$bus.$on("changeChildrenAttr",(childrenAttrId)=>{
      this.cForm.childrenAttrId=childrenAttrId;
    })
  },
  beforeDestroy(){
        this.$bus.$off("changeCsShow");
        this.$bus.$off("changeChildrenAttr");
  },
  methods: {
    handler1() {
      //清除数据
      this.cForm.childrenAttrId = "";
      //进入场景1
      this.$emit('changeScene',1);
    },
   
    //二级分类事件回调
    handler2() {
      //给Scene2提供数据
      //进入场景2
      this.$emit("changeScene", 2);
    },

    getFatherAttr(fatherAttrData){
      this.fatherAttrData=fatherAttrData;
    },

    getChildrenAttr(levelAttrData,categoryAttrData,organizationAttrData){
      this.levelAttrData=levelAttrData;
      this.categoryAttrData=categoryAttrData;
      this.organizationAttrData=organizationAttrData
    }
  },
  watch:{
    childrenAttrData:{
        handler(newValue,oldValue){
          this.$bus.$emit("getChildrenAttr",newValue,this.cForm.fatherAttrId);
        },
        immediate:true,
    },
    'cForm.childrenAttrId':{
      deep:true,
      immediate:true,
      handler(newValue,oldValue){
      this.$bus.$emit('getAttrInfo',this.cForm.fatherAttrId,this.cForm.childrenAttrId);
      }
    }
  }
};
</script>
<style scoped></style>
