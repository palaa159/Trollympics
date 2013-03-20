<?php include 'header.php'; ?>
    <div id="debug">
        debug:
    </div>
    <div id="welcome" class="8bit">Welcome to Trollympics</div>
    <div id="mobileContainer">
    	<div id="bg"></div>
        <div id="roleSelector">
            <div id="roleRun">
                Choose to be runner
            </div>

            <div id="roleJump">
                Choose to be jumper
            </div>
        </div>

        <div id="shakeCounter">
            <h4>Shake Counter</h4>

            <div class="count"></div>
        </div>

        <div id="jumpOrDuck">
            <h4>You are</h4>

            <div class="jDaction"></div>
        </div>
    </div>

    <div id="canvasContainer">You have chosen to be the larger screen
	    <canvas id="myCanvas" width="1000" height="100">Your browser doesn't support Canvas</canvas>
	    
	    
    </div>
    <!-- End of site content -->
    <?php include 'footer.php'; ?>
