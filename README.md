cs247-final
===========

CS247, Spring 2014 project.

### Live

http://sidenote.herokuapp.com/


![Poster](http://i.imgur.com/HWV3nMe.png)


##### Notes on running the project as a developer:

Start the NodeJS server via `node server` in the cs247-final main directory.

Use in Firefox only (Version 29.0 and up, the current version as of May 2014) due to MediaRecorder in Chrome being unable to record audio with video.

Compile the Coffeescript in each folder where you change .coffee files. Running ./coffee_compile.sh will watch for changes on any Coffeescript files in that directory (not subdirectories) and compile them whenever they change. It will also spit out error messages if the compilation to Javascript fails.

Check bookmarklet.js to be sure you are loading in the frame from localhost rather than the live site (and change it back before pushing).

Be sure you are using the localhost bookmarklet. Check that your bookmarklet is running the localhost version of bookmarklet.js rather than the live version, changing dashboard/index.html if needed temporarily to install a localhost bookmarklet as well. Once you install the bookmarklet, you do not need to reinstall it after changes.

Always open Sidenote on a non-HTTPS site when running locally, such as xkcd or Wikipedia. Otherwise, the HTTPS page will refuse to load content from a non-HTTPS site and it will not work.
