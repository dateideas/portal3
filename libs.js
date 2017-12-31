/** Auth0 login system **/
var webAuth = new auth0.WebAuth({
    domain: 'ongspxm.auth0.com',
    clientID: 'U5LYZTWEZGOIoIwng2byGTSB7KeVFzQK',
    responseType: 'token id_token',
    audience: 'https://ongspxm.auth0.com/userinfo',
    scope: 'openid',
    redirectUri: window.location.href
});

function auth0_login(){
    webAuth.authorize();
}

function auth0_logout(){
    store.dispatch("clearUser");
    gtag("event", "logout");
    webAuth.logout({
        returnTo: window.location.origin + window.location.pathname
    });

    router.push("/");
}

function auth0_handle(){
    webAuth.parseHash(function(err, authRes){
        if(authRes && authRes.accessToken && authRes.idToken){
                webAuth.client.userInfo(authRes.accessToken, function(err, prof){ 
                var authManagement = new auth0.Management({
                    domain: "ongspxm.auth0.com",
                    token: authRes.idToken 
                });
                
                authManagement.getUser(prof.sub, function(err, user){ 
                    user["_tkn"] = authRes.idToken;
                    store.dispatch("updateUser", user);
                    gtag("event", "login");

                    router.push("/");
                });
            });
        }  
    });
}

/** Gtags **/
function gtag(){ 
    dataLayer.push(arguments); 
}

(function(){
    window.dataLayer = window.dataLayer || [];
    gtag("js", new Date());
    gtag("config", "UA-93698015-1", {"send_page_view": false});
})();

/** Disqus Comment System **/
var disqus_config=function(){};
function loadDisqus(page_id){
    disqus_config = function(){
        this.page.identifier = page_id;
    };
    
    var d = document, s = d.createElement("script");
    s.src = "//dateideassg.disqus.com/embed.js";
    s.setAttribute("date-timestamp", +new Date());
    (d.head || d.body).appendChild(s);
}
