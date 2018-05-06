/**
 * @author	Francisco Santos Belmonte <fjsantosb@gmail.com>
 */

INTEL8080.Display = function () {
    this.canvas = document.getElementById('emulator');
    this.context = this.canvas.getContext('2d');
    this.context.fillStyle = '#ffffff';
};

INTEL8080.Display.prototype = {
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    clearPixel: function (x, y) {
    	this.context.clearRect(x, y, 1, 1);
    },

    setPixel: function (x, y) {
    	this.context.fillRect(x, y, 1, 1);
    },

    dump: function (memory) {
        var n = 0;
		for (var i = 0; i < this.canvas.width; i++) {
			for (var j = this.canvas.height - 1; j > 0; j -= 8) {
                var byte = memory[0x2400 + n];
                ((byte & 0x01) !== 0) ? this.setPixel(i, j - 0x00) : null;
                ((byte & 0x02) !== 0) ? this.setPixel(i, j - 0x01) : null;
                ((byte & 0x04) !== 0) ? this.setPixel(i, j - 0x02) : null;
                ((byte & 0x08) !== 0) ? this.setPixel(i, j - 0x03) : null;
                ((byte & 0x10) !== 0) ? this.setPixel(i, j - 0x04) : null;
                ((byte & 0x20) !== 0) ? this.setPixel(i, j - 0x05) : null;
                ((byte & 0x40) !== 0) ? this.setPixel(i, j - 0x06) : null;
                ((byte & 0x80) !== 0) ? this.setPixel(i, j - 0x07) : null;
                n++;
			}
		}
    }
};