(function() {
    'use strict';

    var app = angular.module('app', ['ui.router']);

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
                console.log(data);
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
                        console.log(data);
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

    /* Directive for Chart display for Sales role*/
    app.directive('linearChart', function($window){
       return{
          restrict:'EA',
          template:"<svg width='850' height='200'></svg>",
           link: function(scope, elem, attrs){
               var salesDataToPlot=scope[attrs.chartData];
               var padding = 20;
               var pathClass="path";
               var xScale, yScale, xAxisGen, yAxisGen, lineFun;

               var d3 = $window.d3;
               var rawSvg=elem.find('svg');
               var svg = d3.select(rawSvg[0]);

               function setChartParameters(){

               xScale = d3.scale.linear()
                   .domain([salesDataToPlot[0].hour, salesDataToPlot[salesDataToPlot.length-1].hour])
                   .range([padding + 5, rawSvg.attr("width") - padding]);

               yScale = d3.scale.linear()
                   .domain([0, d3.max(salesDataToPlot, function (d) {
                       return d.sales;
                   })])
                   .range([rawSvg.attr("height") - padding, 0]);

               xAxisGen = d3.svg.axis()
                   .scale(xScale)
                   .orient("bottom")
                   .ticks(salesDataToPlot.length - 1);

               yAxisGen = d3.svg.axis()
                   .scale(yScale)
                   .orient("left")
                   .ticks(5);

               lineFun = d3.svg.line()
                   .x(function (d) {
                       return xScale(d.hour);
                   })
                   .y(function (d) {
                       return yScale(d.sales);
                   })
                   .interpolate("basis");
           }
         
         function drawLineChart() {

               setChartParameters();

               svg.append("svg:g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0,180)")
                   .call(xAxisGen);

               svg.append("svg:g")
                   .attr("class", "y axis")
                   .attr("transform", "translate(20,0)")
                   .call(yAxisGen);

               svg.append("svg:path")
                   .attr({
                       d: lineFun(salesDataToPlot),
                       "stroke": "blue",
                       "stroke-width": 2,
                       "fill": "none",
                       "class": pathClass
                   });
           }

           drawLineChart();
               }
           };
        });


})()


