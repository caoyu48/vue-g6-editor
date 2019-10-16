<template>
  <div />
</template>

<script>
import customNode from "./customNode";
import customEdge from "./customEdge";
import teamNode from './teamNode'
export default {
  name:'Flow',
  data() {
    return {
      page: null
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      customNode.init();
      customEdge.init();
      teamNode.init();
    }
  }
};
</script>


