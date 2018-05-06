/**
 * @author	Francisco Santos Belmonte <fjsantosb@gmail.com>
 */

var INTEL8080 = function() {
    this.cpu = new INTEL8080.Cpu();
    this.display = new INTEL8080.Display();
    this.input = new INTEL8080.Input();
};

INTEL8080.prototype = {
    loadrom: function (file, address) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', file, false);
		xhr.overrideMimeType('text/plain; charset=x-user-defined');
		xhr.send();
		for(var i = 0; i < xhr.responseText.length; i++) {
			this.cpu.memory[address + i] = xhr.responseText.charCodeAt(i) & 0xff; 
		}
	},
    run: function() {
        for (var i = 0; i < 2; i++) {
            while (this.cpu.cycles < (2000000 / 120)) {
                this.input.update(this.cpu.inPort);
                this.cpu.run();
            }
            this.cpu.executeInterrupt();
            this.cpu.cycles = 0x00;
        }
        this.display.clear();
        this.display.dump(this.cpu.memory);
        window.requestAnimationFrame(this.run.bind(this));
    }
};