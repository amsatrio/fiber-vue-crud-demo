<script lang="ts" setup>
import { useMMedicalItemStore } from '@/modules/hospital/m-medical-item/store';
import { computed, onMounted, ref } from 'vue';

const store = useMMedicalItemStore();
const isEdit = ref(false);
const selectedId = ref<number | null>(null);
const imagePreview = ref<string | null>(null);

// Dedicated state for showing full details
const selectedItem = ref<any>(null);

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

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    store.data.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

// Open Detail View Modal
const openDetailModal = (item: any) => {
  selectedItem.value = item;
  (document.getElementById('m_medical_item_detail_modal') as HTMLDialogElement).showModal();
};

// Open Create/Edit Form Modal
const openModal = (item: any = null) => {
  imagePreview.value = null;
  if (item) {
    isEdit.value = true;
    selectedId.value = item.id;
    store.data = { ...item };
  } else {
    isEdit.value = false;
    selectedId.value = null;
    store.data = { name: '', medicalItemCategoryId: null, composition: '', medicalItemSegmentationId: null, manufacturer: '', indication: '', dosage: '', directions: '', contraindication: '', caution: '', packaging: '', priceMax: null, priceMin: null, image: null, imagePath: '' };
  }
  (document.getElementById('m_medical_item_modal') as HTMLDialogElement).showModal();
};

const submitForm = async () => {
  await store.saveData(selectedId.value);
  (document.getElementById('m_medical_item_modal') as HTMLDialogElement).close();
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
      <h1 class="text-2xl font-bold">M Medical Item Management</h1>
      <button class="btn btn-primary" @click="openModal()">Add New</button>
    </div>

    <div class="overflow-x-auto border border-base-300 rounded-box">
      <table class="table table-zebra w-full">
        <thead>
          <tr class="bg-base-200">
            <th>ID</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Medical Item Category Id</th>
            <th>Composition</th>
            <th>Medical Item Segmentation Id</th>
            <th>Manufacturer</th>
            <th>Indication</th>
            <th>Dosage</th>
            <th>Directions</th>
            <th>Contraindication</th>
            <th>Caution</th>
            <th>Packaging</th>
            <th>Price Max</th>
            <th>Price Min</th>
            <th>Image Path</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="store.loading">
            <td colspan="10" class="text-center py-4 text-info">Loading...</td>
          </tr>
          <tr v-for="data in store.pagedata" :key="data.id" class="hover">
            <th>{{ data.id }}</th>
            <td>
              <div class="avatar">
                <div class="w-12 h-12 rounded-full border overflow-hidden">
                  <img :src="'data:image/png;base64,' + data.image" alt="Avatar" class="object-cover w-full h-full" />
                </div>
              </div>
            </td>
            <td class="font-medium">{{ data.name || '-' }}</td>
            <td class="font-medium">{{ data.medicalItemCategoryId || '-' }}</td>
            <td class="font-medium">{{ data.composition || '-' }}</td>
            <td class="font-medium">{{ data.medicalItemSegmentationId || '-' }}</td>
            <td class="font-medium">{{ data.manufacturer || '-' }}</td>
            <td class="font-medium">{{ data.indication || '-' }}</td>
            <td class="font-medium">{{ data.dosage || '-' }}</td>
            <td class="font-medium">{{ data.directions || '-' }}</td>
            <td class="font-medium">{{ data.contraindication || '-' }}</td>
            <td class="font-medium">{{ data.caution || '-' }}</td>
            <td class="font-medium">{{ data.packaging || '-' }}</td>
            <td class="font-medium">{{ data.priceMax || '-' }}</td>
            <td class="font-medium">{{ data.priceMin || '-' }}</td>
            <td class="font-medium">{{ data.imagePath || '-' }}</td>
            <td>
              <div class="flex justify-center gap-2">
                <button @click="openDetailModal(data)" class="btn btn-sm btn-success btn-outline">Details</button>
                <button @click="openModal(data)" class="btn btn-sm btn-info btn-outline">Edit</button>
                <button @click="handleDelete(data.id)" class="btn btn-sm btn-error btn-outline">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Details View Modal -->
    <dialog id="m_medical_item_detail_modal" class="modal">
      <div class="modal-box max-w-md">
        <h3 class="font-bold text-xl mb-4">M Medical Item Details</h3>
        
        <div v-if="selectedItem" class="flex flex-col items-center space-y-4">
          <!-- Image Section -->
          <div class="avatar">
            <div class="w-36 h-36 rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-md">
              <img 
                :src="'data:image/png;base64,' + selectedItem.image" 
                :alt="selectedItem.id" 
                class="object-cover w-full h-full"
              />
            </div>
          </div>
          <!-- Details Card -->
          <div class="w-full bg-base-200 rounded-box p-4 space-y-3">
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">ID</span>
              <span class="font-semibold">{{ selectedItem.id }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Name</span>
              <span class="font-semibold">{{ selectedItem.name ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Medical Item Category Id</span>
              <span class="font-semibold">{{ selectedItem.medicalItemCategoryId ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Composition</span>
              <span class="font-semibold">{{ selectedItem.composition ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Medical Item Segmentation Id</span>
              <span class="font-semibold">{{ selectedItem.medicalItemSegmentationId ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Manufacturer</span>
              <span class="font-semibold">{{ selectedItem.manufacturer ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Indication</span>
              <span class="font-semibold">{{ selectedItem.indication ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Dosage</span>
              <span class="font-semibold">{{ selectedItem.dosage ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Directions</span>
              <span class="font-semibold">{{ selectedItem.directions ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Contraindication</span>
              <span class="font-semibold">{{ selectedItem.contraindication ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Caution</span>
              <span class="font-semibold">{{ selectedItem.caution ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Packaging</span>
              <span class="font-semibold">{{ selectedItem.packaging ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Price Max</span>
              <span class="font-semibold">{{ selectedItem.priceMax ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Price Min</span>
              <span class="font-semibold">{{ selectedItem.priceMin ?? '-' }}</span>
            </div>
            <div class="flex justify-between border-b border-base-300 pb-2">
              <span class="text-sm font-medium opacity-70">Image Path</span>
              <span class="font-semibold">{{ selectedItem.imagePath ?? '-' }}</span>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>

    <!-- Create / Edit Form Modal -->
    <dialog id="m_medical_item_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{ isEdit ? 'Edit' : 'Create' } M Medical Item</h3>
        
        <div class="py-4 space-y-4">
          <div class="form-control">
            <label class="label"><span class="label-text">Name</span></label>
            <input v-model="store.data.name" type="text" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Medical Item Category Id</span></label>
            <input v-model.number="store.data.medicalItemCategoryId" type="number" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Composition</span></label>
            <input v-model="store.data.composition" type="text" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Medical Item Segmentation Id</span></label>
            <input v-model.number="store.data.medicalItemSegmentationId" type="number" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Manufacturer</span></label>
            <input v-model="store.data.manufacturer" type="text" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Indication</span></label>
            <input v-model="store.data.indication" type="text" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Dosage</span></label>
            <input v-model="store.data.dosage" type="text" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Directions</span></label>
            <input v-model="store.data.directions" type="text" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Contraindication</span></label>
            <input v-model="store.data.contraindication" type="text" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Caution</span></label>
            <input v-model="store.data.caution" type="text" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Packaging</span></label>
            <input v-model="store.data.packaging" type="text" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Price Max</span></label>
            <input v-model.number="store.data.priceMax" type="number" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Price Min</span></label>
            <input v-model.number="store.data.priceMin" type="number" class="input input-bordered w-full" />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Upload Image</span></label>
            <input 
              type="file" 
              accept="image/*" 
              class="file-input file-input-bordered w-full" 
              @change="handleFileChange"
            />
          </div>

          <div v-if="imagePreview" class="flex justify-center pt-2">
            <img :src="imagePreview" alt="Preview" class="w-24 h-24 object-cover rounded-lg border" />
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
