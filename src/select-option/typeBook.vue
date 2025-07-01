<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

const data = ref([]);
const emit = defineEmits(['update:modelValue']);
const modelValue = ref('');

const getValue = (event) => {
    console.log('Selected value:', event.target.value);
    emit('update:modelValue', event.target.value);
};

onMounted(() => {
    axios.get(`/api/typebook/get-all`)
        .then(response => {
            data.value = response.data.data;            
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
});
</script>
<template>
    <select class="form-select" aria-label="Default select example" v-model="modelValue" @change="getValue($event)">
        <option disabled value="">Open this select menu</option>
        <option v-for="item in data" :key="item.id" :value="item.id">{{ item.name }}</option>
    </select>
</template>