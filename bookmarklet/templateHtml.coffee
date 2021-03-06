"""
This is a hack to avoid having to manually pre-compile the Handlebars templates.
"""

window.buildTemplates = =>
  
  sidenoteAppContent = """

  <div class="metadata">
    <div class="metadata-names">
      <div class="user-name-wrapper">
      <span class="user-name">(unknown)</span>,
      </div>
      <div class="group-name-wrapper">
      you're in <span class="group-name">(none)</span>.
      </div>
    </div>
      <div class="change-button">
      <span class="change-user-group">change</span>
      </div>
  </div>
  

  <div class="record-message-wrapper">
  </div>

  <div class="lower-section">

    <div class="tab-button-area">
      <button class="message-show-button active-content-btn">On This Page</button>
      <button class="feed-show-button">Group Activity</button>
    </div>

    <div class="lower-section-content">
      <div class="messages-area-wrapper">
          <div class="messages-area">
            {{!-- {{ <div class="messages-area-title">Messages</div>}} --}}
              <div class="message-container-outer">
                <div class="message-container-inner">
                  <div id="messages-container">
                    <div class="loading-spinner-wrapper">
                      <i class="loading-spinner fa fa-spinner fa-spin fa-3x"></i>
                      <div class="waiting-intertubes">Waiting on the intertubes for others,
                        <br />or for <strong>you</strong> to post the first message!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </div>


      <div class="group-feed-wrapper" style="display:none">
          <div class="group-feed-area">
            {{!-- {{               <div class="group-feed-area-title">Group Activity</div>}} --}}
              <div class="group-feed-container">
                <div class="loading-spinner-wrapper">
                      <i class="loading-spinner fa fa-spinner fa-spin fa-3x"></i>
                      <div class="waiting-intertubes">Waiting on the intertubes for others,
                        <br />or for <strong>you</strong> to post the first message!
                      </div>
                    </div>
              </div>
          </div>
      </div>

    </div>
  </div>
  """

  # Video element sets the width so that the rerender jumping happens vertically, not horizontally, which arguably
  # looks a bit better.
  videoElement = """
  <video class="{{videoElemClass}}" controls="true" width=200><source src="{{videoUrl}}" type="video/webm"></video>
  """

  textMessageElem = """
    <div class="text-message-wrapper">
      <div class="text-message-info">
        <div class="text-message-user">{{textUser}}</div>
        <div class="text-message-timestamp {{messageTimestampClass}}">{{time}}</div>
      </div>
      <div class="text-wrapper">
        <span class="text-message-in-feed">{{textMessage}}</span>
      </div>
    </div>
  """

  # Video message elem guesses at the video height (seems to be working) again to help with the jumping in rerendering.
  videoMessageElem = """
  <div class="vid-message-wrapper">
    <div class="vid-rerender-wrapper">
      <div class="vid-message-info">
        <div class="vid-message-user">{{videoUser}}</div>
        <div class="vid-message-timestamp {{messageTimestampClass}}">{{time}}</div>
      </div>
      <div class="vid_wrapper  {{videoWrapperClass}}" style="min-height:145px">
   
      </div>
    </div>
  </div>
  """

  setGroupAndUserArea = """
  <div class="set-group-and-user">
    <div><label id="input-label">Name</label><input type="text" class="user-name-input" placeholder="your name"></div>
    <div><label id="input-label">Group</label><input type="text" class="group-name-input" placeholder="your group"></div>
    <p>You'll share messages just within your group.</p>
    <button class="done-inputting-info">Done</button>
    <div id="try-this-group">Try the group name <strong>CS247</strong>, <br /> or come up with a new name and tell your friends!</div>
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
        {{#if isFirefox}}
          <button class="record-button"><i class="fa fa-video-camera fa-2x"></i></button>
        {{/if}}

          <div class="text-message-container">
            <div>
              <input type="text" class="text-message-input" placeholder="Share with a message?">
              <button class="send-text-message-btn">Send</button>
            </div>
          </div>
          {{#unless isFirefox}}
          <div class="message-no-vid-recording">
            <i class="fa fa-video-camera"></i> Note that video recording only works in <a target="_blank" href="http://www.mozilla.org/en-US/firefox/new/">Firefox</a>.
          </div>
          {{/unless}}

          <div class="webcam_stream_container">
            <div id="webcam_stream">
                <div id="sample-user-container">
                  <div id="sharing-video-help" style="display:none">
                      <div id="webcam-text">
                        <em>Please enable your webcam.
                        <span class="stop-asking-video-button">back</span>
                        </em>
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
    <button class="record-start-button">Start (max 30 seconds)</button>
    <button class="record-leave-button">Leave</button>
    <button class="record-stop-button">Done, post!</button>
    <button class="record-bail-button">Oops, discard.</button>
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
    "videoElement": videoElement
    "textMessageElem": textMessageElem
  return handlebarsElems

# Access templates via window.Templates["quiz"] for example, depending on the name given in
# handlebarsElems
window.Templates = {}
for name, templateStr of window.buildTemplates()
  window.Templates[name] = Handlebars.compile(templateStr)


