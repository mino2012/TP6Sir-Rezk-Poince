var pokeApp = angular.module('pokedex', ['ngResource']);

// With this you can inject POKEAPI url wherever you want
pokeApp.constant('POKEAPI', 'https://pokeapi.co/api/v2/');

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

pokeApp.controller('listePoke', function($scope, $resource, POKEAPI, selectPoke) {
    var apiPoke = $resource(POKEAPI + "pokemon/?limit=151");
    apiPoke.get().$promise.then(function(results){
        $scope.pokemons = results.results;
    });
    $scope.getNamePoke = function(selectedPoke) {
        selectPoke.findPoke(selectedPoke)
    };
});

pokeApp.controller('pokeChoice', function($scope, selectPoke) {
    $scope.$watch(function(){
        return selectPoke.getPokemon()
    }
    ,function (newPoke){
        $scope.pokemon = newPoke;
    });
});

pokeApp.factory('selectPoke', function($resource, $log, $rootScope){
    var pokemon = {};
    var description = {};

    function findPoke(url){
        var apiPoke = $resource(url);
        apiPoke.get().$promise.then(function(result){
            pokemon = result;
            var descApi = $resource(result.species.url);
            descApi.get().$promise.then(function(result){
                var description = result.flavor_text_entries.find(function(m){
                    return m.language.name === "fr";
                });
                pokemon.description = description.flavor_text;
            });
        });
    }

    function getPokemon(){
        return pokemon;
    }

    return {findPoke: findPoke, getPokemon: getPokemon}
});


pokeApp.directive('pokedex', function() {
    return {
        templateUrl: 'pokedex.html'
    };
});