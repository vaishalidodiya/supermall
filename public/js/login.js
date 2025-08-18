$("#loginForm").submit((e) => {
  e.preventDefault();

  const email = $('input[name="email"]').val().trim();
  const password = $('input[name= "password"]').val().trim();

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
    url: "/api/admin/auth",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(loginData),
    success: function (data) {
      setLocalData('token',data?.data?.token);
      $("#loginError").hide();
      setTimeout(function () {
        window.location.href = "/admin/store";
      }, 1000);
    },
    error: function (xhr) {
      let errorMsg = "Login failed. Please try again.";
      try {
        const response = JSON.parse(xhr.responseText);
        errorMsg = response.message || errorMsg;
      } catch (e) {
        console.error("Error parsing response", e);
      }
      $("#loginError").text(errorMsg).show();
    },
  });
});
