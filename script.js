document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("fireworks");
    const ctx = canvas.getContext("2d");

    // Background Music
    const bgMusic = new Audio("birthday-music.mp3");
    bgMusic.loop = true;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor(x, y, color, type = "firework") {
            this.x = x;
            this.y = y;
            this.color = color;
            this.type = type;
            this.radius = type === "balloon" ? 8 : Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 6;
            this.speedY = type === "balloon" ? Math.random() * -3 - 2 : (Math.random() - 0.5) * 6;
            this.alpha = 1;
            this.gravity = type === "firework" ? 0.05 : -0.02;
        }

        update() {
            this.speedY += this.gravity;
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.02;
        }

        draw() {
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    let particles = [];
    let balloons = [];
    let textOpacity = 0; // 🔥 For Fade-in Animation
    let textY = 50; // 🔥 For Bounce Effect
    let textDirection = 1;

    function createFirework(x, y) {
        let colors = ["#ff0000", "#ff6600", "#ffcc00", "#00ff00", "#00ccff", "#ff00ff"];
        let fireworkColor = colors[Math.floor(Math.random() * colors.length)];

        for (let i = 0; i < 80; i++) {
            particles.push(new Particle(x, y, fireworkColor, "firework"));
        }
    }

    function createBalloon() {
        let colors = ["#ff66b2", "#66ccff", "#ffcc00", "#ff3300"];
        let balloonColor = colors[Math.floor(Math.random() * colors.length)];
        balloons.push(new Particle(Math.random() * canvas.width, canvas.height, balloonColor, "balloon"));
    }

    function drawText() {
        textOpacity += 0.02;
        if (textOpacity > 1) textOpacity = 1; // Ensure opacity doesn't exceed 1

        // Bounce Effect
        textY += textDirection * 1.5;
        if (textY > 80 || textY < 50) {
            textDirection *= -1;
        }

        ctx.globalAlpha = textOpacity;
        ctx.font = "50px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("🎂 Happy Birthday Riya! 🎉", canvas.width / 2, textY);
        ctx.globalAlpha = 1;
    }

    function animate() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            particle.update();
            particle.draw();
            if (particle.alpha <= 0) {
                particles.splice(index, 1);
            }
        });

        balloons.forEach((balloon, index) => {
            balloon.update();
            balloon.draw();
            if (balloon.y <= -10) {
                balloons.splice(index, 1);
            }
        });

        drawText(); // 🔥 Call animated text function

        requestAnimationFrame(animate);
    }

    function handleEvent(event) {
        let x, y;
        if (event.touches) {
            x = event.touches[0].clientX;
            y = event.touches[0].clientY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        createFirework(x, y);
    }

    document.addEventListener("click", function () {
        if (bgMusic.paused) bgMusic.play();
        handleEvent(event);
    });

    document.addEventListener("touchstart", function () {
        if (bgMusic.paused) bgMusic.play();
        handleEvent(event);
    });

    setInterval(createBalloon, 1000);
    animate();
});