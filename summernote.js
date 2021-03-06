/**
 * summernote.js
 * (c) 2013~ Youngteac Hong
 * summernote may be freely distributed under the MIT license./
 */
"use strict";
(function(root) {
  var $ = jQuery;
  
  /**
   * Editor
   */
  var Editor = function() {
    var makeExecCommand = function(sCmd) {
      return function() { document.execCommand(sCmd); }
    };
    
    this.bold = makeExecCommand('bold');
    this.italic = makeExecCommand('italic');
    this.underline = makeExecCommand('underline');
    this.justifyLeft = makeExecCommand('justifyLeft');
    this.justifyCenter = makeExecCommand('justifyCenter');
    this.justifyRight = makeExecCommand('justifyRight');
    this.insertOrderedList = makeExecCommand('insertOrderedList');
    this.insertUnorderedList = makeExecCommand('insertUnorderedList');
    this.indent = makeExecCommand('indent');
    this.outdent = makeExecCommand('outdent');
  };
  var editor = new Editor();
  
  /**
   * EventHandler
   *
   * handle keydown event on editable area
   */
  var EventHandler = function() {
    var key = { B: 66, I: 73, U: 85 };

    var hKeydown = function(event) {
      if(event.metaKey && event.keyCode === key.B) { // bold
        editor.bold();
      } else if(event.metaKey && event.keyCode === key.I) { // italic
        editor.italic();
      } else if(event.metaKey && event.keyCode === key.U) { // underline
        editor.underline();
      } 
    };

    /**
     * ancestor
     * find nearest ancestor predicate hit
     */
    var ancestor = function(node, pred) {
      while (node) {
        if(pred(node)) { return node; }
        node = node.parentNode;
      }
      return null;
    };
    
    var hToolbarClick = function(event) {
      var elBtn = ancestor(event.target, function(node) {
        return $(node).attr('data-event');
      });
      
      if (elBtn) {
        editor[$(elBtn).attr('data-event')]();
      }
    };

    this.attach = function(layoutInfo) {
      layoutInfo.editable.bind('keydown', hKeydown);
      layoutInfo.toolbar.bind('click', hToolbarClick);
    };

    this.dettach = function(layoutInfo) {
      layoutInfo.editable.unbind('keydown');
      layoutInfo.toolbar.unbind('click');
    };
  };

  /**
   * Renderer
   *
   * rendering toolbar and editable
   */
  var Renderer = function() {
    var sToolbar = '<div class="note-toolbar btn-toolbar">' + 
                     '<div class="note-style btn-group">' +
                       '<button class="btn btn-small" data-event="bold"><i class="icon-bold"></i></button>' +
                       '<button class="btn btn-small" data-event="italic"><i class="icon-italic"></i></button>' +
                       '<button class="btn btn-small" data-event="underline"><i class="icon-underline"></i></button>' +
                     '</div>' +
                     '<div class="note-para btn-group">' +
                       '<button class="btn btn-small" data-event="justifyLeft"><i class="icon-align-left"></i></button>' +
                       '<button class="btn btn-small" data-event="justifyCenter"><i class="icon-align-center"></i></button>' +
                       '<button class="btn btn-small" data-event="justifyRight"><i class="icon-align-right"></i></button>' +
                     '</div>' +
                     '<div class="note-list btn-group">' +
                       '<button class="btn btn-small" data-event="insertUnorderedList"><i class="icon-list-ul"></i></button>' +
                       '<button class="btn btn-small" data-event="insertOrderedList"><i class="icon-list-ol"></i></button>' +
                       '<button class="btn btn-small" data-event="outdent"><i class="icon-indent-left"></i></button>' +
                       '<button class="btn btn-small" data-event="indent"><i class="icon-indent-right"></i></button>' +
                     '</div>' +
                     '<div class="note-insert btn-group">' +
                       '<button class="btn btn-small"><i class="icon-picture"></i></button>' +
                       '<button class="btn btn-small"><i class="icon-link"></i></button>' +
                       '<button class="btn btn-small"><i class="icon-table"></i></button>' +
                     '</div>' +
                   '</div>';
 
    /**
     * createLayout
     */
    var createLayout = this.createLayout = function(welHolder, nHeight) {
      //already created
      if (welHolder.next().hasClass('note-editor')) { return; }
      
      //01. create Editor
      var welEditor = $('<div class="note-editor"></div>');

      //02. create Editable
      var welEditable = $('<div class="note-editable" contentEditable="true"></div>').prependTo(welEditor);
      if (nHeight) { welEditable.height(nHeight); }

      welEditable.html(welHolder.html());
      
      //03. create Toolbar
      var welToolbar = $(sToolbar).prependTo(welEditor);
      
      //04. Editor/Holder switch
      welEditor.insertAfter(welHolder);
      welHolder.hide();
    };
    
    /**
     * layoutInfo
     */
    var layoutInfo = this.layoutInfo = function(welHolder) {
      var welEditor = welHolder.next();
      if (!welEditor.hasClass('note-editor')) { return; }
      
      // editorInfo
      return {
        editor: welEditor,
        editable: welEditor.find('.note-editable'),
        toolbar: welEditor.find('.note-toolbar')
      }
    };
    
    /**
     * removeLayout
     */
    var removeLayout = this.removeLayout = function(welHolder) {
      var info = layoutInfo(welHolder);
      if (!info) { return; }
      welHolder.html(info.editable.html());
      
      info.editor.remove();
      welHolder.show();
    };
  };

  var renderer = new Renderer();
  var eventHandler = new EventHandler();

  /**
   * summernote 
   *
   * create Editor Layout and attach Key and Mouse Event
   */
  $.fn.summernote = function(options) {
    options = options || {};
    
    // createLayout
    renderer.createLayout(this, options.height);
    
    var info = renderer.layoutInfo(this);
    eventHandler.attach(info);
    
    if(options.focus) { info.editable.focus(); } // options focus
  };
  
  /**
   * code
   *
   * get the HTML contents of note or set the HTML contents of note.
   */
  $.fn.code = function(sHTML) {
    var info = renderer.layoutInfo(this);
    
    //get the HTML contents
    if (sHTML === undefined) {
      return info.editable.html();
    }
    
    // set the HTML contents
    info.editable.html(sHTML);
  };
  
  /**
   * finish
   */
  $.fn.destory = function() {
    var info = renderer.layoutInfo(this);
    eventHandler.dettach(info);
    renderer.removeLayout(this);
  };
})();
