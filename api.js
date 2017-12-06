var api = {
    base: "//dateideas.herokuapp.com",
    send: function(api, func, handle_err){
        var xhr = new XMLHttpRequest(); 
        xhr.open("GET", this.base+api); 
        xhr.setRequestHeader("Authorization", "Bearer "+store.state.user._tkn);

        xhr.onreadystatechange = function(){
            if(xhr.readyState==4){
                var obj = JSON.parse(this.response);
                if(!obj.ok && !handle_err){ 
                    console.log(obj);
                }else{
                    func(obj);
                }
                
                store.commit("setLoading", false);
            } 
        };
        xhr.send();
    },
    
    getPage: function(id, func){ this.send("/content?id="+id, func); },
    getPreview: function(func){ this.send("/preview", func); },
    getList: function(func){ this.send("/list", func); },
    getSaves: function(func){ this.send("/listsave", func); },
    getUser: function(func){ this.send("/user", func); },
    setSave: function(id){
        this.send("/save?state=save&pid="+id, function(){});
    },
    setUnsave: function(id){
        this.send("/save?state=unsave&pid="+id, function(){});
    },

    smsPhone: function(number, func){
        this.send("/sms_check?num=65"+number, func, true);
        gtag("event", "sms", {
            "event_category": "phone",
            "event_label": store.state.user.user+'|'+number
        });
    },
    smsCode: function(number, func){
        this.send("/sms_confirm?code="+number, func, true);
        gtag("event", "sms", {
            "event_category": "code",
            "event_label": store.state.user.user+'|'+number
        });
    }
};

(function(){
    if(window.location.host.startsWith("localhost")){
        api.base = "//localhost:8080"; 
    }
})();
