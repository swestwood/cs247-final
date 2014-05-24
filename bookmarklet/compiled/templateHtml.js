// Generated by CoffeeScript 1.6.3
(function() {
  "This is a hack to avoid having to manually pre-compile the Handlebars templates.";
  var name, templateStr, _ref,
    _this = this;

  window.buildTemplates = function() {
    var handlebarsElems, messageFeedElem, recordMessageArea, recordMessageControls, setGroupAndUserArea, sidenoteAppContent, videoElement, videoMessageElem;
    sidenoteAppContent = "\n<div class=\"sidenote-metadata-wrapper\">\n    <div class=\"user-name-wrapper\">\n        <span class=\"user-name\">(unknown)</span>,\n    </div>\n    <div class=\"group-name-wrapper\">\n        you're in <span class=\"group-name\">(none)</span>.\n    </div>\n    <div class=\"metadata-problem-instructions\">\n    <span class=\"change-user-group\">change</span>\n    </div>\n</div>\n\n\n<div class=\"record-message-wrapper\">\n</div>\n\n<div class=\"lower-section\">\n\n  <div class=\"tab-button-area\">\n    <button class=\"message-show-button active-content-btn\">See Messages</button>\n    <button class=\"feed-show-button\" >See Group Activity</button>\n  </div>\n\n  <div class=\"lower-section-content\">\n    <div class=\"messages-area-wrapper\">\n        <div class=\"messages-area\">\n          {{!-- {{ <div class=\"messages-area-title\">Messages</div>}} --}}\n            <div class=\"message-container-outer\">\n              <div class=\"message-container-inner\">\n                <div id=\"messages-container\">\n                  <div class=\"loading-spinner-wrapper\">\n                    <i class=\"loading-spinner fa fa-spinner fa-spin fa-3x\"></i>\n                    <div class=\"waiting-intertubes\">Waiting on the intertubes for messages,\n                      <br />or for you to post the first message!\n                      <br /><small><strong>(Must use <a href=\"http://www.mozilla.org/en-US/firefox/new/\">Firefox</a> for video support!)</strong></small>\n                    </div>\n                  </div>\n                </div>\n              </div>\n            </div>\n        </div>\n    </div>\n\n\n    <div class=\"group-feed-wrapper\" style=\"display:none\">\n        <div class=\"group-feed-area\">\n          {{!-- {{               <div class=\"group-feed-area-title\">Group Activity</div>}} --}}\n            <div class=\"group-feed-container\">\n              <div class=\"loading-spinner-wrapper\">\n                <i class=\"loading-spinner fa fa-spinner fa-spin fa-3x\"></i>\n                <div class=\"waiting-intertubes\">Waiting on the intertubes for messages, <br /> or for you to post the first message!</div>\n              </div>\n            </div>\n        </div>\n    </div>\n\n  </div>\n</div>";
    videoElement = "<video class=\"{{videoElemClass}}\" controls=\"true\" width=200><source src=\"{{videoUrl}}\" type=\"video/webm\"></video>";
    videoMessageElem = " <div class=\"vid-message-wrapper\">\n   <div class=\"vid-rerender-wrapper\">\n   <div class=\"vid-message-info\">\n     <div class=\"vid-message-user\">{{videoUser}}</div>\n     <div class=\"vid-message-timestamp {{messageTimestampClass}}\">{{time}}</div>\n   </div>\n   <div class=\"vid_wrapper  {{videoWrapperClass}}\" style=\"min-height:145px\">\n\n   </div>\n </div>";
    setGroupAndUserArea = "<div class=\"set-group-and-user\">\n  <div><input type=\"text\" class=\"user-name-input\" placeholder=\"Name\"></div>\n  <div><input type=\"text\" class=\"group-name-input\" placeholder=\"Group\"></div>\n  <p>You'll share video messages within your group.</p>\n  <button class=\"done-inputting-info\">Done</button>\n  <div>Try the group name <strong>CS247</strong>, <br /> or come up with a new name and tell your friends!</div>\n  <div class=\"input-info-error\"> </div>\n</div\n\n";
    messageFeedElem = "<div class=\"message-feed-elem\">\n  <div class=\"feed-timestamp {{feedtimeClass}}\">{{time}}</div>\n  {{user}} posted on <a href=\"{{rawUrl}}\" target=\"_blank\">{{documentTitle}}</a>\n</div>";
    recordMessageArea = "<div class=\"record-message-area\">\n    <div class=\"record-message-container\">\n        <button class=\"record-button\">Record a message</button>\n        <div class=\"webcam_stream_container\">\n          <div id=\"webcam_stream\">\n              <div id=\"sample-user-container\">\n                <div id=\"sharing-video-help\" style=\"display:none\">\n                    <div class=\"sample-user place-user\">\n                        <img class=\"allow\" src=\"../bookmarklet/library/allow-me.png\" alt=\"allow me\" width=\"240\" \>\n                    </div>\n                    <div>\n                      <em>Please enable your webcam.\n                      <span class=\"stop-asking-video-button\">(leave?)</span>\n                      </em>\n                    </div>\n                </div>\n              </div>\n          </div>\n        </div>\n        <div class=\"record-controls-wrapper\"></div>\n    </div>\n</div>";
    recordMessageControls = "<div class=\"record-message-controls-container\">\n  <button class=\"record-start-button\">Start (max 30 seconds)</button>\n  <button class=\"record-leave-button\">Leave</button>\n  <button class=\"record-stop-button\">Done, post!</button>\n  <button class=\"record-bail-button\">Oops, discard.</button>\n  <span class=\"record-overtime-error-message\"></span>\n</div>";
    handlebarsElems = {
      "sidenoteAppContent": sidenoteAppContent,
      "setGroupAndUserArea": setGroupAndUserArea,
      "recordMessageArea": recordMessageArea,
      "recordMessageControls": recordMessageControls,
      "messageFeedElem": messageFeedElem,
      "videoMessageElem": videoMessageElem,
      "videoElement": videoElement
    };
    return handlebarsElems;
  };

  window.Templates = {};

  _ref = window.buildTemplates();
  for (name in _ref) {
    templateStr = _ref[name];
    window.Templates[name] = Handlebars.compile(templateStr);
  }

}).call(this);
