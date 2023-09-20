//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);




let gameOver = false; // true면 게임 끝냄, false면 게임이 안끝나기
//우주선 좌표
let spaceshipX = canvas.width/2 -32;
let spaceshipY = canvas.height - 64;


/*********************************이미지************************************* */
let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage, lifeImage,spaceshipResponseImage,enemyBounsImage,enemySpeedImage;


function loadImage() {
    //이미지 함수 생성
    backgroundImage = new Image();
    backgroundImage.src ="images/SinJJANG.png";
    
    spaceshipImage = new Image();
    spaceshipImage.src = "images/짱구64.png";

    spaceshipResponseImage = new Image();
    spaceshipResponseImage.src = "images/짱구리스폰.png";

    bulletImage = new Image();
    bulletImage.src = "images/부리부리부리누끼.png"

    enemyImage = new Image();
    enemyImage.src = "images/훈발놈누끼.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/훈발놈게임오버누끼.png";

    lifeImage = new Image();
    lifeImage.src = "images/푸딩 이미지 (2).png";

    enemyBounsImage = new Image();
    enemyBounsImage.src = "images/한수지64.png";

    enemySpeedImage = new Image();
    enemySpeedImage.src = "images/빠른훈발놈.png";


}
/*********************************오디오************************************* */
    let backgrounAudio = new Audio("music/짱구는 못말려 평화로운 BGM.mp3");
    
    let bulletAudio = new Audio("music/야.mp3");

/*********************************짱구************************************* */
class Spaceship {
    
    
    // update(){
    //     console.log("spaceshipX :",spaceshipX);

    // }

    //짱구가 생명력보너스를 먹었을때
    check(){

        for( var i = 0; i < lifeItemList.length; i++){
            var checkIndex = -1;

            // console.log("lifeItemList : ",lifeItemList);
                if(lifeItemList.findIndex( item => item.x <= spaceshipX 
                                             && item.y >= spaceshipY   
                                             && item.x + 60 >= spaceshipX  
                                             && item.y <= spaceshipY + 60 //짱구 밑에 있는 생명력보너스는 제외
                                            //  && lifeItemList[i].lifeBonusAlive == true     
                                             && lifeItemList[i].y > 0
                                             ) >-1){
                                            
                    checkIndex = lifeItemList.findIndex(item => item.x <= spaceshipX 
                                                    && item.y >= spaceshipY   
                                                    && item.x + 60 >= spaceshipX  
                                                    && item.y <= spaceshipY + 60 //짱구 밑에 있는 생명력보너스는 제외
                                                    // && lifeItemList[i].lifeBonusAlive == true     
                                                    && lifeItemList[i].y > 0) ;

                    lifeItemList.splice(checkIndex,1);                
                    //생명력 추가
                    life.add();
                };
        }
    }
}

let spaceship = new Spaceship();

let lifeList = [];
let lifeCnt = 2;
let lifeRespose = false;
let lifeEating = false;
let lifeItemList = [];
/*********************************생명력************************************* */
class Life{
    constructor(){
    };

    create(){

        for ( var i = 0; i < lifeCnt; i++){
            lifeList.push(i);        
        }
        lifeCnt = 0;
    }

    
    add(){

        lifeEating = true;
        //생명력 더하기
        if(lifeEating == true){

            lifeList.push(1);
                //해당 시간만큼 무적
                // setTimeout(() => {
                    
                    lifeEating = false;            
                // }, 3000);
            // console.log('lifeList.length',lifeList.length);     
            // console.log('lifeList',lifeList); 
        }

    }

    minus(event){

        this.num = event;
        //1.생명력 깍일때
        lifeRespose = true;
        if(lifeRespose == true){
            lifeList.splice(0,this.num);
            //해당 시간만큼 무적
            setTimeout(() => {
                lifeRespose = false;            
            }, 3000);
        }

    }

    //생명력보너스는 시간 지나면 사라진다.
    delete(){

        //시간마다 호출되는 함수
        setInterval(function(){        
            if (lifeItemList.length > 0){

                lifeItemList.splice(lifeItemList.length,1);
                
            }
        // console.log("enemyList:",enemyList);
        },10000);
        
    }

}
let life = new Life();

/*********************************총알************************************* */
let bulletList = [];//총알을 저장할 리스트
let score = 0;
let bulletAlive = true;
//총알 정보 class
class Bullet{

  
     constructor(){
     }

     //총알 초기값 좌표  
     create(x,y){
        x= spaceshipX+12; 
        y = spaceshipY;
        bulletAlive = true; // 살아있는총알
        bulletList.push({x,y,bulletAlive});
        // console.log("bulletList :", bulletList);
     }

     update(){
        // console.log(" bulletList[0] : ",bul letList[0]);
        //총알 움직이는 속도 조절
        for ( var i = 0; i < bulletList.length; i++) {
            bulletList[i].y -= +2;
        }        
     }
     //적군에게 맏혔느지 체크
     /*
     1.총알x >= 적군.x 
     2.총알y <= 적군.y 
     3.총알x <= 적군.x+ 적군의 넓이
     4.살아있는 총알
     5.테두리가 벗어난 총알은 계산하지 않는다
     */
     checkHit(){
        // console.log("enemyList",enemyList);
        for( var i = 0; i < bulletList.length; i++){
            // console.log("bulletList[i] : ",bulletList[i]);
            var index = -1;

            if(enemyList.findIndex( enemy => enemy.x <= bulletList[i].x 
                                         && enemy.y >= bulletList[i].y   
                                         && enemy.x + 60 >= bulletList[i].x  
                                         && enemy.y <= bulletList[i].y + 60 //총알보다 밑에 있는 적군은 제외
                                         && bulletList[i].bulletAlive == true     
                                         && bulletList[i].y > 0
                                         ) >-1){
                
                index = enemyList.findIndex(enemy => enemy.x <= bulletList[i].x 
                                                 && enemy.y >= bulletList[i].y 
                                                 && enemy.x + 60 >= bulletList[i].x        
                                                 && enemy.y <= bulletList[i].y + 60 //총알보다 밑에 있는 적군은 제외                                        
                                                 && bulletList[i].bulletAlive == true
                                                 && bulletList[i].y > 0) ;

                // console.log("index : ",index);
                // console.log("enemyList[index] : ",enemyList[index]);                
                enemyList.splice(index,1);                
                bulletList[i].bulletAlive = false;
                score ++;
            };

            if(enemySpeedList.findIndex( enemy => enemy.x <= bulletList[i].x 
                && enemy.y >= bulletList[i].y   
                && enemy.x + 60 >= bulletList[i].x  
                && enemy.y <= bulletList[i].y + 60 //총알보다 밑에 있는 적군은 제외
                && bulletList[i].bulletAlive == true     
                && bulletList[i].y > 0
                ) >-1){

                index = enemySpeedList.findIndex(enemy => enemy.x <= bulletList[i].x 
                                        && enemy.y >= bulletList[i].y 
                                        && enemy.x + 60 >= bulletList[i].x        
                                        && enemy.y <= bulletList[i].y + 60 //총알보다 밑에 있는 적군은 제외                                        
                                        && bulletList[i].bulletAlive == true
                                        && bulletList[i].y > 0) ;
                
                // console.log("index : ",index);
                // console.log("enemyList[index] : ",enemyList[index]);                
                enemySpeedList.splice(index,1);                
                bulletList[i].bulletAlive = false;
                score +=2;
            };

            //보너스 맞혓는지 체크
            if(enemyBonusList.findIndex( enemy => enemy.x <= bulletList[i].x 
                && enemy.y >= bulletList[i].y   
                && enemy.x + 60 >= bulletList[i].x  
                && enemy.y <= bulletList[i].y + 60 //총알보다 밑에 있는 적군은 제외
                && bulletList[i].bulletAlive == true     
                && bulletList[i].y > 0
                ) >-1){
                    
                index = enemyBonusList.findIndex(enemy => enemy.x <= bulletList[i].x 
                                            && enemy.y >= bulletList[i].y 
                                            && enemy.x + 60 >= bulletList[i].x          
                                            && enemy.y <= bulletList[i].y + 60 //총알보다 밑에 있는 적군은 제외                                        
                                            && bulletList[i].bulletAlive == true
                                            && bulletList[i].y > 0) ;      

                //보너스 맞혔으면 보너스 아이템 생성 좌표값
                lifeItemList.push(enemyBonusList[index]); 

                // console.log("lifeItemList : ",lifeItemList);

                //보너스 제거                 
                enemyBonusList.splice(index,1);                

                bulletList[i].bulletAlive = false;
            }
            
        }
        
     }
     
}
// && parseInt(enemy.x) + parseInt(enemy.width)>= bulletList[i].x
// && this.x >= enemyList[i].x 
//                 &&this.x <= enemyList[i].x + enemyList[i].width
let bullet = new Bullet();

/******************************************적군************************************************* */
//적군
//1. 훈발놈
//2. 위치이동
//3. 밑으로 내려온다.
//4. 1초마다 하나씩 적군생성
//5. 우주석이 바닥에 닿으면 게임 오버
//6. 적군과 총알이 만나면 우주선이 사라짐 점수 1점획득
let enemyList = [];
let enemyBonusList = [];
let enemyBoss = [];
let enemySpeedList = [];
class Enemy{

    constructor(){
    }

    create(event){


        this.event = event;
        var x = this.generateRandomValue(0,canvas.width-55);
        var y = 0
 
        //훈발놈
        if(this.event == null){
            enemyList.push({x,y});
            // console.log("enemyList : ",enemyList);
        }
        //수지
        if(this.event == "bonus"){
            enemyBonusList.push({x,y});
        }    
        
        //빠른훈발놈
        if(this.event == "speed"){
            enemySpeedList.push({x,y});
        }    

    }

    generateRandomValue(min,max){
        let randomValue = Math.floor(Math.random()*(max-min+1)+min);
        // console.log("randomValue :", randomValue);        
        return randomValue;

    }


    update(){

     //훈발놈 움직이는 속도 조절
       for ( var i = 0; i < enemyList.length; i++) {
        enemyList[i].y += 1;
        if(enemyList[i].y > canvas.height && enemyList[i].y < canvas.height + 30 ){ //y축 높이제한 안걸면 계속 생명력 깍임
            
            //생명력 깍임
            if(lifeRespose==false){
                life.minus();
            }
            // 생명력 다깍이면 gameOver 
            if(lifeList.length==0){
                gameOver = true;
            }
            
        }
        if(enemyList[i].x - 30 <= spaceshipX && spaceshipX <= enemyList[i].x +30 && enemyList[i].y-20 <= spaceshipY && spaceshipY <=enemyList[i].y+20){
            
            //생명력 깍임
            if(lifeRespose==false){
                life.minus(1);
            }
            // 생명력 다깍이면 gameOver 
            if(lifeList.length==0){
                gameOver = true;
            }
        }
       }

        //보너스 움직이는 속도 조절
        for ( var i = 0; i < enemyBonusList.length; i++) {
            enemyBonusList[i].y += 1.7;
        }       

        //빠른 훈발놈
        for ( var i = 0; i < enemySpeedList.length; i++) {
            enemySpeedList[i].y += 2;
            if(enemySpeedList[i].y > canvas.height && enemySpeedList[i].y < canvas.height + 30 ){ //y축 높이제한 안걸면 계속 생명력 깍임
            
                //생명력 깍임
                if(lifeRespose==false){
                    life.minus(2);
                }
                // 생명력 다깍이면 gameOver 
                if(lifeList.length==0){
                    gameOver = true;
                }
                
            }
            if(enemySpeedList[i].x - 30 <= spaceshipX && spaceshipX <= enemySpeedList[i].x +30 && enemySpeedList[i].y-20 <= spaceshipY && spaceshipY <=enemySpeedList[i].y+20){
                
                //생명력 깍임
                if(lifeRespose==false){
                    life.minus(2);
                }
                // 생명력 다깍이면 gameOver 
                if(lifeList.length==0){
                    gameOver = true;
                }
            }
        }            
                
        
    //    console.log("gameOver :", gameOver);

    }


}
let enemy = new Enemy();

function createEnemy(){
    //시간마다 호출되는 함수
    setInterval(function(){        
        enemy.create();
        // console.log("enemyList:",enemyList);
    },1000);
    // console.log("interval :",interval);   
    
    //시간마다 호출되는 함수
    setInterval(function(){        
        enemy.create("bonus");
        // console.log("enemyList:",enemyList);
    },10000);

    //시간마다 호출되는 함수
    setInterval(function(){        
        enemy.create("speed");
        // console.log("enemyList:",enemyList);
    },3000);
}



let keysDown = {};

function setupKeyboardListener() {
    //키 입력시 값 입력
    document.addEventListener('keydown',function(event){
        // console.log(event.keyCode);
        keysDown[event.keyCode] = true;

        // console.log(keysDown);
        if(event.keyCode == 32){
            bulletAudio.play();
        }
        
        
    });

    //키땔때 삭제
    document.addEventListener('keyup',function(event){
        delete keysDown[event.keyCode];

        //스페이스바 32
        if(event.keyCode == 32){

            bullet.create(spaceshipX,spaceshipY);
        }

    });
     
}


// 키입력된 값 업데이트
function update() {
    // console.log(keysDown);

    //오른쪽
    if( 39 in keysDown ){
        //테두리 벗어나는거 막기
        if(spaceshipX <= canvas.width - 50){
            spaceshipX +=3;
        }
    }
    //왼쪽
    if( 37 in keysDown ){
        if(spaceshipX >= 0){
            spaceshipX -=3;
        }
    }
    //위
    if( 38 in keysDown ){
        if(spaceshipY >= 0){
            spaceshipY -=3;
        }
    }
    //아래
    if( 40 in keysDown ){        
        if(spaceshipY <=canvas.height- 50){
            spaceshipY +=3;
        }
    }
    //총알 움직이기
    bullet.update();
    //적군 움직이기
    enemy.update();
    //총알 체크
    bullet.checkHit();
    //짱구가 생명력 보너스 먹는지 체크
    // spaceship.update();
    spaceship.check();

}

//이미지 
function render() {
    // console.log(backgroundImage)
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    if(lifeRespose== false){ctx.drawImage(spaceshipImage, spaceshipX,spaceshipY);}
    else if(lifeRespose== true){ctx.drawImage(spaceshipResponseImage, spaceshipX,spaceshipY);}


    //스코어
    ctx.fillText(`점수 : ${score}`,20,30);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    
    // console.log(bulletList.length);
    //총알 이미지 그려주기
    for ( var i = 0; i < bulletList.length; i++) {
        if(bulletList[i].bulletAlive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }
    //적군 이미지 그려주기
    for ( var i = 0; i < enemyList.length; i++) {
        
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);

    }

    //보너스 이미지 그려주기
    for ( var i = 0; i < enemyBonusList.length; i++) {
    
        ctx.drawImage(enemyBounsImage, enemyBonusList[i].x, enemyBonusList[i].y);

    }

    //빠른 적군 이미지 그려주기
    for ( var i = 0; i < enemySpeedList.length; i++) {

        ctx.drawImage(enemySpeedImage, enemySpeedList[i].x, enemySpeedList[i].y);

    }

    //생명력 그려주기
    // life.create();1
    //생명력 이미지 그려주기
    for ( var i = 0; i < lifeList.length; i++) {    
        ctx.drawImage(lifeImage,20, i*30 +30);

    }

    //보너스 잡으면 생명력 이미지 그려주기
    for ( var i = 0; i < lifeItemList.length; i++) {    
        ctx.drawImage(lifeImage,lifeItemList[i].x, lifeItemList[i].y);

    }
    
}

function main() {
    //게임오버
    if(!gameOver){
        update(); //좌표값을 업데이트하고
        render();//그려주고
        //이미지계속 호출 (중요)
        requestAnimationFrame(main);

        backgrounAudio.play();//오디오 시작  

  
    }

    //게임오버 이미지
    if(gameOver){
        ctx.drawImage(gameOverImage, spaceshipX/3,spaceshipY/3+50);

        backgrounAudio.pause();//오디오 일시정지
    }
    
}

//이미지 호출
loadImage();
//키보드
setupKeyboardListener();
//시간마다 호출되는 함수 (적호출)
createEnemy();

//생명력초기 생성
life.create();
//시간마다 호출되는 함수 (생명력 보너스이미지 사라지기)
life.delete();
//메인 호출
main();
  

//총알만들기
//1.스페이스바를 누르면 총알 발사
//2.총알이 발사 = 총알의 y값이 -- , 총알의 x 갑은 ? 스페이스바를 누른 순간의 짱구x,y값 위치
//3. 발사된 총알들은 총알 배열에 저장을 한다.
//4. 총알들은 x,y 좌표값이 있어야 한다.
//5. 총알 배열을 가지고 render그려준다


