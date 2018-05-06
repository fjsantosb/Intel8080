/**
 * @author  Francisco Santos Belmonte <fjsantosb@moleculejs.net>
 */

INTEL8080.Touch = function () {
    this.insertCoin = false;
    this.playerOne = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.fire = false;

    window.ontouchstart = (function(e) {
        this.touchStart(e);
    }).bind(this);
    window.ontouchend = (function(e) {
        this.touchEnd(e);
    }).bind(this);
};

INTEL8080.Touch.prototype = {
    touchStart: function (e) {
        this.updateTouches(e);
    },

    touchEnd: function (e) {
        this.updateTouches(e);
    },

    updateTouches: function (e) {
        this.insertCoin = false;
        this.playerOne = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.fire = false;
        for(var i = 0; i < e.targetTouches.length; i++) {
            if(e.targetTouches[i].pageX < 50 && e.targetTouches[i].pageY < 50) {
                this.insertCoin = true;
            }
            if(e.targetTouches[i].pageX > 300 && e.targetTouches[i].pageY < 50) {
                this.playerOne = true;
            }
            if(e.targetTouches[i].pageX < 224 && e.targetTouches[i].pageY < 512) {
                this.moveLeft = true;
            }
            if(e.targetTouches[i].pageX > 224 && e.targetTouches[i].pageY < 512) {
                this.moveRight = true;
            }
            if(e.targetTouches[i].pageX > 0 && e.targetTouches[i].pageY > 512) {
                this.fire = true;
            }
        }
    },

    update: function (inPort) {
        this.insertCoin ? inPort[1] |= 0x01 : inPort[1] &= 0xfe;
        this.playerOne ? inPort[1] |= 0x04 : inPort[1] &= 0xfb;
        this.moveLeft ? inPort[1] |= 0x20 : inPort[1] &= 0xdf;
        this.moveRight ? inPort[1] |= 0x40 : inPort[1] &= 0xbf;
        this.fire ? inPort[1] |= 0x10 : inPort[1] &= 0xef;
    }
};

