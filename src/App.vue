<template>
  <div id="app" style="margin-top: 0; width: 100%; height: 100%; -webkit-app-region: drag;">

    <transition name="fade">
      <Preloader v-show="isLoading"></Preloader>
    </transition>

    <transition name="fade">
      <div v-show="!isLoading" style="display: flex; width: 100%; height: 100%;">

        <div style="flex: 0 0 300px; margin: 10px;">
          <Menu @changeComponent="changeComponent"></Menu>
        </div>

        <div id="main" class="mainComponent" tabindex="-1" style="flex: 1 1 1px; margin: 10px;">
          <transition name="component-fade" mode="out-in">
            <component :bus="bus" v-bind:is="currentComponent"></component>
          </transition>
        </div>

      </div>
    </transition>

  </div>
</template>

<script>
import {openDB} from 'idb';

import Menu from "@/components/Menu";
import Doljnosti from "@/components/Doljnosti";
import Settings from "@/components/Settings";
import Preloader from "@/components/Preloader";
import $ from "jquery";


export default {
  name: 'App',
  components: {
    Menu,
    Doljnosti,
    Settings,
    Preloader
  },
  data() {
    return {
      currentComponent: 'Settings',
      bus: {},
      isLoading: true,
    }
  },
  methods: {
    changeComponent(componentName) {
      this.currentComponent = componentName;
    },
    async init() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 10)
      })
    }
  },

  async mounted() {
    // Инициализация базы данных
    let db = await openDB('base', 1, {
      async upgrade(db, oldVersion) {
        if (oldVersion == 0) {
          // выполняем инициализацию
          db.createObjectStore('settings', {keyPath: 'settingName'});

        }
      },
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

    // Настройки названий
    const tx = db.transaction('settings', 'readwrite');
    const store = tx.objectStore('settings');
    let labels = await store.get('labels');

    if (!labels) {
      this.bus.labels = {
        settingName: 'labels', setting: {
          nameOfInstitut: '',
          directorOfInstitut: '',
          nameOfKafedra: '',
          shortNameOfKafedra: '',
          zavedKafedroy: '',
          stavka: ''
        }
      };
      store.put(this.bus.labels);
      this.bus.labels = this.bus.labels.setting;
    } else {
      this.bus.labels = labels.setting;
    }
    await tx.done;

    this.bus.db = db;

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);


    // Рамки при фокусе
    let main = $('.mainComponent');
    // console.info(main);
    main.focus(() => {
          main.addClass('mainBorder')
        }
    );
    main.blur(() => {
      main.removeClass('mainBorder')
    });
  }

}
</script>

<style>

@import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

/*@import "~ag-grid-community/src/styles/ag-grid.scss";*/
/*@import "~ag-grid-community/src/styles/ag-theme-alpine/sass/_ag-theme-alpine-mixin.scss";*/



.mainComponent {
  display: flex;
  border: solid 1px #e0e0e0;
  border-radius: 4px;
  outline: none;
}

.mainBorder {
  border: solid 1px #b2b2b2;
}

/* Анимация смены правого окна */
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .1s ease;
}

.component-fade-enter, .component-fade-leave-to
  /* .component-fade-leave-active до версии 2.1.8 */
{
  opacity: 0;
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
}

</style>
