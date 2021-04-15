<template>
  <div style="display: flex; flex-direction: column;">

    <!--  Настройка названий  -->
    <div class="borderWhite" style="flex: 0 0 1px; margin: 0">
      <div class="borderWhite" style="margin: 0 0 5px">
        Настройка названий
      </div>
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

        <div class="menuItem" style="margin-bottom: 0">
          <b-input-group prepend="Ставка">
            <b-form-input v-model="stavka"></b-form-input>
          </b-input-group>
        </div>


        <!--        <button id="toggle-dark-mode">Toggle Dark Mode</button>-->
        <!--        <button id="reset-to-system">Reset to System Theme</button>-->

      </div>
    </div>

    <!--  Выбор сохранения  -->
    <div class="borderWhite" style="flex: 1 1 1px; margin: 10px 0 0; display: flex; flex-direction: column">
      <div class="borderWhite" style="margin: 0 0 5px;">
        Выбор сохранения
      </div>
      <div style="flex: 1 1 1px;">
        <Grid
            ref="grid"
            :winName="'Settings'"
            :settings="gridSettings"
        ></Grid>
      </div>

    </div>

  </div>
</template>

<script>
import Grid from "@/components/Grid";

// const {ipcRenderer} = require('electron');

export default {
  name: "Settings",
  components: {
    Grid
  },

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

      gridSettings: {
        columnDefs: [
          {field: 'name', headerName: 'Название', minWidth: 10},
          {field: 'date', headerName: 'Дата', minWidth: 10}
        ],
        rowData: [
          {
            name: 'save1testfull', date: '01.02.2020'
          }
        ],
      },
    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  mounted() {
    this.busVue.$on('saveSettings', this.save);
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

.labels {
  flex: 0 0 160px;
  margin-right: 20px;
  margin-top: 5px;
}

</style>
