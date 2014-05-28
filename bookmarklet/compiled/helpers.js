// Generated by CoffeeScript 1.7.1
(function() {
  "Helper classes, moved out of the main folder for ease of navigation. Each should really go in its own file if\n  the project becomes large.\n\nAdapted from code written for CS247 Project 2: https://github.com/swestwood/proto1-cs247-p3\n\nCompile by running coffee -wc *.coffee to generate main.js and compile other .coffee files in the directory.";
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.MAX_VIDEO_LENGTH_MS = 30 * 1000;

  window.enableButton = function(button, isEnabled) {
    if (isEnabled) {
      $(button).removeAttr('disabled');
      return $(button).show();
    } else {
      $(button).attr('disabled', 'disabled');
      return $(button).hide();
    }
  };

  window.enableButtons = function(toEnable, toDisable) {
    var button, _i, _j, _len, _len1, _results;
    for (_i = 0, _len = toEnable.length; _i < _len; _i++) {
      button = toEnable[_i];
      enableButton(button, true);
    }
    _results = [];
    for (_j = 0, _len1 = toDisable.length; _j < _len1; _j++) {
      button = toDisable[_j];
      _results.push(enableButton(button, false));
    }
    return _results;
  };

  "Remove toRemove from the start of origString if it is there, return the new string.\nI.e., strip \"https://\" from a url.";

  window.getStringWithoutInitial = (function(_this) {
    return function(origString, toRemove) {
      if (origString.indexOf(toRemove) === 0) {
        origString = origString.slice(toRemove.length);
      }
      return origString;
    };
  })(this);

  "Remove toRemove from the end of origString if it is there, return the new string.\nIe strip \"/#\" from the end of a url.";

  window.getStringWithoutTrailing = (function(_this) {
    return function(origString, toRemove) {
      if (origString.indexOf(toRemove, origString.length - toRemove.length) !== -1) {
        origString = origString.slice(0, origString.length - toRemove.length);
      }
      return origString;
    };
  })(this);

  window.VideoDisplay = (function() {
    function VideoDisplay() {}

    return VideoDisplay;

  })();

  window.VideoRecorder = (function() {
    "Handles the mechanics of recording videos every 3 seconds.";
    function VideoRecorder() {
      this.dataAvailableCallback = __bind(this.dataAvailableCallback, this);
      this.stopRecordingMedia = __bind(this.stopRecordingMedia, this);
      this.startRecordingMedia = __bind(this.startRecordingMedia, this);
      this.mediaSuccessCallback = __bind(this.mediaSuccessCallback, this);
      this.connectWebcam = __bind(this.connectWebcam, this);
      this.resetState = __bind(this.resetState, this);
      this.resetState();
      this.videoWidth = 202;
      this.videoHeight = 150;
    }

    VideoRecorder.prototype.resetState = function() {
      this.curVideoBlob = null;
      return this.webcamConnected = false;
    };

    VideoRecorder.prototype.connectWebcam = function(successCallback, failureCallback) {
      var mediaConstraints, onMediaError, onMediaSuccess;
      mediaConstraints = {
        video: true,
        audio: true
      };
      onMediaSuccess = (function(_this) {
        return function(videoStream) {
          _this.videoStream = videoStream;
          _this.webcamConnected = true;
          _this.mediaSuccessCallback(videoStream);
          return successCallback(videoStream);
        };
      })(this);
      onMediaError = (function(_this) {
        return function(e) {
          console.error('media error', e);
          return failureCallback(e);
        };
      })(this);
      return navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
    };

    VideoRecorder.prototype.mediaSuccessCallback = function(videoStream) {
      var video, webcam_stream;
      if (!videoStream) {
        console.error("Bad! Tried to record video with no video stream");
        return;
      }
      webcam_stream = document.getElementById('webcam_stream');
      video = document.createElement('video');
      webcam_stream.innerHTML = "";
      video = mergeProps(video, {
        muted: true,
        width: this.videoWidth,
        height: this.videoHeight,
        src: URL.createObjectURL(videoStream)
      });
      video.play();
      return webcam_stream.appendChild(video);
    };

    VideoRecorder.prototype.startRecordingMedia = function(videoStream, callerCallback) {
      this.mediaRecorder = new MediaStreamRecorder(videoStream);
      this.mediaRecorder.mimeType = 'video/webm';
      this.mediaRecorder.videoWidth = this.videoWidth / 2;
      this.mediaRecorder.videoHeight = this.videoHeight / 2;
      this.mediaRecorder.ondataavailable = (function(_this) {
        return function(blob) {
          console.log("got to registered callback.");
          return _this.dataAvailableCallback(blob, callerCallback);
        };
      })(this);
      this.mediaRecorder.start(MAX_VIDEO_LENGTH_MS);
      return console.log("started recording!");
    };

    VideoRecorder.prototype.stopRecordingMedia = function() {
      if (!this.mediaRecorder) {
        return;
      }
      this.mediaRecorder.stop();
      return console.log("stopped recording media");
    };

    VideoRecorder.prototype.dataAvailableCallback = function(blob, callerCallback) {
      var _this;
      console.log('doing registered data available callback');
      _this = this;
      return BlobConverter.blob_to_base64(blob, (function(_this) {
        return function(b64_data) {
          var curVideoBlob;
          curVideoBlob = b64_data;
          return callerCallback(curVideoBlob);
        };
      })(this));
    };

    return VideoRecorder;

  })();

  window.BlobConverter = (function() {
    "Static methods for converting blob to base 64 and vice versa\nfor performance bench mark, please refer to http://jsperf.com/blob-base64-conversion/5\nnote useing String.fromCharCode.apply can cause callstack error";
    function BlobConverter() {}

    BlobConverter.blob_to_base64 = function(blob, callback) {
      var reader;
      reader = new FileReader();
      reader.onload = function() {
        var base64, dataUrl;
        dataUrl = reader.result;
        base64 = dataUrl.split(',')[1];
        return callback(base64);
      };
      return reader.readAsDataURL(blob);
    };

    BlobConverter.base64_to_blob = function(base64) {
      var binary, blob, buffer, i, len, view, _i;
      binary = atob(base64);
      len = binary.length;
      buffer = new ArrayBuffer(len);
      view = new Uint8Array(buffer);
      for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
        view[i] = binary.charCodeAt(i);
      }
      blob = new Blob([view]);
      return blob;
    };

    return BlobConverter;

  })();

}).call(this);
