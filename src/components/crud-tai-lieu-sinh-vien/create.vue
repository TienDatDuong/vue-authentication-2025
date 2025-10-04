<template>
    <div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Email:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="formData.masv" aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Thủ thư:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="formData.mathuthu" aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Ngày trả:</span>
            <input 
                type="date" 
                class="form-control" 
                aria-label="Sizing example input" 
                v-model="formData.ngaytra" 
                :min="minDate"
                @change="validateDate"
                aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Loại sách:</span>
            <select-type-book @change="getInfoBook" />
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Tên sách:</span>
            <select-book 
                ref="selectBookRef"
                @update:modelValue="bookId" 
                :showBook="isBook" 
                :typeBook="dataTyptBook.name" 
            />
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Số lượng:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="formData.danhSachSach[0].soluong" aria-describedby="inputGroup-sizing-sm">
        </div>
    </div>
</template>
<script setup>
import { computed, reactive, ref } from 'vue';
import SelectTypeBook from '@/select-option/typeBook.vue';
import SelectBook from '@/select-option/nameBook.vue'
import { EMAIL_GETTER } from '@/store/module/auth/storecontant'
import { useStore } from 'vuex'
const store = useStore()

// Tính ngày tối thiểu (ngày mai)
const minDate = computed(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
});

const formData = ref({
        masv: store.getters[`auth/${EMAIL_GETTER}`],
        mathuthu: '',
        ngaytra: '',
        danhSachSach: [
            { 
            masach: '',
            soluong: '',
            name: ''
            }
        ]
    });


const resetForm = () => {
    formData.value = {
        masv: '',
        mathuthu: '',
        ngaytra: '',
        danhSachSach: [{ 
            masach: '',
            soluong: '',
            name: ''
        }]
    };
};

const dataTyptBook = reactive({
    masach: '',
    name: ''
});

// Tham chiếu đến component select-book
const selectBookRef = ref(null);

const isBook = computed(() => !!dataTyptBook.masach)

const getInfoBook = (info) => {    
    dataTyptBook.masach = info.id;
    dataTyptBook.name = info.name;
};

const bookId = (id) => {    
    console.log("id===>", id);
    // Truy cập danh sách sách từ component con
    if (selectBookRef.value && selectBookRef.value.dataSelect) {
        const selectedBook = selectBookRef.value.dataSelect.find(book => book.id == id);
        if (selectedBook) {
            formData.value.danhSachSach[0].masach = id;
            formData.value.danhSachSach[0].name = selectedBook.name;
        }
    }
};

// Validation ngày trả
const validateDate = (event) => {
    const selectedDate = new Date(event.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset giờ để so sánh chỉ ngày
    
    if (selectedDate <= today) {
        alert('Ngày trả phải là ngày trong tương lai!');
        formData.value.ngaytra = '';
        event.target.value = '';
    }
};


defineExpose({
    formData, resetForm
});
</script>