<template>
  <div class="main" style="width: 100%; height: 100%; display: flex; flex-direction: column">


<!--    ag-theme-alpine-dark-->
    <div style="flex: 10 1 1px;">
      <Grid
          ref="grid"
          :winName="'Doljnosti'"
          :settings="gridSettings"
      ></Grid>
    </div>

    <div class="borderWhite"  style="flex: 3 1 1px; margin: 5px 5px 5px; display: flex; flex-direction: column">

      <div class="menuItem marginInput">
        <b-input-group prepend="Название">
          <b-form-input v-model="name"></b-form-input>
        </b-input-group>
        <div style="width: 10px"></div>
        <b-input-group prepend="Сокращение">
          <b-form-input v-model="shortName"></b-form-input>
        </b-input-group>
      </div>

      <div style="display: flex">
        <div style="flex: 1 1 1px">
          <b-button @click="save" variant="outline-primary">Сохранить</b-button>
        </div>

        <div style="flex: 1 1 1px">
          <b-button @click="addRow" variant="outline-primary">Добавить</b-button>
          <b-button @click="removeRow" variant="outline-primary">Удалить</b-button>
        </div>
      </div>

    </div>




  </div>
</template>

<script>




import Grid from "@/components/Grid";


import "smart-webcomponents/source/modules/smart.window.js";
import "smart-webcomponents/source/styles/smart.default.css";
import "smart-webcomponents/source/modules/smart.grid.js";



export default {
  components: {
    Grid
  },
  name: "Doljnosti",
  data() {
    return {
      windowName: this.$options._componentTag,

      gridSettings: {
        columnDefs: [
          { field: 'fullName', headerName: 'Название', minWidth: 10},
          { field: 'name', headerName: 'Сокращение', minWidth: 10}
        ],
        rowData: [
          {
            fullName: 'ассистент', name: 'асс'
          }
        ],
      },

      name: null,
      shortName: null,


    }
  },
  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  beforeMount() {

  },

  mounted() {
   this.updateSettings();
  },

  methods: {
    // Сохранить данные
    save() {
      this.busVue.$emit('updateParamsToDB', this.windowName, 'grid', this.$refs.grid.getAll());
    },

    // Добавить строку
    addRow(row, index) {
      this.$refs.grid.addRow([this.name, this.shortName], index);
    },

    // Удалить строку
    removeRow() {
      this.$refs.grid.removeRow();
    },

    // Обновить параметры
    updateSettings() {
      if (this.settings.grid) {
        this.$refs.grid.setAll(this.settings.grid);
      }
    }
  }
}
</script>



<style scoped>

.marginInput {
  margin: 5px;
  width: calc(100% - 10px);
  height: calc(100% - 10px);
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
