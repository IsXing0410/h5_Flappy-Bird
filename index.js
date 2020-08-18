
// 用对象收编变量

var bird = {
    skyPosition:0,
    birdTop:260,
    birdX:0,
    startColor:'white',

    init: function(){
        this.initData();
        this.animation();
        this.startGame();
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

        setInterval(function(){
            that.skyMove();
            // count++;

            if(++count%10 === 0 ){
                that.birdJump();
                that.birdfly(count);
                that.startBound();
            }
        },30);
    },
    skyMove: function(){      
            this.skyPosition -= 2;
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

    
}

bird.init();
