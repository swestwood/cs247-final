"""
This is a hack to avoid having to manually pre-compile the Handlebars templates.
"""

window.buildTemplates = =>
  
  messageFeedElem = """
  <div class="message-feed-elem">
    New message from {{user}} at <a href="{{rawUrl}}" target="_blank">{{rawUrl}}</a>
  </div>
  """

  recordMessageArea = """
  <div class="record-message-area">
      <div class="record-message-container">
          <button class="record-button">Record a message for this site</button>
          <div class="webcam_stream_container">
            <div id="webcam_stream">
                <div id="sample-user-container">
                    <div class="sample-user place-user">
                        <i class="fa fa-user"></i>
                    </div>
                </div>
            </div>
          </div>
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
    "recordMessageArea": recordMessageArea
    "recordMessageControls": recordMessageControls
    "messageFeedElem": messageFeedElem
  return handlebarsElems

# Access templates via window.Templates["quiz"] for example, depending on the name given in
# handlebarsElems
window.Templates = {}
for name, templateStr of window.buildTemplates()
  window.Templates[name] = Handlebars.compile(templateStr)