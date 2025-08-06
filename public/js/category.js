let isDataTableInitialized = false;
const token = getLocalData("token");

const showSuccessMessage = (message) => {
  $("#successMessage").text(message).fadeIn();
  setTimeout(() => {
    $("#successMessage").fadeOut();
  }, 3000);
};

const loadCategoryTable = () => {
  var table = $("#categoryTable").dataTable({
    processing: true,
    serverSide: true,
    destroy: true,
    ajax: {
      url: "/api/admin/category",
      type: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
      error: function (xhr, error, thrown) {
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
        data: "categoryName",
      },
      {
        targets: [2],
        data: "description",
      },
      {
        targets: [3],
        data: null,
        sorting: false,
        orderable: false,
        render: function (data, type, row, meta) {
          let html = `<button class="btn btn-sm btn-warning fa fa-edit"
                onclick="openUpdateModal(this)"
                data-id="${row._id}"
                data-category-name="${row.categoryName}"
                data-description="${row.description}"
              ></button>`;
          html += `<button  onclick="openDeleteModal(this)" data-id="${row._id}" class="delete-btn btn btn-danger ms-2 btn-sm fa fa-trash" title="Delete"></button>`;
          return html;
        },
      },
    ],
  });
};

function openUpdateModal(button) {
  $("#updateForm").attr("action", `/api/admin/category/${button.dataset.id}`);
  $("#updateCategoryName").val(button.dataset.categoryName);
  $("#updatedescription").val(button.dataset.description);
  new bootstrap.Modal(document.getElementById("updateModal")).show();
}

function openDeleteModal(button) {
  $("#deleteForm").attr("action", `/api/admin/category/${button.dataset.id}`);
  new bootstrap.Modal(document.getElementById("deleteConfirmModal")).show();
}

$(function () {
  loadCategoryTable();

  $("#categoryBtn").click(() => {
    $("#categoryForm").show();
    $("#categoryDiv").hide();
    $("#categoryBtn").hide();
  });

  $("#backToMenuFromAdd, #backToMenuFromList").click(() => {
    $("#categoryBtn").show();
    $("#categoryDiv").show();
    $("#categoryForm").hide();
  });

  $("#addCategoryForm").submit((e) => {
    e.preventDefault();

    $("#categoryNameError,#descriptionError").text("");

    const categoryName = $('input[name="categoryName"]').val().trim();
    const description = $('input[name= "description"]').val().trim();

    let isValid = true;

    if (!categoryName) {
      $("#categoryNameError").text("Category Name is required");
      isValid = false;
    }

    if (!isValid) return;

    const category = { categoryName, description };

    $.ajax({
      url: "/api/admin/category",
      type: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(category),
      success: function () {
        showSuccessMessage("Category added successfully");

        $("#addCategoryForm")[0].reset();

        setTimeout(function () {
          window.location.href = "/admin/category";
        }, 3000);
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          alert("Token expired");
          setTimeout(function () {
            window.location.href = "/admin/login";
          }, 1000);
        } else {
          alert("Category list not loaded.");
        }
      },
    });
  });

  $("#deleteForm").submit(function (e) {
    e.preventDefault();
    const actionUrl = $(this).attr("action");
    $.ajax({
      url: actionUrl,
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
      success: function () {
        showSuccessMessage("Category deleted successfully");
        $("#deleteConfirmModal").modal("hide");
        loadCategoryTable();
      },
      error: function () {
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
    const actionUrl = $(this).attr("action");
    const updatedData = {
      categoryName: $("#updateCategoryName").val(),
      description: $("#updatedescription").val(),
    };

    $.ajax({
      url: actionUrl,
      type: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(updatedData),
      success: function () {
        showSuccessMessage("Category updated successfully");
        $("#updateModal").modal("hide");
        loadCategoryTable();
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
});
