<template>
  <div style="width: 100%; height: 100%">
    <!--    ag-theme-alpine-dark-->
    <!--    style="width: calc(100% - 10px); height: calc(100% - 10px); margin: 5px;"-->
    <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-alpine"
        :id="id"
        :gridOptions="gridOptions"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :pinnedTopRowData="pinnedTopRowData"
        :pinnedBottomRowData="pinnedBottomRowData"
        :suppressDragLeaveHidesColumns="true"
        :animateRows="true"
        :rowSelection="'multiple'"
        @grid-ready="onGridReady"
    >
    </ag-grid-vue>
  </div>
</template>
<script>

import {AgGridVue} from "ag-grid-vue";

import "smart-webcomponents/source/modules/smart.window.js";
import "smart-webcomponents/source/styles/smart.default.css";
import "smart-webcomponents/source/modules/smart.grid.js";


export default {
  components: {
    AgGridVue
  },
  name: "Grid",
  data() {
    return {
      id: this.winName ? 'grid' + this.winName : 'grid',
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      rowData: null,
      columnDefs: null,
      defaultColDef: null,
      pinnedTopRowData: null,
      pinnedBottomRowData: null
    }
  },
  props: {
    bus: Object,
    winName: String,
    settings: Object,
    columns: Array,
    data: Array,
    defColDef: Object
  },

  beforeMount() {
    this.gridOptions = {
      suppressHorizontalScroll: true
    };

    this.columnDefs = [
      {field: 'fullName', headerName: 'ФИО', minWidth: 150}
    ];
    // for (let i = 0; i < 18; i++) {
    //   this.columnDefs.push({field: 'field' + i, headerName: 'ЛКР'});
    // }

    this.rowData = [
      {
        fullName: 'Абрамов А.В.'
      }
    ];
    this.defaultColDef = {
      flex: 1,
      minWidth: 20,
      editable: true,
      resizable: true,
    };


    this.init();
  },

  mounted() {
    // for (let i = 0; i<50;i++) {
    //   let obj = {
    //     fullName: 'Абрамов А.В.'
    //   }
    //
    //   for (let i=0; i<18; i++) {
    //     obj['field'+i] = 0;
    //   }
    //
    //   this.rowData.push(obj);
    // }
    //
    // console.info(this.rowData);

    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },

  methods: {
    // Заполнение всего грида
    setAll(rowData) {
      this.rowData = rowData;
    },

    // Вывод всего грида
    getAll() {
      let rowsData = [];
      this.gridApi.forEachNode(function (node) {
        rowsData.push(node.data);
      });
      return rowsData
    },

    // Добавить строчку
    addRow(rowArr, index) {
      let row = {};
      this.columnDefs.forEach((item, index) => {
        row[item.field] = rowArr[index];
      })

      this.gridOptions.api.applyTransaction({
        add: [row],
        addIndex: index,
      });
    },

    // Удалить строчку
    removeRow() {
      return this.gridApi.applyTransaction({remove: this.gridApi.getSelectedRows()});
    },

    // Применение настроек
    init() {
      for (let key in this.settings) {
        if (this[key] !== undefined && this.settings[key] !== undefined) {
          this[key] = this.settings[key];
        }
      }
    },

    // Авторесайз
    onGridReady(params) {
      params.api.sizeColumnsToFit();

      window.addEventListener('resize', function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        });
      });

      params.api.sizeColumnsToFit();
    },

    // refreshTable() {
    //   if (this.gridColumnApi.columnController && this.gridColumnApi.columnController.bodyWidthDirty) {
    //     this.gridApi.sizeColumnsToFit();
    //     if (this.refreshAttempts) {
    //       this.refreshAttempts--;
    //       setTimeout(() => {
    //         this.refreshTable();
    //       }, 100);
    //     }
    //   } else {
    //     this.refreshAttempts = 0;
    //   }
    // }
  }
}
</script>


<style scoped>
.labels {
  flex: 0 0 160px;
  margin-right: 20px;
  margin-top: 5px;
}

.ag-header-cell-label {
  justify-content: center;
}

</style>
