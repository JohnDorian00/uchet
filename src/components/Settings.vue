<template>
  <div style="display: flex; flex-direction: column;">

    <!--  Выбор сохранения  -->
    <div class="borderWhite" style="flex: 0 0 1px; margin: 5px 0 0; display: flex; flex-direction: column">
      <div class="borderWhite" style="margin: 0 0 5px;">
        Выбор сохранения
      </div>
      <div style="flex: 0 0 1px;">
        <b-form-file
            :key="saveFile.path"
            :browse-text="'Открыть'"
            id="saveForm"
            style="margin-bottom: 5px"
            :state="Boolean(saveFile.path)"
            accept=".db"
            :placeholder="placeholder"
            drop-placeholder="Перетащите сюда..."
            :file-name-formatter="formatNames"
            @input="saveChange"
            v-model="inpFileObj"
        ></b-form-file>
        <div v-if="saveFile && saveFile.name" style="margin-bottom: 5px">Выбрано сохранение: {{
            saveFile.name
          }}
        </div>
        <div v-else style="margin-bottom: 5px">Сохранение не выбрано</div>
      </div>

      <!--    Кнопки и инпуты -->
      <div class="borderWhite" style=" display: flex; margin: 0; flex-direction: column;">
        <div class="menuItem marginInput" style="display: flex; flex-direction: row; margin: 0">

          <b-input-group prepend="Название">
            <b-form-input v-model="newSaveName" tabindex="1"></b-form-input>
          </b-input-group>
          <div style="margin: 0 5px 0">
            <b-button style="width: 150px" @click="addSave" variant="outline-primary">Создать сохранение</b-button>
          </div>
        </div>
      </div>
    </div>

    <!--  Настройка названий  -->
    <div class="borderWhite" style="flex: 1 1 1px; margin: 10px 0 0">
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
// import Grid from "@/components/Grid";
import * as db from "./db.js";

export default {
  name: "Settings",
  components: {},

  watch: {
    inpFileObj(newData) {
      return newData;
    }
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
      newSaveName: "",

      saveFile: {},
      inpFileObj: null,
      placeholder: 'Укажите файл или перетащите его сюда...',


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
      }
    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  async mounted() {
    this.getLocalSave();

    console.info(db.isConnected());
    console.info(localStorage.getItem('path'));

    // Если нет коннекта или путь в коннекте != пути в локалсторедж
    if ((!db.isConnected() && localStorage.getItem('path')) || (db.isConnected() && (localStorage.getItem('path') && localStorage.getItem('path') !== db.getPath()))) {
      // Connect к бд по пути из локал сторедж
      let locName = localStorage.getItem('name'),
          err = await db.connect();

      console.info(err);
      if (err) {
        let text = locName ? "База данных " + locName + " не найдена" : "База данных не найдена";
        this.bus.notify(text, 'w');
        this.saveFile = {};
        this.placeholder = 'Укажите файл или перетащите его сюда...';
        console.log(err);
      }
    }

    // if (!db.isConnected()) {
    //   this.saveFile = {};
    //   this.placeholder = 'Укажите файл или перетащите его сюда...';
    // }

    await this.updateLabels();
    this.busVue.$on('saveSettings', this.save);

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

  beforeDestroy() {
    this.busVue.$off('saveSettings');
  },

  methods: {
    // Сохранить данные
    async save() {
      let err = await db.run("INSERT OR REPLACE INTO Settings(SettingsID,directorOfInstitut,nameOfInstitut,nameOfKafedra,shortNameOfKafedra,stavka,zavedKafedroy) VALUES(0," + "'" + this.directorOfInstitut + "','" + this.nameOfInstitut + "','" + this.nameOfKafedra + "','" + this.shortNameOfKafedra + "','" + this.stavka + "','" + this.zavedKafedroy + "');")
      if (err) {
        console.error(err)
        this.bus.notify('Ошибка сохранения', 'e')
      } else {
        this.bus.notify('Данные сохранены', 's')
      }
    },

    // Проверка сохранения из локалсторедж
    getLocalSave() {
      // Проверка сохранения в локалсторедж
      let path = localStorage.getItem('path'),
          name = localStorage.getItem('name');

      if (name && path) {
        this.saveFile.path = path;
        this.saveFile.name = name;
        this.placeholder = path;
      } else {
        this.saveFile = {};
        this.placeholder = 'Укажите файл или перетащите его сюда...';
      }
    },

    // Применение параметров к инпутам
    async updateLabels() {
      let data = await db.getTable('Settings');

      if (data && data.data) {
        data = data.data
      } else {
        console.warn(data);
        return
        // this.bus.notify("Ошибка получения данных для окна", 'w');
      }

      if (!data || !data[0]) {
        this.directorOfInstitut = "";
        this.nameOfInstitut = "";
        this.nameOfKafedra = "";
        this.shortNameOfKafedra = "";
        this.stavka = "";
        this.zavedKafedroy = "";
      } else {
        data = data[0];
        delete data.SettingsID;

        let keys = Object.keys(data);

        keys.forEach((key) => {
          this[key] = data[key];
        })
      }

    },

    // Новое сохранение
    async addSave() {
      if (!this.newSaveName) {
        this.bus.notify("Укажите имя файла", 'w');
      } else {
        this.newSaveName += '.db';

        const {ipcRenderer} = require('electron');
        let env = JSON.parse(ipcRenderer.sendSync('get-real-path'));
        let absloutePath = env.PORTABLE_EXECUTABLE_DIR || env.INIT_CWD;

        let path = absloutePath + "\\" + this.newSaveName,
            name = this.newSaveName;

        await db.close();
        let err = await db.createAndConnect(path);

        if (err) {
          console.error(err);
          return this.bus.notify("Ошибка создания бд", 'e')
        }

        localStorage.setItem('name', name);
        localStorage.setItem('path', path);
        this.saveFile.name = name;
        this.saveFile.path = path;
        this.placeholder = this.saveFile.path;
        this.newSaveName = "";
        this.directorOfInstitut = "";
        this.nameOfInstitut = "";
        this.nameOfKafedra = "";
        this.shortNameOfKafedra = "";
        this.stavka = "";
        this.zavedKafedroy = "";

        await db.initDefaultDateBase();
      }
    },

    // Дейсвтие при изменении файла с бд
    async saveChange(newFile) {
      if (!newFile) return;

      if (Array.isArray(newFile) && newFile[0]) {
        newFile = newFile[0];
      } else if (!newFile) {
        return
      }

      if (newFile && newFile.name && newFile.name.slice(-2) !== 'db') {
        this.$nextTick(() => {
          localStorage.removeItem('name');
          localStorage.removeItem('path');
          this.saveFile = null;
          this.bus.notify("Расширение файла не .db", 'w');
        })
      } else {
        if (newFile.name && newFile.path) {
          let path = newFile.path,
              name = newFile.name;

          localStorage.setItem('name', name);
          localStorage.setItem('path', path);
          this.saveFile.name = name;
          this.saveFile.path = path;
          this.placeholder = this.saveFile.path;
          await db.close();
          await db.connect(this.saveFile.path);
          await this.updateLabels();
        }
      }
    },

    // Вывод пути файла в инпут
    formatNames(file) {
      if (Array.isArray(file) && file[0]) file = file[0];

      if (file && file.path) {
        return file.path
      } else {
        return ""
      }
    }


    // // Добавить новое сохранение
    // async addSave() {
    //   let newSaveId = parseInt(await this.bus.dbFunc.addSave(this.saveName));
    //   if (newSaveId) {
    //     // Обновить грид
    //     await this.refreshGrid();
    //     this.bus.notify("Сохранение " + this.saveName + " добавлено", 's');
    //
    //     await this.chooseSave(await this.bus.dbFunc.getSave(newSaveId));
    //   }
    // },
    //
    // // Удалить сохранение
    // async deleteSave() {
    //   let row;
    //   try {
    //     row = this.$refs.grid.getSelected()[0];
    //     if (row && row.id) {
    //       const tx = this.bus.db.transaction('uchet', 'readwrite');
    //       const store = tx.objectStore('uchet');
    //       await store.delete(row.id);
    //
    //       // Если удаляемое сохранение = указанному по дефолту - удалить дефолт сейв
    //       if (row.id === parseInt(localStorage.getItem('save'))) {
    //         localStorage.removeItem('save');
    //         await this.bus.dbFunc.updateBusSettings();
    //         this.updateLabels();
    //       }
    //
    //       await this.refreshGrid();
    //       this.bus.notify("Сохранение " + row.name + " удалено", 's');
    //     }
    //   } catch (e) {
    //     console.log(e);
    //     this.bus.notify("Не удалось удалить сохранение " + row.name, 'e');
    //   }
    // },
    //
    // async chooseSave(row) {
    //   try {
    //     if (!row || (row && !row.id)) row = this.$refs.grid.getSelected()[0];
    //     if (row && row.id) {
    //       localStorage.setItem('save', row.id);
    //       await this.bus.dbFunc.updateBusSettings(row.id);
    //       this.updateLabels();
    //       this.bus.notify("Активировано сохранение " + this.bus.save.name, 's');
    //     }
    //   } catch (e) {
    //     console.log(e);
    //     this.bus.notify("Не удалось выбрать сохранение " + row.name, 'e');
    //   }
    // },
    //
    // // Обновить таблицу сохранений (берется из бд)
    // async refreshGrid() {
    //   this.$refs.grid.setAll(await this.bus.dbFunc.getSave('all'));
    // },
    //
    // // Сохранить данные
    // save() {
    //   let labels = {
    //     directorOfInstitut: this.directorOfInstitut,
    //     nameOfInstitut: this.nameOfInstitut,
    //     nameOfKafedra: this.nameOfKafedra,
    //     shortNameOfKafedra: this.shortNameOfKafedra,
    //     stavka: this.stavka,
    //     zavedKafedroy: this.zavedKafedroy
    //   }
    //
    //   this.bus.dbFunc.setSave({[this.windowName]: {labels: labels}});
    // },
    //
    // // Применение параметров к инпутам
    // updateLabels() {
    //   if (this.settings && this.settings[this.windowName] && this.settings[this.windowName].labels) {
    //     for (let item in this.settings[this.windowName].labels) {
    //       this[item] = this.settings[this.windowName].labels[item];
    //     }
    //   } else {
    //     this.directorOfInstitut = "";
    //     this.nameOfInstitut = "";
    //     this.nameOfKafedra = "";
    //     this.shortNameOfKafedra = "";
    //     this.stavka = "";
    //     this.zavedKafedroy = "";
    //   }
    // }
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
