<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Trollympics</title>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="description" content="Coolest mobile game on earth">
        <meta name="viewport" content="width=device-width">
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
		<link href='http://fonts.googleapis.com/css?family=Wellfleet' rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="css/bootstrap.css">
        <script src="http://ec2-54-245-151-226.us-west-2.compute.amazonaws.com:5000/socket.io/socket.io.js"></script>
        <script src="js/vendor/modernizr-2.6.1.min.js"></script>
        <script>
			yepnope({
				test: Modernizr.touch,
				yep: 'js/mobile.js',
				nope: [
                'game/melonjs/melonJS-0.9.5.js',
                'game/player.js',
                'game/hud.js',
                'game/obstacles.js',
                'game/collectables.js',
                'game/environment.js',
                'game/trollympics_main.js',
                'js/canvas.js'
                ]
			});
		</script>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
        <![endif]-->