var module = angular.module("testApp", []);
module.controller("testController", function ($scope) {
	$scope.message = window.message;
	$scope.ready = true;
});