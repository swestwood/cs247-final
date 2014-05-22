(function() {
// we don't really need jquery, but adding it for speed.
// we can take it out later
// var app_unique_page_id = window.location.host + Math.random().toString(36).slice(2);
// console.log(app_unique_page_id)
app_jquery_loading_script = document.createElement('script')
app_jquery_loading_script.src = "//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js";


app_jquery_loading_script.onload = function() {

    var frame = $("<iframe id='ssidenote-iframe'/>");
    frame.attr("src", "//sidenote.herokuapp.com/bookmarklet/app.html");
    // frame.attr("src", "//localhost:5000/bookmarklet/app.html");

    var frameWidth = "400px";

    frame.css({
        margin: "0px",
        padding: "0px",
        position: "fixed",
        top: 0,
        bottom: 0,
        right: 0,
        resize: "none",
        border-left-style: solid,
        border-left-width: 1px,
        border-left-color: black,
        zIndex: 2147483647,
        width: frameWidth,
        height: "100%"
    });
    $("html").css({
        paddingRight: frameWidth,
        overflow: "scroll"
    });
    $("body").css("overflow", "scroll").after(frame);

    $(frame).load(function() {
        setTimeout(function() {
            console.log("SENDING MESSAGE");
            iframe = document.getElementById('ssidenote-iframe');
            iframe.contentWindow.postMessage(document.title, '*');
        }, 2000); /* Delay by 2 seconds to give the page a moment to register the listener
                    (this is hacky and shouldn't matter, but until we test with a slow network
                        connection it's here just in case) */

    });
    window.onbeforeunload = function() {
        // console.log("before unloading")
        // $.ajax({ /* //app-name.herokuapp.com */
        //   url: '////sidenote.herokuapp.com/delete_peer',
        //   type: "POST",
        //   data: {
        //       page_id: app_unique_page_id
        //   },
        //   async: false
        // });
    }
};
document.head.appendChild(app_jquery_loading_script);
})();
