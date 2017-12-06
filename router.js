function v_redirect(path){
    return {
        template: "<div></div>",
        created: function(){
            if(window.location.hash.startsWith("#/access_token")){
                auth0_handle();
            }

            this.$router.push(path);
        }
    };
};

const v_redirect_out = {
    template: "<div></div>",
    created:function(){
        var id = this.$route.params.id;
        var page = store.getters.page(id); 
        
        if(!page){
            return this.$router.push("/");
        }

        if(page.link){
            window.location.href = page.link;
        }else{
            this.$router.push("/page/"+id);
        }
    }
};

const router = new VueRouter({routes:[{ 
    path: "/landing", 
    component: v_Landing
},{ 
    path: "/user", 
    component: v_Wrapper, 
    children: [{ path: "", component: v_User }]
},{
    path: "/page/:id",
    component: v_Wrapper,
    children: [{ path: "", component: v_Page, name: "page" }]
},{
    path: "/contact",
    component: v_Wrapper,
    children: [{ path: "", component: v_Contact }]
},{
    path: "/contribute",
    component: v_Wrapper,
    children: [{ path: "", component: v_Contribute }]
},{
    path: "/about",
    component: v_Wrapper,
    children: [{ path: "", component: v_About }]
},{
    path: "/",
    component: v_Wrapper,
    children: [{ path: "", component: v_List }]
},{
    path: "/featured/:id",
    component: v_redirect_out
},{
    path: "/website/:id",
    component: v_redirect_out
},{ 
    path: "*", 
    component: v_redirect("/")
}]});

router.afterEach(function(to, from){
    gtag("set", {"page_path": to.fullPath});
    gtag("event", "page_view");
    window.scrollTo(0,0);
});

const app = new Vue({
    el: "#app",
    store, router
});
