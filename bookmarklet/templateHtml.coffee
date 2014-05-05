"""
This is a hack to avoid having to manually pre-compile the Handlebars templates.
"""

window.buildTemplates = =>
  
  sidenoteAppContent = """

  <div class="sidenote-metadata-wrapper">
      <div class="group-name-wrapper">
          Your group is <span class="group-name">(none)</span>
      </div>
      <div class="user-name-wrapper">
          and you are <span class="user-name">(unknown)</span>
      </div>
      <div class="metadata-problem-instructions">
      <div class="change-user-group">Change?</div>
      </div>
  </div>

  <div class="record-message-wrapper">
  </div>

  <div class="messages-area-wrapper">
      <div class="messages-area">
          <div class="messages-area-title">Website messages from group</div>
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

  setGroupAndUserArea = """
  <div class="set-group-and-user">
    <div>Name? <input type="text" class="user-name-input" placeholder="What's your name?"></div>
    <div>Group? <input type="text" class="group-name-input" placeholder="Name your group!"></div>
    <p>You can share video messages with anybody in this group. Use the same group as a friend, or
    come up with a new name and share it with friends.</p>
    <p>You need to have cookies enabled to save your group info.</p>
    <button class="done-inputting-info">Done!</button>
    <div class="input-info-error"> </div>
  </div


  """

  messageFeedElem = """
  <div class="message-feed-elem">
    New message from {{user}} at <a href="{{rawUrl}}" target="_blank">{{rawUrl}}</a>
  </div>
  """

  recordMessageArea = """
  <div class="record-message-area">
      <div class="record-message-container">
          <div class="webcam_stream_container">
            <div id="webcam_stream">
                <div id="sample-user-container">
                    <div class="sample-user place-user">
                        <i class="fa fa-user"></i>
                    </div>
                </div>
            </div>
          </div>
          <button class="record-button">Record a message for this site</button>
          <div class="record-controls-wrapper">
          </div>
      </div>
  </div>
  """

  # Treat these as HTML files
  recordMessageControls = """
  <div class="record-message-controls-container">
    <button class="record-start-button">Start new recording (max 30 seconds)</button>
    <button class="record-stop-button">Done, post message!</button>
    <button class="record-bail-button">Oops, bail out.</button>
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
  return handlebarsElems

# Access templates via window.Templates["quiz"] for example, depending on the name given in
# handlebarsElems
window.Templates = {}
for name, templateStr of window.buildTemplates()
  window.Templates[name] = Handlebars.compile(templateStr)