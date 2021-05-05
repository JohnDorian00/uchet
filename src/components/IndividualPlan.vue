<template>
  <div style="display: flex; flex-direction: column">
    <!--    ag-theme-alpine-dark-->

    <div class="borderWhite" style="flex: 0 0 1px; margin: 0; display: flex; flex-direction: column">
      <div style="flex: 0 0 10px;">
        <b-input-group prepend="Преподаватель">
          <b-form-select v-model="selectedTeacher" :options="optionsTeachers"></b-form-select>
        </b-input-group>
      </div>
    </div>
    <!--    Грид -->
    <div class="borderWhite" style="flex: 1 1 1px; margin: 5px 0 0; display: flex; flex-direction: column">
      <div class="borderWhite" style="margin: 0 0 5px;">
        I семестр
      </div>
      <div style="flex: 1 1 1px;">
        <Grid
            ref="grid1"
            :winName="'IndividualPlan'"
            :settings="gridSettings"
        ></Grid>
      </div>
    </div>

    <div class="borderWhite" style="flex: 1 1 1px; margin: 5px 0 0; display: flex; flex-direction: column;">
      <div class="borderWhite" style="margin: 0 0 5px;">
        II семестр
      </div>
      <div style="flex: 1 1 1px;">
        <Grid
            ref="grid2"
            :winName="'IndividualPlan'"
            :settings="gridSettings"
        ></Grid>
      </div>
    </div>


    <!--    Пробел с рамкой -->
    <div style="flex: 0 0 10px;"/>

    <!--    Кнопки и инпуты -->
    <div class="borderWhite" style=" display: flex; margin: 0; flex-direction: column;">
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
                <b-form-select></b-form-select>
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

const tableName = "Teachers",
    gridId = tableName + "ID";

export default {
  components: {
    Grid
  },

  name: "IndividualPlan",

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


          {field: 'FIO', headerName: 'Дисциплина', minWidth: 10, width: 150},
          {field: 'TeachersJob', headerName: 'Поток', minWidth: 10, width: 150},
          {field: 'Degree', headerName: 'Вид занятия', minWidth: 10},
          {
            field: 'Status', headerName: 'Нагрузка УУ', minWidth: 10,
            children: [
              {field: 'shtat', headerName: 'штатн'},
              {field: 'hours', headerName: 'почас'},
            ]
          },
          {field: 'Rate', headerName: 'Почас в семестр', minWidth: 10},


          {
            headerName: "TeachersJobsID",
            field: "TeachersJobsID",
            hide: true
          }
        ],
        rowData: [],
      },

      // Инпуты
      FIO: "",
      TeachersJob: "",
      Degree: "",
      Status: "",
      Rate: "",
      Note: "",

      selectedTeacher: null,
      optionsTeachers: [
        {text: '-', value: null}
      ]
    }
  },

  props: {
    bus: Object,
    busVue: Object,
    settings: Object
  },

  async mounted() {
    // Список преподавателей
    let data = await db.getTable('Teachers');
    if (data && data.data) {
      this.teachers = data.data;

      if (this.teachers && Array.isArray(this.teachers) && this.teachers.length > 0) {
        console.info(this.teachers);
        this.optionsTeachers = [];
        this.teachers.forEach((item) => {
          this.optionsTeachers.push({text: item.FIO, value: item.TeachersID})
        })
        this.selectedTeacher = this.teachers[0].TeachersID;
      } else {
        this.optionsTeachers = [
          {text: '-', value: null}
        ]
      }
    } else {
      console.error(data)
      this.bus.notify('Ошибка обновления данных', 'e');
    }


    // data = await db.getTable('TeachersJobs');
    // if (data && data.data) {
    //   this.doljnosti = data.data;
    //
    //   if (this.doljnosti && Array.isArray(this.doljnosti) && this.doljnosti.length > 0) {
    //     this.doljnosti.forEach((item) => {
    //       this.options.push({text: item.Name, value: item.TeachersJobsID})
    //     })
    //   } else {
    //     this.options = [
    //       {text: '-', value: null}
    //     ]
    //   }
    //
    //   // this.updateGrid();
    //   this.busVue.$on('delRow', this.removeRow);
    // } else {
    //   console.error(data)
    //   this.bus.notify('Ошибка обновления данных', 'e');
    // }
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
      this.selected = null;
    },

    // Сохранить данные
    async save() {
      let gridRows = this.$refs.grid.getAll();
      await this.bus.dbFunc.setSave({[this.windowName]: {grid: gridRows}});
    },

    // Добавить строку
    async addRow() {
      let fields = this.gridSettings.columnDefs,
          fieldsStr = "";

      fields.forEach((item) => {
        let field = item.field;
        if (field.toLowerCase().indexOf('id') === -1 && !item.hide && field !== "TeachersJob") {
          fieldsStr += field + ', ';
        }
      })
      fieldsStr += 'TeachersJobsID' + ', ';
      fieldsStr = fieldsStr.slice(0, -2);

      let err = await db.run("INSERT INTO " + tableName + "(" + fieldsStr + ") VALUES(" + "'" + this.FIO + "','" + this.Degree + "','" + this.Status + "','" + this.Rate + "','" + this.Note + "','" + this.selected + "');")
      if (err) {
        console.error(err)
        this.bus.notify('Ошибка добавления записи', 'e');
      } else {
        await this.updateGrid();
        this.resetAllInputs();
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
            if (err) console.warn(err)
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
    async updateGrid(gridNum) {
      let data = await db.getTable(tableName);
      if (data && data.data) {
        data = data.data;
      } else {
        console.error(data)
        this.bus.notify('Ошибка обновления данных', 'e');
        return
      }

      data.forEach((item) => {
        item.TeachersJob = '-';
        if (item && item.TeachersJobsID) {
          if (this.doljnosti && Array.isArray(this.doljnosti) && this.doljnosti.length > 0) {
            this.doljnosti.forEach((item2) => {
              if (item.TeachersJobsID === item2.TeachersJobsID) {
                item.TeachersJob = item2.Name;
              }
            })
          }
        }
      })

      this.$refs["grid" + gridNum].setAll(data);
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
