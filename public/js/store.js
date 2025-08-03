let isDataTableInitialized = false;

const showSuccessMessage = (message) => {
  $("#successMessage").text(message).fadeIn();
  setTimeout(() => {
    $("#successMessage").fadeOut();
  }, 3000);
};

const productSuccessMessage = (message) => {
  $("#productSuccessMessage").text(message).fadeIn();
  setTimeout(() => {
    $("#productSuccessMessage").fadeOut();
  }, 3000);
};

//  Store List

const loadstoreTable = () => {
  var table = $("#storeTable").dataTable({
    processing: true,
    serverSide: true,
    destroy: true,
    ajax: {
      url: "/api/admin/store",
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
            html += `<button class="btn btn-sm btn-warning ms-2 fa fa-edit"
            onclick="openUpdateModal(this)"
            data-id="${row._id}"
            data-storename="${row.storeName}"
            data-address="${row.address}"
            data-floor="${row.floor}"
            data-contactnumber="${row.contactNumber}"
            data-description="${row.description}"
            ></button>`;
            html += `<button  onclick="openDeleteModal(this)" data-id="${row._id}" class="delete-btn btn btn-danger  btn-sm fa fa-trash ms-2" title="Delete"></button>`;
          return html;
        },
      },
    ],
  });
};

//  Store UpdateModal and DeleteModal

function openUpdateModal(button) {
  $("#updateForm").attr("action", `/api/admin/store/${button.dataset.id}`);
  $("#updateStoreName").val(button.dataset.storename);
  $("#updateAddress").val(button.dataset.address);
  $("#updateFloor").val(button.dataset.floor);
  $("#updateContactNumber").val(button.dataset.contactnumber);
  $("#updatedescription").val(button.dataset.description);
  new bootstrap.Modal(document.getElementById("updateModal")).show();
}

function openDeleteModal(button) {
  $("#deleteForm").attr("action", `/api/admin/store/${button.dataset.id}`);
  new bootstrap.Modal(document.getElementById("deleteConfirmModal")).show();
}

$(function () {
  loadstoreTable();

  $("#storeBtn").click(() => {
    $("#storeForm").show();
    $("#inputDiv").hide();
    $("#storeBtn").hide();
  });

  $("#backToMenuFromAdd, #backToMenuFromList").click(() => {
    $("#storeBtn").show();
    $("#inputDiv").show();
    $("#storeForm").hide();
    $("#productForm").hide();
  });

  $("#addstoreForm").submit((e) => {
    e.preventDefault();

    $(
      "#storeNameError, #addressError, #floorError, #contactError, #descriptionError"
    ).text("");

    const storeName = $("input[name='storeName']").val().trim();
    const address = $("input[name='address']").val().trim();
    const floor = $("input[name='floor']").val().trim();
    const contactNumber = $("input[name='contactNumber']").val().trim();
    const description = $("input[name='description']").val().trim();

    let isValid = true;

    if (!storeName) {
      $("#storeNameError").text("Store Name is required");
      isValid = false;
    }
    if (!address) {
      $("#addressError").text("Address is required");
      isValid = false;
    }
    const floorVal = Number(floor);
    if (!floor || isNaN(floorVal) || floorVal <= 0) {
      $("#floorError").text("Floor must be a positive number");
      isValid = false;
    }

    if (!contactNumber) {
      $("#contactError").text("Contact Number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(contactNumber)) {
      $("#contactError").text("Contact Number must be 10 digits");
      isValid = false;
    }
    if (!description) {
      $("#descriptionError").text("Description is required");
      isValid = false;
    }

    if (!isValid) return;

    const storeData = { storeName, address, floor, contactNumber, description };
    console.log("Submitting storeData:", storeData);

    $.ajax({
      url: "/api/admin/store",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(storeData),
      success: function () {
        showSuccessMessage("Stores added successfully");

        $("#addstoreForm")[0].reset();

        setTimeout(function () {
          window.location.href = "/admin/dashboard";
        }, 3000);
      },
      error: function (xhr) {
        alert("Error: " + xhr.responseText);
      },
    });
  });

  $("#deleteForm").submit(function (e) {
    e.preventDefault();
    const actionUrl = $(this).attr("action");
    $.ajax({
      url: actionUrl,
      type: "DELETE",
      success: function () {
        showSuccessMessage("Store deleted successfully");
        $("#deleteConfirmModal").modal("hide");
        loadstoreTable();
      },
      error: function () {
        alert("Delete failed.");
      },
    });
  });

  $("#updateForm").submit(function (e) {
    e.preventDefault();

    let isValid = true;
    const floorVal = $("#updateFloor").val().trim();

    if (!floorVal || isNaN(floorVal) || Number(floorVal) <= 0) {
      $("#floorUpdateError").text("Floor must be a positive number");
      isValid = false;

      return;
    }
    const actionUrl = $(this).attr("action");
    const updatedData = {
      storeName: $("#updateStoreName").val(),
      address: $("#updateAddress").val(),
      floor: floorVal,
      contactNumber: $("#updateContactNumber").val(),
      description: $("#updatedescription").val(),
    };

    $.ajax({
      url: actionUrl,
      type: "PATCH",
      contentType: "application/json",
      data: JSON.stringify(updatedData),
      success: function () {
        showSuccessMessage("Store updated successfully");
        $("#updateModal").modal("hide");
        loadstoreTable();
      },
      error: function () {
        alert("Update failed.");
      },
    });
  });
});

//  Store View Button

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

$(
  "#backToListFromView, #backToMenuFromAddProduct, #backToMenuFromProductList"
).click(function () {
  $("#viewStorePage").hide();
  $("#productForm").hide();
  $("#productList").hide();
  $("#inputDiv").show();
  $("#storeBtn").show();
});

$("#addProduct").click(() => {
  $("#productForm").show();
  $("#viewStorePage").hide();
});

$("#listProduct").click(() => {
  $("#productList").show();
});

// Add Product

$("#addProductForm").submit((e) => {
  console.log("submitted");

  e.preventDefault();

  $(
    "#productNameError, #productDescriptionError, #floorError ,#featuresError, #priceError"
  ).text("");

  const productName = $("input[name='productName']").val().trim();
  const description = $("input[name='productDescription']").val().trim();
  const floor = $("input[name='productFloor']").val().trim();
  const features = $("input[name='features']").val().trim();
  const price = $("input[name='price']").val().trim();

  console.log("Form values:", {
    productName,
    description,
    floor,
    features,
    price,
  });

  let isValid = true;

  if (!productName) {
    $("#productNameError").text("Product Name is required");
    isValid = false;
  }
  if (!description) {
    $("#descriptionError").text("Description is required");
    isValid = false;
  }
  const floorVal = parseInt(floor, 10);
  if (
    !floor ||
    isNaN(floorVal) ||
    floorVal < 1 ||
    floorVal > currentStoreMaxFloor
  ) {
    $("#productFloorError").text(
      `Floor must be between 1 and ${currentStoreMaxFloor}`
    );
    isValid = false;
    return;
  }

  if (!features) {
    $("#featuresError").text("Features is required");
    isValid = false;
  }
  if (!price) {
    $("#priceError").text("Price is required");
    isValid = false;
  }

  if (!isValid) {
    console.log("Validation failed");
    return;
  }

  if (!currentStoreId) {
    alert("Please view a store first to assign the product.");
    return;
  }

  const productData = {
    productName,
    description,
    floor: floorVal,
    features,
    price,
    storeId: currentStoreId,
  };

  console.log("Submitting Product Data:", productData);

  $.ajax({
    url: "/api/admin/product",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(productData),
    success: function () {
      productSuccessMessage("Product added successfully");
      $("#addProductForm")[0].reset();
      setTimeout(function () {
        window.location.href = "/admin/dashboard";
      }, 3000);
    },
    error: function (xhr, status, error) {
      console.error("AJAX error:", error);
      console.error("Response:", xhr.responseText);
      alert("Error: " + xhr.responseText);
    },
  });
});

//  product list

const loadProductTable = () => {
  var table = $("#productTable").dataTable({
    processing: true,
    serverSide: true,
    destroy: true,
    ajax: {
      url: `/api/admin/product?storeId=${currentStoreId}`,
      type: "GET",
    },
    columnDefs: [
      {
        targets: [0],
        data: "seqNo",
      },
      {
        targets: [1],
        data: "productName",
      },
      {
        targets: [2],
        data: "description",
      },
      {
        targets: [3],
        data: "floor",
      },
      {
        targets: [4],
        data: "features",
      },
      {
        targets: [5],
        data: "price",
      },
      {
        targets: [6],
        data: null,
        sorting: false,
        orderable: false,
        render: function (data, type, row, meta) {
          let html = `
          <button class="btn btn-sm btn-warning fa fa-edit"
          onclick="productUpdateModal(this)"
                data-id="${row._id}"
                data-product-name="${row.productName}"
                data-description="${row.description}"
                data-floor="${row.floor}"
                data-features="${row.features}"
                data-price="${row.price}"
                ></button>`;
          html += `<button  onclick="productDeleteModal(this)" data-id="${row._id}" class="delete-btn btn btn-danger  btn-sm fa fa-trash ms-2" title="Delete"></button>`;

          console.log("floor log: ", row.floor);
          return html;
        },
      },
    ],
  });
};

$("#listProduct").click(() => {
  $("#productList").show();
  $("#viewStorePage").hide();
  loadProductTable();
});

//  product deleteModel

function productDeleteModal(button) {
  $("#deleteProductForm").attr(
    "action",
    `/api/admin/product/${button.dataset.id}`
  );
  new bootstrap.Modal(document.getElementById("deleteProductModal")).show();
}

// Product delete
$("#deleteProductForm").submit(function (e) {
  e.preventDefault();
  const actionUrl = $(this).attr("action");
  $.ajax({
    url: actionUrl,
    type: "DELETE",
    success: function () {
      productSuccessMessage("Product deleted successfully");
      $("#deleteProductModal").modal("hide");
      loadProductTable();
    },
  });
});

// Product Update

function productUpdateModal(button) {
  $("#updateProductForm").attr(
    "action",
    `/api/admin/product/${button.dataset.id}`
  );
  $("#productUpdateModal").on("shown.bs.modal", function () {
    $("#updateProductFloor").val(button.dataset.floor);
  });
  $("#updateProductName").val(button.dataset.productName);
  $("#productDescription").val(button.dataset.description);
  $("#updateProductFloor").val(button.dataset.floor);
  $("#features").val(button.dataset.features);
  $("#productPrice").val(button.dataset.price);

  console.log("Floor value received:", button.dataset.floor);

  const floor = parseInt($("#updateProductFloor").val().trim());

  if (!floor || isNaN(floor) || floor < 1 || floor > currentStoreMaxFloor) {
    $("#productFloorUpdateError").text(
      `Floor must be between 1 and ${currentStoreMaxFloor}`
    );
    return;
  }

  new bootstrap.Modal(document.getElementById("productUpdateModal")).show();
}

$("#updateProductForm").submit(function (e) {
  e.preventDefault();

  const floorVal = parseInt($("#updateProductFloor").val().trim(), 10);
  $("#productFloorUpdateError").text("");

  let isValid = true;

  if (
    !floorVal ||
    isNaN(floorVal) ||
    floorVal < 1 ||
    floorVal > currentStoreMaxFloor
  ) {
    $("#productFloorUpdateError").text(
      `Floor must be between 1 and ${currentStoreMaxFloor}`
    );
    isValid = false;
  }

  if (!isValid) return;

  const actionUrl = $(this).attr("action");
  const productdData = {
    productName: $("#updateProductName").val(),
    description: $("#productDescription").val(),
    floor: floorVal,
    features: $("#features").val(),
    price: $("#productPrice").val(),
  };
  console.log("productData :", productdData);
  $.ajax({
    url: actionUrl,
    type: "PATCH",
    contentType: "application/json",
    data: JSON.stringify(productdData),
    success: function () {
      productSuccessMessage("Product updated successfully");
      $("#productUpdateModal").modal("hide");
      loadProductTable();
    },
    error: function () {
      alert("Update failed.");
    },
  });
});
