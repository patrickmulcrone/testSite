/**
 * Created by YS.Joyce on 5/19/2015.
 */
<script>

var collection = null;
//  $('#bin').empty;
$(".bucket").click(function() {


    if ($this.hasClass("btn-danger")) {
    thumb.addClass("danger");
    collection = "keeper";    //setting up a key for each collection
    } else if ($this.hasClass("btn-primary")) {
    thumb.addClass("primary");
    collection = "surfing";
    } else if ($this.hasClass("btn-warning")) {
    thumb.addClass("warning");
    collection = "gonna";
    } else if ($this.hasClass("btn-success")) {
    thumb.addClass("success");
    collection = "maybe";
    }

    var retrieveBooks = localStorage.getItem("collection");  //make into a function in local_storage.js
    var booksOut = JSON.parse(retrieveBooks);


    // $.getJSON("https://www.googleapis.com/books/v1/volumes",{q:s})
    // .done(
    //console.log(e);
    //  e.preventDefault();

    $('body').css('background-image', 'none');

    console.log(booksOut);
    // var results = data;
    //handleResponse(results);
    for (var i = 0; i < retrieveBooks.length; i++) {
    var item = data.items[i];
    renderAll(data.items[i], "#bin")
    }


    })

</script>