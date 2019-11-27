<?php

/* -----------------------------------------------------------------------------------------
	funcoes basicas que nao existem no PHP
----------------------------------------------------------------------------------------- */

	// retorna o timstamp javascript: timestamp com microtime
	function utime(){
		$r = 0;
		list($usec, $sec) = explode(" ", microtime());
		if(strpos($usec,".")!==false) list($r, $usec) = explode(".", $usec);
		$r = (float)($sec . substr($usec . "0000", 0, 3));
		return ($r); 
	}
	// calcular diferença entre valores
    function calc_dif($_start, $_end){$dif=($_end>$_start?$_end-$_start:$_start-$_end);if($dif<1)$dif=0;return($dif);}

	// sleep em ms
	function msleep($ms){ if($ms) usleep($ms*1000); }
	// sleep em decimos de segundos
	function dsleep($ms){ if($ms)usleep($ms*100000); }

	// - eregi php5 to php7
	if(!function_exists('eregi')){
		function eregi($regex, $str){
			return preg_match("/".$regex."/i", $str);
		}
	}
	// - ereg php5 to php7
	if(!function_exists('ereg')){
		function ereg($regex, $str){
			return preg_match("/".$regex."/", $str);
		}
	}
	// - ereg_replace php5 to php7
	if(!function_exists('ereg_replace')){
		function ereg_replace($pattern, $replacement, $string){
			return preg_replace('/'.$pattern.'/', $replacement, $string);
		}
	}
	// - eregi_replace php5 to php7
	if(!function_exists('eregi_replace')){
		function eregi_replace($pattern, $replacement, $string){
			return preg_replace('/'.$pattern.'/i', $replacement, $string);
		}
	}

	// obter chave de um array 
	function &_array(&$_arr, $_var, $_df=''){
		if (is_array($_arr) && array_key_exists($_var, $_arr)){
			$r =& $_arr[$_var];
		}else{
			$r = $_df;
		}
		return($r);
	}

	// codigos para depuração
	function _print($_debug_var, $_style='', $_title=false){
		if($_style==''){
			$_color_list = array('#fff','#36f','#4f4','#f44','#44f','#f4f','#ff4','#4ff');
			$_style = 'background-color: black; color: '.$_color_list[rand(0,7)];
		}
		echo '<pre style="'.$_style.'">';
		if($_title!==false) echo '<h1>'.$_title.'</h1>';
		print_r($_debug_var);
		echo '</pre>';
	}

	// função de log em arquivo
	function log_file($_file, $_str){
		// file: nome do arquivo na pasta de log
		// log: string a ser gravada no final do arquivo
		if($_file == '' || $_str == '') return(0);
		return(file_put_contents($_file, date("Y-m-d H:i:s") . " ".$_str."\n", FILE_APPEND));
	}
	
	// apagar arquivo sem warning
	function _unlink($_file){
		if(is_file($_file)) @unlink($_file);
	}

	// detecta modo de operacao do script
	// apx: rodando sob apache
	// cli: rodando em linha de comando
	function getmode(){ return(isset($GLOBALS['argc'])?'cli':'apx'); }

	// replace - trocar totalmente todas as ocorrencias em uma string pela nova ocorrencia
	function replace($_old, $_new, $_str){

		$_len = strlen($_str);
		if(!$_len) return($_str);
		
		$_i = 0;
		do {
			if(strpos($_str, $_old)!==false){
				$_str = str_replace($_old, $_new, $_str);
			}else{
				break;
			}
			$_i++;
		} while($_i<=$_len);
		return($_str);
	}

	// str_filter - limpar uma string
	// deixa apenas caracteres presentes em $_permited
	function &str_filter($_str, $_permited=false){
		$_ret = $_str;
		if(!is_string($_permited)) return($_ret);
		$_ret = '';
		$_len = strlen($_str);
		for($_i=0;$_i<$_len;$_i++){
			$_chr = substr($_str, $_i, 1);
			if(strpos($_permited, $_chr)!==false) $_ret.=$_chr;
		}
		return($_ret);
	}

	// encurtador de nomes
	function str_shortname($_name, $lang='pt'){	
		$_name = trim($_name);

		// converter nome para minusculas
		$xname = trim(strtolower($_name));
		
		// palavras ignoradas por linguagem
		$langs_ignore = array(
			'pt' => array('da', 'das', 'de', 'do', 'dos')
		);
		if(!isset($langs_ignore[$lang])) $lang = 'pt';
		
		// remover conects
		foreach($langs_ignore[$lang] as $cn) $xname = str_replace(' '.$cn.' ', ' ', $xname);
		// remover espacos duplos
		while(strpos($xname, '  ')!==false) $xname = str_replace('  ', ' ', $xname);
		
		// quebrar nome em partes
		$_parts = explode(' ', $xname);
		$wc = count($_parts);
		if($wc > 1){
			$sname = array();
			foreach($_parts as $k=>$w){
				// primeira e ultima palavra, ou palavra ja abreviada
				if(!$k || $k+1==$wc || (strlen($w)==2 && substr($w, -1)=='.')){
					$sname[] = ucfirst($w);
					continue;
				}
				// palavra do meio, abreviar
				$sname[] = strtoupper(substr($w, 0, 1)).'.';
			}
			$sname = implode(' ', $sname);
		}else{
			// nome ja abreviado ou nome unitario, usar original mesmo
			$sname = $_name;
		}
		return($sname);
	}


	// le arquivo com suporte a leitura partical do inicio e com controle e tamanho dos blocos e numero e linha
	function &read_file($_file, $_max_lines = 0, $_block_size = 4096) {
		$_file_content = "";
		$_line_num = 1;
		if(file_exists($_file)){
			if($_H = fopen($_file, 'r')){
				while(!feof($_H)){
					$_file_content .= fgets( $_H, $_block_size );
					if($_max_lines <= $_line_num && $_max_lines != 0) break;
					$_line_num++;
				}
				fclose($_H);
			}
		}
		return($_file_content);
	}

	// obter extensao de arquivo
	function file_extension($filename){
		$ext = '';
		$pp = strrpos($filename, '.');
		if($pp!==false) $ext = strtolower(substr($filename, $pp+1));
		return($ext);
	}

	// obter numero de arquivo
	function file_get_number($f){
		$n = 0;
		if(is_file($f)) $n = (int)file_get_contents($f);
		return $n;
	}

	// obter numero de arquivo
	function file_get($f){
		if(is_file($f)) return file_get_contents($f);
		return '';
	}


	// facilitar exibicao de numeros inteiros
	function int_sep($int){
		if(!is_int($int)) $int = (int)$int;
		return number_format($int, 0, ',', '.');
	}


	// remover acentos e cedilhas e afins
	function strplain($str){
		$a = array(
			'á' => 'a',
			'à' => 'a',
			'ã' => 'a',
			'â' => 'a',
			'í' => 'i',
			'ó' => 'o',
			'ô' => 'o',
			'õ' => 'o',
			'ú' => 'u',
			'ü' => 'u',
			'ç' => 'c',
			'Á' => 'A',
			'À' => 'A',
			'Ã' => 'A',
			'Â' => 'A',
			'É' => 'E',
			'Ê' => 'E',
			'Í' => 'I',
			'Ó' => 'O',
			'Ô' => 'O',
			'Õ' => 'O',
			'Ú' => 'U',
			'Ü' => 'U',
			'Ç' => 'C'
		);
		// conversao rapida de utf
		$str = str_replace(array_keys($a), array_values($a), $str);
		
		// conversao de acentos ascii
		return $str;
		/*
		
		$o = "áàãâéêíóôõúüçÁÀÃÂÉÊÍÓÔÕÚÜÇ";
		$n = "aaaaeeiooouucAAAAEEIOOOUUC";
		$l = strlen($o);
		for($i=0;$i<$l;$i++){
			$_o = substr($o, $i, 1); // caracter antigo
			$_n = substr($n, $i, 1); // caracter novo
			$str = str_replace($o, $n, $str);
		}
		return($str);
		*/
	}

	// listagem de elementos (diretorios, arquivos, links) em um diretorio
	// - nao retorno . e ..
	// - tipos: 0=diretorio, 1=arquivo, 2=link, 3=outro
	function &_dir($directory){
		$r = array();
		
		// alvo nao existe
		if(!is_dir($directory) && !is_link($directory)) return $r;
		
		// listar arquivos
		$d = dir($directory);
		while (false !== ($entry = $d->read())) {
			if($entry=='.'||$entry=='..') continue;
			
			// tipo
			$x = $directory.'/'.$entry;
			$t = 3;
			if(is_file($x))
				$t = 1;
			elseif(is_link($x))
				$t = 2;
			elseif(is_dir($x))
				$t = 0;
			//-

			$r[$x] = $t;
		}
		$d->close();
		return $r;
	}

	// listagem de sub-diretorios em um diretorio
	// - nao retorno . e ..
	function &_dir_folders($directory){
		$r = array();

		// alvo nao existe
		if(!is_dir($directory) && !is_link($directory)) return $r;

		// listar arquivos
		$d = dir($directory);
		$c = 0;
		while (false !== ($entry = $d->read())) {
			if($entry=='.'||$entry=='..') continue;
			// apenas diretorio
			$x = $directory.'/'.$entry;
			if(is_dir($x)) $r[$c] = $x;
			$c++;
		}
		$d->close();
		return $r;
	}

	// listagem de arquivos em um diretorio
	// - nao retorno . e ..
	// - tipos: 0=diretorio, 1=arquivo, 2=link, 3=outro
	function &_dir_files($directory){
		$r = array();
		
		// alvo nao existe
		if(!is_dir($directory) && !is_link($directory)) return $r;

		// listar arquivos
		$d = dir($directory);
		$c = 0;
		while (false !== ($entry = $d->read())) {
			if($entry=='.'||$entry=='..') continue;			
			// tipo
			$x = $directory.'/'.$entry;
			if(!is_file($x)) continue;
			$r[$c] = $x;
			$c++;
		}
		$d->close();
		return $r;
	}

	// criar diretorio recursivamente, garantir existencia
	function makedir($directory, $mode=0755){

		// limpar cache e previnir enganos
		clearstatcache();

		// ja existe
		if(is_dir($directory)) return true;

		// criar diretorio
		return mkdir($directory, $mode, true);

	}




?>