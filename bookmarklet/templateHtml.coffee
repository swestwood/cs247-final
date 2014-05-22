"""
This is a hack to avoid having to manually pre-compile the Handlebars templates.
"""

window.buildTemplates = =>
  
  sidenoteAppContent = """

  <div class="sidenote-metadata-wrapper">
      <div class="user-name-wrapper">
          Hey there <span class="user-name">(unknown)</span>,
      </div>
      <div class="group-name-wrapper">
          you're in the group <span class="group-name">(none)</span>.
      </div>
      <div class="metadata-problem-instructions">
      <span class="change-user-group">change name or group</span>
      </div>
  </div>
  

  <div class="record-message-wrapper">
  </div>

  <div class="messages-area-wrapper">
      <div class="messages-area">
          <div class="messages-area-title">Messages</div>
          <div id="messages-container"></div>
      </div>
  </div>


  <div class="group-feed-wrapper">
      <div class="group-feed-area">
          <div class="group-feed-area-title">Recent group activity</div>
          <div class="group-feed-container"></div>
      </div>
  </div>
  """

  videoMessageElem = """
  <div class="vid-message-wrapper">
    <div class="vid-message-info">
      <div class="vid-message-user">{{videoUser}}</div>
      <div class="vid-message-timestamp {{messageTimestampClass}}">{{time}}</div>
    </div>
    <div class="vid_wrapper"><video controls="true" width=250><source src="{{videoUrl}}" type="video/webm"></video></div>
  </div>
  """

  setGroupAndUserArea = """
  <div class="set-group-and-user">
    <div><input type="text" class="user-name-input" placeholder="Name"></div>
    <div><input type="text" class="group-name-input" placeholder="Group"></div>
    <p>You'll share video messages within your group.</p>
    <p>Try the group name <strong>CS247</strong>.</p>
    <button class="done-inputting-info">Done</button>
    <div class="input-info-error"> </div>
  </div


  """

  messageFeedElem = """
  <div class="message-feed-elem">
    <div class="feed-timestamp {{feedtimeClass}}">{{time}}</div>
    {{user}} posted on <a href="{{rawUrl}}" target="_blank">{{documentTitle}}</a>
  </div>
  """

  recordMessageArea = """
  <div class="record-message-area">
      <div class="record-message-container">
          <button class="record-button">Record a message</button>
          <div class="webcam_stream_container">
            <div id="webcam_stream">
                <div id="sample-user-container">
                  <div id="sharing-video-help" style="display:none">
                      <p>Click "Share Selected Devices" to use our video chat.</p>
                      <div class="sample-user place-user">
                          <img class="allow" src="../bookmarklet/library/allow-me.png" alt="allow me" width="300" \>
                      </div>
                  </div>
                </div>
            </div>
          </div>
          <div class="record-controls-wrapper"></div>
      </div>
  </div>
  """

  # Treat these as HTML files
  recordMessageControls = """
  <div class="record-message-controls-container">
    <button class="record-start-button">Start</button>
    <button class="record-stop-button">Done, post!</button>
    <button class="record-bail-button">Oops, discard.</button>
    <p>Recordings can be max 30 seconds.</p>
    <span class="record-overtime-error-message"></span>
  </div>
  """


  # Add any new templates to this dictionary so that they get compiled.
  handlebarsElems = 
    "sidenoteAppContent": sidenoteAppContent
    "setGroupAndUserArea": setGroupAndUserArea
    "recordMessageArea": recordMessageArea
    "recordMessageControls": recordMessageControls
    "messageFeedElem": messageFeedElem
    "videoMessageElem": videoMessageElem
  return handlebarsElems

# Access templates via window.Templates["quiz"] for example, depending on the name given in
# handlebarsElems
window.Templates = {}
for name, templateStr of window.buildTemplates()
  window.Templates[name] = Handlebars.compile(templateStr)