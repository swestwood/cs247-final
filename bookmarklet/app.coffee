console.log("app loaded")

# Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


class App

  constructor: (@elem) ->
    @userName = "unknown"
    @groupName = "unknown"
    @setupUrlInfo()

    if not @fetchGroupAndUserFromLocalStorage()
      $(".sidenote-app-content").hide()
      @showSetGroupAndUser()
    else
      @showSidenote()


  """Grab Sidenote data from the site page and cookies."""
  setupUrlInfo: =>
    @urlId = null
    @pageId = window.location.toString().split("?")[1].split("=")[1]
    console.log window.location.toString()
    @rawUrl = document.referrer  # window.parent.location is blocked (XSS)
    console.log "Raw URL: " + @rawUrl
    # console.log "TITLE: " + window.parent.window.title  # blocked

  fetchGroupAndUserFromLocalStorage: =>
    @groupName = _.escape(localStorage.groupName || "")
    @userName = _.escape(localStorage.userName || "")  # Fetch if it exists, otherwise set to empty string
    console.log "GROUP NAME: " + @groupName
    console.log "USER NAME: " + @userName
    if _.isEmpty(@groupName.trim()) or _.isEmpty(@userName.trim())
      return false
    return true

  showSetGroupAndUser: =>
    $(".sidenote-app-content").hide()
    $('.set-group-user-wrapper').html(Templates["setGroupAndUserArea"]()).show()
    $(".done-inputting-info").click (evt) =>
      console.log("inputted info")
      inputtedUser = $(".user-name-input").val().trim()
      inputtedGroup = $(".group-name-input").val().trim()
      if _.isEmpty(inputtedUser) or _.isEmpty(inputtedGroup)
        $(".input-info-error").html("You need to enter both a user and a group.")
        return  # Cannot be empty
      localStorage.userName = _.escape(inputtedUser)
      localStorage.groupName = _.escape(inputtedGroup)
      if not @fetchGroupAndUserFromLocalStorage()
        console.error("Something went wrong with setting local storage..")
        return
      @showSidenote()


  showGroupAndUserName: =>
    @elem.find(".group-name").html(_.escape(@groupName))
    @elem.find(".user-name").html(_.escape(@userName))
    @elem.find(".change-user-group").click (evt) =>
      @showSetGroupAndUser()
    
  showSidenote: =>
    $(".sidenote-app-content").html(Templates["sidenoteAppContent"]())
    @showGroupAndUserName()
    @fbInteractor = new FirebaseInteractor(@groupName, @rawUrl)
    @fbInteractor.init()
    @messageRecorder = new MessageRecorder($('.record-message-wrapper'), @fbInteractor, @userName, @rawUrl)
    @timestampUpdater = new TimestampUpdater()
    @messageList = new MessageList($('.messages-area-wrapper'), @fbInteractor, @timestampUpdater)
    @groupFeed = new GroupFeed($('.group-feed-wrapper'), @fbInteractor, @timestampUpdater)

    $('.set-group-user-wrapper').hide()
    $(".sidenote-app-content").show()



class window.GroupFeed

  constructor: (@elem, @fbInteractor, @timestampUpdater) ->
    @messageFeed = @elem.find(".group-feed-container")
    @fbInteractor.fb_instance_stream.on "child_added", (snapshot) =>
      if snapshot and snapshot.val()
        @addFeedElem(snapshot.val())



  addFeedElem: (data) =>
    feedTimestampClass = "feedtime-"+Math.floor(Math.random()*100000000)
    context =
      user: data.user
      rawUrl: data.rawUrl
      time:  if data.timestampMS then @timestampUpdater.timestampToOutputString(data.timestampMS) else "unknown time";
      feedtimeClass: feedTimestampClass

    @messageFeed.prepend(Templates['messageFeedElem'](context))
    @timestampUpdater.addToUpdateMap(feedTimestampClass, data.timestampMS)

class window.MessageList

  constructor: (@elem, @fbInteractor, @timestampUpdater) ->
    @messageList = @elem.find("#messages-container")

    @fbInteractor.fb_page_videos.on "child_added", (snapshot) =>
      if snapshot and snapshot.val()
        @addMessage(snapshot.val())

  addMessage: (data) =>
    messageTimestampClass = "messagetime-"+Math.floor(Math.random()*100000000)
    # TODO this should really be a handlebars template
    [source, video] = VideoDisplay.createVideoElem(data.videoBlob)
    video.appendChild(source)
    $("#messages-container").prepend(video)
    time = if data.timestampMS then @timestampUpdater.timestampToOutputString(data.timestampMS) else "unknown time";
    @messageList.prepend("<h4>" + data.user  + "</h4> <div class='" + messageTimestampClass + "'>" + time + "</div>")
    @timestampUpdater.addToUpdateMap(messageTimestampClass, data.timestampMS)


class window.MessageRecorder

  constructor: (@elem, @fbInteractor, @userName, @rawUrl) ->
    @setInitialState()


  setInitialState: =>
    @elem.html(Templates["recordMessageArea"]())
    @recordButton = $(@elem.find(".record-button"))
    @webcam_stream_container = $(@elem.find('.webcam_stream_container'))
    @videoRecorder = new VideoRecorder()
    @recordButton.click(@respondRecordClick)

  """Launches asking permission from the webcam to record a message. Only needs to happen once."""
  respondRecordClick: (evt) =>
    @recordButton.hide()
    if not @videoRecorder.webcamConnected
      $("#sharing-video-help").show()
      @videoRecorder.connectWebcam(@showRecordingControls, @respondRecordingError)
    else
      console.log "webcam already connected"

  showRecordingControls: (videoStream) =>
    $("#sharing-video-help").hide()
    @recorderControls = new MessageRecorderControls($(@elem.find(".record-controls-wrapper")), @videoRecorder, videoStream, @videoReadyCallback)

  respondRecordingError: =>
    @webcam_stream_container.html """
      <p class="recording-error-message">Failed to access your webcam and microphone.
      Update your video settings in the URL bar then refresh the page and try again.</p>
    """

  videoReadyCallback: (videoBlob) =>
    console.log "video ready to show"
    @fbInteractor.fb_page_videos.push({videoBlob: videoBlob, user: @userName, timestampMS: (new Date()).toString()})
    @fbInteractor.fb_instance_stream.push({rawUrl: @rawUrl, user: @userName,  timestampMS: (new Date()).toString()})
    @setInitialState()

class window.TimestampUpdater

  constructor: ->
    @updateTimeMap = {}

    setInterval =>
      for className, timestamp of @updateTimeMap
        timeElem = $("." + className)
        continue if not timeElem
        newTime = if timestamp then @timestampToOutputString(timestamp) else "unknown time";
        $(timeElem).html(newTime)
    , (1000*30) # Update the times every 30 sec


  addToUpdateMap: (className, rawTimestamp) =>
    @updateTimeMap[className] = rawTimestamp

  timestampToOutputString: (timestampMS) =>
    return moment(Date.parse(timestampMS)).fromNow()

class window.MessageRecorderControls

  constructor: (@elem, @videoRecorder, @videoStream, @videoReadyCallback) ->
    @elem.html(Templates['recordMessageControls']())
    @startButton = $(@elem.find(".record-start-button"))
    @stopButton = $(@elem.find(".record-stop-button"))
    @bailButton = $(@elem.find(".record-bail-button"))
    @errorMessage = $(@elem.find(".record-overtime-error-message"))

    @setButtonsReadyToStart()

    @startButton.click(@startRecordingMessage)
    @stopButton.click(@stopRecordingMessage)
    @bailButton.click(@bailRecordingMessage)

  setButtonsReadyToStart: =>
    enableButtons([@startButton], [@stopButton, @bailButton])

  startRecordingMessage: =>
    @recordingState = "started"
    @dataState = "no-data"
    @errorMessage.html("")
    @videoRecorder.startRecordingMedia(@videoStream, @recordingEndedCallback)
    enableButtons([@stopButton, @bailButton], [@startButton])

  """Called whenever data is available. This can happen # ways:
    1. Because the user presses stop. Then, just reset the buttons and launch the video ready callback.
    2. Because the user presses bail. Then, reset the buttons and do nothing with the data.
    3. Because the user hits the max length time before pressing stop or bail. In this case, stop the video, show them a message and tell them to record again.
    4. As a result of #3, calling stop from this callback will trigger another callback, which needs to be ignored. This is the purpose of the datastate var.
  """
  recordingEndedCallback: (videoBlob) =>
    if @dataState == "no-data" and @recordingState == "stopped"
      # Case 1
      console.log "Case one, responding to video"
      @dataState = "data-received"
      @setButtonsReadyToStart()
      @videoReadyCallback(videoBlob)
    else if @dataState == "no-data" and @recordingState == "bailed"
      console.log "case two, bailing"
      @dataState = "data-received"
      @setButtonsReadyToStart()
    else if @dataState == "no-data" and @recordingState != "stopped"
      # Case 3 -- exceeded the time limit, try again.
      @dataState = "data-received"
      @errorMessage.html("Uh oh, looks like you exceeded the 30-sec time limit. Try again.")
      @videoRecorder.stopRecordingMedia()
    else if @dataState == "data-received"
      # Case 4 -- just ignore it.
      console.log "Second callback, ignoring it safely, resetting the buttons."
      @setButtonsReadyToStart()

  stopRecordingMessage: =>
    @recordingState = "stopped"
    @videoRecorder.stopRecordingMedia()

  bailRecordingMessage: =>
    @recordingState = "bailed"
    @videoRecorder.stopRecordingMedia()


class window.FirebaseInteractor
  """Connects to Firebase and connects to chatroom variables."""
  constructor: (@groupName, @rawUrl) ->
    @fb_instance = new Firebase("https://sidenote.firebaseio.com")
    console.log "hash url: " + @hashString(@rawUrl)

  hashString: (s) =>
    console.log 'hashing: '+ s
    # From http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
    return s.split("").reduce (a,b) ->
      a = ((a<<5)-a) + b.charCodeAt(0)
      return Math.abs(a&a)
    ,0

  getKeyFromRawUrl: (url) =>
    url = getStringWithoutInitial(url, "https://")
    url = getStringWithoutInitial(url, "http://")
    url = getStringWithoutInitial(url, "www.")
    url = getStringWithoutTrailing(url, "/")
    url = getStringWithoutTrailing(url, "/#")
    return url

  init: =>
    console.log @fb_instance
    # set up variables to access firebase data structure
    # Hash the group name so that we can allow spaces. Group names are CASE INSENSITIVE and ignore beginning/trailing whitespace
    groupNameFbKey = @hashString(@groupName.toLowerCase().trim())
    @fb_new_chat_room = @fb_instance.child('chatrooms').child(groupNameFbKey)
    @fb_instance_stream = @fb_new_chat_room.child('stream')   # TODO implement a limit

    # Set the room key as the trimmed rawUrl, but do not update the rawUrl itself so that links involving it still work.
    rawUrlFbKey = @hashString(@getKeyFromRawUrl(@rawUrl))
    console.log "Raw URL key: " + rawUrlFbKey
    @fb_page_videos = @fb_new_chat_room.child('page_videos').child(rawUrlFbKey)



$(document).ready ->
  app = new App($(".sidenote-container"))

