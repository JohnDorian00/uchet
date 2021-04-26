<template>
  <div class="borderWhite" style="display: flex; flex-direction: column">
    <!--    ag-theme-alpine-dark-->

    <!--    Грид -->
    <div style="flex: 1 1 1px;">
      <Grid
          ref="grid"
          :winName="'WorkTypes'"
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
        </div>

        <div style="height: 10px"></div>

        <div style="display: flex; flex-direction: row">
          <div style="flex: 0 0 auto; margin-right: 5px">
            <b-button style="width: 85px" @click="removeRow" variant="outline-primary">Удалить</b-button>
          </div>
          <div style="flex: 1 1 1px">
            <b-input-group prepend="Сокращение">
              <b-form-input v-model="shortName"></b-form-input>
            </b-input-group>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import Grid from "@/components/Grid";
import * as db from "./db";

const tableName = "Disciplines",
    gridId = tableName + "ID";

export default {
  components: {
    Grid
  },

  name: "Disciplines",

  data() {
    return {
      windowName: this.$options._componentTag,

      gridSettings: {
        columnDefs: [
          {
            headerName: tableName + "ID",
            field: tableName + "ID",
            hide: true
          },
          {field: 'Name', headerName: 'Название', minWidth: 10},
          {field: 'Note', headerName: 'Сокращение', minWidth: 10}
        ],
        rowData: [],
      },

      name: "",
      shortName: "",
    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  mounted() {
    // Обновление данных
    this.updateGrid();
    this.busVue.$on('delRow', this.removeRow);
  },

  beforeDestroy() {
    this.busVue.$off('delRow');
  },

  methods: {
    // Добавить строку
    async addRow() {
      let fields = this.gridSettings.columnDefs,
          fieldsStr = "";

      fields.forEach((item) => {
        let field = item.field;
        if (field.toLowerCase().indexOf('id') === -1) {
          fieldsStr += field + ', ';
        }
      })
      fieldsStr = fieldsStr.slice(0, -2);

      let err = await db.run("INSERT INTO " + tableName + "(" + fieldsStr + ") VALUES(" + "'" + this.name + "','" + this.shortName + "');")
      if (err) {
        console.error(err)
        this.bus.notify('Ошибка добавления записи', 'e');
      } else {
        this.updateGrid();
        this.name = "";
        this.shortName = "";
        this.bus.notify('Данные добавлены', 's');
      }
    },

    // Удалить строку
    removeRow() {
      let rows = this.$refs.grid.getSelected(),
          stmt = db.getDB().prepare("DELETE FROM " + tableName + " WHERE " + gridId + " = (?)"),
          promises = [];

      rows.forEach((item) => {
        promises.push(new Promise((resolve) => {
          stmt.run(item[gridId], (err) => {
            console.warn(err);
            resolve(err);
          });
        }));
      })
      Promise.all(promises).then((err) => {
        if (err) console.warn(err)
        stmt.finalize();
        this.updateGrid();
      })
    },

    // Обновить параметры грида
    async updateGrid() {
      let data = await db.getTable(tableName);
      if (data && data.data) {
        data = data.data
      } else {
        console.error(data)
        this.bus.notify('Ошибка обновления данных', 'e');
        return
      }
      this.$refs.grid.setAll(data);
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
