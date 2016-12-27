/**
 * @author	Francisco Santos Belmonte <fjsantosb@gmail.com>
 */

var intel8080 = new Intel8080();
intel8080.loadrom('roms/invaders.rom', 0x0000);

var display = new Display();

var input = new Input();

var main = function () {
    for (var i = 0; i < 2; i++) {
        while (intel8080.cycles < (2000000 / 120)) {
            input.update(intel8080.inPort);
            intel8080.execute();
        }
        intel8080.executeInterrupt();
        intel8080.cycles = 0x00;
    }
	display.clear();
	display.dump(intel8080.memory);
	window.requestAnimationFrame(main);
};
window.requestAnimationFrame(main);