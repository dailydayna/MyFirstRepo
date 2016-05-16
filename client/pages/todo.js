
var $ = require('jquery');

//  legacy loading for bootstrap for es5
window.jQuery = window.$ = $;
require('bootstrap');

import _ from 'underscore';
import Handlebars from 'handlebars';
import lscache from 'lscache';
import rawTemplate from 'templates/todoItem.html';

var savedData = lscache.get('todos');
var todos;
if (savedData === null){
  todos = [];
} else {
  todos = savedData;
}

//  Application controller aka the one main object that stores everything our app needs
var template;
var app = {
  init: function(){
    app.compileTemplates();
    app.render();
  },
  render: function(){
    //  render the todos
    lscache.set('todos', todos);
    //  we are createating a keyvalue pair on line 28
    var todoHtml = _.map(todos, function(toDo){
     return template(toDo);
     // the return value ends up being HTML code
   });
    app.unbindEvents();
    $('ul.list-group').html(todoHtml.join(''));
    app.bindEvents();
  },
  unbindEvents: function(){
    $('.list-group-item').off();
    $('.add-todo-container button').off();
    $('input[type="checkbox"]').off();
    $('.add-todo-container button').off();
    $('title-edit input').off();
  },
  compileTemplates: function(){
    template = Handlebars.compile(rawTemplate);
  },
  bindEvents: function(){
    app.bindHoverEvents();
    app.bindCheckboxEvents();
    app.bindAddTodoEvents();
    app.bindRemoveTodoEvents();
    app.bindTitleEditEvents();
  },
  bindHoverEvents: function(){
    var $items = $('.list-group-item');
    $items.on('mouseover', function(){
      $(this).addClass('list-group-item-success');
    });
    $items.on('mouseout', function(){
      $(this).removeClass('list-group-item-success');
    });
  },
  bindCheckboxEvents: function(){
    var $checkboxes = $('input[type="checkbox"]');
    $checkboxes.on('change', function(){
      var isChecked = !$(this).is(':checked');
      if (isChecked) {
        //  if a checkbox is checked, remove the check
        $(this).parent().parent().removeClass('disabled');
      } else {
        $(this).parent().parent().addClass('disabled');
      }
    });
  },
  bindAddTodoEvents: function(){
    $('.add-todo-container button').on('click', function(){
      var newTodoTitle = $('.add-todo-container input').val();
      if (_.isString(newTodoTitle) && newTodoTitle.length > 2){
        var newTodoObject = { 
          id: todos.length, 
          title: newTodoTitle, 
          completed: false 
        };
        todos.push(newTodoObject);
        $('.add-todo-container input').val('');
        app.render();
      }

    });
  },
  bindRemoveTodoEvents: function(){
    $('.list-group-item button').on('click', function(){
      var index = $(this).parent().parent().index();
      todos.splice(index, 1);
      app.render();
    });
  },
  bindTitleEditEvents: function(){
    $('.title').on('click', function(){
      var $parent = $(this).parent();
      $parent.find('.title').addClass('hidden');
      $parent.find('.title-edit').removeClass('hidden');
    });
    $('.title-edit input').on('keypress', function(event){
      var key = event.which;
      if (key === 13){
        var $parent = $(this).parent().parent();
        $parent.find('.title').removeClass('hidden');
        $parent.find('.title-edit').addClass('hidden');
        var newTitle = $(this).val();
        var editId = $(this).attr('data-id');
        editId = parseInt(editId, 10);
        // update todo item with new title  
        var editTodo = _.filter(todos, function(todo){
          if (todo.id === editId){
            return true;
          }
          return false;
        });
        editTodo = editTodo[0];
        editTodo.title = newTitle;
        app.render();       
      }

    });
  }
};

module.exports = app;

