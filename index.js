const fs = require('fs');
const http=require('http');
const url= require('url');
const replaceTemplate = require('./modules/replaceTemplate');
////////////////////////////
///Server

//read it once so it make the execution faster 
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataobj = JSON.parse(data);
const overview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const product = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/card.html`,'utf-8');

//createServer() will accept a callback function, which will be fired off each time 
//a new request hits our server. The callback function get access to request&response variable
const server = http.createServer((req,res)=>{
    const {query, pathname} = url.parse(req.url,true);//need to pass true here into this parse function in order to actually parse the query into an object
    //Overview
    if (pathname ==='/' || pathname ==='/overview'){
        res.writeHead(200,{//write to header
            'Content-Type': 'text/html'});
        //map accepts a callback function and this callback function get as an argument,the current
        //element, so the element of the current loop(el) and whatever we return here, will be saved
        //in to the array(cardsHtml)
        //the join('') will turn it to string   
        const cardsHtml = dataobj.map(el=>replaceTemplate(card,el)).join('');
        const output = overview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
        res.end(output);

    //Product
    }else if (pathname ==='/product'){
        res.writeHead(200,{//write to header
            'Content-Type': 'text/html'});
        const item = dataobj[query.id];
        const output =replaceTemplate(product,item);
        res.end(output);

    //API
    }else if (pathname==='/api'){
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(data);
    
    //Not Found
    }else{
        res.writeHead(404,{//write to header
            'Content-Type': 'text/html',
            'my-own-header':'hello world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening to requests on port 8000');
});






