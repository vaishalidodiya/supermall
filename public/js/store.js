

let isDataTableInitialized = false;
const token = getLocalData("token");

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
    search: true,
    ajax: {
      url: "/api/admin/store",
      type: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          window.location.href = "/admin/login";
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
        data: "storeName"
      },
      {
        targets: [2],
        data: "address"
      },
      {
        targets: [3],
        data: "floor",
      },
      {
        targets: [4],
        data: "contactNumber"
      },
      {
        targets: [5],
        data: "description"
      },
      {
        targets: [6],
        data: null,
        sorting: false,
        orderable: false,
        render: function (data, type, row, meta) {
          let html = `<button class="btn btn-sm  ms-2 fs-6 fw-bold view-btn custom-hover-btn"
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
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(storeData),
      success: function () {
        showSuccessMessage("Stores added successfully");

        $("#addstoreForm")[0].reset();

        setTimeout(function () {
          window.location.href = "/admin/store";
        }, 3000);
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          $("#loginError").text("Token expired").show();
          setTimeout(function () {
            window.location.href = "/admin/login";
          }, 1000);
        } else {
          alert("Error: ", xhr);
        }
      },
    });
  });

  $("#deleteForm").submit(function (e) {
    e.preventDefault();
    const actionUrl = $(this).attr("action");
    $.ajax({
      url: actionUrl,
      type: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
      success: function () {
        showSuccessMessage("Store deleted successfully");
        $("#deleteConfirmModal").modal("hide");
        loadstoreTable();
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          alert("Token expired");
          setTimeout(function () {
            window.location.href = "/admin/login";
          }, 1000);
        } else {
          alert("Delete failed.");
        }
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
  floorDropdown();

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
  const floor = $("#floorDropdown").val().trim();
  const category = $("#categoryDropdown").val().trim();
  const features = $("input[name='features']").val().trim();
  const price = $("input[name='price']").val().trim();
  const offer = $("#offerDropdown").val().trim();

  console.log("Form values:", {
    productName,
    description,
    floor,
    features,
    category,
    price,
    offer,
  });

  let isValid = true;

  if (!productName) {
    $("#productNameError").text("Product Name is required");
    isValid = false;
  }
  if (!description) {
    $("#productDescriptionError").text("Description is required");
    isValid = false;
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
    floor,
    features,
    categoryId: category, // this must be a string ObjectId
    price,
    offerId: offer, // this too
    storeId: currentStoreId,
  };

  console.log("Submitting Product Data:", productData);

  $.ajax({
    url: "/api/admin/product",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(productData),
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function () {
      productSuccessMessage("Product added successfully");
      $("#addProductForm")[0].reset();
      setTimeout(function () {
        window.location.href = "/admin/store";
      }, 3000);
    },
    error: function (xhr, status, error) {
      if (xhr.status === 401) {
        alert("Token expired");
        setTimeout(function () {
          window.location.href = "/admin/login";
        }, 1000);
      } else {
        console.error("AJAX error:", error);
        console.error("Response:", xhr.responseText);
        alert("Error: " + xhr.responseText);
      }
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
      headers: {
        Authorization: "Bearer " + token,
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          window.location.href = "/admin/login";
        }
      },
    },
    columnDefs: [
      { targets: [0], data: "seqNo" },
      { targets: [1], data: "productName" },
      { targets: [2], data: "description" },
      { targets: [3], data: "floor" },
      { targets: [4], data: "features" },
      { targets: [5], data: "categoryName" }, // <- show category name
      { targets: [6], data: "price" },
      { targets: [7], data: "offerName" }, // <- show offer name
      {
        targets: [8],
        data: null,
        sorting: false,
        orderable: false,
        render: function (data, type, row, meta) {
          const categoryId =
            typeof row.categoryId === "object" && row.categoryId?._id
              ? row.categoryId._id
              : "";

          const offerId =
            typeof row.offerId === "object" && row.offerId?._id
              ? row.offerId._id
              : "";

          return `
    <button class="btn btn-sm btn-warning fa fa-edit"
      onclick="productUpdateModal(this)"
      data-id="${row._id}"
      data-product-name="${row.productName}"
      data-description="${row.description}"
      data-floor="${row.floor}"
      data-features="${row.features}"
      data-category-id="${categoryId}"
      data-price="${row.price}"
      data-offer-id="${offerId}">
    </button>

    <button onclick="productDeleteModal(this)"
      data-id="${row._id}"
      class="delete-btn btn btn-danger btn-sm fa fa-trash ms-2"
      title="Delete">
    </button>`;
        },
      },
    ],
  });
};

$("#listProduct").click(() => {
  $("#productList").show();
  $("#viewStorePage").hide();

  if ($.fn.DataTable.isDataTable("#productTable")) {
    $("#productTable").DataTable().clear().destroy();
  }
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
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function () {
      productSuccessMessage("Product deleted successfully");
      $("#deleteProductModal").modal("hide");
      loadProductTable();
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        alert("Token expired");
        setTimeout(function () {
          window.location.href = "/admin/login";
        }, 1000);
      } else {
        alert(
          "Delete failed: " +
            (xhr.responseJSON?.msg || xhr.statusText || "Unknown error")
        );
      }
    },
  });
});

// Product Update

async function productUpdateModal(button) {
  const selectedCategoryId = button.dataset.categoryId;
  const selectedOfferId = button.dataset.offerId;
  const selectedFloor = button.dataset.floor;

  await populateUpdateDropdowns(
    selectedCategoryId,
    selectedOfferId,
    selectedFloor
  );

  $("#updateProductForm").attr(
    "action",
    `/api/admin/product/${button.dataset.id}`
  );
  $("#updateProductName").val(button.dataset.productName);
  $("#productDescription").val(button.dataset.description);
  $("#features").val(button.dataset.features);
  $("#productPrice").val(button.dataset.price);

  new bootstrap.Modal(document.getElementById("productUpdateModal")).show();
}

$("#updateProductForm").submit(function (e) {
  e.preventDefault();

  const actionUrl = $(this).attr("action");
  const productdData = {
    productName: $("#updateProductName").val(),
    description: $("#productDescription").val(),
    floor: $("#updateFloorDropdown").val(),
    features: $("#features").val(),
    categoryId: $("#updateCategoryDropdown").val(),
    price: $("#productPrice").val(),
    offerId: $("#updateOfferDropdown").val(),
  };
  console.log("productData :", productdData);
  $.ajax({
    url: actionUrl,
    type: "PATCH",
    headers: {
      Authorization: "Bearer " + token,
    },
    contentType: "application/json",
    data: JSON.stringify(productdData),
    success: function () {
      productSuccessMessage("Product updated successfully");
      $("#productUpdateModal").modal("hide");
      loadProductTable();
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        alert("Token expired");
        setTimeout(function () {
          window.location.href = "/admin/login";
        }, 1000);
      } else {
        alert(
          "Update failed: " +
            (xhr.responseJSON?.msg || xhr.statusText || "Unknown error")
        );
      }
    },
  });
});

$(document).ready(function () {
  categoryDropdown();
  offerDropdown();
});

const categoryDropdown = () => {
  $.ajax({
    url: "/api/admin/category",
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (data) {
      let html = '<option value="" disabled selected>Select Category</option>';
      if (Array.isArray(data?.data)) {
        for (let i = 0; i < data.data.length; i++) {
          html += ` <option value=${data.data[i]._id}>${data.data[i].categoryName}</option>`;
        }
      } else {
        console.warn("Unexpected response structure", data);
      }
      $("#categoryDropdown").html(html);
    },
    error: function (xhr, data) {
      if (xhr.status === 401) {
        window.location.href = "/admin/login";
      }
    },
  });
};

const offerDropdown = () => {
  $.ajax({
    url: "/api/admin/offer",
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (data) {
      let html = '<option value="" disabled selected>Select Offer</option>';
      if (Array.isArray(data?.data)) {
        for (let i = 0; i < data.data.length; i++) {
          html += ` <option value=${data.data[i]._id}>${data.data[i].offerName}</option>`;
        }
      } else {
        console.warn("Unexpected response structure ", data);
      }
      $("#offerDropdown").html(html);
    },
    error: function (xhr, data) {
      if (xhr.status === 401) {
        window.location.href = "/admin/login";
      }
    },
  });
};

const floorDropdown = () => {
  $.ajax({
    url: "/api/admin/store/" + currentStoreId,
    type: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (data, status) {
      const floor = parseInt(data.floor);
      let html = '<option value="">Select Floor</option>';
      for (let i = 1; i <= floor; i++) {
        html += `<option value="${i}">${i}</option>`;
      }
      $("#floorDropdown").html(html); // Clear and add new options
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        alert("Token expired");
        setTimeout(function () {
          window.location.href = "/admin/login";
        }, 1000);
      } else {
        alert(
          "Something went wrong: " +
            (xhr.responseJSON?.msg || xhr.statusText || "Unknown error")
        );
      }
    },
  });
};

async function populateUpdateDropdowns(
  selectedCategoryId,
  selectedOfferId,
  selectedFloor
) {
  // Floor dropdown
  $.ajax({
    url: `/api/admin/store/${currentStoreId}`,
    type: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (data) {
      let html = '<option value="" disabled>Choose Floor</option>';
      for (let i = 1; i <= data.floor; i++) {
        html += `<option value="${i}" ${
          i == selectedFloor ? "selected" : ""
        }>${i}</option>`;
      }
      $("#updateFloorDropdown").html(html);
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        alert("Token expired");
        setTimeout(function () {
          window.location.href = "/admin/login";
        }, 1000);
      } else {
        alert(
          "Something went wrong: " +
            (xhr.responseJSON?.msg || xhr.statusText || "Unknown error")
        );
      }
    },
  });

  // Category dropdown
  $.ajax({
    url: "/api/admin/category",
    type: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (data) {
      let html = '<option value="" disabled>Choose Category</option>';
      data.data.forEach((cat) => {
        html += `<option value="${cat._id}" ${
          cat._id == selectedCategoryId ? "selected" : ""
        }>${cat.categoryName}</option>`;
      });
      $("#updateCategoryDropdown").html(html);
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        alert("Token expired");
        setTimeout(function () {
          window.location.href = "/admin/login";
        }, 1000);
      } else {
        alert(
          "Something went wrong: " +
            (xhr.responseJSON?.msg || xhr.statusText || "Unknown error")
        );
      }
    },
  });

  // Offer dropdown
  $.ajax({
    url: "/api/admin/offer",
    type: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (data) {
      let html = '<option value="" disabled>Choose Offer</option>';
      data.data.forEach((offer) => {
        html += `<option value="${offer._id}" ${
          offer._id == selectedOfferId ? "selected" : ""
        }>${offer.offerName}</option>`;
      });
      $("#updateOfferDropdown").html(html);
    },
    error: function (xhr) {
      if (xhr.status === 401) {
        alert("Token expired");
        setTimeout(function () {
          window.location.href = "/admin/login";
        }, 1000);
      } else {
        alert(
          "Something went wrong: " +
            (xhr.responseJSON?.msg || xhr.statusText || "Unknown error")
        );
      }
    },
  });
}
