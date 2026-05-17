<script lang="ts" setup>
import { useMBiodataStore } from '@/modules/hospital/m-biodata/store';
import { computed, onMounted, ref } from 'vue';

const store = useMBiodataStore();
const isEdit = ref(false);
const selectedId = ref<number | null>(null);

onMounted(() => store.fetchPageData());

const changePage = (newPage: number) => {
  if (newPage >= 0 && newPage < store.pagination.totalPages) {
    store.fetchPageData(newPage, store.pagination.size);
  }
};

const paginationRange = computed(() => {
  const current = store.pagination.number + 1;
  const total = store.pagination.totalPages;
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let l: number;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
});

const openModal = (item: any = null) => {
  if (item) {
    isEdit.value = true;
    selectedId.value = item.id;
    store.data = { ...item };
  } else {
    isEdit.value = false;
    selectedId.value = null;
    store.data = { fullname: '', mobilePhone: '', image: null, imagePath: '' };
  }
  (document.getElementById('biodata_modal') as HTMLDialogElement).showModal();
};

const submitForm = async () => {
  await store.saveData(selectedId.value);
  (document.getElementById('biodata_modal') as HTMLDialogElement).close();
};

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this data?')) {
    await store.deleteData(id);
  }
};
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Biodata Management</h1>
      <button class="btn btn-primary" @click="openModal()">Add New</button>
    </div>

    <div class="overflow-x-auto border border-base-300 rounded-box">
      <table class="table table-zebra w-full">
        <thead>
          <tr class="bg-base-200">
            <th>ID</th>
            <th>Fullname</th>
            <th>Mobile</th>
            <th>Path</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.loading"><td colspan="5" class="text-center py-4 text-info">Loading...</td></tr>
          <tr v-for="data in store.pagedata" :key="data.id" class="hover">
            <th>{{ data.id }}</th>
            <td class="font-medium">{{ data.fullname }}</td>
            <td>{{ data.mobilePhone }}</td>
            <td><span class="badge badge-ghost">{{ data.imagePath || 'N/A' }}</span></td>
            <td>
              <div class="flex justify-center gap-2">
                <button @click="openModal(data)" class="btn btn-sm btn-success btn-outline">Details</button>
                <button @click="openModal(data)" class="btn btn-sm btn-info btn-outline">Edit</button>
                <button @click="handleDelete(data.id)" class="btn btn-sm btn-error btn-outline">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog id="biodata_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ isEdit ? 'Edit' : 'Create' }} Biodata</h3>
        
        <div class="py-4 space-y-4">
          <div class="form-control">
            <label class="label"><span class="label-text">Full Name</span></label>
            <input v-model="store.data.fullname" type="text" class="input input-bordered w-full" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Mobile Phone</span></label>
            <input v-model="store.data.mobilePhone" type="text" class="input input-bordered w-full" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Image Path</span></label>
            <input v-model="store.data.imagePath" type="text" class="input input-bordered w-full" />
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Cancel</button>
          </form>
          <button @click="submitForm" class="btn btn-primary" :disabled="store.loading">
            <span v-if="store.loading" class="loading loading-spinner"></span>
            Save Changes
          </button>
        </div>
      </div>
    </dialog>
  </div>
<div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-base-100 p-4 rounded-box border border-base-300">
    <div class="text-sm opacity-70">
      Page <b>{{ store.pagination.number + 1 }}</b> of <b>{{ store.pagination.totalPages }}</b>
    </div>

    <div class="join">
      <button 
        class="join-item btn btn-sm" 
        :disabled="store.pagination.number === 0"
        @click="changePage(0)"
      >
        ««
      </button>

      <button 
        class="join-item btn btn-sm" 
        :disabled="store.pagination.number === 0"
        @click="changePage(store.pagination.number - 1)"
      >
        «
      </button>

      <template v-for="(page, index) in paginationRange" :key="index">
        <button 
          v-if="page !== '...'"
          class="join-item btn btn-sm"
          :class="{ 'btn-active btn-primary': store.pagination.number === (Number(page) - 1) }"
          @click="changePage(Number(page) - 1)"
        >
          {{ page }}
        </button>
        <button v-else class="join-item btn btn-sm btn-disabled">...</button>
      </template>

      <button 
        class="join-item btn btn-sm" 
        :disabled="store.pagination.number >= store.pagination.totalPages - 1"
        @click="changePage(store.pagination.number + 1)"
      >
        »
      </button>

      <button 
        class="join-item btn btn-sm" 
        :disabled="store.pagination.number >= store.pagination.totalPages - 1"
        @click="changePage(store.pagination.totalPages - 1)"
      >
        »»
      </button>
    </div>

    <select 
      class="select select-bordered select-sm w-24 max-w-xs" 
      v-model="store.pagination.size"
      @change="store.fetchPageData(0, store.pagination.size)"
    >
      <option :value="5">5 rows</option>
      <option :value="10">10 rows</option>
      <option :value="20">20 rows</option>
    </select>
  </div>
</template>