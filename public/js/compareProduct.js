const token = getLocalData("token");

$(document).ready(function () {
  $("#backBtn").click(()=>{
      $("#comparisonTable").hide();
    $("#mainDiv").show();
    $("#backBtn").hide();
  })

  let products = [];
  $.ajax({
    url: "/api/user/productCompare",
    type: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (data) {
      products = data;

      if (products.length === 0) {
        $("#product1, #product2").empty();
        $("#comparisonBody").empty();
        $("#comparisonTable").hide();
        $("#noProductsMsg").show();
      } else {
        $("#noProductsMsg").hide();

        const defaultOption = `<option value="" disabled selected>-- Choose Product --</option>`;
        $("#product1, #product2").append(defaultOption);

        products.forEach((product) => {
          const option = `<option value="${product._id}">${product.productName} </option>`;
          $("#product1, #product2").append(option);
        });
      }

     
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

  $("#compareBtn").click(function () {
    const id1 = $("#product1").val();
    const id2 = $("#product2").val();

    if (!id1 || !id2 || id1 === id2) {
      alert("Please select two different products to compare.");
      return;
    }

    const product1 = products.find((p) => p._id === id1);
    const product2 = products.find((p) => p._id === id2);

    const rows = [
      ["Store", product1.storeName, product2.storeName],
      ["Product Name", product1.productName, product2.productName],
      ["Description", product1.description, product2.description],
      ["Floor", product1.floor, product2.floor],
      ["Features", product1.features ?? "-", product2.features ?? "-"],
      ["Category", product1.categoryName ?? "-", product2.categoryName ?? "-"],
      ["Price", product1.price , product2.price ],
      ["Offer", product1.offerName ?? "-", product2.offerName ?? "-"],
    ];

    $("#comparisonBody").empty();

    rows.forEach((row) => {
      $("#comparisonBody").append(
        `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`
      );
    });

    $("#comparisonTable").show();
    $("#backBtn").show()
    $("#mainDiv").hide();
  });
  
});
