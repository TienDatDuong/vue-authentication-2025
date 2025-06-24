<template>
    <div>
        <p>Tên sách: {{ post.name }}</p>
        <p>Loại sách:  {{ post.typeBook.name }}</p>
        <p>Số lượng:  {{ post.quantity }}</p> 
    </div>
</template>
<script setup>

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
});
</script>