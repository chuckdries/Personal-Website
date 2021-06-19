<?php

$pass = htmlspecialchars(stripslashes(trim($_POST["pass"])));

if($pass == "pumpkinspice"){
	echo("Sorry, I've stopped sharing this album. Contact me for photos");
} else {
    header('Location: http://chuckdries.rocks/spookyno.html');
}

?>