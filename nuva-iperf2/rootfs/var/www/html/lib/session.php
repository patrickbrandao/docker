<?php

	// funções de manipulação de sessao

	// procurar variavel na sessao
	function &session($vname, $df=''){
		if(is_array($_SESSION) && isset($_SESSION[$vname])){
			$_r = &$_SESSION[$vname];
		}else{
			$_r = $df;
		}
		return($_r);
	}
	function &session_int($vname, $df=0){
		if(is_array($_SESSION) && isset($_SESSION[$vname])){
			$_r = (int)$_SESSION[$vname];
		}else{
			$_r = $df;
		}
		return($_r);
	}

	// verificar se variavel esta definida na sessao
	function session_test($vname){
		if(is_array($_SESSION) && isset($_SESSION[$vname])) return true;
		return false;
	}

	// alterar variavel na sessao
	function session_set($vname, $vvalue){
		if(is_array($_SESSION)){
			$_SESSION[$vname] = &$vvalue;
			return(true);
		}
		return(false);
	}
	// deletar variavel da sessao
	function session_delete($vname){
		if(is_array($_SESSION) && isset($_SERVER[$vname])){
			unset($_SERVER[$vname]);
			return(true);
		}
		return(false);
	}

	// destruir sessao e cookie identificador
	function session_drop(){
		session_unset();
		$_SESSION = array();
	}

	// obter array de sessao
	function session_vars(){
		return $_SESSION;
	}

	// modo de armazenar a sessao
	function session_storage($_store, $_sess_dir=''){
		/*
		tipos de storage
			1 - arquivos em tmp
			2 - arquivo em MM (memory shared)
		*/
		switch($_store){
			case 2:
				// MEMORIA set session.save_handler=mm
				if(@ini_set('session.save_handler','mm')===false){
					session_storage(1, $_sess_dir);
				//}else{
					// parametros de mm
				}
				break;
			default:
				// ARQUIVO set session.save_handler=files
				if(ini_set('session.save_handler','files')!==false)
				if(is_dir($_sess_dir)) ini_set('session.save_path', $_sess_dir);
		}
	}


	// trava segurança na sessao para impedir roubo de sessao
	function session_lock($_level=2){
		// niveis:
		// 1 - pelo IP
		// 2 - pelo User-Agent
		// 3 - pelo IP e User-Agent

		// abortar caso nao iniciada
		if(!isset($_SESSION)) return(-1);
		
		$ua = array_key_exists('HTTP_USER_AGENT', $_SERVER) ? $_SERVER['HTTP_USER_AGENT'] : '';
		$ip = array_key_exists('REMOTE_ADDR', $_SERVER) ? $_SERVER['REMOTE_ADDR'] : '';
		
		// verificar se ja foi inicializada a seguranca
		if(array_key_exists('sec_sess_lock', $_SESSION)){
			// converir seguranca
			switch($_level){
				case 1:
				case 'ip':
					if($_SESSION['sec_sess_lock'] == $ip) return(1);
					break;
				case 3:
				case 'max':
					if($_SESSION['sec_sess_lock'] == substr(md5($ua.$ip), 0, 10)) return(1);
					break;
				default:
					if($_SESSION['sec_sess_lock'] == substr(md5($ua), 0, 10)) return(1);
			}
			// limpar sessao para proteger dados, se chegou ate aqui é porque houve roubo ou mudanca de algo
			session_unset();
			$_SESSION = array();		
		}

		// iniciar seguranca
		switch($_level){
			case 1:
			case 'ip':
				$_SESSION['sec_sess_lock'] = $ip;
				break;
			case 3:
			case 'max':
				$_SESSION['sec_sess_lock'] = substr(md5($ua.$ip), 0, 10);
				break;
			default:
				$_SESSION['sec_sess_lock'] = substr(md5($ua), 0, 10);
		}
		return(1);

	}


?>