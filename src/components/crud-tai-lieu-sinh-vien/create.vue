<template>
    <div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Sinh viên:</span>
            <select-sinh-vien @change="getInfoSinhVien" ref="refSv" />
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Thủ thư:</span>
            <select-thu-thu @change="getInfoThuThu" ref="refTT" />
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
            <select-type-book @change="getInfoBook" ref="refLs" />
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
import SelectBook from '@/select-option/nameBook.vue';
import SelectSinhVien from '@/select-option/select-sinh-vien.vue';
import SelectThuThu from '@/select-option/select-thu-thu.vue';  
import { EMAIL_GETTER } from '@/store/module/auth/storecontant'
import { useStore } from 'vuex'
import { cloneDeep } from 'lodash';
const store = useStore()

const refSv = ref();
const refTT = ref();
const refLs = ref();

// Tính ngày tối thiểu (ngày mai)
const minDate = computed(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
});

const initForm = {
        masv: store.getters[`auth/${EMAIL_GETTER}`],
        mathuthu: '',
        ngaytra: '',
        danhSachSach: [
            { 
            masach: '',
            soluong: ''
            }
        ]
    }

const formData = ref(cloneDeep(initForm));


const resetForm = () => {
    refSv.value.resetData()
    refTT.value.resetData()
    refLs.value.resetData()
    selectBookRef.value.resetData()
    formData.value = cloneDeep(initForm);
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
            formData.value.danhSachSach[0].masach = String(id);
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

const getInfoThuThu = (info) => {
    formData.value.mathuthu = info.id;
};

const getInfoSinhVien = (info) => {
    formData.value.masv = info.id;
};

defineExpose({
    formData, resetForm
});
</script>