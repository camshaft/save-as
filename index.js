/**
 * Module dependencies
 */
var emitter = require("emitter")
  , each = require("each");

/**
 * Defines
 */
var INIT = 0
  , WRITING = 1
  , DONE = 2
  , SAVEABLE_TYPE = "application/octet-stream";
var EVENTS = [
    "writestart"
  , "progress"
  , "write"
  , "abort"
  , "error"
  , "writeend"
];

/**
 * Current engine for the filesystem
 */
var engine;

/**
 * Show save as modal for a blob
 *
 * @param {Blob} blob
 * @param {String} name
 */
module.exports = exports = function(blob, name) {
  // Defaults
  if(!name) name = "download";

  return new SaveAs(blob, name);
};

/**
 * Set the engine for the current browser
 */
exports.engine = function(fn) {
  engine = fn;
};

function SaveAs (blob, name) {
  if(!engine) throw new Error("No file engine found.\nUse `SaveAs#engine` to enable one");

  var self = this;

  // Bind the events
  each(EVENTS, function(event) {
    var onfn = "on"+event;
    self.on(event, function() {
      if(self[onfn]) self[onfn].apply(self, arguments);
    });
  });

  // Start the initial state
  self.readyState = INIT;

  // Handle the deletion queue
  self.deletionQueue = [];

  // Set the appropriate states
  self.on("writestart", function() {
    self.readyState = WRITING;
  });
  self.on("writeend", function() {
    self.readyState = DONE;
  });

  this.implementation = engine.call(self, blob, name);
};
var proto = SaveAs.prototype;

/**
 * Inherits from emitter
 */
emitter(proto);

proto.emitAll = function () {
  var self = this;
  each(["writestart", "progress", "write", "writeend"], function (event) {
    self.emit(event);
  })
}

/**
 * Aborts saving the blob
 */
proto.abort = function() {
  this.readyState = DONE;
  if(this.implementation.abort) this.implementation.abort();
  this.emit("abort");
};
