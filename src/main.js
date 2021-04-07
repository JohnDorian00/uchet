import Vue from 'vue'
import Notifications from 'vue-notification'

import App from './App.vue'
import { BootstrapVue, IconsPlugin, InputGroupPlugin  } from 'bootstrap-vue'

// BootstrapVue
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(InputGroupPlugin);

// Нотификации
Vue.use(Notifications)


Vue.config.productionTip = false


new Vue({
    render: h => h(App),
}).$mount('#app')
