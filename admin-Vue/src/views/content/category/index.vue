<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="Category" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Please insert Category"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select"
          clearable
        >
          <el-option :key="'0'" label="Normal" :value="'0'" />
          <el-option :key="'1'" label="Terminated" :value="'1'" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >Search</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >Add</el-button
        >
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >Delete
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermission="['content:category:export']"
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          >Export</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="categoryList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="Category" align="center" prop="name" />
      <el-table-column label="description" align="center" prop="description" />
      <el-table-column prop="status" label="Status" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="Action"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >Edit</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :page-size.sync="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-sizes="[10, 20, 30, 40]"
      :current-page.sync="queryParams.pageNum"
      @current-change="getList"
      @size-change="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="Category" prop="name">
          <el-input v-model="form.name" placeholder="Please insert Category" />
        </el-form-item>
        <el-form-item label="description" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="Please insert content"
          />
        </el-form-item>

        <el-form-item label="Status">
          <el-select v-model="form.status" placeholder="Please select">
            <el-option :key="'0'" label="Normal" :value="'0'" />
            <el-option :key="'1'" label="Terminated" :value="'1'" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCategory,
  getCategory,
  delCategory,
  addCategory,
  updateCategory,
  exportCategory,
} from "@/api/content/category";

export default {
  name: "Category",
  data() {
    return {
      loading: true,
      exportLoading: false,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      categoryList: null,
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        description: null,
        metaKeywords: null,
        metaDescription: null,
        status: undefined,
      },
      form: {},
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listCategory(this.queryParams).then((response) => {
        this.categoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: null,
        name: null,
        pid: null,
        description: null,
        metaKeywords: null,
        metaDescription: null,
        status: 0,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
      };
      this.resetForm("form");
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "Add category";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCategory(id).then((response) => {
        this.form = response;
        this.open = true;
        this.title = "Edit category";
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCategory(this.form).then((response) => {
              this.$modal.msgSuccess("Edit succeed");
              this.open = false;
              this.getList();
            });
          } else {
            addCategory(this.form).then((response) => {
              this.$modal.msgSuccess("Add succeed");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('Delete number "' + ids + '"data?')
        .then(function () {
          return delCategory(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("Delete succeed");
        })
        .catch(() => {});
    },
    handleExport() {
      this.$modal
        .confirm("Export all category data?")
        .then(() => {
          this.exportLoading = true;
          return exportCategory();
        })
        .then((response) => {
          // this.$download.name(response.msg)
          this.exportLoading = false;
        })
        .catch(() => {});
    },
  },
};
</script>
