<template>
  <router-view />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; 
}

body, html {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #121212, #1e1e1e);
  color: #ffffff; 
  height: 100%; 
  overflow-x: hidden; 
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%; 
  display: flex;
  flex-direction: column; 
}

body {
  overflow: auto;
}

</style>
