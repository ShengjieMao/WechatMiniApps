<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="90px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Title" prop="title">
            <el-input
              v-model="form.title"
              placeholder="Please insert a title"
              maxlength="30"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Category">
            <el-select v-model="form.categoryId" placeholder="Please select">
              <el-option
                v-for="category in categoryList"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              />
              <!-- <el-option :key="'1'" label="Female" :value="'1'" /> -->
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Label">
            <el-select v-model="form.tags" placeholder="Please select" multiple>
              <el-option
                v-for="tag in tagList"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="Summary">
            <el-input v-model="form.summary" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="AllowComment">
            <el-radio-group v-model="form.isComment">
              <el-radio :key="'0'" :label="'0'">Normal</el-radio>
              <el-radio :key="'1'" :label="'1'">Terminated</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="ToppingSelected">
            <el-radio-group v-model="form.isTop">
              <el-radio :key="'0'" :label="'0'">Yes</el-radio>
              <el-radio :key="'1'" :label="'1'">No</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" />

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="thumbnail">
            <el-upload
              :file-list="fileList"
              class="upload-demo"
              list-type="picture"
              drag
              name="img"
              action="upload"
              :on-remove="fileRemove"
              :limit="1"
              :http-request="handleUpload"
              :on-exceed="onExceed"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                Drag your document here, or<em> click to upload</em>
              </div>
              <div slot="tip" class="el-upload__tip">
                Please only upload one file (image file)
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <el-button type="primary" size="medium" @click="handleSubmit">{{
              aId ? "Update" : "Publish"
            }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-if="!aId" type="info" @click="handleSave"
              >Save to draft</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <mavon-editor ref="md" v-model="form.content" @imgAdd="addImg" />
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { listAllCategory } from "@/api/content/category";
import { uploadImg } from "@/api/content/upload";
import { addArticle, getArticle, updateArticle } from "@/api/content/article";
import { listAllTag } from "@/api/content/tag";
export default {
  name: "Write",
  data() {
    return {
      form: {
        title: "",
        thumbnail: "",
        isTop: "1",
        isComment: "0",
        content: "",
      },
      categoryList: [],
      tagList: [],
      aId: -1,
      fileList: [],
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.aId = route.query && route.query.id;
        console.log(this.aId);
      },
      immediate: true,
    },
  },
  created() {
    this.getCategoryAndTag();
    if (this.aId) {
      this.getArticle();
    }
  },
  methods: {
    getArticle() {
      getArticle(this.aId).then((response) => {
        this.form = response;
        this.fileList.push({ name: "thumbnail", url: response.thumbnail });
      });
    },
    handleSave() {
      this.form.status = "1";
      addArticle(this.form).then((response) => {
        this.$modal.msgSuccess("Save draft succeed");
      });
    },
    handleSubmit() {
      if (!this.aId) {
        this.form.status = "0";
        addArticle(this.form).then((response) => {
          this.$modal.msgSuccess("Blog sent");
          this.$router.push({ path: "/content/article" });
        });
      } else {
        updateArticle(this.form).then((response) => {
          this.$modal.msgSuccess("Blog updated");
          this.$router.push({ path: "/content/article" });
        });
      }
    },
    onExceed() {
      this.$message.error("Please only upload one image file");
    },
    handleUpload(img) {
      uploadImg(img.file)
        .then((response) => {
          this.form.thumbnail = response;
          this.fileList.push({ name: img.file.name, url: response });
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },
    fileRemove(file, fileList) {
      this.fileList.pop();
    },
    addImg(pos, file) {
      uploadImg(file)
        .then((response) => {
          this.$refs.md.$img2Url(pos, response);
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },
    getCategoryAndTag() {
      listAllCategory().then((response) => {
        this.categoryList = response;
      });
      listAllTag().then((response) => {
        this.tagList = response;
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error("Please only upload file image less than 2MB");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>
<style scoped>
div .upload-demo {
  /* padding-left: 80px; */
}
.el-col .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;

  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
