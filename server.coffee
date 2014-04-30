# Server for project

express = require("express")
logfmt = require("logfmt")
uuid = require('node-uuid')
app = express()
server = require('http').createServer(app)

app.use(logfmt.requestLogger())
app.use(express.bodyParser())

# Helper Functions

normalizeURL = (urlRaw) ->
  urlNormal = urlRaw
  return urlNormal.replace(/([\?#].*$)/gi, "")

generateId = () ->
  return uuid.v1()

#####################
# Server code

app.get '/', (req, res) ->
  res.sendfile('dashboard/index.html')

app.get '/bookmarklet/:file(*)', (req, res) ->
  res.sendfile('bookmarklet/' + req.params.file)

app.get '/dashboard/:file(*)', (req, res) ->
  res.sendfile('dashboard/' + req.params.file)

app.get '/bookmarklet/compiled/:file', (req, res) ->
  res.sendfile('bookmarklet/compiled/' + req.params.file)
app.get '/bookmarklet/library/:file', (req, res) ->
  res.sendfile('bookmarklet/library/' + req.params.file)

app.get '/dashboard/compiled/:file', (req, res) ->
  res.sendfile('dashboard/compiled/' + req.params.file)
app.get '/dashboard/library/:file', (req, res) ->
  res.sendfile('dashboard/library/' + req.params.file)

# Create a new peer for the given url
app.post '/new_peer', (req, res) ->
  if not req.body.hasOwnProperty("full_url") or not req.body.hasOwnProperty("page_id")
    res.send(500, { error: "Must specify full_url and page_id parameters" })
    return

  # result = onPeerConnected(req.body.full_url, req.body.page_id)
  res.send(JSON.stringify(result))

port = process.env.PORT || 5000

server.listen port, ->
  console.log("Listening on " + port)

# Delete myself as a peer, given my peer id and the url id that I'm part of
# app.post '/delete_peer', (req, res) ->
#   res.header("Access-Control-Allow-Origin", "*")  # Allow cross-site scripting here
#   TODO Do useful stuff
#   if not (req.body.hasOwnProperty("page_id"))
#     res.send(500, { error: "Must specify page_id parameter" })
#     return

