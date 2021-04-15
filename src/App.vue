<template>
  <div id="app" style="margin-top: 0; width: 100%; height: 100%; -webkit-app-region: drag;">

    <transition name="fade">
      <Preloader key="1" v-if="isLoading"></Preloader>

      <div key="2" v-else style="display: flex; width: 100%; height: 100%;">

        <div style="flex: 0 0 300px; margin: 10px;">
          <Menu @changeComponent="changeComponent" :componentsAssoc="componentsAssoc"></Menu>
        </div>

        <div id="main" class="mainComponent" tabindex="-1" style="flex: 1 1 1px; margin: 10px; ">
          <div style="display: flex; flex-direction: column; width: 100%;">
            <MainWindow style=" flex: 1 1 1px; " :bus="bus" :busVue="busVue" :settings="settings"
                        :currentComponent="currentComponent" :componentsAssoc="componentsAssoc"/>
          </div>
        </div>

      </div>
    </transition>

    <!--        <component style=" flex: 1 1 1px; " :bus="bus" :busVue="busVue" :settings="settings"
                               v-bind:is="currentComponent"></component> -->

    <notifications group="main"/>
  </div>
</template>

<script>

import Vue from 'vue';
import {openDB} from 'idb';

import MainWindow from "@/components/MainWindow";

import Menu from "@/components/Menu";
import Preloader from "@/components/Preloader";
import $ from "jquery";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

export default {
  name: 'App',
  components: {
    Menu,
    MainWindow,
    Preloader
  },
  data() {
    return {
      currentComponent: 'Settings',
      bus: {},
      busVue: new Vue({}),
      isLoading: true,
      settings: null,
      componentsAssoc: {
        'testComp': 'Плановые цифры нагрузки учебного года',
        'Doljnosti': 'Должности',
        'Settings': 'Настройки',
        'WorkTypes': 'Виды учебной работы',
        'StudyStream': 'Учебные потоки'
      }
    }
  },
  methods: {
    // Смена компонента (окна)
    changeComponent(componentName) {
      if (!this.windowsSettings) {
        this.bus.notify('Не выбрана база данных', 'w');
      } else {
        // Убираем прослушиватель сохранения
        if (!(this.currentComponent === componentName)) {
          this.busVue.$off('saveSettings');
        }

        this.currentComponent = componentName;
        this.settings = this.windowsSettings[this.currentComponent]
      }
    },

    // Создание дефолтных параметров
    createDefaultParams() {
      return [
        {
          windowName: 'Settings', settings: {
            labels: {
              nameOfInstitut: '',
              directorOfInstitut: '',
              nameOfKafedra: '',
              shortNameOfKafedra: '',
              zavedKafedroy: '',
              stavka: ''
            }
          },
        },
        {
          windowName: 'Doljnosti', settings: {
            labels: {
              nameOfInstitut: '1',
              directorOfInstitut: '2',
              nameOfKafedra: '3',
              shortNameOfKafedra: '4',
              zavedKafedroy: '5',
              stavka: '6'
            }
          },
        }
      ]
    },

    // Обновить шину параметров
    async updateBusSettings(dbname) {
      if (dbname) {
        this.bus.dbname = dbname;
      }

      try {
        this.windowsSettings = await this._readDB('all');
        this.settings = this.windowsSettings[this.currentComponent];
        return true
      } catch (e) {
        this.bus.notify("Ошибка обновления шины параметров", 'w');
        return false
      }
    },

    // Создание бд
    async _OpenDB() {
      // Инициализация базы данных
      let db = await openDB('base', 1, {
        blocked() {
          console.info('blocked');
        },
        blocking() {
          console.info('blocking');
        },
        terminated() {
          console.info('terminated');
        },
      })

      return db
    },

    // Запись в бд
    // формат [{windowName: 'name', settings: {some info}}, ...]
    async _writeDB(array) {
      // windowName, settingsName, data
      if (!this.bus.db) {
        this.bus.notify("База данных не инициализирована", 'e');
        return false
      } else {
        let db = this.bus.db,
            storeName = this.bus.dbname;

        try {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);

          for (const item of array) {
            try {
              await store.put({
                windowName: item.windowName,
                settings: item.settings
              });

            } catch (e) {
              this.bus.notify("Ошибка записи в бд", 'w');
            }

          }
          await tx.done;
          return true
        } catch (e) {
          this.bus.notify("Ошибка транзакции бд при записи", 'w');
          return false
        }
      }
    },

    // Чтение из бд
    async _readDB(findingElem) {
      // windowName, settingsName, data
      if (!this.bus.db) {
        this.bus.notify("База данных не инициализирована", 'e');
        return false
      } else {
        let db = this.bus.db,
            storeName = this.bus.dbname,
            data;

        try {
          const tx = db.transaction(storeName, 'readwrite');
          const store = tx.objectStore(storeName);

          if (findingElem && findingElem === 'all') {
            data = await store.getAll();
          } else if (findingElem) {
            data = await store.get(findingElem);
          }

          await tx.done;

          return this.formatDataFromDB(data);
        } catch (e) {
          console.log(e);
          this.bus.notify("Ошибка транзакции бд при чтении", 'w');
          return false
        }
      }
    },

    // Получить параметры конкретного окна из дб
    async getParamsFromDB(windowName) {
      return await this._readDB(windowName);
    },

    // Обновить параметры конкретного окна в дб
    async updateParamsToDB(windowName, settingName, data) {
      let settings = (await this.getParamsFromDB(windowName))[windowName] || {};

      if (data) {
        settings[settingName] = data;
      } else {
        this.bus.notify('Не указаны данные для сохранения', 'e');
        return
      }

      if (await this._writeDB([{windowName: windowName, settings: settings}]) && await this.updateBusSettings()) {
        this.bus.notify('Данные успешно сохранены', 's');
      } else {
        this.bus.notify('Ошибка сохранения данных', 'e');
      }
    },

    // Ассоциативный массив из обычного
    formatDataFromDB(array) {
      let out = {};

      if (!array) return {}
      if (!Array.isArray(array)) array = [array];

      array.forEach((item) => {
        out[item.windowName] = item.settings;
      })

      return out
    }



    // Скачать настройки окна из дб
    // downloadSettings(windowName) {
    //   let db = this.bus.db;
    //
    //   const tx = db.transaction('save1test', 'readwrite');
    //   const store = tx.objectStore('save1test');
    // }
  },


  async mounted() {
    // Функции в bus
    // если будут нужны
////////////////////////////////////////////////////////////////////////////
    // Нотификация
    // this.bus.notify('text', 'type', 'label');
    this.bus.notify = (text, type, title) => {
      switch (type) {
        case 's':
          type = 'success';
          break;
        case 'w':
          type = 'warn';
          console.warn((title || 'default') + ':' + text);
          break;
        case 'e':
          type = 'error';
          console.error((title || 'default') + ':' + text);
          break;
        default:
          console.log((title || 'default') + ':' + text);
          type = 'blueNotif';
      }

      this.$notify({
        group: 'main',
        title: title,
        text: text,
        // ignoreDuplicates: true,
        type: type
      });
    }
////////////////////////////////////////////////////////////////////////////


    // todo берем имя бд из локал сторедж
    this.bus.dbname = 'save1test';

    let db = await this._OpenDB()

    // Проверка ошибки открытия database
    if (!db) {
      this.bus.notify('Ошибка открытия базы данных,\n перезапустите программу', 'e');
      return
    } else {
      // Указание перечня функций работы с дб
      this.bus.db = db;
      this.bus.dbFunc = {
        updateParamsToDB: this.updateParamsToDB,
        getParamsFromDB: this.getParamsFromDB,
      }

      // Проверка, указан ли store
      if (this.bus.dbname) {
        await this.updateBusSettings();
      }
    }

    // // Заполнение дб стандартными параметрами
    // if (!allWindowSettings || (Object.keys(allWindowSettings).length === 0)) {
    //   let params = this.createDefaultParams();
    //   await this._writeDB(params)
    //   this.windowsSettings = this.formatDataFromDB(params);
    // } else {
    //   this.windowsSettings = allWindowSettings;
    // }


    // Сохранить параметры окна при запросе
    this.busVue.$on('updateParamsToDB', this.updateParamsToDB);


    setTimeout(() => {
      this.isLoading = false;
      // Рамки при фокусе
      setTimeout(() => {
        let main = $(".mainComponent");

        main.focusin(() => {
              main.addClass('mainBorder')
            }
        );

        main.focusout(() => {
          main.removeClass('mainBorder')
        });
      }, 0);
    }, 1000);


  }

}
</script>

<style>

@import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

/*@import "~ag-grid-community/src/styles/ag-grid.scss";*/
/*@import "~ag-grid-community/src/styles/ag-theme-alpine/sass/_ag-theme-alpine-mixin.scss";*/

.menuItem {
  margin-bottom: 10px;
  flex: 0 0 30px;
  display: flex;
  justify-content: left;
  /*align-items: center;*/
  width: 100%;
  text-align: end;
}

.borderWhite {
  border: solid 1px #e0e0e0;
  border-radius: 4px;
  margin: 5px;
  padding: 5px;
}

.mainComponent {
  display: flex;
  border: solid 1px #e0e0e0;
  border-radius: 4px;
  outline: none;
}

.mainBorder {
  border: solid 1px #b2b2b2;
}

/* Анимация смены прелоадера */
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */
{
  opacity: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 13px;
}

</style>
