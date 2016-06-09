
import $ from 'jquery';
import 'styles/main.scss';
import todos from 'pages/todo-backbone';
import project from 'pages/project';
import funnySquares from 'pages/funnySquares';
import formsBackbone from 'pages/formsBackbone';
import header from 'components/header';
import dayshop from 'pages/dayshop';

$(function(){

  header.init();
  
  // what page are we on?
  var url = window.location.pathname;

  // our first javascript router
  switch (url) {
    case '/pages/todo.html':
      todos.render();
    break;
    case '/pages/project.html':
      project.init();
    break;
    case '/pages/funnySquares.html':
      funnySquares.init();
    break;
    case '/pages/formsBackbone.html':
      formsBackbone.render();
    break;
    case '/pages/dayshop.html':
      dayshop.init();
    break;
    default: break;  
  }

  // Fancy Console Message for Developers

  console.log('========I am looking for a job============');
});
