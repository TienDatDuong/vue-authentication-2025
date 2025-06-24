<template>
  <div>
      <h2 class="u-margin-bottom-small ">Quản lý đầu sách, báo, tạp chí trong thư viện</h2>
    <div>
      <div class="mb-3">
        <div class="actions-table">
          <div class="input-group input-search">
            <button class="btn btn-primary" type="button"  @click="filterData()">Tìm kiếm</button>
            <input type="text" class="form-control" placeholder="Nhập tên tài liệu" v-model.trim="search" />
          </div>
          <button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="openModal('create')">Tạo mới</button>
        </div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Số Thứ tự</th>
          <th>Tên sách</th>
          <th>Loại sách</th>
          <th>Số lượng</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(post,idx) in posts" :key="post.id">
          <td>{{ idx + 1 }}</td>
          <td>{{ post.name }}</td>
          <td>{{ post.typeBook?.name }}</td>
          <td>{{ post.quantity }}</td>
          <td>
            <button type="button" class="btn btn-danger">Xóa</button>
            <button type="button" class="btn btn-primary mx-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="openModal('edit',post)">Chỉnh sửa</button>
            <button type="button" class="btn btn-secondary mx-2" data-bs-toggle="modal" data-bs-target="#staticBackdrop" @click="openModal('view',post)">Chi tiết</button>
          </td>
        </tr>
      </tbody>
    </table>

      <!-- Modal -->
      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">{{ title }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <detail-modal :post="formData" v-if="isView" />
              <edit-modal :post="formData" v-if="!isCreate && !isView" ref="refEdit"/>
              <create-modal v-if="isCreate && !isView" ref="refCreate"/>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
              <button type="button" class="btn btn-primary" v-if="!isView" @click="handleSave">Lưu</button>
            </div>
          </div>
        </div>
      </div>
  
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex/dist/vuex.cjs.js";
import {
  GET_USER_TOKEN_GETTER,
  LOADING_SPINNER_SHOW_MUTATION,
} from "../store/module/auth/storecontant";
import axios from 'axios';
import {defineAsyncComponent} from "vue"

export default {
  name: "Post",
  components: {
    DetailModal: defineAsyncComponent(() => import("../modal/ql-dau-sach/detail.vue")),
    EditModal: defineAsyncComponent(() => import("../modal/ql-dau-sach/edit.vue")),
    CreateModal: defineAsyncComponent(() => import("../modal/ql-dau-sach/create.vue")),
  },
  data() {
    return {
      posts: [],
      filterPosts: [],
      search: "",
      title: "Thông Tin Chi tiết",
      dataEdit: {},
      dataCreate: {},
      isCreate: false,
      formData: {
        name: "",
        typeBook: "",
        quantity: 0,
      },
    };
  },
  computed: {
    ...mapGetters("auth", {
      token: GET_USER_TOKEN_GETTER,
    }),
    isView(){
      if(this.title === "Thông Tin Chi tiết") return true;
      return false;  
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapMutations({
      showLoading: LOADING_SPINNER_SHOW_MUTATION,
    }),
    init(){
      this.showLoading(true);
      axios.get(
        `/api/book/get-all`
      )
        .then((res) => {
          this.showLoading(false);
          console.log("res", res);
          this.posts = res.data.data;
        })
        .catch((e) => {
          this.showLoading(false);
        });
    },
    openModal(type, post=this.formData) {
      this.formData = post;
      if(type === "view") {
        this.title = "Thông Tin Chi tiết";
      }
      if(type === "edit") {
        this.isCreate = false;
        this.title = "Chỉnh sửa thông tin";
      }
      if(type === "create") {
        this.isCreate = true;
        this.title = "Tạo mới đầu sách";
      }
    },
    async filterData(){
      try
      {
        this.showLoading(true);
        const payload = {
          q: this.search,
        };
        const res =await axios.get(`/api/book/search-name`, { params: payload });
        this.showLoading(false);
        this.posts = res.data.data;
      } catch (e) {
        this.showLoading(false);
        console.error("Error fetching data:", e);
      }
    },
    async handleSave(){
      try {
        this.showLoading(true);
        let data = {};
        if(this.isCreate) {
        data =  this.$refs.refCreate.formData;
        await axios.post(`/api/book/create`, data);
        this.$refs.refCreate?.resetForm();
        } else {
        data =  this.$refs.refEdit.data;
        await axios.put(`/api/book/update`, data);
        }
        
        const modalEl = document.getElementById('staticBackdrop');
        const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modalInstance.hide(); // <-- đây là hàm đóng modal chính thức
        this.showLoading(false);

      } catch (e) {
        this.showLoading(false);
        console.error("Error saving data:", e);
      }      
    }
  },
};
</script>
<style scoped></style>
