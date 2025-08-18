const token = getLocalData('token');

$(document).ready(() => {
  $("#regBtn").click(() => {
    $("#regDiv").show();
    $("#regBtn").hide();
    $("#loginBtn").hide();
  });

  $("#registrationForm").submit((e) => {
    e.preventDefault();

    $(
      "#nameError,#mobileNumberError,#emailerror,#userTypeError,#passworderror,#confirmPasswordError"
    ).text("");

    const name = $("input[name='name']").val().trim();
    const contactNumber = $("input[name='contactNumber']").val().trim();
    const email = $("input[name='email']").val().trim();
    const password = $("input[name='password']").val().trim();
    const confirmPassword = $("input[name='confirmPassword']").val().trim();

    let isValid = true;

    if (confirmPassword !== password) {
      $("#confirmPasswordError").text("Not match with password");
      isValid = false;
    }

    const mobilePattern = /^\d{10}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!mobilePattern.test(contactNumber)) {
      $("#mobileNumberError").text(
        "Please enter a valid 10-digit mobile number."
      );
      isValid = false;
    }

    if (!emailPattern.test(email)) {
      $("#emailerror").text("Please enter a valid email address.");
      isValid = false;
    }

    if (!isValid) return;

    const userData = { name, contactNumber, email, password };

    $.ajax({
      url: "/api/user/userCreate",
      type: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      contentType: "application/json",
      data: JSON.stringify(userData),
      success: function () {
        window.location.href = "/admin/success";
        $("#registrationForm")[0].reset();
      },
      error: function (xhr) {
        if (xhr.status === 401) {
          $("#loginError").text("Token expired").show();
          setTimeout(function () {
            window.location.href = "/admin/login";
          }, 1000);
        } else if (xhr.status === 409) {
          const errorMessage = xhr.responseJSON.error;
          $("#loginError").text(errorMessage).show();
        } else {
          $("#loginError").text("Something went wrong").show();
        }
      },
    });
  });

  $("#userLoginForm").submit((e) => {
    e.preventDefault();

    const email = $("input[name='email']").val().trim();
    const password = $("input[name='password']").val().trim();

    let isValid = true;

    if (!email) {
      $("#emailerror").text("Email is required");
      isValid = false;
    }
    if (!password) {
      $("#passworderror").text("Password is required");
      isValid = false;
    }

    if (!isValid) return;

    const loginData = { email, password };
    $.ajax({
      url: "/api/user/userCreate/login",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(loginData),
      headers: {
        Authorization: "Bearer " + token,
      },
      success: function (res) {
        $("#loginError").hide();
        setTimeout(function () {
          window.location.href = "/user/userDashboard";
        }, 1000);
      },
      error: function (xhr, status, error) {
        console.error("Login AJAX error:", status, error);
        let errorMsg = "Login failed. Please try again.";
        if (xhr.status === 401) {
          $("#loginError").text(errorMsg).show();
          setTimeout(function () {
            window.location.href = "/admin/login";
          }, 1000);
        } else {
          try {
            const response = JSON.parse(xhr.responseText);
            errorMsg = response.message || errorMsg;
          } catch (e) {
            console.error("Error parsing response", e);
          }
          $("#loginError").text(errorMsg).show();
        }
      },
    });
  });
});
