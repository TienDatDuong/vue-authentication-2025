<template>
    <div>
        <div v-if="dataDetail">
            <h5 class="mb-3">Thông tin chi tiết phiếu mượn</h5>
            
            <!-- Thông tin phiếu mượn -->
            <div class="card mb-3">
                <div class="card-header bg-primary text-white">
                    <h6 class="mb-0"><i class="fas fa-clipboard-list me-2"></i>Thông tin phiếu mượn</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Mã phiếu:</strong> #{{ dataDetail.couponId }}</p>
                            <p><strong>Ngày mượn:</strong> {{ formatDate(dataDetail.borrowedDate) }}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Ngày trả:</strong> {{ formatDate(dataDetail.returnDate) }}</p>
                            <p><strong>Ngày cập nhật:</strong> {{ formatDate(dataDetail.updatedAt) || 'Chưa cập nhật' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Thông tin sinh viên -->
            <div class="card mb-3">
                <div class="card-header bg-info text-white">
                    <h6 class="mb-0"><i class="fas fa-user-graduate me-2"></i>Thông tin sinh viên</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>ID sinh viên:</strong> {{ dataDetail.student?.id || 'N/A' }}</p>
                            <p><strong>Tên sinh viên:</strong> {{ dataDetail.student?.name || 'N/A' }}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Khóa học:</strong> {{ dataDetail.student?.course || 'N/A' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Thông tin thủ thư -->
            <div class="card mb-3">
                <div class="card-header bg-warning text-dark">
                    <h6 class="mb-0"><i class="fas fa-user-tie me-2"></i>Thông tin thủ thư</h6>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>ID thủ thư:</strong> {{ dataDetail.librarian?.id || 'N/A' }}</p>
                            <p><strong>Tên thủ thư:</strong> {{ dataDetail.librarian?.name || 'N/A' }}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Năng lực:</strong> {{ dataDetail.librarian?.competence || 'N/A' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Danh sách sách mượn -->
            <div class="card">
                <div class="card-header bg-success text-white">
                    <h6 class="mb-0"><i class="fas fa-book me-2"></i>Danh sách sách mượn</h6>
                </div>
                <div class="card-body">
                    <div v-if="dataDetail.booksData && dataDetail.booksData.length > 0">
                        <div v-for="book in dataDetail.booksData" :key="book.id" class="border rounded p-3 mb-2">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Tên sách:</strong> {{ book.name }}</p>
                                    <p><strong>Loại sách:</strong> {{ book.type }}</p>
                                    <p><strong>Số lượng mượn:</strong> {{ book.borrowedQuantity }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Số lượng trả:</strong> {{ book.returnedQuantity }}</p>
                                    <p><strong>Trạng thái:</strong> 
                                        <span :class="book.borrowedQuantity === book.returnedQuantity ? 'badge bg-success' : 'badge bg-warning'">
                                            {{ book.borrowedQuantity === book.returnedQuantity ? 'Đã trả đủ' : 'Chưa trả đủ' }}
                                        </span>
                                    </p>
                                    <p><strong>Ngày mượn:</strong> {{ formatDate(book.borrowedDate) }}</p>
                                    <p><strong>Ngày trả:</strong> {{ formatDate(book.returnDate) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center text-muted">
                        <p>Không có sách nào trong phiếu mượn này</p>
                    </div>
                </div>
            </div>
            <div class="center">
                <button type="button" class="btn btn-primary" style="width: 200px;" @click="handleReturnBook" :disabled="dataDetail.booksData[0].borrowedQuantity === dataDetail.booksData[0].returnedQuantity">
                    <i class="fas fa-save me-2"></i>
                        {{ dataDetail.booksData[0].borrowedQuantity === dataDetail.booksData[0].returnedQuantity ? 'Đã trả đủ' : 'Trả sách' }}
                </button>
            </div>
        </div>
        <div v-else class="text-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Đang tải thông tin...</p>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
});

const dataDetail = ref();

watch(props, (newVal) => {
    console.log("newVal", newVal);
    if(newVal.post.couponId){
        loadBookDetails(newVal.post.couponId);
    }
});

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Xử lý định dạng ngày "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString.replace(' ', 'T'));
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};


const loadBookDetails = async (couponId) => {
    try {
        const res = await axios.get(`/api/coupon-details/get-ordered-books?idCoupon=${couponId}`);
        console.log("Books data:", res);
        dataDetail.value = {
            ...props.post,
            booksData: res.data.data
        };
    } catch (err) {
        console.log("err", err);
    }
};

const handleReturnBook =  async() => {
    try{
        console.log("dataDetail.value",dataDetail.value)
        axios.get(`/api/coupon-details/verify-return-book?idCoupon=${dataDetail.value.couponId}&idBook=${dataDetail.value.booksData[0].id}&quantity=${dataDetail.value.booksData[0].borrowedQuantity}`);
    } catch (err) {
        console.log("err", err);
    }
}

const resetData = () => {
    loadBookDetails(props.post.couponId);
}

defineExpose({
    resetData
})
</script>
<style scoped>
.center{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 16px;
}
</style>