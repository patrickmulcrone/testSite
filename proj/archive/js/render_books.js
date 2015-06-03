var cache = {};                                   //cache is available everywhere
var render = function(book, container, extraClass) {
    // var id = book.id;
    // cache[id] = book;
    var html =
        '<div class="col-xs-12 col-sm-6 col-md-3 tile clearfix">' +
        '<a href="#" class="thumbnail' + (extraClass ? " " + extraClass : "") + '">' +
        '<img src="'+book.volumeInfo.imageLinks.smallThumbnail+'" alt="..." style="height: 130px; width: auto; overflow: hidden;">' +
        '<p class="text-center title" style="font-size:10px; white-space: nowrap; overflow:hidden;"><strong>' +book.volumeInfo.title + '</strong></p>' +
        '<p class="text-center authors"style="font-size:10px; white-space: nowrap; overflow:hidden;">' + book.volumeInfo.authors[0] + '</p>' +
        '</a>' +
        '</div>';

    $(html)
        .data("book", book)
        .appendTo(container);

}
var renderAll = function(books, container, extraClass) {                      //calling a method
    $(books).each(function (i, item) {   //grab items, take each one and do something
        render(item, container, extraClass);
    });
    $(".tile").draggable({
        cursor: "move",
        revert: true,
        stack: ".tile"
    });
    console.log(cache);
    $(".tile").tooltip({
        items: ".tile",
        content: "drag & drop to a library below",
        show: null, // show immediately
        open: function (event, ui) {
            if (typeof(event.originalEvent) === "undefined") {
                return false;
            }
        }
    });
};