const express = require('express');

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

function idUnico() {
  // function closure
  let id = 0;
  return function () {
    id = id + 1;
    return id;
  };
}

const newId = idUnico(); // instancio la closure

// TODO: your code to handle requests

// *************** POST /posts *********************
server.post('/posts', (req, res)=>{
  const { author, title, contents } = req.body;
  if( author && title && contents ){
    const newPost = {
      id: newId(),
      author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post",
    });
  }
});

// *************** POST /post/author/:author *********************
server.post('/posts/author/:author', (req, res) => {
  const { title, contents } = req.body;
  const { author } = req.params;
  //console.log("post author, datos recibidos:{ title: [", title, "] contents: [", contents, "] author: [", author, "]  }");
  if( author && title && contents ){
    //console.log("entra para crear el post");
    const newPost = {
      id: newId(),
      author,
      title,
      contents,
    };
    posts.push(newPost);
    return res.json(newPost);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para crear el Post"
    });
  }
});

// *************** GET /posts *********************
server.get('/posts', (req, res) => {
  const term = req.query.term;
  //console.log('Term recibido en el get: ',term);
  if ( term ){
    let encontrados = [];
    posts.filter( post => {
      if ( post.title.includes(term) || post.contents.includes(term)){
        encontrados.push(post);
      }
    });
    return res.json(encontrados);
  } else {
    return res.json(posts);
  }
});

// *************** GET /post/:author *********************
server.get('/posts/:author', (req, res) => {
  const author = req.params.author;
  //console.log('Author recibido: ',author);
  const filtrados = posts.filter(post => {
    if (post.author == author){
      return post
    }
  });
  //console.log("filtrados: ", filtrados);
  if ( filtrados.length>0 ){
    return res.json(filtrados);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post del autor indicado"
    });
  }
});

// ************************* GET /posts/:author/:title ****************************
server.get('/posts/:author/:title', (req, res) => {
  const author = req.params.author;
  const title = req.params.title;
  //console.log('Author recibido: ',author);
  const filtrados = posts.filter(post => {
    if (post.author == author && post.title == title){
      return post
    }
  });
  //console.log("filtrados: ", filtrados);
  if ( filtrados.length>0 ){
    return res.json(filtrados);
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "No existe ningun post con dicho titulo y autor indicado"
    });
  }
});

// *************************** PUT /posts **********************************
server.put('/posts', (req, res)=>{
  const { id, title, contents } = req.body;
  if( id && title && contents ){
    let encontrado = posts.filter((post) => {
      if (post.id === id) { return post }
    });
    if (encontrado.length>0){
      posts.map( (item) => {
        if(item.id === id){
          item.title = title;
          item.contents = contents;
          return res.json(item);
        }
      });
    } else {
      return res.status(STATUS_USER_ERROR).json({
        error: "No se encontro el post",
      });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parámetros necesarios para modificar el Post",
    });
  }
});

// **************************** DELETE /posts ****************************** 
server.delete('/posts', (req, res)=>{
  const { id } = req.body;
  //console.log("id del elemento a borrar: ", id);
  if( id ){
    let encontrado = posts.filter((post) => {
      if (post.id === id) { return post }
    });
    if (encontrado.length>0){
      //eliminar
      let indice = posts.indexOf(encontrado[0]);
      posts.splice(indice, 1);
      return res.json( { success: true })
    } else {
      return res.status(STATUS_USER_ERROR).json({
        error: "Mensaje de error",
      });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "Mensaje de error",
    });
  }
});

// **************************** DELETE /author *********************************
server.delete('/author', (req, res)=>{
  const { author } = req.body;
  //console.log("id del elemento a borrar: ", id);
  if( author ){
    let encontrados = posts.filter((post) => {
      if (post.author === author) { return post }
    });
    //console.log("array de autores encontrados: ", encontrados);
    if (encontrados.length>0){
      //eliminar
      encontrados.map( (item) => {
        let indice = posts.indexOf(item);
        posts.splice(indice, 1);
      });
      return res.json(encontrados)
    } else {
      return res.status(STATUS_USER_ERROR).json({
        error: "No existe el autor indicado",
      });
    }
  } else {
    return res.status(STATUS_USER_ERROR).json({
      error: "Mensaje de error",
    });
  }
});



module.exports = { posts, server };