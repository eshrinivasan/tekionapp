
var app = angular.module('app', ['ui.router']);

(function() {
    'use strict';

    app.config(configure)
        .run(runApp);

    configure.$inject = ['$httpProvider', '$urlRouterProvider', '$stateProvider'];
    runApp.$inject = ['$rootScope', '$state', '$stateParams'];

    function configure($httpProvider, $urlRouterProvider, $stateProvider) {
        var checkUserRole = function($q, $timeout, $http, $location) {
          var deferred = $q.defer();

          $http.get('/api/status').success(function(user) {
            // Authenticated
                if(user)
                    deferred.resolve(user);
                else {
                    deferred.reject;
                    $location.url('/login');
                }
              });

              return deferred.promise;
            };

        var report = {
            name: 'report',
            url: '/',
            templateUrl: 'javascripts/partials/cover.html',
            controller: 'reportController',
            resolve: {
              loggedin: function($q, $timeout, $http, $location) {
                    return checkUserRole($q, $timeout, $http, $location)
                }
            }
        };           


        $stateProvider
            .state(report);

        $urlRouterProvider.otherwise('/');

    }

    function runApp($rootScope, $state, $scope, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }


    app.controller('reportController', function($scope, $http, $rootScope, $state, loggedin){
        $scope.loggedin = loggedin;
        $scope.templateURL = 'javascripts/partials/'+loggedin+'.html';
        $scope.formData = {};

        // when landing on the page, get all todos and show them - for Quality role
         $http.get('/todos')
            .success(function(data) {
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        
         // when submitting the add form, send the text to the node API
            $scope.createTodo = function() {
                $http.post('/todos', $scope.formData)
                    .success(function(data) {
                        $scope.formData = {}; 
                        $scope.todos = data;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
            };

        $scope.chartDisplay = "Sales Chart";

        $scope.salesData=[
            {hour: 1,sales: 54},
            {hour: 2,sales: 66},
            {hour: 3,sales: 77},
            {hour: 4,sales: 70},
            {hour: 5,sales: 60},
            {hour: 6,sales: 63},
            {hour: 7,sales: 55},
            {hour: 8,sales: 47},
            {hour: 9,sales: 55},
            {hour: 10,sales: 30}
        ];
    });

    


})();


