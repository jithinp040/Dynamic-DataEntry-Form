import Vue from 'vue'
import Router from 'vue-router'
import dynaDB from '@/components/dynaDB'
import print from '@/components/print'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dynaDB',
      component: dynaDB
    },
    {
      path: '/print',
      name: 'print',
      component: print
    }
  ]
})
