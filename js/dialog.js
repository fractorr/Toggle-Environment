var env = null;
var domain = null;
var url = null;
var urlParts = null;
var hostParts = null;
var path = null;
var curTab = null;
var curUrl = null;
var options = null;

chrome.tabs.getSelected(null, function(tab) {
	curTab = tab;
	env = "live";
	domain = null;
	
	url = tab.url;
	curUrl = tab.url;
	urlParts = parseUri(url);
	hostParts = urlParts.host.split(".");
	path = urlParts.path;

	chrome.storage.sync.get(["domain", "environments", "structure", "addlocalhost", "localhostname", "localhostport", "localhoststructure", "topleveldomainext1", "topleveldomainnames1", "topleveldomainext2", "topleveldomainnames2", "topleveldomainext3", "topleveldomainnames3"], function(items) {
		options = items;
		
		if (isLocalhostDomain(urlParts.host)) {
			domain = getLocalhostSubdomain(urlParts.host);
			
		} else if (hostParts.length == 2) {
			domain = hostParts[0];
			
		} else if (hostParts.length == 3) {
			domain = hostParts[1];
			
		} else if (hostParts.length == 4) {
			domain = hostParts[0];
			env = hostParts[1];
			
		}

		if (options.domain 			!= undefined && options.domain.length 		> 0 && 
			options.environments 	!= undefined && options.environments.length	> 0 && 
			options.structure 		!= undefined && options.structure.length	> 0 &&
			options.addlocalhost	!= undefined && options.addlocalhost.length	> 0 ) {
			
			var isLive = true;
			var envs = options.environments.split(",");
			
			for (var e=0; e<envs.length; e++) {
				if (envs[e].toLowerCase().trim() != env.toLowerCase().trim()) {
					addEnviroment("submit", envs[e].trim(), "goto"+envs[e].trim(), envs[e].toLowerCase().trim());
				} else {
					isLive = false;
				}
			}
			
			if (isLocalhostDomain(urlParts.host)) {
				isLive = false;
			} else {
				if (options.addlocalhost == "yes") {
					addEnviroment("submit", "Local Host", "gotolocalhost", options.localhostname);
				}
			}
			
			if (!isLive) {
				addEnviroment("submit", "Live", "gotolive", "live");
			}
		}
		
		addEnviroment("submit", "Options", "gotooptions", "options");
	});
});


function addEnviroment(type, value, name, env) {
    // Create an input type dynamically.   
    var element = document.createElement("input");
    
    // Assign different attributes to the element. 
    element.type = type;
    element.value = value;
    element.name = name;
    element.id = name;
    element.onclick = function(evt) { 
    	evt.preventDefault();
    	
        chrome.runtime.getBackgroundPage(function(bgWindow) {
        	gotoEnv(env);
            window.close();
        });
    };
	
    var theForm = document.getElementById("envform");
    if (theForm) {
    	theForm.appendChild(element);
    }
}


function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;
	
	while (i--) uri[o.key[i]] = m[i] || "";
	
	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});
	
	return uri;
};


parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};


Array.prototype.removeFirst = function() {
	var tmp = this;
	var ar = [];
	
	for (var i=1; i<tmp.length; i++) {
		ar.push(tmp[i]);
	}
	
	return ar;
};


function domainListContains(domainList, domain) {
	return domainList.split(/[\r\n]/).indexOf(domain) >= 0;
}


function isLocalhostDomain(domain) {
	var parts = domain.split(".");
	var ret = false;
	
	for (var p=0; p<parts.length; p++) {
		if (parts[p] == options.localhostname) {
			ret = true;
		}
	}
	
	return ret;
};


function getLocalhostSubdomain(domain) {
	var parts = domain.split(".");
	var sub = null;
	
    if (options.localhoststructure == "subdomains") {
		for (var p=0; p<parts.length; p++) {
			if (parts[p].toLowerCase() != options.localhostname) {
				sub = parts[p];
			}
		}

	} else if (options.localhoststructure == "subdomainspost") {
		sub = domain.replace(options.localhostname, '');
		sub = sub.replace(/(^\.)|(\.$)/g, "");
		
	} else if (options.localhoststructure == "subdomainspre") {
		sub = domain.replace(options.localhostname, '');
		sub = sub.replace(/(^\.)|(\.$)/g, "");
		
	} else if (options.localhoststructure == "subdirectory") {
		var up = parseUri(curUrl);
		parts = up.path.split("/");
		
		if (parts.length) {
			for (var q=0; q<parts.length; q++) {
				if (parts[q].length && sub == null) {
					sub = parts[q];
				} 
			}
			
			urlParts.path = "/" + urlParts.path.split("/").removeFirst().removeFirst().join("/");
		}
	}
	
	return sub;
};


function gotoEnv(env) {
	if (env == "options") {
		chrome.tabs.create({'url': "html/options.html" } );
		return;
	}
	
	var domainExt = '.com';
	
	if (env == 'live') {
		if (options.topleveldomainext1.length && options.topleveldomainnames1.length && domainListContains(options.topleveldomainnames1, domain)) {
			domainExt = '.' + options.topleveldomainext1;
		}
		
		if (options.topleveldomainext2.length && options.topleveldomainnames2.length && domainListContains(options.topleveldomainnames2, domain)) {
			domainExt = '.' + options.topleveldomainext2;
		}
		
		if (options.topleveldomainext3.length && options.topleveldomainnames3.length && domainListContains(options.topleveldomainnames3, domain)) {
			domainExt = '.' + options.topleveldomainext3;
		}

		url = 'http://www.' + domain + domainExt;	
		
	} else if (env == options.localhostname) {
		switch (options.localhoststructure) {
			case "standalone":
				url = 'http://' + options.localhostname;
			break;
			
			case "subdomainspost":
				url = 'http://' + options.localhostname + '.' + domain;
			break;

			case "subdomainspre":
				url = 'http://' + domain + '.' + options.localhostname;
			break;

			case "subdirectory":
				url = 'http://' + options.localhostname + "/" + domain;
			break;
		}		
		
		if (options.localhostport != undefined && options.localhostport.length > 0) {
			url += ':' + options.localhostport;
		}
		
	} else {
		if (isLocalhostDomain(urlParts.host)) {
			if (domain != null) {
				domain = getLocalhostSubdomain(domain);
			}
		}
			
		if (options.structure == "site-env") {
			url = 'http://' + domain + '.' + env + '.' + options.domain;
			
		} else if (options.structure == "env-site") {
			url = 'http://' + env + '.' + domain + '.' + options.domain;
			
		}
	}
	
	if (urlParts.path.length) {
		url += urlParts.path;
	}

	if (urlParts.query.length) {
		url += '?' + urlParts.query;
	}

	if (urlParts.anchor.length) {
		url += '#' + urlParts.anchor;
	}
	
	chrome.tabs.update(curTab.id, {url: url});
}
