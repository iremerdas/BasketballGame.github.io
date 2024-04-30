// canvas değişkenleri
let csv;
let csvw = 1500;
let csvh = 800;
let ctx;

// top değişkenleri
var ball = {
    x: csvw / 20,
    y: csvh / 2,
    w: 75,
    h: 75,
    vx: 4,
    vy: 2,
    hiz: 5,
    gravity: 0.2,
    stop: true
};

var user = {
    score: 0,
    h: 100,
    color: '#fff',
    x: 100,
    w: csv/2
};

// resimler
let ballImg;
let hoopImg;
let hoopImg2;
let chosenLevel;
let restartImg;

const minutes = 2;
let time = minutes*60;
const countdownEl = document.querySelector("#countdown"); 

window.onload = function () {
    csv = document.getElementById("board");
    csv.height = csvh;
    csv.width = csvw;
    ctx = csv.getContext("2d");

    // resimleri yükleme
    load_ball_image(ball.x, ball.y, ball.w, ball.h);
    load_hoop_image(1165, 150, 400, 400);
    load_hoop2_image(-60, 150, 400, 400);

    const infoButton = document.getElementById("info-button");
    const infoScreen = document.getElementById("info-screen");
    const homePage = document.getElementById("home-page");

    // Choose Level Button'a tıklandığında level sayfasına geçiş
    document.getElementById("chooseLevelButton").addEventListener("click", function() {
        // Anasayfa ekranı gizlendi
        document.getElementById("home-page").style.display = "none";
        // Level sayfası gösterildi
        document.getElementById("level-screen").style.display = "block";
        // Level butonları gösterildi
        document.getElementById("levelButtons").style.display = "block";
    });

    document.getElementById("hardLevelButton").addEventListener("click", function() {
        // Seviye seçildikten sonra start sayfasına geçiş yap
        chosenLevel = "hard";
        document.getElementById("easyLevelButton").style.display = "none" // butonlar gizlendi
        document.getElementById("hardLevelButton").style.display = "none"
        document.getElementById("levelButtons").style.display = "block";
        document.getElementById("level-screen").style.display = "block";
        document.getElementById("start-screen").style.display = "block"; // start-screen görünür yapıldı
        document.getElementById("start-button").style.display = "block"; // start-button görünür yapıldı
    });
    
    document.getElementById("easyLevelButton").addEventListener("click", function() {
        // Seviye seçildikten sonra start sayfasına geçiş yap
        chosenLevel = "easy";
        document.getElementById("easyLevelButton").style.display = "none"
        document.getElementById("hardLevelButton").style.display = "none"
        document.getElementById("levelButtons").style.display = "block";
        document.getElementById("level-screen").style.display = "block";
        document.getElementById("start-screen").style.display = "block"; // start-screen görünür yapıldı
        document.getElementById("start-button").style.display = "block"; // start-button görünür yapıldı
    });
    

    // Start butonuna tıklandığında yani click
    document.getElementById("start-button").addEventListener("click", function() {
        startGame(); // Oyunu başlatan fonksiyonu çağır
    });


    infoButton.addEventListener("click", function() {
        homePage.style.display = "none"; 
        infoScreen.style.display = "block"; 
    });

    // Klavye tuşlarına basıldığında
    document.addEventListener("keydown", function(event) {
        if (event.key === "a") {
            // Topu sola hareket ettir
            ball.vx = -5; 
        }
        else if (event.key === "s") {
            // Topu sağa hareket ettir
            ball.vx = 5; 
        }
        else if (event.key === "q" && Math.abs(ball.vx) < 10) {
            // Topun hızını artır
            ball.vx *= 2; 
        }
    });


    document.addEventListener("keyup", function(event) {
        // A veya S tuşlarına basılmadığında
        if (event.key === "a" || event.key === "s") {
            // Topun hareketini durdur
            ball.vx = 0;
        }
    });

    document.addEventListener("keydown", function(event) {
        if (event.key === "x") {
            // Arka plan rengini değiştir
            changeBackgroundColor();
        }
    });
    
    requestAnimationFrame(update);

    document.addEventListener("keydown", moveBall);
}

function update() {
    requestAnimationFrame(update);
    // frameler üst üst binmesin diye önceki framei siliyoruz
    ctx.clearRect(0, 0, csv.width, csv.height);

    ball.vy += ball.gravity; // y yönündeki hızı
    ball.x += ball.vx // x yönündeki hızı
    ball.y = Math.max(ball.y + ball.vy, 0);

    // Oyunu bitime kontrolü
    if(time <= 0 && ((user.score < 5 && chosenLevel === "easy") || (user.score < 15 && chosenLevel === "hard"))) {
        gameOver();
    }

    // Oyunu kazanma kontrolü
    if((user.score >= 5 && chosenLevel === "easy") || (user.score > 15 && chosenLevel === "hard")) {
        winGame();
    }

    // Yere düşme kontrolü
    if (ball.y + ball.h >= csv.height) {
        ball.y = csv.height - ball.h;
        ball.vy = -ball.vy / 1,5 ; // Y yönünde tersine dön
        playWallSound();
    }

    // Sağ ve sol kenar kontrolü
    if (ball.x <= 0 || ball.x + ball.w >= csv.width) {
        ball.vx = -ball.vx; // X yönünde tersine dön
        playWallSound();
    }

    // Potanın kenarına çarpma kontrolü
    if (
        (ball.x + ball.w >= 107 && ball.x <= 132 && ball.y + ball.h >= 167 && ball.y <= 327) || // hoop
        (ball.x + ball.w >= 1375 && ball.x <= 1400 && ball.y + ball.h >= 167 && ball.y <= 327) // hoop2
    ) {
        ball.vx = -ball.vx/1,5; // X yönünde tersine dön
        ball.vy = -ball.vy; // Y yönünde tersine dön
    }

    // Potaya çarpma kontrolü
    if (((ball.x + ball.w >= 130 && ball.x <= 155 && ball.y + ball.h >= 270 && ball.y <= 285) || (ball.x + ball.w >= 160 && ball.x <= 250 && ball.y + ball.h >= 270 && ball.y <= 285)) ||
        ((ball.x + ball.w >= 1255 && ball.x <= 1275 && ball.y + ball.h >= 270 && ball.y <= 285) || (ball.x + ball.w >= 1348 && ball.x <= 1433 && ball.y + ball.h >= 270 && ball.y <= 285))) {
        
            // Potanın içinde mi kontrol et
        let ballCenterX = ball.x + ball.w / 2; // Topun merkezi x koordinatı

        // hoop için içinden geçme kontrolü
        if ((ballCenterX >= 160 && ballCenterX <= 250) || (ballCenterX >= 130 && ballCenterX <= 155)) {
            user.score++;
            playBasketSound();
            resetBallPosition();
        }

        // hoop2 için içinden geçme kontrolü
        if ((ballCenterX >= 1348 && ballCenterX <= 1433) || (ballCenterX >= 1255 && ballCenterX <= 1275)) {
            user.score++;
            playBasketSound();
            resetBallPosition();
        }
    }

    drawText(user.score, csv.width / 2, 175, '#fff') // Skoru yazdır
    ctx.drawImage(ballImg, ball.x, ball.y, ball.w, ball.h); // Topu çiz
    ctx.drawImage(hoopImg, 1165, 150, 400, 400) // hoop u çiz
    ctx.drawImage(hoopImg2, -60, 150, 400, 400) // hopp2 yi çiz
}

// Fotoğrafları yükleme fonksiyonları
function load_ball_image(x, y, w, h) {
    ballImg = new Image();
    ballImg.src = 'images/ball.png';
    ballImg.onload = function () {
        ctx.drawImage(ballImg, x, y, w, h);
    }
}
function load_hoop_image(x, y, w, h) {
    hoopImg = new Image();
    hoopImg.src = 'images/hoop.png',
    hoopImg.onload = function () {
        ctx.drawImage(hoopImg, x, y, w, h);
    }
}
function load_hoop2_image(x, y, w, h) {
    hoopImg2 = new Image();
    hoopImg2.src = 'images/hoop2.png';
    hoopImg2.onload = function () {
        ctx.drawImage(hoopImg2, x, y, w, h);
    }
}

function resetBallPosition() {
    ball.x = csvw / 20; // Topun x koordinatını başlangıç konumuna getir
    ball.y = csvh / 2; // Topun y koordinatını başlangıç konumuna getir
    ball.vx = 4; // hareket hızını yeniden ayarla
    ball.vy = 2;
}
function moveBall(e) {
    if (e.code == "Space" || e.code == "ArrowUp") { // space tuşuna basınca zıpla
        ball.vy = -6;
    }
}
// Metin yazdırma fonksiyonu
function drawText(yazı, x, y, color) { 
    ctx.fillStyle = color;
    ctx.font = "100px Times New Roman";
    ctx.fillText(yazı, x, y);//filltext fonksiyonuna aldığım parametreleri vererek bir yazı oluştur
}
// kronometere fonksiyonu
function updateCountdown(){
    const minutes = Math.floor(time/60);
    let seconds = time % 60;

    seconds = seconds < 10 ? "0" + seconds : seconds;

    countdownEl.innerHTML = `${minutes}:${seconds}`;

    if(!(minutes==0 && seconds==0))
        time--;
}
// Oyunu başlatan fonksiyon
function startGame() {
    document.getElementById("easyLevelButton").style.display = "none";
    document.getElementById("hardLevelButton").style.display = "none";
    document.getElementById("levelButtons").style.display = "none";
    document.getElementById("level-screen").style.display = "none";
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("start-button").style.display = "none";
    // Canvası göster
    csv.style.display = "block";
    // Kronometreyi başlat
    setInterval(updateCountdown, 1000);
    document.getElementById("countdown").style.display = "block";
    updateCountdown();
}

// Oyunu kaybetme fonksiyon
function gameOver() {
    ball.vx = 0;
    ball.vy = 0;
    ball.gravity = 0;
    drawText("GAME OVER", csv.width / 3, csv.height / 2, 'white');
    playFailSound();
}
// Oyunu kazanma fonksiyon
function winGame() {
    ball.vx = 0;
    ball.vy = 0;
    ball.gravity = 0;
    drawText("!WİN!", csv.width / 2-100, csv.height / 2, 'white');
    playWinSound();
}
// Arka plan rengini değiştiren fonksiyon
function changeBackgroundColor() {
    // Rastgele bir arka plan rengi oluştur
    var randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
    // Arka plan rengini değiştir
    document.body.style.backgroundColor = randomColor;
}
// Basket atıldığında ses efektini çalacak fonksiyon
function playBasketSound() {
    var basketSound = document.getElementById("basketSound");
    basketSound.play();
}
// Duvara çarptığında ses efektini çalacak fonksiyon
function playWallSound() {
    var wallSound = document.getElementById("wallSound");
    wallSound.play();
}
// Oyun kaybedildiğinde ses efektini çalacak fonksiyon
function playFailSound() {
    var failSound = document.getElementById("failSound");
    failSound.play();
}
// Oyun kazanıldığında ses efektini çalacak fonksiyon
function playWinSound() {
    var winSound = document.getElementById("winSound");
    winSound.play();
}

function restart() {
    document.getElementById("level-screen").style.display = "block";
    document.getElementById("levelButtons").style.display = "block";
    //document.getElementById("restart-button").style.display = "none";
    time = minutes * 60;
}

