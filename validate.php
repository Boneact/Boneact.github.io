<?php
function validate($post, &$data, &$errors)
{
    if(trim($post["name"]) === "")
    {
        $errors["name"] = "A név megadása kötelező";
    }
    if(trim($post["password"]) === "")
    {
        $errors["password"] = "A jelszó megadása kötelező";
    }
    $data['name'] = trim($post['name']);
    $data['password'] = trim($post['password']);
    $data['scores'] = [];
    return count($errors) === 0;
}