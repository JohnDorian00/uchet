<template>
  <div class="borderWhite" style="display: flex; flex-direction: column">
    <!--    ag-theme-alpine-dark-->

    <!--    Грид -->
    <div style="flex: 1 1 1px;">
      <Grid
          ref="grid"
          :winName="'StudyStream'"
          :columnsGrid="columns"
          :datafieldsGrid="datafields"
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
          <div style="flex: 1 1 1px; margin-right: 5px">
            <b-input-group prepend="ФИО">
              <b-form-input v-model="FIO"></b-form-input>
            </b-input-group>
          </div>

          <div style="flex: 0 0 375px; display: flex;">
            <div style="flex: 0 0 250px;">
              <b-input-group prepend="Должность">
                <b-form-select v-model="selected" :options="options"></b-form-select>
              </b-input-group>
            </div>
            <div style="flex: 0 0 120px; margin-left: 5px">
              <b-input-group prepend="Ставка">
                <b-form-input v-model="Rate"></b-form-input>
              </b-input-group>
            </div>
          </div>

          <!--          <div style="flex: 0 0 250px; display: flex;">-->
          <!--            <b-input-group prepend="Должность">-->
          <!--              <b-form-select v-model="selected" :options="options"></b-form-select>-->
          <!--            </b-input-group>-->
          <!--          </div>-->
        </div>

        <div style="height: 10px"></div>

        <div style="display: flex; flex-direction: row">
          <div style="flex: 0 0 auto; margin-right: 5px">
            <b-button style="width: 85px" @click="removeRow" variant="outline-primary">Удалить</b-button>
          </div>
          <div style="flex: 0 0 180px">
            <b-input-group prepend="Учёная степень">
              <b-form-input v-model="Degree"></b-form-input>
            </b-input-group>
          </div>

          <div style="flex: 0 0 150px; margin-left: 5px">
            <b-input-group prepend="Статус">
              <b-form-input v-model="Status"></b-form-input>
            </b-input-group>
          </div>


          <div style="flex: 1 1 1px; margin-left: 5px">
            <b-input-group prepend="Примечание">
              <b-form-input v-model="Note"></b-form-input>
            </b-input-group>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import Grid from "@/components/Grid";
import * as db from "./db.js";

const tableName = "Teachers";

export default {
  components: {
    Grid
  },

  name: "Teachers",

  data() {
    return {
      windowName: this.$options._componentTag,

      columns: [
        {datafield: 'ID', hidden: true},
        {text: 'ФИО', datafield: 'FIO', width: '25%'},
        {text: 'Должность', datafield: 'Job_Name'},
        {text: 'Учёная степень', datafield: 'Degree'},
        {text: 'Статус', datafield: 'Status'},
        {text: 'Ставка', datafield: 'Rate'},
        {text: 'Примечания', datafield: 'Note'},
        {datafield: 'Job_ID', hidden: true}
      ],

      datafields: [
        {name: 'ID', type: 'int'},
        {name: 'FIO', type: 'string'},
        {name: 'Job_Name', type: 'int'},
        {name: 'Degree', type: 'string'},
        {name: 'Status', type: 'string'},
        {name: 'Rate', type: 'int'},
        {name: 'Note', type: 'string'},
        {name: 'Job_ID', type: 'int'}
      ],


      // Инпуты
      FIO: "",
      TeachersJob: "",
      Degree: "",
      Status: "",
      Rate: "",
      Note: "",

      selected: 0,
      options: []
    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  async mounted() {
    let data = await db.getTable('TeachersJobs');
    if (data && data.data) {
      this.doljnosti = data.data;

      if (this.doljnosti && Array.isArray(this.doljnosti) && this.doljnosti.length > 0) {
        this.doljnosti.forEach((item) => {
          this.options.push({text: item.Name, value: item.ID})
        })
      } else {
        this.options = []
      }

      this.updateGrid();
      this.busVue.$on('delRow', this.removeRow);
    } else {
      console.error(data)
      this.bus.notify('Ошибка обновления данных', 'e');
    }
  },

  beforeDestroy() {
    this.busVue.$off('delRow');
  },

  methods: {
    resetAllInputs() {
      this.FIO = "";
      this.TeachersJob = "";
      this.Degree = "";
      this.Status = "";
      this.Rate = "";
      this.Note = "";
      this.selected = 0;
    },

    // Добавить строку
    // async addRow() {
    //   let fields = this.gridSettings.columnDefs,
    //       fieldsStr = "";
    //
    //   fields.forEach((item) => {
    //     let field = item.field;
    //     if (field && field.toLowerCase().indexOf('id') === -1 && !item.hide && field !== "TeachersJob") {
    //       fieldsStr += field + ', ';
    //     }
    //   })
    //   fieldsStr += 'TeachersJobsID' + ', ';
    //   fieldsStr = fieldsStr.slice(0, -2);
    //
    //   let err = await db.run("INSERT INTO " + tableName + "(" + fieldsStr + ") VALUES(" + "'" + this.FIO + "','" + this.Degree + "','" + this.Status + "','" + this.Rate + "','" + this.Note + "','" + this.selected + "');")
    //   if (err) {
    //     console.error(err)
    //     this.bus.notify('Ошибка добавления записи', 'e');
    //   } else {
    //     await this.updateGrid();
    //     this.resetAllInputs();
    //     this.bus.notify('Данные добавлены', 's');
    //   }
    // },

    // Добавить строку
    async addRow() {
      let columns = this.columns,
          fieldsStr = "";

      columns.forEach((item) => {
        let column = item.datafield;
        if (column && !item.hidden && column !== "Job_Name") {
          fieldsStr += column + ', ';
        }
      })
      fieldsStr += 'Job_ID' + ', ';
      fieldsStr = fieldsStr.slice(0, -2);

      console.info(this.selected);

      let err = await db.run("INSERT INTO " + tableName + "(" + fieldsStr + ") VALUES(" + "'" + this.FIO + "','" + this.Degree + "','" + this.Status + "','" + this.Rate + "','" + this.Note + "','" + this.selected + "');")
      if (err) {
        console.error(err)
        this.bus.notify('Ошибка добавления записи', 'e');
      } else {
        await this.updateGrid();
        this.resetAllInputs();
        // this.bus.notify('Данные добавлены', 's');
      }
    },

    // Удалить строку
    async removeRow() {
      let row = this.$refs.grid.getSelected();

      if (!row) return

      let err = await db.run("DELETE FROM " + tableName + " WHERE ID = ( " + row.ID + " )")

      if (err) {
        console.error(err)
        this.bus.notify('Ошибка удаления записи', 'e');
      } else {
        await this.updateGrid();
        // this.bus.notify('Данные удалены', 's');
      }
    },

    // Обновить параметры грида
    async updateGrid() {
      let err = await db.all("SELECT Teachers.*, TeachersJobs.Name as Job_Name FROM Teachers LEFT JOIN TeachersJobs ON TeachersJobs.ID = Teachers.Job_ID;")

      if (err && !Array.isArray(err)) {
        console.error(err)
        // this.bus.notify('Ошибка обновления', 'e');
      } else {
        // this.resetAllInputs();
        console.info(err);
        this.$refs.grid.setAll(err);
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
