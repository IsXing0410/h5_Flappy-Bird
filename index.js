
// 用对象收编变量

var bird = {
    skyPosition:0,
    skyStep:2,
    birdTop:260,
    birdX:0,
    startColor:'white',
    startFlag:false,
    birdA:1,
    minTop:0,
    maxTop:570,
    pipeLength:7,
    pipeArr:[],

    init: function(){
        this.initData();
        this.animation();
        this.handleStart();
        // this.handleBirdUp();
        
    },
    //一个人负责初始化，找各个工人来干活
    initData: function(){
        this.el = document.getElementById('game');
        this.abird = this.el.getElementsByClassName('bird')[0];
        this.astart = this.el.getElementsByClassName('start')[0];
        this.ascore = this.el.getElementsByClassName('score')[0];

    },
    animation: function(){
        var that = this;
        var count = 0;
        this.timer = setInterval(function(){         
            that.skyMove();
            
            if(that.startFlag){
                that.birdDrop();
                that.pipeMove();
            }
            // count++;
            if(++count%10 === 0 ){
                if(that.startFlag==false){
                    that.startBound();
                    that.birdJump();
                }               
                that.birdfly(count);
              
            }
        },30);
    },
    skyMove: function(){      
            this.skyPosition -= this.skyStep;
            this.el.style.backgroundPositionX = this.skyPosition + 'px';
    },
    birdJump: function(){
        this.birdTop = this.birdTop > 230 ? 220 :260;
        this.abird.style.top = this.birdTop + 'px';
    },
    birdfly: function(count){
        // 0 -30 -60
        // this.birdX -= 30;
        this.abird.style.backgroundPositionX = count % 3 * (-30) + 'px';
    },
    startBound: function(){
        this.astart.classList.remove('start-'+this.startColor);
        this.startColor = this.startColor === 'white' ? 'blue': 'white';
        this.astart.classList.add('start-'+this.startColor);
    },
    birdDrop: function(){
        this.birdA ++;
        // console.log(this.birdA);
        this.birdTop += this.birdA ;
        this.abird.style.top = this.birdTop + 'px';
        // console.log(this.birdTop);
        // if(( this.birdTop <= 0)||(this.birdTop >= 570)){
        //     this.gameOver();
        // }
        this.judgeKnock();
    },
    judgeKnock: function () {
      this.judgeBoundary();
      this.judgePipe();
    },
    judgeBoundary: function () {
      if(this.birdTop <= this.minTop || this.birdTop >= this.maxTop) {
        this.gameOver();
      }
    },
    judgePipe:function(){

    },
    createPipe:function(x){
        //random()*100 [0,100) (50,150)
        //上下距离 150
        //上柱子最好的高度 (600-150)/2 225
        // var aDiv = document.createElement('div');
        // var downDiv = document.createElement('div');

        var upHeight = 50+ Math.floor(Math.random() * 175);
        var downHeight = 600 -150- upHeight;

        // aDiv.classList.add('pipe');
        // aDiv.classList.add('pipe-up');
        // aDiv.style.height = upHeight + 'px';
        // aDiv.style.left = 300*x + 'px';
        // this.el.appendChild(aDiv);

        // downDiv.classList.add('pipe');
        // downDiv.classList.add('pipe-down');
        // downDiv.style.height = downHeight + 'px';
        // downDiv.style.left = 300*x + 'px';
        // this.el.appendChild(downDiv);

        var aUpPipe = createEle('div',['pipe','pipe-up'],{
            height:upHeight + 'px',
            left:x + 'px'
        });

        var aDownPipe = createEle('div',['pipe','pipe-down'],{
            height:downHeight + 'px',
            left:x + 'px'
        });
        this.el.appendChild(aUpPipe);
        this.el.appendChild(aDownPipe);

        this.pipeArr.push({
            up:aUpPipe,
            down:aDownPipe
        })
    },
   
    pipeMove:function(){
        for(var i=0;i<this.pipeLength;i++){
            var aUpPipe = this.pipeArr[i].up;
            var aDownPipe = this.pipeArr[i].down;
            var x = aDownPipe.offsetLeft - this.skyStep;

            aUpPipe.style.left = x + 'px';
            aDownPipe.style.left = x + 'px';

        }
    },
    handleStart: function(){
        var that = this;
        this.astart.onclick = function(){
            that.startFlag = true;
            that.skyStep = 5;
            that.astart.style.display = 'none';
            that.ascore.style.display = 'block';
            that.abird.style.transition = 'none';
            that.abird.style.left = 80 + 'px';
            that.handleBirdUp();

            //生成7个柱子
            for(var i=0; i<that.pipeLength;i++){
                that.createPipe((i+1)*300);
            }
            
            
        }
    },
    handleBirdUp: function(){
        var that = this;
        this.el.onclick =function(e){
            
                var dom = e.target;
                var isStart = dom.classList.contains('start');
                if(!isStart){
                    that.birdA = -10;
                }
          // that.birdTop -=10; (这样不行，因为加速度还在且可能都20+了 你-10也不顶用)
            
        }
    },
    gameOver:function(){
        clearInterval(this.timer);
        console.log('end');
    }
    
}

bird.init();
