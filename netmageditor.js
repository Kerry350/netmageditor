function NetMagEditor() {
  this.savedRange = null;
  this.init();
};

NetMagEditor.prototype = {
  init: function() {
    this.setElementReferences();
    this.addEventHandlers();
  },

  // Take a couple of element references so we're not looking
  // them up over and over
  setElementReferences: function() {
    this.editor = document.getElementById('editor');
    this.toolbar = document.getElementById('toolbar');
  }, 

  addEventHandlers: function() {
    /* 
      Remember that for something more robust you wouldn't want
      to use anonymous functions, named functions would allow you
      to later remove the listeners 
    */
    this.toolbar.addEventListener('mousedown', function(e) {
      // Delegate the events
      if (e.target.webkitMatchesSelector('li')) {
        /* 
          We save the current range (if any) on mousedown as this
          event will cause the text to become de-selected within 
          our contenteditable element, so we make a note of it, 
          and re-apply it on mouseup 
        */
        this.saveCurrentRange();
      }      
    }.bind(this));

    this.toolbar.addEventListener('mouseup', function(e) {
      // Delegate the events
      if (e.target.webkitMatchesSelector('li')) {
        this.applySavedRange();
        var command = e.target.getAttribute('data-command');
        this.applyFormatting(command);
        this.setActiveButtonStates();
      }      
    }.bind(this));
  },

  saveCurrentRange: function() {
    this.savedRange = window.getSelection().getRangeAt(0);
  },

  applySavedRange: function() {
    if (this.savedRange) {
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.savedRange);
      this.savedRange = null;
    }
  },

  applyFormatting: function(command) {
    document.execCommand(command);
  },

  setActiveButtonStates: function() {
    var buttons = this.toolbar.querySelectorAll('li');

    for (var i = 0, l = buttons.length; i < l; i++) {
      var button = buttons[i];
      var command = button.getAttribute('data-command');
      var active = document.queryCommandState(command);
      
      if (active) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    }   
  }
};
