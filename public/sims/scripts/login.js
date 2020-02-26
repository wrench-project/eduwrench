function onSignIn(googleUser) {
  // display user name
  var profile = googleUser.getBasicProfile();
  $(".user-title").append(`${profile.getName()}`);
  // hide sign in button and show sign out button
  $(".sign-in-page")
    .removeClass("show")
    .addClass("hide");
  $(".app-select-form")
    .removeClass("hide")
    .addClass("show");
}
function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function() {
    // hide sign out button and show sign in button
    $(".app-select-form")
      .removeClass("show")
      .addClass("hide");
    $(".sign-in-page")
      .removeClass("hide")
      .addClass("show");
  });
}

// replace iframe with chosen simulator
$('.option').click(function() {
  $('#myApp').attr('src', $(this).attr('name'));
  $('#myApp').removeClass('hide').addClass('show');
  $('.option').removeClass('selected');
  $(this).toggleClass('selected');
});


