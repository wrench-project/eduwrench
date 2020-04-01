// search word in glossary
function searchTerm() {
  // Declare variables
  var filter, li, a, i, txtValue;
  filter = $('#searchInput').val().toUpperCase();
  li = $('#wordList').children();
  
  // display all terms in glossary if no input
  if(!$('#searchInput').val()) {
    for (i = 0; i < li.length; i++) {
      li[i].style.display = "";
    }
  }
  else {
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("h4")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }
}

// toggle word definition
$(document).ready ( function () {
  $(document).on ("click", ".accordion-head", function () {
    let term = $(event.target);
    let def = term.parent().next('.accordion-body');
    // expand definition
    if (def.hasClass('accordion-body-hide')) {
      def.slideUp(300);
      term.children(".plusminus").text('-');
      def.removeClass('accordion-body-hide').addClass('accordion-body-show');
    } else { // hide definition
      def.slideDown(300);
      term.children(".plusminus").text('+');
      def.removeClass('accordion-body-show').addClass('accordion-body-hide');
    }
  });
});