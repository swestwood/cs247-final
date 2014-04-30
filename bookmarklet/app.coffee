console.log("app loaded")

# Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

class App

  constructor: (@ui) ->
    @urlId = null
    @pageId = window.location.toString().split("?")[1].split("=")[1]
    @rawUrl = document.referrer  # window.parent.location is blocked (XSS)
    console.log @rawUrl

  start: =>
    @getInitDataFromServer()

  # Fetch the peer data from the server necessary to initiate video calls
  getInitDataFromServer: =>
    console.log "TODO do something."
    # $.ajax
    #   url: "/new_peer"
    #   type: "POST"
    #   data:
    #     "full_url": @rawUrl
    #     "page_id": @pageId
    #   success: (jsonData) =>
    #     console.log "response from server.. TODO implement things."
    #   error: (jqXHR, textStatus, errorThrown) ->
    #     console.log("ERROR")
    #     console.log textStatus
    #     console.log jqXHR

class initialContainer
  constructor: ->
    @waitingForUsers = true

  start: ->
    $('#setup-instructions').addClass('animated slideInDown')
    $container = $('#sample-user-container')
    $videoContainer = $("#video-container")

$(document).ready ->
  ui = new initialContainer()
  ui.start()

  app = new App(ui)
  app.start()

