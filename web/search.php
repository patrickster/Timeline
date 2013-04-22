<?php
if(isset($_POST['term'])) {

  $queryString = $_POST['term'];
  $html = '';

  if(strlen($queryString) > 1) {
    $names= explode(" ", $queryString ); 
        foreach ($names as &$value) {
            // step 1: first names
            $result= queryf("SELECT *, 
                    MATCH(productName, productTags, productCategory, productOneLine) 
                    AGAINST ('*$queryString*' IN BOOLEAN MODE) 
                    AS score FROM products
                    WHERE MATCH(productName, productTags, productCategory, productOneLine) 
                    AGAINST ('*$queryString*' IN BOOLEAN MODE)
                    AND productStatus='1'
                    ORDER BY score DESC
                    LIMIT 10") ;
            if($result) {
while ($row = mysql_fetch_array($result)) {
                            echo '<li onclick="location.href=\'/'.$row['productCategory'].'/'.$row['productSlug'].'/\';" style="cursor: pointer;"><a href="/'.$row['productCategory'].'/'.$row['productSlug'].'/">
                            <div class="resultImg"><img src="/image.php?width=24&height=24&image='.$row['productIcon'].'" /></div> 
                            <span class="productName">'.$row['productName'].'</span><br />
                            '.$row['productOneLine'].'</a></li>';
                        }

                    }
        } else {
                    echo '
                <ul>
                    <li>
                    <div class="resultImg"><img src="/image.php?width=24&height=24&image=/images/icon_searching.gif" /></div> 
                    <span class="productName">Processing...</span><br />
                    Please keep typing while we process your code</li>
                </ul>';
                }
        }
    } else {
        echo '
                <ul>
                    <li>
                    <div class="resultImg"><img src="/image.php?width=24&height=24&image=/images/icon_searching.gif" /></div> 
                    <span class="productName">Processing...</span><br />
                    Please keep typing while we process your code</li>
                </ul>';
    }
} else {
    echo 'Nothing to see here.';
}
?>