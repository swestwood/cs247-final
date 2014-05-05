"""
Helper classes, moved out of the main folder for ease of navigation. Each should really go in its own file if
  the project becomes large.

Adapted from code written for CS247 Project 2: https://github.com/swestwood/proto1-cs247-p3

Compile by running coffee -wc *.coffee to generate main.js and compile other .coffee files in the directory.
"""

window.MAX_VIDEO_LENGTH_MS = 30 * 1000  # 30 seconds

window.enableButton = (button, isEnabled) ->
  if isEnabled
    $(button).removeAttr('disabled');
  else
    $(button).attr('disabled', 'disabled')

window.enableButtons = (toEnable, toDisable) ->
  for button in toEnable
    enableButton(button, true)
  for button in toDisable
    enableButton(button, false)

class window.VideoDisplay

  @createVideoElem: (video_data) =>
    # for gif instead, use this code below and change mediaRecorder.mimeType in onMediaSuccess below
    # var video = document.createElement("img")
    # video.src = URL.createObjectURL(BlobConverter.base64_to_blob(data.v))

    # for video element
    video = document.createElement("video")
    video.autoplay = false
    video.controls = true # optional
    video.loop = false
    video.width = 250
    video.muted = false

    source = document.createElement("source")
    # source.src =  URL.createObjectURL(video_data)
    source.src =  URL.createObjectURL(BlobConverter.base64_to_blob(video_data))
    source.type =  "video/webm"
    return [source, video]

class window.VideoRecorder

  """Handles the mechanics of recording videos every 3 seconds."""
  constructor: ->
    @curVideoBlob = null
    @webcamConnected = false
    @videoWidth = 270  # 340
    @videoHeight = 200  # 255

  connectWebcam: (successCallback, failureCallback) =>
    # whether to record video/audio
    mediaConstraints =
      video: true,
      audio: true

    # callback for when we get video stream from user.
    onMediaSuccess = (videoStream) =>
      @webcamConnected = true
      @mediaSuccessCallback(videoStream)
      successCallback(videoStream)

    # callback if there is an error when we try and get the video stream
    onMediaError = (e) =>
      console.error('media error', e)
      failureCallback(e)

    # get video stream from user. see https://github.com/streamproc/MediaStreamRecorder
    navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)

  mediaSuccessCallback: (videoStream) =>
    # create video element, attach webcam videoStream to video element
    # Play a live stream of the person
    webcam_stream = document.getElementById('webcam_stream')
    video = document.createElement('video')
    webcam_stream.innerHTML = ""
    # adds these properties to the video
    video = mergeProps(video, {
        # controls: true,
        muted: false,
        width: @videoWidth,
        height: @videoHeight,
        src: URL.createObjectURL(videoStream)
    })
    video.play()
    webcam_stream.appendChild(video)


    # # counter
    # time = 0
    # second_counter = document.getElementById('second_counter')
    # second_counter_update = setInterval =>
    #   second_counter.innerHTML = time++
    # , 1000
    # @recordMedia(videoStream)

  startRecordingMedia: (videoStream, callerCallback) =>
    @mediaRecorder = new MediaStreamRecorder(videoStream)

    @mediaRecorder.mimeType = 'video/webm'
    # @mediaRecorder.mimeType = 'image/gif'
    # make recorded media smaller to save some traffic (80 * 60 pixels, 3*24 frames)
    @mediaRecorder.videoWidth = @videoWidth/2
    @mediaRecorder.videoHeight = @videoHeight/2
    @mediaRecorder.ondataavailable = (blob) =>
      console.log "got to registered callback."
      @dataAvailableCallback(blob, callerCallback)
    @mediaRecorder.start(MAX_VIDEO_LENGTH_MS)  # The argument to start affects how often the data available callback is called
    console.log "started recording!"

  stopRecordingMedia: =>
    return if not @mediaRecorder
    @mediaRecorder.stop()
    console.log "stopped recording media"

  dataAvailableCallback: (blob, callerCallback) =>
    console.log 'doing registered data available callback'
    # video_container.innerHTML = ""
    # convert data into base 64 blocks
    _this = this;
    BlobConverter.blob_to_base64 blob, (b64_data) =>
      curVideoBlob = b64_data
      callerCallback(curVideoBlob)

class window.BlobConverter
  """Static methods for converting blob to base 64 and vice versa
  for performance bench mark, please refer to http://jsperf.com/blob-base64-conversion/5
  note useing String.fromCharCode.apply can cause callstack error"""

  # Leading @ marks as static method.
  @blob_to_base64: (blob, callback) =>
    reader = new FileReader()
    reader.onload = =>
      dataUrl = reader.result
      base64 = dataUrl.split(',')[1]
      callback(base64)
    reader.readAsDataURL(blob)

  @base64_to_blob: (base64) =>
    binary = atob(base64)
    len = binary.length
    buffer = new ArrayBuffer(len)
    view = new Uint8Array(buffer)
    for i in [0...len]
      view[i] = binary.charCodeAt(i)
    blob = new Blob([view])
    return blob
