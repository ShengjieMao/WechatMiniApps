<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          v-show="showSearch"
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="Username" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="Please enter Username"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="Phone" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="Please enter Phone"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="Status" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="UserStatus"
              clearable
              size="small"
              style="width: 240px"
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
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete"
              >Delete
            </el-button>
          </el-col>

          <!-- <right-toolbar
            :show-search.sync="showSearch"
            :columns="columns"
            @queryTable="getList"
          /> -->
        </el-row>

        <el-table
          :data="userList"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="UserNumber" align="center" />
          <el-table-column prop="userName" label="Username" align="center" />
          <el-table-column
            prop="nickName"
            label="UserNickname"
            align="center"
          />
          <el-table-column prop="phonenumber" label="Phone" align="center" />
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
            prop="createTime"
            label="createdtime"
            align="center"
          />

          <el-table-column
            label="action"
            align="center"
            width="160"
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
                >Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
      :page-size.sync="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-sizes="[10, 20, 30, 40]"
      :current-page.sync="queryParams.pageNum"
      @current-change="getList"
      @size-change="getList"
    />
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="UserNickname" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="Please enter UserNickname"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Phone" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                placeholder="Please enter Phone"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="email" prop="email">
              <el-input
                v-model="form.email"
                placeholder="Please enter email"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.id == undefined"
              label="Username"
              prop="userName"
            >
              <el-input
                v-model="form.userName"
                placeholder="Please enter Username"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.id == undefined"
              label="UserPassword"
              prop="password"
            >
              <el-input
                v-model="form.password"
                placeholder="Please enter UserPassword"
                type="password"
                maxlength="20"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="UserGender">
              <el-select v-model="form.sex" placeholder="Please select">
                <el-option :key="'0'" label="Male" :value="'0'" />
                <el-option :key="'1'" label="Female" :value="'1'" />
                <el-option :key="'2'" label="Other" :value="'2'" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Status">
              <el-radio-group v-model="form.status">
                <el-radio :key="'0'" :label="'0'">Normal</el-radio>
                <el-radio :key="'1'" :label="'1'">Terminated</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="role">
              <el-select
                v-model="form.roleIds"
                multiple
                placeholder="Please select"
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item> </el-col
        ></el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">Confirm</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from '@/utils/auth'
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  changeUserStatus,
} from "@/api/system/user";
import { listAllRole } from "@/api/system/role";
export default {
  name: "User",
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
      },
      title: "",
      open: false,
      rules: {
        userName: [
          {
            required: true,
            message: "Username cannot be blank",
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: "Username should be 2-20 letters",
            trigger: "blur",
          },
        ],
        nickName: [
          {
            required: true,
            message: "UserNickname cannot be blank",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "UserPassword cannot be blank",
            trigger: "blur",
          },
          {
            min: 5,
            max: 20,
            message: "UserPassword should be 5-20 letters",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "'Please enter correct email",
            trigger: ["blur", "change"],
          },
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "Please enter correct Phone",
            trigger: "blur",
          },
        ],
      },
      roleOptions: [],
      showSearch: true,
      loading: true,
      userList: null,
      total: 0,
      ids: [],
      form: {},
    };
  },
  watch: {},
  created() {
    this.getList();
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    getList() {
      this.loading = true;
      listUser(this.queryParams).then((response) => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // UserStatusEdit
    handleStatusChange(row) {
      const text = row.status === "0" ? "activate" : "Terminated";
      this.$modal
        .confirm('"' + text + '""' + row.userName + 'to "User?')
        .then(function () {
          return changeUserStatus(row.id, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "Succeed");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getUser(id).then((response) => {
        this.form = response.user;
        this.roleOptions = response.roles;
        this.form.roleIds = response.roleIds;
        this.open = true;
        this.title = "EditUser";
        this.form.password = response.password;
      });
    },
    reset() {
      this.form = {
        id: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        roleIds: [],
      };
      this.resetForm("form");
    },
    /** AddUser */
    handleAdd() {
      this.reset();
      listAllRole().then((response) => {
        this.roleOptions = response;
        this.open = true;
        this.title = "Add User";
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('Delete "' + ids + '"data?')
        .then(function () {
          return delUser(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("Delete Succeed");
        })
        .catch(() => {});
    },
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess("EditSucceed");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
              this.$modal.msgSuccess("AddSucceed");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  },
};
</script>
