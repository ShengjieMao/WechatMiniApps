<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="roleName" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="Please enter roleName"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="Status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="roleStatus"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option :key="0" label="normal" :value="0" />
          <el-option :key="1" label="terminated" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >search</el-button
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
          >add</el-button
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
          >delete</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="roleNumber" prop="id" width="120" />
      <el-table-column
        label="roleName"
        prop="roleName"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column
        label="permissionKey"
        prop="roleKey"
        :show-overflow-tooltip="true"
        width="150"
      />
      <el-table-column label="order" prop="roleSort" width="100" />
      <el-table-column label="Status" align="center" width="100">
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
        label="createdtime"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="action"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-if="scope.row.id !== 1" slot-scope="scope">
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
            >delete</el-button
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="roleName" prop="roleName">
          <el-input
            v-model="form.roleName"
            placeholder="Please enter roleName"
          />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip
              content="Permission key, like: @PreAuthorize(`@ss.hasRole('admin')`)"
              placement="top"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            permissionKey
          </span>
          <el-input
            v-model="form.roleKey"
            placeholder="Please enter permissionKey"
          />
        </el-form-item>
        <el-form-item label="roleOrder" prop="roleSort">
          <el-input-number
            v-model="form.roleSort"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="Status">
          <el-radio-group v-model="form.status">
            <el-radio :key="'0'" :label="'0'">normal</el-radio>
            <el-radio :key="'1'" :label="'1'">terminated</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="menuPermission">
          <el-checkbox
            v-model="menuExpand"
            @change="handleCheckedTreeExpand($event)"
            >More/Hide</el-checkbox
          >
          <el-checkbox
            v-model="menuNodeAll"
            @change="handleCheckedTreeNodeAll($event)"
            >Select All/Clear</el-checkbox
          >
          <el-tree
            ref="menu"
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            node-key="id"
            :check-strictly="false"
            empty-text="Loading"
            :props="defaultProps"
          />
        </el-form-item>
        <el-form-item label="note">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="Please enter content"
          />
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
  listRole,
  getRole,
  delRole,
  addRole,
  updateRole,
  changeRoleStatus,
} from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/menu";

export default {
  name: "Role",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      roleList: [],
      title: "",
      open: false,
      menuOptions: [],
      menuExpand: false,
      menuNodeAll: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
      },
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      rules: {
        roleName: [
          {
            required: true,
            message: "roleName cannot be blank",
            trigger: "blur",
          },
        ],
        roleKey: [
          {
            required: true,
            message: "permissionKey cannot be blank",
            trigger: "blur",
          },
        ],
        roleSort: [
          {
            required: true,
            message: "roleOrder cannot be blank",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listRole(this.queryParams).then((response) => {
        this.roleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getMenuTreeselect() {
      menuTreeselect().then((response) => {
        this.menuOptions = response;
      });
    },
    getMenuAllCheckedKeys() {
      const checkedKeys = this.$refs.menu.getCheckedKeys();
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    getRoleMenuTreeselect(id) {
      return roleMenuTreeselect(id).then((response) => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    // roleStatusEdit
    handleStatusChange(row) {
      const text = row.status === "0" ? "Activate" : "terminated";
      this.$modal
        .confirm('"' + text + '""' + row.roleName + '"to role?')
        .then(function () {
          return changeRoleStatus(row.id, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "Succeed");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }

      // eslint-disable-next-line no-sequences
      (this.menuNodeAll = false),
        (this.menuExpand = false),
        (this.form = {
          id: undefined,
          roleName: undefined,
          roleKey: undefined,
          roleSort: 0,
          status: "0",
          menuIds: [],
          remark: undefined,
        });
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
    handleCheckedTreeExpand(value) {
      const treeList = this.menuOptions;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
      }
    },
    handleCheckedTreeNodeAll(value) {
      this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
    },

    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      this.open = true;
      this.title = "Add role";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      const roleMenu = this.getRoleMenuTreeselect(id);
      getRole(id).then((response) => {
        this.form = response;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then((res) => {
            const checkedKeys = res.checkedKeys;
            checkedKeys.forEach((v) => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false);
              });
            });
          });
        });
        this.title = "Editrole";
      });
    },
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then((response) => {
              this.$modal.msgSuccess("EditSucceed");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then((response) => {
              this.$modal.msgSuccess("addSucceed");
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
          return delRole(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("deleteSucceed");
        })
        .catch(() => {});
    },
  },
};
</script>
