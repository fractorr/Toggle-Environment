// Saves options to chrome.storage
function save_options() {
	var domain = document.getElementById('domain').value;
	var environments = document.getElementById('environments').value;
	var structure = document.getElementById('structure').value;
	var addlocalhost = document.getElementById('addlocalhost').value;
	var localhostname = document.getElementById('localhostname').value;
	var localhostport = document.getElementById('localhostport').value;
	var localhoststructure = document.getElementById('localhoststructure').value;
	var topleveldomainext1 = document.getElementById('topleveldomainext1').value;
	var topleveldomainnames1 = document.getElementById('topleveldomainnames1').value;
	var topleveldomainext2 = document.getElementById('topleveldomainext2').value;
	var topleveldomainnames2 = document.getElementById('topleveldomainnames2').value;
	var topleveldomainext3 = document.getElementById('topleveldomainext3').value;
	var topleveldomainnames3 = document.getElementById('topleveldomainnames3').value;
	
	chrome.storage.sync.set({
		domain : domain,
		environments: environments,
		structure: structure,
		addlocalhost: addlocalhost,
		localhostname: localhostname,
		localhostport: localhostport,
		localhoststructure: localhoststructure,
		topleveldomainext1: topleveldomainext1,
		topleveldomainnames1: topleveldomainnames1,
		topleveldomainext2: topleveldomainext2,
		topleveldomainnames2: topleveldomainnames2,
		topleveldomainext3: topleveldomainext3,
		topleveldomainnames3: topleveldomainnames3
		
	}, function() {
		$("#status").fadeIn();
		setTimeout(function() {
			$("#status").fadeOut();
		}, 1500);
	});
}

function restore_options() {
	chrome.storage.sync.get(["domain", "environments", "structure", "addlocalhost", "localhostname", "localhostport", "localhoststructure", "topleveldomainext1", "topleveldomainnames1", "topleveldomainext2", "topleveldomainnames2", "topleveldomainext3", "topleveldomainnames3"], function(items) {
		if (items.domain != undefined) {
			document.getElementById('domain').value = items.domain;
		}

		if (items.environments != undefined) {
			document.getElementById('environments').value = items.environments;
		}

		if (items.structure != undefined) {
			document.getElementById('structure').value = items.structure;
		}

		if (items.addlocalhost != undefined) {
			document.getElementById('addlocalhost').value = items.addlocalhost;
		}

		if (items.localhostname != undefined) {
			document.getElementById('localhostname').value = items.localhostname;
		}

		if (items.localhostport != undefined) {
			document.getElementById('localhostport').value = items.localhostport;
		}

		if (items.localhoststructure != undefined) {
			document.getElementById('localhoststructure').value = items.localhoststructure;
		}




		if (items.topleveldomainext1 != undefined) {
			document.getElementById('topleveldomainext1').value = items.topleveldomainext1;
		}

		if (items.topleveldomainnames1 != undefined) {
			document.getElementById('topleveldomainnames1').value = items.topleveldomainnames1;
		}

		if (items.topleveldomainext2 != undefined) {
			document.getElementById('topleveldomainext2').value = items.topleveldomainext2;
		}

		if (items.topleveldomainnames2 != undefined) {
			document.getElementById('topleveldomainnames2').value = items.topleveldomainnames2;
		}

		if (items.topleveldomainext3 != undefined) {
			document.getElementById('topleveldomainext3').value = items.topleveldomainext3;
		}

		if (items.topleveldomainnames3 != undefined) {
			document.getElementById('topleveldomainnames3').value = items.topleveldomainnames3;
		}
		
		setLocalhostField();
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);






$(document).ready(function() {
	$('#version').html(" Version: " + chrome.app.getDetails().version);

	
	$('ul.tabs li').click(function(){
		var tab_id = $(this).attr('data-tab');

		$('ul.tabs li').removeClass('current');
		$('.tab-content').removeClass('current');

		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	});

		
	$("#addlocalhost").on("change", function() {
		setLocalhostField();
	});
});


function setLocalhostField() {
	var val = $("#addlocalhost").val();
	
	if (val.toLowerCase() == "no") {
		$("#localhostname").prop('disabled', true);
		$("#localhostport").prop('disabled', true);
		$("#localhoststructure").prop('disabled', true);
	} else {
		$("#localhostname").prop('disabled', false);
		$("#localhostport").prop('disabled', false);
		$("#localhoststructure").prop('disabled', false);
	}
}
