import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin, InputGroupPlugin  } from 'bootstrap-vue'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
Vue.use(InputGroupPlugin);


Vue.config.productionTip = false


new Vue({
    render: h => h(App),
}).$mount('#app')
