  <template>
    <div class="library-management">
      <!-- Header Section -->
      <div class="page-header">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h2 class="page-title">
              <i class="fas fa-users me-3"></i>
              Quản lý người đọc, nhân sự của thư viện
            </h2>
            <p class="page-subtitle">Hệ thống quản lý người đọc thư viện</p>
          </div>
          <div class="col-md-4 text-end">
            <div class="stats-card">
              <div class="stats-number">{{ posts.length }}</div>
              <div class="stats-label">Tổng số người đọc</div>
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
                  placeholder="Tìm kiếm người đọc..." 
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
              <i class="fas fa-plus me-2"></i>Thêm người đọc mới
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
                    <th width="40%">Tên người đọc</th>
                    <th width="40%">Lớp/Khoa</th>
                    <th width="15%">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(post, idx) in posts" :key="post.id" class="table-row">
                    <td class="text-center">
                      <span class="badge bg-primary">{{ idx + 1 }}</span>
                    </td>
                    <td>
                      <div class="student-info">
                        <div class="student-name">{{ post.name }}</div>
                        <div class="student-id">ID: {{ post.id }}</div>
                      </div>
                    </td>
                    <td>
                      <span class="badge bg-info">{{ post.course || 'Đang cập nhật' }}</span>
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
                    <td colspan="4" class="text-center py-4">
                      <div class="empty-state">
                        <i class="fas fa-users fa-3x text-muted mb-3"></i>
                        <p class="text-muted">Chưa có người đọc nào trong hệ thống</p>
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
                <i class="fas fa-users me-2"></i>{{ title }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="input-group input-group-sm mb-3">
                <span v-if="!isView" class="input-group-text" id="inputGroup-sizing-sm" style="width: 120px;">Tên người đọc:</span>
                <input type="text" v-if="!isView" class="form-control" aria-label="Sizing example input" v-model="formData.name" aria-describedby="inputGroup-sizing-sm">
                <p v-else class="form-control-plaintext">Tên người đọc: {{ formData.name }}</p>
              </div> 
              <div class="input-group input-group-sm mb-3">
                <span v-if="!isView" class="input-group-text" id="inputGroup-sizing-sm" style="width: 120px;">Lớp/Khoa:</span>
                <input v-if="!isView" type="text" class="form-control" aria-label="Sizing example input" v-model="formData.course" aria-describedby="inputGroup-sizing-sm">
                <p v-else class="form-control-plaintext">Lớp/Khoa: {{ formData.course }}</p>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" id="closeModal" @click="closeModal">
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
  
  export default {
    name: "StudentManagement",
    data() {
      return {
        posts: [],
        search: "",
        title: "Thông Tin Chi tiết",
        isCreate: false,
        formData: {
          name: "",
          course: "",
          id: "",
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
        axios.get(`/api/student/get-all`)
          .then((res) => {
            this.showLoading(false);
            console.log("res", res);
            this.posts = res.data.data;
          })
          .catch((e) => {
            this.showLoading(false);
            console.error("Error fetching students:", e);
          });
      },
      openModal(type, post = {}) {
        if (type === "create") {
          this.formData = {
            name: "",
            course: "",
            id: "",
          };
          this.isCreate = true;
          this.title = "Tạo mới người đọc";
        } else {
          this.formData = { ...post };
          if(type === "view") {
            this.title = "Thông Tin Chi tiết";
          }
          if(type === "edit") {
            this.isCreate = false;
            this.title = "Chỉnh sửa thông tin";
          }
        }
      },
      async filterData(){
        try {
          this.showLoading(true);
          const payload = {
            q: this.search,
          };
          const res = await axios.get(`/api/student/search`, { params: payload });
          this.showLoading(false);
          this.posts = res.data.data;
        } catch (e) {
          this.showLoading(false);
          console.error("Error searching students:", e);
          // Fallback to get all if search fails
          this.init();
        }
      },
          async handleSave(){
      try {
        this.showLoading(true);
        let data = {
          name: this.formData.name,
          course: this.formData.course
        };
        
        if(this.isCreate) {
          await axios.post(`/api/student/create`, data);
        } else {
          // Thêm id vào data khi edit
          data.id = this.formData.id;
          await axios.put(`/api/student/update?id=${this.formData.id}`, data);
        }
        
        this.showLoading(false);
        this.init(); // Refresh data
        this.closeModal(); // Đóng modal

      } catch (e) {
        this.showLoading(false);
        console.error("Error saving student data:", e);
        alert("Có lỗi xảy ra khi lưu dữ liệu!");
      }
    },
    closeModal() {
      const modalEl = document.getElementById('staticBackdrop');
      if (modalEl) {
        // Ẩn modal thủ công
        modalEl.style.display = 'none';
        modalEl.classList.remove('show');
        document.body.classList.remove('modal-open');
        
        // Xóa backdrop nếu có
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
        
        // Xóa padding-right từ body nếu có
        document.body.style.paddingRight = '';
      }
    },
      async confirmDelete(post) {
        if (confirm(`Bạn có chắc chắn muốn xóa người đọc "${post.name}"?`)) {
          try {
            this.showLoading(true);
            await axios.delete(`/api/student/delete?id=${post.id}`);
            this.showLoading(false);
            this.init(); // Refresh data
            alert("Xóa người đọc thành công!");
          } catch (e) {
            this.showLoading(false);
            console.error("Error deleting student:", e);
            alert("Có lỗi xảy ra khi xóa người đọc!");
          }
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
  
  .student-info {
    display: flex;
    flex-direction: column;
  }
  
  .student-name {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .student-id {
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
  