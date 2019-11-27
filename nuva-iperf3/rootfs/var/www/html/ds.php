<?php

	date_default_timezone_set('America/Sao_Paulo');

	require('lib/phpb.php');
	require('lib/session.php');
	require('lib/http.php');
	require('lib/routes.php');
	require('lib/lseth.php');

	require('lib/_init.php');

	$console = request('console');
	
	switch($console){

		case 'rate':

			// Monitorar velocidade de interface
			$dev = request('dev');
			if($dev!='eth0'&&$dev!='eth1'&&$dev!='eth2'&&$dev!='eth3'&&$dev!='eth4')$dev='eth0';

			$rxbytes = 0;	// RX: dados recebidos na interface sao UPLOAD
			$txbytes = 0;	// TX: dados enviados na interface sao DOWNLOAD

			// Obter dados da interface
			if(is_dir('/sys/class/net/'.$dev)){
				$rxbytes = file_get_number('/sys/class/net/'.$dev.'/statistics/rx_bytes');
				$txbytes = file_get_number('/sys/class/net/'.$dev.'/statistics/tx_bytes');
			}

			echo '{';
			echo 'dev: "'.$dev.'",';
			echo 'rxbytes: '.$rxbytes.',';
			echo 'txbytes: '.$txbytes.',';
			echo 'uts: '.utime();
			echo '}';
			break;

	}


?>