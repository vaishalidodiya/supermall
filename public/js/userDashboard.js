let isDataTableInitialized = false;
const token = getLocalData('token');

$(function () {
  loadstoreTable();

  $(function () {
    $(document).on("click", ".view-btn", function () {
      currentStoreId = $(this).data("id");

      loadProductTable();

      $("#inputDiv").hide();
      $("#viewStorePage").show();
      
    });
  });

  $("#back").click(() => {
  $("#viewStorePage").hide();   
  $("#inputDiv").show();      
});
});


const loadstoreTable = () => {

  var table = $("#storeTable").dataTable({
    processing: true,
    serverSide: true,
    destroy: true,
    ajax: {
      url: "/api/user/userCreate",
      type: "GET",
      headers: {
        Authorization: "Bearer "+token,
      },
      error: function (xhr, error, thrown) {
        if (xhr.status === 401) {
          window.location.href = '/admin/login'
        }
      },
    },
    columnDefs: [
      {
        targets: [0],
        data: "seqNo",
      },
      {
        targets: [1],
        data: "storeName",
      },
      {
        targets: [2],
        data: "address",
      },
      {
        targets: [3],
        data: "floor",
      },
      {
        targets: [4],
        data: "contactNumber",
      },
      {
        targets: [5],
        data: "description",
      },
      {
        targets: [6],
        data: null,
        sorting: false,
        orderable: false,
        render: function (data, type, row, meta) {
          let html = `<button class="btn btn-sm  ms-2 fs-6 fw-bold view-btn custom-hover-btn"
            data-id="${row._id}"
           
            >View</button>`;

          return html;
        },
      },
    ],
  });
};

let currentStoreId = null;
let currentStoreMaxFloor = null;

const loadProductTable = () => {
  var table = $("#customerProductTable").dataTable({
    processing: true,
    serverSide: true,
    destroy: true,
    ajax: {
      url: `/api/admin/product?storeId=${currentStoreId}`,
      type: "GET",
      headers: {
        Authorization: "Bearer "+token,
      },
      error: function (xhr, error, thrown) {
        if (xhr.status === 401) {
          window.location.href = '/admin/login'
        }
      },
    },
    columnDefs: [
      { targets: [0], data: "seqNo" },
      { targets: [1], data: "productName" },
      { targets: [2], data: "description" },
      { targets: [3], data: "floor" },
      { targets: [4], data: "features" },
      { targets: [5], data: "categoryName" }, 
      { targets: [6], data: "price" },
      { targets: [7], data: "offerName" },
    ],
  });
};

