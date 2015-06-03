$(document).ready(function() {

    var container = $('#bin');

    $('.collections button').on('click', function(){
        var collection = $(this).data('collection');
        var books = getBooks(collection);

        container.empty();

        renderAll(books, container, collection);
    });

    var dropHandler = function (event, ui) {
        var $this = $(this);
        var thumb = ui.draggable.find("a.thumbnail");
        thumb.removeClass("danger").removeClass("primary").removeClass("warning").removeClass("success");
        if (! $this.hasClass("btn")) {
            $this = $this.parents(".btn");
        };

        /* Need JSON object associated with each tile to store in local storage */
        var collection = null;
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

        var collection = $this.data('collection');
        setBook(ui.draggable.data('book'), collection);
    }
    dragOptions = {
        cursor: "move",
        revert: true,
        stack: ".tile"
    };
    $(".tile").draggable(dragOptions);
    $(".row button, .row button div.collectionIcon, .row button p.collectionText, .row button img").droppable({
        accept: ".tile",
        tolerance: "pointer",
        drop: dropHandler
    });
});

function getBooks(collection) {
    var books = getItem(collection) || {};
    var result = [];
    for (var id in books) {         //iterate through an object
       result.push(books[id]);
    }
    return result;

}

function setBook(book, collection) {
    var cached = getItem(book.id);
    if(!cached) setItem(book.id, book);

    if(collection) {
        var group = getItem(collection);
        if(!group) group = {};
        group[book.id] = book; // only add new books.
        setItem(collection, group);
    }
}


function setItem(id, data) {
    localStorage.setItem(id, JSON.stringify(data));
}

function getItem(id) {
    var data = localStorage.getItem(id);
    if(!data) return null;
    try {
        data = JSON.parse(data)
    } catch(e) {
        data = null;
    }
    return data;
}





 
