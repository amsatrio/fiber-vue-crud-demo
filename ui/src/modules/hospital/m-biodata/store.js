
import { defineStore } from 'pinia';

let base_url = "http://localhost:9001/v1/m-biodata";

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
            const url = id ? base_url : base_url;
            try {
                await fetch(url, {
                    method: method,
                    body: JSON.stringify(id ? { id, ...this.data } : this.data),
                    headers: { 'Content-type': 'application/json' },
                });
                await this.fetchPageData();
            } finally {
                this.loading = false;
            }
        },
        async deleteData(id) {
            this.loading = true;
            try {
                await fetch(`${base_url}/${id}`, { method: 'DELETE' });
                await this.fetchPageData();
            } finally {
                this.loading = false;
            }
        }
    }
});