var MyLocalStorage ={		
		Cache : {			
			put : function(key,stringVal,time){
				try{
					if(!localStorage){return false;}
					if(!time || isNaN(time)){time=60;}
					var cacheExpireDate = (new Date()-1)+time*1000;
					var cacheVal = {val:stringVal,exp:cacheExpireDate};
					localStorage.setItem(key,JSON.stringify(cacheVal));
				}catch(e){}	
			},
			get : function (key){
				try{
					if(!localStorage){return false;}
					var cacheVal = localStorage.getItem(key);
					var result = JSON.parse(cacheVal);
					var now = new Date()-1;
					if(!result){return null;}
					if(now>result.exp){
						this.remove(key);					
						return "";
					}
					return result.val;
				}catch(e){
					this.remove(key);
					return null;
				}
			},
			remove : function(key){
				if(!localStorage){return false;}
				localStorage.removeItem(key);
			},
			clear : function(){
				if(!localStorage){return false;}
				localStorage.clear();
			}
		}
    }