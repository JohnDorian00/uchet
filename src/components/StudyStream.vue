<template>
  <div class="borderWhite" style="display: flex; flex-direction: column">
    <!--    ag-theme-alpine-dark-->

    <!--    Грид -->
    <div style="flex: 1 1 1px;">
      <Grid
          ref="grid"
          :winName="'StudyStream'"
          :settings="gridSettings"
      ></Grid>
    </div>

    <!--    Пробел с рамкой -->
    <div class="borderWhite" style="flex: 0 0 10px; margin: 0 0 -3px;  border-radius: 0;
                                        border-top: none; border-bottom: none"/>

    <!--    Кнопки и инпуты -->
    <div class="borderWhite" style=" display: flex; margin: 0; flex-direction: column; border-top: none">
      <div class="menuItem marginInput" style="display: flex; flex-direction: column; margin: 0">
        <div style="display: flex; flex-direction: row">
          <div style="flex: 0 0 auto; margin-right: 5px">
            <b-button style="width: 85px" @click="addRow" variant="outline-primary">Добавить</b-button>
          </div>
          <div style="flex: 1 1 1px">
            <b-input-group prepend="Название">
              <b-form-input v-model="name"></b-form-input>
            </b-input-group>
          </div>
          <div style="flex: 0 0 350px; display: flex;">
            <div style="flex: 11 1 1px; margin-left: 5px">
              <b-input-group prepend="Бюджетные">
                <b-form-input v-model="budget"></b-form-input>
              </b-input-group>
            </div>
            <div style="flex: 12 1 1px; margin-left: 5px">
              <b-input-group prepend="Внебюджетные">
                <b-form-input v-model="unbudget"></b-form-input>
              </b-input-group>
            </div>
          </div>
        </div>

        <div style="height: 10px"></div>

        <div style="display: flex; flex-direction: row">
          <div style="flex: 0 0 auto; margin-right: 5px">
            <b-button style="width: 85px" @click="removeRow" variant="outline-primary">Удалить</b-button>
          </div>
          <div style="flex: 1 1 1px">
            <b-input-group prepend="Институт">
              <b-form-input v-model="university"></b-form-input>
            </b-input-group>
          </div>

          <div style="flex: 0 0 345px; margin-left: 5px">
            <b-input-group prepend="Кол-во студентов">
              <b-form-input v-model="studentAmount"></b-form-input>
            </b-input-group>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import Grid from "@/components/Grid";

export default {
  components: {
    Grid
  },

  name: "StudyStream",

  data() {
    return {
      windowName: this.$options._componentTag,

      gridSettings: {
        columnDefs: [
          {field: 'name', headerName: 'Название', minWidth: 10, width: 150},
          {field: 'university', headerName: 'Институт', minWidth: 10, width: 150},
          {field: 'studentAmount', headerName: 'Кол-во студентов', minWidth: 10},
          {field: 'budget', headerName: 'Бюджетные', minWidth: 10},
          {field: 'unbudget', headerName: 'Внебюджетные', minWidth: 10}
        ],
        rowData: [],
      },

      // Инпуты
      name: null,
      university: null,
      studentAmount: null,
      budget: null,
      unbudget: null
    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  mounted() {
    // Обновление данных
    this.updateSettings();
    this.busVue.$on('saveSettings', this.save);
    this.busVue.$on('delRow', this.removeRow);
  },

  beforeDestroy() {
    this.busVue.$off('saveSettings');
    this.busVue.$off('delRow');
  },

  methods: {
    // Сохранить данные
    async save() {
      let gridRows = this.$refs.grid.getAll();
      await this.bus.dbFunc.setSave({[this.windowName]: {grid: gridRows}});
    },

    // Добавить строку
    addRow(index) {
      this.$refs.grid.addRow([this.name, this.university, this.studentAmount, this.budget, this.unbudget], index);
    },

    // Удалить строку
    removeRow() {
      this.$refs.grid.removeRow();
    },

    // Обновить параметры грида
    updateSettings() {
      if (this.settings && this.settings[this.windowName] && this.settings[this.windowName].grid) {
        this.$refs.grid.setAll(this.settings[this.windowName].grid);
      }
    }
  }
}
</script>


<style scoped>

.marginInput {
  /*margin: 5px;*/
  /*width: calc(100% - 10px);*/
  /*height: calc(100% - 10px);*/
  width: 100%;
  height: 100%;
}


.main {
  width: 100%;
  height: 100%;
}


.labels {
  flex: 0 0 160px;
  margin-right: 20px;
  margin-top: 5px;
}

</style>
