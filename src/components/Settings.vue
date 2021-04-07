<template>
  <div class="main" style="display: flex; flex-direction: column;">
    <div style="flex: 10 1 1px;">
      <div style="display: flex; flex-direction: column; justify-content: center; align-items: baseline;">

        <div class="menuItem">
          <b-input-group prepend="Название института">
            <b-form-input v-model="nameOfInstitut" list="input-list" id="input-with-list"></b-form-input>
            <b-form-datalist id="input-list" :options="options"></b-form-datalist>
          </b-input-group>
        </div>

        <div class="menuItem">
          <b-input-group prepend="Директор института">
            <b-form-input v-model="directorOfInstitut"></b-form-input>
          </b-input-group>
        </div>

        <div class="menuItem">
          <b-input-group prepend="Название кафедры">
            <b-form-input v-model="nameOfKafedra"></b-form-input>
          </b-input-group>
        </div>

        <div class="menuItem">
          <b-input-group prepend="Название каф. (сокр)">
            <b-form-input v-model="shortNameOfKafedra"></b-form-input>
          </b-input-group>
        </div>

        <div class="menuItem">
          <b-input-group prepend="Зав. кафедрой">
            <b-form-input v-model="zavedKafedroy"></b-form-input>
          </b-input-group>
        </div>

        <div class="menuItem">
          <b-input-group prepend="Ставка">
            <b-form-input v-model="stavka"></b-form-input>
          </b-input-group>
        </div>


        <button id="toggle-dark-mode">Toggle Dark Mode</button>
        <button id="reset-to-system">Reset to System Theme</button>

      </div>
    </div>
    <div class="borderWhite" style="flex: 0 0 45px; margin: 5px 5px 5px; display: flex; flex-direction: column">

      <div style="display: flex; margin: auto">
        <div style="flex: 1 1 1px">
          <b-button @click="save" variant="outline-primary">Сохранить</b-button>
        </div>
      </div>

    </div>

    <!--    <a href="http://localhost:8081/" target="_blank">132131233</a>-->

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
      options: ['АБП', 'АВТ', 'ИМТК', 'ИПСС', 'ИТТСУ', 'ИУЦТ', 'ИЭФ', 'НИИ ТТС', 'РАПС', 'РОАТ', 'ЮИ'],
      windowName: this.$options._componentTag,

      // input data:
      directorOfInstitut: "",
      nameOfInstitut: "",
      nameOfKafedra: "",
      shortNameOfKafedra: "",
      stavka: "",
      zavedKafedroy: "",
    }
  },
  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  mounted() {
    console.info(this.settings);
    console.info(this.settings.labels);


    this.updateLabels();


    // Black theme

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


  methods: {
    // Сохранить данные
    save() {
      let labels = {
        directorOfInstitut: this.directorOfInstitut,
        nameOfInstitut: this.nameOfInstitut,
        nameOfKafedra: this.nameOfKafedra,
        shortNameOfKafedra: this.shortNameOfKafedra,
        stavka: this.stavka,
        zavedKafedroy: this.zavedKafedroy
      }
      this.busVue.$emit('updateParamsToDB', this.windowName, 'labels', labels);
    },

    // Применение параметров к инпутам
    updateLabels() {
      if (this.settings && this.settings.labels) {
        for (let item in this.settings.labels) {
          this[item] = this.settings.labels[item];
        }
      }
    }
  }
}
</script>

<style scoped>

.input-group > .input-group-prepend {
  flex: 0 0 150px;
}

.input-group .input-group-text {
  width: 100%;
}

smart-combo-box {
  text-align: left;
}

smart-text-box {
  text-align: left;
}

.main {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
  margin: 5px;
  /*width: calc(100% - 20px);*/
  /*height: calc(100% - 40px);*/
  /*margin: 9px;*/
  /*margin: 20px -40px -40px 20px;*/
}


.labels {
  flex: 0 0 160px;
  margin-right: 20px;
  margin-top: 5px;
}

</style>
