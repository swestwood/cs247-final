// Generated by CoffeeScript 1.6.3
(function() {
  "Helper classes, moved out of the main folder for ease of navigation. Each should really go in its own file if\n  the project becomes large.\n\nAdapted from code written for CS247 Project 2: https://github.com/swestwood/proto1-cs247-p3\n\nCompile by running coffee -wc *.coffee to generate main.js and compile other .coffee files in the directory.";
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.MAX_VIDEO_LENGTH_MS = 30 * 1000;

  window.enableButton = function(button, isEnabled) {
    if (isEnabled) {
      return $(button).removeAttr('disabled');
    } else {
      return $(button).attr('disabled', 'disabled');
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

  window.VideoDisplay = (function() {
    function VideoDisplay() {}

    VideoDisplay.createVideoElem = function(video_data) {
      var source, video;
      video = document.createElement("video");
      video.autoplay = false;
      video.controls = true;
      video.loop = false;
      video.width = 250;
      video.muted = false;
      source = document.createElement("source");
      source.src = URL.createObjectURL(BlobConverter.base64_to_blob(video_data));
      source.type = "video/webm";
      return [source, video];
    };

    return VideoDisplay;

  }).call(this);

  window.VideoRecorder = (function() {
    "Handles the mechanics of recording videos every 3 seconds.";
    function VideoRecorder() {
      this.dataAvailableCallback = __bind(this.dataAvailableCallback, this);
      this.stopRecordingMedia = __bind(this.stopRecordingMedia, this);
      this.startRecordingMedia = __bind(this.startRecordingMedia, this);
      this.mediaSuccessCallback = __bind(this.mediaSuccessCallback, this);
      this.connectWebcam = __bind(this.connectWebcam, this);
      this.curVideoBlob = null;
      this.webcamConnected = false;
      this.videoWidth = 270;
      this.videoHeight = 200;
    }

    VideoRecorder.prototype.connectWebcam = function(successCallback, failureCallback) {
      var mediaConstraints, onMediaError, onMediaSuccess,
        _this = this;
      mediaConstraints = {
        video: true,
        audio: true
      };
      onMediaSuccess = function(videoStream) {
        _this.webcamConnected = true;
        _this.mediaSuccessCallback(videoStream);
        return successCallback(videoStream);
      };
      onMediaError = function(e) {
        console.error('media error', e);
        return failureCallback(e);
      };
      return navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
    };

    VideoRecorder.prototype.mediaSuccessCallback = function(videoStream) {
      var video, webcam_stream;
      webcam_stream = document.getElementById('webcam_stream');
      video = document.createElement('video');
      webcam_stream.innerHTML = "";
      video = mergeProps(video, {
        muted: false,
        width: this.videoWidth,
        height: this.videoHeight,
        src: URL.createObjectURL(videoStream)
      });
      video.play();
      return webcam_stream.appendChild(video);
    };

    VideoRecorder.prototype.startRecordingMedia = function(videoStream, callerCallback) {
      var _this = this;
      this.mediaRecorder = new MediaStreamRecorder(videoStream);
      this.mediaRecorder.mimeType = 'video/webm';
      this.mediaRecorder.videoWidth = this.videoWidth / 2;
      this.mediaRecorder.videoHeight = this.videoHeight / 2;
      this.mediaRecorder.ondataavailable = function(blob) {
        console.log("got to registered callback.");
        return _this.dataAvailableCallback(blob, callerCallback);
      };
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
      var _this = this;
      console.log('doing registered data available callback');
      _this = this;
      return BlobConverter.blob_to_base64(blob, function(b64_data) {
        var curVideoBlob;
        curVideoBlob = b64_data;
        return callerCallback(curVideoBlob);
      });
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

  }).call(this);

}).call(this);
