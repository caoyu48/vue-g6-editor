<template>
  <div />
</template>

<script>
import registerNode from "./registerNode";
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
      registerNode();
      customEdge.init();
      teamNode.init();
    }
  }
};
</script>


