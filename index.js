const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);


const promptUser = () => {

    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter your GitHub username:",
                name: "username"
            },
            {
                type: "list",
                message: "What's your favorite color?",
                name: "color",
                choices: ["red", "green", "blue", "pink"]
            }
        ])
        .then(function({ username, color }) {
            const mainURL = `https://api.github.com/users/${username}`;

            axios
                .get(mainURL)
                .then(function(answer) {  

                    const html = generateHTML(answer, color);
                
                    return writeFileAsync("index.html", html);
                    })
                    .then(function() {
                    console.log("Successfully wrote to index.html");
                    })
                    .catch(function(err) {
                    console.log(err);
                    
            });
        });
}

promptUser();

const colors = {
    red: {
        containerBackground: "#400000",
        profileBackground: "#800000",
        profileColor: "white",
    },
    green: {
        containerBackground: "#004000",
        profileBackground: "#008000",
        profileColor: "white"
    },
    blue: {
        containerBackground: "#101040",
        profileBackground: "#3333cc",
        profileColor: "white"
    },
    pink: {
        containerBackground: "#401A33",
        profileBackground: "#803366",
        profileColor: "white"
    },

};

const generateHTML = (answer, userColorChoice) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Github Developer Profile</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
        
        <style>
            * {
                margin: 0;
                padding: 0;
            }

            body {
                padding-bottom: 1rem;
            }

            a {
                color: ${colors[userColorChoice].profileColor};
            }

            a:hover {
                color: ${colors[userColorChoice].containerBackground};
            }

            .jumbotron {
                padding-top: 7rem;
            }

            .profile-img {
                width: 250px;
                height: 250px;
                object-fit: cover;
                box-shadow: 4px 8px 8px 0 rgba(0,0,0,0.2);
                margin-top: -4rem;
            }

            .card-header {
                background-color: ${colors[userColorChoice].profileBackground};
                color: ${colors[userColorChoice].profileColor};
            }

            .user-color {
                background-color: ${colors[userColorChoice].containerBackground};
            }

            .user-profile {
                background-color: ${colors[userColorChoice].profileBackground};
                color: ${colors[userColorChoice].profileColor};
                margin-bottom: -7rem;
                border-radius: 10px;
                padding-bottom: 1rem;
            }

            .user-info {
                margin-top: 5rem;
            }

            .user-info h4 {
                margin-bottom: 3rem;
            }

            .card {
                box-shadow: 0 8px 8px 0 rgba(0,0,0,0.2);
            }

            @media screen and (min-width: 690px) {
                .user-cards {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    grid-gap: 1em;
                }

            }
        </style>

    </head>
    <body>

        <main>
            <div class="jumbotron jumbotron-fluid text-center user-color">
                <div class="container">
                    <div class="user-profile">
                        <img src="${answer.data.avatar_url}" alt="Github profile picture" class="rounded-circle profile-img">
                        <h1 class="display-4">Hi! My name is ${answer.data.name}</h1>
                        <p class="lead">I am from ${answer.data.location}.</p>
                        <h3>Contact Me:</h3>
                        <ul class="nav justify-content-center">
                            <li class="nav-item">
                                <a class="nav-link" href="${answer.data.html_url}">GitHub</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">${answer.data.location}</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="${answer.data.blog}">Blog</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>


            <div class="container">
                <div class="user-info text-center">
                    <h4>${answer.data.bio}</h4>

                    <div class="user-cards">
                        <div class="card mb-3">
                            <div class="card-header">Public Repositories:</div>
                            <div class="card-body">
                                <h5 class="card-title">${answer.data.public_repos}</h5>
                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-header">Followers:</div>
                            <div class="card-body">
                                <h5 class="card-title">${answer.data.followers}</h5>
                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-header">GitHub stars:</div>
                            <div class="card-body">
                                <h5 class="card-title"></h5>
                            </div>
                        </div>

                        <div class="card mb-3">
                            <div class="card-header">Following:</div>
                            <div class="card-body">
                                <h5 class="card-title">${answer.data.following}</h5>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

        </main>
        
    </body>
    </html>`;
}






    /* 
    colors
        red - #ff0000
        blue - #3333cc
        green - #009900
        pink - #ff66cc
    */