<template>
    <div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Tên sách:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="formData.name" aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Loại sách:</span>
            <select-type-book @update:modelValue="getId" />
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Số lượng:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="formData.quantity" aria-describedby="inputGroup-sizing-sm">
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import SelectTypeBook from '@/select-option/typeBook.vue';

const formData = ref({
    name: '',
    typeBook: { 
        id: '',
    },
    quantity: ''
});


const resetForm = () => {
    formData.value = {
        name: '',
        typeBook: { id: '' },
        quantity: ''
    };
};

const getId = (id) => {    
    formData.value.typeBook.id = id;
};

defineExpose({
    formData, resetForm
});
</script>