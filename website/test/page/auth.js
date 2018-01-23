var outputs=require('../../../bin/exports')('dev/master',{wait:true})
var user=require('../user-config')
var Promise=require('bluebird')

module.exports=(A)=>class auth extends A{
    login(){
        var self=this
        console.log("logging in")
        return outputs.then(function(output){
            self.client=self.client.url(output.ContentDesignerLogin)
            .execute(function(username,password){
                document.querySelector('#username').value=username
                document.querySelector('#password').value=password
                document.querySelector('input[name="signInSubmitButton"]').click()
            },user.username,user.password)
            .waitUntil(function(){
                return this.getTitle().then(title=>{
                    return title==="QnABot Designer"
                })
            },5000)
            return self.client
        })
        .tap(()=>console.log("logged in"))
    }
    logout(){
        this.client=this.client.waitForVisible('#logout-button')
        .execute(function(username,password){
            document.getElementById('logout-button').click()
        },user.username,user.password)
        return Promise.resolve(this.client)
    }
}
