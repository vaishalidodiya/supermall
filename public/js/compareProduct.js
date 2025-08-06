$(document).ready(function () {
  let products = [];

  // Load all products to dropdown
  $.ajax({
    url: "/api/user/productCompare",
    type: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (data) {
      products = data;

      if (products.length === 0) {
        // No products found — show message instead of dropdown options
        $("#product1, #product2").empty();
        $("#comparisonBody").empty();
        $("#comparisonTable").hide();
        $("#noProductsMsg").show(); // We'll create this element in HTML
      } else {
        $("#noProductsMsg").hide();

        const defaultOption = `<option value="" disabled selected>-- Choose Product --</option>`;
        $("#product1, #product2").append(defaultOption);

        products.forEach((product) => {
          const option = `<option value="${product._id}">${product.productName} </option>`;
          $("#product1, #product2").append(option);
        });
      }

      data.forEach((product) => {
        const option = `<option value="${product._id}">${product.productName} </option>`;
        $("#product1, #product2").append(option);
      });
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

  // Compare button click
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
      ["Features", product1.features, product2.features],
      ["Category", product1.categoryName, product2.categoryName],
      ["Price", product1.price, product2.price],
      ["Offer", product1.offerName, product2.offerName],
    ];

    $("#comparisonBody").empty();

    rows.forEach((row) => {
      $("#comparisonBody").append(
        `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`
      );
    });

    console.log($("#mainDiv").length); // Should print 1 if found

    $("#comparisonTable").show();
    $("#mainDiv").hide();
  });
});
