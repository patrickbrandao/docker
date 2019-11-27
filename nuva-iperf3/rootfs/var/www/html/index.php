<?php

	require('lib/phpb.php');
	require('lib/session.php');
	require('lib/http.php');
	require('lib/routes.php');
	require('lib/lseth.php');

	require('lib/_init.php');

	$hostname = '';
	if(is_file('/etc/hostname')) $hostname = file_get_contents('/etc/hostname');
	if(is_file('/etc/HOSTNAME')) $hostname = file_get_contents('/etc/HOSTNAME');
	if($hostname=='') $hostname = 'nuva-speedtest';

	// Obter IP do cliente
	$client_ip = server('REMOTE_ADDR');

	// Interface WAN
	// $route = route_get($client_ip);
	// $dev = $route['dev'];

	$eths = lseth();
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">

		<link rel="stylesheet" charset="UTF-8" href="/css/main.css?nocache=<?php echo time(); ?>" type="text/css" />
		<link rel="stylesheet" href="/css/screen.css?nocache=<?php echo time(); ?>">
		<script type="text/javascript" charset="UTF-8" src="/js/main.js?nocache=<?php echo time(); ?>"></script>

		<script>

		var jsglobal = {
		<?php foreach($eths as $k=>$dev){ ?>
		<?php echo $dev; ?>: {
					// dados atuais
					act_txbytes: 0,
					act_rxbytes: 0,
					act_uts: 0,

					// diferencas
					dif_txbytes: 0,
					dif_rxbytes: 0,
					dif_uts: 0,

					// dados anteriores
					lst_txbytes: 0,
					lst_rxbytes: 0,
					lst_uts: 0
			},
			<?php } ?>
		};

		function _boot(){

			<?php foreach($eths as $k=>$dev){ ?>
			jchart('netrate_<?php echo $dev; ?>', {
				loadmethod: 'json',
				url: 'ds.php',
				interval: 1,
				data: { console: 'rate', dev: '<?php echo $dev; ?>' },

				// ---------------------------------- grafico
				// dimensoes gerais
				width: 740,
				height: 320,
				color: '#323232',
				bgcolor: 'transparent',
				type: 'rate',
				dataformat: 'bit',
				chart: {},
				columns: 30,
				border: 'none',
				gradient: palette.gradient({
					type: 'horizontal',
					colors: { 0: '#CFE2D5', 1: '#F1F7F2' }
				}),
				series: {
					download: {
						label: 'Download',
						type: 'area',
						linecolor: '#3bb665',
						areacolor: '#5bd685',
						linewidth: 1.5,
						shadow: 0
					},
					upload: {
						label: 'Upload',
						type: 'line',
						linecolor: '#305aad',
						areacolor: '#305aadef',
						linewidth: 1.9,
						shadow: 0
					},
				},
				// _json => {dev: "ppp0",rxbytes: 1664649,txbytes: 33674428,uts: 1501640962324}
				onpreset: function(_nid, _json){
					var _data = {
						download: 0,
						upload: 0
					};
					// Dados atuais
					jsglobal.<?php echo $dev; ?>.act_txbytes = stdlib.toint(_json['txbytes']);
					jsglobal.<?php echo $dev; ?>.act_rxbytes = stdlib.toint(_json['rxbytes']);
					jsglobal.<?php echo $dev; ?>.act_uts = stdlib.toint(_json['uts']);

					// Calcular diferentas
					jsglobal.<?php echo $dev; ?>.dif_txbytes = jsglobal.<?php echo $dev; ?>.act_txbytes - jsglobal.<?php echo $dev; ?>.lst_txbytes;
					jsglobal.<?php echo $dev; ?>.dif_rxbytes = jsglobal.<?php echo $dev; ?>.act_rxbytes - jsglobal.<?php echo $dev; ?>.lst_rxbytes;
					jsglobal.<?php echo $dev; ?>.dif_uts = jsglobal.<?php echo $dev; ?>.act_uts - jsglobal.<?php echo $dev; ?>.lst_uts;

					// Diferencas precisam ser iguais ou maiores que zero
					if(jsglobal.<?php echo $dev; ?>.dif_txbytes < 0) jsglobal.<?php echo $dev; ?>.dif_txbytes = 0
					if(jsglobal.<?php echo $dev; ?>.dif_rxbytes < 0) jsglobal.<?php echo $dev; ?>.dif_rxbytes = 0
					if(jsglobal.<?php echo $dev; ?>.dif_uts < 0) jsglobal.<?php echo $dev; ?>.dif_uts = 0

					// Calcular velocidade dentro dos microsegundos
					if(jsglobal.<?php echo $dev; ?>.dif_uts > 0){
						if(jsglobal.<?php echo $dev; ?>.dif_rxbytes)
							_data.download = jsglobal.<?php echo $dev; ?>.dif_rxbytes / jsglobal.<?php echo $dev; ?>.dif_uts;
						//-
						if(jsglobal.<?php echo $dev; ?>.dif_txbytes)
							_data.upload = jsglobal.<?php echo $dev; ?>.dif_txbytes / jsglobal.<?php echo $dev; ?>.dif_uts;
						//-
						// Ajustar,
						// - vezes mil para ajustar de mili-segundos para segundos
						// - multiplicar por 8 para converter bytes em bits
						_data.download *= 8192;
						_data.upload *= 8192;
					}
					// Atualizar dados antigos com os dados atuais
					jsglobal.<?php echo $dev; ?>.lst_txbytes = jsglobal.<?php echo $dev; ?>.act_txbytes;
					jsglobal.<?php echo $dev; ?>.lst_rxbytes = jsglobal.<?php echo $dev; ?>.act_rxbytes;
					jsglobal.<?php echo $dev; ?>.lst_uts = jsglobal.<?php echo $dev; ?>.act_uts;
					// stdlib.set_html('debug', stdlib.debugobj(jsglobal) + stdlib.debugobj(_data) );
					return _data;
				},
				off_onset: function(_nid, _j, _x){
					stdlib.set_html('data_download', stdlib.number_abrev(_j.download)+'bit/s');
					stdlib.set_html('data_upload', stdlib.number_abrev(_j.upload)+'bit/s');
				}
			});
			<?php } ?>
		}
		</script>
		<link rel="icon" href="/favicon.png" type="image/png">
		<title>Monitoramento <?php echo $hostname; ?></title>
	</head>
  	<body class="nbody" onload="_boot()">

  	<?php

		$f = '/var/www/html/top.html';
		if(is_file($f)){
			include($f);
		}

  	?>

		<div class="meterbox">
			<div class="ntitle" id="ntitle">Monitoramento de consumo - <?php echo $hostname; ?></div>
			<?php foreach($eths as $k=>$dev){ ?>
			<div class="stitle" id="stitle"><?php echo $dev; ?></div>
			<div class="metergraph" id="netrate_<?php echo $dev; ?>"></div>
			<?php } ?>

			<div class="qinfo">
				<table width="100%">
					<tr>
						<td width="16%" align="right"><span class="ilabel">Cliente IPv4:&nbsp;</span></td>
						<td width="16%"><span class="idata sm-label-with-icon sm-ipv4" id="data_ipv4"><?php echo $client_ip; ?></span></td>
						<td width="16%" align="right"></td>
						<td width="16%" align="left"></td>
						<td width="16%" align="right"></td>
						<td width="16%" align="left"></td>

					</tr>
				</table>
			</div>
		</div>


		<div class="copyright">
			Desenvolvido por Nuva Soluções,
			<a href="http://www.nuva.com.br" target="blank">http://www.nuva.com.br/</a>
		</div>


	</body>
</html>






