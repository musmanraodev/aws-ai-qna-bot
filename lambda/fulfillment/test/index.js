/*
Copyright 2017-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Amazon Software License (the "License"). You may not use this file
except in compliance with the License. A copy of the License is located at

http://aws.amazon.com/asl/

or in the "license" file accompanying this file. This file is distributed on an "AS IS"
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied. See the
License for the specific language governing permissions and limitations under the License.
*/
var lambda=require('./setup.js')
var env=require('../../../bin/exports')()
var Promise=require('bluebird')
var _=require('lodash')

var Ajv=require('ajv')
var ajv=new Ajv()
var lexSchema=ajv.compile(require('./lex/schema'))
var alexaSchema=ajv.compile(require('./alexa/schema'))


var run=function(params,schema,test){
    return lambda(params)
        .tap(msg=>console.log(JSON.stringify(msg)))
        .tapCatch(msg=>console.log(JSON.stringify(msg)))
        .tap(test.ok)
        .tap(function(x){
            var v=schema(x)
            test.ok(v,JSON.stringify(schema.errors,null,2))
        })
        .catch(test.ifError)
        .finally(test.done)
}
var Router=new require('../lib/router')

module.exports={
    router:{
        setUp:function(done){
            this.run=function(router,test){
                Promise.promisify(router.start)
                .bind(router)(_.cloneDeep(require('./lex/lex')))
                .then(test.ok)
                .catch(test.ifError)
                .finally(test.done)
            }
            done()
        },
        empty:function(test){
            var router=new Router()
            this.run(router,test)
        },
        early:function(test){
            var router=new Router()
            this.run(router,test)
        },
        redirect:function(test){
            var router=new Router()
            this.run(router,test)
        },
        handle:function(test){
            var router=new Router()
            this.run(router,test)
        }

    },
    lex:function(test){
        run(require('./lex/lex'),lexSchema,test)
    },
    alexa:{
        start:function(test){
            run(require('./alexa/start'),alexaSchema,test)
        },
        intent:function(test){
            run(require('./alexa/intent'),alexaSchema,test)
        },
        cancel:function(test){
            run(require('./alexa/cancel'),alexaSchema,test)
        },
        end:function(test){
            run(require('./alexa/end'),ajv.compile({}),test)
        }
    }
}
