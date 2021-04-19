import Vue from 'vue'
import Notifications from 'vue-notification'
import vBlur from 'v-blur'

import App from './App.vue'
import {BootstrapVue, IconsPlugin, InputGroupPlugin} from 'bootstrap-vue'

// BootstrapVue
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(InputGroupPlugin);

// Нотификации
Vue.use(Notifications)

// Блюр
Vue.use(vBlur)

Vue.config.productionTip = false


new Vue({
    render: h => h(App)
}).$mount('#app')


// "build": {
//     "productName": "uchet",
//         "win": {
//         "target": [
//             "portable"
//         ]
//     },
//     "portable": {
//         "artifactName": "uchet.exe"
//     },
//     "directories": {
//         "output": "build"
//     }
// }
