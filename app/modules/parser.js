var recursive = require('recursive-readdir');
var Api = require('./../api');
var Endpoint = require('./../endpoint');
var fs = require('fs');
var path = require('path');
var protagonist = require('protagonist');
var q = require('q');

module.exports = class Parser {

    constructor() {
        this.apis = new Map()
    }

    parseBlueprint(blueprintFile) {
        var deferred = q.defer();

        protagonist.parse(fs.readFileSync(blueprintFile, 'utf8'), (err, json) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(json);
            }
        });
        return deferred.promise;
    }

    parse() {
        recursive('./mocks/', [function (file, stats) {
            return !(path.extname(file) == ".md");
        }], (err, files) => {
            for (let i = 0; i < files.length; i++) {
                let apiName = path.basename(files[i], '.md');

                let api;
                if (this.apis.has(apiName)) {
                    api = this.apis.get(apiName);
                } else {
                    api = new Api(apiName);
                }
                this.parseBlueprint(__dirname + '/../mocks/' + path.basename(files[i])).then(function (result) {
                        console.log('victoire');
                        //console.log(result);
                        // let endpoints = config[apiName].endpoints;
                        //
                        // for (let j = 0; j < endpoints.length; j++) {
                        //     let item = endpoints[j];
                        //     let endpoint = new Endpoint(item.uri, item.request, item.response);
                        //     api.addEndpoint(endpoint);
                        // }
                        //
                        // this.apis.set(apiName, api);
                    }, function (err) {
                        console.log('echec');
                    }
                ).catch(function(err) {
                    console.log(err);
                })
                    .finally(function(){
                        console.log('finally');
                    });
            }
        });

        return this;
    }

    getApis() {
        return this.apis
    }

    clear() {
        this.apis = new Map();

        return this;
    }
}
