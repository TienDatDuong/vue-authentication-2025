<template>
    <div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Tên sách:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="data.name" aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Loại sách:</span>
            <select-type-book @update:modelValue="getId" />        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Số lượng:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="data.quantity" aria-describedby="inputGroup-sizing-sm">
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import SelectTypeBook from '@/select-option/typeBook.vue';

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
});

const data = ref({
    name: '',
    id: '',
    typeBook: { 
        id: '',
    },
    quantity: ''
});


const getId = (id) => {    
    data.value.typeBook.id = id;
};


watch(() => props.post, (newVal) => {
    console.log("newVal", newVal);
    
    data.value = {
        name: newVal.name || '',
        typeBook: { id: newVal.typeBook?.id || '' },
        quantity: newVal.quantity || ''
    };
}, { immediate: true,deep: true });



defineExpose({
    data
})

</script>