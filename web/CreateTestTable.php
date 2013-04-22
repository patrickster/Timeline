<?php
$con = mysql_connect("localhost", "root", "root");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

mysql_select_db("lifespans", $con);

// mysql_query("INSERT INTO test (name, birth, death, id)
//   VALUES ('George Washington', '1732', '1799', 1)");

// mysql_query("INSERT INTO test (name, birth, death, id)
//   VALUES ('John Adams', '1735', '1826', 2)");

// mysql_query("INSERT INTO test (name, birth, death, id)
//   VALUES ('Thomas Jefferson', '1743', '1826', 3)");

// mysql_query("INSERT INTO test (name, birth, death, id)
//   VALUES ('James Madison', '1751', '1836', 4)");

// mysql_query("INSERT INTO test (name, birth, death, id)
//   VALUES ('James Monroe', '1758', '1831', 5)");

// mysql_query("INSERT INTO test (name, birth, death, id)
//   VALUES ('Charles Darwin', '1809', '1882', 6)");

// mysql_query("INSERT INTO test (name, birth, death, id)
//   VALUES ('Virginia Woolf', '1882', '1941', 7)");

// mysql_query("INSERT INTO test (name, birth, death, id)
//   VALUES ('John Quincy Adams', '1767', '1848', 8)");

// mysql_query("INSERT INTO test (name, birth, death, id)
//   VALUES ('Thomas Aquinas', '1225', '1275', 9)");

mysql_query("INSERT INTO test (name, birth, death, id)
  VALUES ('Julius Caesar', '-100', '-44', 10)");

mysql_close($con);
?>