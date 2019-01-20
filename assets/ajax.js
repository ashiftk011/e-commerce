
function fetchByAjax(serviceUrl, successhandler, failurehandler) {
    
	$.ajax({
		type: "get",
		url: serviceUrl,
		cache: false,
		//data: params,
		success: function (response) {
			successhandler(response);
		},
		error: function () {
			failurehandler();
		}
	});
}

function postAjax(serviceUrl, successhandler, failurehandler, params) {
	var data = JSON.parse(params);
	$.ajax({
		type: "post",
		url: serviceUrl,
		data: data,
		cache: false,
		success: function () {
			successhandler();
		},
		error: function () {
			failurehandler();
		}
	})
}

function fetchFragment(fragmentUrl, divname) {
	console.log('divname ' + divname);
	var contentId = "#" + divname;
	$.ajax({
		type: "get",
		url: fragmentUrl,
		cache: false,
		dataType: "html",
		success: function (fragment) {
			var className = $(contentId).attr('class');
			if ("appendresponse" == className) {
				$(contentId).append(fragment);
			} else {
				$(contentId).empty();
				$(contentId).html(fragment);
			}

		},
		error: function () {
		}
	});
}