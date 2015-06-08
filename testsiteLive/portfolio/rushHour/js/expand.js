$(document).ready(function(){
$('#homeReadMo').slideUp( );
$('a.homeReadMo').click( function(){
if( document.getElementById( 'homeReadMo' ).offsetHeight > 0 ) {
$( '#homeReadMo' ).slideUp( 'fast' );
}
else{
$( '#homeReadMo' ).slideDown( 'fast' );
}
return false;
});
});