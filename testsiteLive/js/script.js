$(document).ready(function() {
var el = document.querySelector('.header__show-all');
  el.addEventListener('click', function(){
    document.querySelector('.header').classList.toggle('header--extended');
  });

   });