/******* This Program was constructed considering School Marklist in mind
The program uses a set of input boxes which receive the data of a student which includes
his name,marks and his photo.After Receiving it, the data is displayed(especially images)
The interface is given like a table and it provides addition or removal of a row with a single click
and it is provided with the options 
1.Save to Mysql
2.Close The Database
3.Save to Django(Generate a pdf with the help of Django)
4.Bring the details to the next page for printing */

/**
Note that while changing the name of helloworld in vue-cli main page
you must change the contents of these files to support the new name as well
1.Router/index.js
2.main
3.If used in any other Vue file
}
</script>
 */
<template>
  <div class="dynaDB">
    <div v-show="off">
    <div class="modal is-active"><!-- Used in bootstrap model -->
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
      <p class="modal-card-title">Dynamic Database</p>
      </header>
      <section class="modal-card-body">
    <!--Here the Selection of the database Occurs(Just for Displaying)
    v-show is used to set visiblity status of the components-->
    
    <label class="label is-medium">Select your database:</label>
    <select width="20px" v-model="dataname" name="product" class="detail">
      <option class="home" disabled value="">Please select one</option><!-- Acts like a placeholder -->
      <option v-for="option in options">{{option.id}}. {{option.choice}}</option><!-- Shows the options held in option data array , the data shown is entirely taken -->
    </select>  
    <button v-show="off" class="button is-info has-text-light has-text-weight-bold" @click="selectit()">Select</button>
    <!-- Selection of database ends here -->
    </section>
    </div>
    </div>
  </div>
    <br>
    <!--The database part starts here 
    starts after the database is selected-->
    <div v-show="on">
      <label class="label is-large">{{dataname}}</label><!--Heading is displayed here -->
    <table class="table is-bordered is-striped">
      <thead class="table thead"><!--Table headings here -->
        <th class="has-background-black has-text-white" width="10%">Roll No</th>
        <th class="has-background-black has-text-white" width="10%">Image</th>
        <th class="has-background-black has-text-white" width="30%">Student Name</th>
        <th class="has-background-black has-text-white" width="10%">Maths</th>
        <th class="has-background-black has-text-white" width="10%">Science</th>
        <th class="has-background-black has-text-white" width="10%">Social</th>
        <th class="has-background-info has-text-white" width="10%">Total</th>
        <th class="has-background-success has-text-white" width="5%">Add</th>
        <th class="has-background-danger has-text-white" width="10%">Remove</th>
      </thead>
      <tbody><!-- The databoxes are shown here -->
        <tr v-for="(data,no) in database"><!-- Runs in a loop -->
          <!-- ":disabled" is used to disallow typing on the input box -->
          <td><input class="form-group" v-bind:disabled="true" v-model="data.rl" name="Roll no" type="number"></td>

          <!-- "div" tag is used for displaying or uploading the image,if present displays the image or else it uploads
            the input file works as background and the label as frontend ,this is done with the help of css -->
          <div v-if="!data.imgcnt"><td><input style="display:none" @change="fileup(no,$event)" ref="fileup" class="form-group" type="file"><button style="z-index:5" class="button is-info has-text-light has-text-weight-bold" @click="simul()">Upload</button></td></div>
          <div v-if="data.imgcnt"><td><img :src="data.image"></td></div>
         <td><input class="form-group" list="std names" @keyup.enter="check(no)" v-model="data.name" name="Name" v-on:keyup="autoc(no)" type="text">
        <datalist id="std names"><!-- The datalist acts as a autocomplete suggestion box 
             shows the suggestion as a list of options-->
            <option v-for="queries in query" @choice="check(no)" v-bind:value="queries.name"  v-bind:label="queries.name"></option>
          </datalist></td>
          <!-- The rest of the details are shown as numerals -->
          <td><input class="form-group" v-model="data.maths"  name="Maths" type="number"></td>
          <td><input class="form-group" v-model="data.science" name="Science" type="number"></td>
          <!-- On pressing enter in the social column the total is calculated and is displayed -->
          <td><input class="form-group" v-model="data.social" @keyup.enter="total(no)" name="Social" type="number"></td>
          <td><input class="form-group" v-model="data.total" v-bind:disabled="true" name="Total" type="number"></td>
          <!-- Buttons to add and delete rows -->
          <td><button class="button is-info has-text-light has-text-weight-bold" @click="addrows()">Add</button></td>
          <td><button class="button is-info has-text-light has-text-weight-bold" @click="deleteit(no)">Delete</button></td>
          <br>
        </tr>
      </tbody>
      </table>

      <!--End of the database list -->


      <button v-show="on" class="button is-info has-text-light has-text-weight-bold" @click="saveit()" >Save to Mysql</button><!-- The database is saved -->
      <button v-show="on" class="button is-info has-text-light has-text-weight-bold" @click="closeit()">Close DB</button><!--The database is closed -->
      <button v-show="on" class="button is-info has-text-light has-text-weight-bold" @click="uploadit()">Save To Django</button>

      <!-- The print function is used to call printer in a seperate page
      The data to be used in the print page is sent as parameters ,the page is directed with the name of the page
      the routes must be first declared in the "router/index.js" file -->


      <router-link :to="{name:'print',params:{data:database,dataname}}"><button v-show="on" class="button is-info has-text-light has-text-weight-bold">Print</button></router-link>
    </div>
  <!--End of the html display -->
</div>
</template>

<script>
var axios = require('axios')//Used to post request to server
var router = require('vue-router')//Used for connecting pages in the client
var Vue =require('vue').default//Basic vue functionality
import 'bulma/css/bulma.css'
import 'bulma-extensions'
Vue.use(router)
export default {
  data () {
    return {
      off:true,//visibility status
      on:false,//visiblity status
      header:[{"title":"Roll No","width":"10%"},{"title":"Image","width":"15%"},{"title":"Name","width":"25%"},{"title":"Maths","width":"10%"},{"title":"Science","width":"10%"},{"title":"Social","width":"15%"},{"title":"Total","width":"15%"}],
      json:[],
      //Things to be displayed in select database
      options:[{id:1,choice:"quarterly"},{id:2,choice:"half_yearly"},{id:3,choice:"annual"}],
      dataname:'',//Holds the result of the database selection box
      query:[],//Holds the possible names in the datalist
      datas:[],//Shows the data present in that specific dataname
      database:[{//Holds all the data present in the database ,(this is a array of object,easy for adding additional data)
        rl:0,
        image:"",//Since image data is encoded to base64 ,it is stored as a string
        name:"",
        maths:0,
        science:0,
        social:0,
        total:0,
        imgcnt:false//Visiblity status
      }]
    }
  },
  methods:{
    simul(){

      //A technique to access a property in dom is to console log every single part one by one till
      // you find the exact words of the property in html
     this.$refs.fileup[0].click()
      //f.click()
      },//The functions to be performed are written here
  fileup(id,event){
    //The encoding of the image occurs here
      var bas;//Holds the encoded data
       var reader = new FileReader();//Used to read the file

       var vm =this// *** This is important because this is used to refer the base class,here it is the entire vue function ***

      let file=event.target.files[id]//Here the image data is referenced to another variable for easy access

      reader.readAsDataURL(file)/***This is used to read the file as a dataURL which is a conversion of the data to base64 no other work is neccessary
      Base64 is a encoded format of the image which is used for passing image data to a database easily ,but it takes extra size
      necessary for database uploading*/

      reader.onload = function (rd) {//After the file is loaded
        bas=rd.target.result//copying of data to image and setting visiblity of image to true
        //Using this here will only give scope access of fileup() method,using vm here will give scope to entire program
        vm.database[id].image=bas
        vm.database[id].imgcnt=true
      };
    },

    check(id)//Used to check if data is present in the database
    {
      var dbn=this.dataname.charAt(0)//Just used to get the table name
      if(this.query[0]!==undefined){//If the data is present
      //axios request is given to get the data of the person specified
      axios.get("http://localhost:3000/list/",{params:{tb:dbn,id:this.query[0].id}}).then((response)=>{
       this.datas=(response.data.data)
       //If the name in the database matches the name typed
       if(this.datas[0].name===this.database[id].name){
         if(this.datas[0].image!==null){this.database[id].imgcnt=true;//Set visiblity of data to true
          var binary = '';//Here decoding of data takes place
          var bytes = new Uint8Array(this.datas[0].image.data);//Stores the data as a array which consist of unicode data
          var len = bytes.byteLength;//Get the total length of the array
          for (var i = 0; i < len; i++) {//In the loop get the corressponding ASCII code of the byte array present there,add it to string
        binary += String.fromCharCode( bytes[ i ] );
    }
        this.database[id].image=binary//set converted string to image
      console.log(this.database[id].image)
    }//finding and filling up other datas
        if(this.datas[0].rl!==0){this.database[id].rl=this.datas[0].rl}
        if(this.datas[0].maths!==0){this.database[id].maths=this.datas[0].maths}
        if(this.datas[0].science!==0){this.database[id].science=this.datas[0].science}
        if(this.datas[0].social!==0){this.database[id].social=this.datas[0].social}
        if(this.datas[0].total!==0){this.database[id].total=this.datas[0].total}
       }
      })
      }
    },
    autoc(id){//Used as the autocomplete form where name of students is obtained
      var i=0
      var dbn=this.dataname.charAt(0)
        axios.get("http://localhost:3000/autoc/",{params:{name:this.database[id].name,}}).then((response)=>{
         this.query=(response.data.data)
       })
      },
    total(id){//Used to calculate the total of subjects after enter is pressed in social box
      this.database[id].total= parseInt(this.database[id].maths)+parseInt(this.database[id].science)+parseInt(this.database[id].social)
      console.log(this.database[id].image)
      //Used for DOM updation (still dont know why it works like this)
      this.addrows();this.refreshit(id+1)
    },
    selectit(){//After database is selected from selection box,this occurs
      if(this.dataname===undefined){//Not working for now
        alert("Select a database first");
        return 0
      }
      var dbn=this.dataname.charAt(0)//Get id of the database
      this.on=true//set visiblity status of table to true
      this.off=false//Set visiblity status of select box to false
    },
    addrows(id){//Used to add a row for additional entry
       this.database.push({//The push is only applicable for array,thats why we declare array of object in the first place
       rl:0,
       name:"",
       image:"",
       maths:0,
       science:0,
       social:0,
       total:0})
    },
    saveit(){//Here the database is saved fully
      var dbn=this.dataname.charAt(0)
      let finuser={tb:dbn,db:this.database//The table name and the data is stored in reference var finuser
      }
      //Request to update/Insert the database
      axios.put('http://localhost:3000/update/',finuser).then((response)=>{
        console.log(response)
      })
      .catch((error)=>{
        console.log(error)
      })
    },
    deleteit(id){//Here a record is selected
      this.check(id)//call function to get the data within that column
      if(this.datas[0].name==this.database[id].name){
        var dbn=this.dataname.charAt(0)
        //Request to delete the database,Here a specific data is only needed
        axios.delete("http://localhost:3000/delete/",{params:{tb:dbn,rl:this.database[id].rl}}).then((response)=>{
           console.log(response)
        }).catch((error)=>{
          console.log(error)
        })
      }
      this.database.splice(id,1)
    },
    closeit(){//On pressing Close DB
      location.reload()
    },
    refreshit(id){//Used to remove a row,could have been done with deletion but it has problem when data isnt present
      this.database.splice(id,1)
    },
    uploadit(){//Experimentation (Connecting with django DB rest with nodejs)
      let finuser = this.database
      var fillups=''
     var i=0
      for(i=0;i<finuser.length;i++){//JSON processes strings the most ,so I convert the integers to strings
        finuser[i].rl=String(finuser[i].rl)
        finuser[i].maths=String(finuser[i].maths)
        finuser[i].science=String(finuser[i].science)
        finuser[i].social=String(finuser[i].social)
        finuser[i].total=String(finuser[i].total)
        fillups+="[\""+finuser[i].rl+"\",\""+finuser[i].image+"\",\""//Here i create the body of the json by joining the data
        fillups+=finuser[i].name+"\",\""+finuser[i].maths+"\",\""+finuser[i].science+"\",\""+finuser[i].social+"\",\""+finuser[i].total+"\"]"
        console.log(fillups)
        console.log(finuser[i].image)
      }//Passing data to django must be done like "JSON.stringify(value)"
      this.json='{"imageflag":2,"header":'+JSON.stringify(this.header)+',"fillups":['+fillups+']}'
      //In django ,One must send data in the form of "application/x-www-form-urlencoded" otherwise it wont decode
      
      //Obtaining a file(Here PDF) with the help of axios
      //The Response type "blob" is very important as it specifies what type of data should it send

     axios({method:'post',//The order in which the data is set is 
            url:'http://192.168.1.16:8000/test1/',
            responseType:'blob',//I dont know why still the program accepts both response type and header like this
            data: JSON.parse(JSON.stringify(this.json)),//JSON.parse and JSON.stringify are the pure opposites
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'}}).then((response)=>{
        console.log(response.data)
        let blob = new Blob([response.data], { type: 'application/pdf' } );//Here the data obtained is referenced to a var called blob
     var url = window.URL.createObjectURL(blob);//Create a url with the blob data obtained
     var link = document.createElement('a');//An empty element is created
      link.href = url;//Type is specified
      link.open = 'file.pdf'//Download instruction is given
        document.body.appendChild(link);//This is appended to html
      link.click();//The link is assumed to be clicked with this function
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
input{
  width:100%
}
@import '~bulma/bulma.sass'
</style>
