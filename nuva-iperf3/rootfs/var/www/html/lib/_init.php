<?php

	// alterar nome da sessao e iniciala
	ini_set('session.name', 'nuva-docker');
	if(function_exists('session_name')) session_name('nuva-docker');


	// tipo de software
	$SOFTWARE = 'Admin';

	// iniciar sessao obrigatorio
	session_start();

	// travar user-agent
	session_lock();


?>