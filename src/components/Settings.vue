<template>
  <div style="display: flex; flex-direction: column;">

    <!--  Выбор сохранения  -->
    <div class="borderWhite" style="flex: 1 1 1px; margin: 5px 0 0; display: flex; flex-direction: column">
      <div class="borderWhite" style="margin: 0 0 5px;">
        Выбор сохранения
      </div>
      <div style="flex: 1 1 1px;">
        <Grid
            ref="grid"
            :winName="'Settings'"
            :settings="gridSettings"
            :rowSelection="'single'"
        ></Grid>
      </div>

      <!--    Кнопки и инпуты -->
      <div class="borderWhite" style=" display: flex; margin: 0; flex-direction: column; border-top: none">
        <div class="menuItem marginInput" style="display: flex; flex-direction: column; margin: 0">

          <div style="flex: 1 1 1px">
            <b-input-group prepend="Название">
              <b-form-input v-model="saveName" tabindex="1"></b-form-input>
            </b-input-group>
          </div>

          <div style="display: flex; flex-direction: row; margin-top: 5px; justify-content: space-around">

            <div style="display: flex; flex-direction: row">
              <div style="flex: 0 0 auto; margin-right: 5px">
                <b-button style="width: 85px" @click="addSave" variant="outline-primary">Добавить</b-button>
              </div>
              <div style="flex: 0 0 auto; margin-right: 5px">
                <b-button style="width: 85px" @click="deleteSave" variant="outline-primary">Удалить</b-button>
              </div>
            </div>


            <div style="flex: 0 0 auto; margin-right: 5px">
              <b-button style="width: 85px" @click="chooseSave" variant="outline-primary">Выбрать</b-button>
            </div>

            <div style="display: flex; flex-direction: row">
              <div style="flex: 0 0 auto; margin-right: 5px">
                <b-button disabled style="width: 85px" variant="outline-primary">Экспорт</b-button>
              </div>
              <div style="flex: 0 0 auto; margin-right: 5px">
                <b-button disabled style="width: 85px" variant="outline-primary">Импорт</b-button>
              </div>
            </div>


          </div>


        </div>
      </div>
    </div>

    <!--  Настройка названий  -->
    <div class="borderWhite" style="flex: 0 0 1px; margin: 10px 0 0">
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
      saveName: "",

      gridSettings: {
        columnDefs: [
          {
            headerName: "id",
            field: "id",
            hide: true
          },
          {field: 'name', headerName: 'Название', minWidth: 10},
          {field: 'date', headerName: 'Дата сохранения', minWidth: 10}
        ],
        rowData: [],
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
    this.refreshGrid();

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
    // Добавить новое сохранение
    async addSave() {
      let newSaveId = parseInt(await this.bus.dbFunc.addSave(this.saveName));
      if (newSaveId) {
        // Обновить грид
        await this.refreshGrid();
        this.bus.notify("Сохранение " + this.saveName + " добавлено", 's');

        await this.chooseSave(await this.bus.dbFunc.getSave(newSaveId));
      }
    },

    // Удалить сохранение
    async deleteSave() {
      let row;
      try {
        row = this.$refs.grid.getSelected()[0];
        if (row && row.id) {
          const tx = this.bus.db.transaction('uchet', 'readwrite');
          const store = tx.objectStore('uchet');
          await store.delete(row.id);

          // Если удаляемое сохранение = указанному по дефолту - удалить дефолт сейв
          if (row.id === parseInt(localStorage.getItem('save'))) {
            localStorage.removeItem('save');
            await this.bus.dbFunc.updateBusSettings();
            this.updateLabels();
          }

          await this.refreshGrid();
          this.bus.notify("Сохранение " + row.name + " удалено", 's');
        }
      } catch (e) {
        console.log(e);
        this.bus.notify("Не удалось удалить сохранение " + row.name, 'e');
      }
    },

    async chooseSave(row) {
      try {
        if (!row || (row && !row.id)) row = this.$refs.grid.getSelected()[0];
        if (row && row.id) {
          localStorage.setItem('save', row.id);
          await this.bus.dbFunc.updateBusSettings(row.id);
          this.updateLabels();
          this.bus.notify("Активировано сохранение " + this.bus.save.name, 's');
        }
      } catch (e) {
        console.log(e);
        this.bus.notify("Не удалось выбрать сохранение " + row.name, 'e');
      }
    },

    // Обновить таблицу сохранений (берется из бд)
    async refreshGrid() {
      this.$refs.grid.setAll(await this.bus.dbFunc.getSave('all'));
    },

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

      this.bus.dbFunc.setSave({[this.windowName]: {labels: labels}});
    },

    // Применение параметров к инпутам
    updateLabels() {
      if (this.settings && this.settings[this.windowName] && this.settings[this.windowName].labels) {
        for (let item in this.settings[this.windowName].labels) {
          this[item] = this.settings[this.windowName].labels[item];
        }
      } else {
        this.directorOfInstitut = "";
        this.nameOfInstitut = "";
        this.nameOfKafedra = "";
        this.shortNameOfKafedra = "";
        this.stavka = "";
        this.zavedKafedroy = "";
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
