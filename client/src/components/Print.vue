<template>
<!-- The page is used for creating a page to print the data obtained -->
    <div class="print">
      <label style="position-right bold"><h1>{{datan}}</h1></label>
   <table class="table is-bordered">
      <thead class="t-head dark"><!-- The total width of the A4 sheet is 2480px -->
        <th class="bg-primary" width="248px">Roll No</th>
        <th class="bg-primary" width="496px">Image</th>
        <th class="bg-primary" width="620px">Student Name</th>
        <th class="bg-primary" width="248px">Maths</th>
        <th class="bg-primary" width="248px">Science</th>
        <th class="bg-primary" width="248px">Social</th>
        <th class="bg-info" width="372px">Total</th>
      </thead>
      <tbody><!-- To display the image the "v-bind:src" is used -->
          <tr v-for="data in datas">
              <td>{{data.rl}}</td>
              <td><img :src="data.image"></td>
              <td>{{data.name}}</td>
              <td>{{data.maths}}</td>
              <td>{{data.science}}</td>
              <td>{{data.social}}</td>
              <td>{{data.total}}</td>
              
          </tr>
      </tbody>
    </table>
    </div>
</template>
<script>

/* Notes:The normal method for parent child communication is by using props,which receive dat from the parent
but here I used the $route.params because i just wanted to display the info ,that's all
For accessing or editing a parent variable use the form
this.$parent.varname where varname is the property name */
import router from '../router';//Used to link pages present in it
import dynaDB from '@/components/dynaDB'//Used to call the Component Helloworld(ie:first page) to be used in this page
export default {
    data:{
        datas:[],
        datan:''
    },
    components:{dynaDB},
    created(){
        this.datas = this.$route.params.data,//Obtain the data from the router's parameters sent along with it
        this.datan = this.$route.params.dataname
            setTimeout(function(){//Isnt pretty necessary but helps in printing page after it gets loaded
                window.print()
                setTimeout(function(){
                    router.go(-1)//Used to send it back to home page
                },10)
            },10)
    },
}
</script>
