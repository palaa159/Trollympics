<?php include 'header.php'; ?>

<!--
    <div id="debug">
        debug:
    </div>
-->
    <div id="mobileContainer">
    	<div id="bg"></div>
    	<div id="logo"><img src="img/trollympics_michael.png" alt="logo" width="500px" height=""></div>
    	<br>
    	<div id="contentMobile">
    	<button id="inputId" class="btn btn-large btn-warning">Input the game code</button><br>
    	<p class="noCode">I don't have a game code</p>
    	<div id="roleSelector">
        <p>Select your role</p>
            <div id="roleRun">
            </div>

            <div id="roleJump">
            </div>
            <button id="userReady" class="btn btn-large btn-warning">Ready</button>
        </div>
    	<p class="mozilla">Trollympics is exclusively made for Mozilla Game On Contest 2013</p>
    	</div>
    	<div id="howToRun"><p class="inst">Run! troll! run!</p><p class="inst">Shake your phone!</p></div>
        <div id="howToJump"><p class="inst">Jump! troll! jump!</p><p class="inst">Lift your phone to jump!</p></div>
    </div>
    
<!--     separator -->
    
    <div id="desktopContainer">
    <div id="content">
    	<div class="logo"><img src="img/trollympics_michael.png" alt="logo" width="500px" height=""></div>
    <div id="canvasId">Generating your game code ...</div>
    <div id="connectionAwait">waiting for <span class="mobileConnect">2</span> brave trollympians !</div>
    <div id="footer">
    <ul>
		<li>How to play : from your smartphone, navigate to <br>http://bit.ly/trollympics</li>
    </ul>
    Trollympics requires 2 players with 2 smartphones to enter the game. <br>Just like when you play a console!
    </div>
    <a href="https://www.youtube.com/watch?v=dJJKKdf4acE" target="_blank"><p class="about">No clue? See the video.</p></a>
    </div>
    <div id="canvasContainer"> <!-- 1378 x 702 px -->
    <font color="#FFFFFF", style="position: absolute; font-size: 10px; font-family: Courier New"><span id="framecounter">(0/0 fps)</span>
	</font>
    </div>
    </div>

<?php include 'footer.php'; ?>
