<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = ref('')

const menuGroups = ref([
  {
    name: 'Master Data',
    items: [
      { name: 'Admin', path: '/hospital/m-admin' },
      { name: 'Bank', path: '/hospital/m-bank' },
      { name: 'Biodata', path: '/hospital/m-biodata' },
      { name: 'Biodata Address', path: '/hospital/m-biodata-address' },
      { name: 'Biodata Attachment', path: '/hospital/m-biodata-attachment' },
      { name: 'Blood Group', path: '/hospital/m-blood-group' },
      { name: 'Courier', path: '/hospital/m-courier' },
      { name: 'Courier Type', path: '/hospital/m-courier-type' },
      { name: 'Customer', path: '/hospital/m-customer' },
      { name: 'Customer Member', path: '/hospital/m-customer-member' },
      { name: 'Customer Relation', path: '/hospital/m-customer-relation' },
      { name: 'Education Level', path: '/hospital/m-education-level' },
      { name: 'Location', path: '/hospital/m-location' },
      { name: 'Location Level', path: '/hospital/m-location-level' },
      { name: 'Payment Method', path: '/hospital/m-payment-method' },
      { name: 'Wallet Default Nominal', path: '/hospital/m-wallet-default-nominal' },
    ]
  },
  {
    name: 'Medical & Facilities',
    items: [
      { name: 'Doctor', path: '/hospital/m-doctor' },
      { name: 'Doctor Education', path: '/hospital/m-doctor-education' },
      { name: 'Specialization', path: '/hospital/m-specialization' },
      { name: 'Medical Facility', path: '/hospital/m-medical-facility' },
      { name: 'Facility Category', path: '/hospital/m-medical-facility-category' },
      { name: 'Facility Schedule', path: '/hospital/m-medical-facility-schedule' },
      { name: 'Medical Item', path: '/hospital/m-medical-item' },
      { name: 'Medical Item Category', path: '/hospital/m-medical-item-category' },
      { name: 'Medical Item Segmentation', path: '/hospital/m-medical-item-segmentation' },
    ]
  },
  {
    name: 'Transactions & Appointments',
    items: [
      { name: 'Appointments', path: '/hospital/t-appointment' },
      { name: 'Cancellation', path: '/hospital/t-appointment-cancellation' },
      { name: 'Done Appointments', path: '/hospital/t-appointment-done' },
      { name: 'Reschedule History', path: '/hospital/t-appointment-reschedule-history' },
      { name: 'Current Doctor Spec.', path: '/hospital/t-current-doctor-specialization' },
      { name: 'Customer Chat', path: '/hospital/t-customer-chat' },
      { name: 'Customer Chat History', path: '/hospital/t-customer-chat-history' },
      { name: 'Custom Nominal', path: '/hospital/t-customer-custom-nominal' },
      { name: 'Registered Card', path: '/hospital/t-customer-registered-card' },
      { name: 'Customer VA', path: '/hospital/t-customer-va' },
      { name: 'Customer VA History', path: '/hospital/t-customer-va-history' },
      { name: 'Customer Wallet', path: '/hospital/t-customer-wallet' },
      { name: 'Wallet Top Up', path: '/hospital/t-customer-wallet-top-up' },
      { name: 'Wallet Withdraw', path: '/hospital/t-customer-wallet-withdraw' },
      { name: 'Doctor Office', path: '/hospital/t-doctor-office' },
      { name: 'Doctor Office Schedule', path: '/hospital/t-doctor-office-schedule' },
      { name: 'Doctor Office Treatment', path: '/hospital/t-doctor-office-treatment' },
      { name: 'Treatment Price', path: '/hospital/t-doctor-office-treatment-price' },
      { name: 'Doctor Treatment', path: '/hospital/t-doctor-treatment' },
      { name: 'Item Purchase', path: '/hospital/t-medical-item-purchase' },
      { name: 'Item Purchase Detail', path: '/hospital/t-medical-item-purchase-detail' },
      { name: 'Treatment Discount', path: '/hospital/t-treatment-discount' },
      { name: 'Courier Discount', path: '/hospital/t-courier-discount' },
    ]
  },
  {
    name: 'System & Security',
    items: [
      { name: 'User Management', path: '/hospital/m-user' },
      { name: 'Role Management', path: '/hospital/m-role' },
      { name: 'Menu Management', path: '/hospital/m-menu' },
      { name: 'Menu Role', path: '/hospital/m-menu-role' },
      { name: 'Reset Password', path: '/hospital/t-reset-password' },
      { name: 'Tokens', path: '/hospital/t-token' },
    ]
  }
])

const filteredGroups = computed(() => {
  if (!searchQuery.value.trim()) return menuGroups.value
  
  const query = searchQuery.value.toLowerCase()
  return menuGroups.value
    .map(group => ({
      ...group,
      items: group.items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.path.toLowerCase().includes(query)
      )
    }))
    .filter(group => group.items.length > 0)
})
</script>

<template>
  <div class="hospital-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Hospital Admin</h3>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search menu..." 
          class="search-input"
        />
      </div>

      <nav class="sidebar-nav">
        <div 
          v-for="group in filteredGroups" 
          :key="group.name" 
          class="menu-group"
        >
          <div class="group-title">{{ group.name }}</div>
          <router-link
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ active: route.path === item.path }"
          >
            {{ item.name }}
          </router-link>
        </div>
      </nav>
    </aside>

    <main class="hospital-container">
      <router-view />
    </main>
  </div>
</template>

<style lang="less" scoped>
@sidebar-width: 260px;

.hospital-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: system-ui, -apple-system, sans-serif;
}

.sidebar {
  width: @sidebar-width;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .sidebar-header {
    padding: 1rem;
    border-bottom: 1px solid;

    h3 {
      margin: 0 0 0.75rem 0;
      font-size: 1.1rem;
    }

    .search-input {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.875rem;
      box-sizing: border-box;

      &:focus {
        outline: none;
      }
    }
  }

  .sidebar-nav {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0.5rem;

    .menu-group {
      margin-bottom: 1.25rem;

      .group-title {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        padding: 0 0.75rem 0.5rem;
        letter-spacing: 0.05em;
      }

      .nav-item {
        display: block;
        padding: 0.5rem 0.75rem;
        text-decoration: none;
        font-size: 0.875rem;
        border-radius: 6px;
        transition: background-color 0.15s, color 0.15s;
        margin-bottom: 0.125rem;

        &.active,
        &.router-link-active {
          font-weight: 600;
        }
      }
    }
  }
}

.hospital-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}
</style>