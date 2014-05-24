// Generated by CoffeeScript 1.6.3
(function() {
  var App, ENTER_KEYCODE, iframeMessageReceiver,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    _this = this;

  console.log("app loaded");

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  ENTER_KEYCODE = 13;

  App = (function() {
    function App(elem) {
      this.elem = elem;
      this.showSidenote = __bind(this.showSidenote, this);
      this.showGroupAndUserName = __bind(this.showGroupAndUserName, this);
      this.showSetGroupAndUser = __bind(this.showSetGroupAndUser, this);
      this.handleInputtedUserGroupInfo = __bind(this.handleInputtedUserGroupInfo, this);
      this.fetchGroupAndUserFromLocalStorage = __bind(this.fetchGroupAndUserFromLocalStorage, this);
      this.setupUrlInfo = __bind(this.setupUrlInfo, this);
      this.userName = "unknown";
      this.groupName = "unknown";
      this.setupUrlInfo();
      if (!this.fetchGroupAndUserFromLocalStorage()) {
        $(".sidenote-app-content").hide();
        this.showSetGroupAndUser();
      } else {
        this.showSidenote();
      }
    }

    "Grab Sidenote data from the site page and cookies.";

    App.prototype.setupUrlInfo = function() {
      this.urlId = null;
      console.log(window.location.toString());
      this.rawUrl = document.referrer;
      return console.log("Raw URL: " + this.rawUrl);
    };

    App.prototype.fetchGroupAndUserFromLocalStorage = function() {
      this.groupName = _.escape(localStorage.groupName || "");
      this.userName = _.escape(localStorage.userName || "");
      console.log("GROUP NAME: " + this.groupName);
      console.log("USER NAME: " + this.userName);
      if (_.isEmpty(this.groupName.trim()) || _.isEmpty(this.userName.trim())) {
        return false;
      }
      return true;
    };

    App.prototype.handleInputtedUserGroupInfo = function() {
      var inputtedGroup, inputtedUser;
      console.log("inputted info");
      inputtedUser = $(".user-name-input").val().trim();
      inputtedGroup = $(".group-name-input").val().trim();
      if (_.isEmpty(inputtedUser) || _.isEmpty(inputtedGroup)) {
        $(".input-info-error").html("You need to enter both a user and a group.");
        return;
      }
      localStorage.userName = _.escape(inputtedUser);
      localStorage.groupName = _.escape(inputtedGroup);
      if (!this.fetchGroupAndUserFromLocalStorage()) {
        console.error("Something went wrong with setting local storage..");
        return;
      }
      return this.showSidenote();
    };

    App.prototype.showSetGroupAndUser = function() {
      var _this = this;
      $(".sidenote-app-content").hide();
      $('.set-group-user-wrapper').html(Templates["setGroupAndUserArea"]()).show();
      $(".group-name-input").keypress(function(evt) {
        if (evt.which === ENTER_KEYCODE) {
          console.log('hand');
          _this.handleInputtedUserGroupInfo();
          return false;
        }
      });
      $(".user-name-input").keypress(function(evt) {
        if (evt.which === ENTER_KEYCODE) {
          $(".group-name-input").focus();
          return false;
        }
      });
      return $(".done-inputting-info").click(function(evt) {
        return _this.handleInputtedUserGroupInfo();
      });
    };

    App.prototype.showGroupAndUserName = function() {
      var _this = this;
      this.elem.find(".group-name").html(_.escape(this.groupName));
      this.elem.find(".user-name").html(_.escape(this.userName));
      return this.elem.find(".change-user-group").click(function(evt) {
        return _this.showSetGroupAndUser();
      });
    };

    App.prototype.showSidenote = function() {
      var _this = this;
      $(".sidenote-app-content").html(Templates["sidenoteAppContent"]());
      this.showGroupAndUserName();
      this.fbInteractor = new FirebaseInteractor(this.groupName, this.rawUrl);
      this.fbInteractor.init();
      this.messageRecorder = new MessageRecorder($('.record-message-wrapper'), this.fbInteractor, this.userName, this.rawUrl);
      this.timestampUpdater = new TimestampUpdater();
      this.messageList = new MessageList($('.messages-area-wrapper'), this.fbInteractor, this.timestampUpdater);
      this.groupFeed = new GroupFeed($('.group-feed-wrapper'), this.fbInteractor, this.timestampUpdater);
      $('.set-group-user-wrapper').hide();
      $(".sidenote-app-content").show();
      $(".message-show-button").on("click", function() {
        $('.messages-area-wrapper').show();
        $('.group-feed-wrapper').hide();
        $(".message-show-button").addClass("active-content-btn");
        return $(".feed-show-button").removeClass("active-content-btn");
      });
      return $(".feed-show-button").on("click", function() {
        $('.messages-area-wrapper').hide();
        $('.group-feed-wrapper').show();
        $(".message-show-button").removeClass("active-content-btn");
        return $(".feed-show-button").addClass("active-content-btn");
      });
    };

    return App;

  })();

  window.GroupFeed = (function() {
    function GroupFeed(elem, fbInteractor, timestampUpdater) {
      var _this = this;
      this.elem = elem;
      this.fbInteractor = fbInteractor;
      this.timestampUpdater = timestampUpdater;
      this.addFeedElem = __bind(this.addFeedElem, this);
      this.messageFeed = this.elem.find(".group-feed-container");
      this.fbInteractor.fb_instance_stream.on("child_added", function(snapshot) {
        if (snapshot && snapshot.val()) {
          return _this.addFeedElem(snapshot.val());
        }
      });
    }

    GroupFeed.prototype.addFeedElem = function(data) {
      var context, feedTimestampClass, titleLen, titleToDisplay;
      if (this.elem.find(".loading-spinner")) {
        $(this.elem.find(".loading-spinner-wrapper")).hide();
      }
      feedTimestampClass = "feedtime-" + Math.floor(Math.random() * 100000000);
      titleToDisplay = data.rawUrl;
      if (data.documentTitle) {
        titleLen = data.documentTitle.length;
        titleToDisplay = titleLen < 40 ? data.documentTitle : data.documentTitle.slice(0, 31) + "..." + data.documentTitle.slice(titleLen - 6, titleLen);
      }
      context = {
        user: data.user,
        rawUrl: data.rawUrl,
        documentTitle: titleToDisplay,
        time: data.timestampMS ? this.timestampUpdater.timestampToOutputString(data.timestampMS) : "unknown time",
        feedtimeClass: feedTimestampClass
      };
      this.messageFeed.prepend(Templates['messageFeedElem'](context));
      return this.timestampUpdater.addToUpdateMap(feedTimestampClass, data.timestampMS);
    };

    return GroupFeed;

  })();

  window.MessageList = (function() {
    function MessageList(elem, fbInteractor, timestampUpdater) {
      var _this = this;
      this.elem = elem;
      this.fbInteractor = fbInteractor;
      this.timestampUpdater = timestampUpdater;
      this.addMessage = __bind(this.addMessage, this);
      this.rerenderVideo = __bind(this.rerenderVideo, this);
      this.messageList = this.elem.find("#messages-container");
      this.fbInteractor.fb_page_videos.on("child_added", function(snapshot) {
        if (snapshot && snapshot.val()) {
          return _this.addMessage(snapshot.val());
        }
      });
    }

    MessageList.prototype.rerenderVideo = function(videoWrapperClass, videoContext) {
      var wrapperElem,
        _this = this;
      wrapperElem = $("#messages-container ." + videoWrapperClass);
      if (!wrapperElem) {
        return;
      }
      wrapperElem.empty();
      wrapperElem.html(Templates["videoElement"](videoContext));
      return $("video." + videoContext.videoElemClass).one("ended", function(evt) {
        console.log("===== Video ended! ========");
        return _this.rerenderVideo(videoWrapperClass, videoContext);
      });
    };

    MessageList.prototype.addMessage = function(data) {
      var messageTimestampClass, time, videoContext, videoElemClass, videoWrapperClass, wrapperContext;
      if (this.elem.find(".loading-spinner")) {
        $(this.elem.find(".loading-spinner-wrapper")).hide();
      }
      messageTimestampClass = "messagetime-" + Math.floor(Math.random() * 100000000);
      videoElemClass = "videoelem-" + Math.floor(Math.random() * 100000000);
      videoWrapperClass = "videowrapper-" + Math.floor(Math.random() * 100000000);
      time = data.timestampMS ? this.timestampUpdater.timestampToOutputString(data.timestampMS) : "unknown time";
      wrapperContext = {
        messageTimestampClass: messageTimestampClass,
        time: time,
        videoUser: data.user,
        videoWrapperClass: videoWrapperClass
      };
      $("#messages-container").prepend(Templates["videoMessageElem"](wrapperContext));
      videoContext = {
        videoUrl: URL.createObjectURL(BlobConverter.base64_to_blob(data.videoBlob)),
        videoElemClass: videoElemClass
      };
      this.rerenderVideo(videoWrapperClass, videoContext);
      return this.timestampUpdater.addToUpdateMap(messageTimestampClass, data.timestampMS);
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
      this.videoRecorder = new VideoRecorder();
      this.setInitialState();
    }

    MessageRecorder.prototype.setInitialState = function() {
      var _this = this;
      this.elem.html(Templates["recordMessageArea"]());
      this.recordButton = $(this.elem.find(".record-button"));
      this.videoRecorder.resetState();
      this.webcam_stream_container = $(this.elem.find('.webcam_stream_container'));
      $(".stop-asking-video-button").click(function(evt) {
        $("#sharing-video-help").hide();
        return _this.recordButton.show();
      });
      return this.recordButton.click(this.respondRecordClick);
    };

    "Launches asking permission from the webcam to record a message. Only needs to happen once.";

    MessageRecorder.prototype.respondRecordClick = function(evt) {
      this.recordButton.hide();
      if (!this.videoRecorder.webcamConnected) {
        $("#sharing-video-help").show();
        return this.videoRecorder.connectWebcam(this.showRecordingControls, this.respondRecordingError);
      } else {
        console.log("webcam already connected");
        this.videoRecorder.mediaSuccessCallback(this.videoRecorder.videoStream);
        return this.showRecordingControls();
      }
    };

    MessageRecorder.prototype.showRecordingControls = function(videoStream) {
      $("#sharing-video-help").hide();
      return this.recorderControls = new MessageRecorderControls($(this.elem.find(".record-controls-wrapper")), this.videoRecorder, videoStream, this.videoReadyCallback, this.setInitialState);
    };

    MessageRecorder.prototype.respondRecordingError = function() {
      return this.webcam_stream_container.html("<p class=\"recording-error-message\">Failed to access your webcam and microphone.\nUpdate your video settings in the URL bar then refresh the page and try again.</p>");
    };

    MessageRecorder.prototype.videoReadyCallback = function(videoBlob) {
      console.log("video ready to show");
      this.fbInteractor.fb_page_videos.push({
        videoBlob: videoBlob,
        user: this.userName,
        timestampMS: (new Date()).toString()
      });
      this.fbInteractor.fb_instance_stream.push({
        rawUrl: this.rawUrl,
        user: this.userName,
        timestampMS: (new Date()).toString(),
        documentTitle: parentPageDocumentTitle || ""
      });
      return this.setInitialState();
    };

    return MessageRecorder;

  })();

  window.TimestampUpdater = (function() {
    function TimestampUpdater() {
      this.timestampToOutputString = __bind(this.timestampToOutputString, this);
      this.addToUpdateMap = __bind(this.addToUpdateMap, this);
      var _this = this;
      this.updateTimeMap = {};
      setInterval(function() {
        var className, newTime, timeElem, timestamp, _ref, _results;
        _ref = _this.updateTimeMap;
        _results = [];
        for (className in _ref) {
          timestamp = _ref[className];
          timeElem = $("." + className);
          if (!timeElem) {
            continue;
          }
          newTime = timestamp ? _this.timestampToOutputString(timestamp) : "unknown time";
          _results.push($(timeElem).html(newTime));
        }
        return _results;
      }, 1000 * 30);
    }

    TimestampUpdater.prototype.addToUpdateMap = function(className, rawTimestamp) {
      return this.updateTimeMap[className] = rawTimestamp;
    };

    TimestampUpdater.prototype.timestampToOutputString = function(timestampMS) {
      return moment(Date.parse(timestampMS)).fromNow();
    };

    return TimestampUpdater;

  })();

  window.MessageRecorderControls = (function() {
    function MessageRecorderControls(elem, videoRecorder, videoStream, videoReadyCallback, resetInitialStateCallback) {
      this.elem = elem;
      this.videoRecorder = videoRecorder;
      this.videoStream = videoStream;
      this.videoReadyCallback = videoReadyCallback;
      this.resetInitialStateCallback = resetInitialStateCallback;
      this.bailRecordingMessage = __bind(this.bailRecordingMessage, this);
      this.stopRecordingMessage = __bind(this.stopRecordingMessage, this);
      this.recordingEndedCallback = __bind(this.recordingEndedCallback, this);
      this.startRecordingMessage = __bind(this.startRecordingMessage, this);
      this.leaveRecordingMessage = __bind(this.leaveRecordingMessage, this);
      this.setButtonsReadyToStart = __bind(this.setButtonsReadyToStart, this);
      this.elem.html(Templates['recordMessageControls']());
      this.startButton = $(this.elem.find(".record-start-button"));
      this.leaveButton = $(this.elem.find(".record-leave-button"));
      this.stopButton = $(this.elem.find(".record-stop-button"));
      this.bailButton = $(this.elem.find(".record-bail-button"));
      this.errorMessage = $(this.elem.find(".record-overtime-error-message"));
      this.setButtonsReadyToStart();
      this.startButton.click(this.startRecordingMessage);
      this.stopButton.click(this.stopRecordingMessage);
      this.bailButton.click(this.bailRecordingMessage);
      this.leaveButton.click(this.leaveRecordingMessage);
    }

    MessageRecorderControls.prototype.setButtonsReadyToStart = function() {
      return enableButtons([this.startButton, this.leaveButton], [this.stopButton, this.bailButton]);
    };

    MessageRecorderControls.prototype.leaveRecordingMessage = function() {
      return this.resetInitialStateCallback();
    };

    MessageRecorderControls.prototype.startRecordingMessage = function() {
      this.recordingState = "started";
      this.dataState = "no-data";
      this.errorMessage.html("");
      this.videoRecorder.startRecordingMedia(this.videoStream, this.recordingEndedCallback);
      return enableButtons([this.stopButton, this.bailButton], [this.startButton, this.leaveButton]);
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
      this.getKeyFromRawUrl = __bind(this.getKeyFromRawUrl, this);
      this.hashString = __bind(this.hashString, this);
      this.fb_instance = new Firebase("https://sidenote.firebaseio.com");
      console.log("hash url: " + this.hashString(this.rawUrl));
    }

    FirebaseInteractor.prototype.hashString = function(s) {
      console.log('hashing: ' + s);
      return s.split("").reduce(function(a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return Math.abs(a & a);
      }, 0);
    };

    FirebaseInteractor.prototype.getKeyFromRawUrl = function(url) {
      url = getStringWithoutInitial(url, "https://");
      url = getStringWithoutInitial(url, "http://");
      url = getStringWithoutInitial(url, "www.");
      url = getStringWithoutTrailing(url, "/");
      url = getStringWithoutTrailing(url, "/#");
      return url;
    };

    FirebaseInteractor.prototype.init = function() {
      var fb_group_name, groupNameFbKey, rawUrlFbKey;
      console.log(this.fb_instance);
      groupNameFbKey = this.hashString(this.groupName.toLowerCase().trim());
      this.fb_new_chat_room = this.fb_instance.child('chatrooms').child(groupNameFbKey);
      fb_group_name = this.fb_new_chat_room.child('rawGroupName');
      fb_group_name.set({
        'name': this.groupName.toLowerCase()
      });
      this.fb_instance_stream = this.fb_new_chat_room.child('stream');
      rawUrlFbKey = this.hashString(this.getKeyFromRawUrl(this.rawUrl));
      console.log("Raw URL key: " + rawUrlFbKey);
      return this.fb_page_videos = this.fb_new_chat_room.child('page_videos').child(rawUrlFbKey);
    };

    return FirebaseInteractor;

  })();

  iframeMessageReceiver = function(e) {
    console.log("MESSAGE RECEIVED");
    if (e.origin === '*') {
      return;
    }
    console.log(e.data);
    return window.parentPageDocumentTitle = e.data;
  };

  window.addEventListener('message', iframeMessageReceiver, false);

  $(document).ready(function() {
    var app;
    return app = new App($(".sidenote-container"));
  });

}).call(this);
