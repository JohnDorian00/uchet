<template>
  <div class="main">

    <div style="display: flex; flex-direction: column; justify-content: center; align-items: baseline">

      <div class="menuItem">
        <b-input-group prepend="Название института">
          <b-form-input list="input-list" id="input-with-list"></b-form-input>
          <b-form-datalist id="input-list" :options="options"></b-form-datalist>
        </b-input-group>
      </div>

      <div class="menuItem">
        <b-input-group prepend="Директор института">
          <b-form-input></b-form-input>
        </b-input-group>
      </div>

      <div class="menuItem">
        <b-input-group prepend="Название кафедры">
          <b-form-input></b-form-input>
        </b-input-group>
      </div>

      <div class="menuItem">
        <b-input-group prepend="Название каф. (сокр)">
          <b-form-input></b-form-input>
        </b-input-group>
      </div>

      <div class="menuItem">
        <b-input-group prepend="Зав. кафедрой">
          <b-form-input></b-form-input>
        </b-input-group>
      </div>

      <div class="menuItem">
        <b-input-group prepend="Ставка">
          <b-form-input></b-form-input>
        </b-input-group>
      </div>

      <button id="toggle-dark-mode">Toggle Dark Mode</button>
      <button id="reset-to-system">Reset to System Theme</button>

    </div>


    <a href="http://localhost:8081/" target="_blank">132131233</a>

  </div>
</template>

<script>

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import "smart-webcomponents/source/styles/smart.default.css";
import "smart-webcomponents/source/modules/smart.combobox.js";
import "smart-webcomponents/source/modules/smart.textbox.js";

// const {ipcRenderer} = require('electron');

export default {
  name: "Settings",
  data() {
    return {
      mainClass: true,
      options: ['АБП', 'АВТ', 'ИМТК', 'ИПСС', 'ИТТСУ', 'ИУЦТ', 'ИЭФ', 'НИИ ТТС', 'РАПС', 'РОАТ', 'ЮИ']
    }
  },
  props: {
    bus: Object
  },

  mounted() {
    // document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    //   const isDarkMode = await ipcRenderer.invoke('dark-mode:toggle')
    //   document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
    // })
    //
    // document.getElementById('reset-to-system').addEventListener('click', async () => {
    //   await ipcRenderer.invoke('dark-mode:system')
    //   document.getElementById('theme-source').innerHTML = 'System'
    // })
  },

  methods: {}
}
</script>

<style scoped>

.input-group>.input-group-prepend {
  flex: 0 0 150px;
}
.input-group .input-group-text {
  width: 100%;
}

smart-combo-box{
  text-align: left;
}

smart-text-box{
  text-align: left;
}

.main {
  width: calc(100% - 20px);
  height: calc(100% - 40px);
  margin: 9px;
  /*margin: 20px -40px -40px 20px;*/
}

.menuItem {
  margin-bottom: 10px;
  flex: 0 0 30px;
  display: flex;
  justify-content: left;
  /*align-items: center;*/
  width: 100%;
  text-align: end;
}

.labels {
  flex: 0 0 160px;
  margin-right: 20px;
  margin-top: 5px;
}

</style>
