<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column">

    <!--     Label menu item-->
    <div class="borderWhite" style="flex: 0 0 20px;">
      {{ (componentsAssoc[currentComponent] === 'I семестр') ? 'Распределение нагрузки за I семестр' : (componentsAssoc[currentComponent] === 'II семестр') ? 'Распределение нагрузки за II семестр' : componentsAssoc[currentComponent]}}
    </div>

    <!--     Основной компонент-->
    <div style="flex: 1 1 1px;">
      <transition name="component-fade" mode="out-in">
        <component style="height: 100%; margin: 0 5px 0" :bus="bus" :busVue="busVue"
                   :settings="settings"
                   v-bind:is="currentComponent" :componentsAssoc="componentsAssoc"/>
      </transition>
    </div>

    <!--     Нижнее меню-->
    <div class="borderWhite" style="flex: 0 0 1px; display: flex; margin-top: 10px">
      <div v-show="currentComponent === 'Settings'" style="flex: 1 1 1px">
        <b-button @click="saveSettings" variant="outline-primary" tabindex="3">Сохранить</b-button>
      </div>

      <div style="flex: 1 1 1px">
        <b-button disabled @click="exportExcel" variant="outline-primary" tabindex="4">Экспорт в excel</b-button>
      </div>
    </div>
  </div>
</template>

<script>

import Raspred1 from "@/components/Raspred1";
import NagrPochas from "@/components/NagrPochas";
import NagrShtat from "@/components/NagrShtat";
import Shtat from "@/components/Shtat";
import Plan from "@/components/Plan";
import IndividualPlanShtat from "@/components/IndividualPlanShtat";
import IndividualPlanHours from "@/components/IndividualPlanHours";
import IndividualPlan from "@/components/IndividualPlan";
import Teachers from "@/components/Teachers";
import Disciplines from "@/components/Disciplines";
import Doljnosti from "@/components/Doljnosti";
import Settings from "@/components/Settings";
import WorkTypes from "@/components/WorkTypes";
import StudyStream from "@/components/StudyStream";

import $ from "jquery";

export default {
  name: "MainWindow",
  components: {
    Raspred1,
    NagrPochas,
    NagrShtat,
    Shtat,
    Plan,
    IndividualPlanShtat,
    IndividualPlanHours,
    IndividualPlan,
    Teachers,
    Disciplines,
    Settings,
    Doljnosti,
    WorkTypes,
    StudyStream
  },
  data() {
    return {
      blurConfig: {
        isBlurred: false,
        opacity: 0.3,
        filter: 'blur(6px)',
        transition: 'all .9s linear'
      }
    }
  },
  props: {
    bus: Object,
    busVue: Object,
    settings: Object,
    currentComponent: String,
    componentsAssoc: Object
  },
  methods: {
    saveSettings() {
      this.busVue.$emit('saveSettings');
    },
    exportExcel() {

    },
    blur(state) {
      this.blurConfig.isBlurred = state;
    }
  },
  mounted() {
    let ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 91,
        sKey = 83,
        delKey = 46;

    // Слушатель ctrl
    $(window).keydown((e) => {
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function (e) {
      if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });

    // Слушатель del и ctrl+s
    $(window).keydown((e) => {
      // console.info(e.keyCode);
      if (ctrlDown && (e.keyCode == sKey)) {
        this.saveSettings();
      }
      if (e.keyCode == delKey) {
        this.busVue.$emit('delRow');
      }
    });
  }
}
</script>

<style scoped>
/* Анимация смены правого окна */
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity 0.02s ease;
}

.component-fade-enter, .component-fade-leave-to
  /* .component-fade-leave-active до версии 2.1.8 */
{
  opacity: 0;
}
</style>
