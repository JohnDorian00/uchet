<template>
  <div class="main" style="width: 100%; height: 100%">


    <ag-grid-vue style="width: 100%; height: 100%;"
                 class="ag-theme-alpine"
                 id="DoljnostiGrid"
                 :gridOptions="gridOptions"
                 @grid-ready="onGridReady"
                 :rowData="rowData"
                 :columnDefs="columnDefs"
                 :pinnedTopRowData="pinnedTopRowData"
                 :pinnedBottomRowData="pinnedBottomRowData"
    >
    </ag-grid-vue>


  </div>
</template>

<script>




import { AgGridVue } from "ag-grid-vue";

import "smart-webcomponents/source/modules/smart.window.js";
import "smart-webcomponents/source/styles/smart.default.css";
import "smart-webcomponents/source/modules/smart.grid.js";



export default {
  components: {
    AgGridVue
  },
  name: "Doljnosti",
  data() {
    return {
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
    bus: Object
  },

  beforeMount() {
    this.gridOptions = {};

    this.columnDefs = [
      { field: 'fullName', headerName: 'ФИО', minWidth: 150 }
    ];
    for (let i=0; i<18; i++) {
      this.columnDefs.push({ field: 'field'+i, headerName: 'ЛКР' });
    }

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
  },

  mounted() {
    for (let i = 0; i<50;i++) {
      let obj = {
        fullName: 'Абрамов А.В.'
      }

      for (let i=0; i<18; i++) {
        obj['field'+i] = 0;
      }

      this.rowData.push(obj);
    }

    console.info(this.rowData);

    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;
  },

  methods: {
    // Авторесайз
    onGridReady(params) {
      params.api.sizeColumnsToFit();

      window.addEventListener('resize', function () {
        setTimeout(function () {
          params.api.sizeColumnsToFit();
        });
      });

      params.api.sizeColumnsToFit();
    }
  }
}
</script>



<style scoped>



.main {
  width: 100%;
  height: 100%;
}

.menuItem {
  margin-bottom: 10px;
  flex: 0 0 30px;
  display: flex;
  justify-content: left;
  /*align-items: center;*/
  width: 100%;
  text-align: end;
}

.labels {
  flex: 0 0 160px;
  margin-right: 20px;
  margin-top: 5px;
}

</style>
