![Version](https://img.shields.io/badge/Version-0.3.5-blue.svg)
![MinGhostVersion](https://img.shields.io/badge/Min%20Ghost%20v.-%3E%3D%200.7.x-red.svg)

**This version of GhostHunter uses the Ghost API. If you need the RSS version you can use [this](https://github.com/jamalneufeld/ghostHunter/commit/2e721620868d127e9e688145fabcf5f86249d11b) commit, or @lizhuoli1126's [fork](https://github.com/dreampiggy/ghostHunter)**

**If performance is an issue, you should probably remove the "markdown" field from the index.**

#Updated
- Added the option to search through static pages.
- Added onPageLoad option to improve onKeyUp option thanks to @cjsheets.

#ToDo
~~- Restrict the number of fields being queried from the API.~~

[It is currently not possible to limit the number of fields queried and include tags at the same time.](https://github.com/TryGhost/Ghost/issues/5615)
The performance gain associated with the field filtering could be attained by using a WebWorker.
The branch "filterfields" will as such be put on hold for now.

- Use a WebWorker to build the index as discussed in issue [#21](https://github.com/jamalneufeld/ghostHunter/issues/21)
- In the distant future, simplify the way options are set to allow end-users to fine-tune their search experience.

#GhostHunter
A Ghost blog search engine

==============

GhostHunter allows any theme developer to add search capabilities right in their blog without having to resort to any third-party solutions. 

GhostHunter has at its core [lunr.js](http://lunrjs.com). And thanks to this powerful search engine, GhostHunter provides full text searching.

original developer : jamal@i11u.me

##Usage

After including jQuery, include ghostHunter:

````html
    <script src="js/jquery.ghostHunter.min.js"></script>
````

In your theme you'll need an `<input>` for the search query, the input should be in a `<form>` and you can use the form's submit functionality to call the search. This will work whether you have a standard submit button or if you use submit() in javascript.
````html
    <form>
      <input id="search-field" />
      <input type="submit" value="search">
    </form>
````
You'll also need an area for the search results to show up:
````html
    <section id="results"></section>
````
Now we can turn on the plugin, and that's all there is to it:
````js
    $("#search-field").ghostHunter({
      results   : "#results"
    });
````
##How it works

GhostHunter will attach itself to your search input field and wait for it to be focused on unless onPageLoad is set to "true". Once focus has gone to the field, the engine quickly gets to work building an index of your ghost posts that can easily be searched. When your visitor submits the form, GhostHunter will use either a default template or one provided by you to fill in your results element.

##Advanced features

GhostHunter can be customized to a certain extent using very simple templating. 


###Include static pages in the search

You can include static pages in your search. By default, this is set to FALSE.

````js
	$("#search-field").ghostHunter({
		results   		: "#results",
		includepages 	: true
    });
````


###Having search results appear on key up

You can have the search results appear "as you type". Simply pass the onKeyUp parameter as true
````js
	$("#search-field").ghostHunter({
		results   		: "#results",
		onKeyUp 		: true
    });
````
###Preparing the search results with an API call on page-load

You can have the api called when the page loads if the field is automatically in focus. Pass the onPageLoad parameter as true.
For big blogs, this option should be set to True when using onKeyUp. This will increase the loading time of your blog page but will prevent excessive loading times when starting to type a request.
````js
	$("#search-field").ghostHunter({
		results   		: "#results",
		onPageLoad 		: true
    });
````
###Adding callbacks

You can have Ghost Hunter call your callback function at two points. The first is right before it renders the information onto the page using the "before" option:
````js
	$("#search-field").ghostHunter({
		results   		: "#results",
		before 			: function(){
			alert("results are about to be rendered");
		}
    });
````
The other callback is "onComplete" and gets called when the results have been rendered. It also provides an array of all the results:
````js
	$("#search-field").ghostHunter({
		results   		: "#results",
		onComplete		: function( results ){
			console.log( results );
			alert("results have been rendered");
		}
    });
````

###Clearing the results

You can use ghostHunter to clear the results of your query. ghostHunter will return an object relating to your search field and you can use that object to clear results.
````js
	var searchField = 	$("#search-field").ghostHunter({
							results   		: "#results",
							onKeyUp 		: true
					    });
````
Now that the object is available to your code you can call it any time to clear your results:
````js
	searchField.clear();
````
###Hiding the search info

If you don't want to show the search info at all you can pass this option
````js
	$("#search-field").ghostHunter({
		results   			: "#results",
		displaySearchInfo 	: false
    });
````
###Hiding the search info when the result is zero

If you don't want to show the search info when the results are zero you can pass this option
````js
	$("#search-field").ghostHunter({
		results   			: "#results",
		zeroResultsInfo 	: false
    });
````
###Customizing the html template

The **result template** has access to these variables: title, description, link, pubDate.

If you'd like to create your own you can use double curly brackets and pass the "results_template" option:
````js
	$("#search-field").ghostHunter({
		results   		: "#results",
		result_template : "<a href='{{link}}'><p><h2>{{title}}</h2><h4>{{pubDate}}</h4>{{description}}</p></a>"
    });
````
The **info template** has one variable: amount.

If you would like to modify the wording at the top, or have it say nothing you'll need to pass in the "info_template":
````js
	$("#search-field").ghostHunter({
		results   		: "#results",
		info_template	: "<p>Number of posts found: {{amount}}</p>"
    });
````
And of course, both can be included together:
````js
	$("#search-field").ghostHunter({
		results   		: "#results",
		info_template	: "<p>Number of posts found: {{amount}}</p>",
		result_template : "<a href='{{link}}'><p><h2>{{title}}</h2><h4>{{pubDate}}</h4>{{description}}</p></a>"
    });
````
