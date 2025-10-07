<script setup>
import axios from 'axios';
import { ref, watch, toRefs, computed } from 'vue';

const dataSelect = ref([]);
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    modelValue: { type: [String, Number, null], default: '' },
    showBook: { type: Boolean, default: true },
    typeBook: { type: String, default: ''}
});
const { showBook, typeBook } = toRefs(props);

const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
});

const getValue = (event) => {
    console.log('Selected value:', event.target.value);
};

const fetchBooksByType = (type) => {
    console.log("type===>", type);
    if (!type) {
        dataSelect.value = [];
        return;
    }
    axios.get(`/api/book/search-type?q=${encodeURIComponent(type)}`)
        .then(response => {
            const payload = response?.data?.data;
            // Accept either a flat array of books or an object with typeBook array
            if (Array.isArray(payload)) {
                dataSelect.value = payload;
            } else if (payload && Array.isArray(payload.typeBook)) {
                dataSelect.value = payload.typeBook;
            } else if (Array.isArray(payload?.[0]?.typeBook)) {
                dataSelect.value = payload[0].typeBook;
            } else {
                dataSelect.value = [];
            }
        })
        .catch(error => {
            console.error('There was an error!', error);
            dataSelect.value = [];
        });
};

watch(typeBook, (newVal) => {
    if (newVal && String(newVal).length) {
        fetchBooksByType(newVal);
    } else {
        dataSelect.value = [];
    }
}, { immediate: true });

// Expose dataSelect để parent có thể truy cập
const resetData = () => {
    modelValue.value = ''
}


defineExpose({
    resetData,dataSelect
})
</script>
<template>
    <select class="form-select" aria-label="Default select example" v-model="modelValue" @change="getValue($event)" :disabled="!showBook">
        <option disabled value="">Open this select menu</option>
        <option v-for="item in dataSelect" :key="item.id" :value="item.id">{{ item.name }}</option>
    </select>
</template>