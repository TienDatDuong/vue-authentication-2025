<template>
    <div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Tên sách:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="formData.name" aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Loại sách:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="formData.typeBook.name" aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Số lượng:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="formData.quantity" aria-describedby="inputGroup-sizing-sm">
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const formData = ref({
    name: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    typeBook: { 
        name: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    quantity: ''
});


const resetForm = () => {
    formData.value = {
        name: '',
        typeBook: { name: '' },
        quantity: ''
    };
};



defineExpose({
    formData, resetForm
});
</script>