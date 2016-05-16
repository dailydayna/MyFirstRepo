
import $ from 'jQuery';
import _ from 'underscore';
import Handlebars from 'handlebars';
import rawTemplate from 'templates/funnySquare.html';

var template; 
var app = {
  init: function(){
    app.prepareTemplate();
    app.render();
  },
  render: function(){
    // display 6 squares
    var numberOfSquares = 6;
    var renderedHtml = '';
    _.times(numberOfSquares, function(index){
      renderedHtml += template({ id: index });
    });
    $('body').append(renderedHtml);

  },
  prepareTemplate: function(){
    template = Handlebars.compile(rawTemplate);
  }
};

module.exports = app;
