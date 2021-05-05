<template>
  <div id="app" style="margin-top: 0; width: 100%; height: 100%; -webkit-app-region: drag;">

    <transition name="fade" mode="out-in">
      <Preloader key="1" v-if="isLoading"></Preloader>

      <div key="2" v-else style="display: flex; width: 100%; height: 100%;">

        <div style="flex: 0 0 350px; margin: 10px;">
          <Menu ref="menu" @changeComponent="changeComponent" :componentsAssoc="componentsAssoc"></Menu>
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
// import {openDB} from 'idb';

import MainWindow from "@/components/MainWindow";

import Menu from "@/components/Menu";
import Preloader from "@/components/Preloader";
import $ from "jquery";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// import * as db from "../src/components/db.js";

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
        'IndividualPlan': 'Индивидуальный учебный план',
        'Teachers': 'Преподаватели',
        'Disciplines': 'Дисциплины',
        'StudyStream': 'Учебные потоки',
        'WorkTypes': 'Виды учебной работы',
        'Doljnosti': 'Должности',
        'Settings': 'Настройки'
      }
    }
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
    // путь к сохоанению
    // let dbPath = path.resolve(__dirname, 'data.db')
    // let saveId = localStorage.getItem('save');


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

    // старая бд
    // let db = await this._OpenDB();
    // // Проверка ошибки открытия database
    // if (!db) {
    //   this.bus.notify('Ошибка открытия базы данных,\n перезапустите программу', 'e');
    //   return
    // } else {
    //   // Указание перечня функций работы с дб
    //   this.bus.db = db;
    //   this.bus.dbFunc = {
    //     getSave: this._getSave,
    //     setSave: this._setSave,
    //     addSave: this._addSave,
    //     updateBusSettings: this.updateBusSettings
    //   }
    // }
    // if (saveId) {
    //   if (await this.updateBusSettings(saveId)) {
    //     this.bus.notify("Активировано сохранение " + this.bus.save.name, 's');
    //   }
    // } else {
    //   this.bus.notify("Не выбрано сохранение", 'w');
    // }

    // err = await db.get('lorem');
    // console.info(err);
    // err = await db.initDefaultDateBase();
    // if (err) console.info(err);
    // err = await db.addRows('Jobs', [
    //   {Name: 'job1', Note: 'note'},
    //   {Name: 'job2', Note: 'note2'}
    // ]);
    // if (err) console.info(err);
    // err = await db.addRows('Jobs', {id: 2, Name: '12321312321', Note: 'no12312312321te'});
    // if (err) console.info(err);
  },

  methods: {


    // Смена компонента (окна)
    changeComponent(componentName) {
      if (!localStorage.getItem('path')) {
        this.$refs.menu.select(8);
        this.bus.notify('Не выбрано сохранение', 'w');
      } else {
        // Убираем прослушиватель сохранения
        if (!(this.currentComponent === componentName)) {
          this.busVue.$off('saveSettings');
        }

        this.currentComponent = componentName;
      }
    },

    // Обновить шину параметров
    async updateBusSettings(id) {
      if (!id) {
        id = localStorage.getItem('save');
      }

      if (!id) {
        this.bus.save = null;
        this.settings = null;
        return false
      }

      try {
        this.bus.save = await this._getSave(id);
        if (this.bus.save) {
          this.settings = this.bus.save.settings;
          return true
        } else {
          return false
        }
      } catch (e) {
        console.log(e);
        this.bus.notify("Ошибка обновления шины параметров", 'w');
        return false
      }
    },


    // // Создание бд
    // async _OpenDB() {
    //   let t = this;
    //   // Инициализация базы данных
    //   let db = await openDB('base', 1, {
    //     blocked() {
    //       console.info('blocked');
    //     },
    //     upgrade(db) {
    //       // Проверка создания дб
    //       if (!db.objectStoreNames.contains('uchet')) {
    //         t.bus.notify('Создана новая база данных');
    //         db.createObjectStore('uchet', {keyPath: 'id', autoIncrement: true});
    //       }
    //     },
    //     blocking() {
    //       console.info('blocking');
    //     },
    //     terminated() {
    //       console.info('terminated');
    //     },
    //   })
    //
    //
    //   return db
    // },
    // // Запись/изменение в бд (по окнам)
    // async _setSave(windows, id) {
    //   // windowName, settingsName, data
    //   if (!this.bus.db) {
    //     this.bus.notify("База данных не инициализирована", 'e');
    //     return false
    //   } else {
    //     let db = this.bus.db;
    //
    //     try {
    //       if (!id) id = localStorage.getItem('save');
    //
    //       let save = await this._getSave(id);
    //
    //
    //       if (save) {
    //         if (!windows) windows = {};
    //         for (let key in windows) {
    //           save.settings[key] = windows[key];
    //         }
    //
    //         const tx = db.transaction('uchet', 'readwrite');
    //         const store = tx.objectStore('uchet');
    //
    //         await store.put(save);
    //         await tx.done;
    //         await this.updateBusSettings();
    //
    //         this.bus.notify("Данные сохранены", 's');
    //
    //         return true
    //       } else {
    //         this.bus.notify("Ошибка записи в бд: не выбрано сохранение", 'w');
    //         return false
    //       }
    //     } catch (e) {
    //       console.log(e);
    //       this.bus.notify("Ошибка транзакции бд при записи", 'w');
    //       return false
    //     }
    //   }
    // },
    // // Чтение из бд по айди сохранения
    // async _getSave(id) {
    //   // windowName, settingsName, data
    //   if (!this.bus.db) {
    //     this.bus.notify("База данных не инициализирована", 'e');
    //     return false
    //   } else {
    //     let db = this.bus.db,
    //         data;
    //
    //     try {
    //       const tx = db.transaction('uchet', 'readonly');
    //       const store = tx.objectStore('uchet');
    //
    //       if (id && id === 'all') {
    //         data = await store.getAll();
    //       } else if (id) {
    //         id = parseInt(id);
    //         data = await store.get(id);
    //       }
    //       await tx.done;
    //
    //       if (!data) {
    //         this.bus.notify("Сохранение не найдено", 'w');
    //       }
    //
    //       return data;
    //     } catch (e) {
    //       console.log(e);
    //       this.bus.notify("Ошибка чтения из базы данных\n", 'w');
    //       return false
    //     }
    //   }
    // },
    // // Добавить сохранение
    // async _addSave(saveName, data) {
    //   if (!this.bus.db) {
    //     this.bus.notify("База данных не инициализирована", 'e');
    //     return false
    //   } else {
    //     let db = this.bus.db;
    //
    //     try {
    //       const tx = db.transaction('uchet', 'readwrite');
    //       const store = tx.objectStore('uchet');
    //       if (!data) data = {};
    //       const result = await store.put({name: saveName, date: new Date().toLocaleDateString(), settings: data})
    //       await tx.done;
    //
    //       return result
    //     } catch (e) {
    //       console.log(e);
    //       this.bus.notify("Ошибка записи в базу данных\n", 'w');
    //       return false
    //     }
    //   }
    // },
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

.ag-header-group-cell-label {
  justify-content: center;
}

.ag-header-cell-label {
  justify-content: center;
}
</style>
