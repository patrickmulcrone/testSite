// you can override default options globally, so they apply to every .expander() call
$.expander.defaults.slicePoint = 0;

$(document).ready(function() {
  // simple example, using all default options unless overridden globally
  $('div.expander').expander();

  // *** OR ***

  // override default options (also overrides global overrides)
  $('div.expandable').expander({
    slicePoint:       0,  // default is 100
    expandPrefix:     ' ', // default is '... '
    expandText:       'read more &#8595;', // default is 'read more'
    collapseTimer:    0, // re-collapses after 5 seconds; default is 0, so no re-collapsing
    userCollapseText: 'collapse &#8593;'  // default is 'read less'
  });

});