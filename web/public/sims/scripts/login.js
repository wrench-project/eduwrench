let auth2; // The Sign-In object.
let googleUser; // The current user.

function signOut() {
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        // hide sign out button and show sign in button
        $(".signOutBut")
            .removeClass("show")
            .addClass("hide");
        $(".sign-in-page")
            .removeClass("hide")
            .addClass("show");
        $('.myAppFrame').removeClass('show').addClass('hide');
        // clear username
        $('.user-title').html('');
        $('.signInText').removeClass('hide').addClass('show');
    });
}


/**
 * Calls startAuth after Sign in V2 finishes setting up.
 */
function onStart() {
    gapi.load('auth2', initSigninV2);
}


/**
 * Initializes Signin v2 and sets up listeners.
 */
let initSigninV2 = function () {
    auth2 = gapi.auth2.init();

    // Listen for sign-in state changes.
    auth2.isSignedIn.listen(signinChanged);

    // Listen for changes to current user.
    auth2.currentUser.listen(userChanged);

    // Sign in the user if they are currently signed in.
    if (auth2.isSignedIn.get() == true) {
        auth2.signIn();
    }

    // Start with the current live values.
    refreshValues();
};


/**
 * Listener method for sign-out live value.
 *
 * @param {boolean} val the updated signed out state.
 */
let signinChanged = function (val) {
    if (val) { // user signed in
        let profile = googleUser.getBasicProfile();
        $(".user-title").html('');
        $(".user-given-name").html('');
        $(".user-email").html('');
        $(".user-image").attr("src", `${profile.getImageUrl()}`);
        $(".user-given-name").append(`<b>${profile.getGivenName()}</b>`);
        $(".user-title").append(`<b>${profile.getName()}</b>`);
        $(".user-email").append(`<b>${profile.getEmail()}</b>`);
        // hide sign in button and show sign out button
        $(".sign-in-page")
            .removeClass("show")
            .addClass("hide");
        $(".sing-out-page")
            .removeClass("hide")
            .addClass("show");
        $('.myAppFrame').removeClass('hide').addClass('show');
        $('.signInText').removeClass('show').addClass('hide');
        // store user in session
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem("userName", `${profile.getName()}`);
            localStorage.setItem("email", `${profile.getEmail()}`);
        } else {
            // Sorry! No Web Storage support..
            localStorage.setItem("userName", null);
            localStorage.setItem("email", null);
        }
    } else { // user signed out
        $(".sing-out-page")
            .removeClass("show")
            .addClass("hide");
        $(".sign-in-page")
            .removeClass("hide")
            .addClass("show");
        $('.myAppFrame').removeClass('show').addClass('hide');
    }
};


/**
 * Listener method for when the user changes.
 *
 * @param {GoogleUser} user the updated user.
 */
let userChanged = function (user) {
    // console.log('User now: ', user);
    googleUser = user;
    updateGoogleUser();
};


/**
 * Updates the properties in the Google User table using the current user.
 */
let updateGoogleUser = function () {
    if (googleUser.uc) {
    } else {
        $('.myAppFrame').removeClass('show').addClass('hide');
    }
};


/**
 * Retrieves the current user and signed in states from the GoogleAuth
 * object.
 */
let refreshValues = function () {
    if (auth2) {
        googleUser = auth2.currentUser.get();
        updateGoogleUser();
    }
}
