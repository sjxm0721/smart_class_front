<template>
  <div>
    <navbar/>
    <router-view></router-view>
  </div>
</template>

<script>
import { Navbar } from '@/layout/components'

export default {
  name: 'SubjectDetail',
  components: {
    Navbar
  }
}
</script>
