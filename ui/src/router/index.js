import CounterView from '@/modules/counter/counter_view.vue'
import HomeView from '@/modules/home/home_view.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/counter',
      name: 'counter',
      component: CounterView
    },
    {
      path: '/hospital',
      component: () => import('@/modules/hospital/layout.vue'),
      children: [
        {
          path: 'm-admin',
          name: 'm-admin',
          component: () => import('@/modules/hospital/m-admin/view.vue'),
        },
        {
          path: 'm-bank',
          name: 'm-bank',
          component: () => import('@/modules/hospital/m-bank/view.vue'),
        },
        {
          path: 'm-biodata',
          name: 'm-biodata',
          component: () => import('@/modules/hospital/m-biodata/view.vue'),
        },
        {
          path: 'm-biodata-address',
          name: 'm-biodata-address',
          component: () => import('@/modules/hospital/m-biodata-address/view.vue'),
        },
        {
          path: 'm-blood-group',
          name: 'm-blood-group',
          component: () => import('@/modules/hospital/m-blood-group/view.vue'),
        },
        {
          path: 'm-courier',
          name: 'm-courier',
          component: () => import('@/modules/hospital/m-courier/view.vue'),
        },
        {
          path: 'm-customer',
          name: 'm-customer',
          component: () => import('@/modules/hospital/m-customer/view.vue'),
        },
        {
          path: 'm-customer-member',
          name: 'm-customer-member',
          component: () => import('@/modules/hospital/m-customer-member/view.vue'),
        },
        {
          path: 'm-customer-relation',
          name: 'm-customer-relation',
          component: () => import('@/modules/hospital/m-customer-relation/view.vue'),
        },
        {
          path: 'm-doctor',
          name: 'm-doctor',
          component: () => import('@/modules/hospital/m-doctor/view.vue'),
        },
        {
          path: 'm-doctor-education',
          name: 'm-doctor-education',
          component: () => import('@/modules/hospital/m-doctor-education/view.vue'),
        },
        {
          path: 'm-education-level',
          name: 'm-education-level',
          component: () => import('@/modules/hospital/m-education-level/view.vue'),
        },
        {
          path: 'm-location',
          name: 'm-location',
          component: () => import('@/modules/hospital/m-location/view.vue'),
        },
        {
          path: 'm-location-level',
          name: 'm-location-level',
          component: () => import('@/modules/hospital/m-location-level/view.vue'),
        },
        {
          path: 'm-medical-facility',
          name: 'm-medical-facility',
          component: () => import('@/modules/hospital/m-medical-facility/view.vue'),
        },
        {
          path: 'm-medical-facility-category',
          name: 'm-medical-facility-category',
          component: () => import('@/modules/hospital/m-medical-facility-category/view.vue'),
        },
        {
          path: 'm-medical-facility-schedule',
          name: 'm-medical-facility-schedule',
          component: () => import('@/modules/hospital/m-medical-facility-schedule/view.vue'),
        },
        {
          path: 'm-medical-item',
          name: 'm-medical-item',
          component: () => import('@/modules/hospital/m-medical-item/view.vue'),
        },
        {
          path: 'm-medical-item-category',
          name: 'm-medical-item-category',
          component: () => import('@/modules/hospital/m-medical-item-category/view.vue'),
        },
        {
          path: 'm-medical-item-segmentation',
          name: 'm-medical-item-segmentation',
          component: () => import('@/modules/hospital/m-medical-item-segmentation/view.vue'),
        },
        {
          path: 'm-menu',
          name: 'm-menu',
          component: () => import('@/modules/hospital/m-menu/view.vue'),
        },
        {
          path: 'm-menu-role',
          name: 'm-menu-role',
          component: () => import('@/modules/hospital/m-menu-role/view.vue'),
        },
        {
          path: 'm-payment-method',
          name: 'm-payment-method',
          component: () => import('@/modules/hospital/m-payment-method/view.vue'),
        },
        {
          path: 'm-role',
          name: 'm-role',
          component: () => import('@/modules/hospital/m-role/view.vue'),
        },
        {
          path: 'm-specialization',
          name: 'm-specialization',
          component: () => import('@/modules/hospital/m-specialization/view.vue'),
        },
        {
          path: 'm-user',
          name: 'm-user',
          component: () => import('@/modules/hospital/m-user/view.vue'),
        },
        {
          path: 'm-biodata-attachment',
          name: 'm-biodata-attachment',
          component: () => import('@/modules/hospital/m-biodata-attachment/view.vue'),
        },
        {
          path: 'm-wallet-default-nominal',
          name: 'm-wallet-default-nominal',
          component: () => import('@/modules/hospital/m-wallet-default-nominal/view.vue'),
        },
        {
          path: 't-appointment',
          name: 't-appointment',
          component: () => import('@/modules/hospital/t-appointment/view.vue'),
        },
        {
          path: 't-appointment-cancellation',
          name: 't-appointment-cancellation',
          component: () => import('@/modules/hospital/t-appointment-cancellation/view.vue'),
        },
        {
          path: 't-appointment-done',
          name: 't-appointment-done',
          component: () => import('@/modules/hospital/t-appointment-done/view.vue'),
        },
        {
          path: 't-appointment-reschedule-history',
          name: 't-appointment-reschedule-history',
          component: () => import('@/modules/hospital/t-appointment-reschedule-history/view.vue'),
        },
        {
          path: 't-current-doctor-specialization',
          name: 't-current-doctor-specialization',
          component: () => import('@/modules/hospital/t-current-doctor-specialization/view.vue'),
        },
        {
          path: 't-customer-chat',
          name: 't-customer-chat',
          component: () => import('@/modules/hospital/t-customer-chat/view.vue'),
        },
        {
          path: 't-customer-chat-history',
          name: 't-customer-chat-history',
          component: () => import('@/modules/hospital/t-customer-chat-history/view.vue'),
        },
        {
          path: 't-customer-custom-nominal',
          name: 't-customer-custom-nominal',
          component: () => import('@/modules/hospital/t-customer-custom-nominal/view.vue'),
        },
        {
          path: 't-customer-registered-card',
          name: 't-customer-registered-card',
          component: () => import('@/modules/hospital/t-customer-registered-card/view.vue'),
        },
        {
          path: 't-customer-va',
          name: 't-customer-va',
          component: () => import('@/modules/hospital/t-customer-va/view.vue'),
        },
        {
          path: 't-customer-va-history',
          name: 't-customer-va-history',
          component: () => import('@/modules/hospital/t-customer-va-history/view.vue'),
        },
        {
          path: 't-customer-wallet',
          name: 't-customer-wallet',
          component: () => import('@/modules/hospital/t-customer-wallet/view.vue'),
        },
        {
          path: 't-customer-wallet-top-up',
          name: 't-customer-wallet-top-up',
          component: () => import('@/modules/hospital/t-customer-wallet-top-up/view.vue'),
        },
        {
          path: 't-doctor-office',
          name: 't-doctor-office',
          component: () => import('@/modules/hospital/t-doctor-office/view.vue'),
        },
        {
          path: 't-doctor-office-schedule',
          name: 't-doctor-office-schedule',
          component: () => import('@/modules/hospital/t-doctor-office-schedule/view.vue'),
        },
        {
          path: 't-doctor-office-treatment',
          name: 't-doctor-office-treatment',
          component: () => import('@/modules/hospital/t-doctor-office-treatment/view.vue'),
        },
        {
          path: 't-doctor-office-treatment-price',
          name: 't-doctor-office-treatment-price',
          component: () => import('@/modules/hospital/t-doctor-office-treatment-price/view.vue'),
        },
        {
          path: 't-doctor-treatment',
          name: 't-doctor-treatment',
          component: () => import('@/modules/hospital/t-doctor-treatment/view.vue'),
        },
        {
          path: 't-medical-item-purchase',
          name: 't-medical-item-purchase',
          component: () => import('@/modules/hospital/t-medical-item-purchase/view.vue'),
        },
        {
          path: 't-medical-item-purchase-detail',
          name: 't-medical-item-purchase-detail',
          component: () => import('@/modules/hospital/t-medical-item-purchase-detail/view.vue'),
        },
        {
          path: 't-reset-password',
          name: 't-reset-password',
          component: () => import('@/modules/hospital/t-reset-password/view.vue'),
        },
        {
          path: 't-token',
          name: 't-token',
          component: () => import('@/modules/hospital/t-token/view.vue'),
        },
        {
          path: 't-treatment-discount',
          name: 't-treatment-discount',
          component: () => import('@/modules/hospital/t-treatment-discount/view.vue'),
        },
        {
          path: 'm-courier-type',
          name: 'm-courier-type',
          component: () => import('@/modules/hospital/m-courier-type/view.vue'),
        },
        {
          path: 't-courier-discount',
          name: 't-courier-discount',
          component: () => import('@/modules/hospital/t-courier-discount/view.vue'),
        },
        {
          path: 't-customer-wallet-withdraw',
          name: 't-customer-wallet-withdraw',
          component: () => import('@/modules/hospital/t-customer-wallet-withdraw/view.vue'),
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/modules/errors/not-found.vue')
    }
  ],
})

export default router
