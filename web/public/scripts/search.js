// search word in glossary
function searchTerm() {
  // Declare variables
  var filter, li, a, i, txtValue;
  filter = $('#searchInput').val().toUpperCase();

  
  li = $('#wordList').children();
  console.log(li);
  
  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
  // clear shown searchInputs if no input words
  if(!$('#searchInput').val()) {
    console.log("empty");
    $('#wordList').removeClass('visible').addClass('invisible');
  }
  else {
    // display lists
    $('#wordList').removeClass('invisible').addClass('visible');
  }
}