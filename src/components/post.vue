<template>
  <h2 class="u-margin-bottom-small">Quản lý người quản lý thư viện</h2>
  
  <!-- Search and Add Section -->
  <div class="d-flex justify-content-between align-items-center mb-3">
    <div class="input-group" style="max-width: 400px;">
      <input 
        type="text" 
        class="form-control" 
        placeholder="Nhập tên người quản lý" 
        v-model.trim="search" 
        @keyup.enter="searchLibrarians()"
      />
      <button class="btn btn-primary" type="button" @click="searchLibrarians()">
        <i class="fas fa-search"></i> Tìm kiếm
      </button>
    </div>
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#librarianModal" @click="openCreateModal()">
      <i class="fas fa-plus"></i> Thêm người quản lý mới
    </button>
  </div>

  <!-- Loading Spinner -->
  <div v-if="loading" class="text-center py-4">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <!-- Librarians Table -->
  <div v-else>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h6 class="text-muted">Tổng số: {{ librarians.length }} người quản lý</h6>
    </div>
    
    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>STT</th>
          <th>Tên người quản lý</th>
          <th>Chức vụ</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(librarian, index) in filterLibrarians" :key="librarian.id">
          <td>{{ index + 1 }}</td>
          <td>{{ librarian.name || 'N/A' }}</td>
          <td>{{ librarian.competence || 'N/A' }}</td>
          <td>
            <div class="btn-group" role="group">
              <button 
                class="btn btn-sm btn-info" 
                data-bs-toggle="modal" 
                data-bs-target="#detailModal"
                @click="viewLibrarian(librarian.id)"
                title="Xem chi tiết"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button 
                class="btn btn-sm btn-warning" 
                data-bs-toggle="modal" 
                data-bs-target="#librarianModal"
                @click="editLibrarian(librarian.id)"
                title="Chỉnh sửa"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn btn-sm btn-danger" 
                @click="deleteLibrarian(librarian.id)"
                title="Xóa"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <div v-if="filterLibrarians.length === 0" class="text-center py-5">
      <i class="fas fa-user-tie fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Không tìm thấy người quản lý nào</h5>
      <p class="text-muted">Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo người quản lý mới</p>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <div class="modal fade" id="librarianModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditing ? 'Chỉnh sửa thông tin người quản lý' : 'Thêm người quản lý mới' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveLibrarian">
            <div class="mb-3">
              <label class="form-label">Tên người quản lý</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="librarianForm.name" 
                placeholder="Nhập tên người quản lý"
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Chức vụ</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="librarianForm.competence" 
                placeholder="Nhập chức vụ"
                required
              />
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="saveLibrarian"
            :disabled="saving"
          >
            <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
            {{ isEditing ? 'Cập nhật' : 'Tạo mới' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Detail Modal -->
  <div class="modal fade" id="detailModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Chi tiết thông tin người quản lý</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" v-if="selectedLibrarian">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>ID:</strong> {{ selectedLibrarian.id || 'N/A' }}</p>
                  <p><strong>Tên:</strong> {{ selectedLibrarian.name || 'N/A' }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Chức vụ:</strong> {{ selectedLibrarian.competence || 'N/A' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex/dist/vuex.cjs.js";
import {
  LOADING_SPINNER_SHOW_MUTATION,
} from "../store/module/auth/storecontant";

export default {
  name: "LibrarianManagement",
  data() {
    return {
      librarians: [],
      filterLibrarians: [],
      search: "",
      loading: false,
      saving: false,
      isEditing: false,
      selectedLibrarian: null,
      editingId: null,
      librarianForm: {
        name: "",
        competence: ""
      }
    };
  },
  mounted() {
    this.loadLibrarians();
  },
  methods: {
    ...mapMutations({
      showLoading: LOADING_SPINNER_SHOW_MUTATION,
    }),

    // Load all librarians
    async loadLibrarians() {
      this.loading = true;
      try {
        const response = await axios.get('/api/librarian/get-all');
        this.librarians = response.data.data || [];
        this.filterLibrarians = [...this.librarians];
        console.log("librarians", this.librarians);
      } catch (error) {
        console.error('Error loading librarians:', error);
        this.showError('Không thể tải danh sách người quản lý');
      } finally {
        this.loading = false;
      }
    },

    // Search librarians
    async searchLibrarians() {
      if (!this.search.trim()) {
        this.filterLibrarians = [...this.librarians];
        return;
      }
      
      try {
        const response = await axios.get(`/api/librarian/search?q=${this.search}`);
        this.filterLibrarians = response.data.data || [];
      } catch (error) {
        console.error('Error searching librarians:', error);
        this.showError('Không thể tìm kiếm người quản lý');
      }
    },

    // View librarian details
    async viewLibrarian(id) {
      try {
        const response = await axios.get(`/api/librarian/get-info?id=${id}`);
        if (response.data.code === 200) {
          this.selectedLibrarian = response.data.data;
        } else {
          throw new Error('Không thể tải thông tin chi tiết');
        }
      } catch (error) {
        console.error('Error loading librarian details:', error);
        this.showError('Không thể tải thông tin người quản lý');
      }
    },

    // Open create modal
    openCreateModal() {
      this.isEditing = false;
      this.editingId = null;
      this.resetForm();
    },

    // Open edit modal
    async editLibrarian(id) {
      try {
        const response = await axios.get(`/api/librarian/get-info?id=${id}`);
        if (response.data.code === 200) {
          const librarian = response.data.data;
          this.librarianForm = {
            name: librarian.name || "",
            competence: librarian.competence || ""
          };
          this.isEditing = true;
          this.editingId = id;
        } else {
          throw new Error('Không thể tải thông tin để chỉnh sửa');
        }
      } catch (error) {
        console.error('Error loading librarian for edit:', error);
        this.showError('Không thể tải thông tin để chỉnh sửa');
      }
    },

    // Save librarian (create or update)
    async saveLibrarian() {
      this.saving = true;
      try {
        if (this.isEditing) {
          await axios.put(`/api/librarian/update?id=${this.editingId}`, {
            id: this.editingId,
            ...this.librarianForm
          });
          this.showSuccess('Cập nhật thông tin người quản lý thành công');
        } else {
          await axios.post('/api/librarian/create', this.librarianForm);
          this.showSuccess('Tạo người quản lý mới thành công');
        }
        // Close modal using getElementById
        const modal = document.getElementById('librarianModal');
        if (modal) {
          modal.style.display = 'none';
          modal.classList.remove('show');
          document.body.classList.remove('modal-open');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }
        this.loadLibrarians();
      } catch (error) {
        console.error('Error saving librarian:', error);
        this.showError(this.isEditing ? 'Không thể cập nhật thông tin' : 'Không thể tạo người quản lý mới');
      } finally {
        this.saving = false;
      }
    },

    // Delete librarian
    async deleteLibrarian(id) {
      if (!confirm('Bạn có chắc chắn muốn xóa người quản lý này?')) {
        return;
      }

      try {
        await axios.delete(`/api/librarian/delete?id=${id}`);
        this.showSuccess('Xóa người quản lý thành công');
        this.loadLibrarians();
      } catch (error) {
        console.error('Error deleting librarian:', error);
        this.showError('Không thể xóa người quản lý');
      }
    },

    // Utility methods
    resetForm() {
      this.librarianForm = {
        name: "",
        competence: ""
      };
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('vi-VN');
    },

    showSuccess(message) {
      alert(message);
    },

    showError(message) {
      alert('Lỗi: ' + message);
    }
  },
};
</script>

<style scoped>
.table th {
  font-weight: 600;
}

.btn-group .btn {
  margin-right: 2px;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.badge {
  font-size: 0.8em;
}

.text-primary {
  color: #0d6efd !important;
}
</style>
