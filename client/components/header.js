import $ from 'jquery';
import navbar from 'templates/navbar.html';

var app = {
  init: function(){
    app.render();
  },
  render: function(){
    $('header').append(navbar);
    // event handlers 
  }
};

module.exports = app;

// add event handler inside navbar 
