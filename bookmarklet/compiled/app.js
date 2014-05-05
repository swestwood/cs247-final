// Generated by CoffeeScript 1.6.3
(function() {
  var App,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  console.log("app loaded");

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  App = (function() {
    function App(elem) {
      this.elem = elem;
      this.init = __bind(this.init, this);
      this.setupInitialUI = __bind(this.setupInitialUI, this);
      this.setupSidenoteMetadata = __bind(this.setupSidenoteMetadata, this);
      this.userName = "unknown";
      this.groupName = "unknown";
      this.setupSidenoteMetadata();
      this.setupInitialUI();
      this.fbInteractor = new FirebaseInteractor(this.groupName, this.rawUrl);
      this.fbInteractor.init();
      this.messageRecorder = new MessageRecorder($('.record-message-wrapper'), this.fbInteractor, this.userName, this.rawUrl);
      this.messageList = new MessageList($('.messages-area-wrapper'), this.fbInteractor);
      this.groupFeed = new GroupFeed($('.group-feed-wrapper'), this.fbInteractor);
    }

    "Grab Sidenote data from the site page and cookies.";

    App.prototype.setupSidenoteMetadata = function() {
      this.urlId = null;
      this.pageId = window.location.toString().split("?")[1].split("=")[1];
      console.log(window.location.toString());
      this.rawUrl = document.referrer;
      console.log("Raw URL: " + this.rawUrl);
      console.log("PAGE ID: " + this.pageId);
      this.groupName = "testergroup";
      this.userName = "sophia";
      return console.log("COOKIE: " + document.cookie);
    };

    App.prototype.setupInitialUI = function() {
      this.elem.find(".group-name").html(this.groupName);
      this.elem.find(".user-name").html(this.userName);
      return $('#welcome').addClass('animated slideInDown');
    };

    App.prototype.init = function() {};

    return App;

  })();

  window.GroupFeed = (function() {
    function GroupFeed(elem, fbInteractor) {
      var _this = this;
      this.elem = elem;
      this.fbInteractor = fbInteractor;
      this.addFeedElem = __bind(this.addFeedElem, this);
      this.messageFeed = this.elem.find(".group-feed-container");
      this.fbInteractor.fb_instance_stream.on("child_added", function(snapshot) {
        if (snapshot && snapshot.val()) {
          return _this.addFeedElem(snapshot.val());
        }
      });
    }

    GroupFeed.prototype.addFeedElem = function(data) {
      var context;
      context = {
        user: data.user,
        rawUrl: data.rawUrl
      };
      return this.messageFeed.prepend(Templates['messageFeedElem'](context));
    };

    return GroupFeed;

  })();

  window.MessageList = (function() {
    function MessageList(elem, fbInteractor) {
      var _this = this;
      this.elem = elem;
      this.fbInteractor = fbInteractor;
      this.addMessage = __bind(this.addMessage, this);
      this.messageList = this.elem.find("#messages-container");
      this.fbInteractor.fb_page_videos.on("child_added", function(snapshot) {
        if (snapshot && snapshot.val()) {
          return _this.addMessage(snapshot.val());
        }
      });
    }

    MessageList.prototype.addMessage = function(data) {
      var source, video, _ref;
      _ref = VideoDisplay.createVideoElem(data.videoBlob), source = _ref[0], video = _ref[1];
      video.appendChild(source);
      this.messageList.append("<h4>" + data.user + "</h4>");
      return document.getElementById("messages-container").appendChild(video);
    };

    return MessageList;

  })();

  window.MessageRecorder = (function() {
    function MessageRecorder(elem, fbInteractor, userName, rawUrl) {
      this.elem = elem;
      this.fbInteractor = fbInteractor;
      this.userName = userName;
      this.rawUrl = rawUrl;
      this.videoReadyCallback = __bind(this.videoReadyCallback, this);
      this.respondRecordingError = __bind(this.respondRecordingError, this);
      this.showRecordingControls = __bind(this.showRecordingControls, this);
      this.respondRecordClick = __bind(this.respondRecordClick, this);
      this.setInitialState = __bind(this.setInitialState, this);
      this.setInitialState();
    }

    MessageRecorder.prototype.setInitialState = function() {
      this.elem.html(Templates["recordMessageArea"]());
      this.recordButton = $(this.elem.find(".record-button"));
      this.webcam_stream_container = $(this.elem.find('.webcam_stream_container'));
      this.videoRecorder = new VideoRecorder();
      return this.recordButton.click(this.respondRecordClick);
    };

    "Launches asking permission from the webcam to record a message. Only needs to happen once.";

    MessageRecorder.prototype.respondRecordClick = function(evt) {
      this.recordButton.hide();
      if (!this.videoRecorder.webcamConnected) {
        return this.videoRecorder.connectWebcam(this.showRecordingControls, this.respondRecordingError);
      } else {
        return console.log("webcam already connected");
      }
    };

    MessageRecorder.prototype.showRecordingControls = function(videoStream) {
      return this.recorderControls = new MessageRecorderControls($(this.elem.find(".record-controls-wrapper")), this.videoRecorder, videoStream, this.videoReadyCallback);
    };

    MessageRecorder.prototype.respondRecordingError = function() {
      return this.webcam_stream_container.html("<p class=\"recording-error-message\">Failed to access your webcam and microphone.\nUpdate your video settings in the URL bar then refresh the page and try again.</p>");
    };

    MessageRecorder.prototype.videoReadyCallback = function(videoBlob) {
      console.log("video ready to show");
      this.fbInteractor.fb_page_videos.push({
        videoBlob: videoBlob,
        user: this.userName
      });
      this.fbInteractor.fb_instance_stream.push({
        rawUrl: this.rawUrl,
        user: this.userName
      });
      return this.setInitialState();
    };

    return MessageRecorder;

  })();

  window.MessageRecorderControls = (function() {
    function MessageRecorderControls(elem, videoRecorder, videoStream, videoReadyCallback) {
      this.elem = elem;
      this.videoRecorder = videoRecorder;
      this.videoStream = videoStream;
      this.videoReadyCallback = videoReadyCallback;
      this.bailRecordingMessage = __bind(this.bailRecordingMessage, this);
      this.stopRecordingMessage = __bind(this.stopRecordingMessage, this);
      this.recordingEndedCallback = __bind(this.recordingEndedCallback, this);
      this.startRecordingMessage = __bind(this.startRecordingMessage, this);
      this.setButtonsReadyToStart = __bind(this.setButtonsReadyToStart, this);
      this.elem.html(Templates['recordMessageControls']());
      this.startButton = $(this.elem.find(".record-start-button"));
      this.stopButton = $(this.elem.find(".record-stop-button"));
      this.bailButton = $(this.elem.find(".record-bail-button"));
      this.errorMessage = $(this.elem.find(".record-overtime-error-message"));
      this.setButtonsReadyToStart();
      this.startButton.click(this.startRecordingMessage);
      this.stopButton.click(this.stopRecordingMessage);
      this.bailButton.click(this.bailRecordingMessage);
    }

    MessageRecorderControls.prototype.setButtonsReadyToStart = function() {
      return enableButtons([this.startButton], [this.stopButton, this.bailButton]);
    };

    MessageRecorderControls.prototype.startRecordingMessage = function() {
      this.recordingState = "started";
      this.dataState = "no-data";
      this.errorMessage.html("");
      this.videoRecorder.startRecordingMedia(this.videoStream, this.recordingEndedCallback);
      return enableButtons([this.stopButton, this.bailButton], [this.startButton]);
    };

    "Called whenever data is available. This can happen # ways:\n1. Because the user presses stop. Then, just reset the buttons and launch the video ready callback.\n2. Because the user presses bail. Then, reset the buttons and do nothing with the data.\n3. Because the user hits the max length time before pressing stop or bail. In this case, stop the video, show them a message and tell them to record again.\n4. As a result of #3, calling stop from this callback will trigger another callback, which needs to be ignored. This is the purpose of the datastate var.";

    MessageRecorderControls.prototype.recordingEndedCallback = function(videoBlob) {
      if (this.dataState === "no-data" && this.recordingState === "stopped") {
        console.log("Case one, responding to video");
        this.dataState = "data-received";
        this.setButtonsReadyToStart();
        return this.videoReadyCallback(videoBlob);
      } else if (this.dataState === "no-data" && this.recordingState === "bailed") {
        console.log("case two, bailing");
        this.dataState = "data-received";
        return this.setButtonsReadyToStart();
      } else if (this.dataState === "no-data" && this.recordingState !== "stopped") {
        this.dataState = "data-received";
        this.errorMessage.html("Uh oh, looks like you exceeded the 30-sec time limit. Try again.");
        return this.videoRecorder.stopRecordingMedia();
      } else if (this.dataState === "data-received") {
        console.log("Second callback, ignoring it safely, resetting the buttons.");
        return this.setButtonsReadyToStart();
      }
    };

    MessageRecorderControls.prototype.stopRecordingMessage = function() {
      this.recordingState = "stopped";
      return this.videoRecorder.stopRecordingMedia();
    };

    MessageRecorderControls.prototype.bailRecordingMessage = function() {
      this.recordingState = "bailed";
      return this.videoRecorder.stopRecordingMedia();
    };

    return MessageRecorderControls;

  })();

  window.FirebaseInteractor = (function() {
    "Connects to Firebase and connects to chatroom variables.";
    function FirebaseInteractor(groupName, rawUrl) {
      this.groupName = groupName;
      this.rawUrl = rawUrl;
      this.init = __bind(this.init, this);
      this.hashUrl = __bind(this.hashUrl, this);
      this.fb_instance = new Firebase("https://sidenote.firebaseio.com");
      console.log("hash url: " + this.hashUrl(this.rawUrl));
    }

    FirebaseInteractor.prototype.hashUrl = function(s) {
      console.log('hashing: ' + s);
      return s.split("").reduce(function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return Math.abs(a & a);
      }, 0);
    };

    FirebaseInteractor.prototype.init = function() {
      console.log(this.fb_instance);
      this.fb_new_chat_room = this.fb_instance.child('chatrooms').child(this.groupName);
      this.fb_instance_stream = this.fb_new_chat_room.child('stream');
      return this.fb_page_videos = this.fb_new_chat_room.child('page_videos').child(this.hashUrl(this.rawUrl));
    };

    return FirebaseInteractor;

  })();

  $(document).ready(function() {
    var app;
    app = new App($(".sidenote-container"));
    return app.init();
  });

}).call(this);