var ScoreDisplay = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
        this.font = new me.BitmapFont("32x32_font", 32);
    },
    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }
 
});

var TimeDisplay = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
        this.font = new me.BitmapFont("32x32_font", 32);
    },
    draw: function(context, x, y) {
        this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);
    }
 
});

var Timer = me.InvisibleEntity.extend({
    init: function(x, y, settings) {
        this.collidable = false;
        this.parent(x, y, settings);

        this.time = 0;
        var boundTimerUpdate = this.updateTimer.bind(this);
        this.recurringTimeCheck = setInterval(boundTimerUpdate, 100);
    },
    updateTimer: function() {
        this.time += 100;
        me.game.HUD.setItemValue("time", TimeParser.parseTime(this.time));
        me.gamestat.setValue("time", this.time);
    },
    onDestroyEvent: function() {
        clearInterval(this.recurringTimeCheck);
    }

});

var FinalDisplay = me.HUD_Item.extend({
    init: function(x, y) {
        this.parent(x, y);
        this.font = new me.BitmapFont("32x32_font", 32);
        this.stats = StatCalculator.getStats();
    },
    draw: function(context, x, y) {
        // this.font.draw(context, this.value, this.pos.x + x, this.pos.y + y);

        var lineCount = 0;
        var yOffset = 60;
        var xLeftOffset = 0;
        var xRightOffset = 80;

        this.font.set("right");
        this.font.draw(context, "FINAL TIME:", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);
        this.font.set("left");
        this.font.draw(
            context, 
            TimeParser.parseTime(me.gamestat.getItemValue("time")),
            this.pos.x+xRightOffset, this.pos.y + lineCount*yOffset
        );

        lineCount++;
        this.font.set("right");
        this.font.draw(context, "TIME BONUS:", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);
        this.font.set("left");
        this.font.draw(
            context, 
            this.stats.timeBonus+"/"+this.stats.availableTimeBonus,
            this.pos.x+xRightOffset, this.pos.y + lineCount*yOffset
        );

        lineCount++;
        this.font.set("right");
        this.font.draw(context, "CHAIRS BURNED:", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);
        this.font.set("left");
        this.font.draw(
            context, 
            me.gamestat.getItemValue("chairsDestroyed"),
            this.pos.x+xRightOffset, this.pos.y + lineCount*yOffset
        );

        lineCount++;
        this.font.set("right");
        this.font.draw(context, "CHAIR BONUS:", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);
        this.font.set("left");
        this.font.draw(
            context, 
            this.stats.chairDestructionBonus,
            this.pos.x+xRightOffset, this.pos.y + lineCount*yOffset
        );

        // lineCount++;
        // this.font.set("right");
        // this.font.draw(context, "CHAIRS JUMPED:", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);
        // this.font.set("left");
        // this.font.draw(
        //     context, 
        //     this.stats.jumpedChairs,
        //     this.pos.x+xRightOffset, this.pos.y + lineCount*yOffset
        // );

        lineCount++;
        this.font.set("right");
        this.font.draw(context, "TROLLACOLAS ", this.pos.x - xLeftOffset - 75, this.pos.y + lineCount*yOffset);

        lineCount++;
        this.font.draw(context, "CONSUMED:", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);
        this.font.set("left");
        this.font.draw(
            context, 
            me.gamestat.getItemValue("trollacolas"),
            this.pos.x+xRightOffset, this.pos.y + lineCount*yOffset
        );

        lineCount++;
        this.font.set("right");
        this.font.draw(context, "TROLLACOLA BONUS:", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);
        this.font.set("left");
        this.font.draw(
            context, 
            this.stats.colaBonus,
            this.pos.x+xRightOffset, this.pos.y + lineCount*yOffset
        );


        // lineCount++;
        // this.font.set("right");
        // this.font.draw(context, "DERPS APPEASED:", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);
        // this.font.set("left");
        // this.font.draw(
        //     context, 
        //     me.gamestat.getItemValue("derps"),
        //     this.pos.x+xRightOffset, this.pos.y + lineCount*yOffset
        // );

        // lineCount++;
        // this.font.set("right");
        // this.font.draw(context, "DERP BONUS:", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);
        // this.font.set("left");
        // this.font.draw(
        //     context, 
        //     this.stats.derpBonus,
        //     this.pos.x+xRightOffset, this.pos.y + lineCount*yOffset
        // );

        lineCount++;
        this.font.set("right", 1.5);
        this.font.draw(context, "FINAL SCORE:", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);
        this.font.set("left", 1.5);
        this.font.draw(
            context, 
            this.stats.score,
            this.pos.x+xRightOffset, this.pos.y + lineCount*yOffset
        );

        lineCount++;
        lineCount++;
        this.font.set("center", 1.5);
        this.font.draw(context, "CLICK TO CONTINUE", this.pos.x - xLeftOffset, this.pos.y + lineCount*yOffset);

    }
});

var StatCalculator = {};

StatCalculator.getStats = function () {
    var score = 0;
    var originalScore = score = me.gamestat.getItemValue("score");

    var availableTimeBonus = 3 * 60 * 1000; //3 minutes
    timeBonus = availableTimeBonus - me.gamestat.getItemValue("time");
    score += timeBonus;

    var destroyedChairs = me.gamestat.getItemValue("chairsDestroyed");
    var chairDestructionBonus = destroyedChairs*500;
    //these points already counted during game, don't add them again here

    var jumpedChairs = me.gamestat.getItemValue("chairsTotal") - me.gamestat.getItemValue("chairsDestroyed");
    var jumpBonus = jumpedChairs * 500;
    score += jumpBonus;

    var colaBonus = me.gamestat.getItemValue("trollacolas") * 1000;
    //these points already counted during game, don't add them again here

    var derpBonus = me.gamestat.getItemValue("derps") * 50;
    score += derpBonus;

    return {
        originalScore: originalScore,
        availableTimeBonus: availableTimeBonus,
        timeBonus: timeBonus,
        chairDestructionBonus: chairDestructionBonus,
        jumpedChairs: jumpedChairs,
        jumpBonus: jumpBonus,
        colaBonus: colaBonus,
        derpBonus: derpBonus,
        score: score
    };
};

var TimeParser = {};

TimeParser.parseTime = function (timeInMS) {
    var timeInS = timeInMS / 1000;
    var mNum = Math.floor(timeInS / 60);
    var sNum = Math.floor(timeInS % 60);
    var m = ("0" + mNum).substr(-2),
    s = ("0" + sNum).substr(-2),
    ms = (""+timeInMS).substr(-3,1);
    return (m + ":" + s + "." + ms);
};