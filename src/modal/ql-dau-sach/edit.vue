<template>
    <div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Tên sách:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="data.name" aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Loại sách:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="data.typeBook.name" aria-describedby="inputGroup-sizing-sm">
        </div>
        <div class="input-group input-group-sm mb-3">
            <span class="input-group-text" id="inputGroup-sizing-sm">Số lượng:</span>
            <input type="text" class="form-control" aria-label="Sizing example input" v-model="data.quantity" aria-describedby="inputGroup-sizing-sm">
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
// import {cloneDeep} from 'lodash';
const props = defineProps({
    post: {
        type: Object,
        required: true
    }
});

const data = ref(JSON.parse(JSON.stringify(props.post)));
data.value = {
    ...data.value,
    typeBook: {
        ...data.value.typeBook,
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updateAt: new Date().toISOString()
};


defineExpose({
    data
})

</script>