
$(document).ready(function () {

    // append items 
    $("#perfume").on("click", function (e) {
        e.preventDefault();
        var link = $(this).attr("href");
        fetchByAjax(link, successhandler, failurehandler);
    });

    $("#watch").on("click", function (e) {
        e.preventDefault();
        var link = $(this).attr("href");
        fetchByAjax(link, successhandler, failurehandler);
    });

    $("#perfumeNav").on("click", function (e) {
        e.preventDefault();
        var link = $(this).attr("href");
        fetchByAjax(link, successhandler, failurehandler);
    });

    $("#watchNav").on("click", function (e) {
        e.preventDefault();
        var link = $(this).attr("href");
        fetchByAjax(link, successhandler, failurehandler);
    });

    //data binding to mainpage.html after sucees full response in  
    function successhandler(resp) {
        var div = "<div class='row'>";
        if (resp.type == 'perfume') {
            var path = "../assets/images/perfume/";
        }
        else if (resp.type == 'watch') {
            var path = "../assets/images/watch/";
        }
        $.each(resp.data, function (i) {
            var count = 0;
            var fullPath = path + $(this)[count].imageName;
            var id = $(this)[count].imageName;
            var prize = $(this)[count].prize;
            var title = $(this)[count].title;
            div = div + "<div class='col-sm-4'><div class='thumbnail'><a href='../details' onclick='onItemClick()'> <img src=" + fullPath + '><br>';
            div = div + '<p><stron>' + title + '<strong><br>' + prize + '</strong></p></a></div></div >'
        });
        $('#content').empty();
        $('#myCarousel').slideUp(1000);
        $('#content').html(div);
    }

    //failurehandler
    function failurehandler(resp) {
        alert(resp);
    }   

});

function onItemClick() {
    e.preventDefault();
    var link = $(this).attr("href");
    alert(link);
    postAjax(link, successhandler, failurehandler, id);
}