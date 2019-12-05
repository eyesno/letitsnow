(function() {
    let canvas = document.getElementById('canvas');
    canvas.addEventListener('click', onCanvasClick, false);
    let context = canvas.getContext('2d');

    let logo = new Image();
    logo.src = "images/logo.png";
    logo.onload = updateLogo;

    let gDots = []

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        animate();
    }

    function animate() {

        // request another frame
    
        requestAnimationFrame(animate);
    
        // calc elapsed time since last loop
    
        now = Date.now();
        elapsed = now - then;
    
        // if enough time has elapsed, draw the next frame
    
        if (elapsed > fpsInterval) {
    
            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);

            moveDots();
    
            // Put your drawing code here
            drawDots()
        }
    }


    function onCanvasClick() {
        gDots = []
        createDots( 200, '#ffffff', 2);
    }


    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            /**
             * Your drawings need to be inside this function otherwise they will be reset when 
             * you resize the browser window and the canvas goes will be cleared.
             */
           // drawDots(); 
    }

    function drawDots() {
        

        var grd = context.createLinearGradient(0, 0, 0, canvas.height);
        grd.addColorStop(0, "#420D09");
        grd.addColorStop(0.92, "#ba0000");
        grd.addColorStop(1, "white");

        context.fillStyle = grd;
        context.fillRect(0, 0, canvas.width, canvas.height);

        updateLogo();

        for( dot in gDots ) {
            let opacity = toHex(gDots[dot].opacity);
            let colour = gDots[dot].colour + opacity;
            
            // do your drawing stuff here
            context.beginPath();
            context.arc(gDots[dot].x, gDots[dot].y, gDots[dot].radius, 0, 2 * Math.PI);
            context.fillStyle = colour;
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = colour;
            context.stroke();
        }
    }

    function toHex( number ) {
        var hex = Number(number).toString(16);
        return hex;
    }


    function createDots( quantity, colour, maxRadius ) {
        for( i=0; i<quantity; i++ ) {
            
            let radius = Math.random() * maxRadius + 1;    
            
            let direction = randomRange( 45, 135 );
            let opacity = Math.round( randomRange( 50, 255 ) );
            let x = 0;
            let y = 0;

            let newDot = { x: x, y: y, radius: radius, colour: colour, direction: direction, opacity: opacity };

            respawn( newDot );

            gDots.push( newDot )
        }

    }


    function respawn( dot, origin ) {
        if( origin == undefined ) {
            origin = Math.random() * window.innerHeight + 1;
        }

        dot.x = Math.random() * window.innerWidth + 1;
        dot.y = origin;
    }

    function randomRange( min, max ) {
        return Math.random() * (+max - +min) + +min;
    }


    function moveDots() {

        //console.log( 'dot direction=' + gDots[0].direction );
        
        for( index in gDots ) {
            let dot = gDots[index]
            
            dot.x += Math.cos(dot.direction * Math.PI/180 );
            dot.y += Math.sin(dot.direction * Math.PI/180 );

            if( dot.x > (window.innerWidth + dot.radius) ||
                dot.x < (0 - dot.radius) ||
                dot.y > (window.innerHeight + dot.radius) ||
                dot.y < (0 - dot.radius) ) {

                respawn( dot, 0 );
            }
        }
    }


    function updateLogo() {
        logoActive = true;

        let x = window.innerWidth / 2 - logo.width / 2;
        let y = window.innerHeight / 2 - logo.height / 2;

        context.globalAlpha = 0.7;
        context.drawImage( logo, x, y );
        context.globalAlpha = 1.0;
    }

    
    createDots( 200, '#FFFFFF', 2);
    resizeCanvas();
   
    startAnimating( 60 );

})();