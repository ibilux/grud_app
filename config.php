<?php 

    $dsn = "mysql:host=localhost;dbname=vue_grud;";
    $user = 'root';
    $pass = '';
    $options = array(
        PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
    );
    try {
        $con = new PDO($dsn,$user,$pass,$options);
        $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
       // echo 'You Are Connected';
    }catch(PDOEception $e){
        echo "Faild To Connect" . $e->getMessage() ; 
    }



    function checkItem($select, $from, $value) {
        global $con;
        $statment = $con->prepare("SELECT $select FROM $from WHERE $select = ?");
        $statment->execute(array($value));
        $count = $statment->rowCount();
        return $count;
    }


    $result = array('error'=>false,'message'=>"",'errors'=>array());
    $action = isset( $_GET['action']) ? $_GET['action'] : 'read' ;
    if ($action ==  'read'){

        $stmt = $con->query("SELECT * FROM users");
        $users = array();

        while( $row = $stmt->fetch(PDO::FETCH_ASSOC) ){
            array_push($users, $row);
        }
        $result['users'] = $users;


    }elseif( $action == 'create' ) {
        $name = filter_var($_POST['name'],FILTER_SANITIZE_STRING);
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);

        $errors = array();
        if (empty($name)){
            $errors[] = "Please Enter Username";
        }
        if(empty($phone)) {
            $errors[] = "Please Enter phone";
        }
        if (empty($email)){
            $errors[] = "Please Enter Email";
        }

        
        $result['errors'] = $errors;

        if (empty($errors)){
            $check = checkItem('phone','users',$phone);
        if ($check > 0) {
            $result['error']  = true;
            $errors[] = 'Phone Already Exist';
        $result['errors'] = $errors;

        }else {
            $stmt = $con->query("INSERT INTO users ( name, email, phone ) VALUES ( '$name', '$email', '$phone' ) ");

        }

            } else {
                $result['error']  = true;
                $result['message']   = 'Failed To ADD User';   
            }
        }
    elseif( $action == 'update' ) {
        $id    = $_POST['id'];
        $name = filter_var($_POST['name'],FILTER_SANITIZE_STRING);
        $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
        $phone = filter_var($_POST['phone'], FILTER_SANITIZE_STRING);


        $errors = array();
        if (empty($name)){
            $errors[] = "Please Enter Username";
        }
        if(empty($phone)) {
            $errors[] = "Please Enter phone";
        }
        if (empty($email)){
            $errors[] = "Please Enter Email";
        }
        $result['errors'] = $errors;
        

        if (empty($errors)){
       
            $stmt = $con->query("UPDATE users SET name='$name', email='$email', phone='$phone' WHERE id='$id'");
           
            } else {
                $result['error']  = true;
                $result['message']   = 'Failed To Update User'; 
                $result['errors'] = $errors;  
            }
    }elseif( $action == 'delete' ) {
        $id    = $_POST['id'];
        
        $stmt = $con->query("DELETE FROM users WHERE id='$id'");

        if ($stmt) {
            $result['message'] = 'User Deleted Successfully';
        }else {
            $result['error']  = true;
            $result['message']   = 'Failed To Delete User';
        }
        
    }
    

    echo json_encode($result);

