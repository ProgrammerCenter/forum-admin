import Vue from 'vue'
import Router from 'vue-router'
import Admin from '@/components/admin'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [...Admin]
})
