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
$(".select-form").submit(event => {
  let selected = $(".custom-select option:selected").val();
  console.log(selected);
  event.preventDefault();
});