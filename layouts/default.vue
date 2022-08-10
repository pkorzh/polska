<template>
  <div>
     <b-navbar toggleable="sm">
      <b-navbar-brand href="/">
        <img src="/logo.png" width="30px">
      </b-navbar-brand>
       <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

       <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-dropdown-item href="/tile/tag/genres">Genres</b-dropdown-item>
          <b-dropdown-item href="/faq">FAQ</b-dropdown-item>
        </b-navbar-nav>
       </b-collapse>
     </b-navbar>
    <nuxt />
  </div>
</template>

<style>
</style>
