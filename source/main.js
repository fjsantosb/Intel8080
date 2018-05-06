/**
 * @author	Francisco Santos Belmonte <fjsantosb@gmail.com>
 */

var intel8080 = new INTEL8080();
intel8080.loadrom('roms/invaders.rom', 0x0000);
intel8080.run();