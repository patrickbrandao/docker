<?php


	// pega registro de rotas e retornar em array com valores
	// dependencias:
	// * nenhuma
	function router_load($_route){
		$_ret = array(
			'success' => 0,	// sucesso ao carregar rotas?
			'type' => 'U', // L: local, W: gateway, B: broadcast, N: rede local, U=unknow
			'dst' => '',
			'via' => '',
			'dev' => '',
			'src' => '',
			'metric' => 0,
			'scope' => '',
			'proto' => '',
			'local' => '',
			'broadcast' => '',
			'mtu' => '',
			'advmss' => 0,
			'cache' => 0
		);
		// substituir default por 0.0.0.0/0
		$_route = str_replace('default', '0.0.0.0/0', $_route);
		$_route = str_replace('<', '', $_route);
		$_route = str_replace('>', '', $_route);
		$_route = trim($_route);
		if($_route == '') return($_ret);
		$aroute = explode(' ', $_route);
		foreach($aroute as $k=>$v){
			if($k==0) $_ret['dst'] = $v;
			if($v=='cache') $_ret['cache'] = 1;
			if(isset($_ret[$v]) && isset($aroute[$k+1])) $_ret[$v] = $aroute[$k+1];
			if($aroute[$k] == 'local' || $aroute[$k] == 'broadcast'){
				$_ret['dst'] = $aroute[$k+1];
			}
		}

		if($_ret['via'] != ''){
			$_ret['type'] = 'W';
		}elseif($_ret['broadcast'] != ''){
			$_ret['type'] = 'B';
		}elseif($_ret['local'] != ''){
			$_ret['type'] = 'L';
		}else{
			$_ret['type'] = 'N';
		}
		if($_ret['type'] != 'U') $_ret['success'] = 1;
		return($_ret);
	}

	// obter dados de rota para um destino
	// dependencias:
	// > router_load()
	function route_get($_dst){
		$_r = router_load(str_replace("\n", "", shell_exec("ip route get ".$_dst." 2>/dev/null")));
		return($_r);
	}












?>