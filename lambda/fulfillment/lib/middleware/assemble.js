var Promise=require('bluebird')
var lex=require('./lex')
var alexa=require('./alexa')
var es=require('./es')
var aws=require('../aws')
var lambda= new aws.Lambda()
var _=require('lodash')

module.exports=function response(req,res){
    return new Promise(function(resolve,reject){
        if(process.env.LAMBDA_LOG){
            lambda.invoke({
                FunctionName:process.env.LAMBDA_LOG,
                InvocationType:"Event",
                Payload:JSON.stringify({req,res})
            })
            .promise()
            .then(resolve)
            .catch(reject)
        }else{
            resolve()
        }
    })
    .then(function(){
        if(process.env.LAMBDA_RESPONSE){
            return lambda.invoke({
                FunctionName:process.env.LAMBDA_RESPONSE,
                InvocationType:"RequestResponse",
                Payload:JSON.stringify(res)
            }).promise()
            .then(result=>{
                _.merge(res,JSON.parse(result.Payload))
            })
        }
    })
    .tap(()=>console.log("final:",JSON.stringify(out,null,2)))
}
