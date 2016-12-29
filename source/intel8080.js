/**
 * @author	Francisco Santos Belmonte <fjsantosb@gmail.com>
 */

Intel8080 = function () {
	this.a = 0x00;
	this.b = 0x00;
	this.c = 0x00;
	this.d = 0x00;
	this.e = 0x00;
	this.h = 0x00;
	this.l = 0x00;

	this.pc = 0x0000;
	this.sp = 0x0000;

	this.zero = 0x00;
	this.sign = 0x00;
	this.parity = 0x00;
	this.carry = 0x00;
	this.halfcarry = 0x00;
    	this.interrupt = {enabled: 0x01, type: 0x08};
	this.crash = 0x00;

	this.memory = [];

	for (var i = 0; i < 0xffff; i++) {
		this.memory[i] = 0x00;
	}

	this.inPort = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
	this.outPort = [0x00, 0x00, 0x00, 0x00, 0x0000, 0x00, 0x00, 0x00];

	this.cycles = 0x00;
};

Intel8080.prototype = {
	loadrom: function (file, address) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', file, false);
		xhr.overrideMimeType('text/plain; charset=x-user-defined');
		xhr.send();
		for(var i = 0; i < xhr.responseText.length; i++) {
			this.memory[address + i] = xhr.responseText.charCodeAt(i) & 0xff; 
		}
	},

	execute: function () {
		var opcode = this.memory[this.pc];
		switch (opcode) {
			case 0x00:
				this.nop();
			break;
			case 0x01:
				var register = this.lxi();
				this.b = register.high;
				this.c = register.low;
			break;
			case 0x02:
                this.stax(this.b, this.c);
			break;
			case 0x03:
                var register = this.inx(this.b, this.c);
                this.b = register.high;
                this.c = register.low;
			break;
			case 0x04:
                this.b = this.inr(this.b);
			break;
			case 0x05:
				this.b = this.dcr(this.b);
			break;
			case 0x06:
				this.b = this.mvi();
			break;
			case 0x07:
				this.rlc();
			break;
			case 0x08:
				this.nop();
			break;
			case 0x09:
				this.dad(this.b, this.c);
			break;
            case 0x0a:
				this.ldax(this.b, this.c);
			break;
			case 0x0b:
                var register = this.dcx(this.b, this.c);
                this.b = register.high;
                this.c = register.low;
			break;
			case 0x0c:
                this.c = this.inr(this.c);
			break;
			case 0x0d:
				this.c = this.dcr(this.c);
			break;
			case 0x0e:
				this.c = this.mvi();
			break;
			case 0x0f:
				this.rrc();
			break;
			case 0x10:
				this.nop();
			break;
			case 0x11:
				var register = this.lxi(this.d, this.e);
				this.d = register.high;
				this.e = register.low;
			break;
			case 0x12:
                this.stax(this.d, this.e);
			break;
			case 0x13:
				var register = this.inx(this.d, this.e);
				this.d = register.high;
				this.e = register.low;
			break;
			case 0x14:
                this.d = this.inr(this.d);
			break;
			case 0x15:
                this.d = this.dcr(this.d);
			break;
			case 0x16:
                this.d = this.mvi();
			break;
			case 0x17:
                this.ral();
			break;
			case 0x18:
				this.nop();
			break;
			case 0x19:
				this.dad(this.d, this.e);
			break;
			case 0x1a:
				this.ldax(this.d, this.e);
			break;
			case 0x1b:
				var register = this.dcx(this.d, this.e);
				this.d = register.high;
				this.e = register.low;
			break;
			case 0x1c:
                this.e = this.inr(this.e);
			break;
			case 0x1d:
                this.e = this.dcr(this.e);
			break;
			case 0x1e:
                this.e = this.mvi();
			break;
			case 0x1f:
                this.rar();
			break;
			case 0x20:
				// RIM: not available on Intel 8080 processor (available on 8085)
				this.nop();
			break;
			case 0x21:
				var register = this.lxi(this.h, this.l);
				this.h = register.high;
				this.l = register.low;	
			break;
			case 0x22:
				this.shld();
			break;
			case 0x23:
				var register = this.inx(this.h, this.l);
				this.h= register.high;
				this.l = register.low;			
			break;
			case 0x24:
                this.h = this.inr(this.h);
			break;
			case 0x25:
                this.h = this.dcr(this.h);
			break;
			case 0x26:
				this.h = this.mvi();
			break;
			case 0x27:
                this.daa();
            break;
			case 0x28:
				this.nop();
			break;
			case 0x29:
				this.dad(this.h, this.l);
			break;
			case 0x2a:
				this.lhld();
			break;
			case 0x2b:
                var register = this.dcx(this.h, this.l);
                this.h = register.high;
                this.l = register.low;
			break;
			case 0x2c:
                this.l = this.inr(this.l);
			break;
			case 0x2d:
                this.l = this.dcr(this.l);
			break;
			case 0x2e:
                this.l = this.mvi();
			break;
			case 0x2f:
				this.cma();
			break;
			case 0x30:
				// SIM: not available on Intel 8080 processor (available on 8085)
				this.nop();
			break;
			case 0x31:
				var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
				this.sp = address;
				this.pc += 0x03;
				this.cycles += 0x0a;
			break;
			case 0x32:
				this.sta();
			break;
			case 0x33:
				this.sp = (this.sp + 0x01) & 0xffff;
				this.pc += 0x01;
				this.cycles += 0x05;
			break;
			case 0x34:
				var hl = (this.h << 0x08) | this.l;
				this.memory[hl] = this.inr(this.memory[hl]);
				this.cycles += 0x05;
			break;
			case 0x35:
				var hl = (this.h << 0x08) | this.l;
				this.memory[hl] = this.dcr(this.memory[hl]);
				this.cycles += 0x05;
			break;
			case 0x36:
				var hl = (this.h << 0x08) | this.l;
				this.memory[hl] = this.memory[this.pc + 0x01];
				this.pc += 0x02;
				this.cycles += 0x0a;
			break;
			case 0x37:
                this.stc();
			break;
			case 0x38:
				this.nop();
			break;
			case 0x39:
				var hl = (this.h << 0x08) | this.l;
				var carry = 0x00;
				hl += this.sp;
				(hl > 0xffff) ? carry = 0x01 : carry = 0x00;
				hl &= 0xffff;
				this.h = (hl >> 0x08) & 0xff;
				this.l = hl & 0xff;
				this.setflagC(carry);
				this.pc += 0x01;
				this.cycles += 0x0a;
			break;
			case 0x3a:
				var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
				this.a = this.memory[address];
				this.pc += 0x03;
				this.cycles += 0x0d;
			break;
			case 0x3b:
				this.sp = (this.sp - 0x01) & 0xffff;
				this.pc += 0x01;
				this.cycles += 0x05;
			break;
			case 0x3c:
                this.a = this.inr(this.a);
			break;
			case 0x3d:
                this.a = this.dcr(this.a);
			break;
			case 0x3e:
				this.a = this.mvi();
			break;
			case 0x3f:
				this.cmc();
			break;
			case 0x40:
                this.b = this.mov(this.b);
			break;
			case 0x41:
                this.b = this.mov(this.c);
			break;
			case 0x42:
                this.b = this.mov(this.d);
			break;
			case 0x43:
                this.b = this.mov(this.e);
			break;
			case 0x44:
                this.b = this.mov(this.h);
			break;
			case 0x45:
                this.b = this.mov(this.l);
			break;
			case 0x46:
				var hl = (this.h << 0x08) | this.l;
				this.b = this.mov(this.memory[hl]);
				this.cycles += 0x02;
			break;
			case 0x47:
                this.b = this.mov(this.a);
			break;
			case 0x48:
                this.c = this.mov(this.b);
			break;
			case 0x49:
                this.c = this.mov(this.c);
			break;
			case 0x4a:
                this.c = this.mov(this.d);
			break;
			case 0x4b:
                this.c = this.mov(this.e);
			break;
			case 0x4c:
                this.c = this.mov(this.h);
			break;
			case 0x4d:
                this.c = this.mov(this.l);
			break;
			case 0x4e:
				var hl = (this.h << 0x08) | this.l;
				this.c = this.mov(this.memory[hl]);
				this.cycles += 0x02;
			break;
			case 0x4f:
                this.c = this.mov(this.a);
			break;
			case 0x50:
                this.d = this.mov(this.b);
			break;
			case 0x51:
                this.d = this.mov(this.c);
			break;
			case 0x52:
                this.d = this.mov(this.d);
			break;
			case 0x53:
                this.d = this.mov(this.e);
			break;
			case 0x54:
                this.d = this.mov(this.h);
			break;
			case 0x55:
                this.d = this.mov(this.l);
			break;
			case 0x56:
				var hl = (this.h << 0x08) | this.l;
				this.d = this.mov(this.memory[hl]);
				this.cycles += 0x02;
			break;
			case 0x57:
                this.d = this.mov(this.a);
			break;
			case 0x58:
                this.e = this.mov(this.b);
			break;
			case 0x59:
                this.e = this.mov(this.c);
			break;
			case 0x5a:
                this.e = this.mov(this.d);
			break;
			case 0x5b:
                this.e = this.mov(this.e);
			break;
			case 0x5c:
                this.e = this.mov(this.h);
			break;
			case 0x5d:
                this.e = this.mov(this.l);
			break;
			case 0x5e:
				var hl = (this.h << 0x08) | this.l;
				this.e = this.mov(this.memory[hl]);
				this.cycles += 0x02;
			break;
			case 0x5f:
                this.e = this.mov(this.a);
			break;
			case 0x60:
                this.h = this.mov(this.b);
			break;
			case 0x61:
                this.h = this.mov(this.c);
			break;
			case 0x62:
                this.h = this.mov(this.d);
			break;
			case 0x63:
                this.h = this.mov(this.e);
			break;
			case 0x64:
                this.h = this.mov(this.h);
			break;
			case 0x65:
                this.h = this.mov(this.l);
			break;
			case 0x66:
				var hl = (this.h << 0x08) | this.l;
				this.h = this.mov(this.memory[hl]);
				this.cycles += 0x02;
			break;
			case 0x67:
                this.h = this.mov(this.a);
			break;
			case 0x68:
                this.l = this.mov(this.b);
			break;
			case 0x69:
                this.l = this.mov(this.c);
			break;
			case 0x6a:
                this.l = this.mov(this.d);
			break;
			case 0x6b:
                this.l = this.mov(this.e);
			break;
			case 0x6c:
                this.l = this.mov(this.h);
			break;
			case 0x6d:
                this.l = this.mov(this.l);
			break;
			case 0x6e:
                var hl = (this.h << 0x08) | this.l;
				this.l = this.mov(this.memory[hl]);
				this.cycles += 0x02;
			break;
			case 0x6f:
                this.l = this.mov(this.a);
			break;
			case 0x70:
				var hl = (this.h << 0x08) | this.l;
				this.memory[hl] = this.mov(this.b);
				this.cycles += 0x02;
			break;
			case 0x71:
				var hl = (this.h << 0x08) | this.l;
				this.memory[hl] = this.mov(this.c);
				this.cycles += 0x02;
			break;
			case 0x72:
				var hl = (this.h << 0x08) | this.l;
				this.memory[hl] = this.mov(this.d);
				this.cycles += 0x02;
			break;
			case 0x73:
				var hl = (this.h << 0x08) | this.l;
				this.memory[hl] = this.mov(this.e);
				this.cycles += 0x02;
			break;
			case 0x74:
				var hl = (this.h << 0x08) | this.l;
				this.memory[hl] = this.mov(this.h);
				this.cycles += 0x02;
			break;
			case 0x75:
				var hl = (this.h << 0x08) | this.l;
				this.memory[hl] = this.mov(this.l);
				this.cycles += 0x02;
			break;
			case 0x76:
				// HLT
				this.cycles += 0x07;
			break;
			case 0x77:
				var hl = (this.h << 0x08) | this.l;
				this.memory[hl] = this.mov(this.a);
				this.cycles += 0x02;
			break;
			case 0x78:
                this.a = this.mov(this.b);
			break;
			case 0x79:
                this.a = this.mov(this.c);
			break;
			case 0x7a:
                this.a = this.mov(this.d);
			break;
			case 0x7b:
                this.a = this.mov(this.e);
			break;
			case 0x7c:
                this.a = this.mov(this.h);
			break;
			case 0x7d:
                this.a = this.mov(this.l);
			break;
			case 0x7e:
                var hl = (this.h << 0x08) | this.l;
				this.a = this.mov(this.memory[hl]);
				this.cycles += 0x02;
			break;
			case 0x7f:
                this.a = this.mov(this.a);
			break;
			case 0x80:
                this.a = this.add(this.b);
			break;
			case 0x81:
                this.a = this.add(this.c);
			break;
			case 0x82:
                this.a = this.add(this.d);
			break;
			case 0x83:
                this.a = this.add(this.e);
			break;
			case 0x84:
                this.a = this.add(this.h);
			break;
			case 0x85:
                this.a = this.add(this.l);
			break;
			case 0x86:
				var hl = (this.h << 0x08) | this.l;
				this.a = this.add(this.memory[hl]);
				this.cycles += 0x03;
			break;
			case 0x87:
                this.a = this.add(this.a);
			break;
			case 0x88:
				this.a = this.adc(this.b);
			break;
			case 0x89:
                this.a = this.adc(this.c);
			break;
			case 0x8a:
                this.a = this.adc(this.d);
			break;
			case 0x8b:
                this.a = this.adc(this.e);
			break;
			case 0x8c:
                this.a = this.adc(this.h);
			break;
			case 0x8d:
                this.a = this.adc(this.l);
			break;
			case 0x8e:
				var hl = (this.h << 0x08) | this.l;
				this.a = this.adc(this.memory[hl]);
				this.cycles += 0x03;
			break;
			case 0x8f:
                this.a = this.adc(this.a);
			break;
			case 0x90:
				this.a = this.sub(this.b);
			break;
			case 0x91:
                this.a = this.sub(this.c);
			break;
			case 0x92:
                this.a = this.sub(this.d);
			break;
			case 0x93:
                this.a = this.sub(this.e);
			break;
			case 0x94:
                this.a = this.sub(this.h);
			break;
			case 0x95:
                this.a = this.sub(this.l);
			break;
			case 0x96:
				var hl = (this.h << 0x08) | this.l;
				this.a = this.sub(this.memory[hl]);
				this.cycles += 0x03;
			break;
			case 0x97:
                this.a = this.sub(this.a);
			break;
			case 0x98:
                this.a = this.sbb(this.b);
			break;
			case 0x99:
                this.a = this.sbb(this.c);
			break;
			case 0x9a:
                this.a = this.sbb(this.d);
			break;
			case 0x9b:
                this.a = this.sbb(this.e);
			break;
			case 0x9c:
                this.a = this.sbb(this.h);
			break;
			case 0x9d:
                this.a = this.sbb(this.l);
			break;
			case 0x9e:
				var hl = (this.h << 0x08) | this.l;
				this.a = this.sbb(this.memory[hl]);
				this.cycles += 0x03;
			break;
			case 0x9f:
                this.a = this.sbb(this.a);
			break;
			case 0xa0:
                this.a = this.ana(this.b);
			break;
			case 0xa1:
                this.a = this.ana(this.c);
			break;
			case 0xa2:
                this.a = this.ana(this.d);
			break;
			case 0xa3:
                this.a = this.ana(this.e);
			break;
			case 0xa4:
                this.a = this.ana(this.h);
			break;
			case 0xa5:
                this.a = this.ana(this.l);
			break;
			case 0xa6:
				var hl = (this.h << 0x08) | this.l;
				this.a = this.ana(this.memory[hl]);
				this.cycles += 0x03;
			break;
			case 0xa7:
                this.a = this.ana(this.a);
			break;
			case 0xa8:
				this.a = this.xra(this.b);
			break;
			case 0xa9:
                this.a = this.xra(this.c);
			break;
			case 0xaa:
                this.a = this.xra(this.d);
			break;
			case 0xab:
                this.a = this.xra(this.e);
			break;
			case 0xac:
                this.a = this.xra(this.h);
			break;
			case 0xad:
                this.a = this.xra(this.l);
			break;
			case 0xae:
				var hl = (this.h << 0x08) | this.l;
				this.a = this.xra(this.memory[hl]);
				this.cycles += 0x03;
			break;
			case 0xaf:
                this.a = this.xra(this.a);
			break;
			case 0xb0:
                this.a = this.ora(this.b);
			break;
			case 0xb1:
                this.a = this.ora(this.c);
			break;
			case 0xb2:
                this.a = this.ora(this.d);
			break;
			case 0xb3:
                this.a = this.ora(this.e);
			break;
			case 0xb4:
                this.a = this.ora(this.h);
			break;
			case 0xb5:
                this.a = this.ora(this.l);
			break;
			case 0xb6:
				var hl = (this.h << 0x08) | this.l;
				this.a = this.ora(this.memory[hl]);
				this.cycles += 0x03;
			break;
			case 0xb7:
                this.a = this.ora(this.a);
			break;
			case 0xb8:
                this.cmp(this.b);
			break;
			case 0xb9:
                this.cmp(this.c);
			break;
			case 0xba:
                this.cmp(this.d);
			break;
			case 0xbb:
                this.cmp(this.e);
			break;
			case 0xbc:
                this.cmp(this.h);
			break;
			case 0xbd:
                this.cmp(this.l);
			break;
			case 0xbe:
				var hl = (this.h << 0x08) | this.l;
				this.a = this.cmp(this.memory[hl]);
				this.cycles += 0x03;
			break;
			case 0xbf:
                this.cmp(this.a);
			break;
			case 0xc0:
                this.rnz();
			break;
			case  0xc1:
				var register = this.pop(this.b, this.c);
				this.b = register.high;
				this.c = register.low;
			break;
			case 0xc2:
                this.jnz();
			break;
			case 0xc3:
                this.jmp();
			break;
			case 0xc4:
                this.cnz();
			break;
			case 0xc5:
				this.push(this.b, this.c);
			break;
			case 0xc6:
				this.adi();
			break;
			case 0xc7:
                this.rst(0x00);
			break;
			case 0xc8:
                this.rz();
			break;
			case 0xc9:
                this.ret();
			break;
			case 0xca:
                this.jz();
			break;
			case 0xcb:
				this.nop();
			break;
			case 0xcc:
				this.cz();
			break;
			case 0xcd:
				this.call();
			break;
			case 0xce:
				this.aci();
			break;
			case 0xcf:
				this.rst(0x08);
			break;
			case 0xd0:
				this.rnc();
			break;
			case 0xd1:
				var register = this.pop(this.d, this.e);
				this.d = register.high;
				this.e = register.low;
			break;
			case 0xd2:
				this.jnc();
			break;
			case 0xd3:
				this.out();
			break;
			case 0xd4:
				this.cnc();
			break;
			case 0xd5:
				this.push(this.d, this.e);
			break;
			case 0xd6:
				this.sui();
			break;
			case 0xd7:
				this.rst(0x10);
			break;
			case 0xd8:
				this.rc();	
			break;
			case 0xd9:
				this.nop();
			break;
			case 0xda:
				var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
				(this.carry !== 0x00) ? this.pc = address : this.pc = this.pc += 0x03;
				this.cycles += 0x0a;
			break;
			case 0xdb:
				var port = this.memory[this.pc + 0x01];
				switch (port) {
					case 0x03:
						var v = (this.outPort[4] << this.outPort[2]);
						v >>= 0x08;
						v &= 0xff;
						this.a = v;
					break;
					default:
						this.a = this.inPort[port];
					break;
				}
				this.pc += 0x02;
				this.cycles += 0x0a;
			break;
			case 0xdc:
				var address = (this.memory[this.pc + 0x02] << 0x08) + this.memory[this.pc + 0x01];
				(this.carry !== 0x00) ? this.memory[this.sp - 0x01] = ((this.pc + 0x03) >> 0x08) & 0xff : this.sp = this.sp;
				(this.carry !== 0x00) ? this.memory[this.sp - 0x02] = (this.pc + 0x03) & 0xff : this.sp = this.sp;
				(this.carry !== 0x00) ? this.sp -= 0x02 : this.sp = this.sp;
				(this.carry !== 0x00) ? this.pc = address : this.pc = this.pc + 0x03;
				(this.carry !== 0x00) ? this.cycles += 0x11 : this.cycles += 0x0b;
			break;
			case 0xdd:
				this.nop();
			break;
			case 0xde:
				var carry = 0x00;
				this.a = this.a - this.memory[this.pc + 0x01] - this.carry;
				(this.a < 0x00) ? carry = 0x01 : carry = 0x00;
				this.a &= 0xff;
				this.setflagsZSP(this.a);
				this.setflagC(carry);
				this.pc += 0x02;
				this.cycles += 0x07;
			break;
			case 0xdf:
				this.rst(0x18);
			break;
			case 0xe0:
				(this.parity === 0x00) ? this.pc = (this.memory[this.sp + 0x01] << 0x08) | (this.memory[this.sp]) : this.pc += 0x01;
				(this.parity === 0x00) ? this.sp += 0x02 : this.sp = this.sp;
				(this.parity === 0x00) ? this.cycles += 0x0b : this.cycles += 0x05;
			break;
			case 0xe1:
				var register = this.pop(this.h, this.l);
				this.h = register.high;
				this.l = register.low;
			break;
			case 0xe2:
				var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
				(this.parity === 0x00) ? this.pc = address : this.pc = this.pc += 0x03;
				this.cycles += 0x0a;
			break;
			case 0xe3:
				var h = this.h;
				var l = this.l;
				this.h = this.memory[this.sp + 0x01];
				this.memory[this.sp + 0x01] = h;
				this.l = this.memory[this.sp];
				this.memory[this.sp] = l;
				this.pc += 0x01;
				this.cycles += 0x12;
			break;
			case 0xe4:
				var address = (this.memory[this.pc + 0x02] << 0x08) + this.memory[this.pc + 0x01];
				(this.parity === 0x00) ? this.memory[this.sp - 0x01] = ((this.pc + 0x03) >> 0x08) & 0xff : this.sp = this.sp;
				(this.parity === 0x00) ? this.memory[this.sp - 0x02] = (this.pc + 0x03) & 0xff : this.sp = this.sp;
				(this.parity === 0x00) ? this.sp -= 0x02 : this.sp = this.sp;
				(this.parity === 0x00) ? this.pc = address : this.pc = this.pc + 0x03;
				(this.parity === 0x00) ? this.cycles += 0x11 : this.cycles += 0x0b;
			break;
			case 0xe5:
				this.push(this.h, this.l);
			break;
			case 0xe6:
				var carry = 0x00;
				this.a &= this.memory[this.pc + 0x01];
				this.setflagsZSP(this.a);
				this.setflagC(carry);
				this.pc += 0x02;
				this.cycles += 0x07;
			break;
			case 0xe7:
				this.rst(0x20);
			break;
			case 0xe8:
				(this.parity !== 0x00) ? this.pc = (this.memory[this.sp + 0x01] << 0x08) | (this.memory[this.sp]) : this.pc += 0x01;
				(this.parity !== 0x00) ? this.sp += 0x02 : this.sp = this.sp;
				(this.parity !== 0x00) ? this.cycles += 0x0b : this.cycles += 0x05;
			break;
			case 0xe9:
				this.pc = (this.h << 8) | this.l;
				this.cycles += 5;
			break;
			case 0xea:
				var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
				(this.parity !== 0x00) ? this.pc = address : this.pc = this.pc += 0x03;
				this.cycles += 0x0a;
			break;
			case 0xeb:
				var h = this.h;
				var l = this.l;
				this.h = this.d;
				this.d = h;
				this.l = this.e;
				this.e = l;
				this.pc += 0x01;
				this.cycles += 0x05;
			break;
			case 0xec:
				var address = (this.memory[this.pc + 0x02] << 0x08) + this.memory[this.pc + 0x01];
				(this.parity !== 0x00) ? this.memory[this.sp - 0x01] = ((this.pc + 0x03) >> 0x08) & 0xff : this.sp = this.sp;
				(this.parity !== 0x00) ? this.memory[this.sp - 0x02] = (this.pc + 0x03) & 0xff : this.sp = this.sp;
				(this.parity !== 0x00) ? this.sp -= 0x02 : this.sp = this.sp;
				(this.parity !== 0x00) ? this.pc = address : this.pc = this.pc + 0x03;
				(this.parity !== 0x00) ? this.cycles += 0x11 : this.cycles += 0x0b;
			break;
			case 0xed:
				this.nop();
			break;
			case 0xee:
				var carry = 0x00;
				this.a ^= this.memory[this.pc + 0x01];
				this.setflagsZSP(this.a);
				this.setflagC(carry);
				this.pc += 0x02;
				this.cycles += 0x07;
			break;
			case 0xef:
				this.rst(0x28);
			break;
			case 0xf0:
				(this.sign === 0x00) ? this.pc = (this.memory[this.sp + 0x01] << 0x08) | (this.memory[this.sp]) : this.pc += 0x01;
				(this.sign === 0x00) ? this.sp += 0x02 : this.sp = this.sp;
				(this.sign === 0x00) ? this.cycles += 0x0b : this.cycles += 0x05;
			break;
			case 0xf1:
				var f = this.memory[this.sp];
				((f & 0x01) !== 0) ? this.carry = 0x01 : this.carry = 0x00;
				((f & 0x04) !== 0) ? this.parity = 0x01 : this.parity = 0x00;
				((f & 0x040) !== 0) ? this.zero = 0x01 : this.zero = 0x00;
				((f & 0x080) !== 0) ? this.sign = 0x01 : this.sign = 0x00;
				this.a = this.memory[this.sp + 0x01];
				this.sp += 0x02;
				this.pc += 0x01;
				this.cycles += 0x0a;
			break;
			case 0xf2:
				var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
				(this.sign === 0x00) ? this.pc = address : this.pc = this.pc += 0x03;
				this.cycles += 0x0a;
			break;
			case 0xf3:
				this.interrupt.enabled = 0x00;
				this.pc += 0x01;
				this.cycles += 0x04;
			break;
			case 0xf4:
				var address = (this.memory[this.pc + 0x02] << 0x08) + this.memory[this.pc + 0x01];
				(this.sign === 0x00) ? this.memory[this.sp - 0x01] = ((this.pc + 0x03) >> 0x08) & 0xff : this.sp = this.sp;
				(this.sign === 0x00) ? this.memory[this.sp - 0x02] = (this.pc + 0x03) & 0xff : this.sp = this.sp;
				(this.sign === 0x00) ? this.sp -= 0x02 : this.sp = this.sp;
				(this.sign === 0x00) ? this.pc = address : this.pc = this.pc + 0x03;
				(this.sign === 0x00) ? this.cycles += 0x11 : this.cycles += 0x0b;
			break;
			case 0xf5:
				var b0 = this.carry;
				var b1 = 0x01;
				var b2 = this.parity;
				var b3 = 0x00;
				var b4 = 0x00;
				var b5 = 0x00;
				var b6 = this.zero;
				var b7 = this.sign;
				var f = (b7 << 7) | (b6 << 6) | (b5 << 5) | (b4 << 4) | (b3 << 3) | (b2 << 2) | (b1 << 1) | (b0 << 0);
				this.memory[this.sp - 0x02] = f;
				this.memory[this.sp - 0x01] = this.a;
				this.sp -= 0x02;
				this.pc += 0x01;
				this.cycles += 0x0b;
			break;
			case 0xf6:
				var carry = 0x00;
				this.a |= this.memory[this.pc + 0x01];
				this.setflagsZSP(this.a);
				this.setflagC(carry);
				this.pc += 0x02;
				this.cycles += 0x07;
			break;
			case 0xf7:
				this.rst(0x30);
			break;
			case 0xf8:
				(this.sign !== 0x00) ? this.pc = (this.memory[this.sp + 0x01] << 0x08) | (this.memory[this.sp]) : this.pc += 0x01;
				(this.sign !== 0x00) ? this.sp += 0x02 : this.sp = this.sp;
				(this.sign !== 0x00) ? this.cycles += 0x0b : this.cycles += 0x05;
			break;
			case 0xf9:
				var hl = (this.h << 0x08) | this.l;
				this.sp = hl;
				this.pc += 0x01;
				this.cycles += 0x05;
			break;
			case 0xfa:
				var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
				(this.sign !== 0x00) ? this.pc = address : this.pc = this.pc += 0x03;
				this.cycles += 0x0a;
			break;
			case 0xfb:
				this.interrupt.enabled = 0x01;
				this.pc += 0x01;
				this.cycles += 0x04;
			break;
			case 0xfc:
				var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
				(this.sign !== 0x00) ? this.memory[this.sp - 0x01] = ((this.pc + 0x03) >> 0x08) & 0xff : this.sp = this.sp;
				(this.sign !== 0x00) ? this.memory[this.sp - 0x02] = (this.pc + 0x03) & 0xff : this.sp = this.sp;
				(this.sign !== 0x00) ? this.sp -= 0x02 : this.sp = this.sp;
				(this.sign !== 0x00) ? this.pc = address : this.pc = this.pc + 0x03;
				(this.sign !== 0x00) ? this.cycles += 0x11 : this.cycles += 0x0b;
			break;
			case 0xfd:
				this.nop();
			break;
			case 0xfe:
				var carry = 0x00;
				var tmp = this.a - this.memory[this.pc + 0x01];
				(tmp < 0x00) ? carry = 0x01 : carry = 0x00;
				tmp &= 0xff;
				this.setflagsZSP(tmp);
				this.setflagC(carry);
				this.pc += 0x02;
				this.cycles += 0x07;
			break;
			case 0xff:
				this.rst(0x38);
			break;
		}
	},

    executeInterrupt: function () {
        if (this.interrupt.enabled) {
            this.interrupt.enabled = 0x00;
            this.rst(this.interrupt.type);
            (this.interrupt.type === 0x08) ? this.interrupt.type = 0x10 : this.interrupt.type = 0x08;
        }
    },

	nop: function () {
		this.pc += 0x01;
		this.cycles += 0x04;
	},

	lxi: function () {
		var register = {high: this.memory[this.pc + 0x02], low: this.memory[this.pc + 0x01]};
		this.pc += 0x03;
		this.cycles += 0x0a;
		return register;
	},

    stax: function (registerHigh, registerLow) {
        var register16b = (registerHigh << 0x08) | registerLow;
        this.memory[register16b] = this.a;
        this.pc += 0x01;
        this.cycles += 0x07;
    },

    inx: function (registerHigh, registerLow) {
        var register = {high: 0x00, low: 0x00};
        var register16b = (registerHigh << 0x08) | registerLow;
        register16b = (register16b + 0x01) & 0xffff;
        register.high = (register16b >> 0x08) & 0xff;
        register.low = register16b & 0xff;
        this.pc += 0x01;
        this.cycles += 0x05;
        return register;
    },

    inr: function (register) {
    	var halfcarry = 0x00;
    	(register === 0x0f) ? halfcarry = 0x01 : halcarry = 0x00;
        register = (register + 0x01) & 0xff;
        this.setflagsZSP(register);
        this.setflagH(halfcarry);
        this.pc += 0x01;
        this.cycles += 0x05;
        return register;
    },

	dcr: function (register) {
		var halfcarry = 0x00;
		(register === 0x10) ? halfcarry = 0x01 : halcarry = 0x00;
		register = (register - 0x01) & 0xff;
		this.setflagsZSP(register);
		this.setflagH(halfcarry);
		this.pc += 0x01;
		this.cycles += 0x05;
		return register;
	},

	mvi: function () {
		var register = this.memory[this.pc + 0x01];
		this.pc += 0x02;
		this.cycles += 0x07;
		return register;
	},

    rlc: function () {
        var bit7 = 0x00;
        ((this.a & 0x80) !== 0x00) ? bit7 = 0x01 : bit7 = 0x00;
        this.a <<= 0x01;
        this.a &= 0xff;
        (bit7 === 0x01) ? this.a |= 0x01 : this.a &= 0xfe;
        this.setflagC(bit7);
        this.pc += 0x01;
        this.cycles += 0x04;
    },

    daa: function () {
        var carry = 0x00;
        var halfcarry = 0x00;
        var a0 = this.a & 0x0f;
        if (a0 > 0x09 || this.halfcarry) {
            this.a += 0x06;
            halfcarry = 0x01;
        }
        var a1 = (this.a >> 0x04) & 0x0f;
        if (a1 > 0x09 || this.carry) {
            this.a += 0x60;
        }
        (this.a > 0xff) ? carry = 0x01 : carry = 0x00;
        this.a &= 0xff;
        this.setflagsZSP(this.a);
        this.setflagC(carry);
        this.setflagH(halfcarry);
        this.pc += 0x01;
        this.cycles += 0x04;
    },

	dad: function (registerHigh, registerLow) {
		var hl = (this.h << 0x08) | this.l;
		var register16b = (registerHigh << 0x08) | registerLow;
		var carry = 0x00;
		hl += register16b;
		(hl > 0xffff) ? carry = 0x01 : carry = 0x00;
		hl &= 0xffff;
		this.h = (hl >> 0x08) & 0xff;
		this.l = hl & 0xff;
		this.setflagC(carry);
		this.pc += 0x01;
		this.cycles += 0x0a;
	},

    ldax: function (registerHigh, registerLow) {
        var register16b = (registerHigh << 0x08) | registerLow;
        this.a = this.memory[register16b];
        this.pc += 0x01;
        this.cycles += 0x07;
    },

    dcx: function (registerHigh, registerLow) {
        var register = {high: 0x00, low: 0x00};
        var register16b = (registerHigh << 0x08) | registerLow;
        register16b = (register16b - 0x01) & 0xffff;
        register.high = (register16b >> 0x08) & 0xff;
        register.low = register16b & 0xff;
        this.pc += 0x01;
        this.cycles += 0x05;
    },

	rrc: function () {
		var bit0 = 0x00;
		((this.a & 0x01) !== 0) ? bit0 = 0x01 : bit0 = 0x00;
		this.a >>= 0x01;
		(bit0 === 0x01) ? this.a |= 0x80 : this.a &= 0x7f;
		this.setflagC(bit0);
		this.pc += 0x01;
		this.cycles += 0x04;
	},

	ldax: function (registerHigh, registerLow) {
		var register16b = (registerHigh << 0x08) | registerLow;
		this.a = this.memory[register16b];
		this.pc += 0x01;
		this.cycles += 0x07;
	},

	dcx: function (registerHigh, registerLow) {
		var register = {high: 0x00, low: 0x00};
		var register16b = (registerHigh << 0x08) | registerLow;
		register16b = (register16b - 0x01) & 0xffff;
		registerHigh = (register16b >> 0x08) & 0xff;
		registerLow = register16b & 0xff;
		register.high = registerHigh;
		register.low = registerLow;
		this.pc += 0x01;
		this.cycles += 0x05;
		return register;
	},

	sta: function () {
		var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
		this.memory[address] = this.a;
		this.pc += 0x03;
		this.cycles += 0x0d;
	},

	pop: function (registerHigh, registerLow) {
		var register = {high: this.memory[this.sp + 0x01], low: this.memory[this.sp]};
		this.sp += 0x02;
		this.pc += 0x01;
		this.cycles += 0x0a;
		return register;
	},

	push: function (registerHigh, registerLow) {
		this.memory[this.sp - 0x01] = registerHigh;
		this.memory[this.sp - 0x02] = registerLow;
		this.sp -= 0x02;
		this.pc += 0x01;
		this.cycles += 0x0b;
	},

    ral: function () {
        var bit7 = 0x00;
        ((this.a & 0x80) !== 0x00) ? bit7 = 0x01 : bit7 = 0x00;
        this.a <<= 0x01;
        this.a &= 0xff;
        (this.carry === 0x00) ? this.a &= 0xfe : this.a |= 0x01;
        this.setflagC(bit7);
        this.pc += 0x01;
        this.cycles += 0x04;
    },

    rar: function () {
        var bit0 = 0x00;
        ((this.a & 0x01) !== 0x00) ? bit0 = 0x01 : bit0 = 0x00;
        this.a >>= 0x01;
        (this.carry === 0x00) ? this.a &= 0x7f : this.a |= 0x80;
        this.setflagC(bit0);
        this.pc += 0x01;
        this.cycles += 0x04;
    },

    cma: function () {
        this.a ^= 0xff;
        this.pc += 0x01;
        this.cycles += 0x04;
    },

    stc: function () {
        this.setflagC(0x01);
        this.pc += 0x01;
        this.cycles += 0x04;
    },

    cmc: function () {
        var carry = 0x00;
        (this.carry === 0x00) ? carry = 0x01 : carry = 0x00;
        this.setflagC(carry);
        this.pc += 0x01;
        this.cycles += 0x04;
    },

    mov: function (register) {
        this.pc += 0x01;
        this.cycles += 0x05;
        return register;
    },

    shld: function () {
		var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
		this.memory[address + 0x01] = this.h;
		this.memory[address] = this.l;
		this.pc += 0x03;
		this.cycles += 0x10;
    },

    lhld: function () {
    	var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
		this.h = this.memory[address + 0x01];
		this.l = this.memory[address];
		this.pc += 0x03;
		this.cycles += 0x10;
    },

    add: function (register) {
        var carry = 0x00;
        this.a = this.a + register;
        (this.a > 0xff) ? carry = 0x01 : carry = 0x00;
        this.a &= 0xff;
        this.setflagsZSP(this.a);
        this.setflagC(carry);
        this.pc += 0x01;
        this.cycles += 0x04;
        return this.a;
    },

    adc: function (register) {
        var carry = 0x00;
        this.a = this.a + (register + this.carry);
        (this.a > 0xff) ? carry = 0x01 : carry = 0x00;
        this.a &= 0xff;
        this.setflagsZSP(this.a);
        this.setflagC(carry);
        this.pc += 0x01;
        this.cycles += 0x04;
        return this.a;
    },

    sub: function (register) {
        var carry = 0x00;
        this.a = this.a - register;
        (this.a < 0x00) ? carry = 0x01 : carry = 0x00;
        this.a &= 0xff;
        this.setflagsZSP(this.a);
        this.setflagC(carry);
        this.pc += 0x01;
        this.cycles += 0x04;
        return this.a;
    },

    sbb: function (register) {
        var carry = 0x00;
        this.a = this.a - (register - this.carry);
        (this.a < 0x00) ? carry = 0x01 : carry = 0x00;
        this.a &= 0xff;
        this.setflagsZSP(this.a);
        this.setflagC(carry);
        this.pc += 0x01;
        this.cycles += 0x04;
        return this.a;
    },

    ana: function (register) {
        var carry = 0x00;
        this.a = this.a & register;
        this.setflagsZSP(this.a);
        this.setflagC(carry);
        this.pc += 0x01;
        this.cycles += 0x04;
        return this.a;
    },

    xra: function (register) {
        var carry = 0x00;
        this.a = this.a ^ register;
        this.setflagsZSP(this.a);
        this.setflagC(carry);
        this.pc += 0x01;
        this.cycles += 0x04;
        return this.a;
    },

    ora: function (register) {
        var carry = 0x00;
        this.a = this.a | register;
        this.setflagsZSP(this.a);
        this.setflagC(carry);
        this.pc += 0x01;
        this.cycles += 0x04;
        return this.a;
    },

    cmp: function (register) {
        var carry = 0x00;
        var tmp = this.a - register;
        (tmp < 0x00) ? carry = 0x01 : carry = 0x00;
        tmp &= 0xff;
        this.setflagsZSP(tmp);
        this.setflagC(carry);
         this.pc += 0x01;
        this.cycles += 0x04;
    },

    adi: function () {
    	var carry = 0x00;
		this.a += this.memory[this.pc + 0x01];
		(this.a > 0xff) ? carry = 0x01 : carry = 0x00;
		this.a &= 0xff;
		this.setflagsZSP(this.a);
		this.setflagC(carry);
		this.pc += 0x02;
		this.cycles += 0x07;
	},

	aci: function () {
		var carry = 0x00;
		this.a += (this.memory[this.pc + 0x01] + this.carry);
		(this.a > 0xff) ? carry = 0x01 : carry = 0x00;
		this.a &= 0xff;
		this.setflagsZSP(this.a);
		this.setflagC(carry);
		this.pc += 0x02;
		this.cycles += 0x07;
	},

	out: function () {
		var port = this.memory[this.pc + 0x01];
		switch (port) {
			case 0x02:
				this.outPort[port] = this.a & 0x07;
			break;
			case 0x04:
				var v = this.outPort[port];
				this.outPort[port] = ((this.a << 0x08) | (v >> 0x08)) & 0xffff;
			break;
			default:
				this.outPort[port] = this.a;
			break;
		}
		this.pc += 0x02;
		this.cycles += 0x0a;
	},

	cz: function () {
		var address = (this.memory[this.pc + 0x02] << 0x08) + this.memory[this.pc + 0x01];
		(this.zero !== 0x00) ? this.memory[this.sp - 0x01] = ((this.pc + 0x03) >> 0x08) & 0xff : this.sp = this.sp;
		(this.zero !== 0x00) ? this.memory[this.sp - 0x02] = (this.pc + 0x03) & 0xff : this.sp = this.sp;
		(this.zero !== 0x00) ? this.sp -= 0x02 : this.sp = this.sp;
		(this.zero !== 0x00) ? this.pc = address : this.pc = this.pc + 0x03;
		(this.zero !== 0x00) ? this.cycles += 0x11 : this.cycles += 0x0b;
	},

	call: function () {
		var address = (this.memory[this.pc + 0x02] << 0x08) + this.memory[this.pc + 0x01];
		this.memory[this.sp - 0x01] = ((this.pc + 0x03) >> 0x08) & 0xff;
		this.memory[this.sp - 0x02] = (this.pc + 0x03) & 0xff;
		this.sp -= 0x02;
		this.pc = address;
		this.cycles += 0x11;
	},

    rnz: function () {
        if (!this.zero) {
            this.pc = (this.memory[this.sp + 0x01] << 0x08) | this.memory[this.sp];
            this.sp += 0x02;
            this.cycles += 0x0b;
        } else {
            this.pc += 0x01
            this.cycles += 0x05
        }
    },

    rnc: function () {
		(this.carry === 0x00) ? this.pc = (this.memory[this.sp + 0x01] << 0x08) | (this.memory[this.sp]) : this.pc += 0x01;
		(this.carry === 0x00) ? this.sp += 0x02 : this.sp = this.sp;
		(this.carry === 0x00) ? this.cycles += 0x0b : this.cycles += 0x05;
    },

    jnz: function () {
        if (!this.zero) {
            this.pc = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
            this.cycles += 0x0a;
        } else {
            this.pc += 0x03;
            this.cycles += 0x0a;
        }
    },

    jnc: function () {
		var address = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
		(this.carry === 0x00) ? this.pc = address : this.pc = this.pc += 0x03;
		this.cycles += 0x0a;
    },

    jmp: function () {
        this.pc = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
        this.cycles += 0x0a;
    },

    cnz: function () {
        if (!this.zero) {
            this.memory[this.sp - 0x01] = ((this.pc + 0x03) >> 0x08) & 0xff;
            this.memory[this.sp - 0x02] = (this.pc + 0x03) & 0xff;
            this.sp -= 0x02;
            this.pc = (this.memory[this.pc + 0x02] << 0x08) + this.memory[this.pc + 0x01];
            this.cycles += 0x11;
        } else {
            this.pc += 0x03;
            this.cycles += 0x0b;
        }
    },

    rst: function (address) {
        this.memory[this.sp - 0x01] = ((this.pc) >> 0x08) & 0xff;
        this.memory[this.sp - 0x02] = (this.pc) & 0xff;
        this.sp -= 0x02;
        this.pc = address;
        this.cycles = 0x0b;
    },

    rz: function () {
        if (this.zero) {
            this.pc = (this.memory[this.sp + 0x01] << 0x08) | this.memory[this.sp];
            this.sp += 0x02;
            this.cycles += 0x0b;
        } else {
            this.pc += 0x01;
            this.cycles += 0x05;
        }
    },

    ret: function () {
        this.pc = (this.memory[this.sp + 0x01] << 0x08) | this.memory[this.sp];
        this.sp += 0x02;
        this.cycles += 0x0a;
    },

    jz: function () {
        if (this.zero) {
            this.pc = (this.memory[this.pc + 0x02] << 0x08) | this.memory[this.pc + 0x01];
            this.cycles += 0x0a;
        } else {
            this.pc += 0x03;
            this.cycles += 0x0a;
        }
    },

    cnc: function () {
		var address = (this.memory[this.pc + 0x02] << 0x08) + this.memory[this.pc + 0x01];
		(this.carry === 0x00) ? this.memory[this.sp - 0x01] = ((this.pc + 0x03) >> 0x08) & 0xff : this.sp = this.sp;
		(this.carry === 0x00) ? this.memory[this.sp - 0x02] = (this.pc + 0x03) & 0xff : this.sp = this.sp;
		(this.carry === 0x00) ? this.sp -= 0x02 : this.sp = this.sp;
		(this.carry === 0x00) ? this.pc = address : this.pc = this.pc + 0x03;
		(this.carry === 0x00) ? this.cycles += 0x11 : this.cycles += 0x0b;
    },

    sui: function () {
		var carry = 0x00;
		this.a -= this.memory[this.pc + 0x01];
		(this.a < 0x00) ? carry = 0x01 : carry = 0x00;
		this.a &= 0xff;
		this.setflagsZSP(this.a);
		this.setflagC(carry);
		this.pc += 0x02;
		this.cycles += 0x07;
    },

    rc: function () {
		(this.carry !== 0x00) ? this.pc = (this.memory[this.sp + 0x01] << 0x08) | (this.memory[this.sp]) : this.pc += 0x01;
		(this.carry !== 0x00) ? this.sp += 0x02 : this.sp = this.sp;
		(this.carry !== 0x00) ? this.cycles += 0x0b : this.cycles += 0x05;
    },

	setflagZ: function (register) {
		(register === 0x00) ? this.zero = 0x01 : this.zero = 0x00;
	},

	setflagS: function (register) {
		((register & 0x80) !== 0x00) ? this.sign = 0x01 : this.sign = 0x00;
	},

	setflagP: function (register) {
		var b0 = ((register & 0x01) !== 0x00);
		var b1 = ((register & 0x02) !== 0x00);
		var b2 = ((register & 0x04) !== 0x00);
		var b3 = ((register & 0x08) !== 0x00);
		var b4 = ((register & 0x10) !== 0x00);
		var b5 = ((register & 0x20) !== 0x00);
		var b6 = ((register & 0x40) !== 0x00);
		var b7 = ((register & 0x80) !== 0x00);
		((b0 + b1 + b2 + b3 + b4 + b5 + b6 + b7) % 0x02 === 0x00) ? this.parity = 0x01 : this.parity = 0x00;
	},

	setflagH: function (halfcarry) {
		this.halfcarry = halfcarry;
	},

	setflagC: function (carry) {
		this.carry = carry;
	},

	setflagsZSP: function (register, hcregister) {
		this.setflagZ(register);
		this.setflagS(register);
		this.setflagP(register);
	}

};
