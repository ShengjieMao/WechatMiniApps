<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="name" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="Please insert name"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="Reviewing status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Please select"
          clearable
        >
          <el-option :key="'0'" label="Reviewing passed" :value="'0'" />
          <el-option :key="'1'" label="Reviewing Not passed" :value="'1'" />
          <el-option :key="'2'" label="Not Reviewing " :value="'2'" />
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
          >Delete</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="linkList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="name" align="center" prop="name" />
      <el-table-column label="Description" align="center" prop="description" />
      <el-table-column label="logo" align="center" prop="logo" type="img">
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.logo"
            fit="fill"
          />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="address" align="center" />
      <el-table-column prop="status" label="Reviewing status" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" type="success">passed</el-tag>
          <el-tag v-if="scope.row.status == 1" type="danger">Not passed</el-tag>
          <el-tag v-if="scope.row.status == 2" type="danger"
            >Not Reviewing
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="action"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermission="['content:link:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            >Edit</el-button
          >
          <el-button
            v-hasPermission="['content:link:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >Delete</el-button
          >
          <el-button
            v-if="scope.row.status == 2"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleChangeStatus(scope.row, '0')"
            >Reviewing passed</el-button
          >
          <el-button
            v-if="scope.row.status == 2"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleChangeStatus(scope.row, '1')"
            >Reviewing 不passed</el-button
          >
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
        <el-form-item label="name" prop="name">
          <el-input v-model="form.name" placeholder="Please insert name" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="Please insert Description"
          />
        </el-form-item>
        <el-form-item label="logo" prop="logo">
          <el-input
            v-model="form.logo"
            placeholder="Please insert logoaddress"
          />
        </el-form-item>
        <el-form-item label="address" prop="address">
          <el-input
            v-model="form.address"
            placeholder="Please insert address"
          />
        </el-form-item>
        <el-form-item label="status" prop="status">
          <el-select v-model="form.status" placeholder="Please select">
            <el-option :key="'0'" label="Reviewing passed" :value="'0'" />
            <el-option :key="'1'" label="Reviewing Not passed" :value="'1'" />
            <el-option :key="'2'" label="Not Reviewing " :value="'2'" />
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
  listLink,
  getLink,
  delLink,
  addLink,
  updateLink,
  changeLinkStatus,
} from "@/api/content/link";

export default {
  name: "Link",
  data() {
    return {
      loading: true,
      exportLoading: false,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      linkList: null,
      title: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        description: null,
        address: null,
        status: null,
        logo: undefined,
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
      listLink(this.queryParams).then((response) => {
        this.linkList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleChangeStatus(link, newStatus) {
      this.loading = true;
      changeLinkStatus(link.id, newStatus).then((response) => {
        this.$modal.msgSuccess("Reviewing succeed");
        this.open = false;
        this.getList();
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
        description: null,
        address: null,
        logo: null,
        status: "2",
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
      this.title = "Add link";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getLink(id).then((response) => {
        this.form = response;
        this.open = true;
        this.title = "Edit link";
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateLink(this.form).then((response) => {
              this.$modal.msgSuccess("Editsucceed");
              this.open = false;
              this.getList();
            });
          } else {
            addLink(this.form).then((response) => {
              this.$modal.msgSuccess("Addsucceed");
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
        .confirm('Deleting number "' + ids + '"data?')
        .then(function () {
          return delLink(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("Delete succeed");
        })
        .catch(() => {});
    },
  },
};
</script>
