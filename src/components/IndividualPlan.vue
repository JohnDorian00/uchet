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
            <b-input-group prepend="Дисциплина">
              <b-form-select v-model="selectedDisciplines" :options="optionsDisciplines"></b-form-select>
            </b-input-group>
          </div>

          <div style="flex: 1 1 1px; display: flex;">
            <b-input-group prepend="Поток">
              <b-form-select v-model="selectedStream" :options="optionsStreams"></b-form-select>
            </b-input-group>
          </div>

        </div>

        <div style="height: 10px"></div>

        <div style="display: flex; flex-direction: row">
          <div style="flex: 0 0 auto; margin-right: 5px">
            <b-button style="width: 85px" @click="removeRow" variant="outline-primary">Удалить</b-button>
          </div>

          <div style="flex: 1 1 1px; margin-right: 5px">
            <b-input-group prepend="Вид учебной работы">
              <b-form-select v-model="selectedJobs" :options="optionsJobs"></b-form-select>
            </b-input-group>
          </div>

          <div style="flex: 1 1 1px; display: flex;">
            <b-input-group prepend="Семестр">
              <b-form-select v-model="selectedSemestr" :options="optionsSemestr"></b-form-select>
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
      ],

      selectedDisciplines: null,
      optionsDisciplines: [
        {text: '-', value: null}
      ],

      selectedStream: null,
      optionsStreams: [
        {text: '-', value: null}
      ],

      selectedJobs: null,
      optionsJobs: [
        {text: '-', value: null}
      ],

      selectedSemestr: 1,
      optionsSemestr: [
        {text: 'I', value: 1},
        {text: 'II', value: 2}
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

    // Дисциплины
    data = null;
    data = await db.getTable('Disciplines');
    if (data && data.data) {
      this.disciplines = data.data;

      if (this.disciplines && Array.isArray(this.disciplines) && this.disciplines.length > 0) {
        this.optionsDisciplines = [];
        this.disciplines.forEach((item) => {
          this.optionsDisciplines.push({text: item.Name, value: item.DisciplinesID})
        })
        this.selectedDisciplines = this.disciplines[0].DisciplinesID;
      } else {
        this.optionsDisciplines = [
          {text: '-', value: null}
        ]
      }
    } else {
      console.error(data)
      this.bus.notify('Ошибка обновления данных', 'e');
    }

    // Потоки
    data = null;
    data = await db.getTable('Streams');
    if (data && data.data) {
      this.streams = data.data;

      if (this.streams && Array.isArray(this.streams) && this.streams.length > 0) {
        this.optionsStreams = [];
        this.streams.forEach((item) => {
          this.optionsStreams.push({text: item.Name, value: item.StreamsID})
        })
        this.selectedStream = this.streams[0].StreamsID;
      } else {
        this.optionsStreams = [
          {text: '-', value: null}
        ]
      }
    } else {
      console.error(data)
      this.bus.notify('Ошибка обновления данных', 'e');
    }

    // Дисциплины
    data = null;
    data = await db.getTable('Jobs');
    if (data && data.data) {
      this.jobs = data.data;

      if (this.jobs && Array.isArray(this.jobs) && this.jobs.length > 0) {
        this.optionsJobs = [];
        this.jobs.forEach((item) => {
          this.optionsJobs.push({text: item.Name, value: item.JobsID})
        })
        this.selectedJobs = this.jobs[0].JobsID;
      } else {
        this.optionsJobs = [
          {text: '-', value: null}
        ]
      }
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
      this.selectedDisciplines = null;
      this.selectedStream = null;
      this.selectedJobs = null;
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

      console.info("INSERT INTO " + tableName + "(" + fieldsStr + ") VALUES(" + "'" + this.FIO + "','" + this.Degree + "','" + this.Status + "','" + this.Rate + "','" + this.Note + "','" + this.selected + "');");

      // let err = await db.run("INSERT INTO " + tableName + "(" + fieldsStr + ") VALUES(" + "'" + this.FIO + "','" + this.Degree + "','" + this.Status + "','" + this.Rate + "','" + this.Note + "','" + this.selected + "');")
      // if (err) {
      //   console.error(err)
      //   this.bus.notify('Ошибка добавления записи', 'e');
      // } else {
      //   await this.updateGrid();
      //   this.resetAllInputs();
      //   this.bus.notify('Данные добавлены', 's');
      // }
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
