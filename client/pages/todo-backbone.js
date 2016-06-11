var $ = require('jquery');

//  legacy loading for bootstrap for es5
window.jQuery = window.$ = $;
require('bootstrap');

import _ from 'underscore';
import Backbone from 'backbone';
import Handlebars from 'handlebars';
import lscache from 'lscache';
import todoItemTemplate from 'templates/todoItem.html';

// Backbone Todo App 

var TodoModel;
var TodoControllerView;
var TodoView;
var TodoItemView;

var todoModel;
var todoControllerView;

// Model

TodoModel = Backbone.Model.extend({
  defaults: {
    todos: []
  },
  todoSchema: {
    id: 0,
    title: '',
    completed: false
  },
  fetch: function(){
    var data = lscache.get('todos');
    data = this.applySchema(data);
    this.set('todos', data);
  },
  save: function(){
    var data = this.get('todos');
    data = this.applySchema(data);
    lscache.set('todos', data);
  },
  applySchema: function(todos){
    var data = todos;
    var schema = this.todoSchema;
    data = (_.isArray(todos)) ? data : [];
    data = data.map(function(todo, index){
      todo.id = index;
      return _.defaults(todo, schema); 
    });
    return data;
  },
  addItem: function(newTitle){
    var newTodo = {title: newTitle};
    var todos = this.get('todos');
    todos.push(newTodo);
    this.set('todos', todos);
    this.save();
  },
  removeItem: function(id){
    // finally remove the damn thing
    var todos = this.get('todos');
    todos.splice(id, 1);
    this.save();
  },
  itemCompleted: function(id, isCompleted){
    var todos = this.get('todos');
    var item = _.findWhere(todos, {id: id});
    item.completed = isCompleted;
    this.set('todos', todos);
    this.save();
  }
});
  
todoModel = new TodoModel();


 // view

TodoControllerView = Backbone.View.extend({
  el: '.todo-container',
  model: todoModel,
  events: {
    'click .btn-add': 'addTodoItem'
  },
  initialize: function(){
    this.model.fetch();
  },
  render: function(){
    // render the todo items 
    var todos = this.model.get('todos');
    var $ul = this.$el.find('ul');
    $ul.html('');
    todos.map(function(todo){
      var view = new TodoItemView(todo);
      $ul.append(view.$el);
    });
  },
  addTodoItem: function(){
    var $input = this.$el.find('.input-name');
    var newTitle = $input.val();
    if (newTitle === '') { return; }
    this.model.addItem(newTitle);
    $input.val('');
    this.render();
  },
  removeItem: function(id){
    this.model.removeItem(id);
    this.render();
  },
  itemCompleted: function(id, isCompleted){
    this.model.itemCompleted(id, isCompleted);
    this.render();
  }
});

TodoItemView = Backbone.View.extend({
  tagName: 'li', // el = <li></li>
  className: 'list-group-item row',
  events: {
    'click .close': 'removeItem',
    'change .completed-checkbox': 'completedClicked'
  },
  template: Handlebars.compile(todoItemTemplate),
  initialize: function(todo){
    this.data = todo;
    this.render();
  },
  render: function(){
    this.$el.html(this.template(this.data));
    this.$el.toggleClass('disabled', this.data.completed);
  },
  removeItem: function(){
    todoControllerView.removeItem(this.data.id);
  },
  completedClicked: function(event){
    var isChecked = $(event.target).is(':checked');
    todoControllerView.itemCompleted(this.data.id, isChecked);
  }
});

todoControllerView = new TodoControllerView(); // it calls ViewClass.initialize

module.exports = todoControllerView;


