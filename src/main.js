var CodeMirror = require('codemirror');
require('codemirror/mode/javascript/javascript');
require('codemirror/lib/codemirror.css');
require('codemirror/theme/monokai.css');

require('./main.scss');
var AS3JS = require('as3js');
var beautify = require('js-beautify').js_beautify;
// as3.js needs to be a window global
window.AS3JS = require('as3js/lib/as3');

// Grab DOM elements
var evalInput = document.getElementById('eval');
var entryInput = document.getElementById('entry');
var inputTextArea = document.getElementById('input');
var outputTextArea = document.getElementById('output');
var examplesDropdown = document.getElementById('examples');
var timeout = null;

// Set up CodeMirror
var inputCode = CodeMirror.fromTextArea(inputTextArea, {
  theme: 'monokai',
  lineNumbers: true,
  mode: 'javascript'
});
var outputCode = CodeMirror.fromTextArea(outputTextArea, {
  theme: 'monokai',
  lineNumbers: true,
  mode: 'javascript'
});

// Function to compile input text
var processText = function () {
  inputCode.save();
  clearTimeout(timeout);
  var success = false;
  var outputText;
  var as3js = new AS3JS();
  var inputText = inputTextArea.value;
  var rawPackages = inputText.split(/\/\*\s+AS3JS\s+File\s+\*\//);
  for (var i = 0; i < rawPackages.length; i++) {
    if (rawPackages[i].match(/^\s*$/g)) {
      rawPackages.splice(i--, 1);
    }
  }

  try {
    outputText = as3js.compile({
      rawPackages: rawPackages,
      silent: true,
      verbose: false,
      safeRequire: true,
      entry: entryInput.value.replace(/\s*/g, ""),
      entryMode: 'instance'
    }).compiledSource;
    success = true;
  } catch(e) {
    outputText = e.toString();
  }
  outputTextArea.value =  beautify(outputText, { indent_size: 2, max_preserve_newlines: 2 });
  outputCode.setValue(outputTextArea.value);

  if (success && evalInput.checked) {
    // Need to execute in context of window
    try {
      eval.call(null, outputText);
    } catch(e) {
      console.error(e);
    }
  }
};

// Show example dropdowns
var updateExample = function () {
  var sourceCode = document.getElementById(examplesDropdown.value);
  var entry = sourceCode.getAttribute('data-entry');
  entryInput.value = entry;
  inputCode.setValue(sourceCode.text);
};

// Set up events
var refresh = function () {
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(function () {
    processText();
  }, 500);
};
entryInput.addEventListener('keydown', refresh);
inputCode.on('change', function (instance, evt) {
  refresh();
});
examplesDropdown.addEventListener('change', function (evt) {
  updateExample(evt.currentTarget.value);
});

// Process the initial text
updateExample();
processText();