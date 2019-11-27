<?php


	// Garantir funcao PHPx lseth
	// em ambientes PHP7 ou PHPs sem componente especial

	// - lseth php5 to php7
	if(!function_exists('lseth')){

		// Retorna array com contadores de ciclos dos numeros
		function lseth(){
			$list = array();

            $lines = file('/proc/net/dev');
            foreach($lines as $k=>$line){
                $p = strpos($line, ':');
                if($p===false) continue;
                $dev = trim(substr($line, 0, $p));
                if($dev=='') continue;
                if(substr($dev, 0, 3)!='eth') continue;
                if(strpos($dev, '.')!==false) continue;
                $list[] = $dev;
            }
            asort($list);
			return $list;
		}
	}



?>