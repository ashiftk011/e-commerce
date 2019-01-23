
// $(document).ready(function () {
// var data
//     // fetching data from db 
//     $("#perfume").on("click", function (e) {
//         e.preventDefault();
//         var link = $(this).attr("href");
//         fetchByAjax(link, successhandler, failurehandler);
//     });

//     $("#watch").on("click", function (e) {
//         e.preventDefault();
//         var link = $(this).attr("href");
//         fetchByAjax(link, successhandler, failurehandler);
//     });

//     $("#dress").on("click", function (e) {
//         e.preventDefault();
//         var link = $(this).attr("href");
//         fetchByAjax(link, successhandler, failurehandler);
//     });

//     $("#perfumeNav").on("click", function (e) {
//         e.preventDefault();
//         var link = $(this).attr("href");
//         fetchByAjax(link, successhandler, failurehandler);
//     });

//     $("#watchNav").on("click", function (e) {
//         e.preventDefault();
//         var link = $(this).attr("href");
//         fetchByAjax(link, successhandler, failurehandler);
//     });

//     $("#dressNav").on("click", function (e) {
//         e.preventDefault();
//         var link = $(this).attr("href");
//         fetchByAjax(link, successhandler, failurehandler);
//     });

//     //data binding to mainpage.html after sucees full response in  
//     function successhandler(resp) {
//         var div = "<div class='row'>";
//         $.each(resp, function (i) {
//             var count = 0;
//             var path;
//             if ($(this)[count].type == 'perfume') {
//                 path = "../assets/images/perfume/";
//             }
//             else if ($(this)[count].type == 'watch') {
//                 path = "../assets/images/watch/";
//             }
//             else if ($(this)[count].type == 'dress') {
//                 path = "../assets/images/dresses/";
//             }
//             var fullPath = path + $(this)[count].imageName;
//             var id = $(this)[count]._id;
//             var prize = $(this)[count].prize;
//             var title = $(this)[count].title;
//             div = div + "<div class='col-sm-4'><div class='thumbnail'><a href='/details/" +id + "'><img src=" + fullPath + '><br>';
//             div = div + '<p><stron>' + title + '<strong><br>' + prize + '</strong></p></a></div></div >';
//         });
//         $('#content').empty();
//         $('#myCarousel').slideUp(1000);
//         $('#content').html(div);
//     }

//     //failurehandler
//     function failurehandler(resp) {
//         alert(resp);
//     }

// });
