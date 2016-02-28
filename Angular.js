// Outline
// 	angular.module set up
//	Configuration
//  Basic state
//  Controller
//  Child State
//  Factory
//  Directive element
//  Directive attribute

// Set up the app <body ng-app="angularAssessment"> [Going to use $stateparams]
var app = angular.module('angularAssessment', ['ui.router']);

// Basic config
app.config(function ($urlRouterProvider, $locationProvider) {
// remove '#' from urls
	$locationProvider.html5Mode(true);
// invalid routes redirect to the root
	$urlRouterProvider.otherwise('/');
// redirect the main page to a firstState
	$urlRouterProvider.when('/', '/firstState');
});

// set up a state
app.config(function($stateProvider){
	// declares a state with this name 
	$stateProvider.state('nameOfirstState', {
		//sets based on what's in the uri
		url: '/firstState',
		// designates the locaiton of the html
		templateURL: '/app/templates/firstState.html',
		// designates which controller will have scope
		controller: 'firstStateCtrl',
		// this is like a miniture factory that is sent to the controller
		resolve: {
			injectableNamefromState: function(Factory) {
				return Factory.getAll();
			}
		}
	});
});

app.controller('firstStateCtrl', function ($state, $scope, injectableNamefromState, Factory) {
	// sets the resolved data onto the scope
	$scope.injectableNamefromState = injectableNamefromState;

	// get the Item from the form
	$scope.addItem = function(Item){
		// let the factory interact with the database
		Factory.add(Item)
		.then(function(data){
			// move to the state named 'firstState.child' and set the :paramId to data._id}
			return $state.go('firstState.child', {paramId: data._id});
		});
	};

});

// set up a child state
app.config(function($stateProvider){
	// declares a state with this name . means child
	$stateProvider.state('firstState.child', {
		//drop the /firstState because this is a child of that one
		url: ':paramId',
		// designates the locaiton of the html
		templateURL: '/app/templates/oneItem.html',
		// designates which controller will have scope
		controller: 'oneItemCtrl',
		// use $stateParams to access the params in the url
		resolve: {
			injectableName: function(Factory, $stateParams) {
				return Factory.getById($stateParams.paramId);
			}
		}
	});
});


// set up factory with standard CRUD operations
app.factory('Factory', function ($http) {
	// var cachedItems = [];
	// I'm not sure if these commented out parts work for caching data

	 return {
	 	getById: function(id){
	 		return $http.get('/api/items/' + id)
	 		.then(res => res.data);
	 		// => is ES6!
	 	},
	 	delete: function(id){
	 		return $http.delete('/api/items/' + id)
	 		.then(res => res.data)
	 		// .then(function(data){
	 		// 	angular.copy(cachedItems.filter(function(item){
	 		// 		return item._id!==id;
	 		// 	}), cachedItems);

	 		// 	return data;
	 		// });
	 	},
	 	add: function(data){
	 		return $http.post('/api/items/', data)
	 		.then(res => res.data)
	 		// .then(function(item){
	 		// 	cachedItems.push(item);
	 		// 	return item;
	 		// });
	 	},
	 	update: function(id, data){
	 		return $http.put('/api/items/'+ id, data)
	 		.then(res => res.data);
	 	},
	 	getAll: function(){
	 		return $http.get('/api/items/')
	 		.then(res => res.data)
	 		// .then(function(items){
	 		// 	return angular.copy(items, cachedItems);
	 		// });
	 	}

	 }; 
 });



// Name of directive is called:  b.c 'E'
// <todo-item ng-repeat="todo in todos | filter: {complete: filterByCompleted}" the-todo="todo"></todo-item>

app.directive('todoItem', todoItemDirective = function () {
	return {
		restrict: "E",
		templateUrl: '/app/todos/item/todo.item.html',
		scope: {
			// received from the-todo="todo" will be called theTodo in the scope now
			theTodo: '='
		},
		link: function(scope){
  			// Could use scope.theTodo in here.
  		}

	};
});



// Name of directive is called: ng-enter="toggleComplete()" b.c 'A'
app.directive('ngEnter', ngEnterDirective = function () {
  return {
  	// restricted to A = attribute, E = element, C = class
  	restrict: 'A',
  	// these are received from the html when calling the directive
  	scope: {
  		// this sets the functon of ngEnter to toggleComplete()
  		ngEnter: '&'
  	},
  	// link can accept the scope, element, and attribute
  	link: function(scope, element){
  		// jquery event listener
  		element.on('keydown', function(event){
  			// 13 is enter key
  			if ( event.which == 13 ) {
  				// run the function
			     scope.ngEnter();
			  }
  		});

  	}
  };
});
