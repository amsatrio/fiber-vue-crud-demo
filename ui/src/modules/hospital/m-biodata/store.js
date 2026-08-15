import { defineStore } from 'pinia';

let base_url = "http://localhost:9001/v1/hospital/m-biodata";

export const useMBiodataStore = defineStore('mbiodata', {
    state: () => ({
        data: { fullname: '', mobilePhone: '', image: null, imagePath: '' },
        pagedata: [],
        loading: false,
        pagination: {
            totalPages: 0,
            totalElements: 0,
            size: 5,
            number: 0
        },
    }),
    actions: {
        async fetchPageData(page = 0, size = 5) {
            this.loading = true;
            try {
                const res = await fetch(`${base_url}?page=${page}&size=${size}`);
                let json = await res.json();
                this.pagedata = json.data.content;
                this.pagination = {
                    totalPages: json.data.totalPages,
                    totalElements: json.data.totalElements,
                    size: json.data.size,
                    number: json.data.number
                };
            } finally {
                this.loading = false;
            }
        },
        async saveData(id) {
            this.loading = true;
            const method = id ? 'PUT' : 'POST';
            const url = base_url;

            // Build multipart form data
            const formData = new FormData();
            if (id) formData.append('id', id.toString());
            if (this.data.fullname) formData.append('fullname', this.data.fullname);
            if (this.data.mobilePhone) formData.append('mobilePhone', this.data.mobilePhone);
            if (this.data.image) formData.append('image', this.data.image);
            if (this.data.imagePath) formData.append('imagePath', this.data.imagePath);
            try {
                await fetch(url, {
                    method: method,
                    body: formData,
                });
                await this.fetchPageData(this.pagination.number, this.pagination.size);
            } finally {
                this.loading = false;
            }
        },
        async deleteData(id) {
            this.loading = true;
            try {
                await fetch(`${base_url}/${id}`, { method: 'DELETE' });
                await this.fetchPageData(this.pagination.number, this.pagination.size);
            } finally {
                this.loading = false;
            }
        }
    }
});
