var messages = angular.module('messages', ['ui.router', 'ui.bootstrap']);

messages.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/messages");
    $stateProvider
          .state('messages', {url: "/messages", templateUrl: "messages.html"})
          .state('new', {url: "/new", templateUrl: "new.html"});
  }]);

messages.controller('NavController', ['$scope', '$state', 'MessagesService', function($scope, $state, MessagesService) {
  $scope.init = function() {
    $scope.$state = $state;
    MessagesService.getMessages().then(function(data){
       if(data)
       {
           $scope.total = data.length;
       }
       else
       {
           $scope.total = 0;
       }
    });
  };
}]);

messages.service('MessagesService', function ($http) {
    this.getMessages = function () {
        return $http.get("api/messages").then(function success(response) {
            return response.data;
        });
    };
    
    this.getMessage = function (id) {
        return $http.get("api/messages/" + id).then(function success(response) {
            return response.data;
        });
    };
    
    this.removeMessage = function (id) {
        return $http.delete("api/messages/" + id).then(function success(response) {
            return response.data;
        });
    };
    
    this.createMessage = function (subject, body) {
        return $http.post("api/messages", {subject: subject, body: body}).then(function success(response) {
            return response;
        });
    };
});

messages.controller('MessagesController', ['$scope', '$state', 'MessagesService', function($scope, $state, MessagesService){
    $scope.init = function() {
       MessagesService.getMessages().then(function(data){
          $scope.messages = data; 
       }); 
    }; 
    
    $scope.selectMessage = function(message) {
       $scope.selectedMessage = message;  
    };
    
    $scope.removeMessage = function(message) {
       MessagesService.removeMessage(message.id).then(function(response){
         MessagesService.getMessages().then(function(data){
           $scope.messages = data; 
         });  
       });
    };
}]);

messages.controller('NewMessageController', ['$scope', '$state', 'MessagesService', function($scope, $state, MessagesService){
    $scope.createMessage = function() {
       MessagesService.createMessage($scope.subject, $scope.body).then(function(response){
           $state.go('messages');
       });
    };
}]);

messages.provider('requestNotification', function() {
  // This is where we keep subscribed listeners
  var onRequestStartedListeners = [];
  var onRequestEndedListeners = [];

  // This is a utility to easily increment the request count
  var count = 0;
  var requestCounter = {
    increment: function() {
      count++;
    },
    decrement: function() {
      if (count > 0) {
        count--;
      }
    },
    getCount: function() {
      return count;
    }
  };

  // Subscribe to be notified when request starts
  this.subscribeOnRequestStarted = function(listener) {
    onRequestStartedListeners.push(listener);
  };

  // Tell the provider, that the request has started.
  this.fireRequestStarted = function(request) {
    // Increment the request count
    requestCounter.increment();
    //run each subscribed listener
    angular.forEach(onRequestStartedListeners, function(listener) {
      // call the listener with request argument
      listener(request);
    });
    return request;
  };

  // this is a complete analogy to the Request START
  this.subscribeOnRequestEnded = function(listener) {
    onRequestEndedListeners.push(listener);
  };

  this.fireRequestEnded = function() {
    requestCounter.decrement();
    var passedArgs = arguments;
    angular.forEach(onRequestEndedListeners, function(listener) {
      listener.apply(this, passedArgs);
    });
    return arguments[0];
  };

  this.getRequestCount = requestCounter.getCount;

  //This will be returned as a service
  this.$get = function() {
    var that = this;
    // just pass all the
    return {
      subscribeOnRequestStarted: that.subscribeOnRequestStarted,
      subscribeOnRequestEnded: that.subscribeOnRequestEnded,
      fireRequestEnded: that.fireRequestEnded,
      fireRequestStarted: that.fireRequestStarted,
      getRequestCount: that.getRequestCount
    };
  };
});


messages.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(['$q', 'requestNotification', function($q, requestNotification) {

        return {
          'request': function(config) {
            requestNotification.fireRequestStarted();
            return config;
          },
          'response': function(response) {
            requestNotification.fireRequestEnded();
            return response;
          },
          'responseError': function(rejection) {
            requestNotification.fireRequestEnded();

            var status = rejection.status;

            if (status === 401) {
              window.location = "./index.html";
            }

            // otherwise
            return $q.reject(rejection);
          }
        };
      }]);

    $httpProvider.interceptors.push(function() {
      return {
        request: function(config) {
          if ('GET' !== config.method) {
            return config;
          }

          if (config.url.match(/(js\/|css\/|img\/|font\/)/g)) {
            var seperator = config.url.indexOf('?') === -1 ? '?' : '&';
            config.url = config.url + seperator + 'v=VERSION_TOKEN';
          }
          return config;
        }
      };
    });
  }]);