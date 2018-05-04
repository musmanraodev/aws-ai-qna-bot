var aws=require('../aws')
var lambda= new aws.Lambda()
var _=require('lodash')
var util=require('./util')

module.exports=function(req,res){
    var arn=util.getLambdaArn(_.get(res.result,"l",""))
    if(arn){
        console.log("Lambda PostProcess Hooks:",JSON.stringify({
            req,
            res,
            response_type:"continue"
        },null,2))
        console.log("Hook Invoking",arn)
        return lambda.invoke({
            FunctionName:arn,
            InvocationType:"RequestResponse",
            Payload:JSON.stringify({req,res})
        }).promise()
        .then(result=>{
            if(!result.FunctionError){
                var parsed=JSON.parse(result.Payload)
                console.log("Result",JSON.stringify(parsed,null,2))
                return parsed
            }else{
                throw result.FunctionError 
            }
        })
    }else{
        return {req,res}
    }
}
