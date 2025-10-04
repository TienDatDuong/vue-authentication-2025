<template>
    <div>
        <div v-if="dataDetail">
            <h5 class="mb-3">Thông tin chi tiết sách</h5>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>ID:</strong> {{ dataDetail.id }}</p>
                    <p><strong>Tên sách:</strong> {{ dataDetail.name }}</p>
                    <p><strong>Số lượng:</strong> {{ dataDetail.quantity }} cuốn</p>
                </div>
                <div class="col-md-6">
                    <p><strong>Loại sách:</strong> {{ dataDetail.typeBook.name }}</p>
                    <p><strong>ID loại sách:</strong> {{ dataDetail.typeBook.id }}</p>
                    <p><strong>Ngày tạo:</strong> {{ dataDetail.createdAt || 'Chưa cập nhật' }}</p>
                    <p><strong>Ngày cập nhật:</strong> {{ dataDetail.updateAt || 'Chưa cập nhật' }}</p>
                </div>
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
    if(newVal.post.id){
        axios.get(
        `/api/book/get-info?id=${newVal.post.id}`
        ).then((res) => {
            dataDetail.value = res.data.data;
        console.log("res", res);
        }).catch((err) => {
        console.log("err", err);
        });
    }
});
</script>