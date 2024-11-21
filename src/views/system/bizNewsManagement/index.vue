<template>
  <div class="app-container">
    <el-card class="mb10">
      <el-col :span="1.5">
        <el-button type="primary" @click="handleAdd">评价</el-button>
      </el-col>

    </el-card>
    <el-card class="mb10">
      <h1 class="title">保护整个社区健康的关键 公共卫生的核心意义<span v-if="!!score" class="score">综合评分:{{ score }}</span></h1>
      <p>在当今社会，公共卫生不仅仅是一项关乎个体健康的任务，更是塑造整个社区福祉的关键所在。通过强化健康教育，提升人们对健康的认知，采取积极的预防措施，公共卫生事业致力于预防和控制疾病，营造健康的生活环境。在这个科普论文中，我们将探索公共卫生的核心意义和实践方法，揭示其在社区健康中的不可或缺之处。</p>
      <h2>公共卫生的重要性：</h2>
      <p>公共卫生是当今社会中至关重要的一项公共事业，其核心使命是保护和促进整个社区的健康。作为社区健康的守护者，公共卫生所涉及的范畴广泛，包括但不限于疾病预防、健康教育、环境卫生、食品安全等方面。其重要性不仅仅体现在个体层面，更在于对整个社会的稳定和发展具有深远影响。</p>
      <p>首先，公共卫生通过预防和控制疾病的传播，起到了保障人民身体健康的重要作用。在传染病流行时，公共卫生机构扮演着关键的角色，协调应对措施、提供医疗服务、制定防控策略，有效遏制病毒传播，保障社区居民的生命安全</p>
      <p>其次，通过健康教育和知识普及，增强了社区居民的健康意识和健康素养。人们对于健康的认知和理解不仅影响着个体的生活方式和行为习惯，也直接影响着整个社区的健康水平。公共卫生工作者通过举办健康讲座、发布健康宣传资料等方式，向社区居民传递正确的健康知识，引导他们养成健康的生活方式，预防疾病的发生。</p>
      <p>再次，公共卫生还致力于改善社区的生活环境，保障人民的基本生活品质。清洁的饮用水、卫生的居住环境、安全的食品来源等都是公共卫生所关注和努力改善的对象。通过加强环境监测、制定环境保护政策、推动城市规划和建设，公共卫生机构为社区居民提供了一个健康、安全的生活空间。</p>
      <p>最后，一个健康的社区意味着人力资源的充沛、生产力的提高，从而促进了社会的稳定与繁荣。相反，如果忽视了公共卫生工作，疾病的蔓延和健康问题的加剧将给社会带来巨大的负面影响，不仅增加了医疗支出，也阻碍了社会的发展进程。</p>
      
    </el-card>
    <el-card v-if="!!resultList.length">
      <span>精彩评论&&得分</span>
      <ul class="popup-result-scroll">
          <li class="score-li" v-for='item in resultList' :key="item">
            <div class="score-list">
              <span class="item result-blogContentStar">内容评分：{{item.blogContentStar}}</span>
            <span class="item result-blogInnovativenessStar">创新性评分：{{item.blogInnovativenessStar}}</span>
            <span class="item result-blogStyleOfWritingStar">文笔评分：{{item.blogStyleOfWritingStar}}</span></div>
            <p class="score-content">评论内容：{{item.comment}}</p>
          </li>
      </ul>
    </el-card>
     <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="内容评分">
              <el-input-number
                v-model="form.blogContentStar"
                placeholder=""
                max="5"
                min="1"
                controls-position="right"
                size="small"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创新性评分">
              <el-input-number
                v-model="form.blogInnovativenessStar"
                placeholder=""
                max="5"
                min="1"
                controls-position="right"
                size="small"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文笔评分">
              <el-input-number
                v-model="form.blogStyleOfWritingStar"
                placeholder=""
                max="5"
                min="1"
                controls-position="right"
                size="small"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="评论内容">
              <el-input
                v-model="form.comment"
                type="textarea"
                placeholder="请输入评论内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="BizNewsManagement">
  import { getBlogAdd, getBlogStar, getBlogComments} from "@/api/system/user";
  import { getUserName } from '@/utils/auth'
import { ElMessage } from 'element-plus'

  const { proxy } = getCurrentInstance();

  const bizNewsManagementList = ref([]);
  const open = ref(false);
  const loading = ref(true);
  const score = ref(0);
  const ids = ref([]);
  const resultList = ref([]);


  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const title = ref("");
          const daterangePublishTime = ref([]);

  /**定义关联表数据接收对象*/
      const publisherIdJoinbizUserManagement=ref([]);
  const data = reactive({


    form: {},
    queryParams: {
      pageNum: 1,
      pageSize: 10,
                    newsId: null,
                    title: null,
                    publisherId: null,
                    publishTime: null
    },
    rules: {
                    newsId: [
                { required: true, message: "资讯ID不能为空", trigger: "blur" }
              ],
                    title: [
                { required: true, message: "资讯标题不能为空", trigger: "blur" }
              ],
                    content: [
                { required: true, message: "详细内容不能为空", trigger: "blur" }
              ],
                    publisherId: [
                { required: true, message: "发布者ID不能为空", trigger: "blur" }
              ],
                    publishTime: [
                { required: true, message: "发布时间不能为空", trigger: "blur" }
              ]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 查询资讯管理列表 */
  function getList() {
    getBlogStar({blogCode:"111111"}).then(res => {
      score.value = res
    });
    getBlogComments({blogCode:"111111"}).then(res => {
      resultList.value = res
    });
    
  }

  // 取消按钮
  function cancel() {
    open.value = false;
    reset();
  }

  // 表单重置
  function reset() {
    form.value = {
      blogContentStar: 0,
      blogInnovativenessStar: 0,
      blogStyleOfWritingStar: 0,
      comment:"",
    };
    proxy.resetForm("userRef");
  }
const update = (val) => {
    console.log("val===",val)
    score.value=val;
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
  }

  /** 重置按钮操作 */
  function resetQuery() {
            daterangePublishTime.value = [];
    proxy.resetForm("queryRef");
    handleQuery();
  }

  // 多选框选中数据
  function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.newsId);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset();
    open.value = true;
    title.value = "评价";
  }

  /** 修改按钮操作 */
  function handleUpdate(row) {
    reset();
    const _newsId = row.newsId || ids.value
    getBizNewsManagement(_newsId).then(response => {
      form.value = response.data;
      open.value = true;
      title.value = "修改资讯管理";
    });
  }

  /** 提交按钮 */
  function submitForm() {
    proxy.$refs["userRef"].validate(valid => {
      if (valid) {
        const params ={
          ...form.value,
          blogCode:"111111",
          username:getUserName()
        }
          getBlogAdd(params).then(res => {
            if(res==="success"){
ElMessage.success("评价成功");
      open.value = false;

getList()
            }
                  open.value = false;

          });
      }
    });
  }

  /** 删除按钮操作 */
  function handleDelete(row) {
    const _newsIds = row.newsId || ids.value;
    proxy.$modal.confirm('是否确认删除资讯管理编号为"' + _newsIds + '"的数据项？').then(function() {
      return delBizNewsManagement(_newsIds);
    }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }

  /** 关联表远程搜索 */

  function publisherIdJoinRemote(requestParam){
    const paramObj = {"String":requestParam};
    listBizUserManagement(paramObj).then(response => {
      publisherIdJoinbizUserManagement.value = response.rows;
    });
  }


  /** 导出按钮操作 */
  function handleExport() {
    proxy.download('system/bizNewsManagement/export', {
      ...queryParams.value
    }, `bizNewsManagement_${new Date().getTime()}.xlsx`)
  }

  getList();
</script>

<style lang="css" scoped>
.title{
  position: relative;
}
.score-li{
  list-style-type: none;
  border-bottom: 1px solid #ccc;

}
.item{
  width: 33%;
  display: inline-block;
}
.score-list{
  padding-top: 16px;
}

.score{
    position: absolute;
    font-size: 12px;
    right: 8px;
    top: 2px;
}

</style>
