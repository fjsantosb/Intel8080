/**
 * @author  Francisco Santos Belmonte <fjsantosb@moleculejs.net>
 */

Input = function () {

    this.key = [];
    
    this.one = 0x31;
    this.c = 0x43;
    this.left = 0x25;
    this.right = 0x27;
    this.up = 0x26;

    window.onkeydown = (function (e) {
        this.keyDown(e);
    }).bind(this);
    window.onkeyup = (function (e) {
        this.keyUp(e);
    }).bind(this);
};

Input.prototype = {

    keyDown: function (e) {
        e.preventDefault();
        this.key[e.keyCode] = true;
    },

    keyUp: function (e) {
        e.preventDefault();
        this.key[e.keyCode] = false;
    },

    update: function (inPort) {
        (this.key[this.one] === true) ? inPort[1] |= 0x04 : inPort[1] &= 0xfb;
        (this.key[this.c] === true) ? inPort[1] |= 0x01 : inPort[1] &= 0xfe;
        (this.key[this.left] === true) ? inPort[1] |= 0x20 : inPort[1] &= 0xdf;
        (this.key[this.right] === true) ? inPort[1] |= 0x40 : inPort[1] &= 0xbf;
        (this.key[this.up] === true) ? inPort[1] |= 0x10 : inPort[1] &= 0xef;
    }
};