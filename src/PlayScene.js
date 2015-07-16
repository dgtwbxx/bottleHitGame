var PlayLayer = cc.Layer.extend({
	SushiSprites:null,
	bgSprite:null,
	score:0,
	scoreLabel:null,
	timeout:60,
	timeoutLabel:null,
	sum_dt:0,
	draw:null,
	ctor:function(){
		
		this._super();
		this.SushiSprites = [];
		
		cc.spriteFrameCache.addSpriteFrames(res.Sushi_plist);

		var size = cc.winSize;

		//add bg
		this.bgSprite = new cc.Sprite(res.BackGround_png);
		this.bgSprite.attr({
			x:size.width/2,
			y:size.height/2,
			//scale:0.5,
			rotation:180
		});

		this.addChild(this.bgSprite,0);

		this.scoreLabel = new cc.LabelTTF("score:0","Arial",20);
		this.scoreLabel.attr({
			x:size.width/2+100,
			y:size.height-20,
		});
		this.addChild(this.scoreLabel,5);

		//timeout 60
		this.timeoutLabel = new cc.LabelTTF("time:"+this.timeout,"Arial",30);
		this.timeoutLabel.x = 20;
		this.timeoutLabel.y = size.height-20;
		this.timeoutLabel.anchorX = 0;

		this.addChild(this.timeoutLabel,5);


		//添加画笔
		this.draw = new cc.DrawNode();
        this.addChild(this.draw, 3);

		this.schedule(this.timer,1,this.timeout,1);
		// this.schedule(this.update,1,16*1024,1);

		//this.scheduleOnce(this.update,1);
		this.scheduleUpdate();



		return true;
	},
	update:function(dt){
		
		
		this.sum_dt += dt;
		if(this.sum_dt >= 1){
			this.addSushi();
			this.removeSushi();
			this.sum_dt = 0;
		}

		for(var i=0; i< this.SushiSprites.length; i++){
			this.SushiSprites[i].changeWay();
		}

	},

	addSushi:function(){

		if(this.SushiSprites.length >= 3){
			return;
		}
		//var sushi = new cc.Sprite("#sushi_1n.png") 这个方法的路径是相对路径？\
		var ran_num = 20 + 20 * cc.random0To1();
		var sushi = new SushiSprite(res.Sushi_png_01, ran_num);
		sushi.setDraw(this.draw);
		var size = cc.winSize;
		var x = size.width * cc.random0To1();
		sushi.attr({
			x:x,
			y:size.height-30
		});
	

		this.SushiSprites.push(sushi);

		this.addChild(sushi,5);
		

		//var dropAction = cc.MoveTo.create(4,cc.p(sushi.x,-30));

		//sushi.runAction(dropAction);
	},
	
	removeSushi:function(){
		//移除到屏幕底部的sushi
		for(var i = 0;i < this.SushiSprites.length;i++){
		
			if(0 >= this.SushiSprites[i].y){
				cc.log("===============remove:"+i);

				//因为是一个画笔画出来的。可是为什么新添加的精灵仍然有画笔
				this.draw.clear();
				//移除已经添加的节点
				this.SushiSprites[i].removeFromParent();
				
				this.SushiSprites[i]=undefined;
				this.SushiSprites.splice(i,1);
				i=i-1;
			}
			
		}
	},
	addScore:function(){
		this.score += 1;
		this.scoreLabel.setString("score:"+this.score);
	},
	timer:function(){
		if(this.timeout == 0){
			cc.log("游戏结束");
			
			var gameOver = new cc.LayerColor(cc.color(225,225,225,100));
			var size = cc.winSize;
			var titleLabel = new cc.LabelTTF("GameOver!","Arial",38);
			titleLabel.attr({
				x:size.width/2,
				y:size.height/2
			});
			gameOver.addChild(titleLabel,5);
			//MenuItemFont\MenuItemImage
			var TryAgainItem = new cc.MenuItemFont(
					"Try Again",
					function(){
						cc.log("Menu is clicked!");
						//这个方法的参数
						//var transition = cc.TransitionFade(1,new PlayScene(),cc.color(255,255,255,255));
						//运行了一个新的场景，刚才那个场景是否还存在？
						cc.director.runScene(new PlayScene());
					},
					this);
			TryAgainItem.attr({
				x:size.width/2,
				y:size.height/2-60,
				anchorX:0.5,
				anchorY:0.5
			});

			var menu =  new cc.Menu(TryAgainItem);
			menu.x = 0;
			menu.y = 0;
			gameOver.addChild(menu,1);
			this.getParent().addChild(gameOver);

			this.unschedule(this.update);

			//只能结束// this.schedule(this.update,1,16*1024,1); 不能结束scheduleUpdate();
			this.unschedule(this.timer);

			return;
		}
		this.timeout -= 1;
		this.timeoutLabel.setString("time:"+this.timeout);

	}
});

var PlayScene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new PlayLayer();
		this.addChild(layer);
	}
});