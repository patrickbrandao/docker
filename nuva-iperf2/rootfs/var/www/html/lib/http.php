<?php


	// procurar variavel HTTP, seja GET ou POST
	function &request($vname, $df=''){
		if(is_array($_REQUEST) && array_key_exists($vname, $_REQUEST)){
			$_r = &$_REQUEST[$vname];
		}else{
			$_r = $df;
		}
		return($_r);
	}
	// request com filtro de limpeza
	function &request_eregi($vname, $regex){
		$_r = @eregi_replace($regex, "", request($vname));
		return($_r);
	}

	// obter variaveis de request que estejam presentes
	// num array modelo
	function &request_list($list){
		foreach ($list as $vname=>$stdvle)
			if(is_array($_REQUEST) && array_key_exists($vname, $_REQUEST))
				$list[$vname] = is_int($stdvle) ? (int)$_REQUEST[$vname] : $_REQUEST[$vname];
			//-
		//-
		return $list;
	}

	// procurar variavel HTTP, GET apenas
	function &get($vname, $df=''){
		if(is_array($_GET) && array_key_exists($vname, $_GET)){
			$_r = &$_GET[$vname];
		}else{
			$_r = $df;
		}
		return($_r);
	}
	// procurar variavel HTTP, POST apenas
	function &post($vname, $df=''){
		if(is_array($_POST) && array_key_exists($vname, $_POST)){
			$_r = &$_POST[$vname];
		}else{
			$_r = $df;
		}
		return($_r);
	}

	// retornar todas as variaveis de envio
	function &request_getall(){
		$_r = $_REQUEST;
		return($_r);
	}
	function &post_getall(){ return($_POST); }
	function &get_getall(){ return($_GET); }

	// verificar se a variavel foi enviada
	function &request_isset($vname){
		$_r = false;
		if(array_key_exists($vname, $_REQUEST)) $_r = true;
		return($_r);
	}
	function &post_isset($vname){
		$_r = false;
		if(array_key_exists($vname, $_POST)) $_r = true;
		return($_r);
	}
	function &get_isset($vname){
		$_r = false;
		if(array_key_exists($vname, $_GET)) $_r = true;
		return($_r);
	}

	// util
	function &request_int($vname, $df=0){
		if(is_array($_REQUEST) && array_key_exists($vname, $_REQUEST)){
			$_r = &$_REQUEST[$vname];
		}else{
			$_r = $df;
		}
		$_r = (int)$_r;
		return($_r);
	}

	// procurar variavel do servidor
	function &server($vname, $df=''){
		if(is_array($_SERVER) && array_key_exists($vname, $_SERVER)){
			$_r = &$_SERVER[$vname];
		}else{
			$_r = $df;
		}
		return($_r);
	}

	function &cookie($vname, $df=''){
		if(is_array($_COOKIE) && array_key_exists($vname, $_COOKIE)){
			$_r = &$_COOKIE[$vname];
		}else{
			$_r = $df;
		}
		return($_r);
	}
	function &cookie_int($vname, $df=''){
		$v = (int)cookie($vname, $df);
		return $v;
	}
	function cookie_delete($vname){
		// remover cookie da memorie em execucao
		if(isset($_COOKIE[$vname])) unset($_COOKIE[$vname]);
		// remover cookie do navegador
		setcookie($vname, NULL, -1);
	}

	// lembrar de variavel armazenada na sessao caso omissa no request e salvar na sessao caso presente
	function remember($varname){
		$value=trim(request($varname));
		if($value==''){
			// ausente 
			$value=session($varname);
		}else{
			// presente em request, salvar na sessao para lembrar depois
			$_SESSION[$varname]=$value;
		}
		return $value;
	}




?>