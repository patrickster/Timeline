<?php

if ( !isset($_POST['term']) )
  exit; 
$term = $_POST['term'];
$term = $term.'%';

$db = new mysqli('localhost', 'root', 'root', 'lifespans');

/* check connection */
if(mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

$stmt = $db->stmt_init();
$stmt->prepare("SELECT name, birth, death FROM Lives WHERE name LIKE ?");
$stmt->bind_param('s', $term);  
$stmt->execute();
$stmt->bind_result($name, $birth, $death);

$data = array();
while($stmt->fetch()) {
  $dates = array(
    'birth' => $birth,
    'death' => $death
  );
  $data[] = array(
    'label' => $name,
    'value' => $dates
  );
}

echo json_encode($data);

$stmt->close();
$db->close();

?>