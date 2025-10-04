<script>
import axios from "axios";
import { mapMutations } from "vuex/dist/vuex.cjs.js";
import {
  LOADING_SPINNER_SHOW_MUTATION,
} from "../store/module/auth/storecontant";
import SelectTypeBook from '@/select-option/typeBook.vue';

export default {
  name: "QuanLyMuonTra",
  components: {
    SelectTypeBook
  },
  data() {
    return {
      records: [],
      filterRecords: [],
      search: "",
      loading: false,

      saving: false,
      isEditing: false,
      selectedRecord: {},

      total: 0,
      students: [], // Danh sách sinh viên
            recordForm: {
        coupon: {
          id: "",
          studentId: {
            id: "",
            name: "",
            course: "",
          },
          librarianId: {
            id: "",
            name: "",
            competence: "",
          },
          borrowedDate: "",
          returnDate: "",
          bookId: [
            {
              id: "",
              name: "",
              typeBook: "",
              quantity: "",
            }
          ]
        }
      },
      editingId: null
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    ...mapMutations({
      showLoading: LOADING_SPINNER_SHOW_MUTATION,
    }),

    // Load all data in one call
    async loadData() {
      this.loading = true;
      try {
        const response = await axios.get('/api/student/get-all');
        this.records = response.data.data || [];
        this.total = response.data.total || 0;
        this.filterRecords = [...this.records];
        this.students = [...this.records]; // Use the same data for students
        console.log("filterRecords", this.filterRecords);
        
      } catch (error) {
        console.error('Error loading data:', error);
        this.showError('Không thể tải dữ liệu');
      } finally {
        this.loading = false;
      }
    },
    // Filter records
    filterData() {
      const keyword = this.search.toLowerCase();
      if (!keyword) {
        this.filterRecords = [...this.records];
        return;
      }
      this.filterRecords = this.records.filter((record) => {
        return (
          (record.student?.name || "").toLowerCase().includes(keyword) ||
          (record.librarian?.name || "").toLowerCase().includes(keyword)
        );
      });
    },

    // View record details
    async viewRecord(couponId) {
      console.log("couponId", couponId);
      try {
        // Get librarian info
        const librarianResponse = await axios.get(`/api/librarian/get-info?id=${couponId}`);
        console.log("librarian response", librarianResponse);

        if (librarianResponse.data.code === 200) {
          this.selectedRecord = {
            librarianData: librarianResponse.data.data || {}
          };
        } else {
          throw new Error('Không thể tải thông tin chi tiết');
        }
      } catch (error) {
        console.error('Error loading record details:', error);
        this.showError('Không thể tải thông tin mượn trả');
      }
    },



    // Open create modal
    openCreateModal() {
      this.isEditing = false;
      this.editingId = null;
      this.resetForm();
      // Ensure the form is properly initialized for new records
      this.recordForm.coupon.id = "";
      this.recordForm.coupon.studentId.id = "";
      this.recordForm.coupon.librarianId.id = "";
      this.recordForm.coupon.bookId[0].id = "";
    },

    // Open edit modal
    async editRecord(couponId) {
      try {
        // Find record from loaded records
        const record = this.records.find(r => r.couponId === couponId);
        if (!record) throw new Error('Không tìm thấy bản ghi');
        
        // Populate form with existing data
        this.recordForm = {
          coupon: {
            id: record.couponId || "",
            studentId: {
              id: record.student?.id || "",
              name: record.student?.name || "",
              course: record.student?.course || "",
            },
            librarianId: {
              id: record.librarian?.id || "",
              name: record.librarian?.name || "",
              competence: record.librarian?.competence || "",
            },
            borrowedDate: this.formatDateForInput(record.borrowedDate),
            returnDate: record.returnDate ? this.formatDateForInput(record.returnDate) : "",
            bookId: [
              {
                id: record.bookId || "",
                name: record.bookName || "",
                typeBook: record.bookType || "",
                quantity: record.quantity || "",
              }
            ]
          }
        };
        
        this.isEditing = true;
        this.editingId = couponId;
      } catch (error) {
        console.error('Error loading record for edit:', error);
        this.showError('Không thể tải thông tin để chỉnh sửa');
      }
    },

    // Return book
    async returnBook(id) {
      if (!confirm('Xác nhận trả sách?')) {
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        await axios.put(`/api/coupon-details/update?id=${id}`, {
          returnDate: today
        });
        this.showSuccess('Trả sách thành công');
        this.loadData();
      } catch (error) {
        console.error('Error returning book:', error);
        this.showError('Không thể trả sách');
      }
    },

    // Save record (create or update)
    async saveRecord() {
      this.saving = true;
      try {
        // Prepare data for API
        const apiData = {
          studentId: {
            name: this.recordForm.coupon.studentId.name,
            course: this.recordForm.coupon.studentId.course
          },
          librarianId: {
            name: this.recordForm.coupon.librarianId.name,
            competence: this.recordForm.coupon.librarianId.competence
          },
          bookId: this.recordForm.coupon.bookId[0],
          borrowedDate: this.recordForm.coupon.borrowedDate,
          returnDate: this.recordForm.coupon.returnDate || null
        };

        if (this.isEditing) {
          await axios.put(`/api/coupon-details/update?id=${this.editingId}`, apiData);
          this.showSuccess('Cập nhật thông tin mượn trả thành công');
        } else {
          await axios.post('/api/coupon-details/create', apiData);
          this.showSuccess('Tạo bản ghi mượn sách mới thành công');
        }
        // Close modal using Bootstrap
        const modal = bootstrap.Modal.getInstance(document.getElementById('recordModal'));
        if (modal) {
          modal.hide();
        }
        this.loadData();
      } catch (error) {
        console.error('Error saving record:', error);
        this.showError(this.isEditing ? 'Không thể cập nhật thông tin' : 'Không thể tạo bản ghi mới');
      } finally {
        this.saving = false;
      }
    },

    // Delete record
    async deleteRecord(id) {
      if (!confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
        return;
      }

      try {
        await axios.delete(`/api/coupon-details/delete?id=${id}`);
        this.showSuccess('Xóa bản ghi thành công');
        this.loadData();
      } catch (error) {
        console.error('Error deleting record:', error);
        this.showError('Không thể xóa bản ghi');
      }
    },

    // Utility methods
    resetForm() {
      this.recordForm = {
        coupon: {
          id: "",
          studentId: {
            id: "",
            name: "",
            course: "",
          },
          librarianId: {
            id: "",
            name: "",
            competence: "",
          },
          borrowedDate: "",
          returnDate: "",
          bookId: [
            {
              id: "",
              name: "",
              typeBook: "",
              quantity: "",
            }
          ]
        }
      };
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('vi-VN');
    },

    formatDateForInput(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toISOString().split('T')[0];
    },

    getStatusText(returnDate) {
      if (!returnDate) {
        return 'Đang mượn';
      }
      const returnDateObj = new Date(returnDate);
      const today = new Date();
      if (returnDateObj < today) {
        return 'Đã trả';
      } else {
        return 'Đã trả';
      }
    },

    getStatusClass(returnDate) {
      if (!returnDate) {
        return 'badge bg-warning';
      }
      const returnDateObj = new Date(returnDate);
      const today = new Date();
      if (returnDateObj < today) {
        return 'badge bg-success';
      } else {
        return 'badge bg-info';
      }
    },



    showSuccess(message) {
      // You can implement a toast notification here
      alert(message);
    },

    showError(message) {
      // You can implement a toast notification here
      alert('Lỗi: ' + message);
    }
  },
};
</script>

<template>
  <h2 class="u-margin-bottom-small">Quản lý mượn trả tài liệu</h2>
  
  <!-- Search and Add Section -->
  <div class="d-flex justify-content-between align-items-center mb-3">
    <div class="input-group" style="max-width: 400px;">
      <input 
        type="text" 
        class="form-control" 
        placeholder="Nhập tên sinh viên hoặc người quản lý" 
        v-model="search" 
        @keyup.enter="filterData()"
      />
      <button class="btn btn-primary" type="button" @click="filterData()">
        <i class="fas fa-search"></i> Tìm kiếm
      </button>
    </div>
    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#recordModal" @click="openCreateModal()">
      <i class="fas fa-plus"></i> Thêm mượn sách mới
    </button>
  </div>

  <!-- Loading Spinner -->
  <div v-if="loading" class="text-center py-4">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <!-- Borrowing Records Table -->
  <div v-else>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h6 class="text-muted">Tổng số: {{ total }} bản ghi</h6>
    </div>
    
    <table class="table table-striped table-hover">
      <thead class="table-dark">
        <tr>
          <th>STT</th>
          <th>Tên người quản lý/Chức vụ</th>
          <th>Tên người mượn sách/lớp</th>
          <th>Ngày mượn</th>
          <th>Ngày trả</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filterRecords" :key="item.id">
          <td>{{ index + 1 }}</td>
          <td>
            <div>
              <strong>{{ item.librarian?.name || 'N/A' }}</strong>
              <br>
              <small class="text-muted">{{ item.librarian?.competence || 'N/A' }}</small>
            </div>
          </td>
          <td>
            <div>
              <strong>{{ item.student?.name || 'N/A' }}</strong>
              <br>
              <small class="text-muted">{{ item.student?.course || 'N/A' }}</small>
            </div>
          </td>
          <td>{{ formatDate(item.borrowedDate) }}</td>
          <td>{{ item.returnDate ? formatDate(item.returnDate) : 'Chưa trả' }}</td>
          <td>
            {{ item.id }}
            <div class="btn-group" role="group">
              <button 
                class="btn btn-sm btn-info" 
                data-bs-toggle="modal" 
                data-bs-target="#detailModal"
                @click="viewRecord(item.couponId)"
                title="Xem chi tiết"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button 
                class="btn btn-sm btn-warning" 
                data-bs-toggle="modal" 
                data-bs-target="#recordModal"
                @click="editRecord(item.couponId)"
                title="Chỉnh sửa"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn btn-sm btn-success" 
                v-if="!item?.returnDate"
                @click="returnBook(item.id)"
                title="Trả sách"
              >
                <i class="fas fa-undo"></i>
              </button>
              <button 
                class="btn btn-sm btn-danger" 
                @click="deleteRecord(item.id)"
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
    <div v-if="filterRecords.length === 0" class="text-center py-5">
      <i class="fas fa-book fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Không tìm thấy bản ghi mượn trả nào</h5>
      <p class="text-muted">Hãy thử thay đổi từ khóa tìm kiếm hoặc tạo bản ghi mượn sách mới</p>
    </div>
  </div>

  <!-- Create/Edit Modal -->
  <div class="modal fade" id="recordModal" tabindex="-1" ref="recordModal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEditing ? 'Chỉnh sửa thông tin mượn sách' : 'Thêm mượn sách mới' }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveRecord">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Tên sinh viên mượn sách</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="recordForm.coupon.studentId.name" 
                    placeholder="Nhập tên sinh viên"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Lớp sinh viên</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="recordForm.coupon.studentId.course" 
                    placeholder="Nhập lớp sinh viên"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Tên người quản lý</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="recordForm.coupon.librarianId.name" 
                    placeholder="Nhập tên người quản lý"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Chức vụ người quản lý</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="recordForm.coupon.librarianId.competence" 
                    placeholder="Nhập chức vụ"
                    required
                  />
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Loại sách</label>
                  <SelectTypeBook 
                    v-model="recordForm.coupon.bookId[0].typeBook"
                    placeholder="Chọn loại sách"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Tên sách</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="recordForm.coupon.bookId[0].name" 
                    placeholder="Nhập tên sách"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Số lượng</label>
                  <input 
                    type="number" 
                    class="form-control" 
                    v-model="recordForm.coupon.bookId[0].quantity" 
                    placeholder="Nhập số lượng"
                    min="1"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Ngày mượn</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="recordForm.coupon.borrowedDate" 
                    required
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">Ngày trả (tùy chọn)</label>
                  <input 
                    type="date" 
                    class="form-control" 
                    v-model="recordForm.coupon.returnDate"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="saveRecord"
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
  <div class="modal fade" id="detailModal" tabindex="-1" ref="detailModal">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Chi tiết thông tin mượn trả</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" v-if="selectedRecord">
          <!-- Librarian Information -->
          <div class="row">
            <div class="col-12">
              <h6 class="text-primary mb-3">Thông tin người quản lý</h6>
              <div v-if="!selectedRecord.librarianData" class="text-center py-3">
                <p class="text-muted">Không có thông tin người quản lý</p>
              </div>
              <div v-else>
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <p><strong>ID:</strong> {{ selectedRecord.librarianData.id || 'N/A' }}</p>
                        <p><strong>Tên:</strong> {{ selectedRecord.librarianData.name || 'N/A' }}</p>
                      </div>
                      <div class="col-md-6">
                        <p><strong>Chức vụ:</strong> {{ selectedRecord.librarianData.competence || 'N/A' }}</p>
                        <p><strong>Ngày tạo:</strong> {{ selectedRecord.librarianData.createdAt ? formatDate(selectedRecord.librarianData.createdAt) : 'N/A' }}</p>
                      </div>
                    </div>
                    <div class="row mt-3">
                      <div class="col-12">
                        <p><strong>Cập nhật lần cuối:</strong> {{ selectedRecord.librarianData.updateAt ? formatDate(selectedRecord.librarianData.updateAt) : 'Chưa cập nhật' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
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

.modal-dialog {
  max-width: 800px;
}

.modal-xl {
  max-width: 1200px;
}

.badge {
  font-size: 0.8em;
}

.text-primary {
  color: #0d6efd !important;
}

.table-sm td, .table-sm th {
  padding: 0.5rem;
  font-size: 0.875rem;
}
</style>