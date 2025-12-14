<?php
include("storage.php");

class Playerstorage extends Storage
{
    public function __construct()
    {
        $usersFile = __DIR__ . '/data/users.json';

        if(!file_exists($usersFile))
        {
            file_put_contents($usersFile,"{}");
        }
        parent::__construct(new JsonIO($usersFile));
    }
}