


























//********************************************************************************************** STDLIB - stdlib.js

/*

	Biblioteca padrao com funções genericas de uso global

*/


/* ---------------------- Classes basicas ------------------------ */

// objeto container de todas as funcoes genericas
N = stdlib = {
	getversion: function(){ return 'V_002_SDK_VERSION' },

// funçoes de tipos
	isstring: function(_mixed_var){return(typeof(_mixed_var)=='string'?1:0);},
	isnumber: function(_mixed_var){return(typeof(_mixed_var)=='number'?1:0);},
	isfunction: function(_mixed_var){return(typeof(_mixed_var)=='function'?1:0);},
	isobject: function(_mixed_var){return(typeof(_mixed_var)=='object'?1:0);},
	isbool: function(_mixed_var){return(typeof(_mixed_var)=='boolean'?1:0);},
	isfalse: function(_mixed_var){return(typeof(_mixed_var)=='boolean'&&!_mixed_var?1:0);},
	istrue: function(_mixed_var){return(typeof(_mixed_var)=='boolean'&&_mixed_var?1:0);},
	isundef: function (_mixed_var){return(typeof(_mixed_var)=='undefined'?1:0);},

	// retorna true se a variavel for inutil ou falsa
	// tipo boleano: se for false
	// tipo string: se for vazia
	// tipo numero: se for zero
	// tipo object: se for objeto vazio (sem propriedades)
	// tipo undefined
	// 
	// todos os demais casos retorna false, pois a variavel contem valor util
	// 
	nothing: function(_mixed_var){
		var _loc1 = (_mixed_var);
		var _loc2 = typeof(_mixed_var);
		var _loc_c = 0;
		switch(_loc2){
			case 'undefined': return(true); break;
			case 'number':
			case 'boolean':
				if(!_loc1) return(true);
				break;
			case 'string':
				if(_loc1=='') return(true);
				break;
			case 'object':
				if(_loc1==null) return(true);
				for(var _i in _loc1) _loc_c++;
				if(!_loc_c) return(true);
				break;
		}
		// variavel util
		return(false);
	},
	
	empty: function(_mixed_var){
		var _loc1=_mixed_var;
		var _loc2 = typeof(_mixed_var);
		if(_loc2=='undefined')return(true);
		if(_loc1==null)return(true);
		return(false);
	},
	
	// garantir desassociacao entre variaveis
	unlink: function(_mixed_var){
		var _loc1 = typeof(_mixed_var);
		var _loc2 = undefined;
		switch(_loc1){
			case 'number':
				_loc2 = (_mixed_var + 0);
				break;
			case 'string':
				_loc2 = (""+_mixed_var);
				break;
			case 'object':
				_loc2 = stdlib.objcopy(_mixed_var);
				break;
			case 'boolean':
				_loc2 = (_mixed_var?true:false);
				break;
			case 'function':
				_loc2 = (_mixed_var);
				break;
			default:
				break;
		}
		return(_loc2);
	},
	
	objjoin: function(_object, _proto_object){
		var _ret = {};
		var _loc1;
		// programador nao passou objeto original (ou ele acha que passou!), retornar objeto padrao
		if('object'!=typeof(_object)) return(_proto_object);
		
		// copiar objeto original
		_ret = stdlib.unlink(_object);
		
		// programador nao enviou obj std
		if('object'!=typeof(_proto_object)) return(_ret);
		
		// programador enviou tudo ok, instalar propriedades std
		for(_loc1 in _proto_object){
			var _tof_std = typeof(_proto_object[_loc1]);
			var _tof_orig = typeof(_ret[_loc1]);
			// verificar se essa chave esta no objeto original
			if('undefined'==_tof_orig){
				_ret[_loc1] = stdlib.unlink(_proto_object[_loc1]);
				continue;
			}

			// chave presente no objeto original, comparar tipos
			if('function'!=_tof_orig && _tof_std != _tof_orig){
				// tempo problemas de tipo, converter valor original para tipo std
				switch(_tof_std){
					case 'number':
						_ret[_loc1] = stdlib.tofloat(_ret[_loc1]);
						break;
					case 'string':
						_ret[_loc1] = stdlib.tostring(_ret[_loc1]);
						break;
					case 'boolean':
						_ret[_loc1] = stdlib.tobool(_ret[_loc1]);
						break;
					case 'object':
						// erro, objeto vario, nao tem como converter um tipo simples em objeto
						_ret[_loc1] = {};
						break;
					case 'function':
						_ret[_loc1] = _ret[_loc1].toString();
						break;
				} // switch
			} // if
		} // for
		return(_ret);
	}, // function

	// garantir variavel com certo tipo e variavel default
	// caso var nao seja do mesmo tipo de default, usar-se-a default
	var_default: function(_input, _std_value){
		var _loc1 = typeof(_input);
		var _loc2 = typeof(_std_value);
		if(_loc2!='undefined')if(_loc2!=_loc1) _input = _std_value;
		return(_input);
	},

	// contar numero de elementos em um objeto
	objcount: function(_input_object){
		if('object'!=typeof(_input_object)) return 0;
		var _count=0;
		var _loc1;
		for(_loc1 in _input_object) _count++;
		return(_count);
	},

	// contar numero de elementos em um objeto cujos filhos sao objetos
	objcountobj: function(_input_object){
		if('object'!=typeof(_input_object)) return 0;
		var _count=0;
		var _loc1;
		for(var _loc1 in _input_object) if('object'==typeof(_input_object[_loc1])) _count++;
		return(_count);
	},


	// transferencia de objeto sem link
	objcopy: function(_input_object){
		var _loc1 = {};
		var _loc2;
		if(typeof(_input_object)=='object')
			for(_loc2 in _input_object)
				_loc1[_loc2] = ( 'object'==typeof(_input_object[_loc2]) ? stdlib.objcopy(_input_object[_loc2]) : _input_object[_loc2]);
		return(_loc1);
	},

// funcoes de string
	tostring: function(_mixed_var){
		var _loc1 = typeof(_mixed_var);
		switch(_loc1){
			case 'undefined': return('');
			case 'number': return( isNaN(_mixed_var) ? '' :_mixed_var.toString(10) );
			case 'string': return(_mixed_var);
			case 'boolean': return( _mixed_var ? 'true' : 'false');
			case 'object': return(stdlib.debugobj(_mixed_var));
			case 'function': return(_mixed_var.toString());
		}
		return '';
	},

	// verificar se a str esta contida
	instr: function(_string,_substring,do_cmp,start){
		_string = stdlib.tostring(_string);
		_substring = stdlib.tostring(_substring);
		if(start) _string = _string.substring(start,_string.length);
		switch(typeof(do_cmp)){
			case 'undefined': case 'boolean':
				_string = _string.toLowerCase();
				_substring = _substring.toLowerCase();
				break;
		}
		if(_string.indexOf(_substring) > -1) return(_string.indexOf(_substring));
		return 0;
	},

	rtrim: function(_string,_tbyte){
		if('undefined'==typeof(_tbyte)) _tbyte = " ";
		while(_string.charAt((_string.length -1))==_tbyte)_string=_string.substr(0,_string.length-1);
		return(_string);
	},
	ltrim: function(_string,_tbyte){
		if('undefined'==typeof(_tbyte)) _tbyte = " ";
		while(_string.charAt(0)==_tbyte)_string=_string.replace(_string.charAt(0),"");
		return(_string);
	},

	trim: function(_string,_tbyte){
		if('undefined'==typeof(_tbyte)) _tbyte = " ";
		if(typeof(_string)!='string') _string = stdlib.tostring(_string);
		// rtrim
		while(_string.charAt((_string.length -1))==_tbyte) _string=_string.substr(0,_string.length-1);
		// ltrim
		while(_string.charAt(0)==_tbyte) _string=_string.replace(_string.charAt(0),"");
		return(_string);
	},

	substr: function(str, start, len) {
		var i = 0;
		var allBMP = true;
		var es = 0;
		var el = 0;
		var se = 0;
		var ret = '';
		str += '';
		var end = str.length;
	
		if (start < 0)start += end;
		end = ('undefined' == typeof(len) ? end : (len < 0 ? len + end : len + start));
		// PHP returns false if start does not fall within the string.
		// PHP returns false if the calculated end comes before the calculated start.
		// PHP returns an empty string if start and end are the same.
		// Otherwise, PHP returns the portion of the string from start to end.
		return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end);
	},

	strpos: function(_string,_substring,_offset){
		var _loc1=(_string+'').indexOf(_substring,(_offset||0));
		return _loc1===-1?false:_loc1;
	},

	strtoupper: function(_string){
		if(typeof(_string)!='string') _string=stdlib.tostring(_string);
		return _string.toUpperCase();
	},

	strtolower: function(_string){
		if(typeof(_string)!='string') _string=stdlib.tostring(_string);
		return _string.toLowerCase();
	},

	strlen: function(_string){
		if('string'!=typeof(_string)) _string = stdlib.tostring(_string);
		return _string.length;
		/*
		if('number'==typeof(_string)) _string=""+_string;
		if('boolean'==typeof(_string)) _string=(_string?"true":"false");
		if('string'==typeof(_string)) return _string.length; return 0;
		*/
	},

	// retorna byte pelo codigo
	chr: function(_byte_number){
		if (_byte_number>0xFFFF){
			_byte_number-=0x10000;
			return String.fromCharCode(0xD800+(_byte_number>>10),0xDC00+(_byte_number&0x3FF));
		}
		return String.fromCharCode(_byte_number);
	},

	str_replace: function(_find_string,_new_string,_original_string){
		if('string'!=typeof(_new_string)) _new_string = stdlib.tostring(_new_string);
		if('string'!=typeof(_original_string)) _original_string = stdlib.tostring(_original_string);
		if('string'!=typeof(_find_string)) _find_string = stdlib.tostring(_find_string);

		while(_original_string.indexOf(_find_string)>-1){
			_original_string=_original_string.replace(_find_string,_new_string);
		}
		return(_original_string);
	},

 	ord: function(_input_chr){
		var _loc1=_input_chr+'';
		var _ret=_loc1.charCodeAt(0);
		if(0xD800<=_ret&&_ret<=0xDBFF){
			var _loc2 = _ret;
			if(_loc1.length === 1){
				return _ret;
			}
			var low = _loc1.charCodeAt(1);
			if(!low){}
			return((_loc2-0xD800)*0x400)+(low-0xDC00)+0x10000;
		}
		if(0xDC00<=_ret&&_ret<=0xDFFF)return _ret;
		return _ret;
	},
	


// expressoes regulares
	eregi: function(_ereg, _context_string){
		if(typeof(_context_string)=='string'){
			_ereg = stdlib.strtolower(_ereg);
			_context_string = stdlib.strtolower(_context_string);
			var _loc1 = new RegExp(_ereg);
			if(_context_string.match(_loc1)) return(1);
		}
		return(0);
	},

	ereg: function(_ereg,_context_string){
		if(typeof(_context_string)=='string'){
			var _loc1=new RegExp(_ereg);
			if(_context_string.match(_loc1))return(1);
		}
		return(0);
	},



// funcoes de array
	keyexist: function(_list, _key_to_find){
		if(typeof(_list)=='object') for(var _fk in _list) if(_fk==_key_to_find) return(true);
		return(false);
	},

	isarray: function(a){
		a=a.constructor.toString();
		if(stdlib.instr(a,"Array")>0){
			return true;
		}else{
			return false;
		}
	},

	explode: function(_separator,_object_list,_limit){
		var _loc1={0:''};
		if(arguments.length<2||typeof(arguments[0])=='undefined'||typeof(arguments[1])=='undefined')return(null);
		if(_separator===''||_separator===false||_separator === null) return false;
		if(typeof(_separator)=='function'||typeof(_separator)=='object'||typeof(_object_list)=='function'||typeof(_object_list)=='object') return(_loc1);
		if(_separator===true) _separator='1';
		if(!_limit){
			return(_object_list.toString().split(_separator.toString()));
		}else{
			var _loc2=_object_list.toString().split(_separator.toString());
			var _loc3=_loc2.splice(0,_limit-1);
			var _loc4=_loc2.join(_separator.toString());
			_loc3.push(_loc4);
			return(_loc3);
		}
	},

	implode: function(_divisor,_list_to_implode){
		var _loc1='';
		var _ret='';
		var _glue='';
		if(arguments.length===1){
			_list_to_implode=_divisor;
			_divisor='';
		}
		if(typeof(_list_to_implode)==='object'){
			if(_list_to_implode instanceof Array){
				return _list_to_implode.join(_divisor);
			}else{
				for(_loc1 in _list_to_implode){
					_ret+=_glue+_list_to_implode[_loc1];
					_glue=_divisor;
				}
				return(_ret);
			}
		}else{
			return(_list_to_implode);
		}
	},

	in_array: function(_find_key, _list, _use_strict) {
		var _loc1 = '';
		var _strict = !!_use_strict;
		if(_strict){
			for(_loc1 in _list)if(_list[_loc1]===_find_key)return true;
		}else{
			for(_loc1 in _list)if(_list[_loc1]==_find_key)return true;
		}
		return false;
	},
	// retorna apenas valores do array em um novo array com chaves sequenciais
	array_values: function(_input_list){
		var _loc1 = {};
		var _loc2;
		var _count = 0;
		if(typeof(_input_list)=='object') for(_loc2 in _input_list) _loc1[_count++]=_input_list[_loc2];
		return(_loc1);
	},
	// retorna apenas chaves do array em um novo array com chaves sequenciais
	array_keys: function(_input_list){
		var _loc1 = {};
		var _loc2;
		var _count = 0;
		if(typeof(_input_list)=='object') for(_loc2 in _input_list) _loc1[_count++]=_loc2;
		return(_loc1);
	},
	// retorna valores do array em string
	array_implode: function(_input_list, _separator){
		var _loc1 = '';
		var _loc2;
		if(typeof(_separator)!='string') _separator=',';
		var _count = 0;
		if(typeof(_input_list)=='object') for(_loc2 in _input_list) _loc1+=(_count++?_separator:'')+_input_list[_loc2];
		return _loc1;
	},


// ordenacao de listas ----------------------------------------------------------------------------

	array_sort_keys: function(_input_list, _order){
		var _count = 0;				// contador de elementos
		var _loc1;					// indice principal
		var _loc2;					// indice secundario
		var _ret = {};	// lista com indices da lista principal em ordem sequencial
		for(var _t in _input_list){
			_ret[_count++]=_t;
		}
		// forma de ordenacao
		_order = (typeof(_order)=='undefined'||_order?true:false);

		// loop principal, do primeiro ao penultimo
		for(_loc1 = 0; _loc1 < _count-1; _loc1++){
			var _min_vlu = _input_list[_ret[_loc1]];	// valor do inicio da lista a comparar com os demais
			var _found_prefered = -1;					// flag para determinar encontro de valor preferencial
			// loop interno, do proximo ao ultimo
			for(_loc2 = _loc1+1; _loc2 < _count; _loc2++){
				// obter valor respectivo
				/*
				_order
				
				true 		_min_vlu > _list[_ret[_loc2]]
				false		_min_vlu < _list[_ret[_loc2]]

				(_order && _min_vlu > _list[_ret[_loc2]]) || (!_order && _min_vlu < _list[_ret[_loc2]])
				
				*/
				if((_order && _min_vlu > _input_list[_ret[_loc2]]) || (!_order && _min_vlu < _input_list[_ret[_loc2]])){
					_found_prefered = _loc2;
					_min_vlu = _input_list[_ret[_loc2]];
				}
			}
			// trocar chaves do indice com outro elemento posterior
			if(_found_prefered >= 0){
				var _swap = _ret[_found_prefered];
				_ret[_found_prefered] = _ret[_loc1];
				_ret[_loc1] = _swap;
				//stdlib.logit("Tipo armazenado: "+typeof(_ret[_found_prefered])+"/"+typeof(_ret[_loc1]));
			}
		}
		// gerar lista ordenada
		//var _ordened = {}; for(var _n in _ret) _ordened[_n] = _list[_ret[_n]]; stdlib.logit(stdlib.debugobj(_ordened, ' / '));
		
		return(_ret);
	},
	


// funcoes de inteiros e numeros
	is_numeric: function(_mixed_var){
		_mixed_var = stdlib.trim(_mixed_var);
		var _ret = stdlib.eregi('^[0-9]+$', _mixed_var);
		return(_ret);
	},
	is_float: function(_mixed_var){
		_mixed_var = stdlib.trim(_mixed_var);
		var _ret = stdlib.eregi('^[0-9]+\.[0-9]+$', _mixed_var);
		return(_ret);
	},





	/*
	converter para inteiro
		toint(200) = 200
		toint("122a") = 122
		toint(122.4) = 122
		toint(false) = 0
		toint(true) = 1
		toint({}) = 1
		toint(function(){}) = 1
		toint("oi") = 0
		var ax; stdlib.toint(ax) = 0
	*/
	toint: function(_mixed_var){
		var _n = 0;
		switch(typeof(_mixed_var)){
			case 'number':
			case 'string':
				_n = parseInt(_mixed_var, 10);
				break;
			case 'boolean':
				_n = (_mixed_var?1:0);
				break;
			case 'object':
			case 'function':
				_n = 1;
				break;
		}
		if(isNaN(_n)) _n = 0;
		return(_n);
	},
	/*
	receber um valor e garantir seu formato sanatizado para float
		tofloat(200)
		tofloat("122a")
		tofloat(122.4)
		tofloat(false)
		tofloat(true)
		tofloat({})
		tofloat(function(){})
		tofloat("oi")
		var ax; stdlib.tofloat(ax)

	*/
	tofloat: function(_mixed_var){
		var _ret = 0.0;
		switch(typeof(_mixed_var)){
			case 'number':
			case 'string':
				_ret = parseFloat(_mixed_var);
				break;
			case 'boolean':
				_ret = (_mixed_var?1.0:0.0);
				break;
			case 'object':
			case 'function':
				_ret = 1.0;
				break;
		}
		if(isNaN(_ret)) _ret = 0.0;
		return(_ret);
	},

	/*
	garantir conversao para boleano
		1 = true
		"1" = true
		"false" = false
		"true" = true
		"oi" = true
		"" = false
		{} = true
		function(){} = true
		0 = false
		1 = true
		200 = true
	*/
	tobool: function(_mixed_var){
		var _ret = false;
		switch(typeof(_mixed_var)){
			case 'number':
				_ret = (!isNaN(_mixed_var) && _mixed_var?true:false);
				break;
			case 'string':
				_ret = (_mixed_var == '' || _mixed_var == 'false' ? false : true);
				break;
			case 'boolean':
				_ret = (_mixed_var);
				break;
			case 'object':
			case 'function':
				_ret = true;
				break;
		}
		return(_ret);
	},

	/*
	randomizar numero numa faixa definida
	*/
	rrandom: function(min_value,max_value,float_value){
		var _n_random=min_value+(Math.random()*(max_value-min_value));
		return (typeof float_value=='undefined' ? Math.round(_n_random) : _n_random.toFixed(float_value));
	},
	
	
	// calcular modulos
	mod: function(dividendo,divisor) {
		return Math.round(dividendo - (Math.floor(dividendo/divisor)*divisor));
	},
	// converter decimal para hexadecimal
	dec2hex: function(_dec){
		_dec = stdlib.toint(_dec);
		return(_dec.toString(16));
	},
	// converter hexadecimal para decimal
	hex2dec: function(_hex){
		return(stdlib.toint(parseInt(_hex, 16)));
	},
	
	// formatar numero de bytes em html colorindo grandezas
	int_sep_color: function(_bytes){
		var _colors = {0:'#0a0', 1:'#00a', 2:'#a0a', 3:'#f00', 4:'#000', 5:'#a09', 6:'#cf3', 7: '#ccc'};
		var _x = _bytes.toString();
		var _len = _x.length;
		var _items = {};
		var _k = 0;
		var _j = 0;
		var _p = '';
		for(var _i = _len; _i > 0; _i--){
			var _n = _x.substr(_i-1, 1);
			_j++;
			if(_j==3){
				// acumulou 3 casas
				_items[_k++] = _n + _p;
				_j=0;
				_p = '';
			}else{
				_p = _n + _p;
			}
		}
		if(_p!='') _items[_k++] = _p;
		if(!_k) _items[_k++] = _x;
		// converter para html
		var _html = ''; _j = 0;
		for(var _i = _k; _i > 0; _i--){
			_html += '<span style="color: '+_colors[_j++]+'">'+_items[_i-1]+'</span>'+(_i>1?'.':'');
			if(_j==8) _j = 0;
		}
		return _html;
	},
	int_sep: function(_bytes){
		return stdlib.number_format(_bytes, 0, '.', '.')
	},
	to_fixed: function(_num, _decsize){
		var _n = parseFloat(_num).toFixed(_decsize);
		return _n;
	},
	number_format: function (number, decimals, dec_point, thousands_sep) {
		number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+number) ? 0 : +number,
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			s = '',
			toFixedFix = function (n, prec) {
				var k = Math.pow(10, prec);
				return '' + Math.round(n * k) / k;
			};
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
	},

	number_abrev: function(_input_number, _milhar_div, _decimal_div, _dec_numbers){
		if('undefined'==typeof(_milhar_div)) _milhar_div = ',';
		if('undefined'==typeof(_decimal_div)) _decimal_div = '.';
		if('undefined'==typeof(_dec_numbers)) _dec_numbers = 2;
	
		// lista de abreviacao de grandezeas
		var _slist = {
			0: '',
			1: 'K',	// kilo
			2: 'M', // mega
			3: 'G', // giga
			4: 'T', // tera
			5: 'P', // peta
			6: 'E', // exa
			7: 'Z', // zetta
			8: 'Y', // yotta
		};
	
		// descobrir grandeza do numero
		var _elev = 0;
		var _n = _input_number;
		while(_n > 1000){ _elev++; _n /= 1000; }
		var _sufix = ('undefined'!==typeof(_slist[_elev]) ? _slist[_elev] : '');
		var _r = stdlib.number_format(_n, _dec_numbers, _milhar_div, _decimal_div) + _sufix;
		return(_r);
	},

	size_format: function(_input_size, _milhar_div, _decimal_div){
		if('undefined'==typeof(_milhar_div)) _milhar_div = ',';
		if('undefined'==typeof(_decimal_div)) _decimal_div = '.';
	
		var _loc1 = _input_size;
		if(typeof(_input_size)!='number') _loc1 = stdlib.toint(_input_size);
		var _loc2 = false;
		var _sufix = '';
		// bytes
		if(_loc1<1024){	// menor que 1k ? byte
			// bytes
			_loc2 = _loc1;

		}else if(_loc1 < 1024 * 1024){ // menor que 1 mega? kbyte
			// kbytes
			_loc2 = _loc1 / 1024;
			_sufix = 'K';

		}else if(_loc1 < 1024 * 1024 * 1024){ // menor que 1 giga? mega
			// megabytes
			_loc2 = _loc1 / (1024 * 1024);
			_sufix = 'M';

		}else if(_loc1 < 1024 * 1024 * 1024 * 1024){ // menor que 1 tera? giga
			// gigabytes
			_loc2 = _loc1 / (1024 * 1024 * 1024);
			_sufix = 'G';

		}else if(_loc1 < 1024 * 1024 * 1024 * 1024 * 1024){ // menor que 1 peta? tera
			// terabytes
			_loc2 = _loc1 / (1024 * 1024 * 1024 * 1024);
			_sufix = 'T';

		}else if(_loc1 < 1024 * 1024 * 1024 * 1024 * 1024 * 1024){ // menor que 1 exabyte? peta
			// petabytes
			_loc2 = _loc1 / (1024 * 1024 * 1024 * 1024 * 1024);
			_sufix = 'P';

		}else if(_loc1 < 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024){ // menor que 1 zettabyte? exabyte
			// petabytes
			_loc2 = _loc1 / (1024 * 1024 * 1024 * 1024 * 1024 * 1024);
			_sufix = 'E';

		}else if(_loc1 < 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024){ // menor que 1 yottabyte? zettabyte
			// zettabyte
			_loc2 = _loc1 / (1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024);
			_sufix = 'Z';

		}else{
			// yottabyte
			_loc2 = _loc1 / (1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024);
			_sufix = 'Y';
		
		}
		var _f = stdlib.tostring(stdlib.tofloat(_loc2));
		var _d = stdlib.tostring(stdlib.toint(_loc2));
		if(_f==_d){
			_loc2 = _d;
			return(stdlib.trim(_loc2+' '+_sufix));
		}
		_loc2 = stdlib.number_format(_loc2, 3, _milhar_div, _decimal_div);
		return(stdlib.trim(_loc2+' '+_sufix));
	},

// funcoes boleanas
	xor: function(a,b){
		if(a&&!b)return(true);
		if(!a&&b)return(true);
		return(false);
	},

// teste de comparacao segura mesmo com formatos diferentes
	test: function(a,b){return typeof(a)==typeof(b) ? a==b : stdlib.tostring(a)==stdlib.tostring(b);},
	

// funcoes de data/hora
	time: function(){
		return(Math.round(new Date().getTime()/1000));
	},
	utime: function(){
		return(new Date().getTime());
	},

	// preparar valor em segundos (float ou int) em milisegundos para funcoes setTimeout e setInterval
	sec2ms: function(_input_time){
		var _mt = stdlib.tofloat(_input_time);
		return(_mt>0 ? (_mt * 1000) : 0 );
	},

// calculo rapido de porcentagem
	// parametros: numero, porcentagem e flag para float
	perc: function(_number, _percent, _to_float){
		var _ret = 0;
		_to_float = (_to_float ? true : false);
		if('number' != typeof(_number)) _number = (_to_float?stdlib.tofloat(_number):stdlib.toint(_number));
		if('number' != typeof(_percent)) _percent = (_to_float?stdlib.tofloat(_percent):stdlib.toint(_number));
		// calcular porcentagem
		if(_number && _percent){
			_ret = ((_number / 100) * _percent);
			if(!_to_float) _ret = stdlib.toint(_ret);
		}
		return(_ret);
	},

// auxiliares HTTP
	// conterter objeto em var=value&var2=value2 (querystring)
	obj2qs: function(_input_object, _eq, _dv){
		var _eq_char = '=';
		var _dv_char = '&';
		if('string'==typeof(_eq)) _eq_char = (_eq);
		if('string'==typeof(_dv)) _dv_char = (_dv);
		if('object'!=typeof(_input_object)) return '';
		var _ret = '';
		var _count = 0;
		for(var _kx in _input_object)
			_ret+=(_count++?_dv_char:'')+escape(_kx)+_eq_char+escape(_input_object[_kx]);
		//-
		return(_ret);
	},
	obj2uri: function(_input_object){
		if('object'!=typeof(_input_object)) return '';
		var _ret = '';
		var _count = 0;
		for(var _kx in _input_object)
			_ret+=(_count++?'&':'')+encodeURIComponent(_kx)+'='+encodeURIComponent(_input_object[_kx]);
		//-
		return(_ret);
	},

// funcoes ajax/xhr
	newAjax: function(){
		var _ret=false;
		var _loc1;
		var _loc2 = {
			0: function(){ return new XMLHttpRequest(); },
			1: function(){ return new ActiveXObject("Msxml2.XMLHTTP"); },
			2: function(){ return new ActiveXObject("Msxml3.XMLHTTP"); },
			3: function(){ return new ActiveXObject("Microsoft.XMLHTTP"); },
			4: function(){ return new ActiveXObject("MSXML2.XMLHTTP.3.0"); },
			5: function(){ return new ActiveXObject("Msxml2.XMLHTTP.4.0"); }
		};
		var _loc3;
		var _loc4;
		for(_loc1 in _loc2){
			_loc3 = _loc2[_loc1];
			try{ _ret = _loc3(); } catch(_loc4){ continue; }
			break;
		}
		return(_ret);
	},

	setHeaders: function(_xhr, _headers){
		if('object'!==typeof(_headers)) return false;
		if('object'!==typeof(_xhr)) return false;
		for(var _k in _headers){
			var _v = _headers[_k];
			try { _xhr.setRequestHeader(_k, _v); } catch(e) {}
		}
	},

	setHeader: function(_xhr, _header, _value){
		var e; try { _xhr.setRequestHeader(_header, _value); } catch(e) {}
	},

	httpHelpCode: function(_http_code){
		if(_http_code>=100 && _http_code<200) return(_http_code+" - Information");
		if(_http_code>=200 && _http_code<300) return(_http_code+" - Successful");
		if(_http_code>=400 && _http_code<500) return(_http_code+" - No content");
		if(_http_code>=500 && _http_code<600) return(_http_code+" - Server crazy");
		return(_http_code+" - Unknow status type");
	},

//  funcoes DOM
	set_html: function(_dom_id,_html){
		var _loc1=document.getElementById(_dom_id);
		if(_loc1){
			_loc1.innerHTML=_html;
			return(true);
		}
		return(false);
	},
	get_html: function(_dom_id){
		var _ret='';
		var _loc1=document.getElementById(_dom_id);
		if(_loc1){
			_ret=_loc1.innerHTML;
			return(_ret);
		}
		return(_ret);
	},
	cut_html: function(_dom_id){
		var _ret='';
		var _loc1=document.getElementById(_dom_id);
		if(_loc1){
			_ret=_loc1.innerHTML;
			_loc1.innerHTML = '';
			return(_ret);
		}
		return(_ret);
	},

	// retorna objeto DOM que representa a tag html
	getdom: function(_dom_id){
		if('string'!=typeof(_dom_id) || _dom_id=='') return(false);
		var _loc1=document.getElementById(_dom_id);
		if(_loc1)return(_loc1);
		return(false);
	},

	// retornar se um DOM existe (pelo id)
	domexist: function(_dom_id){
		if(typeof(_dom_id)!='string' || _dom_id == '') return(false);
		var _loc1 = document.getElementById(_dom_id);
		return(_loc1 ? true:false);
	},


	// setar classe css
	css: function(_dom_id,_class_name){
		var _loc1=document.getElementById(_dom_id);
		if(!_loc1)return(0);
		_loc1.className=_class_name;
		return(1);
	},
	// alternar entre duas classes css num dom
	// parametros: domid, classe a ocultar, classe a mostrar
	altcss: function(_dom_id,_active_class_name,_alternative_class_name){
		var _loc1=document.getElementById(_dom_id);
		if(_loc1.className==_active_class_name){
			_loc1.className=_alternative_class_name;
		}else{
			_loc1.className=_active_class_name;
		}
	},

	ifcss: function(_dom_id,_is_true,classtrue,classfalse){
		var _loc1=document.getElementById(_dom_id);
		if(_is_true){
			_loc1.className=classtrue;
		}else{
			_loc1.className=classfalse;
		}
	},

	ifcsshave: function(_dom_id,_is_true,classtrue,classfalse){
		if(_is_true){
			stdlib.delcss(_dom_id, classfalse);
			stdlib.addcss(_dom_id, classtrue);
			return(true);
		}else{
			stdlib.delcss(_dom_id, classtrue);
			stdlib.addcss(_dom_id, classfalse);
			return(false);
		}
	},


	/* adicionar classe ao objeto dom, nao remover as classes atuais, impedir duplicidade */
	addcss: function(_dom_id, _new_class_name){
		var _loc1 = document.getElementById(_dom_id);
		if(!_loc1) return(0);
		var _loc2 = stdlib.trim(stdlib.trim(stdlib.str_replace(_new_class_name,"",_loc1.className)) + " " + _new_class_name);
		_loc1.className = _loc2;
		return(1);
	},
	delcss: function(_dom_id, _del_class_name){
		var _loc1 = document.getElementById(_dom_id);
		if(!_loc1) return(0);
		var _loc2 = stdlib.trim(stdlib.str_replace(_del_class_name,"",_loc1.className));
		_loc1.className = _loc2;
		return(1);
	},
	// colcoar classe em uma li especifica e remova das demais a mesma classe
	/*
	select_li: function(_dom_id, _param2, _param2){
		var _loc1 = document.getElementById(_dom_id);
		var _loc2;
		var _loc3;
		if(!_loc1) return(false);
		// obter lista de filhos e remover _param2 de seus className
		for (_loc2=0; _loc2<_loc1.childNodes.length; _loc2++){
			if(_loc1.childNodes[_loc2].nodeName=="LI"){
				_loc3 = _loc1.childNodes[_loc2].id;
				if(_loc3==_param2){
					stdlib.addcss(_loc3, _param2);
				}else{
					stdlib.delcss(_loc3, _param2);
				}
			}
		}
	}
	*/

	// obter nome de classes css de um DOM
	getcss: function(_dom_id){
		var _loc1 = document.getElementById(_dom_id);
		if(!_loc1) return('');
		return(_loc1.className);
	},
	
	
	// obter representacao de tamanho para uso em tamanho/posicao
	parse_style_size: function(_input_size){
		var _tof = typeof(_input_size);
	
		if(_tof=='number'){
			// converter numero para string
			_input_size = _input_size.toString();
		// tipo incoerente
		}else if(_tof!='string') return _input_size;

		if(_input_size=='auto') return _input_size;

		// retirar espacos
		// rtrim
		while(_input_size.charAt((_input_size.length -1))==" ") _input_size=_input_size.substr(0,_input_size.length-1);
		// ltrim
		while(_input_size.charAt(0)==" ") _input_size=_input_size.replace(_input_size.charAt(0),"");

		// porcentagem nao encontrada, usar pixel
		if(_input_size.indexOf('%',0) === -1) _input_size=stdlib.toint(_input_size)+"px";
		return(_input_size);

		/*
		if(!stdlib.strpos(_input_size,'%')) _input_size=stdlib.toint(_input_size)+"px";
		return(_input_size);
		*/
	},
	// recebe um valor em pixel e retorna numerico, se o valor for em porcentagem, usa total para calcular relatividade
	get_px_size: function(_input_size, _total_size){
		if(stdlib.strpos(_input_size,'%')){
			var _pc=stdlib.toint(_input_size);
			var _total = stdlib.toint(_total_size);
			_input_size = ((_total/100)*_pc);
		}else{
			_input_size=stdlib.toint(_input_size);
		}
		return(_input_size);
	},

	// construir estilo inline
	mkstyle: function(_input_object){
		var _style = '';
		var _loc1;
		//'background-color: red;';
		if('object'!=typeof(_input_object)) return('');
		
		// criar!
		for(_loc1 in _input_object){
			var _value = _input_object[_loc1];
			if('object'==typeof(_value) || 'function'==typeof(_value)||stdlib.nothing(_value)) continue;
			_loc1=stdlib.strtolower(_loc1);
			switch(_loc1){
				case 'marginleft':
				case 'margin_left':
					_style += 'margin-left:'+stdlib.parse_style_size(_value)+';';
					break;
				case 'marginright':
				case 'margin_right':
					_style += 'margin-right:'+stdlib.parse_style_size(_value)+';';
					break;
				case 'margintop':
				case 'margin_top':
					_style += 'margin-top:'+stdlib.parse_style_size(_value)+';';
					break;
				case 'marginbottom':
				case 'margin_bottom':
					_style += 'margin-bottom:'+stdlib.parse_style_size(_value)+';';
					break;

				case 'display':
					_style += 'display:'+_value+';';
					break;

				case 'position':
					_style += 'position:'+_value+';';
					break;

				case 'width':
					_style += 'width:'+stdlib.parse_style_size(_value)+';';
					break;
				case 'height':
					_style += 'height:'+stdlib.parse_style_size(_value)+';';
					break;
				case 'minwidth':
				case 'min-width':
				case 'min_width':
					_style += 'min-width:'+stdlib.parse_style_size(_value)+';';
					break;
				case 'minheight':
				case 'min-height':
				case 'min_height':
					_style += 'height:'+stdlib.parse_style_size(_value)+';';
					break;
				case 'left':
					_style += 'left:'+stdlib.parse_style_size(_value)+';';
					break;
				case 'right':
					_style += 'right:'+stdlib.parse_style_size(_value)+';';
					break;

				case 'top':
					_style += 'top:'+stdlib.parse_style_size(_value)+';';
					break;

				case 'bottom':
					_style += 'bottom:'+stdlib.parse_style_size(_value)+';';
					break;

				case 'backgroundcolor':
				case 'background_color':
				case 'bgcolor':
					_style += 'background-color:'+_value+';';
					break;

				case 'gradient': // instrucao completa do gradiente em background
					_style += _value;
					break;
				case 'background':
					_style += 'background:'+_value+';';
					break;
					
				case 'border':
					_style += 'border:'+_value+';';
					break;
				
				case 'float':
					_style += 'float:'+_value+';';
					break;
				case 'clear':
					_style += 'clear:'+_value+';';
					break;

				case 'fontsize':
				case 'font_size':
					_style += 'font-size:'+stdlib.parse_style_size(_value)+';';
					break;
				
				case 'fontfamily':
				case 'font_family':
					_style += 'font-family:'+_value+';';
					break;

				case 'fontstyle':
				case 'font_style':
					_style += 'font-style:'+_value+';';
					break;

				case 'fontweight':
				case 'font_weight':
					_style += 'font-wight:'+_value+';';
					break;
					
				case 'zindex':
				case 'z_index':
				case 'z':
					_style += 'z-index: '+_value+';';
					break;
				default:
					continue;
			}
		}
		
		return(_style);
	},

	hideshow: function(_dom_id, _status){
		var _dom=document.getElementById(_dom_id);
		if(!_dom)return false;
		_dom.style.display= _status?'block':'none';
		return true;
	},

	// setar propriedades style em um dom
	style: function(_dom_id,_style_to_set){
		var _loc1;
		var _loc2=document.getElementById(_dom_id);
		if(!_loc2)return(0);
		if('object'!=typeof(_style_to_set)){
			_loc2.style = _style_to_set;
			return(1);
		}
		if('string'==typeof(_style_to_set)){
			_loc2.style = _style_to_set;
			return 1;
		}
		for(_loc1 in _style_to_set){
			var _value = _style_to_set[_loc1];
			//if('object'==typeof(_value)||'function'==typeof(_value)||stdlib.nothing(_value)) continue;
			_loc1=stdlib.strtolower(_loc1);
			switch(_loc1){
				case 'marginleft':
				case 'margin_left':
					_loc2.style.marginLeft=stdlib.parse_style_size(_value);
					break;
				case 'marginright':
				case 'margin_right':
					_loc2.style.marginRight=stdlib.parse_style_size(_value);
					break;
				case 'margintop':
				case 'margin_top':
					_loc2.style.marginTop=stdlib.parse_style_size(_value);
					break;
				case 'marginbottom':
				case 'margin_bottom':
					_loc2.style.marginBottom=stdlib.parse_style_size(_value);
					break;
				case 'margin':
					_loc2.style.margin=stdlib.parse_style_size(_value);
					break;

				case 'paddingleft':
				case 'padding_left':
					_loc2.style.paddingLeft=stdlib.parse_style_size(_value);
					break;
				case 'paddingright':
				case 'padding_right':
					_loc2.style.paddingRight=stdlib.parse_style_size(_value);
					break;
				case 'paddingtop':
				case 'padding_top':
					_loc2.style.paddingTop=stdlib.parse_style_size(_value);
					break;
				case 'paddingbottom':
				case 'padding_bottom':
					_loc2.style.paddingBottom=stdlib.parse_style_size(_value);
					break;
				case 'padding':
					_loc2.style.padding=stdlib.parse_style_size(_value);
					break;


				case 'display':
					_loc2.style.display=_value;
					break;

				case 'position':
					_loc2.style.position=_value;
					break;

				case 'width':
					_loc2.style.width=stdlib.parse_style_size(_value);
					break;
				case 'height':
					_loc2.style.height=stdlib.parse_style_size(_value);
					break;
				case 'minwidth':
				case 'min-width':
				case 'min_width':
					_loc2.style.minWidth=stdlib.parse_style_size(_value);
					break;
				case 'minheight':
				case 'min-height':
				case 'min_height':
					_loc2.style.minHeight=stdlib.parse_style_size(_value);
					break;
				case 'left':
					_value=stdlib.toint(_value)+"px";
					_loc2.style.left = _value;
					break;
				case 'right':
					_value=stdlib.toint(_value)+"px";
					_loc2.style.right = _value;
					break;

				case 'top':
					_value=stdlib.toint(_value)+"px";
					_loc2.style.top = _value;
					break;

				case 'bottom':
					_value=stdlib.toint(_value)+"px";
					_loc2.style.bottom = _value;
					break;


				case 'backgroundcolor':
				case 'background_color':
				case 'bgcolor':
					_loc2.style.backgroundColor = _value;
					break;

				case 'background':
					_loc2.style.background = _value;
					break;
					
				case 'border':
					_loc2.style.border = _value;
					break;

				case 'color':
					_loc2.style.color = _value;
					break;
				
				//case 'float':
				//	_loc2.style.float = _value;
				//	break;

				case 'fontsize':
				case 'font_size':
					if(!stdlib.nothing(_loc2.style.fontSize)) _loc2.style.fontSize=stdlib.parse_style_size(_value);
					break;
				
				case 'fontfamily':
				case 'font_family':
					_loc2.style.fontFamily = _value;
					break;

				case 'fontstyle':
				case 'font_style':
					_loc2.style.fontStyle = _value;
					break;

				case 'fontweight':
				case 'font_weight':
					_loc2.style.fontWeight = _value;
					break;
				
			}
		}
		return(1);
	},

	// obter valor de INPUT
	getvalue: function(_dom_id){
		var _loc1 = stdlib.getdom(_dom_id);
		var _loc2='';
		if(_loc1) if(_loc1.value) _loc2=_loc1.value;
		return(_loc2);
	},
	getchecked: function(_dom_id){
		var _loc1 = stdlib.getdom(_dom_id);
		var _loc2=0;
		if(_loc1 && typeof(_loc1.checked)!='undefined') _loc2=(_loc1.checked?1:0);
		return(_loc2);
	},
	// alterar valores de INPUTs
	setvalue: function(_dom_id,_value){
		var _loc1=stdlib.getdom(_dom_id);
		var _loc2=false;
		if(_loc1){
			_loc1.value=_value;
			_loc2=true;
		}
		return(_loc2);
	},

	setdomsize: function(_dom_id,_width,_height){
		var _loc1=document.getElementById(_dom_id);
		if(!_loc1)return(false);
		var _hw = 0;
		var _hh = 0;
		// verificar tamanhos com pixels
		if(stdlib.strpos(_width,'%')){
			// largura em porcentagem
			_hw = 1;
		}else{
			// largura em pixels
			_width=stdlib.toint(_width);
			if(_width){ _width=_width+'px'; _hw=1 }
		}
		if(stdlib.strpos(_height,'%')){
			// altura em porcentagem
			_hh = 1;
		}else{
			// altura em pixels
			_height=stdlib.toint(_height);
			if(_height){ _height=_height+'px'; _hh=1 }
		}

		// alterar largura
		if(_hw)_loc1.style.width=_width;
		// alterar altura
		if(_hh)_loc1.style.height=_height;

		return(true);
	},

	// obter tamanho e posicao de um dom
	getdommetrics: function(_dom_id){
		var _ret = {
			found: 0,
			width: 0,
			height: 0,
			x:0, y:0,
			ax:0, ay:0,
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			switdh: 0,
			sheight: 0
		};

		var _loc1 = stdlib.getdom(_dom_id);
		var _loc2;
		var _loc3;
		if(!_loc1) return(_ret);
		_ret.found = 1;
		// posicoes proprias
		_ret.x = _loc1.offsetLeft;
		_ret.y = _loc1.offsetTop;
		_ret.width = stdlib.toint(_loc1.style.width);
		_ret.height = stdlib.toint(_loc1.style.height);
		_ret.left = _loc1.offsetLeft;
		_ret.top = _loc1.offsetTop;
		_ret.switdh = _loc1.scrollWidth;
		_ret.sheight = _loc1.scrollHeight;
		if(!_ret.width) _ret.width = _loc1.offsetWidth;
		if(!_ret.height) _ret.height = _loc1.offsetHeight;
		if(!_ret.switdh) _ret.switdh = _loc1.width;
		if(!_ret.sheight) _ret.sheight = _loc1.height;

		// posicoes absolutas
		for (_loc2=0, _loc3=0; _loc1 != null; _loc2 += _loc1.offsetLeft, _loc3 += _loc1.offsetTop, _loc1 = _loc1.offsetParent);
		_ret.ax = _loc2;
		_ret.ay = _loc3;
	
		return(_ret);
	},

	// obter tamanho e posicao de um dom
	getdomsize: function(_dom_id){
		var _ret = {width: 0, height: 0 };
		var _loc1 = stdlib.getdom(_dom_id);
		if(!_loc1) return(_ret);
		// posicoes proprias
		// largura
		_ret.width = stdlib.toint(_loc1.offsetWidth);
		if(!_ret.width) _ret.width = stdlib.toint(_loc1.style.width);

		// altura
		_ret.height = stdlib.toint(_loc1.offsetHeight);
		if(!_ret.height) _ret.height = stdlib.toint(_loc1.style.height);

		// obter medidas de padding
		_ret.padding_top = stdlib.toint(_loc1.style.paddingTop);
		_ret.padding_right = stdlib.toint(_loc1.style.paddingRight);
		_ret.padding_bottom = stdlib.toint(_loc1.style.paddingBottom);
		_ret.padding_left = stdlib.toint(_loc1.style.paddingLeft);
		_ret.padding_horizontal = _ret.padding_right + _ret.padding_left;
		_ret.padding_vertical = _ret.padding_top + _ret.padding_bottom;

		return(_ret);
	},



	getabsolutepos: function(_dom_id){
		var _loc1 = stdlib.getdom(_dom_id);
		var _loc2;
		var _loc3;
		var _ret = {x:0, y:0};
		for (_loc2=0, _loc3=0; _loc1 != null; _loc2 += _loc1.offsetLeft, _loc3 += _loc1.offsetTop, _loc1 = _loc1.offsetParent);
		_ret.x = _loc2; _ret.y = _loc3;
		return(_ret);
	},

	setdompos: function(_dom_id,_top,_left){
		var _loc1=document.getElementById(_dom_id);
		if(!_loc1) return(false);
		_loc1.style.left=_left+'px';
		_loc1.style.top=_top+'px';
		return(true);
	},

	setfocus: function(_dom_id){
		var _loc1 = document.getElementById(_dom_id);
		if(_loc1){
			_loc1.focus();
			return(1);
		}
		return(0);
	},
	
	seltext: function(_dom_id){
		var _loc1 = document.getElementById(_dom_id);
		if(_loc1){
			_loc1.select();
			return(1);
		}
		return(0);
	},
	
	domdelete: function(_dom_id){
		var _ret=document.getElementById(_dom_id);
		if(_ret) _ret.parentNode.removeChild(_ret);
	},

	addchild: function(_master_dom_id, _new_dom_id, _tag_obj){
		if(_new_dom_id==''||_master_dom_id=='') return(0);
		/* criar dom */
		var _loc1 = "div";
		if('object'==typeof(_tag_obj) && _tag_obj.type) _loc1=_tag_obj.type;
		var _loc2 = document.createElement(_loc1);
		/* id */
		_loc2.setAttribute('id', _new_dom_id);
		/* parametros e atributos */
		if('object'==typeof(_tag_obj)){
			if(_tag_obj.html) _loc2.innerHTML =  _tag_obj.html;
			if(_tag_obj.style) _loc2.setAttribute('style', _tag_obj.style);
			if(_tag_obj.tagclass) _loc2.setAttribute('class', _tag_obj.tagclass);
			if(_tag_obj.onclick) _loc2.onclick = _tag_obj.onclick;
		}
		/* inserir na tag mae */
		document.getElementById(_master_dom_id).appendChild(_loc2);
		return(1);
	},


// mapa de conversao string para html
	get_html_translation_table: function(table, quote_style) {
		var entities = {};
		var hash_map = {};
		var decimal = 0;
		var symbol = '';
		var constMappingTable = {};
		var constMappingQuoteStyle = {};
		var useTable = {};
		var useQuoteStyle = {};
		
		// Translate arguments
		constMappingTable[0] = 'HTML_SPECIALCHARS';
		constMappingTable[1] = 'HTML_ENTITIES';
		constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
		constMappingQuoteStyle[2] = 'ENT_COMPAT';
		constMappingQuoteStyle[3] = 'ENT_QUOTES';
		
		useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
		useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';
		
		if(useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES'){
			throw new Error("Table: " + useTable + ' not supported');
		}
		
		entities['38'] = '&amp;';
		if (useTable === 'HTML_ENTITIES') {
			entities['160'] = '&nbsp;'; entities['161'] = '&iexcl;'; entities['162'] = '&cent;'; entities['163'] = '&pound;';
			entities['164'] = '&curren;'; entities['165'] = '&yen;'; entities['166'] = '&brvbar;'; entities['167'] = '&sect;';
			entities['168'] = '&uml;'; entities['169'] = '&copy;'; entities['170'] = '&ordf;'; entities['171'] = '&laquo;';
			entities['172'] = '&not;'; entities['173'] = '&shy;'; entities['174'] = '&reg;'; entities['175'] = '&macr;';
			entities['176'] = '&deg;'; entities['177'] = '&plusmn;'; entities['178'] = '&sup2;'; entities['179'] = '&sup3;';
			entities['180'] = '&acute;'; entities['181'] = '&micro;'; entities['182'] = '&para;'; entities['183'] = '&middot;';
			entities['184'] = '&cedil;'; entities['185'] = '&sup1;'; entities['186'] = '&ordm;'; entities['187'] = '&raquo;';
			entities['188'] = '&frac14;'; entities['189'] = '&frac12;'; entities['190'] = '&frac34;'; entities['191'] = '&iquest;';
			entities['192'] = '&Agrave;'; entities['193'] = '&Aacute;'; entities['194'] = '&Acirc;'; entities['195'] = '&Atilde;';
			entities['196'] = '&Auml;'; entities['197'] = '&Aring;'; entities['198'] = '&AElig;'; entities['199'] = '&Ccedil;';
			entities['200'] = '&Egrave;'; entities['201'] = '&Eacute;'; entities['202'] = '&Ecirc;'; entities['203'] = '&Euml;';
			entities['204'] = '&Igrave;'; entities['205'] = '&Iacute;'; entities['206'] = '&Icirc;'; entities['207'] = '&Iuml;';
			entities['208'] = '&ETH;'; entities['209'] = '&Ntilde;'; entities['210'] = '&Ograve;'; entities['211'] = '&Oacute;';
			entities['212'] = '&Ocirc;'; entities['213'] = '&Otilde;'; entities['214'] = '&Ouml;'; entities['215'] = '&times;';
			entities['216'] = '&Oslash;'; entities['217'] = '&Ugrave;'; entities['218'] = '&Uacute;'; entities['219'] = '&Ucirc;';
			entities['220'] = '&Uuml;'; entities['221'] = '&Yacute;'; entities['222'] = '&THORN;'; entities['223'] = '&szlig;';
			entities['224'] = '&agrave;'; entities['225'] = '&aacute;'; entities['226'] = '&acirc;'; entities['227'] = '&atilde;';
			entities['228'] = '&auml;'; entities['229'] = '&aring;'; entities['230'] = '&aelig;'; entities['231'] = '&ccedil;';
			entities['232'] = '&egrave;'; entities['233'] = '&eacute;'; entities['234'] = '&ecirc;'; entities['235'] = '&euml;';
			entities['236'] = '&igrave;'; entities['237'] = '&iacute;'; entities['238'] = '&icirc;'; entities['239'] = '&iuml;';
			entities['240'] = '&eth;'; entities['241'] = '&ntilde;'; entities['242'] = '&ograve;'; entities['243'] = '&oacute;';
			entities['244'] = '&ocirc;'; entities['245'] = '&otilde;'; entities['246'] = '&ouml;'; entities['247'] = '&divide;';
			entities['248'] = '&oslash;'; entities['249'] = '&ugrave;'; entities['250'] = '&uacute;'; entities['251'] = '&ucirc;';
			entities['252'] = '&uuml;'; entities['253'] = '&yacute;'; entities['254'] = '&thorn;'; entities['255'] = '&yuml;';
		}
		if(useQuoteStyle !== 'ENT_NOQUOTES'){
			entities['34'] = '&quot;';
		}
		if(useQuoteStyle === 'ENT_QUOTES'){
			entities['39'] = '&#39;';
		}
		entities['60'] = '&lt;';
		entities['62'] = '&gt;';
		// ascii decimals to real symbols
		for(decimal in entities){
			symbol = String.fromCharCode(decimal);
			hash_map[symbol] = entities[decimal];
		}
		return hash_map;
	},

// conversao string para HTML
	htmlentities: function(string, quote_style, charset, double_encode){
		var hash_map = {};
		var symbol = '';
		var entity = '';
		string += '';
		double_encode = !!double_encode || double_encode == null;
		
		if(false === (hash_map = stdlib.get_html_translation_table('HTML_ENTITIES',quote_style))){
			return false;
		}
		hash_map["'"] = '&#039;';
	
		if(double_encode){
			for(symbol in hash_map){
				entity = hash_map[symbol];
				string = string.split(symbol).join(entity);
			}
		}else{
			string = string.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-z][\da-z]*);|$)/g, function (ignore, text, entity) {
				return stdlib.htmlentities(text, quote_style, charset) + entity;
			});
		}
		return string;
	},

// funcoes debug
	debug_enable: 0,
	debug: function(_textlog,_force_log){
		console.log(stdlib.time()+": "+_textlog);
		if(stdlib.debug_enable||_force_log){
			var _loc1=stdlib.getdom('debug');
			if(_loc1) _loc1.innerHTML=stdlib.time()+": "+_textlog+"<br>"+_loc1.innerHTML;
		}
	},
	logit: function(_textlog){
		var _loc1=stdlib.getdom('debug');
		var _log = stdlib.time() + ": " + stdlib.tostring(_textlog);
		if(_loc1) _loc1.innerHTML=_loc1.innerHTML+"<br>"+_log;
		console.log(_log);
	},

	// retornar string do objeto para depuracao
	debugobj: function(_obj){
		var _idx;
		var _ret = '';
		var _c = 0;
		var _tof = typeof(_obj);
		
		switch(_tof){
			case 'number':
				return _obj.toString();
				break;
			case 'string':
				return '"'+_obj+'"';
				break;
			case 'boolean':
				return _obj?'true':'false';
				break;
			case 'object':
				for(_idx in _obj){
					_ret += ( _c ? ',' : '' ) + _idx + ':' + stdlib.debugobj(_obj[_idx]);
					_c++;
				}
				break;
			default:
				return '';
		}
		return '{'+_ret+'}';
	},



	// funcoes de utilitarios de conversao string para numero NID

	charcode: function(string){
		var str=string+'';
		var code=str.charCodeAt(0);
		if(0xD800<=code&&code<=0xDBFF){
			var hi=code;
			if(str.length===1){
				return code;
			}
			var low=str.charCodeAt(1);
			if(!low){}
			return((hi-0xD800)*0x400)+(low-0xDC00)+0x10000;
		}
		if(0xDC00 <= code && code <= 0xDFFF){
			return code;
		}
		return code;
	},

	// converter string em numero unico
	str2numdb: {__count: 0},
	str2number: function(str){
		var _len;
		var _nid = 0;
		str = str + ''; _len = str.length;

		// indexar pelo tamanho da string para facilitar busca e cadastro
		if(typeof(stdlib.str2numdb[_len])!='object') stdlib.str2numdb[_len] = {};
		if(typeof(stdlib.str2numdb[_len][str])=='undefined'){
			// definir
			stdlib.str2numdb.__count++;
			stdlib.str2numdb[_len][str] = stdlib.str2numdb.__count;
			_nid = stdlib.str2numdb.__count;
		}else{
			// ja esta definido
			_nid = stdlib.str2numdb[_len][str];
		}
		return _nid;
	},

	importxid: function(xid){
		var _nid = 0;
		var _xid = xid;
		var _loc1 = ('number'==typeof(_xid));
		var _loc2 = stdlib.is_numeric(_xid);
		if(_loc1 || _loc2){
			_nid = stdlib.toint(_xid);
		}else if('string'==typeof(_xid)){
			_nid = stdlib.str2number(_xid);
		}
		return(_nid);
	},

	// funcoes de integraçao javascript

	/* eval de script dentro de texto respondido em ajahx request */
	eval_script: function(_input_string){
		if(stdlib.nothing(_input_string)) return(false);
		var script = "";
		var inner_script = /<script>([\s\S]+)<\/script>/mi;
		if(_input_string.match(inner_script)){script=RegExp.$1;_input_string=_input_string.replace(inner_script, "");eval(script);}
	},

	// funcoes de teste de navegador
	is_ie: function (){
		var _loc1 = navigator.userAgent;
		if(_loc1.indexOf('MSIE')>-1) return true;
		return false;
	},
	
	is_chrome: function(){
		var _loc1 = navigator.userAgent;
		if(_loc1.indexOf('Chrome')>-1) return true;
		return false;
	},
	
	is_firefox: function(){
		var _loc1 = navigator.userAgent;
		if(_loc1.indexOf('Firefox')>-1&&_loc1.indexOf('Navigator')===-1) return true;
		return false;
	},
	
	is_safari: function(){
		var _loc1 = navigator.userAgent;
		if(_loc1.indexOf('Chrome')===-1&&_loc1.indexOf('Safari')>-1) return true;
		return false;
	},
	
	is_opera: function(){
		var _loc1 = navigator.userAgent;
		if(_loc1.indexOf('Opera')>-1) return true;
		return false;
	},
	
	is_netscape: function(){
		var _loc1 = navigator.userAgent;
		if(_loc1.indexOf('Navigator')>-1) return true;
		return false;
	},
	
	is_konqueror: function(){
		var _loc1 = navigator.userAgent;
		if(_loc1.indexOf('konqueror')>-1) return true;
		return false;
	},

	is_ipad: function(){
		if((navigator.userAgent.match(/iPad/i))) return true;
		return false;
	},



	// funcoes complementares javascript
	js_run: function(_input_string){
		// detectar script puro
		var _loc1 = /<script>([\s\S]+)<\/script>/mi;
		if (_input_string.match(_loc1)){
			var _loc2 =  RegExp.$1; // obter script
			if(_loc2!="") eval(_loc2);
		}
		// detectar script alternativo
		_loc1 = /<script type=.text\/javascript.>([\s\S]+)<\/script>/mi;
		if (_input_string.match(_loc1)){
			var _loc2 = RegExp.$1; // obter script
			if(_loc2!="") eval(_loc2);
		}
	},

	// converter texto em JSON
	json_parser: function(_input_string){
		var _ret = {};
		var _loc1;
		try {
			_ret = eval("("+_input_string+")");
		}
		catch(_loc1){
			_ret = {};
		}
		if('object'!=typeof(_ret)) _ret = {};
		return _ret;
	}
};

// aliases
	stdlib.microtime = stdlib.utime;
	stdlib.xid = stdlib.importxid;


//********************************************************************************************** DOCUMENT - stdlib_document.js


/* capturar evento global relacionado a documento */

	// objeto container de todas as funcoes genericas
	stdlib_document = {};
	stdlib_document.width=1000;
	stdlib_document.height=800;

	
	// retornar posicoes simples
	stdlib_document.getWidth = function(){
		var w = document.body.getBoundingClientRect().width;
		stdlib_document.width = (w);
		return w;
		/*
		var wmax = Math.max(document.documentElement["clientWidth"], document.body["scrollWidth"], document.documentElement["scrollWidth"], document.body["offsetWidth"], document.documentElement["offsetWidth"])
		stdlib_document.width = (wmax);	
		// Antes, apenas:
		return(stdlib_document.width);
		*/
	}
	stdlib_document.getHeight = function(){
		var h = document.body.getBoundingClientRect().height;
		stdlib_document.width = (h);
		return h;

		// antes, apenas:
		//return(stdlib_document.height);
	}
	stdlib_document.getSize = function(){ return({width:stdlib_document.getWidth(),height:stdlib_document.getHeight()});}


	/* slots internos, evitar multiplos anexos no evento do navegador
		Reservas:
			0=(nao usar)
			1=WIDE
			2=jsMENU
			3=jSLIDER
			4=jMAINmenu
			5=jFRAME
			6=uform_select

	*/
	//stdlib_document.slots_load = new Ar ray();
	//stdlib_document.slots_unload = new Ar ray();
	//stdlib_document.slots_resize = new Ar ray();

	stdlib_document.slots_load = {};
	stdlib_document.slots_unload = {};
	stdlib_document.slots_resize = {};
	stdlib_document.slots_keydown = {};

	// receptor de captura do evento - pagina carregada
	stdlib_document.onload = function(){
		// executar slots load
		var slt_id;
		for(slt_id in stdlib_document.slots_load)
			if('function'==typeof(stdlib_document.slots_load[slt_id]))
				stdlib_document.slots_load[slt_id]();
	}

	// receptor de captura do evento - pagina des carregada
	stdlib_document.unload = function(){
		// executar slots load
		var slt_id;
		for(slt_id in stdlib_document.slots_unload)
			if('function'==typeof(stdlib_document.slots_unload[slt_id]))
				stdlib_document.slots_unload[slt_id]();
	}

	// receptor de captura do evento - alterar tamanho da pagina
	stdlib_document.resize = function(){
		// executar slots resize
		var slt_id;
		for(slt_id in stdlib_document.slots_resize)
			if('function'==typeof(stdlib_document.slots_resize[slt_id]))
				stdlib_document.slots_resize[slt_id]();
	}


	// tecla precionada
	stdlib_document.keydown = function(_e){
		var _key = 0;
		try{
			_key =  _e.keyCode;
		} catch(_e){}
		if(_key){
			// procurar eventos hospedados
			//stdlib.set_html('keylog', 'document: '+_key);
			for(var slt_id in stdlib_document.slots_keydown)
				if('function'==typeof(stdlib_document.slots_keydown[slt_id]))
					stdlib_document.slots_keydown[slt_id](_key);
				//- if
			//- for
		}
	}


	// travar/destravar selecao de documento
	stdlib_document.selectable = function(status){
		if(status)
			document.onselectstart=null;
		else
			document.onselectstart=new Function ("return false");
	}

	// instalar stdlib_document nos eventos do navegador
	stdlib_document.installed = false;

	stdlib_document.install = function(){
		if(!stdlib_document.installed){
			stdlib_document.installed=true;

			/* integrar com eventos do navegador: sem comentarios quanto ao IE... */
			if(document.addEventListener){
				document.addEventListener('onload',stdlib_document.onload,false);
				document.addEventListener('unload',stdlib_document.unload,false);
				document.addEventListener('resize',stdlib_document.resize,false);
				document.addEventListener('keydown',stdlib_document.keydown,false);
			}else if(document.attachEvent){
				document.attachEvent('onload',stdlib_document.onload);
				document.attachEvent('unload',stdlib_document.unload);
				document.attachEvent('resize',stdlib_document.resize);
				document.attachEvent('keydown',stdlib_document.keydown);
			}else{
				alert("stdlib::document() Unknow environment");
			}
		}
	}

	// executar instalacao
	stdlib_document.install();



//********************************************************************************************** DOCUMENT - stdlib_mouse.js



/* capturar evento global relacionado a mouse */

	// objeto container de todas as funcoes genericas
	stdlib_mouse = {};
	stdlib_mouse.x=0;
	stdlib_mouse.y=0;
	stdlib_mouse.lx=0;
	stdlib_mouse.ly=0;
	stdlib_mouse.cx=0;
	stdlib_mouse.cy=0;
	stdlib_mouse.fx=0;
	stdlib_mouse.fy=0;
	stdlib_mouse.px=0;
	stdlib_mouse.py=0;

	// retornar posicoes simples
	stdlib_mouse.getX = function(){
		return(stdlib_mouse.x);
	}
	stdlib_mouse.getY = function(){
		return(stdlib_mouse.y);
	}
	stdlib_mouse.getPos = function(){
		var _export = {
			x:  stdlib_mouse.x,
			y:  stdlib_mouse.y,
			lx: stdlib_mouse.lx,
			ly: stdlib_mouse.ly,
			cx: stdlib_mouse.cx,
			cy: stdlib_mouse.cy,
			fx: stdlib_mouse.fx,
			fy: stdlib_mouse.fy,
			px: stdlib_mouse.px,
			py: stdlib_mouse.py
		};
		//stdlib_mouse.debug();
		return(_export);
	}

	/* slots internos, evitar multiplos anexos no evento do navegador
		Reservas:
			0=(nao usar)
			1=WIDE
			2=jsMENU
			3=jSLIDER
			4=jMAINmenu
			5=jFRAME
			6=uform_select
	
	stdlib_mouse.slots_move = new Ar ray();
	stdlib_mouse.slots_down = new Ar ray();
	stdlib_mouse.slots_up = new Ar ray();
	stdlib_mouse.slots_click = new Ar ray();

	*/

	stdlib_mouse.slots_move = {};
	stdlib_mouse.slots_down = {};
	stdlib_mouse.slots_up = {};
	stdlib_mouse.slots_click = {};


	// descobrir posicao de mouse com suporte a multi-navegadores
	stdlib_mouse.mouse_coord = function(event) {
		event = event || window.event;
		var _x = 0;
		var _y = 0;
		var _cx = event.clientX;
		var _cy = event.clientY;
		var _lx = (document.documentElement || document.boly).scrollLeft;
		var _ly = (document.documentElement || document.boly).scrollTop;
		var _fx = stdlib.toint(event.x) || stdlib.toint(event.pageX + window.pageXOffset);
		var _fy = stdlib.toint(event.y) || stdlib.toint(event.pageY + window.pageYOffset);
		var _px = event.pageX;
		var _py = event.pageY;

		// escobrir
		_x = (event.pageX || _cx + _lx);
		_y = (event.pageY || _cy + _ly);

		// exportar
		stdlib_mouse.x=_x;
		stdlib_mouse.y=_y;
		stdlib_mouse.lx=_lx;
		stdlib_mouse.ly=_ly;
		stdlib_mouse.cx=_cx;
		stdlib_mouse.cy=_cy;
		stdlib_mouse.fx=_fx;
		stdlib_mouse.fy=_fy;
		stdlib_mouse.px=_px;
		stdlib_mouse.py=_py;

		
		//stdlib_mouse.debug();
	}

	stdlib_mouse.debug = function(){
		_debug = 'mouse_coord()<pre>';
		_debug+= ' abs['+stdlib_mouse.x  +'/'+ stdlib_mouse.y  +']'+"\n";
		_debug+= ' cli['+stdlib_mouse.cx +'/'+ stdlib_mouse.cy +']'+"\n";
		_debug+= ' srl['+stdlib_mouse.lx +'/'+ stdlib_mouse.ly +']'+"\n";
		_debug+= ' fix['+stdlib_mouse.fx +'/'+ stdlib_mouse.fy +']'+"\n";
		//_debug+= ' win['+window.event.clientX +'/'+ window.event.clientY +']'+"\n";
		_debug+= ' pag['+stdlib_mouse.px +'/'+ stdlib_mouse.py +']'+"\n";
		_debug+= '</pre>';
		stdlib.set_html('info', _debug);
		//stdlib.debug('info', _debug);
	} 

	// receptor de captura do evento - mouse move
	stdlib_mouse.mousemove = function(e){
		stdlib_mouse.mouse_coord(e);
		// executar slots move
		for(var slt_id in stdlib_mouse.slots_move)
			if('function' == typeof(stdlib_mouse.slots_move[slt_id])) stdlib_mouse.slots_move[slt_id](e);
	}
	// receptor de captura do evento - mouse down
	stdlib_mouse.mousedown = function(e){
		// executar slots down
		var slt_id;
		for(slt_id in stdlib_mouse.slots_down){
			if('function'==typeof(stdlib_mouse.slots_down[slt_id])){
				stdlib_mouse.slots_down[slt_id](e);
			}
		}

	}
	// receptor de captura do evento - mouse up
	stdlib_mouse.mouseup = function(e){

		// executar slots up
		var slt_id;
		for(slt_id in stdlib_mouse.slots_up){
			if('function'==typeof(stdlib_mouse.slots_up[slt_id])){
				stdlib_mouse.slots_up[slt_id](e);
			}
		}
	
	}
	// receptor de captura do evento - click
	stdlib_mouse.click = function(){

		// executar slots click
		var slt_id;
		for(slt_id in stdlib_mouse.slots_click){
			if('function'==typeof(stdlib_mouse.slots_click[slt_id])){
				stdlib_mouse.slots_click[slt_id]();
			}
		}


	}


	// instalar stdlib_mouse nos eventos do navegador
	stdlib_mouse.installed = false;
	stdlib_mouse.install = function(){
		if(!stdlib_mouse.installed){
			stdlib_mouse.installed=true;
			/* integrar com eventos do navegador: sem comentarios quanto ao IE... */
			if(document.addEventListener){
				document.addEventListener('mousemove',stdlib_mouse.mousemove,false);
				document.addEventListener('mousedown',stdlib_mouse.mousedown,false);
				document.addEventListener('mouseup',stdlib_mouse.mouseup,false);
				document.addEventListener('click',stdlib_mouse.click,false);
			}else if(document.attachEvent){
				document.attachEvent('onmousemove', stdlib_mouse.mousemove);
				document.attachEvent('onmousedown', stdlib_mouse.mousedown);
				document.attachEvent('onmouseup', stdlib_mouse.mouseup);
				document.attachEvent('click', stdlib_mouse.click);
			}else{
				alert("stdlib::mouse() Unknow environment");
			}
		}
	}

	// executar instalacao
	stdlib_mouse.install();



//********************************************************************************************** JLANG - jlang.js

/* suporte a tradução de strings/frases */

// catalogo
lang = {};
lang.dict = 'ptbr';

// catalog portugues-brasileiro
lang.ptbr = {};
lang.ptpt = {};
lang.enus = {};

//@start-escape
	lang.ptbr.ok = "OK";
	lang.ptbr.error = "Erro";
	lang.ptbr._confirm = "Confirmar";
	lang.ptbr.cancel = "Cancelar";
	lang.ptbr.loading = "Carregando";
	lang.ptbr.notexist = "Não existe";
	lang.ptbr.notfound = "Não encontrado";
	lang.ptbr.needlogin = "Autentique-se por favor";
	lang.ptbr.accessdenied = "Acesso negado";
	lang.ptbr.accessaccept = "Acesso permitido";
	lang.ptbr.wait = "Aguarde";
	lang.ptbr.waitlogin = "Aguarde, autenticando";
	lang.ptbr.send = "Enviar";
	lang.ptbr.servererror = "Erro do servidor";
	lang.ptbr.auth = 'Autenticação';
	lang.ptbr.welcome = 'Bem vindo';
	lang.ptbr.authreturn = "Autenticação retornou";
	lang.ptbr.autherror = "Erro durante autenticação";
	lang.ptbr.accesslevel = "Nível de acesso";
	lang.ptbr.username = "Nome de usuário";
	lang.ptbr.password = "Senha";
	lang.ptbr.name = "Nome";

	lang.ptbr.list_notfound = "Nenhum registro encontrado";
	lang.ptbr.list_notcontent = "Nenhum registro para exibir";
	
	lang.ptbr.new_window = "Nova janela";
	lang.ptbr.unamed_tab = "Nova guia";

	lang.ptbr.yes = "Sim";
	lang.ptbr.no = "Não";
	lang.ptbr.yes_rec = "Sim (recomendado)";
	lang.ptbr.no_rec = "Não (recomendado)";
	lang.ptbr.yes_norec = "Sim (não recomendado)";
	lang.ptbr.no_norec = "Não (não recomendado)";


// CALENDARIO ----------------------------------------------------
	lang.ptbr.hours = "Horas";

	lang.ptbr.sunday = "Domingo";
	lang.ptbr.monday = "Segunda";
	lang.ptbr.tuesday = "Terça";
	lang.ptbr.wednesday = "Quarta";
	lang.ptbr.thursday = "Quinta";
	lang.ptbr.friday = "Sexta";
	lang.ptbr.saturday = "Sábado";
	lang.ptbr.holiday = "Feriado";

	lang.ptbr._sunday = "Dom";
	lang.ptbr._monday = "Seg";
	lang.ptbr._tuesday = "Ter";
	lang.ptbr._wednesday = "Qua";
	lang.ptbr._thursday = "Qui";
	lang.ptbr._friday = "Sex";
	lang.ptbr._saturday = "Sab";
	lang.ptbr._holiday = "Fer";

	// meses
	lang.ptbr.january = "Janeiro";
	lang.ptbr.february = "Fevereiro";
	lang.ptbr.march = "Março";
	lang.ptbr.april = "Abril";
	lang.ptbr.may = "Maio";
	lang.ptbr.june = "Junho";
	lang.ptbr.july = "Julho";
	lang.ptbr.august = "Agosto";
	lang.ptbr.september = "Setembro";
	lang.ptbr.october = "Outubro";
	lang.ptbr.november = "Novembro";
	lang.ptbr.december = "Dezembro";

	lang.ptbr._january = "Jan";
	lang.ptbr._february = "Fev";
	lang.ptbr._march = "Mar";
	lang.ptbr._april = "Abr";
	lang.ptbr._may = "Mai";
	lang.ptbr._june = "Jun";
	lang.ptbr._july = "Jul";
	lang.ptbr._august = "Ago";
	lang.ptbr._september = "Set";
	lang.ptbr._october = "Out";
	lang.ptbr._november = "Nov";
	lang.ptbr._december = "Dez";



//@end-escape


	// retorna string traduzida pelo dicionario
	function jlang(_label, _dict){
		if('undefined'==typeof(_dict)) _dict = lang.dict;
		if('object'!=typeof(lang)) return(_label);
		if('object'!=typeof(lang[_dict])) return(_label);
		if('undefined'==typeof(lang[_dict][_label])) return(_label);
		return(lang[_dict][_label]);
	}
	translate = language = jlan = jlang;

	// traducao multipla
	function jlangs(_words, _dict){
		if('undefined'==typeof(_dict)) _dict = lang.dict;
		if('object'!=typeof(lang)) return(_words); // sem objeto de linguagens
		if('object'!=typeof(lang[_dict])) return(_words); // sem objeto do idioma
		
		// quebrar frase
		var _a = stdlib.explode(' ', _words);
		var _r = '';
		for(var _k in _a){
			var _w = _a[_k];
			var _c = stdlib.substr(_w, 0, 1);
			if((_c=='$'||_c=='#') && 'undefined'!=typeof(lang[_dict][_w])) _w = lang[_dict][_w];
			_r = _r + ' ' + _w;
		}
		return stdlib.trim(_r);
	}

	// setar traducao direto no texto do DOMID
	function jlang_put(_domid, _label, _prestr, _posstr){
		var _dom = document.getElementById(_domid);
		if(!_dom) return;
		var _str = jlang(_label);
		if('undefined'!=typeof(_prestr)) _str = _prestr + _str;
		if('undefined'!=typeof(_posstr)) _str = _str + _posstr;
		_dom.innerHTML = _str;
	}

	// detectar necessidade de traducao automatica
	function jlang_detect(_str){
		if('string'==typeof(_str)) if(_str.substr(0,1)=='$') _str = jlang(_str.substr(1));
		return(_str);
	}

	// determinar qual label sera traduzido e inserido no DOM baseado no valor
	function jlang_list(_domid, _value, _list, _prestr, _posstr){
		_value = stdlib.toint(_value);
		var _label = _value;
		if('undefined'!=_list[_value]) _label = _list[_value];
		jlang_put(_domid, _label, _prestr, _posstr);
	}










//********************************************************************************************** PALETTE - color.js



/*

	funcoes para manipular cores

*/
palette = {
		
	// carrega dados da cor
	get: function(_color, _replace){
		// traduzir nome para cor
		_color = palette.translate(_color);
	
		// propriedades padroes
		var _obj = {
			rgba: '',				// sintaxe RGBA da cor
			rgb: '',				// sintaxe RGB da cor
			color: '#000000',		// cor web sem alpha
			fullcolor: '#000000', 	// cor web com alpha
			scolor: '#000',			// cor web curta (ou cor web normal 'color' quando nao possibilitar modo curto
			sfullcolor: '#0000',	// cor web curta com alpha
	
			ired: 0,				// vermelho
			hred: '00',
			igreen: 0,				// verde
			hgreen: '00',
			iblue: 0,				// azul
			hblue: '00',
	
			ialpha: 255,			// alpha
			halpha: 'ff',
			palpha: 100,			// porcentagem de alpha, 100=visivel, 0=invisivel
			falpha: 1				// pordentagem fracionada, de 0.1 (10%) a 1 (100%)
		
		};
		
		// interpretar _color
		_color = stdlib.str_replace('#', '', stdlib.trim(_color));
	
		var _len = stdlib.strlen(_color);
		switch(_len){
			case 6:
			case 8:
				// cor de 6 partes RR GG BB
				_obj.hred = _color.substr(0,2);
				_obj.hgreen = _color.substr(2,2);
				_obj.hblue = _color.substr(4,2);
				_obj.halpha = (_len==8?_color.substr(6,2):'00');
				break;
			case 3:
			case 4:
				// cor de 3 partes R G B
				_obj.hred = _color.substr(0,1); _obj.hred+=_obj.hred;
				_obj.hgreen = _color.substr(1,1); _obj.hgreen+=_obj.hgreen;
				_obj.hblue = _color.substr(2,1); _obj.hblue+=_obj.hblue;
				_obj.halpha = (_len==4?_color.substr(3,1):'0'); _obj.halpha+=_obj.halpha;
				break;
		}
		// IMPORTAR - converter HEX para inteiros
		_obj.ired = parseInt(_obj.hred, 16);
		_obj.igreen = parseInt(_obj.hgreen, 16);
		_obj.iblue = parseInt(_obj.hblue, 16);
		_obj.ialpha = parseInt(_obj.halpha, 16);
		_obj.palpha = ((100*_obj.ialpha)/255); _obj.palpha = _obj.palpha.toFixed(0);
		_obj.falpha = (_obj.palpha>0 ? (_obj.palpha / 100): 1); _obj.falpha = _obj.falpha.toFixed(2); if(_obj.falpha==1) _obj.falpha = 1;
	
		// sobrepor valores enviados no segundo parametros
		if('object'==typeof(_replace)){
			for(var _idx in _replace){
				var _v = _replace[_idx];
	
				// sincronizar variaveis paralelas
				switch(_idx){
					case 'ired':
						_v = stdlib.toint(_v);
						_obj.hred = _v.toString(16);
						if(stdlib.strlen(_obj.hred)==1) _obj.hred = '0'+_obj.hred;
						break;
					case 'igreen':
						_v = stdlib.toint(_v);
						_obj.hgreen = _v.toString(16);
						if(stdlib.strlen(_obj.hgreen)==1) _obj.hgreen = '0'+_obj.hgreen;
						break;
					case 'iblue':
						_v = stdlib.toint(_v);
						_obj.hblue = _v.toString(16);
						if(stdlib.strlen(_obj.hblue)==1) _obj.hblue = '0'+_obj.hblue;
						break;
					case 'ialpha':
						_v = stdlib.toint(_v);
						_obj.halpha = _v.toString(16);
						if(stdlib.strlen(_obj.hblue)==1) _obj.hblue = '0'+_obj.hblue;
	
						_obj.palpha = ((100*_v)/255);
						_obj.palpha = _obj.palpha.toFixed(0);
						
						_obj.falpha = (_obj.palpha>0 ? (_obj.palpha / 100): 1); _obj.falpha = _obj.falpha.toFixed(2);
						if(_obj.falpha==1) _obj.falpha = 1;
	
						break;
				}
				// exportar para valor oficial, enfim!
				_obj[_idx] = _v;
			}
		}
	
		// criar definicoes
		_obj.rgb  = 'rgb('+_obj.ired+','+_obj.igreen+','+_obj.iblue+')';
		_obj.rgba = 'rgba('+_obj.ired+','+_obj.igreen+','+_obj.iblue+','+_obj.falpha+')';
	
		_obj.color = '#'+_obj.hred+_obj.hgreen+_obj.hblue;
		_obj.scolor = _obj.color;
		_obj.fullcolor = _obj.color + _obj.halpha;
		_obj.sfullcolor = _obj.scolor  + (_obj.halpha.substr(0,1)==_obj.halpha.substr(1,1)?_obj.halpha.substr(0,1):'f');
	
		// cor curta
		if(_obj.hred.substr(0,1)==_obj.hred.substr(1,1) && _obj.hgreen.substr(0,1)==_obj.hgreen.substr(1,1) && _obj.hblue.substr(0,1)==_obj.hblue.substr(1,1)){
			_obj.scolor = '#'+_obj.hred.substr(0,1) + _obj.hgreen.substr(0,1) + _obj.hblue.substr(0,1);
			_obj.sfullcolor = '#'+_obj.hred.substr(0,1) + _obj.hgreen.substr(0,1) + _obj.hblue.substr(0,1) + _obj.halpha.substr(0,1);
		}
	
		//stdlib.debug("COLOR: "+_color+"["+_len+"]<br>"+stdlib.debugobj(_obj), true);
		return(_obj);
	},
	
	

	/*
		clarear ou escurecer uma cor, brilho passado entre -255 e 255,
		negativo para escurecer, positivo para clarear
	*/
	brightness: function(_color, _light){
		var _ilight = {
			red: 0,
			green: 0,
			blue: 0	
		};
		if('object'==typeof(_light)){
			// copiar separadamente o diferencial de brilho
			var _t = 0;
			for(var _idx in _light){
				_ilight[_idx] = stdlib.toint(_light[_idx]);
				if(_ilight[_idx]!=0) _t++;
			}
			if(!_t) return(_color);
		}else{
			_light = stdlib.toint(_light);
			if(_light==0) return(_color);
			for(var _idx in _ilight) _ilight[_idx] = _light;
		}
		
		// carregar cor
		var _l = stdlib.strlen(_color);
		var _c;
		if('object'==typeof(_color)){
			// copiar objeto para remover referencia de memoria
			_c = stdlib.objcopy(_color);
		}else{
			// cor enviada no formato texto normal
			_c = palette.get(_color);
		}
		//stdlib.debug("C {"+stdlib.debugobj(_c)+"}", true);
		
		// incrementar/decrementar brilho
		var _ired = _c.ired + _ilight.red;
		var _igreen = _c.igreen + _ilight.green;
		var _iblue = _c.iblue + _ilight.blue;
		
		// minimos
		if(_ired<0) _ired = 0;
		if(_igreen<0) _igreen = 0;
		if(_iblue<0) _iblue = 0;
		// maximos
		if(_ired>255) _ired = 255;
		if(_igreen>255) _igreen = 255;
		if(_iblue>255) _iblue = 255;
	
		// reconstruir
		var _new = palette.get(_c.fullcolor, {ired: _ired, igreen: _igreen, iblue: _iblue});
	
		//stdlib.debug("NEW {"+stdlib.debugobj(_new)+"}", true);
		
		// retornar no mesmo formato
		if('object'==typeof(_color)) return(_new);
		switch(_l){
			case 4: // #rgb
				return(_new.scolor);
				break;
			case 5: // #rgba
				return(_new.sfullcolor);
				break;
			case 7: // #rrggbb
				return(_new.color);
				break;
			case 9: // #rrggbbaa
				return(_new.fullcolor);
				break;
			default: // retornar sintaxe rgba
				return(_new.rgba);
				break;
		}
	},
	
	/*
		criar definicao CSS de gradient
	
	*/
	gradient: function(_config){
		var _df = {};
		/*
			tipos de gradiente
				horizontal: cores indo de cima para baixo de forma que formem linhas horizontais
				vertical: cores indo da esquerda para direita de forma que formem linhas verticais
		*/
		_df.type = 'horizontal';
		
		/*
			cores, requer no minimo 2
		*/
		_df.colors = {
			1: 'blue',
			2: 'red'
		};
		// copiar config
		var _new = _df;
		if('object'==typeof(_config)) for(var _idx in _config) _new[_idx] = _config[_idx];
		// reajustar tipos ao original
		for(var _idx in _new){
			var _tofa = typeof(_new[_idx]);
			var _tofb = typeof(_df[_idx]);
			if(_tofa!=_tofb) _new[_idx] = _df[_idx];
		}
		switch(_new.type){
			case 'horizontal':
			case 'vertical':
				break;
			default:
				_new.type = 'horizontal';
		}
		// contagem de cores
		if(stdlib.objcount(_new.colors)<2) _new.colors = _df.colors;
		// ordenar cores
		var _colors = {};
		var _first_color = '';
		var _c = 0;
		for(var _idx in _new.colors){
			var _color = palette.get(_new.colors[_idx]);
			_colors[_c] = _color.rgba;
			if(_first_color=='') _first_color = _color.color;
			_c++;
		}
		//stdlib.debug("GRADIENT: "+stdlib.debugobj(_new)+" COLORS="+stdlib.debugobj(_colors), true);
	
		var _css;
	
		// Old browsers
		_css = 'background: '+_first_color+';';
	
		// W3C
		_css+= 'background: linear-gradient(top, '+_colors[0]+' 0%,'+_colors[1]+' 100%);';
	
	
		// FF3.6+
		_css+= 'background: -moz-linear-gradient(top, '+_colors[0]+' 0%, '+_colors[1]+' 100%);';
	
	
	
		// Chrome,Safari4+
		_css+= 'background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,'+_colors[0]+'), color-stop(100%,'+_colors[1]+'));';
	
		// Chrome10+,Safari5.1+
		_css+= 'background: -webkit-linear-gradient(top, '+_colors[0]+' 0%,'+_colors[1]+' 100%);';
	
		// Opera11.10+
		_css+= 'background: -o-linear-gradient(top, '+_colors[0]+' 0%,'+_colors[1]+' 100%);';
	
	
		// IE10+
		_css+= 'background: -ms-linear-gradient(top, '+_colors[0]+' 0%,'+_colors[1]+' 100%);';
	
		// IE6-9
		_css+= "filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='"+_colors[0]+"', endColorstr='"+_colors[0]+"',GradientType=0 );";
	
		// construir definicao de background-image
		return(_css);
	
	},
	

	// traduzir nome da cor para cor RGB
	translate: function(_color){
		var _c = stdlib.strtolower(_color);
		switch(_c){
			case 'blue': return('#00f'); break;
			case 'red': return('#f00'); break;
			case 'green': return('#0f0'); break;
			case 'snow': return('#FFFAFA');
			case 'whitesmoke': return('#F5F5F5');
			case 'linen': return('#FAF0E6');
			case 'white': return('#FFFFFF');
			case 'black': return('#000000');
			case 'gray': return('#BEBEBE');
			case 'lightgray': return('#D3D3D3');
			case 'skyblue': return('#87CEEB');
			case 'cyan': return('#00FFFF');
			case 'lightcyan': return('#E0FFFF');
			case 'aquamarine': return('#7FFFD4');
			case 'darkgreen': return('#006400');
			case 'seagreen': return('#2E8B57');
			case 'yellowgreen': return('#9ACD32');
			case 'yellow': return('#FFFF00');
			case 'gold': return('#FFD700');
			case 'sienna': return('#A0522D');
			case 'peru': return('#CD853F');
			case 'beige': return('#F5F5DC');
			case 'wheat': return('#F5DEB3');
			case 'tan': return('#D2B48C');
			case 'chocolate': return('#D2691E');
			case 'brown': return('#A52A2A');
			case 'salmon': return('#FA8072');
			case 'orange': return('#FFA500');
			case 'darkorange': return('#FF8C00');
			case 'coral': return('#FF7F50');
			case 'tomato': return('#FF6347');
			case 'hotpink': return('#FF69B4');
			case 'pink': return('#FFC0CB');
			case 'maroon': return('#B03060');
			case 'violetred': return('#D02090');
			case 'magenta': return('#FF00FF');
			case 'violet': return('#EE82EE');
			case 'plum': return('#DDA0DD');
			case 'darkgray': return('#A9A9A9');
			case 'darkblue': return('#00008B');
			case 'darkcyan': return('#008B8B');
			case 'darkmagenta': return('#8B008B');
			case 'darkred': return('#8B0000');
			case 'lightgreen': return('#90EE90');
	
	
		}
		return(_color);
	}

};


//********************************************************************************************** components.js


// componente de testes
loopback_list = {};
function loopback_reply(_nid, _json){
//	stdlib.logit(stdlib.debugobj(_json));
}

// variaveis globais e configuracao mestre

/* ---------------------------------------------------------------------------------------------------------------- */

// valores padroes universais para motor generico cm_engine
cm_engine_globals = {
	store: 0,					// qualquer coisa armazenado pelo programador
	headers: {},				// cabecalhos padroes
	statuscode: {},				// funcoes de erros especificos para tipo de resposta
	method: 'POST',				// metodo padrao de postagem de parametros, GET ou POST

	// eventos globais
	onerror: false,				// funcao global para captura de erros HTTP

	// controle de requisicoes
	wait: 0,					// (float) tempo de espera antes de iniciar a tarefa (aguarda antes requsicao inicial)
	retries: 0,					// (int) numero de tentativas, inicializar com >0 para decrescer nas tentativas
	timeout: 0,					// (float) tempo a aguardar a resposta do servidor

	/* estatisticas globais
		.count = numero de requisicoes atendidas pelo servidor
		.timeout = numero de requisicoes em timeout
		.err = numero de erros do lado servidor (timeout, crash, etc...)
		.request = numero de requisicoes enviadas ao servidor
		.retries = numero de vezes que a requisicao foi repetida (retentativas)
		.lifetime = tempo de vida do motor desde sua criacao
		.download = numero de bytes recebidos
		.upload = numero de bytes enviados
	*/
	stats: {
		replies: 0,
		timeout: 0,
		err: 0,
		request: 0,
		retries: 0,
		maxretries: 0,
		lifetime: 0,
		download: 0,
		upload: 0
	}

};
/* ------------------------------------------------------------------------------- */

// obter objeto do componente
function cm_getcomponent(_xid, _cname){
	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	var _component = false;
	switch(_cname){
		case 'jchart': _component = 'object' == typeof(jchart_list[_nid]) ? jchart_list[_nid] : false; break;
		case 'jframe': _component = 'object' == typeof(jframe_list[_nid]) ? jframe_list[_nid] : false; break;
		case 'jframe_frm': _component = 'object' == typeof(jframe_frm_list[_nid]) ? jframe_frm_list[_nid] : false; break;
		case 'jmainmenu': _component = 'object' == typeof(jmainmenu_list[_nid]) ? jmainmenu_list[_nid] : false; break;
		case 'jgauge': _component = 'object' == typeof(jgauge_list[_nid]) ? jgauge_list[_nid] : false; break;
		case 'jmap': _component = 'object' == typeof(jmap_list[_nid]) ? jmap_list[_nid] : false; break;
		case 'jprogress': _component = 'object' == typeof(jprogress_list[_nid]) ? jprogress_list[_nid] : false; break;
		case 'jslider': _component = 'object' == typeof(jslider_list[_nid]) ? jslider_list[_nid] : false; break;
		case 'jsmenu': _component = 'object' == typeof(jsmenu_list[_nid]) ? jsmenu_list[_nid] : false; break;
		case 'jstab': _component = 'object' == typeof(jstab_list[_nid]) ? jstab_list[_nid] : false; break;
		case 'jstab_tabs': _component = 'object' == typeof(jstab_tabs_list[_nid]) ? jstab_tabs_list[_nid] : false; break;
		case 'jstree': _component = 'object' == typeof(jstree_list[_nid]) ? jstree_list[_nid] : false; break;
		case 'jtable': _component = 'object' == typeof(jtable_list[_nid]) ? jtable_list[_nid] : false; break;
		case 'ftable': _component = 'object' == typeof(ftable_list[_nid]) ? ftable_list[_nid] : false; break;
		case 'jsched': _component = 'object' == typeof(jsched_list[_nid]) ? jsched_list[_nid] : false; break;
		case 'jgrid': _component = 'object' == typeof(jgrid_list[_nid]) ? jgrid_list[_nid] : false; break;
		case 'jpage': _component = 'object' == typeof(jpage_list[_nid]) ? jpage_list[_nid] : false; break;
		case 'jwtable': _component = 'object' == typeof(jwtable_list[_nid]) ? jwtable_list[_nid] : false; break;
		case 'uajax': _component = 'object' == typeof(uajax_list[_nid]) ? uajax_list[_nid] : false; break;
		case 'jrpc': _component = 'object' == typeof(jrpc_list[_nid]) ? jrpc_list[_nid] : false; break;
		case 'ubuttons': _component = 'object' == typeof(ubuttons_list[_nid]) ? ubuttons_list[_nid] : false; break;
		case 'udialog': _component = 'object' == typeof(udialog_list[_nid]) ? udialog_list[_nid] : false; break;
		case 'uform': _component = 'object' == typeof(uform_list[_nid]) ? uform_list[_nid] : false; break;
		case 'uform_select': _component = 'object' == typeof(uform_select_list[_nid]) ? uform_select_list[_nid] : false; break;
		case 'uform_input': _component = 'object' == typeof(uform_input_list[_nid]) ? uform_input_list[_nid] : false; break;
		case 'unotify': _component = 'object' == typeof(unotify_list[_nid]) ? unotify_list[_nid] : false; break;
		case 'wide': _component = 'object' == typeof(wide_list[_nid]) ? wide_list[_nid] : false; break;
		case 'glib': _component = 'object' == typeof(glib_list[_nid]) ? glib_list[_nid] : false; break;
		case 'loopback': _component = 'object' == typeof(loopback_list[_nid]) ? loopback_list[_nid] : false; break;
	}
	//if(typeof(_component)!='object') stdlib.logit("FAILURE ON "+_xid+" / "+_cname);
	return _component;
}

// testar ancoragem do objeto, verifica se é fantasma
// caso ancoragem seja falsa, o objeto deve ser destruido
// 0 - ancoragem perdida
// 1 - ancoragem OK
// 2 - sem ancoragem mas operacional
function cm_anchored(_component){
	// ancoragem pelo DOMID
	if('string' == typeof(_component['domid']) && _component['domid'] != '')
		return stdlib.getdom(_component['domid']) ? 1 : 0;
	// ancorado em outro componente/documento
	if('string' == typeof(_component['anchor']) && _component['anchor'] != '')
		return stdlib.getdom(_component['anchor']) ? 1 : 0;
	return 2;
}
//xyz = '';
// executar evento armazenado no componente
function cm_event(_xid, _cname, _event_id, _default_return){
	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	// obter componente
	var _component = cm_getcomponent(_nid, _cname);
	if('object' != typeof(_component)) return _default_return;
	
	// retorno padrao
	if('undefined'==typeof(_default_return)) _default_return = true;

	// obter vento
	if('function'!=typeof(_component[_event_id])) return _default_return;

	var _fnc = _component[_event_id];
	var _ret = _fnc(_nid);
	if('undefined'==_ret) _ret = _default_return;
	return _ret;
}


// funcao de recepcao de dados
function cm_engine_reply(_xid, _cname){
	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	// obter componente
	var _component = cm_getcomponent(_nid, _cname);
	if('object' != typeof(_component)) return;

	var _dt = false;
	// coletar dados no formato a ser tratado
	switch(_component.loadmethod){
		case 'json': _dt = _component.json; break;
		case 'xml': _dt = _component.xml; break;
		case 'integer': _dt = _component.integer; break;
		case 'float': _dt = _component.float; break;
		// xhr / html / text
		default: _dt = _component.content; break;
	}

	// camada de interceptacao de dados recebidos e reescrita
	var _continue = true;
	if('function'==typeof(_component.ondatarx)){
		_dt = (_component.ondatarx(_nid, _dt));
		if('boolean'==typeof(_dt) && !_dt) return;
	}

	// funcao onreply do usuario
	_continue = true;
	if('function'==typeof(_component.onreply)){
		var _c = _component.onreply(_nid, _dt);
		if('boolean'==typeof(_c)) _continue = (_c);
	}
	if(!_continue) return;


	// funcao interna do componente
	switch(_cname){
		case 'jchart': jchart_reply(_nid, _dt); break;
		case 'jframe': jframe_reply(_nid, _dt); break;
		case 'jframe_frm': jframe_frm_reply(_nid, _dt); break;		
		case 'jmainmenu': jmainmenu_reply(_nid, _dt); break;
		case 'jgauge': jgauge_reply(_nid, _dt); break;
		case 'jmap': jmap_reply(_nid, _dt); break;
		case 'jprogress': jprogress_reply(_nid, _dt); break;
		case 'jslider': jslider_reply(_nid, _dt); break;
		case 'jsmenu': jsmenu_reply(_nid, _dt); break;
		case 'jstab': jstab_reply(_nid, _dt); break;
		case 'jstab_tabs': jstab_tabs_reply(_nid, _dt); break;
		case 'jstree': jstree_reply(_nid, _dt); break;
		case 'jtable': jtable_reply(_nid, _dt); break;
		case 'ftable': ftable_reply(_nid, _dt); break;
		case 'jsched': jsched_reply(_nid, _dt); break;
		case 'jgrid': jgrid_reply(_nid, _dt); break;
		case 'jpage': jpage_reply(_nid, _dt); break;
		case 'jwtable': jwtable_reply(_nid, _dt); break;
		case 'uajax': uajax_reply(_nid, _dt); break;
		case 'jrpc': jrpc_reply(_nid, _dt); break;
		case 'ubuttons': ubuttons_reply(_nid, _dt); break;
		case 'udialog': udialog_reply(_nid, _dt); break;
		case 'uform': uform_reply(_nid, _dt); break;
		case 'uform_select': uform_select_reply(_nid, _dt); break;
		case 'uform_input': uform_input_reply(_nid, _dt); break;
		case 'unotify': unotify_reply(_nid, _dt); break;
		case 'wide': wide_reply(_nid, _dt); break;
		case 'glib': glib_reply(_nid, _dt); break;
		case 'loopback': loopback_reply(_nid, _dt); break;
	}
}




// interromper motor do componente
function cm_engine_stop(_xid, _cname){
	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	var e;
	var _component = cm_getcomponent(_nid, _cname);
	if('object'!=typeof(_component)) return(false);
	if('object'==typeof(_component.xhttp)) try{ _component.xhttp.abort(); } catch(e){}
	_component.xhttp = false;
	_component.xstatus = 0;
	return true;
}

// play da reqsuicicao
function cm_engine_play(_xid, _cname){

//DEBUG   stdlib.logit("Played "+_xid);

	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	var _component = cm_getcomponent(_nid, _cname);
	if('object'!=typeof(_component)){
		//DEBUG   stdlib.logit("Played failure on "+_xid+" cname="+_cname);
		return(false);
	}

	if('undefined'==typeof(_component.wait)) _component.wait = 0;

	// tempo de espera para disparo
	var _wait = stdlib.sec2ms(_component.wait);

	// zerar estatisticas ao ligar motor
	_component.stats = {
		replies: 0,
		timeout: 0,
		err: 0,
		request: 0,
		retries: 0,
		maxretries: 0,
		lifetime: 0,
		download: 0,
		upload: 0
	};

//DEBUG   stdlib.logit("cm_engine_play("+_xid+", "+_cname+")");

	if(_wait){
		// disparo retardado
		if(_component.jstimer_wait) window.clearTimeout(_component.jstimer_wait);
//DEBUG   stdlib.logit("Play with wait "+_nid);
		_component.jstimer_wait = window.setTimeout("cm_engine_inside_request("+_nid+", '"+_cname+"')", _wait);
	}else{
		// disparo imediato
//DEBUG   stdlib.logit("Play DIRECT "+_nid);
		cm_engine_request(_nid, _cname);
	}
	return _nid;
}

// envio de informacao temporaria
function cm_engine_send(_xid, _cname, _tdata){
	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	var _component = cm_getcomponent(_nid, _cname);
	if('object'!=typeof(_component)) return(false);

	// objeto a ser enviado como dados temporarios
	var _temp_data = {};

	// tdata presente no componente
	if('object'==typeof(_component.tdata)) _temp_data = stdlib.unlink(_component.tdata);

	// agregar tdata enviada nesse funcao

	// tdata informado, gravar no motor
	if('object'==typeof (_tdata))
		for(var _tx in _tdata)
			_temp_data[_tx] = stdlib.unlink(_tdata[_tx]);

	// devolver tdata
	_component.tdata = (_temp_data);

	// disparar contra servidor
	cm_engine_request(_nid, _cname);
}



// propriedades basicas para operar remotamente
function cm_engine_std(){
	// instalar propriedades basicas para operacao com motor
	var _defaults = {
		agent: 'uAjaxCM',			// nome do componente no lado cliente
		
		// ancoragem e instalacao
		anchor: '',					// ancora, se o DOM com esse ID deixar de existir o motor morre automaticamente
		domid: '',					// dom de instalacao do conteudo obtido

		cleanup: false,				// destruir componente quando atividades encerrarem?
		errno: 0,					// codigo do erro durante execucao
		datatype: '',				// tipo de conversao da resposta, padrao: text. Opcoes: text/xhr,float,integer,xml,json

		// conteudo de retornos remotos
		content: "",				// conteudo obtido remotamente, padro para datatype = text
		// o conteudo será convertido de acordo com o tipo de 'datatype' em:
		json: false,				// objeto JSON
		xml: false,					// objeto XML
		integer: 0,					// numero inteiro
		float: 0.0,					// numero de ponto flutuante

		// quando datatype = text/xhr, procurar tag SCRIPT e executa o codigo transportado com eval
		exec: true,
		inner: true,				// aplicar texto obtido dentrod e domid?
		seqid: 0,					// numero sequencial para controle de requisicoes

		// controle de cache
		cache: false,				// permitir cache? RECOMENDAVEL: FALSE
		cachetime: 0,				// se cache=true, cachetime determina o tempo para manter em cache (segundos)
		cache_id: 0,				// id de cache
		cache_expire: 0,			// timestamp unix de quando o cache expira
		/*
			flag para ignorar conteudo repetido
			modified compara o conteudo recebido com o anterior
				false - todos os eventos de processamento de dados serão processados mesmo sendo igual
				true  - so irá disparar eventos de processamento de dados se as informacoes enviadas
						forem diferentes da ultima resposta
		*/
		modified: true,
		// keepalive: -1,	// -1 = nao mexer, 0/false = nao, 1/true = sim

		// controle de cabeçalhos
		headers: {},				// cabecalhos a serem enviados

		// tipo do cabecalho Content-Type - application/x-www-form-urlencoded
		contentType: 'application/x-www-form-urlencoded',
		charset: 'UTF-8',
		/*
		jQuery: contentType: "application/x-www-form-urlencoded; charset=UTF-8"
		contentType: "application/x-www-form-urlencoded; charset=UTF-8"
		areq.setRequestHeader("Content-Type","application/x-javascript; charset:ISO-8859-1"); 		
		try { 
			response.setCharacterEncoding("UTF-8"); 
			response.getWriter().write("this._data = " + js + ";"); 
			response.flushBuffer(); 
		} catch (Exception e) { 
			// ignore exception here 
		} 
		http_request.overrideMimeType('text/xml; charset=iso-8859-1');
		if (http_request.overrideMimeType) {  
			http_request.overrideMimeType('text/xml; charset=iso-8859-1');  
		}
		*/
		
		// eventos
		onplay: false,				// funcao a executar (sempre) antes de disparar o motor contra o servidor
		onstatuschange: false,		// funcao a executar quando o status do objeto xhr mudar
		ontimeout: false,			// funcao a executar quando o servidor remoto nao responder
		onretry: false,				// funcao a executar antes de tentar nova requisicao com o servidor
		onerror: false,				// funcao a executar quando houver erro na requisicao
		onreply: false,				// funcao apos receber retorno do conteudo remoto com sucesso
		ondestroy: false,			// funcao a executar quando o motor for finalizado, antes da destruicao em si
		onpause: false,				// funcao a executar quando o motor entrar em modo pause
		onrepeatover: false,		// funcao a executar quando repeat atingido
		ondatarx: false,			// funcao de traducao de dados recebidos

		// objeto do motor XHR
		http_status: 0,
		xhttp: false,				// var que contera objeto XmlHttpRequest
		method: 'POST',				// metodo de postagem de parametros, GET ou POST

		// array ou objeto de parametros submetidos
		data: false,				// objeto com parametro:valor a ser enviado (via GET ou POST, depende de .method
		edata: false,				// semelhante a 'data', usado para auxilio em refresh do objeto sem reescrita do 'data'
		tdata: false,				// dados extras a serem enviados uma unica vez (temporario)

		// alvo remoto a ser requisitado (URN), nao pode conter um dominio/ip/porta diferente
		url: "",					// url dos metodos: xhr, iframe
		query_string: "",			// INTERNA: string completa de requisicao GET (url com querystring)
		post_string: "",			// INTERNA: string completa de requisicao POST (apenas variaveis de data, edata e tdata)

		// modo XHR sincrono/assincrono
		async: true,

		// controle para pemitir stop/start do motor
		xstatus: 0,					/*	controle de stop/start
										0=nao iniciado
										1-4 - status xhttp/XHR
										5 - servico concluido
										6 - evento onstatechange impediu continuacao
										7=pausado
										8=pausado aguardando wait (tempo de pause)
										9=parado
										10 - reposta http invalida recebida pelo servidor
										11 - ancora desconectada
										12 - motor parado em transito
									*/

		// codico http da ultima resposta do servidor
		statuscode: false,

		// controle de requisicoes
		wait: 0,					// (float) tempo de espera antes de iniciar a tarefa (aguarda antes requsicao inicial)
		pause: 0,					// (float) tempo de espera apos pause antes de reiniciar o motor
		interval: 0,				// (float) intervalo de re-carregamento automatico para metodo xhr
		repeat: 0,					// (int) numero limite de requisicoes a serem solicitadas no servidor a cada .interval
		retries: 0,					// (int) numero de tentativas, inicializar com >0 para decrescer nas tentativas
		timeout: 0,					// (float) tempo a aguardar a resposta do servidor, se demorar mais do que timeout, o motor considera que o servidor esta com problemas
		ping: 0,					// tempo em milisecundos que o servidor demorou para responder

		// variaveis internas
		process: 0,					// flag de sinalizacao de processamento XHR ativo, 0=nao esta em execucao, 1=em execucao

		// controle de tempo
		lifetime: 0,				// (float) se definido, determina o tempo de vida do motor em ms a partir da requisicao

		starttime: 0,				// microtimetamp do momento de criacao do motor
		stoptime: 0,				// microtimestamp do momento em que o motor parou (trabalho concluido)
		playtime: 0,				// microtimestamp do momento em que a requisicao foi criada
		endtime: 0,					// microtimestamp do momento em que a requisicao foi finalizada
		lastreply: 0,				// microtimestamp da ultima resposta do servidor remoto (statuschange)

		// CONTROLE INTERNO
		stats: {
			replies: 0,
			timeout: 0,
			err: 0,
			request: 0,
			retries: 0,
			maxretries: 0,
			lifetime: 0,
			download: 0,
			upload: 0
		},					/* objeto com estatisticas:
										.replies: numero de requisicoes atendidas pelo servidor
										.timeout: numero de requisicoes em timeout
										.err: numero de erros do lado servidor (timeout, crash, etc...)
										.request: numero de requisicoes enviadas ao servidor
										.retries: numero de vezes que a requisicao foi repetida (retentativas)
										.lifetime: tempo de vida do motor desde sua criacao
										.download: numero de bytes recebidos
										.upload: numero de bytes enviados
									*/

		// variaveis internas para controle de intervalo e timeout em javascript setTimeout e setInterval
		jstimer_wait: 0,			// tempo de aguardo para iniciar motor  - TIMEOUT
		jstimer_interval: 0,		// tempo de aguardo entre requisicoes repetitivas via .interval - TIMEOUT
		jstimer_lifetime: 0,		// tempo de aguardo antes de destruir o motor por lifetime maximo - TIMEOUT
		jstimer_pause: 0,			// tempo de aguardo em pause antes de reinciair motor - TIMEOUT
		jstimer_timeout: 0			// tempo de aguardo ate o tempo limite de timeout (sem resposta) - TIMEOUT

	};
	
	// forcar parametros globais nas opcoes padroes
	for(var _ix in cm_engine_globals) _defaults[_ix] = (cm_engine_globals[_ix]);
	
	// zerar stats
	//for(var _jx in _defaults.stats) _defaults.stats[_jx] = 0;

	return _defaults;
}

// funcao de play a ser armazenada no setTimeout, o LIXO do internet explorer ferra tudo se voce chamar a funcao direta
function cm_engine_inside_request(__nid, __cname){
	var _nid = (__nid);
	var _cname = (__cname);
	cm_engine_request(_nid, _cname);
}

// recebe objeto do componente, cria o esquema de requisicao e dispara o motor,
// retornando objeto com propriedades atualizadas
// retorna:
// 		0		requisicao criada com sucesso
//		1		erro, componente nao existe
//		2		erro, componente perdeu ancoragem
//		3		erro, onplay cancelou a requisicao
//		4		erro, impossivel criar motor XHR
//		5		erro, onstatuschange cancelou a requisicao
//		6		erro, sem URL
//
function cm_engine_request(_xid, _cname){
	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

//DEBUG   stdlib.logit("Request start "+_nid);

	// obter componente
	var _component = cm_getcomponent(_nid, _cname);
	if('object' != typeof(_component)){
//DEBUG   stdlib.logit("REQUEST FAILURE "+_nid);

		_component.errno = 1001;
		return 1;
	}

	// testar ancoragem do componente
	if(!cm_anchored(_component)){
//DEBUG   stdlib.logit("Request anchored failure on "+_nid);

		_component.xstatus = 11;	// sem ancora
		_component.errno = 1002;
		return 2;
	}

//DEBUG   stdlib.logit("cm_engine_request("+_xid+", "+_cname+") called");

	// instalar propriedades ausentes
	var _std = cm_engine_std();
	for(var _idx in _std) if('undefined' == typeof(_component[_idx])) _component[_idx] = _std[_idx];
	
// CRITICAS

	// resolver conflito entre datatype e loadmethod
	// _component.datatype
	var _mt = '';
	if('string' == typeof(_component['loadmethod']) && _component.loadmethod != '') _mt = _component['loadmethod'];
	if('string' == typeof(_component['datatype']) && _component.datatype != '') _mt = _component['datatype'];
	_component.loadmethod = _component.datatype = _mt;

	// metodo http
	if(_component.method!='POST' && _component.method != 'post' && _component.method != 'p'  && _component.method != 'P')
		_component.method = 'GET';

//DEBUG  stdlib.logit("XID="+_xid+" repeat="+_component.repeat+" interval="+_component.interval);

	// interromper motor caso esteja ativo
	if('object'==typeof(_component.xhttp)) try{ _component.xhttp.abort(); } catch(e){}
	_component.xhttp = false;

	// invocar evento onplay, capaz de abortar a requisicao
	if('function' == typeof(_component['onplay']) ){
		var _op = _component.onplay(_nid);
		var _tof = typeof(_op);
		if('boolean'==_tof && !_op){
//DEBUG   stdlib.logit("Request onplay failure on "+_nid);

			_component.errno = 1003;
			return 3;
		}
		// onplay retornou objeto, agregar a propriedade tdata
		if(_tof == 'object') _component.tdata = stdlib.unlink(_op);
	}

	// marcar tempo da requisicao inicial
	if(!_component.starttime) _component.starttime = stdlib.utime();

	// numero de sequencia da requisicao
	_component.seqid++;

	// destruir sistema de cronometros de timeout/repeat
	cm_engine_untimer(_nid, _cname);

	// criar MOTOR
	_component.xhttp = false;
	_component.xhttp = stdlib.newAjax();
	_component.xhttp.xstatus = 0;
	if(!_component.xhttp){
		_component.errno = 1004;
		return 4;
	}

// controle de cache -c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c-c
	if(!_component.cache){
		// cache desativado, otimo!, enviar sempre chave baseada em tempo
		// para impedir que o navegador consiga armazenar no cache
		_component.cache_id = stdlib.microtime();
	}else{
		// cache ativo..., perigoso, mas fazer o que né...
		// id inicial
		if(!_component.cache_id) _component.cache_id = stdlib.microtime();

		// caso expiracao determinada, calcular id para caso expirado
		if(_component.cachetime){
			// expiracao ativa...
			if(!_component.cache_expire){
				// sem expiracao marcada, primeira vez, apenas preencher timestamp de expiracao
				_component.cache_expire = stdlib.time() + _component.cachetime;

			}else{
				// tempo de expiracao ja marcado, verificar se expirou
				if(_component.cache_expire <= stdlib.time()){
					// expirou, renovar id e data de expiracao
					_component.cache_id = stdlib.microtime();
					_component.cache_expire = stdlib.time() + _component.cachetime;
				//}else{
				// nao expirou ainda
				}
			}
			_component.cache_id = stdlib.microtime();
		//}else{
		// sem cachetime, manter id eternamente!!!
		}
	}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

	// sequencia de query-string (independe de metodo)
	var _get_vars = {};
	var _data_vars = {};

	// anexar id de cache
	_get_vars.nocache = _component.cache_id;

	// enviar seqid apenas se cache desativado, senao vai impedir o funcionamento do cache
	if(!_component.cache) _get_vars.seqid = _component.seqid;

	// sid e nid
	_get_vars.nid = _nid;
	_get_vars.sid = _component.sid;

	// domid e anchor
	if(_component.domid!='') _get_vars.domid = _component.domid;
	if(_component.anchor!='') _get_vars.anchor = _component.anchor;

	// nome do componente e nome do agente
	_get_vars.agent = _component.agent;

	// copiar data e tdata para _data_vars
	if(_component.data) for(var _dx in _component.data) _data_vars[_dx] = _component.data[_dx];
	if(_component.edata) for(var _dx in _component.edata) _data_vars[_dx] = _component.edata[_dx];
	if(_component.tdata) for(var _dx in _component.tdata) _data_vars[_dx] = _component.tdata[_dx];

	// fechar strings
	// obj2uri = encodeURIComponent
	// obj2qs = escape
	//- var _get_string = stdlib.obj2qs(_get_vars);
	//- var _data_string = stdlib.obj2qs(_data_vars);
	var _get_string  = stdlib.obj2uri(_get_vars);
	var _data_string = stdlib.obj2uri(_data_vars);

	// enviar tudo na URL se o metodo for GET
	if(_component.method == 'GET') _get_string += '&' + _data_string;

	// montar URL do pedido
	var _url = _component.url;

	if(_url==''){
		_component.errno = 1006;
		return 6;
	}

	/* construir .request_string */
	if((_url.indexOf('?',0)===-1?false:true)){
		/* possui '?' , colocar &nocache=nnnnnn */
		_url = _url + "&" + _get_string;
	}else{
		/* NAO possui '?' , colocar ?nocache=nnnnnn */
		_url = _url + "?" + _get_string;
	}
//DEBUG   stdlib.logit("URL=["+_url+"]");

	// armazenar para informacoes
	// ambos os metodos - GET e POST
	_component.query_string = _url;

	// metodo POST
	_component.post_string = '';
	if(_component.method == 'POST') _component.post_string = _data_string;

	// disparar state change zero
	// caso funcao do usuario desative a execucao com um FALSE, aborta continuacao
	if('function' == typeof(_component['onstatuschange']) ){
		var _op = _component.onstatuschange(_nid);
		if('boolean'==typeof(_op) && !_op){
//DEBUG   stdlib.logit("Request onstatuschange failure on "+_nid);

			_component.xhttp.xstatus = 6;
			_component.errno = 1005;
			return 5;
		}
	}

/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=- */

	// Criar funcao de camada / retorno
	var _callback_str = '_callback_fnc = function(){ cm_engine_xhr_reply('+_nid+', "'+_cname+'"); }';
	_callback_fnc = eval(_callback_str);
	_component.xhttp.onreadystatechange=_callback_fnc;

	// dar partida / ignicão
	_component.xhttp.open(_component.method, _url, _component.async);

	// registrar cabecalhos
	if('object' == typeof(_component.headers)){
		stdlib.setHeaders(_component.xhttp, _component.headers);
	}

// --------------------------------------------

	// enviar cabecalho de tipo
	var _contentType = '';
	var _ct = (_component.contentType);
	var _cs = (_component.charset);
	if(_ct!=''||_cs!=''){
		_contentType = (_ct=='' ? 'application/x-www-form-urlencoded' : _ct);
		if(_cs!='') _contentType += '; charset='+stdlib.strtoupper(_cs);
	}
	if(_contentType)
		try{ _component.xhttp.setRequestHeader("Content-type", _contentType); }catch(e){}
	//stdlib.logit("ContentType=["+_contentType+"]");

// --------------------------------------------
	// disparar motor contra o servidor
	if(_component.method=='POST'){
		// enviar cabecalho de tipo
		//-if(_component.contentType!='')
		//-	try{ _component.xhttp.setRequestHeader("Content-type", _component.contentType); }catch(e){}
		
		// enviar em modo POST
		try{ _component.xhttp.send(_data_string); }
		catch(e){
			// erro no send
			_component.errno = 70;
			_component.stats.err++;
			if(stdlib.isfunction(_component.onerror)) _component.onerror(_nid, 70, 'xhttp.send.post.try_error');
		}
	}else{
		// enviar tudo na string via GET
		// o imbecil do internet explorer nao suporta false com parametro de send()
		try{ _component.xhttp.send(null); }
		catch(e){
			// erro no send
			_component.errno = 71;
			_component.stats.err++;
			if(stdlib.isfunction(_component.onerror)) _component.onerror(_nid, 71, 'xhttp.send.get.try_error');
		}
	}

	// contador de requisicoes enviadas
	_component.stats.request++;
	_component.playtime = stdlib.microtime();

	// iniciar contador de timeout
	cm_engine_timeout(_nid, _cname, 1);

	_component.errno = 0;

//DEBUG   stdlib.logit("Request SENDED TO SERVER on "+_nid+" seqid="+_component.seqid);

	return(true);
}





/* -------------------------------- CONTROLE DE TEMPO, TIMEOUT e INTERVALOS ----------------------------------------------- */



// dar pause em motor
function cm_engine_pause(_xid, _cname, _pause){
	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	var _component = cm_getcomponent(_nid, _cname);
	if('object'!=typeof(_component)) return;

	// motor morto....
	if(typeof(_component)!='object') return(false);

	var _mpause = 0;
	_pause = stdlib.toint(_pause);
	
	// parar motor HTTP
	cm_engine_stop(_nid);
	
	// destruir todos os temporizadores, eles deverao ser reconstruidos durante o proximo play
	cm_engine_untimer(_nid, _cname);
	
	// marcar status de pause
	_component.xstatus = 7;
	
	// caso tempo de pause especificado, iniciar timeout
	_mpause = stdlib.sec2ms(_pause);
	if(_mpause>0){
		// pausado aguardando wait
		_component.xstatus = 8;

		// salvar tempo de pausa
		_component.pause = _pause;

		// esperar para iniciar
		_component.jstimer_pause = window.setTimeout("cm_engine_inside_request("+_nid+", '"+_cname+"')", _mpause);

	}
	// disparar onpause
	cm_event(_nid, _cname, 'onpause');
}


// ------------------------------------------------------------------------------

// controle de tempo

// remover temporizadores
function cm_engine_untimer(_xid, _cname){
	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	var _component = cm_getcomponent(_nid, _cname);
	if('object'!=typeof(_component)) return;

	if(_component.jstimer_wait) window.clearTimeout(_component.jstimer_wait);
	if(_component.jstimer_interval) window.clearTimeout(_component.jstimer_interval);
	if(_component.jstimer_lifetime) window.clearTimeout(_component.jstimer_lifetime);
	if(_component.jstimer_pause) window.clearTimeout(_component.jstimer_pause);
	if(_component.jstimer_timeout) window.clearTimeout(_component.jstimer_timeout);
}

/*
Controle de timeout
	- nid: id do processo
	- act: 0=parar, 1=iniciar, 2=verificar
	
*/
function cm_engine_inside_timeout(__nid, __cname, __act){
	var _nid = (__nid);
	var _act = (__act);
	var _cname = (__cname);
	cm_engine_timeout(_nid, _cname, _act);
}

// analise de timeout
function cm_engine_timeout(_nid, _cname, _act){
	var _component = cm_getcomponent(_nid, _cname);
	if('object'!=typeof(_component)) return;

	// parar
	if(_component.jstimer_timeout) window.clearTimeout(_component.jstimer_timeout);
	
	// parar e pronto!
	if(!_act) return;

	var _wtimeout = stdlib.sec2ms(_component.timeout);
	var _chkinterval = false;
	switch(_act){
		case 1:
			// iniciar
			if(_wtimeout>0)
				_component.jstimer_timeout = window.setTimeout("cm_engine_inside_timeout("+_nid+", '"+_cname+"', 2)", _wtimeout);

			break;
		case 2:
			// quando chega aqui, é porque ja ultrapassou o timeout
			// pois a parte de status=4 do XHR finaliza o timeout automaticamente

			_component.stats.timeout++;
			cm_engine_globals.stats.timeout++;

			// parar o motor, a resposta nao interessa mais
			cm_engine_stop(_nid);

			// tentar novamente pela .retries
			if(cm_engine_retry(_nid)){
				// tentar novamente
				var _ret = cm_event(_nid, _cname, 'onretry', true);
				if(_ret){
					// nao executar interval, o reply do proximo motor se encarregará disso
					_chkinterval = false;
					cm_engine_request(_nid, _cname);
				}else{
					// verificar necessidade de executar interval
					_chkinterval = true;
				}

			}else{
				// incapaz de tentar novamente
				// evento ontimeout
				cm_event(_nid, _cname, 'ontimeout');

				// verificar necessidade de executar interval
				_chkinterval = true;

			}

			// verificar possibilidade de play em interval
			if(_chkinterval) cm_engine_interval(_nid, _cname);

			break;
	}

}


/* verificacao de repeticao ---------------------------------------------------- */

// verificar se é possivel fazer repeticao da requisicao
function cm_engine_retry(_nid, _cname){

//DEBUG   stdlib.logit("Retry start on "+_nid);

	var _component = cm_getcomponent(_nid, _cname);
	if('object'!=typeof(_component)){
		//DEBUG   stdlib.logit("Retry failure, component not found on "+_nid);

		return;
	}

	// se retries desativado, retornar false
	if(!_component.retries){
		return(false);
	}
	_component.stats.retries++;

	if(_component.stats.retries >= _component.retries){
		// atingiu limite de tentativas

		// contador global
		cm_engine_globals.stats.maxretries++;
		
		// zerar contador local
		_component.stats.retries = 0;
		
		// verificar autolimpeza
		cm_engine_autoclean(_nid, _cname);
		
		return(false);
	}else{
		// incrementar tentativas
		_component.stats.retries++;
		cm_engine_globals.stats.retries++;

		// nao ultrapassou, permitir repeticao
		return(true);
	}

}


/* inicia cronometro para gerenciamento de intervalo entre pedidos */
function cm_engine_interval(_xid, _cname){
	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	var _component = cm_getcomponent(_nid, _cname);
	if('object'!=typeof(_component)) return;
	var _ac;

//DEBUG  stdlib.logit("INTERVAL start on "+_nid+" interval="+_component.interval+" repeat="+_component.repeat);

	// exterminar intervalo existente
	if(_component.jstimer_interval) window.clearTimeout(_component.jstimer_interval);

	// analise de evento onrepeatover
	if(_component.repeat && (_component.repeat == _component.stats.replies)){
		// evento ao atingir repeat limit
		//DEBUG  stdlib.logit("INTERVAL OVER repeated="+_component.repeat+" replies="+_component.stats.replies);
		cm_event(_nid, _cname, 'onrepeatover');			
	}

	// analise de motor auto-limpavel, retorna >= 1 se o componente foi destruido
	_ac = cm_engine_autoclean(_nid, _cname);
	if(_ac) return;

	// tempo da proxima solicitacao
	var _itime = stdlib.sec2ms(_component.interval);

	// analise de interval ativo
	if(_itime > 0){
		// analise de vezes que foi executado quando repeat presente
		if(!_component.repeat || (_component.repeat > _component.stats.replies)){
			// solicitar nova criacao do motor!
			// esperar para iniciar
			_component.jstimer_interval = window.setTimeout("cm_engine_inside_request("+_nid+", '"+_cname+"')", _itime);
		}
	//}else{
		//DEBUG  stdlib.logit("INTERVAL itime ERROR");
	}

	
}




























// ------------------------------------------------------------------------------

	function cm_engine_inside_xhr_reply(__xid, __cname){
		var _xid = (__xid);
		var _cname = (__cname);
		cm_engine_xhr_reply(_xid, _cname);
	}

	/* retorno de objeto xhr dinamico */
	function cm_engine_xhr_reply(_xid, _cname){
		var _nid = _xid;
		if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

//@DEBUG-START
//DEBUG stdlib.logit("Reply start on ("+_xid+", "+_cname+")");
//@DEBUG-END

		// obter componente
		var _component = cm_getcomponent(_nid, _cname);
		if('object' != typeof(_component)) return false;

//DEBUG stdlib.logit("cm_engine_xhr_reply("+_xid+", "+_cname+") continue 1");

		// analise de motor zumbi
		if(!cm_anchored(_component)){
			// para motor
			_component.xstatus = 11;	// sem ancora
			_component.xhttp.onreadystatechange=false;
			cm_engine_stop(_nid, _cname);

			_component.errno = 20001;

//@DEBUG-START
//DEBUG stdlib.logit("cm_engine_xhr_reply("+_xid+"["+typeof(_xid)+"], cname="+_cname+") anchored failure");
//@DEBUG-END

			// abortar continuacao
			return false;
		}

//DEBUG stdlib.logit("cm_engine_xhr_reply("+_xid+", "+_cname+") continue 2");

		// motor assassinado previamente
		if('object'!=typeof(_component.xhttp)){
			_component.xstatus = 12;	// motor parado em transito

			_component.errno = 20002;
//@DEBUG-START
//DEBUG stdlib.logit("cm_engine_xhr_reply("+_xid+"["+typeof(_xid)+"], cname="+_cname+") engine failure");
//@DEBUG-END

			return;
		}

//DEBUG stdlib.logit("cm_engine_xhr_reply("+_xid+", "+_cname+") continue 3");

		// * Iniciar tratamento do retorno
		var _rs = _component.xhttp.readyState;
		var http_status = 0;
		_component.xhttp.xstatus = _rs;

		// atualizar ultima resposta do xhttp
		_component.lastreply = stdlib.microtime();

		// invocar evento de alteracao de status, reposta FALSE do programador aborta a continuacao
		if(!cm_event(_nid, _cname, 'onstatuschange', true)){
			_component.xhttp.xstatus = 6;
			_component.errno = 20003;
//@DEBUG-START
//DEBUG stdlib.logit("cm_engine_xhr_reply("+_xid+"["+typeof(_xid)+"], cname="+_cname+") onstatuschange aborted");
//@DEBUG-END

			return;
		}

//DEBUG stdlib.logit("cm_engine_xhr_reply("+_xid+", "+_cname+") continue 4 FINAL rs="+_rs);


		// processar resposta
		// 0 - unset
		// 1 - prepare
		// 2 - follow headers
		// 3 - receive start
		// 4 - body done
		switch(_rs){
			case 0:
			case 1:
			case 2:
			case 3:
				return;
				break;
			case 4:	// corpo do documento recebido


				// servidor respondeu
				_component.stoptime = stdlib.microtime();
				_component.ping = _component.stoptime - _component.playtime;

				// finalizar cronometro de timeout e
				// finalizar todos os cronometros
				cm_engine_untimer(_nid, _cname);


// -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
// processar protocolo HTTP - status da resposta
				http_status = _component.xhttp.status;
				_component.http_status = stdlib.unlink(http_status);

//@DEBUG-START
//stdlib.logit("REPLIED ("+_xid+") ping="+_component.ping+" status="+http_status);
//@DEBUG-END

				// analise de resposta recebida com sucesso
				if(http_status==200){
					var _process_data = true;
					
					// avaliar alteracao de dados
					if(_component.modified){
						// comparar textos
						if(_component.content==_component.xhttp.responseText)
							_process_data = false;
					}

					// destruir dados temporarios
					_component.tdata = false;

					// contar respostas apenas quando atendidas com sucesso
					_component.stats.replies++;
					//cm_engine_globals.stats.replies++;

					// executar processamento dos dados recebidos
					if(_process_data){
						// analise por tipo de dado desejado
						switch(_component.datatype){
							case 'json':
								_component.json = {};
								if(_component.xhttp.responseText!=''){
									try {
										_component.json = stdlib.json_parser(_component.xhttp.responseText);
									} catch(e){
										_component.json = {};
										_component.content = _component.xhttp.responseText;
									}
								}
								break;
							case 'xml':
								_component.xml = _component.xhttp.responseXML;
								break;
							case 'integer':
								_component.integer = stdlib.toint(_component.xhttp.responseText);
								break;
							case 'float':
								_component.float = stdlib.tofloat(_component.xhttp.responseText);
								break;
							case 'xhr':
								break;
							default:
								// texto html/text
								_component.datatype = 'html';
								break;
						}
						
						// armazenar o texto em modos html e com verificacao de modified
						if(_component.modified ||
							_component.datatype == 'html' || _component.datatype == 'xhr' || _component.datatype == 'text')
							_component.content = _component.xhttp.responseText;

						// evento mestre de recepcao de dados
						// - ANTES DE JRPC:
						// cm_engine_reply(_nid, _cname);
					}

					// preencher DOMID com o conteudo obtido do site
					if(_component.inner)
						if(_component.domid!='')
							if(_process_data)
								stdlib.set_html(_component.domid, _component.xhttp.responseText);
							//-
						//-
					//-
					// codigo RPC javascript				
					if(_process_data)
						if(_component.exec)
							stdlib.js_run(_component.xhttp.responseText);

					// funcao de reply do componente - apos implementacao de JRPC
					if(_process_data)
						cm_engine_reply(_nid, _cname);
					//-

					// status de solicitacao atendida
					_component.xstatus = 5;
				
				// if = 200
				}else{
					// resposta invalida no ponto de vista da informacao
					_component.xstatus = 10;
					// reportar erro
					if(stdlib.isfunction(_component.onerror)) _component.onerror(_nid, http_status, 'http_error');
				}
				// analise de funcoes para tratamento por tipo de resposta
				cm_engine_statuscode(_nid, _cname, http_status);

// -~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~

				// aniquilar motor encerrado
				cm_engine_stop(_nid, _cname);

				// processamento de interval
				cm_engine_interval(_nid, _cname);

				break;
		}
	}



// analisar eventos globais cadastrados pelo codigo
function cm_engine_statuscode(_nid, _cname, _status){
	var _fnc;
	if('function'==typeof(cm_engine_globals.statuscode[_status])){
		_fnc = cm_engine_globals.statuscode[_status];
		_fnc(_nid, _cname, _status);
	}
}


// analiquilar componente desnecessario?
// retorno:
//		1-x		-	componente nao existe ou nao existe mais
//		0		-	componente permanece existindo
//
function cm_engine_autoclean(_xid, _cname){
	var _nid = _xid;
	var _do = 0;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	// obter componente
	var _component = cm_getcomponent(_nid, _cname);
	if('object' != typeof(_component)) return 1;

	// testar ancoragem do componente
	if(!cm_anchored(_component)) _do = 1;

	if(!_do && _component.cleanup)
		_do =
		(_component.interval ?
			(_component.repeat && _component.stats.replies >= _component.repeat?
				2
			:
				0
			)
		:
			(
			_component.stats.replies ?
				3
			:
				(
				_component.stats.retries >= _component.retries ?
					4
				:
					0
				)
			)
		);
	if(_do){
		// componente perdeu utilizada, extermina-lo
		cm_engine_stop(_nid);
		cm_clean(_nid, _cname);
		return(_do);
	}
	return(0);
}

// ***************************** Funcoes de manutencao e sanatizacao *********************************

// analisa se o componente perdeu o domid ou objeto de componente
function cm_checkup(_xid, _cname){
	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	var _component = cm_getcomponent(_nid, _cname);
	if('object'!=typeof(_component)) return false;

	// analise do domid
	if(_component.domid != '' && !document.getElementById(_component.domid)) return false;

	// componente ativo
	return true;
}

// destruir slot de um componente consultando evento ondestroy
function cm_destroy(_xid, _cname){
	cm_clean((_xid), (_cname), true);
}
// funcao final de destruicao de um slot
function cm_clean(_xid, _cname, _do_destroy){
	var _x;
	var _do = true;
	if('undefined'==typeof(_do_destroy)) _do_destroy = false;

	var _nid = _xid;
	if(typeof(_xid)=='string') _nid = stdlib.importxid(_xid);

	var _component = cm_getcomponent(_nid, _cname);
	if('object'!=typeof(_component)) return false;

	// em caso de consulta do evento ondestroy
	if(_do_destroy && 'function'==typeof(_component['ondestroy'])){
		_do = _component.ondestroy(_nid);
		if('undefined'==typeof(_do)) _do = true;
	}
	if(!_do) return false;

	// limpar propriedades
	for(var _x in _component) _component[_x] = false;

	// destruir slot e garantir limpeza do controle principal de componentes
	switch(_cname){
		case 'jchart':
			jchart_list[_nid]=false;
			break;
		case 'jframe':
			jframe_list[_nid]=false;
			break;

		case 'jframe_frm':
			jframe_frm_list[_nid]=false;
			break;

		case 'jmainmenu':
			jmainmenu_list[_nid]=false;
			break;

		case 'jgauge':
			jgauge_list[_nid]=false;
			break;

		case 'jmap':
			jmap_list[_nid]=false;
			break;
	
		case 'jprogress':
			jprogress_list[_nid]=false;
			break;

		case 'jslider':
			jslider_list[_nid]=false;
			break;
	
		case 'jsmenu':
			jsmenu_list[_nid]=false;
			break;
	
		case 'jstab':
			jstab_list[_nid]=false;
			break;

		case 'jstab_tabs':
			jstab_tabs_list[_nid]=false;
			break;
	
		case 'jstree':
			jstree_list[_nid]=false;
			break;
	
		case 'jtable':
			jtable_list[_nid]=false;
			break;

		case 'ftable':
			ftable_list[_nid]=false;
			break;

		case 'jsched':
			jsched_list[_nid]=false;
			break;

		case 'jgrid':
			jgrid_list[_nid]=false;
			break;
		
		case 'jpage':
			jpage_list[_nid]=false;
			break;
	
		case 'jwtable':
			jwtable_list[_nid]=false;
			break;
	
		case 'uajax':
			uajax_list[_nid]=false;
			break;

		case 'jrpc':
			jrpc_list[_nid]=false;
			break;
	
		case 'ubuttons':
			ubuttons_list[_nid]=false;
			break;
	
		case 'udialog':
			udialog_list[_nid]=false;
			break;
	
		case 'uform':
			uform_list[_nid]=false;
			break;

		case 'uform_select':
			uform_select_list[_nid]=false;
			break;

		case 'uform_input':
			uform_input_list[_nid]=false;
			break;
	
		case 'unotify':
			unotify_list[_nid]=false;
			break;
	
		case 'wide':
			wide_list[_nid]=false;
			break;
	
		case 'glib':
			glib_list[_nid]=false;
			break;
	
		case 'loopback':
			loopback_list[_nid]=false;
			break;
	}
	cm_cleanup(_cname);
	return(true);
}

// limpar motores fantasmas
function cm_cleanup(_cname){
	// destruir slot e garantir limpeza do controle principal de componentes
	switch(_cname){
		case 'jchart':
			if(!stdlib.objcountobj(jchart_list)) jchart_list = {};
			break;
		case 'jframe':
			if(!stdlib.objcountobj(jframe_list)) jframe_list = {};
			break;

		case 'jframe_frm':
			if(!stdlib.objcountobj(jframe_frm_list)) jframe_frm_list = {};
			break;

		case 'jmainmenu':
			if(!stdlib.objcountobj(jmainmenu_list)) jmainmenu_list = {};
			break;

		case 'jgauge':
			if(!stdlib.objcountobj(jgauge_list)) jgauge_list = {};
			break;

		case 'jmap':
			if(!stdlib.objcountobj(jmap_list)) jmap_list = {};
			break;
	
		case 'jprogress':
			if(!stdlib.objcountobj(jprogress_list)) jprogress_list = {};
			break;

		case 'jslider':
			if(!stdlib.objcountobj(jslider_list)) jslider_list = {};
			break;
	
		case 'jsmenu':
			if(!stdlib.objcountobj(jsmenu_list)) jsmenu_list = {};
			break;
	
		case 'jstab':
			if(!stdlib.objcountobj(jstab_list)) jstab_list = {};
			break;

		case 'jstab_tabs':
			if(!stdlib.objcountobj(jstab_tabs_list)) jstab_tabs_list = {};
			break;

		case 'jstree':
			if(!stdlib.objcountobj(jstree_list)) jstree_list = {};
			break;

		case 'jtable':
			if(!stdlib.objcountobj(jtable_list)) jtable_list = {};
			break;

		case 'ftable':
			if(!stdlib.objcountobj(ftable_list)) ftable_list = {};
			break;

		case 'jsched':
			if(!stdlib.objcountobj(jsched_list)) jsched_list = {};
			break;

		case 'jgrid':
			if(!stdlib.objcountobj(jgrid_list)) jgrid_list = {};
			break;
	
		case 'jpage':
			if(!stdlib.objcountobj(jpage_list)) jpage_list = {};
			break;
	
		case 'jwtable':
			if(!stdlib.objcountobj(jwtable_list)) jwtable_list = {};
			break;
	
		case 'uajax':
			if(!stdlib.objcountobj(uajax_list)) uajax_list = {};
			break;

		case 'jrpc':
			if(!stdlib.objcountobj(jrpc_list)) jrpc_list = {};
			break;
	
		case 'ubuttons':
			if(!stdlib.objcountobj(ubuttons_list)) ubuttons_list = {};
			break;
	
		case 'udialog':
			if(!stdlib.objcountobj(udialog_list)) udialog_list = {};
			break;
	
		case 'uform':
			if(!stdlib.objcountobj(uform_list)) uform_list = {};
			break;
	
		case 'uform_select':
			if(!stdlib.objcountobj(uform_select_list)) uform_select_list = {};
			break;
	
		case 'uform_input':
			if(!stdlib.objcountobj(uform_input_list)) uform_input_list = {};
			break;
	
		case 'unotify':
			if(!stdlib.objcountobj(unotify_list)) unotify_list = {};
			break;
	
		case 'wide':
			if(!stdlib.objcountobj(wide_list)) wide_list = {};
			break;

		case 'glib':
			if(!stdlib.objcountobj(glib_list)) glib_list = {};
			break;
	
		case 'loopback':
			if(!stdlib.objcountobj(loopback_list)) loopback_list = {};
			break;
	}
}


//********************************************************************************************** JCHART

/*
	
*/

function jchart_schema(_nid){
	var _html = '';
	var _st = '';
	
	// varificar se há css nativo a instalar
	_st = stdlib.mkstyle(jchart_list[_nid].chart);

	// canvas do conteudo grafico
	_html += '<canvas id="'+jchart_list[_nid].canvas_id+'"';
	_html += ' width="'+jchart_list[_nid].chart.width+'"';
	_html += ' height="'+jchart_list[_nid].chart.height+'"';
	_html += ' class="jchart_canvas" style="'+_st+'">Erro HTML5: nao suportado.</canvas>';


	// area de desenho livre atras do grafico
	_html += '<div id="'+jchart_list[_nid].draw_id+'" class="jchart_draw"></div>';

	// valores verticais
	_html += '<div id="'+jchart_list[_nid].vaxis_id+'" class="jchart_vaxis"></div>';

	// legenda
	_html += '<div id="'+jchart_list[_nid].legend_id+'" class="jchart_legend"></div>';

	// titulo
	_html += '<div id="'+jchart_list[_nid].title_id+'" class="jchart_title"></div>';


	return(_html);
}



/*

	sistema de graficos


*/

	/* cadastro de jcharts */
	jchart_list = {};

	// função construtora do grid
	function jchart(_sid, _options){

		// adaptacao de formato
		// 1: _sid, _options
		// 2: _options
		if('object'==typeof(_sid)){
			// formato 2
			_options = stdlib.objcopy(_sid);
			_sid = '';
		}else{
			// formato 1
			_sid = stdlib.trim(_sid);
			_options = stdlib.objcopy(_options);
		}
		// obter sid pelo domid
		if(_sid=='' && 'string'!=typeof(_options['domid'])) _sid = _options.domid;
		if(_sid=='') _sid = 'jchrt'+stdlib.rrandom(1000,9990);

		/* importar objeto: propriedades */
		_options.sid = _sid;
		//stdlib.logit('B: '+_options.loadmethod);
		var _jchart = jchart_properties(_sid, _options);
		//stdlib.logit('C: '+_jchart.loadmethod);
		var _nid = _jchart.nid;

		/* limpar caso atual esteja em uso e exportar como GLOBAL */
		jchart_list[_nid] = _jchart; _jchart = false;
		//stdlib.logit('D: '+jchart_list[_nid].loadmethod);
		

		// varificar se o modulo é valido
		var _type = jchart_list[_nid].type;
		if('string'!=typeof(_type) || _type == '') return(-1);

		//stdlib.logit('H: '+jchart_list[_nid].loadmethod);
		
		// coletar DOMID
		var _domid = jchart_list[_nid].domid;
		if(!stdlib.getdom(_domid)) return(-2);

		// initializar variaveis do modulo
		// if(_type!='rate') return(-3);
		
		// init do tipo (mudar de rate para outro via switch, FALTA)

		// dar start do modulo
		switch(jchart_list[_nid].type){
			case 'rate':
				if(!jchart_rate_init(_nid)) return(-3);
				break;
			case 'ping':
				if(!jchart_ping_init(_nid)) return(-4);
				break;
		}

		// instalar extrutura
		//stdlib.logit('M: '+jchart_list[_nid].loadmethod);
		var _schema = jchart_schema(_nid);

		stdlib.set_html(_domid, _schema);

		// definir tamanho do programador - principal
		//stdlib.logit('W: '+jchart_list[_nid].loadmethod);
		stdlib.style(_domid, jchart_list[_nid]);

		// executar evento de pos construçao
		//stdlib.logit('Z: '+jchart_list[_nid].loadmethod);
		if('function'==typeof(jchart_list[_nid].onbuild))jchart_list[_nid].onbuild(_nid);

		// caso haja datasource, dar play
		//stdlib.logit('X: '+jchart_list[_nid].loadmethod);
		if(jchart_list[_nid].loadmethod=='json') jchart_remote_up(_nid);

		// dar start do modulo
		switch(jchart_list[_nid].type){
			case 'rate':
				jchart_rate_start(_nid);
				break;
			case 'ping':
				jchart_ping_start(_nid);
				break;
		}

		return _nid;
	}





//	modulo para medir velocidade unica

// função para inserir propriedades no objeto do grafico (pre construcao do schema)
function jchart_ping_init(_nid){

	// padroes do tipo
	var _chart = {
		width: jchart_list[_nid].width-100,
		height: jchart_list[_nid].height-120,
		position: 'absolute',
		top: 30,
		right: 10,
		gradient: palette.gradient({
			type: 'horizontal',
			colors: {0: '#CFD5E2', 1: '#F1F2F7'},
			linewidth: 2,
			linecolor: '#0000aa'
		}),
		border: '1px solid #022D9A',
		z: 10
	};

	// exportar parametros chart
	var _u = jchart_list[_nid].chart;			// salvar versao original
	jchart_list[_nid].chart = _chart;			// colocar versao padrao
	for(var _kx in _u) jchart_list[_nid].chart[_kx] = _u[_kx];	// copiar do antigo original por cima do padrao

	// Series padrao
	// - Latencia
	if( stdlib.isundef(jchart_list[_nid].series['us'])){
		jchart_list[_nid].series.us = jchart_serie_std();
		jchart_list[_nid].series.us.label = 'Latency';
		jchart_list[_nid].series.us.type = 'area';
		jchart_list[_nid].series.us.areacolor = '#33aa4466';
		jchart_list[_nid].series.us.linecolor = '#009900';
		jchart_list[_nid].series.us.linewidth = '2.0';
		jchart_list[_nid].series.us.shadow = 0;
		jchart_list[_nid].series.us.sdraw = 1;
	}
	// - Perda de pacotes
	if( stdlib.isundef(jchart_list[_nid].series['lost'])){
		jchart_list[_nid].series.lost = jchart_serie_std();
		jchart_list[_nid].series.lost.label = 'Lost';
		jchart_list[_nid].series.lost.type = 'line';
		jchart_list[_nid].series.lost.linecolor = '#AA000055';
		jchart_list[_nid].series.lost.linewidth = '2.0';
		jchart_list[_nid].series.lost.areacolor = '#FF000099';
		jchart_list[_nid].series.lost.shadow = 0;
		jchart_list[_nid].series.lost.sdraw = 0;
	}

	// inicializar fila de informacoes
	//jchart_list[_nid].queue = {};
	
	// maximo de elementos na fila (queue)
	jchart_list[_nid]._xstart = 0;

	// maximo de colunas
	//if(jchart_list[_nid].columns<10) jchart_list[_nid].columns = 10;
	jchart_list[_nid].colwidth = 10;
	jchart_list[_nid].columns = stdlib.toint(jchart_list[_nid].chart.width / jchart_list[_nid].colwidth);
	jchart_list[_nid]._qsize = jchart_list[_nid].columns+1;

	// estatisticas do grafico
	jchart_list[_nid]._stats = {};
	// numero maximo registrado
	jchart_list[_nid]._max = 0;
	// valor que representa o teto do grafico (para orientação)
	jchart_list[_nid]._topmax = 0;
	
	jchart_list[_nid]._min = false;
	// numero de elmentos validos
	jchart_list[_nid]._count = 0;
		
	// valor de referencia vertical entre valor e pixel
	jchart_list[_nid]._perpixel = 1;

	// Permitir reimpressao de dado repetido no motor ajax
	jchart_list[_nid].modified = false;

	// sanatizar cores das series
	for(var _seid in jchart_list[_nid].series){
		var _serie = stdlib.unlink(jchart_list[_nid].series[_seid]);
		var _type = _serie.type;

		// cor da serie
		var _base_color = _serie.color;
		var _area_color = _serie.areacolor;
		var _line_color = _serie.linecolor;
		
		// importar da serie
		// cor basica
		if(_base_color=='' && (_type=='area' && _area_color != '')) _base_color = _area_color;
		if(_base_color=='' && (_type=='line' && _line_color != '')) _base_color = _line_color;
		if(_base_color=='') _base_color = _area_color;
		if(_base_color=='') _base_color = '#f0f';

		// cor de preenchimento
		if(_serie.areacolor!='') _area_color = _serie.areacolor;	
		if(_area_color=='') _area_color = palette.brightness(_base_color, 10); // padrao ba area mais clara que a cor padrao

		// cor de linha
		if(_serie.linecolor!='') _line_color = _serie.linecolor;
		if(_line_color=='') _line_color = palette.brightness(_base_color, -40); // padrao da linha mais escura que a cor padrao

		// traducao RGBA
		var __base_color = palette.get(_base_color);
		var __area_color = palette.get(_area_color);
		var __line_color = palette.get(_line_color);
		_base_color = __base_color.rgba;
		_area_color = __area_color.rgba;
		_line_color = __line_color.rgba;

		// largura da linha de desenho visivel
		var _line_width = 1;
		if(_serie.linewidth) _line_width = _serie.linewidth;
		
		// sombra (apenas para linha)
		var _shadow = 0;
		var _shadow_color = '';
		if(_type=='line') _shadow = _serie.shadow;
		if(_shadow) _shadow_color = palette.get('#0003').rgba;

		// exportar oficialmente
		jchart_list[_nid].series[_seid].color = _base_color;
		jchart_list[_nid].series[_seid].areacolor = _area_color;
		jchart_list[_nid].series[_seid].linecolor = _line_color;
	}
	// init de cores basicas
	jchart_list[_nid].bgcolor = jchart_list[_nid].bgcolor=='transparent'?'#ffffffff' : palette.get(jchart_list[_nid].bgcolor).rgba;
	jchart_list[_nid].color = palette.get(jchart_list[_nid].color).rgba;
	return(true);
}

// funcao para inicializar o grafico
function jchart_ping_start(_nid){
	var _html = '';
	var _st;

	// instalar canvas do draw e da legenda
	var _draw = {
		width: jchart_list[_nid].width,
		height: jchart_list[_nid].height,
		border: 'none',
		top: 0,
		right: 0,
		position: 'absolute',
		z: 1	
	};
	_st = stdlib.mkstyle(_draw);
	_html  = '<canvas id="'+jchart_list[_nid].draw_canvas_id+'"';
	_html += ' width="'+_draw.width+'"';
	_html += ' height="'+_draw.height+'"';
	_html += ' class="jchart_canvas_draw" style="'+_st+'">Err: HTML5 nao suportado.</canvas>';
	stdlib.set_html(jchart_list[_nid].draw_id, _html);
}

// limpar grafico
function jchart_ping_clear(_nid){
	if(!jchart_list[_nid]._canvas) jchart_list[_nid]._canvas = stdlib.getdom(jchart_list[_nid].canvas_id);
	if(jchart_list[_nid]._canvas) jchart_list[_nid]._canvas.width = jchart_list[_nid]._canvas.width;
	if(jchart_list[_nid]._draw) jchart_list[_nid]._draw.width = jchart_list[_nid]._draw.width;
}

// função de impressão da queue no canvas, atualizacao de legendas
function jchart_ping_chart_print(_nid){

	// limpar tela
	jchart_ping_clear(_nid);

	// calcula estatisticas e imprimir labels, perpixel depende de print_stats
	jchart_ping_print_stats(_nid);
	
	// palco de desenho
	if(!jchart_list[_nid]._canvas) jchart_list[_nid]._canvas = stdlib.getdom(jchart_list[_nid].canvas_id);
	if(!jchart_list[_nid]._canvas){
		stdlib.debug("FATAL, impossivel pegar o canvas", true);
		return;
	}
	// criar contexto para desenhar
	var _chart = jchart_list[_nid]._canvas.getContext("2d");

	// calcular relacao entre unicade de valor e pixel
	//jchart_list[_nid]._perpixel = jchart_list[_nid].chart.height / jchart_list[_nid]._max;
	var _perpixel = jchart_list[_nid]._perpixel;
	
	// ultimas posicoes registradas para uso do desenho atual
	var _last_x = 0;
	var _last_y = 0;

	// dimensoes
	var _width = jchart_list[_nid].chart.width;
	var _height = jchart_list[_nid].chart.height;

	// calcular largura da coluna
	var _cols = jchart_list[_nid].columns;
	var _colwidth = _width / _cols;

	// posicao de inicio
	var _x_start = jchart_list[_nid]._xstart;

	var _bottom = jchart_list[_nid].chart.top + jchart_list[_nid].chart.height;
	var _y_start = _bottom+4;		// distancia do topo
	var _y_stop = _height;

	// desenhar linhas divisoras
	// altura da linha divisoria
	var _hline_height = _height / 10;
	for(var _k = _hline_height; _k < _height; _k+=_hline_height){
		// desenhar linha/linha delineadora			
		_chart.beginPath();
		_chart.lineWidth = 0.3;
		_chart.strokeStyle = 'rgba(255,255,255,0.5)';
		_chart.moveTo(0, _k);
		_chart.lineTo(_width, _k);
		_chart.stroke();
	}


	// percorrer queue e desenhar graficos e linhas!
	var _last_latency = 0;
	for(var _seid in jchart_list[_nid].series){
		//if(_seid!='a') continue;

		var _serie = jchart_list[_nid].series[_seid];
		var _type = _serie.type;
		var _c = 0;
		var _inlost = 0;

		// cor da serie
		var _base_color = _serie.color;
		var _area_color = _serie.areacolor;
		var _line_color = _serie.linecolor;

		// largura da linha de desenho visivel
		var _line_width = 1;
		if(_serie.linewidth) _line_width = _serie.linewidth;
		
		// sombra (apenas para linha)
		var _shadow = 0;
		var _shadow_color = '';
		if(_type=='line') _shadow = _serie.shadow;
		if(_shadow) _shadow_color = palette.get('#0003').rgba;

		for(var _i = 1; _i <= jchart_list[_nid]._qsize; _i++){
			var _slot = jchart_list[_nid].queue[_i];
			if(_slot==false||_slot==-1) continue;
			var _v = _slot[_seid];

			// Usar ultima latencia para caso de perdas
			_inlost = 0;
			if(_seid == 'us' && _v < 1){
				_inlost = 1;
				_v = _last_latency;
			}

			// posicao relativa dessa representacao (x inicial)
			var _temp_x = _x_start + (_colwidth * _i) - _colwidth;
			var _temp_y = _y_stop - (_v * _perpixel);

			// Em caso de perda
			if(_seid==='lost'){

				if(_v){
					// Desenhar Linha vermelha
					_ty=_y_stop;

					// quadrado
					_chart.lineWidth = 1;
					_chart.strokeStyle = _serie.linecolor;
					_chart.beginPath();
					_chart.fillStyle=_serie.areacolor;

					var _sz = 10;
					_chart.moveTo(_temp_x, _y_stop); // marcar na base a direita

					_chart.lineTo(_temp_x - _sz, _y_stop); // para esquerda

					_chart.lineTo(_temp_x - _sz, _y_stop - _y_start); // para cima

					_chart.lineTo(_temp_x, _y_stop - _y_start); // para a direita

					_chart.lineTo(_temp_x, _y_stop); // para baixo

					_chart.fill();
					_chart.closePath();
					_chart.stroke();

				}
				continue;
			}

			// segundo passo, desenhar
			if(_c){
				// desenhar preenchimento para area
				if(_type=='area'){
					// linha de desenho, invisivel
					_chart.lineWidth = 0;
					_chart.strokeStyle = "rgba(255,255,255,0.0)";
					_chart.beginPath();
					_chart.fillStyle=_area_color;
					_chart.lineTo(_temp_x, _temp_y);
					_chart.lineTo(_temp_x, _y_stop);
					_chart.lineTo(_last_x, _y_stop);
					_chart.lineTo(_last_x, _last_y);
					//_chart.endFill();
					_chart.closePath();
					_chart.fill();
					_chart.stroke();
				}

				// desenhar linha/linha delineadora			
				_chart.beginPath();
				_chart.lineJoin = "round";
				_chart.lineCap = "round";
				_chart.lineWidth = _line_width;
				_chart.strokeStyle = _line_color;
				_chart.moveTo(_last_x, _last_y);
				_chart.lineTo(_temp_x, _temp_y);
				_chart.stroke();
				
				// desenhar sombra da linha
				if(_shadow){
					_chart.beginPath();
					_chart.lineJoin = "round";
					_chart.lineCap = "round";
					_chart.lineWidth = _shadow;
					_chart.strokeStyle = _shadow_color;
					_chart.moveTo(_last_x-1, _last_y+_shadow);
					_chart.lineTo(_temp_x-1, _temp_y+_shadow);
					_chart.stroke();
				}

			}else{
				// primeiro passo, colocar cursor no ponto para que o proximo passo ja desenhe a linha adiante
				_chart.moveTo(_temp_x, _temp_y);
			}
			_chart.moveTo(_temp_x, _temp_y);
			_last_x = _temp_x;
			_last_y = _temp_y;
			if(_v) _last_latency = _v;
			_c++;
		}
	}
}

// funcao para receber dados JSON enviados pelo servidor
/*
	formato do json:
	{
		a: 30,
		b: 33,
		c: 29,
		...	
	}
	chaves ignoradas: sucess, error, errno
*/
function jchart_ping_rx(_nid, _json){
	if('object'!=typeof(_json)) return;

	// repassar para funcao de pre-processamento
	if(typeof(jchart_list[_nid].onpreset)=='function'){
		var _new_json;
		_new_json = jchart_list[_nid].onpreset(_nid, _json);
		if(typeof(_new_json)=='object') _json = _new_json;
	}

	// criar objeto do slot vazio
	var _slot = {};
	for(var _kx in jchart_list[_nid].series) _slot[_kx] = 0;

	// obter numeros
	for(var _wx in _json){
		if(_wx=='sucess'||_wx=='error'||_wx=='errno') continue;
		// procurar indece idx no slot
		for(var _tx in _slot) if(_tx==_wx) _slot[_wx] = stdlib.tofloat(_json[_wx]);	
	}
	
	// armazenar na fila
	jchart_ping_fifo(_nid, _slot);
	
	// imprimir queue dentro do grafico
	jchart_ping_chart_print(_nid);

	// repassar para funcao de entrada
	if(typeof(jchart_list[_nid].onset)=='function') jchart_list[_nid].onset(_nid, _json, _slot);
	
}

// armazena slot na fila
function jchart_ping_fifo(_nid, _slot){
	var _queue_size = jchart_list[_nid]._qsize;

	// calcular maximo
	jchart_list[_nid]._max = 10;

	/*
		mover valores, o valor novo fica sempre no final, assim:
		1	2	
		2	3
		3	4
			5*
	*/
	for(var _i = 2; _i <= _queue_size; _i++){
		var _cp = jchart_list[_nid].queue[_i];
		if(typeof(_cp)=='object'){
			// slot movido!
			jchart_list[_nid].queue[_i-1] = stdlib.objcopy(_cp);
		}else{
			// valor vazio (-1) movido
			jchart_list[_nid].queue[_i-1] = -1;
		}
	}
	// hospedar novo valor
	jchart_list[_nid].queue[_queue_size] = _slot;
}



/*
	atualizar estatisticas e valores
*/
function jchart_ping_print_stats(_nid){
	var _queue_size = jchart_list[_nid]._qsize;
	var _si;
	// iniciar stats
	jchart_list[_nid]._stats = {};

	// calcular minimo, media e maximo de todas as series
	for(_si in jchart_list[_nid].series){
		// inicializar dados estatisticos da serie
		jchart_list[_nid]._stats[_si] = {
			_count: 0,		// total de elementos preenchidos
			_total: 0,		// total somado de tudo
			_max: false,	// valor maximo
			_min: false,	// valor minimo
			_cur: false,	// valor corrente
			_avg: false		// valor medio
		};
	}

	// Coletar respostas
	var _replies = 0;
	var _losts = 0;

	// percorrer queue e coletar estatisticas
	var _i;
	var _si;
	for(_i = 1; _i <= _queue_size; _i++){
		var _slot =  jchart_list[_nid].queue[_i];
		if(_slot===false||_slot==-1) continue;
		_replies++;

		for(_si in _slot){
			var _v = _slot[_si];
			if(stdlib.isfalse(_v)||_v==-1) continue;

			jchart_list[_nid]._stats[_si]._count++;

			if(_si=='lost' && _v) _losts++;

			// coletar maximo
			if(jchart_list[_nid]._stats[_si]._max==false || _v > jchart_list[_nid]._stats[_si]._max){
				jchart_list[_nid]._stats[_si]._max = _v;
			}
			// coletar minimo
			if(jchart_list[_nid]._stats[_si]._min==false || _v < jchart_list[_nid]._stats[_si]._min){
				jchart_list[_nid]._stats[_si]._min = _v;
			}

			// calcular total
			jchart_list[_nid]._stats[_si]._total += _v;

			// coletar ultimo valor
			jchart_list[_nid]._stats[_si]._cur = _v;
		}
	}
	_lostpc = 0;
	if(_replies && _losts){
		_lostpc = stdlib.to_fixed( (100 * _losts) / _replies, 2 );
	}

	// resumir estatistica (media)
	var _si;
	jchart_list[_nid]._max = 10;
	jchart_list[_nid]._min = false;
	for(_si in jchart_list[_nid].series){
		// calcular media
		jchart_list[_nid]._stats[_si]._avg = 0;
		if(jchart_list[_nid]._stats[_si]._total && jchart_list[_nid]._stats[_si]._count){
			jchart_list[_nid]._stats[_si]._avg = jchart_list[_nid]._stats[_si]._total / jchart_list[_nid]._stats[_si]._count;
		}
		// calcular maximo
		if(jchart_list[_nid]._stats[_si]._max > jchart_list[_nid]._max) jchart_list[_nid]._max = jchart_list[_nid]._stats[_si]._max;

		// calcular minimo
		if(jchart_list[_nid]._min===false || jchart_list[_nid]._stats[_si]._min < jchart_list[_nid]._min) jchart_list[_nid]._min = jchart_list[_nid]._stats[_si]._min;
		
		// a quantidade de qualquer serie é o total de slots
		jchart_list[_nid]._count = jchart_list[_nid]._stats[_si]._count;
	}

	// Procurar um multiplo de 10 mais proximo
	var _r = (jchart_list[_nid]._max % 1000);
	jchart_list[_nid]._max += _r;
	
	// calcular valor maximo da linha superior
	jchart_list[_nid]._topmax = jchart_list[_nid]._max;

	// buscar valores de grandeze
	var _g = 10;
	var _jg;
	for(_jg = 100; true; _jg *= 10){
		if(jchart_list[_nid]._topmax < _jg){
			_g = _jg / 10;
			break;
		}
	}
	// grandeza obtida, procurar valores com intervalos de 40% até encontrar teto mais proximo
	var _pc = _g * 0.4; if(_pc < 2) _pc = 2;
	var _top = jchart_list[_nid]._topmax;
	jchart_list[_nid]._topmax = 0;
	while(jchart_list[_nid]._topmax < _top) jchart_list[_nid]._topmax += _pc;
	if(jchart_list[_nid]._topmax==jchart_list[_nid]._max) jchart_list[_nid]._topmax+=_pc;

	// calcular relacao entre pixel e valor maximo representavel
	jchart_list[_nid]._perpixel = jchart_list[_nid].chart.height / jchart_list[_nid]._topmax;

	// preencher canvas de informacoes estatisticas
	// palco de desenho
	if(!jchart_list[_nid]._draw) jchart_list[_nid]._draw = stdlib.getdom(jchart_list[_nid].draw_canvas_id);
	if(!jchart_list[_nid]._draw){
		stdlib.debug("FATAL, impossivel pegar o canvas DRAW", true);
		return;
	}
	// criar contexto para desenhar
	var _draw = jchart_list[_nid]._draw.getContext("2d");

	// limpar
	// referencias locais de localizacao do convas do grafico
	var _left = jchart_list[_nid].width - jchart_list[_nid].chart.width - jchart_list[_nid].chart.right;
	var _top = jchart_list[_nid].chart.top+1; // incremento da borta
	var _bottom = jchart_list[_nid].chart.top + jchart_list[_nid].chart.height;
	var _height = _bottom - _top;
	// dados do canvas
	var _cwidth = jchart_list[_nid].chart.width;
	var _cheight = jchart_list[_nid].chart.height;
	// desenhar linhas divisoras e labels
	// obter salto entre valor base e linha superior
	var _vinterval = jchart_list[_nid]._topmax / 10;
	// altura da linha divisoria
	var _hline_height = _cheight / 10;
	_left-=10;
	var _m = 0;
	var _k;
	for(_k = _top; _k < _cheight+_top+_hline_height; _k+=_hline_height){
		// calcular valor a exibir
		var _v = (_vinterval*(10-_m));

		// Slot nao preenchido
		if(_v<0) continue;
		
		// desenhar linha/linha delineadora	ao lado do valor a esquerda		
		_draw.beginPath();
		_draw.lineWidth = 1;
		_draw.strokeStyle = 'rgba(0,0,0,3)';
		_draw.moveTo(_left+2, _k);
		_draw.lineTo(_left+8, _k);
		_draw.stroke();	

		// colocar textos nas linhas indicadores
		_draw.fillStyle = jchart_list[_nid].color;
		_draw.font = "10pt Helvetica";
		_draw.textAlign = "right";
		_draw.textBaseline = "middle";
		
		// valor no label lateral
		_draw.fillText( stdlib.to_fixed(_v/1000, 3), _left-2, _k);
		
		_m++;
	}

	// imprimir series com valores correntes, minimo, medio, maximo
	var _n = 1;
	var _y_start = _bottom+4;		// distancia do topo
	var _x_start = _left+10;	// distancia da linha esquerda do grafico
	var _y_distance = 22;			// distancia entre series
	
	// imprimir cabecalho das tabelas
	// largura disponivel para isso
	var _label_width = 60;
	var _width_table = _cwidth - _label_width;	// largura do grafico menos o usado para o label da serie
	var _x_table = _x_start + _label_width;
	var _y_table = _y_start + 10;
	var _interval_table = (_width_table / 4)-1;
	var _headers = {_cur: 'Atual', _min: 'Mínimo', _avg: 'Média', _max: 'Máximo'};
	var _h = 1;
	for(var _ih in _headers){
		_draw.fillStyle = jchart_list[_nid].color;
		_draw.font = "9pt Helvetica";
		_draw.textAlign = "right";
		_draw.textBaseline = "baseline";
		_draw.fillText(_headers[_ih], _x_table+(_interval_table*_h)+1, _y_table);
		_h++;
	}
	
	// imprimir series
	for(var _seid in jchart_list[_nid].series){
		var _serie = jchart_list[_nid].series[_seid];
		var _y = _y_start + (_n*_y_distance);
		var _x = _x_start;
		var _type = _serie.type;

		// icone da serie
		switch(_type){
			case 'area':
			case 'line':
				// quadrado
				_draw.lineWidth = 1;
				_draw.strokeStyle = _serie.linecolor;
				_draw.beginPath();
				_draw.fillStyle=_serie.areacolor;
				var _sz = 13;
				_draw.moveTo(_x, _y);
				_draw.lineTo(_x+_sz, _y);
				_draw.lineTo(_x+_sz, _y+_sz);
				_draw.lineTo(_x, _y+_sz);
				_draw.lineTo(_x, _y);
				_draw.fill();
				_draw.closePath();
				_draw.stroke();
				break;
			/*
			case 'line':
				// linha
				var _lw = stdlib.toint(_serie.linewidth); if(!_lw) _lw = 1;
				_draw.lineWidth = _lw;
				_draw.strokeStyle = _serie.linecolor;
				_draw.beginPath();
				var _sz = 13;
				_draw.moveTo(_x, _y+_sz);
				_draw.lineTo(_x+_sz/2, _y);
				_draw.lineTo(_x+_sz, _y+_sz);
				_draw.stroke();
				break;
			*/
		}

		// label da serie
		_draw.fillStyle = jchart_list[_nid].color;
		_draw.font = "10pt Helvetica";
		_draw.textAlign = "left";
		_draw.textBaseline = "top";
		_draw.fillText(_serie.label, _x+18, _y);

		// imprimir valores
		var _xh = 1;
		for(var _xih in _headers){
			var _sv = jchart_list[_nid]._stats[_seid][_xih];

			// calcular valor a exibir
			var _nv = _sv;

			if(_seid=='lost'){
				_nv = _lostpc + ' %';
			}else{
				_nv = ( _nv ? stdlib.to_fixed(_nv/1000, 3) : '---' )  + ' ms';
			}
			_draw.fillStyle = jchart_list[_nid].color;
			_draw.font = "10pt Helvetica";
			_draw.textAlign = "right";
			_draw.textBaseline = "baseline";
			_draw.fillText(_nv, _x_table+(_interval_table*_xh), _y);
			_xh++;
			if(_seid=='lost') break;
		}	
		_n++;
	}
}


/*
	modulo para medir velocidade unica

*/

// função para inserir propriedades no objeto do grafico (pre construcao do schema)
function jchart_rate_init(_nid){

	// padroes do tipo
	var _chart = {
		width: jchart_list[_nid].width-100,
		height: jchart_list[_nid].height-((jchart_list[_nid].series_count*23)+54),
		position: 'absolute',
		top: 30,
		right: 10,
		gradient: palette.gradient({
			type: 'horizontal',
			colors: {0: '#CFE2D5', 1: '#F1F7F2'}
		}),
		border: '1px solid #029A2D',
		z: 10
	};
	// exportar parametros chart
	var _u = jchart_list[_nid].chart;			// salvar versao original
	jchart_list[_nid].chart = _chart;			// colocar versao padrao
	for(var _kx in _u) jchart_list[_nid].chart[_kx] = _u[_kx];	// copiar do antigo original por cima do padrao

	// inicializar fila de informacoes
	jchart_list[_nid].queue = {};
	if(jchart_list[_nid].series_count<1){
		return(false);
	}
	
	// maximo de elementos na fila (queue)
	jchart_list[_nid]._xstart = 0;

	// maximo de colunas
	//if(jchart_list[_nid].columns<10) jchart_list[_nid].columns = 10;
	jchart_list[_nid].colwidth = 10;
	jchart_list[_nid].columns = stdlib.toint(jchart_list[_nid].chart.width / jchart_list[_nid].colwidth);
	jchart_list[_nid]._qsize = jchart_list[_nid].columns+1;

	// estatisticas do grafico
	jchart_list[_nid]._stats = {};
	// numero maximo registrado
	jchart_list[_nid]._max = 0;
	// valor que representa o teto do grafico (para orientação)
	jchart_list[_nid]._topmax = 0;
	
	jchart_list[_nid]._min = false;
	// numero de elmentos validos
	jchart_list[_nid]._count = 0;
	
	// limpar queue
	jchart_rate_flush(_nid);
	
	// valor de referencia vertical entre valor e pixel
	jchart_list[_nid]._perpixel = 1;

	// sanatizar cores das series
	for(var _seid in jchart_list[_nid].series){
		var _serie = stdlib.unlink(jchart_list[_nid].series[_seid]);
		var _type = _serie.type;

		// cor da serie
		var _base_color = _serie.color;
		var _area_color = _serie.areacolor;
		var _line_color = _serie.linecolor;
		
		// importar da serie
		// cor basica
		if(_base_color=='' && (_type=='area' && _area_color != '')) _base_color = _area_color;
		if(_base_color=='' && (_type=='line' && _line_color != '')) _base_color = _line_color;
		if(_base_color=='') _base_color = _area_color;
		if(_base_color=='') _base_color = '#f0f';

		// cor de preenchimento
		if(_serie.areacolor!='') _area_color = _serie.areacolor;	
		if(_area_color=='') _area_color = palette.brightness(_base_color, 10); // padrao ba area mais clara que a cor padrao

		// cor de linha
		if(_serie.linecolor!='') _line_color = _serie.linecolor;
		if(_line_color=='') _line_color = palette.brightness(_base_color, -40); // padrao da linha mais escura que a cor padrao

		// traducao RGBA
		var __base_color = palette.get(_base_color);
		var __area_color = palette.get(_area_color);
		var __line_color = palette.get(_line_color);
		_base_color = __base_color.rgba;
		_area_color = __area_color.rgba;
		_line_color = __line_color.rgba;

		// largura da linha de desenho visivel
		var _line_width = 1;
		if(_serie.linewidth) _line_width = _serie.linewidth;
		
		// sombra (apenas para linha)
		var _shadow = 0;
		var _shadow_color = '';
		if(_type=='line') _shadow = _serie.shadow;
		if(_shadow) _shadow_color = palette.get('#0003').rgba;

		// exportar oficialmente
		jchart_list[_nid].series[_seid].color = _base_color;
		jchart_list[_nid].series[_seid].areacolor = _area_color;
		jchart_list[_nid].series[_seid].linecolor = _line_color;
	}
	// init de cores basicas
	//stdlib.logit("bgcolor="+jchart_list[_nid].bgcolor);
	jchart_list[_nid].bgcolor = jchart_list[_nid].bgcolor=='transparent'?'#ffffffff' : palette.get(jchart_list[_nid].bgcolor).rgba;
	jchart_list[_nid].color = palette.get(jchart_list[_nid].color).rgba;
	return(true);
}

// funcao para inicializar o grafico
function jchart_rate_start(_nid){
	var _html = '';
	var _st;

	// instalar canvas do draw e da legenda
	var _draw = {
		width: jchart_list[_nid].width,
		height: jchart_list[_nid].height,
		border: 'none',
		top: 0,
		right: 0,
		position: 'absolute',
		z: 1	
	};
	_st = stdlib.mkstyle(_draw);
	_html  = '<canvas id="'+jchart_list[_nid].draw_canvas_id+'"';
	_html += ' width="'+_draw.width+'"';
	_html += ' height="'+_draw.height+'"';
	_html += ' class="jchart_canvas_draw" style="'+_st+'">Err: HTML5 nao suportado.</canvas>';
	stdlib.set_html(jchart_list[_nid].draw_id, _html);

}

// limpar grafico
function jchart_rate_clear(_nid){
	if(!jchart_list[_nid]._canvas) jchart_list[_nid]._canvas = stdlib.getdom(jchart_list[_nid].canvas_id);
	if(jchart_list[_nid]._canvas) jchart_list[_nid]._canvas.width = jchart_list[_nid]._canvas.width;
	if(jchart_list[_nid]._draw) jchart_list[_nid]._draw.width = jchart_list[_nid]._draw.width;
}

// função de impressão da queue no canvas, atualizacao de legendas
function jchart_rate_chart_print(_nid){

	// limpar tela
	jchart_rate_clear(_nid);

	// calcula estatisticas e imprimir labels, perpixel depende de print_stats
	jchart_rate_print_stats(_nid);
	
	// palco de desenho
	if(!jchart_list[_nid]._canvas) jchart_list[_nid]._canvas = stdlib.getdom(jchart_list[_nid].canvas_id);
	if(!jchart_list[_nid]._canvas){
		stdlib.debug("FATAL, impossivel pegar o canvas", true);
		return;
	}
	// criar contexto para desenhar
	var _chart = jchart_list[_nid]._canvas.getContext("2d");

	
	// calcular relacao entre unicade de valor e pixel
	//jchart_list[_nid]._perpixel = jchart_list[_nid].chart.height / jchart_list[_nid]._max;
	var _perpixel = jchart_list[_nid]._perpixel;
	
	// ultimas posicoes registradas para uso do desenho atual
	var _last_x = 0;
	var _last_y = 0;

	// dimensoes
	var _width = jchart_list[_nid].chart.width;
	var _height = jchart_list[_nid].chart.height;

	// calcular largura da coluna
	var _cols = jchart_list[_nid].columns;
	var _colwidth = _width / _cols;

	// posicao de inicio
	var _x_start = jchart_list[_nid]._xstart;
	//var _x_stop = _width;
	//var _y_start = 0;
	var _y_stop = _height;
	
	// desenhar linhas divisoras

	// altura da linha divisoria
	var _hline_height = _height / 10;
	for(var _k = _hline_height; _k < _height; _k+=_hline_height){
		// desenhar linha/linha delineadora			
		_chart.beginPath();
		_chart.lineWidth = 0.3;
		_chart.strokeStyle = 'rgba(255,255,255,0.5)';
		_chart.moveTo(0, _k);
		_chart.lineTo(_width, _k);
		_chart.stroke();
	}


	// percorrer queue e desenhar graficos e linhas!
	for(var _seid in jchart_list[_nid].series){
		//if(_seid!='a') continue;

		var _serie = jchart_list[_nid].series[_seid];
		var _type = _serie.type;
		var _c = 0;

		// cor da serie
		var _base_color = _serie.color;
		var _area_color = _serie.areacolor;
		var _line_color = _serie.linecolor;

		// largura da linha de desenho visivel
		var _line_width = 1;
		if(_serie.linewidth) _line_width = _serie.linewidth;
		
		// sombra (apenas para linha)
		var _shadow = 0;
		var _shadow_color = '';
		if(_type=='line') _shadow = _serie.shadow;
		if(_shadow) _shadow_color = palette.get('#0003').rgba;
		

		for(var _i = 1; _i <= jchart_list[_nid]._qsize; _i++){
			var _slot = jchart_list[_nid].queue[_i];
			if(_slot==false||_slot==-1) continue;
			var _v = _slot[_seid];
			// posicao relativa dessa representacao (x inicial)
			var _temp_x = _x_start + (_colwidth * _i) - _colwidth;
			var _temp_y = _y_stop - (_v * _perpixel);

			// segundo passo, desenhar
			if(_c){
				// desenhar preenchimento para area
				if(_type=='area'){
					// linha de desenho, invisivel
					_chart.lineWidth = 0;
					_chart.strokeStyle = "rgba(255,255,255,0.0)";
					_chart.beginPath();
					_chart.fillStyle=_area_color;
					_chart.lineTo(_temp_x, _temp_y);
					_chart.lineTo(_temp_x, _y_stop);
					_chart.lineTo(_last_x, _y_stop);
					_chart.lineTo(_last_x, _last_y);
					//_chart.endFill();
					_chart.closePath();
					_chart.fill();
					_chart.stroke();
				}
				
				// desenhar linha/linha delineadora			
				_chart.beginPath();
				_chart.lineJoin = "round";
				_chart.lineCap = "round";
				_chart.lineWidth = _line_width;
				_chart.strokeStyle = _line_color;
				_chart.moveTo(_last_x, _last_y);
				_chart.lineTo(_temp_x, _temp_y);
				_chart.stroke();
				
				// desenhar sombra da linha
				if(_shadow){
					_chart.beginPath();
					_chart.lineJoin = "round";
					_chart.lineCap = "round";
					_chart.lineWidth = _shadow;
					_chart.strokeStyle = _shadow_color;
					_chart.moveTo(_last_x-1, _last_y+_shadow);
					_chart.lineTo(_temp_x-1, _temp_y+_shadow);
					_chart.stroke();
				}

			}else{
				// primeiro passo, colocar cursor no ponto para que o proximo passo ja desenhe a linha adiante
				_chart.moveTo(_temp_x, _temp_y);
			}
			_chart.moveTo(_temp_x, _temp_y);
			_last_x = _temp_x;
			_last_y = _temp_y;
			_c++;
		}
	}
}

// funcao para receber dados JSON enviados pelo servidor
/*
	formato do json:
	{
		a: 30,
		b: 33,
		c: 29,
		...	
	}
	chaves ignoradas: sucess, error, errno
*/
function jchart_rate_rx(_nid, _json){
	if('object'!=typeof(_json)) return;

	// repassar para funcao de pre-processamento
	if(typeof(jchart_list[_nid].onpreset)=='function'){
		var _new_json;
		_new_json = jchart_list[_nid].onpreset(_nid, _json);
		if(typeof(_new_json)=='object') _json = _new_json;
	}

	// criar objeto do slot vazio
	var _slot = {};
	for(var _kx in jchart_list[_nid].series) _slot[_kx] = 0;

	// obter numeros
	for(var _wx in _json){
		if(_wx=='sucess'||_wx=='error'||_wx=='errno') continue;
		// procurar indece idx no slot
		for(var _tx in _slot) if(_tx==_wx) _slot[_wx] = stdlib.tofloat(_json[_wx]);	
	}
	
	// armazenar na fila
	jchart_rate_fifo(_nid, _slot);
	
	// imprimir queue dentro do grafico
	jchart_rate_chart_print(_nid);

	// repassar para funcao de entrada
	if(typeof(jchart_list[_nid].onset)=='function') jchart_list[_nid].onset(_nid, _json, _slot);
	
}

// limpar a fila de valores
function jchart_rate_flush(_nid){
	var _queue_size = jchart_list[_nid]._qsize;
	for(var _i = 1; _i <= _queue_size; _i++) jchart_list[_nid].queue[_i] = -1;
	// simulacao (comentar apos fim do desenvolvimento)
	//for(var _i = 1; _i <= _queue_size; _i++) jchart_list[_nid].queue[_i] = {a:stdlib.rrandom(100,140), b:stdlib.rrandom(20,40)};
}

// armazena slot na fila
function jchart_rate_fifo(_nid, _slot){
	var _queue_size = jchart_list[_nid]._qsize;

	// calcular maximo
	jchart_list[_nid]._max = 10;

	/*
		mover valores, o valor novo fica sempre no final, assim:
		1	2	
		2	3
		3	4
			5*
	*/
	for(var _i = 2; _i <= _queue_size; _i++){
		var _cp = jchart_list[_nid].queue[_i];
		if(typeof(_cp)=='object'){
			// slot movido!
			jchart_list[_nid].queue[_i-1] = stdlib.objcopy(_cp);
		}else{
			// valor vazio (-1) movido
			jchart_list[_nid].queue[_i-1] = -1;
		}
	}
	// hospedar novo valor
	jchart_list[_nid].queue[_queue_size] = _slot;
}



/*
	atualizar estatisticas e valores
*/
function jchart_rate_print_stats(_nid){
	var _queue_size = jchart_list[_nid]._qsize;
	var _si;
	// iniciar stats
	jchart_list[_nid]._stats = {};

	/*
		calcular minimo, media e maximo de todas as series
	*/
	for(_si in jchart_list[_nid].series){
		// inicializar dados estatisticos da serie
		jchart_list[_nid]._stats[_si] = {
			_count: 0,		// total de elementos preenchidos
			_total: 0,		// total somado de tudo
			_max: false,	// valor maximo
			_min: false,	// valor minimo
			_cur: false,	// valor corrente
			_avg: false		// valor medio
		};
	}

	// percorrer queue e coletar estatisticas
	var _i;
	var _si;
	for(_i = 1; _i <= _queue_size; _i++){
		var _slot =  jchart_list[_nid].queue[_i];
		if(_slot===false||_slot==-1) continue;

		for(_si in _slot){
			var _v = _slot[_si];
			if(stdlib.isfalse(_v)||_v==-1) continue;
			jchart_list[_nid]._stats[_si]._count++;
			// coletar maximo
			if(jchart_list[_nid]._stats[_si]._max==false || _v > jchart_list[_nid]._stats[_si]._max){
				jchart_list[_nid]._stats[_si]._max = _v;
			}
			// coletar minimo
			if(jchart_list[_nid]._stats[_si]._min==false || _v < jchart_list[_nid]._stats[_si]._min){
				jchart_list[_nid]._stats[_si]._min = _v;
			}

			// calcular total
			jchart_list[_nid]._stats[_si]._total += _v;

			// coletar ultimo valor
			jchart_list[_nid]._stats[_si]._cur = _v;
		}
	}

	// resumir estatistica (media)
	var _si;
	jchart_list[_nid]._max = 10;
	jchart_list[_nid]._min = false;
	for(_si in jchart_list[_nid].series){
		// calcular media
		jchart_list[_nid]._stats[_si]._avg = 0;
		if(jchart_list[_nid]._stats[_si]._total && jchart_list[_nid]._stats[_si]._count){
			jchart_list[_nid]._stats[_si]._avg = jchart_list[_nid]._stats[_si]._total / jchart_list[_nid]._stats[_si]._count;
		}
		// calcular maximo
		if(jchart_list[_nid]._stats[_si]._max > jchart_list[_nid]._max) jchart_list[_nid]._max = jchart_list[_nid]._stats[_si]._max;

		// calcular minimo
		if(jchart_list[_nid]._min===false || jchart_list[_nid]._stats[_si]._min < jchart_list[_nid]._min) jchart_list[_nid]._min = jchart_list[_nid]._stats[_si]._min;
		
		// a quantidade de qualquer serie é o total de slots
		jchart_list[_nid]._count = jchart_list[_nid]._stats[_si]._count;
	}
	
	// calcular valor maximo da linha superior
	jchart_list[_nid]._topmax = jchart_list[_nid]._max;
	// buscar valores de grandeze
	var _g = 10;
	var _jg;
	for(_jg = 100; true; _jg *= 10){
		if(jchart_list[_nid]._topmax < _jg){
			_g = _jg / 10;
			break;
		}
	}
	// grandeza obtida, procurar valores com intervalos de 40% até encontrar teto mais proximo
	var _pc = _g * 0.4; if(_pc < 2) _pc = 2;
	var _top = jchart_list[_nid]._topmax;
	jchart_list[_nid]._topmax = 0;
	while(jchart_list[_nid]._topmax < _top) jchart_list[_nid]._topmax += _pc;
	if(jchart_list[_nid]._topmax==jchart_list[_nid]._max) jchart_list[_nid]._topmax+=_pc;

	// calcular relacao entre pixel e valor maximo representavel
	jchart_list[_nid]._perpixel = jchart_list[_nid].chart.height / jchart_list[_nid]._topmax;

	// preencher canvas de informacoes estatisticas
	// palco de desenho
	if(!jchart_list[_nid]._draw) jchart_list[_nid]._draw = stdlib.getdom(jchart_list[_nid].draw_canvas_id);
	if(!jchart_list[_nid]._draw){
		stdlib.debug("FATAL, impossivel pegar o canvas DRAW", true);
		return;
	}
	// criar contexto para desenhar
	var _draw = jchart_list[_nid]._draw.getContext("2d");
	
	// limpar
	// referencias locais de localizacao do convas do grafico
	var _left = jchart_list[_nid].width - jchart_list[_nid].chart.width - jchart_list[_nid].chart.right;
	var _top = jchart_list[_nid].chart.top+1; // incremento da borta
	var _bottom = jchart_list[_nid].chart.top + jchart_list[_nid].chart.height;
	var _height = _bottom - _top;
	// dados do canvas
	var _cwidth = jchart_list[_nid].chart.width;
	var _cheight = jchart_list[_nid].chart.height;
	// desenhar linhas divisoras e labels
	// obter salto entre valor base e linha superior
	var _vinterval = jchart_list[_nid]._topmax / 10;
	// altura da linha divisoria
	var _hline_height = _cheight / 10;
	_left-=10;
	var _m = 0;
	var _k;
	for(_k = _top; _k < _cheight+_top+_hline_height; _k+=_hline_height){
		// calcular valor a exibir
		var _v = (_vinterval*(10-_m));
		var _nv = _v;
		switch(jchart_list[_nid].dataformat){
			case 'bit':
				_nv = stdlib.size_format(_v, '.', ',')+(_v<1024?' ':'')+'bit';
				//stdlib.logit("bit value: nv="+_nv+" v="+_v);
				break;
			case 'byte':
				_nv = stdlib.size_format(_v, '.', ',')+(_v<1024?' ':'')+'bit';
				break;
			default:
				_nv = _nv.toFixed(2);
		}
		_v = _nv;
		if(_v<0) continue;
		
		// desenhar linha/linha delineadora	ao lado do valor a esquerda		
		_draw.beginPath();
		_draw.lineWidth = 1;
		_draw.strokeStyle = 'rgba(0,0,0,3)';
		_draw.moveTo(_left+2, _k);
		_draw.lineTo(_left+8, _k);
		_draw.stroke();	

	
		// colocar textos nas linhas indicadores
		_draw.fillStyle = jchart_list[_nid].color;
		_draw.font = "10pt Helvetica";
		_draw.textAlign = "right";
		_draw.textBaseline = "middle";
		if(jchart_list[_nid].fixedsize!==false && 'number'==typeof(_v)) _v = _v.toFixed(jchart_list[_nid].fixedsize);
		
		// valor no label lateral
		_draw.fillText(_v, _left-2, _k);
		
		_m++;
	}

	// imprimir series com valores correntes, minimo, medio, maximo
	var _n = 1;
	var _y_start = _bottom+4;		// distancia do topo
	var _x_start = _left+10;	// distancia da linha esquerda do grafico
	var _y_distance = 22;			// distancia entre series
	
	// imprimir cabecalho das tabelas
	// largura disponivel para isso
	var _label_width = 60;
	var _width_table = _cwidth - _label_width;	// largura do grafico menos o usado para o label da serie
	var _x_table = _x_start + _label_width;
	var _y_table = _y_start + 10;
	var _interval_table = (_width_table / 4)-1;
	var _headers = {_cur: 'Atual', _min: 'Mínimo', _avg: 'Média', _max: 'Máximo'};
	var _h = 1;
	for(var _ih in _headers){
		_draw.fillStyle = jchart_list[_nid].color;
		_draw.font = "9pt Helvetica";
		_draw.textAlign = "right";
		_draw.textBaseline = "baseline";
		_draw.fillText(_headers[_ih], _x_table+(_interval_table*_h)+1, _y_table);
		_h++;
	}
	
	// imprimir series
	for(var _seid in jchart_list[_nid].series){
		var _serie = jchart_list[_nid].series[_seid];
		var _y = _y_start + (_n*_y_distance);
		var _x = _x_start;
		var _type = _serie.type;
		
		// icone da serie
		switch(_type){
			case 'area':
				// quadrado
				_draw.lineWidth = 1;
				_draw.strokeStyle = _serie.linecolor;
				_draw.beginPath();
				_draw.fillStyle=_serie.areacolor;
				var _sz = 13;
				_draw.moveTo(_x, _y);
				_draw.lineTo(_x+_sz, _y);
				_draw.lineTo(_x+_sz, _y+_sz);
				_draw.lineTo(_x, _y+_sz);
				_draw.lineTo(_x, _y);
				_draw.fill();
				_draw.closePath();
				_draw.stroke();
				break;
			case 'line':
				// linha
				var _lw = stdlib.toint(_serie.linewidth); if(!_lw) _lw = 1;
				_draw.lineWidth = _lw;
				_draw.strokeStyle = _serie.linecolor;
				_draw.beginPath();
				var _sz = 13;
				_draw.moveTo(_x, _y+_sz);
				_draw.lineTo(_x+_sz/2, _y);
				_draw.lineTo(_x+_sz, _y+_sz);
				_draw.stroke();
				break;
		}

		// label da serie
		_draw.fillStyle = jchart_list[_nid].color;
		_draw.font = "10pt Helvetica";
		_draw.textAlign = "left";
		_draw.textBaseline = "top";
		_draw.fillText(_serie.label, _x+18, _y);

		// imprimir valores
		var _xh = 1;
		for(var _xih in _headers){
			var _sv = jchart_list[_nid]._stats[_seid][_xih];

			// calcular valor a exibir
			var _nv = _sv;
			switch(jchart_list[_nid].dataformat){
				case 'bit':
					_nv = stdlib.size_format(_sv, '.', ',')+(_sv<1024?' ':'')+'bit';
					break;
				case 'byte':
					_nv = stdlib.size_format(_sv, '.', ',')+(_sv<1024?' ':'')+'bit';
					break;
				default:
					if(jchart_list[_nid].fixedsize!==false && 'number'==typeof(_nv)) _nv = _nv.toFixed(jchart_list[_nid].fixedsize);
					//_nv = _nv.toFixed(2);
			}
			_sv = _nv;
			_draw.fillStyle = jchart_list[_nid].color;
			_draw.font = "10pt Helvetica";
			_draw.textAlign = "right";
			_draw.textBaseline = "baseline";
			_draw.fillText(_sv, _x_table+(_interval_table*_xh), _y);
			_xh++;
		}	
		_n++;
	}
}


/* objeto criador de jchart */

	// Retornar serie padrao
	function jchart_serie_std(){
		var _serie = {
			label: 'Serie',
			color: '#aa0000',
			areacolor: '#00aa00',
			linecolor: '#0000aa',
			type: 'line',
			linewidth: 1,
			shadow: 1,
			sdraw: 1
		};
		return _serie;
	}

	// Criticar objeto
	function jchart_properties(_sid, _input){
		var _cht = {

		/* --------------------------------- PROPRIEDADES --------------------------------- */
			/* identificacao da janela */
			sid: '',						/* identificador de jtable - string */
			nid: 0,						/* identificador numerico do grid - numerico */
			domid: false,					/* identificador do div onde o grafico sera instalado */
	
			// tipos: procura modulo gerador em jchart_modules: rate, ping
			type: 'rate',
	
			// div do grafico deve ser relativa
			position: 'relative',
			
			/*
				objeto com propriedades modulares do grafico
			*/
			chart: {},
			
			// declaracao de series do grafico (quantidade de valores representados por tempo, como 2 colunas no mes, o down e up)
			series: {},
	
			// fila de dados
			queue: {},
			
			/* tipo de numeros
				bit
				byte
				money
				number
				kbit
				
			*/
			dataformat: 'bit',
			fixedsize: 0,
			
			// numero de colunas
			columns: 1,
			
			/*
				objeto com legenda vertical, normalmente a esquerda
			*/
			_: {},
	
			// motor de datasource
			loadmethod: 'static',
			datasource: false,
			uajax_nid: 0,
	
			// eventos do jchart
			onbuild: false,		/* evento executado apos construcao concluida */
			onreload: false,		/* evento disparado sempre que houver atualizacao de dados */

			// funcao de pre-processamento do retorno
			onpreset: false,
		
			// evento ao receber dados remotos (pos processados)
			onset: false,

			// eventos interativos
			onclick: false,		/* evento on-click global do ubuttons */
	
			/* dimensoes em pixels ou porcentagem */
			width: 500,
			height: 400,
			
			// cores
			bgcolor: '#fff',
			color: 'red'
	
		};

		/* importar propriedades do parametro */
		if('object'==typeof(_input))
			for(var _kx in _input)
				_cht[_kx]=_input[_kx];

		/* usar sid como dom padrao */
		_cht.sid = _sid;
		/* gerar id */
		_cht.nid = stdlib.str2number(_sid);

		// propriedades do grafico
		if('object'!=typeof(_cht.chart)) _cht.chart = {};

		// domid
		if(stdlib.isfalse(_cht.domid)) _cht.domid = _sid;

		// series
		if('object'!=typeof(_cht.series)) _cht.series = {};
		_cht.series_count = stdlib.objcount(_cht.series);

		// ids
		_cht.draw_id = _sid + '_draw';
		_cht.draw_canvas_id = _sid + '_drawcanvas';
		_cht.legend_id = _sid + '_legend';
		_cht.canvas_id = _sid + '_canvas';
		_cht.title_id = _sid +'_title';
		_cht.vaxis_id = _sid +'_vaxis';
		
		
		// objetos dom carregados
		_cht._canvas = false;
		_cht._draw = false;

		// sanatizar series
		if('object'!=typeof(_cht.series)) _cht.series = {};

		for(var _seid in _cht.series){
			var _s = _cht.series[_seid];
			if('object'!=typeof(_cht.series[_seid])) _s = {};
			var _df = jchart_serie_std();
			for(var _di in _df){
				if(!stdlib.keyexist(_s, _di)) _s[_di] = _df[_di];
				_s[_di] = stdlib.var_default(_s[_di], _df[_di]);
			}
			_s.label = jlang_detect(_s.label);
			_cht.series[_seid] = _s;
		}

		return(_cht);
	}

// obter dados remotamente

	// iniciar motor XHR para obtencão de conteudo
	function jchart_remote_up(_nid, _imediate){
		if('object'!=typeof(jchart_list[_nid])) return;
		_imediate = ('undefined'==typeof(_imediate) || !_imediate?0:1);

		// desativar preenchimento do motor na DOMID e EXEC
		jchart_list[_nid].inner = false;
		jchart_list[_nid].exec = false;
		jchart_list[_nid].cleanup = true;

		jchart_list[_nid].anchor = jchart_list[_nid].domid;
		jchart_list[_nid].loadmethod = 'json';
		jchart_list[_nid].datatype = 'json';

		// dar play em motor
		if(_imediate)
			cm_engine_request(_nid, 'jchart');
		else
			cm_engine_play(_nid, 'jchart');
		// -------------------------------------

	}

	// funcao que recebe dados remotos
	function jchart_reply(_nid, _json){
		// Adicionar dados ao modulo
		switch(jchart_list[_nid].type){
			case 'rate':
				jchart_rate_rx(_nid, _json);
				break;
			case 'ping':
				jchart_ping_rx(_nid, _json);
				break;
		}
	}


/*

	funcoes para desenhar formas

*/
jchart_shapes = {};







function draw_simple_losan(clip, xpos, ypos, width, height)
{
    with (clip)
    {
        moveTo(xpos + width / 2, ypos);
        lineTo(xpos + width, ypos + height / 2);
        lineTo(xpos + width / 2, ypos + height);
        lineTo(xpos, ypos + height / 2);
        lineTo(xpos + width / 2, ypos);
    } // End of with
} // End of the function
function draw_losan(op, clip)
{
    var _loc1 = chart_properties();
    _loc1.x = op.x;
    _loc1.y = op.y;
    _loc1.width = op.width;
    _loc1.height = op.height;
    _loc1.size = op.size;
    _loc1.fillcolor = op.fillcolor;
    _loc1.linecolor = op.linecolor;
    _loc1.linewidth = op.linewidth;
    _loc1.style = op.style;
    _loc1.valign = op.valign;
    _loc1.halign = op.halign;
    _loc1.gradientcolor = op.gradientcolor;
    if (_loc1.halign == "center")
    {
        _loc1.x = _loc1.x - _loc1.width / 2;
    }
    else if (_loc1.halign == "left")
    {
        _loc1.x = _loc1.x - _loc1.width;
    }
    else
    {
        _loc1.x = _loc1.x;
    } // end else if
    if (op.valign == "middle")
    {
        _loc1.y = _loc1.y - _loc1.height / 2;
    }
    else if (op.valign == "bottom")
    {
        _loc1.y = _loc1.y - _loc1.height;
    } // end else if
    var _loc11 = import_color(_loc1.fillcolor);
    var _loc19 = _loc11[0];
    var _loc22 = _loc11[1];
    var _loc21 = color_rgb2flash(rgbchange(_loc11[3], 80));
    var _loc20 = color_rgb2flash(rgbchange(_loc11[3], -150));
    var _loc24 = [_loc21, _loc20];
    var _loc26 = [_loc11[1], _loc11[1]];
    var _loc10 = new Array();
    if (count(_loc1.gradientcolor) == 0)
    {
        _loc1.gradientcolor = [rgbchange(_loc1.fillcolor, 80), rgbchange(_loc1.fillcolor, -150)];
    } // end if
    _loc10[0] = import_color(_loc1.gradientcolor[0]);
    _loc10[1] = import_color(_loc1.gradientcolor[1]);
    var _loc7 = [_loc10[0][0], _loc10[1][0]];
    var _loc8 = [_loc10[0][1], _loc10[1][1]];
    var _loc12 = [0, 255];
    var _loc16 = import_color(_loc1.linecolor);
    var _loc18 = _loc16[0];
    var _loc15 = _loc16[1];
    var _loc14 = _loc1.linewidth;
    if (_loc15 == 0)
    {
        _loc14 = 0;
    } // end if
    if (_loc14 == 0)
    {
        _loc15 = 0;
    } // end if
    clip.createEmptyMovieClip("losan1", clip.getNextHighestDepth());
    clip.losan1.lineStyle(_loc14, _loc18, _loc15);
    var _loc13 = _loc1.style;
    if (_loc13 == "losan")
    {
        clip.losan1.beginFill(_loc19, _loc22);
    }
    else if (instr(_loc13, "vlinear"))
    {
        var _loc17 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 3.141593};
        clip.losan1.beginGradientFill("linear", _loc7, _loc8, _loc12, _loc17);
    }
    else if (instr(_loc13, "radial"))
    {
        _loc17 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 3.141593};
        clip.losan1.beginGradientFill("radial", _loc7, _loc8, _loc12, _loc17);
    }
    else
    {
        _loc17 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 1.570796};
        clip.losan1.beginGradientFill("linear", _loc7, _loc8, _loc12, _loc17);
    } // end else if
    draw_simple_losan(clip.losan1, _loc1.x, _loc1.y, _loc1.width, _loc1.height);
    clip.losan1.endFill();
    var _loc9 = [0, 0, 0];
    if (instr(_loc1.style, "double"))
    {
        _loc9[0] = 1;
    } // end if
    if (instr(_loc1.style, "triple"))
    {
        _loc9[1] = 1;
    } // end if
    if (instr(_loc1.style, "quadruple"))
    {
        _loc9[2] = 1;
    } // end if
    var _loc4 = chart_properties();
    _loc4.x = _loc1.x + _loc1.width / 6;
    _loc4.y = _loc1.y + _loc1.height / 6;
    _loc4.width = _loc1.width / 2 + _loc1.width / 6;
    _loc4.height = _loc1.height / 2 + _loc1.height / 6;
    _loc4.halign = _loc1.halign;
    _loc4.valign = _loc1.valign;
    var _loc3 = chart_properties();
    _loc3.x = _loc4.x + _loc4.width / 8;
    _loc3.y = _loc4.y + _loc4.height / 8;
    _loc3.width = _loc4.width / 2 + _loc4.width / 4;
    _loc3.height = _loc4.height / 2 + _loc4.height / 4;
    _loc3.halign = _loc4.halign;
    _loc3.valign = _loc4.valign;
    var _loc5 = chart_properties();
    _loc5.x = _loc3.x + _loc3.width / 8;
    _loc5.y = _loc3.y + _loc3.height / 8;
    _loc5.width = _loc3.width / 2 + _loc3.width / 4;
    _loc5.height = _loc3.height / 2 + _loc3.height / 4;
    _loc5.halign = _loc3.halign;
    _loc5.valign = _loc3.valign;
    if (_loc9[0])
    {
        clip.createEmptyMovieClip("losan2", clip.getNextHighestDepth());
        clip.losan2.lineStyle(0, 16777215, 0);
        _loc17 = {matrixType: "box", x: _loc4.x, y: _loc4.y, w: _loc4.width, h: _loc4.height, r: 1.570796};
        clip.losan2.beginGradientFill("linear", [_loc7[1], _loc7[0]], _loc8, _loc12, _loc17);
        draw_simple_losan(clip.losan2, _loc4.x, _loc4.y, _loc4.width, _loc4.height);
        clip.losan2.endFill();
    } // end if
    if (_loc9[1])
    {
        clip.createEmptyMovieClip("losan3", clip.getNextHighestDepth());
        clip.losan3.lineStyle(0, 16777215, 0);
        _loc17 = {matrixType: "box", x: _loc3.x, y: _loc3.y, w: _loc3.width, h: _loc3.height, r: 1.570796};
        clip.losan3.beginGradientFill("linear", _loc7, _loc8, _loc12, _loc17);
        draw_simple_losan(clip.losan3, _loc3.x, _loc3.y, _loc3.width, _loc3.height);
        clip.losan3.endFill();
    } // end if
    if (_loc9[2])
    {
        clip.createEmptyMovieClip("losan4", clip.getNextHighestDepth());
        clip.losan4.lineStyle(0, 16777215, 0);
        _loc17 = {matrixType: "box", x: _loc5.x, y: _loc5.y, w: _loc5.width, h: _loc5.height, r: 1.570796};
        clip.losan4.beginGradientFill("linear", [_loc7[1], _loc7[0]], _loc8, _loc12, _loc17);
        draw_simple_losan(clip.losan4, _loc5.x, _loc5.y, _loc5.width, _loc5.height);
        clip.losan4.endFill();
    } // end if
} // End of the function
function draw_simple_rectangle(clip, xpos, ypos, width, height)
{
    with (clip)
    {
        moveTo(xpos, ypos);
        lineTo(xpos + width, ypos);
        lineTo(xpos + width, ypos + height);
        lineTo(xpos, ypos + height);
        lineTo(xpos, ypos);
    } // End of with
} // End of the function
function draw_rectangle(op, clip)
{
    var _loc1 = chart_properties();
    _loc1.x = op.x;
    _loc1.y = op.y;
    _loc1.width = op.width;
    _loc1.height = op.height;
    _loc1.size = op.size;
    _loc1.fillcolor = op.fillcolor;
    _loc1.linecolor = op.linecolor;
    _loc1.linewidth = op.linewidth;
    _loc1.style = op.style;
    _loc1.valign = op.valign;
    _loc1.halign = op.halign;
    _loc1.gradientcolor = op.gradientcolor;
    if (_loc1.halign == "center")
    {
        _loc1.x = _loc1.x - _loc1.width / 2;
    }
    else if (_loc1.halign == "left")
    {
        _loc1.x = _loc1.x - _loc1.width;
    }
    else
    {
        _loc1.x = _loc1.x;
    } // end else if
    if (_loc1.valign == "middle")
    {
        _loc1.y = _loc1.y - _loc1.height / 2;
    }
    else if (_loc1.valign == "bottom")
    {
        _loc1.y = _loc1.y - _loc1.height;
    } // end else if
    var _loc11 = import_color(_loc1.fillcolor);
    var _loc19 = _loc11[0];
    var _loc22 = _loc11[1];
    var _loc21 = color_rgb2flash(rgbchange(_loc11[3], 80));
    var _loc20 = color_rgb2flash(rgbchange(_loc11[3], -150));
    var _loc24 = [_loc21, _loc20];
    var _loc26 = [_loc11[1], _loc11[1]];
    var _loc10 = new Array();
    if (count(_loc1.gradientcolor) == 0)
    {
        _loc1.gradientcolor = [rgbchange(_loc1.fillcolor, 80), rgbchange(_loc1.fillcolor, -80)];
    } // end if
    _loc10[0] = import_color(_loc1.gradientcolor[0]);
    _loc10[1] = import_color(_loc1.gradientcolor[1]);
    var _loc7 = [_loc10[0][0], _loc10[1][0]];
    var _loc8 = [_loc10[0][1], _loc10[1][1]];
    var _loc12 = [0, 255];
    var _loc16 = import_color(_loc1.linecolor);
    var _loc18 = _loc16[0];
    var _loc15 = _loc16[1];
    var _loc14 = _loc1.linewidth;
    if (_loc15 == 0)
    {
        _loc14 = 0;
    } // end if
    if (_loc14 == 0)
    {
        _loc15 = 0;
    } // end if
    clip.createEmptyMovieClip("box1", clip.getNextHighestDepth());
    clip.box1.lineStyle(_loc14, _loc18, _loc15);
    var _loc13 = _loc1.style;
    if (_loc13 == "box")
    {
        clip.box1.beginFill(_loc19, _loc22);
    }
    else if (instr(_loc13, "vlinear"))
    {
        var _loc17 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 3.141593};
        clip.box1.beginGradientFill("linear", _loc7, _loc8, _loc12, _loc17);
    }
    else if (instr(_loc13, "radial"))
    {
        _loc17 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 3.141593};
        clip.box1.beginGradientFill("radial", _loc7, _loc8, _loc12, _loc17);
    }
    else
    {
        _loc17 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 1.570796};
        clip.box1.beginGradientFill("linear", _loc7, _loc8, _loc12, _loc17);
    } // end else if
    draw_simple_rectangle(clip.box1, _loc1.x, _loc1.y, _loc1.width, _loc1.height);
    clip.box1.endFill();
    var _loc9 = [0, 0, 0];
    if (instr(_loc1.style, "double"))
    {
        _loc9[0] = 1;
    } // end if
    if (instr(_loc1.style, "triple"))
    {
        _loc9[1] = 1;
    } // end if
    if (instr(_loc1.style, "quadruple"))
    {
        _loc9[2] = 1;
    } // end if
    var _loc4 = chart_properties();
    _loc4.x = _loc1.x + _loc1.width / 6;
    _loc4.y = _loc1.y + _loc1.height / 6;
    _loc4.width = _loc1.width / 2 + _loc1.width / 6;
    _loc4.height = _loc1.height / 2 + _loc1.height / 6;
    _loc4.halign = _loc1.halign;
    _loc4.valign = _loc1.valign;
    var _loc3 = chart_properties();
    _loc3.x = _loc4.x + _loc4.width / 8;
    _loc3.y = _loc4.y + _loc4.height / 8;
    _loc3.width = _loc4.width / 2 + _loc4.width / 4;
    _loc3.height = _loc4.height / 2 + _loc4.height / 4;
    _loc3.halign = _loc4.halign;
    _loc3.valign = _loc4.valign;
    var _loc5 = chart_properties();
    _loc5.x = _loc3.x + _loc3.width / 8;
    _loc5.y = _loc3.y + _loc3.height / 8;
    _loc5.width = _loc3.width / 2 + _loc3.width / 4;
    _loc5.height = _loc3.height / 2 + _loc3.height / 4;
    _loc5.halign = _loc3.halign;
    _loc5.valign = _loc3.valign;
    if (_loc9[0])
    {
        clip.createEmptyMovieClip("box2", clip.getNextHighestDepth());
        clip.box2.lineStyle(0, 16777215, 0);
        _loc17 = {matrixType: "box", x: _loc4.x, y: _loc4.y, w: _loc4.width, h: _loc4.height, r: 1.570796};
        clip.box2.beginGradientFill("linear", [_loc7[1], _loc7[0]], _loc8, _loc12, _loc17);
        draw_simple_rectangle(clip.box2, _loc4.x, _loc4.y, _loc4.width, _loc4.height);
        clip.box2.endFill();
    } // end if
    if (_loc9[1])
    {
        clip.createEmptyMovieClip("box3", clip.getNextHighestDepth());
        clip.box3.lineStyle(0, 16777215, 0);
        _loc17 = {matrixType: "box", x: _loc3.x, y: _loc3.y, w: _loc3.width, h: _loc3.height, r: 1.570796};
        clip.box3.beginGradientFill("linear", _loc7, _loc8, _loc12, _loc17);
        draw_simple_rectangle(clip.box3, _loc3.x, _loc3.y, _loc3.width, _loc3.height);
        clip.box3.endFill();
    } // end if
    if (_loc9[2])
    {
        clip.createEmptyMovieClip("box4", clip.getNextHighestDepth());
        clip.box4.lineStyle(0, 16777215, 0);
        _loc17 = {matrixType: "box", x: _loc5.x, y: _loc5.y, w: _loc5.width, h: _loc5.height, r: 1.570796};
        clip.box4.beginGradientFill("linear", [_loc7[1], _loc7[0]], _loc8, _loc12, _loc17);
        draw_simple_rectangle(clip.box4, _loc5.x, _loc5.y, _loc5.width, _loc5.height);
        clip.box4.endFill();
    } // end if
} // End of the function
function draw_simple_circle(clip, xpos, ypos, raio)
{
    if (raio == 0)
    {
        raio = 250;
    } // end if
    var l_steps = 16;
    var l_raio = raio;
    var l_xpos = xpos + raio;
    var l_ypos = ypos + raio;
    var l_parth = 360 / l_steps / 180 * 3.141593;
    var l_angulo = 0;
    var l_angulom = 0;
    var l_ctrlraio = l_raio / Math.cos(l_parth / 2);
    with (clip)
    {
        moveTo(l_xpos + l_raio, l_ypos);
        var ii = 0;
        while (ii < l_steps)
        {
            l_angulo = l_angulo + l_parth;
            l_angulom = l_angulo - l_parth / 2;
            cx = l_xpos + Math.cos(l_angulom) * l_ctrlraio;
            cy = l_ypos + Math.sin(l_angulom) * l_ctrlraio;
            px = l_xpos + Math.cos(l_angulo) * l_raio;
            py = l_ypos + Math.sin(l_angulo) * l_raio;
            curveTo(cx, cy, px, py);
            ++ii;
        } // end while
        endFill();
    } // End of with
} // End of the function
function draw_circle(op, clip)
{
    var _loc1 = chart_properties();
    _loc1.x = op.x;
    _loc1.y = op.y;
    _loc1.width = op.width;
    _loc1.height = op.height;
    _loc1.size = op.size;
    _loc1.fillcolor = op.fillcolor;
    _loc1.linecolor = op.linecolor;
    _loc1.linewidth = op.linewidth;
    _loc1.style = op.style;
    _loc1.valign = op.valign;
    _loc1.halign = op.halign;
    _loc1.gradientcolor = op.gradientcolor;
    _loc1.radius = op.radius;
    if (_loc1.radius == 0)
    {
        _loc1.radius = _loc1.width / 2;
    } // end if
    if (_loc1.radius == 0)
    {
        _loc1.radius = _loc1.height / 2;
    } // end if
    if (_loc1.radius == 0)
    {
        _loc1.radius = 20;
    } // end if
    _loc1.width = _loc1.radius * 2;
    _loc1.height = _loc1.radius * 2;
    if (_loc1.halign == "center")
    {
        _loc1.x = _loc1.x - _loc1.radius;
    }
    else if (_loc1.halign == "left")
    {
        _loc1.x = _loc1.x - _loc1.width;
    }
    else
    {
        _loc1.x = _loc1.x;
    } // end else if
    if (op.valign == "middle")
    {
        _loc1.y = _loc1.y - _loc1.radius;
    }
    else if (op.valign == "bottom")
    {
        _loc1.y = _loc1.y - _loc1.height;
    } // end else if
    var _loc6 = import_color(_loc1.fillcolor);
    var _loc16 = _loc6[0];
    var _loc19 = _loc6[1];
    var _loc18 = color_rgb2flash(rgbchange(_loc6[3], 80));
    var _loc17 = color_rgb2flash(rgbchange(_loc6[3], -150));
    var _loc22 = [_loc18, _loc17];
    var _loc24 = [_loc6[1], _loc6[1]];
    var _loc5 = new Array();
    if (count(_loc1.gradientcolor) == 0)
    {
        _loc1.gradientcolor = [rgbchange(_loc1.fillcolor, 80), rgbchange(_loc1.fillcolor, -150)];
    } // end if
    if (instr(_loc1.style, "glass"))
    {
        _loc1.gradientcolor = [rgbchange(_loc1.fillcolor, 20), rgbchange(_loc1.fillcolor, -20)];
    } // end if
    _loc5[0] = import_color(_loc1.gradientcolor[0]);
    _loc5[1] = import_color(_loc1.gradientcolor[1]);
    var _loc9 = [_loc5[0][0], _loc5[1][0]];
    var _loc7 = [_loc5[0][1], _loc5[1][1]];
    var _loc8 = [0, 255];
    var _loc12 = import_color(_loc1.linecolor);
    var _loc14 = _loc12[0];
    var _loc11 = _loc12[1];
    var _loc10 = _loc1.linewidth;
    if (_loc11 == 0)
    {
        _loc10 = 0;
    } // end if
    if (_loc10 == 0)
    {
        _loc11 = 0;
    } // end if
    if (instr(_loc1.style, "glass"))
    {
        _loc7 = [20, 100];
    } // end if
    clip.createEmptyMovieClip("box1", clip.getNextHighestDepth());
    clip.box1.lineStyle(_loc10, _loc14, _loc11);
    if (instr(_loc1.style, "hlinear"))
    {
        var _loc13 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 1.570796};
        clip.box1.beginGradientFill("linear", _loc9, _loc7, _loc8, _loc13);
    }
    else if (instr(_loc1.style, "vlinear"))
    {
        _loc13 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 3.141593};
        clip.box1.beginGradientFill("linear", _loc9, _loc7, _loc8, _loc13);
    }
    else if (instr(_loc1.style, "radial"))
    {
        _loc13 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 3.141593};
        clip.box1.beginGradientFill("radial", _loc9, _loc7, _loc8, _loc13);
    }
    else
    {
        clip.box1.beginFill(_loc16, _loc19);
    } // end else if
    draw_simple_circle(clip.box1, _loc1.x, _loc1.y, _loc1.width / 2);
    clip.box1.endFill();
    var _loc2 = chart_properties();
    _loc2.radius = (_loc1.width - _loc1.width / 10) / 2;
    _loc2.width = _loc2.radius * 2;
    _loc2.x = _loc1.x + (_loc1.width - _loc2.width) / 2;
    _loc2.y = _loc1.y + (_loc1.width - _loc2.width) / 4;
    _loc2.width = _loc1.width / 2 + _loc1.width / 6;
    _loc2.height = _loc1.height / 2 + _loc1.height / 6;
    _loc2.halign = _loc1.halign;
    _loc2.valign = _loc1.valign;
    if (instr(_loc1.style, "cristal"))
    {
        clip.createEmptyMovieClip("cristal", clip.getNextHighestDepth());
        clip.cristal.lineStyle(0, 16777215, 0);
        var _loc20 = [16777215, 16777215];
        var _loc15 = [128, 0];
        _loc13 = {matrixType: "box", x: _loc2.x, y: _loc2.y, w: _loc2.width, h: _loc2.height, r: 1.570796};
        clip.cristal.beginGradientFill("linear", _loc20, _loc15, _loc8, _loc13);
        draw_simple_circle(clip.cristal, _loc2.x, _loc2.y, _loc2.radius);
        clip.cristal.endFill();
    } // end if
} // End of the function
function draw_simple_belem(clip, xpos, ypos, w, h)
{
    var _loc10 = [xpos + w / 2, ypos];
    var _loc9 = [xpos + w, ypos + h / 2];
    var _loc8 = [xpos + w / 2, ypos + h];
    var _loc7 = [xpos, ypos + h / 2];
    var _loc6 = [xpos + w / 8 * 3, ypos + h / 8 * 3];
    var _loc13 = [xpos + w / 8 * 5, ypos + h / 8 * 3];
    var _loc12 = [xpos + w / 8 * 5, ypos + h / 8 * 5];
    var _loc11 = [xpos + w / 8 * 3, ypos + h / 8 * 5];
    clip.moveTo(_loc6[0], _loc6[1]);
    clip.lineTo(_loc10[0], _loc10[1]);
    clip.lineTo(_loc13[0], _loc13[1]);
    clip.lineTo(_loc9[0], _loc9[1]);
    clip.lineTo(_loc12[0], _loc12[1]);
    clip.lineTo(_loc8[0], _loc8[1]);
    clip.lineTo(_loc11[0], _loc11[1]);
    clip.lineTo(_loc7[0], _loc7[1]);
    clip.lineTo(_loc6[0], _loc6[1]);
} // End of the function
function draw_belem(op, clip)
{
    var _loc1 = chart_properties();
    _loc1.x = op.x;
    _loc1.y = op.y;
    _loc1.width = op.width;
    _loc1.height = op.height;
    _loc1.fillcolor = op.fillcolor;
    _loc1.valign = op.valign;
    _loc1.halign = op.halign;
    if (_loc1.halign == "center")
    {
        _loc1.x = _loc1.x - _loc1.width / 2;
    }
    else if (_loc1.halign == "left")
    {
        _loc1.x = _loc1.x - _loc1.width;
    }
    else
    {
        _loc1.x = _loc1.x;
    } // end else if
    if (op.valign == "middle")
    {
        _loc1.y = _loc1.y - _loc1.height / 2;
    }
    else if (op.valign == "bottom")
    {
        _loc1.y = _loc1.y - _loc1.height;
    } // end else if
    var _loc12 = import_color(_loc1.fillcolor);
    var _loc15 = _loc12[0];
    var _loc16 = _loc12[1];
    var _loc4 = new Array();
    _loc4[0] = import_color(rgbchange(_loc1.fillcolor, 90));
    _loc4[1] = import_color(rgbchange(_loc1.fillcolor, -90));
    var _loc6 = [_loc4[0][0], _loc4[1][0]];
    var _loc7 = [_loc4[0][1], _loc4[1][1]];
    var _loc9 = [0, 255];
    var _loc11 = import_color(op.linecolor);
    var _loc10 = _loc11[0];
    var _loc5 = _loc11[1];
    var _loc8 = op.linewidth;
    if (isNaN(_loc10))
    {
        _loc5 = 0;
    } // end if
    if (_loc5 == 0)
    {
        _loc8 = 0;
    } // end if
    if (_loc8 == 0)
    {
        _loc5 = 0;
    } // end if
    clip.createEmptyMovieClip("belem", clip.getNextHighestDepth());
    clip.belem.lineStyle(_loc8, _loc10, _loc5);
    var _loc13 = op.style;
    if (_loc13 == "belem")
    {
        clip.belem.beginFill(_loc15, _loc16);
    }
    else if (instr(op.style, "vlinear"))
    {
        var _loc14 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 3.141593};
        clip.belem.beginGradientFill("linear", _loc6, _loc7, _loc9, _loc14);
    }
    else if (instr(op.style, "radial"))
    {
        _loc14 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 3.141593};
        clip.belem.beginGradientFill("radial", _loc6, _loc7, _loc9, _loc14);
    }
    else
    {
        _loc14 = {matrixType: "box", x: _loc1.x, y: _loc1.y, w: _loc1.width, h: _loc1.height, r: 1.570796};
        clip.belem.beginGradientFill("linear", _loc6, _loc7, _loc9, _loc14);
    } // end else if
    draw_simple_belem(clip.belem, _loc1.x, _loc1.y, _loc1.width, _loc1.height);
    clip.belem.endFill();
} // End of the function
function draw_simple_star(clip, xpos, ypos, w, h)
{
    var _loc12 = clip._alpha;
    clip._alpha = 0;
    var _loc3 = [100, 0];
    var _loc7 = [200, 72];
    var _loc6 = [162, 192];
    var _loc5 = [37, 192];
    var _loc4 = [0, 72];
    var _loc2 = [77, 72];
    var _loc11 = [123, 72];
    var _loc10 = [138, 117];
    var _loc9 = [100, 146];
    var _loc8 = [62, 117];
    alineto(clip, _loc2, _loc3);
    clip.moveTo(_loc2[0], _loc2[1]);
    clip.lineTo(_loc3[0], _loc3[1]);
    clip.lineTo(_loc11[0], _loc11[1]);
    clip.lineTo(_loc7[0], _loc7[1]);
    clip.lineTo(_loc10[0], _loc10[1]);
    clip.lineTo(_loc6[0], _loc6[1]);
    clip.lineTo(_loc9[0], _loc9[1]);
    clip.lineTo(_loc5[0], _loc5[1]);
    clip.lineTo(_loc8[0], _loc8[1]);
    clip.lineTo(_loc4[0], _loc4[1]);
    clip.lineTo(_loc2[0], _loc2[1]);
    clip._height = h;
    clip._width = w;
    clip._x = xpos;
    clip._y = ypos;
    clip._alpha = _loc12;
} // End of the function
function draw_star(op, clip)
{
    var _loc1 = chart_properties();
    _loc1.x = op.x;
    _loc1.y = op.y;
    _loc1.width = op.width;
    _loc1.height = op.height;
    _loc1.fillcolor = op.fillcolor;
    _loc1.halign = op.halign;
    _loc1.valign = op.valign;
    if (_loc1.halign == "center")
    {
        _loc1.x = _loc1.x - _loc1.width / 2;
    }
    else if (_loc1.halign == "left")
    {
        _loc1.x = _loc1.x - _loc1.width;
    }
    else
    {
        _loc1.x = _loc1.x;
    } // end else if
    if (_loc1.valign == "middle")
    {
        _loc1.y = _loc1.y - _loc1.height / 2;
    }
    else if (_loc1.valign == "bottom")
    {
        _loc1.y = _loc1.y - _loc1.height;
    } // end else if
    var _loc13 = import_color(_loc1.fillcolor);
    var _loc15 = _loc13[0];
    var _loc16 = _loc13[1];
    var _loc4 = new Array();
    _loc4[0] = import_color(rgbchange(_loc1.fillcolor, 60));
    _loc4[1] = import_color(rgbchange(_loc1.fillcolor, -50));
    var _loc7 = [_loc4[0][0], _loc4[1][0]];
    var _loc8 = [_loc4[0][1], _loc4[1][1]];
    var _loc10 = [0, 255];
    var _loc12 = import_color(op.linecolor);
    var _loc11 = _loc12[0];
    var _loc5 = _loc12[1];
    var _loc9 = op.linewidth;
    if (isNaN(_loc11))
    {
        _loc5 = 0;
    } // end if
    if (_loc5 == 0)
    {
        _loc9 = 0;
    } // end if
    if (_loc9 == 0)
    {
        _loc5 = 0;
    } // end if
    clip.createEmptyMovieClip("star1", clip.getNextHighestDepth());
    clip.star1.lineStyle(_loc9, _loc11, _loc5);
    var _loc6 = op.style;
    if (_loc6 == "star")
    {
        clip.star1.beginFill(_loc15, _loc16);
    }
    else if (instr(_loc6, "vlinear"))
    {
        var _loc14 = {matrixType: "box", x: 0, y: 0, w: 200, h: 192, r: 3.141593};
        clip.star1.beginGradientFill("linear", _loc7, _loc8, _loc10, _loc14);
    }
    else if (instr(_loc6, "radial"))
    {
        _loc14 = {matrixType: "box", x: 0, y: 0, w: 200, h: 192, r: 3.141593};
        clip.star1.beginGradientFill("radial", _loc7, _loc8, _loc10, _loc14);
    }
    else
    {
        _loc14 = {matrixType: "box", x: 0, y: 0, w: 200, h: 192, r: 1.570796};
        clip.star1.beginGradientFill("linear", _loc7, _loc8, _loc10, _loc14);
    } // end else if
    draw_simple_star(clip.star1, _loc1.x, _loc1.y, _loc1.width, _loc1.height);
    clip.star1.endFill();
} // End of the function








