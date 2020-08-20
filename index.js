
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
    lastIndex:6,
    score:0,
    scoreArr: [],

    init: function(){
        this.initData();
        this.animation();
        this.handleStart();
        // this.handleBirdUp();
        this.handleReStart();
        if(sessionStorage.getItem('play')) {
            this.start();
          }
    },
    //一个人负责初始化，找各个工人来干活
    initData: function(){
        this.el = document.getElementById('game');
        this.abird = this.el.getElementsByClassName('bird')[0];
        this.astart = this.el.getElementsByClassName('start')[0];
        this.ascore = this.el.getElementsByClassName('score')[0];
        this.amask = this.el.getElementsByClassName('mask')[0];
        this.aend = this.el.getElementsByClassName('end')[0];
        this.afinalScore = this.el.getElementsByClassName('final-score')[0];
        this.aRankList = this.el.getElementsByClassName('rank-list')[0];
        this.aRestart = this.el.getElementsByClassName('restart')[0];

        this.scoreArr = this.getScore();
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
        this.addScore();
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
    addScore: function(){
        var index = this.score % this.pipeLength;
        var pipex = this.pipeArr[index].up.offsetLeft;
        if(pipex<13){
            this.score++;
        }
        this.ascore.innerText = this.score;
    },
    judgePipe:function(){
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y; // []
        
        if((pipeX >= 13 && pipeX <= 95) && (this.birdTop <= pipeY[0] || this.birdTop >= pipeY[1])){
            this.gameOver();
        }
        
    },
    createPipe:function(x){
        //random()*100 [0,100) (50,150)
        //上下距离 150
        //上柱子最好的高度 (600-150)/2 225

        var upHeight = 50+ Math.floor(Math.random() * 175);
        var downHeight = 600 -150- upHeight;

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
            down:aDownPipe,
            y:[upHeight,upHeight+120]
        })
    },
   
    pipeMove:function(){
        for(var i=0;i<this.pipeLength;i++){
            var aUpPipe = this.pipeArr[i].up;
            var aDownPipe = this.pipeArr[i].down;
            var x = aDownPipe.offsetLeft - this.skyStep;

            if(x<-52){
                var lastPipeLeft = this.pipeArr[this.lastIndex].up.offsetLeft;
                aUpPipe.style.left = lastPipeLeft+300 + 'px';
                aDownPipe.style.left = lastPipeLeft+300 + 'px';
                this.lastIndex = i;
                continue
            }
            aUpPipe.style.left = x + 'px';
            aDownPipe.style.left = x + 'px';

        }
    },
    handleStart: function(){
       
        this.astart.onclick = this.start.bind(this);
    },
    start:function(){
        var that = this;

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
        this.setScore();
        console.log('end');
        this.amask.style.display = 'block';
        this.aend.style.display = 'block';
        this.ascore.style.display = 'none';
        this.afinalScore.innerText = this.score;

        this.renderRankList();
    },
    setScore:function(){
        this.scoreArr.push({
            score:this.score,
            time:this.getDate()
        })

        this.scoreArr.sort(function (a, b) {
            return b.score - a.score;
        })

        var scoreLength = this.scoreArr.length;
        this.scoreArr.length = scoreLength > 8 ? 8 : scoreLength;

        setLocal('score',this.scoreArr);
    },
    getDate:function(){
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        hour = hour<10 ? '0'+hour :hour;
        minute = minute<10 ? '0'+minute :minute;
        second = second<10 ? '0'+second :second;

        return `${year}.${month}.${day} ${hour}:${minute}:${second}`
    },
    getScore:function(){
        var scoreArr = getLocal('score');
        return scoreArr ? scoreArr:[]
    },
    renderRankList:function(){
        var template = '';
        
        
        for(var i=0;i<this.scoreArr.length;i++){
            var degreeClss = '';
            switch(i){
                case 0:
                    degreeClss = 'first';
                    break;
                case 1:
                    degreeClss = 'second';
                    break;
                case 2:
                    degreeClss = 'third';
                    break;
            }
            template += `
            <li class="rank-item">
            <span class="rank-degree ${degreeClss}">${i + 1}</span>
            <span class="rank-score">${this.scoreArr[i].score}</span>
            <span class="rank-time">${this.scoreArr[i].time}</span>
            </li>
            `
        }

        this.aRankList.innerHTML = template;
    },
    handleReStart: function(){
        var that = this;
        this.aRestart.onclick = function(){
            sessionStorage.setItem('play',true);
            window.location.reload();
        }
    }
    
}

bird.init();
