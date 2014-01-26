#GhostHunter

A Ghost blog search engine

==============

GhostHunter allows any theme developer to add search capabilities right in their blog without having to resort to any third-party solutions. 

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
    
