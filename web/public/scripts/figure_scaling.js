// Script to make SVG figures scale nicely to any screen size
// This script must load after all the figures have been loaded
// onto the page.
window.onload = function() {
  // get all the figure objects on the page
  var figures = document.querySelectorAll(".figure");

  // for each figure, set the width to be a percentage of
  // the parent container
  figures.forEach(function(figure) {
    let parent_width = figure.parentNode.clientWidth;

    let figure_width = figure.clientWidth;
    let figure_height = figure.clientHeight;

    figure.style.width = (100 * (figure_width / parent_width)).toString() + "%";

    figure.setAttribute("viewBox", "-0.5 -0.5 " + figure_width.toString() + " " + figure_height.toString());
  });
}
