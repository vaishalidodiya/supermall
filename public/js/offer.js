let isDataTableInitialized = false;

const showSuccessMessage = (message) => {
  $("#successMessage").text(message).fadeIn();
  setTimeout(() => {
    $("#successMessage").fadeOut();
  }, 3000);
};

const loadOfferTable = () => {
  var table = $("#offerTable").dataTable({
    processing: true,
    serverSide: true,
    destroy: true,

    ajax: {
      url: "/api/admin/offer",
      type: "GET",
    },
    columnDefs: [
      {
        targets: [0],
        data: "seqNo",
      },
      {
        targets: [1],
        data: "offerName",
      },
      {
        targets: [2],
        data: "description",
      },
      {
        targets: [3],
        data: "discount",
      },
      {
        targets: [4],
        data: "startDate",
      },
      {
        targets: [5],
        data: "endDate",
      },
      {
        targets: [6],
        data: null,
        sorting: false,
        orderable: false,
        render: function (data, type, row, meta) {
          let html = `<button class="btn btn-sm btn-warning fa fa-edit"
                onclick="openUpdateModal(this)"
                data-id="${row._id}"
                data-offer-name="${row.offerName}"
                data-description="${row.description}"
                data-discount="${row.discount}"
                data-start-date="${row.startDate}"
                data-end-date="${row.endDate}"
              ></button>`;
          html += `<button  onclick="openDeleteModal(this)" data-id="${row._id}" class="delete-btn btn btn-danger ms-2 btn-sm fa fa-trash" title="Delete"></button>`;
          return html;
        },
      },
    ],
  });
};

function openUpdateModal(button) {
  $("#updateForm").attr("action", `/api/admin/offer/${button.dataset.id}`);
  $("#updateOfferName").val(button.dataset.offerName);
  $("#updatedescription").val(button.dataset.description);
  $("#updateDiscount").val(button.dataset.discount);
  $("#updateStartDate").val(button.dataset.startDate);
  $("#updateEndDate").val(button.dataset.endDate);
  new bootstrap.Modal(document.getElementById("updateModal")).show();
}

function openDeleteModal(button) {
  $("#deleteForm").attr("action", `/api/admin/offer/${button.dataset.id}`);
  new bootstrap.Modal(document.getElementById("deleteConfirmModal")).show();
}

$(function () {
  loadOfferTable();

  $("#offerBtn").click(() => {
    $("#offerForm").show();
    $("#offerDiv").hide();
    $("#offerBtn").hide();
  });
  $("#backToMenuFromAdd, #backToMenuFromList").click(() => {
    $("#offerForm").hide();

    $("#offerBtn").show();
    $("#offerDiv").show();
  });

  $("#addOfferForm").submit((e) => {
    e.preventDefault();

    $(
      "#offerNameError,#descriptionError,discountError,startDateError,endDateError"
    ).text("");

    const offerName = $('input[name="offerName"]').val().trim();
    const description = $('input[name= "description"]').val().trim();
    const discount = $('input[name= "discount"]').val().trim();
    const startDate = $('input[name= "startDate"]').val().trim();
    const endDate = $('input[name= "endDate"]').val().trim();

    let isValid = true;

    if (!offerName) {
      $("#offerNameError").text("Offer Name is required");
      isValid = false;
    }

    if (!isValid) return;

    const offer = { offerName, description, discount, startDate, endDate };

    $.ajax({
      url: "/api/admin/offer",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(offer),
      success: function () {
        showSuccessMessage("Offer added successfully");

        $("#addOfferForm")[0].reset();

        setTimeout(function () {
          window.location.href = "/admin/offer";
        }, 3000);
      },

      error: function (xhr) {
        console.error("XHR Error:", xhr);
        alert(
          "Something went wrong: " +
            (xhr.responseJSON?.msg || xhr.statusText || "Unknown error")
        );
      },
    });
  });

  $("#deleteForm").submit(function (e) {
    e.preventDefault();
    const actionUrl = $(this).attr("action");
    $.ajax({
      url: actionUrl,
      method: "DELETE",
      success: function () {
        showSuccessMessage("Offer deleted successfully");
        $("#deleteConfirmModal").modal("hide");
        loadOfferTable();
      },
      error: function () {
        alert("Delete failed.");
      },
    });
  });

  $("#updateForm").submit(function (e) {
    e.preventDefault();
    const actionUrl = $(this).attr("action");
    const updatedData = {
      offerName: $("#updateOfferName").val(),
      description: $("#updatedescription").val(),
      discount: $("#updateDiscount").val(),
      startDate: $("#updateStartDate").val(),
      endDate: $("#updateEndDate").val(),
    };

    $.ajax({
      url: actionUrl,
      type: "PATCH",
      contentType: "application/json",
      data: JSON.stringify(updatedData),
      success: function () {
        showSuccessMessage("Offer updated successfully");
        $("#updateModal").modal("hide");
        loadOfferTable();
      },
      error: function () {
        alert("Update failed.");
      },
    });
  });
});
