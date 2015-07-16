var SushiSprite = cc.Sprite.extend({
	disappearAction:null, //消失动画
	touchListener:null,
	min_x:null,
	max_x:null,
	moveWidth:null,
	dir:-1,
	draw:null,
	flag:0,
	ctor:function(_spriteImg, _moveWidth){
		this._super(_spriteImg);
		this.moveWidth = _moveWidth;

		
        
	},
	setDraw(_draw){
		this.draw = _draw;
	},
	onEnter:function(){
		cc.log("onEnter");
		this._super();
		this.addTouchEventListener();

		this.disappearAction = new this.createDisappearAction();
		
		//这里为什么需要创建一个消失动画的再次引用，防止内存自动释放
		//因为需要一段时间后才使用
		this.disappearAction.retain();

		this.min_x = this.x - this.moveWidth;
		this.max_x = this.x + this.moveWidth;
		
		//this.scheduleUpdate();

		
	},
	// update:function(){
	// 	this.changeWay();
	// },
	onExit:function(){
		cc.log("onExit");
		this.disappearAction.release();
		this._super();
	},
	addTouchEventListener:function(){
		this.touchListener = cc.EventListener.create({
			event:cc.EventListener.TOUCH_ONE_BY_ONE,
			shallowTouches:true,
			onTouchBegan:function(touch,event){

				var pos = touch.getLocation();
				var target = event.getCurrentTarget();
				if(cc.rectContainsPoint(target.getBoundingBox(),pos)){
					cc.log("touched");
					target.removeTouchEvnetListener();
					//相应精灵点中
					cc.log("pos.x="+pos.x+"pos.y="+pos.y);
					target.stopAllActions();
					
					var ac = target.disappearAction;
				
					var seqAc = cc.Sequence.create(ac,cc.CallFunc.create(function(){
						cc.log("CallFunc......");

						//不再继续画线
						target.x = 0;
						target.y = 0;
						this.flag = 1;
						//把原本画笔的对象清空，仍然是一个画笔
						// this.draw.clear();
						target.removeFromParent();
						
					
					},target));
					//加分
					target.getParent().addScore();

					target.runAction(seqAc);


					return true;
				}
				return false;
			}
		});
		//第二个参数this起什么作用
		cc.eventManager.addListener(this.touchListener,this);

	},
	createDisappearAction:function(){
		var frames = [];
		for(var i=0;i<11;i++){
			var str = "sushi_1n_"+i+".png"
			//cc.log(str);
			var frame = cc.spriteFrameCache.getSpriteFrame(str);
			frames.push(frame);
		}
		var animation = new cc.Animation(frames,0.02);
		
		var action = new cc.Animate(animation);

		return action;
	},
	removeTouchEvnetListener:function(){
		//这里不需要this回调？
		cc.eventManager.removeListener(this.touchListener);
	},
	changeWay:function(){

		if(this.draw == null){
			return;
		}

		this.draw.drawDot(cc.p(this.x,this.y), 4, cc.color(0, 255, 255, 255));

		var s_x = this.x;
		var s_y = this.y;
		if(s_x <= this.min_x){
			this.dir = 1 ;
		}else if(s_x >= this.max_x){
			this.dir = -1 ;
		}
		var d_val = this.max_x-this.min_x;   //差值
		var mid_x = (this.max_x+this.min_x)/2;  //中心点的值
		var multiple = 10;
		//曲线判断
		if(this.dir == -1){
			if(s_x <= mid_x){
				s_x = s_x - 0.5 - (s_x-this.min_x)/d_val*multiple; //移动的距离变小
			}
			else if(s_x > mid_x){
				s_x = s_x - 0.5 - (this.max_x-s_x)/d_val*multiple; //移动的距离变大
			}
		}
		if(this.dir == 1){
			if(s_x <= mid_x){
				s_x = s_x + 0.5 + (s_x-this.min_x)/d_val*multiple; //移动的距离变大
			}
			else if(s_x > mid_x){
				s_x = s_x + 0.5 + (this.max_x-s_x)/d_val*multiple; //移动的距离变小
			}
		}

		//s_x = s_x +  (s_x-this.min_x)/(this.max_x-this.min_x)  ; //this.dir*5;

		if(s_y >= 0){
			s_y -= 1;
		}
	
		
		this.x = s_x;
		this.y = s_y;

		
	}
});