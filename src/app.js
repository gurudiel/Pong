var HelloWorldLayer = cc.Layer.extend({
    jugador1:null,    
    jugador2:null,    
    pelota:null,    
    puntuacion1:null,
    puntuacion2:null,
    rapidez:null,
    
    inicializar:function(){
        
        var size = cc.winSize;
        var color = cc.color(123,114,056);
        this.rapidez = 2;

        this.jugador1 =  new cc.DrawNode();      this.jugador1.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador1.setPosition(size.width * 0.1,size.height / 2); this.addChild(this.jugador1, 1);

        this.jugador2 =  new cc.DrawNode();
        this.jugador2.drawRect(cc.p(0,0),cc.p(20,100),color,3);
        this.jugador2.setPosition(size.width -(size.width * 0.1),size.height / 2);        
        this.addChild(this.jugador2, 1);        

        var lineaDivisoria =  new cc.DrawNode();
        lineaDivisoria.drawSegment(cc.p(size.width/2,0),cc.p(size.width/2,size.height),3,color);        
        this.addChild(lineaDivisoria,0);
        
        this.pelota =  new cc.DrawNode();
        this.pelota.drawCircle(cc.p(0,0),5,0,100,false,10,color);
        this.pelota.setPosition(size.width / 2, size.height / 2);     this.addChild(this.pelota, 1);
        
        var desplazamiento = cc.moveTo(this.rapidez, -13,
        this.alazar(0, size.height));
        this.pelota.runAction(desplazamiento);

        this.puntuacion1 = new cc.LabelTTF("0","Courrier",35);
        this.puntuacion1.setPosition(size.width * 0.4, size.height - (size.height * 0.10));
        this.addChild(this.puntuacion1,0);
        
        this.puntuacion2 = new cc.LabelTTF("0","Courrier",35);
        this.puntuacion2.setPosition(size.width - (size.width * 0.4), size.height - (size.height * 0.10));        
        this.addChild(this.puntuacion2,0);
     },
     
    alazar: function randomizer(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
    
    pIni : function(){
        
        var viewActual = cc.director.getRunningScene();
        var relacionados = viewActual.getChildren();
        
        var desplazamiento = cc.moveTo(relacionados[0].rapidez, -10, relacionados[0].alazar(0, cc.winSize.height));
        
        relacionados[0].pelota.stopAllActions();
        relacionados[0].pelota.runAction(desplazamiento); 
        
        cc.director.resume();
    },
    movimiento : function(boton, event){
        
        var size = cc.winSize;
        var pong = event.getCurrentTarget();
        
        switch(boton){
                
            case 38:
                pong.jugador1.y += size.height/20;
                pong.jugador1.y = Math.min(pong.jugador1.y, size.height - 90);
                break;
                
            case 40:
                pong.jugador1.y -= size.height/20;
                pong.jugador1.y = Math.max(pong.jugador1.y, 0);
                break;
                
            case 72:
                pong.jugador2.y += size.height/20;
                pong.jugador2.y = Math.min(pong.jugador2.y, size.height - 90);
                break;
                
            case 78:
                pong.jugador2.y -= size.height/20;
                pong.jugador2.y = Math.max(pong.jugador2.y, 0);
                break;
        }
    },
    
    choque : function(){
        if( Math.abs(this.pelota.x - this.jugador1.x) <= 13 && Math.abs(this.pelota.y - this.jugador1.y) <= 103){
            var desplazamiento = cc.moveTo(this.rapidez, cc.winSize.width+13, this.alazar(0, cc.winSize.height));
            this.pelota.stopAllActions();
            this.pelota.runAction(desplazamiento);
        }
        
        if( Math.abs(this.pelota.x - this.jugador2.x) <= 13 &&  Math.abs(this.pelota.y - this.jugador2.y) <= 103)
        
        {
            var desplazamiento = cc.moveTo(this.rapidez, -13, this.alazar(0, cc.winSize.height));
            
            this.pelota.stopAllActions();
            
            this.pelota.runAction(desplazamiento);
        }
    },
    
    derrota : function(){
        
        if(this.pelota.x <= cc.winSize.width*0.1 - 13){
            
            var punto = parseInt(this.puntuacion2.string);
            
            punto++;
            
            this.puntuacion2.string = punto;
            this.pelota.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            
            cc.director.pause();
            
            setTimeout(this.pIni, 3000);
        }
        
        if(this.pelota.x >= cc.winSize.width - (cc.winSize.width * 0.1) + 10){
            
            var punto = parseInt(this.puntuacion1.string);
            punto++;
            
            this.puntuacion1.string = punto;
            
            this.pelota.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            
            cc.director.pause();
            
            setTimeout(this.pIni, 3000);
        }
    },
    
    ctor:function () {
        this._super();
        this.inicializar();
        
        cc.eventManager.addListener(
        {
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.movimiento
        }, this);
        
        this.schedule(this.derrota, 1/55);
        
        this.schedule(this.choque, 1/55);
        
        return true;
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

