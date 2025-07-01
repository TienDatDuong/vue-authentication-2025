<template>
  <div class="library-management">
    <!-- Header Section -->
    <div class="page-header">
      <div class="row align-items-center">
        <div class="col-md-8">
          <h2 class="page-title">
            <i class="fas fa-book me-3"></i>
            Quản lý đầu sách, báo, tạp chí
          </h2>
          <p class="page-subtitle">Hệ thống quản lý tài liệu thư viện</p>
        </div>
        <div class="col-md-4 text-end">
          <div class="stats-card">
            <div class="stats-number">{{ posts.length }}</div>
            <div class="stats-label">Tổng số tài liệu</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Section -->
    <div class="actions-section">
      <div class="row">
        <div class="col-md-8">
          <div class="search-box">
            <div class="input-group">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Tìm kiếm tài liệu..." 
                v-model.trim="search"
                @keyup.enter="filterData()"
              />
              <button class="btn btn-primary" type="button" @click="filterData()">
                <i class="fas fa-search me-2"></i>Tìm kiếm
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-4 text-end">
          <button 
            type="button" 
            class="btn btn-success btn-lg" 
            data-bs-toggle="modal" 
            data-bs-target="#staticBackdrop" 
            @click="openModal('create')"
          >
            <i class="fas fa-plus me-2"></i>Thêm tài liệu mới
          </button>
        </div>
      </div>
    </div>

    <!-- Data Table Section -->
    <div class="data-section">
      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover">
              <thead class="table-dark">
                <tr>
                  <th width="5%">#</th>
                  <th width="30%">Tên tài liệu</th>
                  <th width="25%">Loại sách</th>
                  <th width="15%">Số lượng</th>
                  <th width="25%">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(post, idx) in posts" :key="post.id" class="table-row">
                  <td class="text-center">
                    <span class="badge bg-primary">{{ idx + 1 }}</span>
                  </td>
                  <td>
                    <div class="book-info">
                      <div class="book-title">{{ post.name }}</div>
                      <div class="book-id">ID: {{ post.id }}</div>
                    </div>
                  </td>
                  <td>
                    <span class="badge bg-info">{{ post.typeBook?.name || 'Chưa phân loại' }}</span>
                  </td>
                  <td>
                    <div class="quantity-info">
                      <span class="quantity-number">{{ post.quantity }}</span>
                      <span class="quantity-label">cuốn</span>
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button 
                        type="button" 
                        class="btn btn-outline-primary btn-sm"
                        data-bs-toggle="modal" 
                        data-bs-target="#staticBackdrop" 
                        @click="openModal('view', post)"
                        title="Xem chi tiết"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        type="button" 
                        class="btn btn-outline-warning btn-sm"
                        data-bs-toggle="modal" 
                        data-bs-target="#staticBackdrop" 
                        @click="openModal('edit', post)"
                        title="Chỉnh sửa"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        type="button" 
                        class="btn btn-outline-danger btn-sm"
                        title="Xóa"
                        @click="confirmDelete(post)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="posts.length === 0">
                  <td colspan="5" class="text-center py-4">
                    <div class="empty-state">
                      <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
                      <p class="text-muted">Chưa có tài liệu nào trong hệ thống</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">
              <i class="fas fa-book me-2"></i>{{ title }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <detail-modal :post="formData" v-if="isView" />
            <edit-modal :post="formData" v-if="!isCreate && !isView" ref="refEdit"/>
            <create-modal v-if="isCreate && !isView" ref="refCreate"/>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-2"></i>Đóng
            </button>
            <button type="button" class="btn btn-primary" v-if="!isView" @click="handleSave">
              <i class="fas fa-save me-2"></i>Lưu thay đổi
            </button>
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
        modalInstance.hide();
        this.showLoading(false);
        this.init(); // Refresh data

      } catch (e) {
        this.showLoading(false);
        console.error("Error saving data:", e);
      }      
    },
    confirmDelete(post) {
      if (confirm(`Bạn có chắc chắn muốn xóa tài liệu "${post.name}"?`)) {
        // Implement delete functionality
        console.log('Delete post:', post);
      }
    }
  },
};
</script>

<style scoped>
.library-management {
  padding: 0;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.stats-card {
  background: rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.stats-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.stats-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.actions-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.search-box .input-group {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.search-box .input-group-text {
  background: #f8f9fa;
  border: none;
  color: #6c757d;
}

.search-box .form-control {
  border: none;
  padding: 0.75rem 1rem;
}

.search-box .btn {
  border-radius: 0 12px 12px 0;
  padding: 0.75rem 1.5rem;
}

.data-section .card {
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table {
  margin: 0;
}

.table-dark {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
}

.table-dark th {
  border: none;
  padding: 1rem;
  font-weight: 600;
}

.table-row {
  transition: all 0.3s ease;
}

.table-row:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.book-info {
  display: flex;
  flex-direction: column;
}

.book-title {
  font-weight: 600;
  color: #2c3e50;
}

.book-id {
  font-size: 0.8rem;
  color: #6c757d;
}

.quantity-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-number {
  font-size: 1.2rem;
  font-weight: 700;
  color: #28a745;
}

.quantity-label {
  font-size: 0.8rem;
  color: #6c757d;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-buttons .btn {
  width: 35px;
  height: 35px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-buttons .btn:hover {
  transform: translateY(-2px);
}

.empty-state {
  padding: 3rem;
}

.modal-content {
  border: none;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px 15px 0 0;
}

.modal-title {
  font-weight: 600;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1rem 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .stats-card {
    margin-top: 1rem;
  }
  
  .actions-section {
    padding: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .action-buttons .btn {
    width: 30px;
    height: 30px;
  }
}
</style>
