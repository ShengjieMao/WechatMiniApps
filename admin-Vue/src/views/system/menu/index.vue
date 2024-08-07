<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :model="queryParams"
      :inline="true"
    >
      <el-form-item label="menuName" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="Please enter menuName"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="status" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="Menu status"
          clearable
          size="small"
        >
          <el-option :key="0" label="Normal" :value="0" />
          <el-option :key="1" label="Terminated" :value="1" />
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
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="menuName"
        label="menuName"
        :show-overflow-tooltip="true"
        width="160"
      />
      <el-table-column prop="icon" label="icon" align="center" width="100">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="sort" width="60" />
      <el-table-column
        prop="perms"
        label="permission"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="component"
        label="component"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="status" label="status" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" type="success">Normal</el-tag>
          <el-tag v-if="scope.row.status == 1" type="danger">Terminated</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="createdtime" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="action"
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
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            >Add</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="Upper Menu ">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="Select Upper Menu "
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Menu type" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">menu</el-radio>
                <el-radio label="C">Menu </el-radio>
                <el-radio label="F">button</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" label="Menu icon">
              <!-- <IconSelect ref="iconSelect" @selected="selected" /> -->
              <el-select
                v-model="form.icon"
                placeholder="icon"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="(item, index) in icons"
                  :key="index"
                  :value="item"
                >
                  <svg-icon :icon-class="item" />
                  <span>{{ item }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="menuName" prop="menuName">
              <el-input
                v-model="form.menuName"
                placeholder="Please enter menuName"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="showsort" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="form.menuType != 'F'" prop="path">
              <span slot="label">
                <el-tooltip content="Address, like: `user`" placement="top">
                  <i class="el-icon-question" />
                </el-tooltip>
                address
              </span>
              <el-input
                v-model="form.path"
                placeholder="Please enter address"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType == 'C'" :span="12">
            <el-form-item prop="component">
              <span slot="label">
                <el-tooltip
                  content="Target component, like: `system/user/index`. Default `views` menu"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                component
              </span>
              <el-input
                v-model="form.component"
                placeholder="Please enter component"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'M'">
              <el-input
                v-model="form.perms"
                placeholder="Please enter permission"
                maxlength="100"
              />
              <span slot="label">
                <el-tooltip
                  content="Permissions, like @PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                permission
              </span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'">
              <span slot="label">
                <el-tooltip
                  content="Select will hide the route in the sidebar but can be accessed"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                showstatus
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio :key="'0'" :label="'0'">show</el-radio>
                <el-radio :key="'1'" :label="'1'">Hide</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType != 'F'">
              <span slot="label">
                <el-tooltip
                  content="Select Terminated then the menu will not be displayed in the sidebar or accessed"
                  placement="top"
                >
                  <i class="el-icon-question" />
                </el-tooltip>
                Menu status
              </span>
              <el-radio-group v-model="form.status">
                <el-radio :key="'0'" :label="'0'">Normal</el-radio>
                <el-radio :key="'1'" :label="'1'">Terminated</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/api/menu";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Menu",
  components: { Treeselect },
  data() {
    return {
      loading: true,
      showSearch: true,
      menuList: [],
      menuOptions: [],
      title: "",
      open: false,
      isExpandAll: false,
      refreshTable: true,
      queryParams: {
        menuName: undefined,
        visible: undefined,
      },
      icons: [],
      form: {},
      rules: {
        menuName: [
          {
            required: true,
            message: "menu Name should have value",
            trigger: "blur",
          },
        ],
        orderNum: [
          {
            required: true,
            message: "Menu order should have value",
            trigger: "blur",
          },
        ],
        path: [
          {
            required: true,
            message: "address should have value",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.icons = this.getIcons();
  },
  methods: {
    getIcons() {
      const req = require.context("@/assets/icons/svg", false, /\.svg$/);
      const requireAll = (requireContext) => requireContext.keys();
      const re = /\.\/(.*)\.svg/;

      const arr = requireAll(req).map((i) => {
        return i.match(re)[1];
      });
      return arr;
    },
    // Select icon
    selected(name) {
      this.form.icon = name;
    },
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then((response) => {
        this.menuList = this.handleTree(response, "id");
        this.loading = false;
      });
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children,
      };
    },
    getTreeselect() {
      listMenu().then((response) => {
        this.menuOptions = [];
        const menu = { id: 0, menuName: "Main menu", children: [] };
        menu.children = this.handleTree(response, "id");
        this.menuOptions.push(menu);
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isCache: "0",
        visible: "0",
        status: "0",
      };
      this.resetForm("form");
    },
    /** Searchbuttonaction */
    handleQuery() {
      this.getList();
    },
    /** Addbuttonaction */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "Add Menu ";
    },

    /** Editbuttonaction */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.id).then((response) => {
        this.form = response;
        this.open = true;
        this.title = "Edit Menu ";
      });
    },
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateMenu(this.form).then((response) => {
              this.$modal.msgSuccess("Edit succeed");
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then((response) => {
              this.$modal.msgSuccess("Add succeed");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** Deletebuttonaction */
    handleDelete(row) {
      this.$modal
        .confirm('Delete "' + row.menuName + '"Data?')
        .then(function () {
          return delMenu(row.id);
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
