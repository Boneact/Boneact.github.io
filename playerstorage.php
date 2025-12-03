<?php
include("storage.php");

class Playerstorage extends Storage
{
    public function __construct()
    {
        if(!file_exists("users.json"))
        {
            file_put_contents("users.json","{}");
        }
        parent::__construct(new JsonIO("users.json"));
    }
}