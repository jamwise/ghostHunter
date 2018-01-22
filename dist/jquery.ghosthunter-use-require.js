/**
* ghostHunter - 0.4.0
 * Copyright (C) 2014 Jamal Neufeld (jamal@i11u.me)
 * MIT Licensed
 * @license
*/
(function( $ ) {

	var lunr = require("lunr")

	//This is the main plugin definition
	$.fn.ghostHunter 	= function( options ) {

		//Here we use jQuery's extend to set default values if they weren't set by the user
		var opts 		= $.extend( {}, $.fn.ghostHunter.defaults, options );
		if( opts.results ) 
		{
			pluginMethods.init( this , opts );
			return pluginMethods;
		}
	};
	 
	// If the Ghost instance is in a subpath of the site, set subpath
    // as the path to the site with a leading slash and no trailing slash
    // (i.e. "/path/to/instance").
	$.fn.ghostHunter.defaults = {
		resultsData			: false,
		onPageLoad			: true,
		onKeyUp				: false,
		result_template 	: "<a href='{{link}}'><p><h2>{{title}}</h2><h4>{{prettyPubDate}}</h4></p></a>",
		info_template		: "<p>Number of posts found: {{amount}}</p>",
		displaySearchInfo	: true,
		zeroResultsInfo		: true,
		before				: false,
		onComplete			: false,
		includepages		: false,
		filterfields		: false,
        subpath				: "",
        item_preprocessor	: false,
        indexing_start		: false,
        indexing_end		: false
	};
	var prettyDate = function(date) {
		var d = new Date(date);
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			return d.getDate() + ' ' + monthNames[d.getMonth()] + ' ' + d.getFullYear();
	};

    var getSubpathKey = function(str) {
        return str.replace(/^\//, "").replace(/\//g, "-")
    }
    
    var grabAndIndex = function(){
        if (this.indexing_start) {
            this.indexing_start();
        }
        this.blogData = {};
        this.latestPost = 0;
		var params = {
            limit: "all",
            include: "tags",
            formats: ["plaintext"]
        };
		if  ( this.includepages ){
			params.filter="(page:true,page:false)";
		}
        var me = this;
        $.get(ghost.url.api('posts',params)).done(function(data){
            var idxSrc = data.posts;
            console.log("ghostHunter: indexing all posts")
			me.index = lunr(function () {
				this.field('title', {boost: 10})
                this.field('description')
				this.field('plaintext', {boost: 5})
				this.field('pubDate')
				this.field('tag')
				this.ref('id')
                idxSrc.forEach(function (arrayItem) {
                    // Track the latest value of updated_at,  to stash in localStorage
                    var itemDate = new Date(arrayItem.updated_at).getTime();
                    var recordedDate = new Date(me.latestPost).getTime();
                    if (itemDate > recordedDate) {
                        me.latestPost = arrayItem.updated_at;
                    }
                    var tag_arr = arrayItem.tags.map(function(v) {
				        return v.name; // `tag` object has an `name` property which is the value of tag. If you also want other info, check API and get that property
				    })
				    if(arrayItem.meta_description == null) { arrayItem.meta_description = '' };
				    var category = tag_arr.join(", ");
				    if (category.length < 1){
				        category = "undefined";
				    }
                    var parsedData 	= {
					    id 			: String(arrayItem.id),
					    title 		: String(arrayItem.title),
					    description	: String(arrayItem.meta_description),
					    plaintext 	: String(arrayItem.plaintext),
					    pubDate 	: String(arrayItem.published_at),
					    tag 		: category
				    }
				    this.add(parsedData)
                    var localUrl = me.subpath + arrayItem.url
				    me.blogData[arrayItem.id] = {
                        title: arrayItem.title,
                        description: arrayItem.meta_description,
                        pubDate: prettyDate(parsedData.pubDate),
                        link: localUrl,
                        tags: tag_arr
                    };
                    // If there is a metadata "pre"-processor for the item, run it here.
                    if (me.item_preprocessor) {
                        Object.assign(me.blogData[arrayItem.id], me.item_preprocessor(arrayItem));
                    }
                }, this);
                if (me.indexing_end) {
                    me.indexing_end();
                }
            });
            try {
                var subpathKey = getSubpathKey(me.subpath);
                localStorage.setItem(("ghost_" + subpathKey + "_lunrIndex"), JSON.stringify(me.index));
                localStorage.setItem(("ghost_" + subpathKey + "_blogData"), JSON.stringify(me.blogData));
                localStorage.setItem(("ghost_" + subpathKey + "_latestPost"), me.latestPost);
            } catch (e) {
                console.warn("ghostHunter: save to localStorage failed: " + e);
            }
            me.isInit = true;
        });
    }

	var pluginMethods	= {

		isInit			: false,

		init			: function( target , opts ){
			var that = this;
            Object.assign(this, opts);
            
			if ( opts.onPageLoad ) {
				function miam () {
					that.loadAPI();
				}
				window.setTimeout(miam, 1);
			} else {
				target.focus(function(){
					that.loadAPI();
				});
			}

			target.closest("form").submit(function(e){
				e.preventDefault();
				that.find(target.val());
			});

			if( opts.onKeyUp ) {
				target.keyup(function() {
					that.find(target.val());
				});

			}

		},

		loadAPI			: function(){
            
			if(!this.isInit) {
                // If isInit is falsy, check for data in localStore,
                // parse into memory, and declare isInit to be true.
                try {
                    var subpathKey = getSubpathKey(this.subpath);
                    this.index = localStorage.getItem(("ghost_" + subpathKey + "_lunrIndex"));
                    this.blogData = localStorage.getItem(("ghost_" + subpathKey + "_blogData"));
                    this.latestPost = localStorage.getItem(("ghost_" + subpathKey + "_latestPost"));
                    if (this.latestPost && this.index && this.blogData) {
                        this.latestPost = this.latestPost;
                        this.index = lunr.Index.load(JSON.parse(this.index));
                        this.blogData = JSON.parse(this.blogData);
                        this.isInit = true;
                    }
                } catch (e){
                    console.warn("ghostHunter: retrieve from localStorage failed: " + e);
                }
            }
            if (this.isInit) {
                // Check if there are new or edited posts
                var params = {
                    limit: "all",
                    filter: "updated_at:>\'" + this.latestPost + "\'",
                    fields: "id"
                };
                var me = this;
                $.get(ghost.url.api('posts', params)).done(function(data){
                    if (data.posts.length > 0) {
                        grabAndIndex.call(me);
                    }
                });
            } else {
                // isInit is still false.
                grabAndIndex.call(this)
            }
		},

		find 		 	: function(value){
			var searchResult 	= this.index.search(value);
			var results 		= $(this.results);
			var resultsData 	= [];
			results.empty();

			if(this.before) {
				this.before();
			};

			if(this.zeroResultsInfo || searchResult.length > 0)
			{
				if(this.displaySearchInfo) results.append(this.format(this.info_template,{"amount":searchResult.length}));
			}

			for (var i = 0; i < searchResult.length; i++)
			{
				var lunrref		= searchResult[i].ref;
				var postData  	= this.blogData[lunrref];
                if (postData) {
				    results.append(this.format(this.result_template,postData));
				    resultsData.push(postData);
                } else {
                    console.warn("ghostHunter: index/data mismatch. Ouch.");
                }
			}

			if(this.onComplete) {
				this.onComplete(resultsData);
			};
		},

		clear 			: function(){
			$(this.results).empty();
			this.target.val("");
		},

		format 			: function (t, d) {
			return t.replace(/{{([^{}]*)}}/g, function (a, b) {
				var r = d[b];
				return typeof r === 'string' || typeof r === 'number' ? r : a;
			});
		}
	}

})( jQuery );
