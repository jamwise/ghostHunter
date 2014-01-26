#GhostHunter

A Ghost blog search engine

==============

GhostHunter allows any theme developer to add search capabilities right in their blog without having to resort to any third-party solutions. 

GhostHunter has at its core [lunr.js](http://lunrjs.com). And thanks to this powerful search engine, GhostHunter provides full text searching.

Although GhostHunter is designed specifically for the Ghost blogging platform, it will work on any system which uses an rss feed.

##Usage

After including jQuery, include ghostHunter:

    <script src="js/jquery.ghostHunter.min.js"></script>
  
In your theme you'll need an \\<input> for the search query, the input should be in a \\<form> and you can use the form's submit functionality to call the search. This will work whether you have a standard submit button or if you use submit() in javascript.

    <form>
      <input id="search-field" />
      <input type="submit" value="search">
    </form>
    
You'll also need an area for the search results to show up:

    <section id="results"></section>
    
Now we can turn on the plugin, and that's all there is to it:

    $("#search-field").ghostHunter({
      results   : "#results"
    });
    
##How it works

GhostHunter will attach itself to your search input field and wait for it to be focused on. Once focus has gone to the field, the engine quickly gets to work building an index of your rss feed that can easily be searched. When your visitor submits the form, GhostHunter will use either a default template or one provided by you to fill in your results element.

##Advanced features
