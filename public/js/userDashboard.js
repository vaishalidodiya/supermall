let isDataTableInitialized = false;

$(function(){
  loadstoreTable();
  
})

const loadstoreTable = () => {
    console.log("✅ loadstoreTable called");

  var table = $("#storeTable").dataTable({
    processing: true,
    serverSide: true,
    destroy: true,
    ajax: {
      url: "/api/user/userCreate",
      type: "GET",
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
          let html = `<button class="btn btn-sm bg-secondary-subtle ms-2 fs-6 fw-bold view-btn"
            data-id="${row._id}"
            data-storename="${row.storeName}"
            data-address="${row.address}"
            data-floor="${row.floor}"
            data-contactnumber="${row.contactNumber}"
            data-description="${row.description}"
            >View</button>`;
           
          return html;
        },
      },
    ],
  });
};

let currentStoreId = null;
let currentStoreMaxFloor = null;

$(document).on("click", ".view-btn", function () {
  currentStoreId = $(this).data("id");
  const storeFloor = parseInt($(this).data("floor"), 10);
  currentStoreMaxFloor = storeFloor;

  $("#viewStoreName").text($(this).data("storename"));
  $("#viewAddress").text($(this).data("address"));
  $("#viewFloor").text(storeFloor);
  $("#viewContactNumber").text($(this).data("contactnumber"));
  $("#viewDescription").text($(this).data("description"));

  $("#inputDiv").hide();
  $("#storeForm").hide();
  $("#viewStorePage").show();
});

console.log('okay')