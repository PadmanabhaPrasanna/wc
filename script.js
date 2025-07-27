//testing line
 // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getDatabase, set, ref , onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration  
  const firebaseConfig = {
    apiKey: "AIzaSyDuNJ4UbgGIlLA0khZyMPILWeqF6F5EZ3c",
    authDomain: "well-data-calculator.firebaseapp.com",
    projectId: "well-data-calculator",
    storageBucket: "well-data-calculator.firebasestorage.app",
    messagingSenderId: "291144366030",
    appId: "1:291144366030:web:4006c5d09226ed4b595d9f",
    measurementId: "G-Y7JE397JZ5"
  };

// Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

//Data obtainer and make first tubing row
  onValue(ref(db, 'tubing/'), (snapshot) => {
      const data = snapshot.val();

      //const datamod = JSON.stringify(data);  //tester
      //document.getElementById("display").innerHTML = datamod;  //tester

      for (const key in data)
      {
        const option = document.createElement("option");
        option.setAttribute("data-od",data[key].od);
        option.setAttribute("data-id",data[key].id);

        //option.value = data[key].id;
        option.textContent = data[key].type;
        document.getElementById("tubingType0").appendChild(option);

      }
 
    });


//document.getElementById("tubingtype0").focus(); causes tubing add to not work

// Adding tubing row 
document.getElementById("addTubing").addEventListener("click", function() {
    var table = document.getElementById("tbody");
    var newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td><select class="form-select" id="tubingType${table.rows.length}" required>
            <option value="" disabled selected>Tubing</option>
            
        </select></td>
        <td><input type="number" class="form-control" id="startLength${table.rows.length}" required value="${document.getElementById("endLength"+(table.rows.length-1)).value}"></td>
        <td><input type="number" class="form-control" id="endLength${table.rows.length}" required></td>
        <td><button type="button" class="btn btn-danger remove-row" id="removeTubing${table.rows.length}">Remove</button></td>
    `;
    table.appendChild(newRow);

    //Option from database - tubing
    onValue(ref(db, 'tubing/'), (snapshot) => {
      const data = snapshot.val();

      for (const key in data)
      {
        const option = document.createElement("option");
        option.setAttribute("data-od",data[key].od);
        option.setAttribute("data-id",data[key].id);

        //option.value = data[key].id;
        option.textContent = data[key].type;
        document.getElementById(`tubingType${table.rows.length-1}`).appendChild(option);  //-1 because after the above tubing addition, number increased so ${} not same in both cases.

      }
 
    });
   
});

//Data obtainer and make first casing row
  onValue(ref(db, 'casing/'), (snapshot) => {
      const data = snapshot.val();


      for (const key in data)
      {
        const option = document.createElement("option");
        option.setAttribute("data-od",data[key].od);
        option.setAttribute("data-id",data[key].id);

        //option.value = data[key].id;
        option.textContent = data[key].type;
        document.getElementById("casingType0").appendChild(option);

      }
 
    });



// Adding casing row 
document.getElementById("addCasing").addEventListener("click", function() {
    var ctable = document.getElementById("casingTbody");
    var cnewRow = document.createElement("tr");
    cnewRow.innerHTML = `
        <td><select class="form-select" id="casingType${ctable.rows.length}" required>
            <option value="" disabled selected>Casing Type</option>
            
        </select></td>
        <td><input type="number" class="form-control" id="CasingStartLength${ctable.rows.length}" required value="${document.getElementById("CasingEndLength"+(ctable.rows.length-1)).value}"></td>
        <td><input type="number" class="form-control" id="CasingEndLength${ctable.rows.length}" required></td>
        <td><button type="button" class="btn btn-danger remove-row" id="removeCasing${ctable.rows.length}">Remove</button></td>
    `;
    ctable.appendChild(cnewRow);

    //Option from database - casing
    onValue(ref(db, 'casing/'), (snapshot) => {
      const data = snapshot.val();

      for (const key in data)
      {
        const option = document.createElement("option");
        option.setAttribute("data-od",data[key].od);
        option.setAttribute("data-id",data[key].id);
        
        //option.value = data[key].id;
        option.textContent = data[key].type;
        document.getElementById(`casingType${ctable.rows.length-1}`).appendChild(option);  //-1 because after the above casing addition, number increased so ${} not same in both cases.

      }
 
    });

});


    


/* Removing tubing row */
document.getElementById("tbody").addEventListener("click", function(e){
    
        if(e.target.innerHTML === "Remove"){ e.target.parentNode.parentNode.remove();}
    
});

/* Removing casing row */
document.getElementById("casingTbody").addEventListener("click", function(e){
    
        if(e.target.innerHTML === "Remove"){e.target.parentNode.parentNode.remove();}
    
});




/* Calculating function*/

document.getElementById('form').addEventListener('input', function(){
    let tubinnervol = 0;
    let tubmetaldisp = 0;
    let fullwellvol = 0;
    
    
    var tubtable = document.getElementById("tbody");
    var castable = document.getElementById("casingTbody");
    for (let i = 0; i < tubtable.rows.length; i++)
    {
        //tubing data
        var tstartval = document.getElementById(`startLength${i}`).value;
        var tendval = document.getElementById(`endLength${i}`).value;

        let tselect = document.getElementById(`tubingType${i}`);
        let tselectedoption = tselect.options[tselect.selectedIndex];
        var tinnerDia = parseFloat(tselectedoption.getAttribute("data-id"));
        var touterDia = parseFloat(tselectedoption.getAttribute("data-od"));

        if((tendval-tstartval)>=0)
        {
        tubinnervol = tubinnervol + tinnerDia*tinnerDia*0.0005066*(tendval-tstartval);
        tubmetaldisp = tubmetaldisp + (touterDia*touterDia-tinnerDia*tinnerDia)*0.0005066*(tendval-tstartval);
        };
    }

    for (let j=0;j < castable.rows.length; j++)
    {
        //casing data
        var cstartval = document.getElementById(`CasingStartLength${j}`).value;
        var cendval = document.getElementById(`CasingEndLength${j}`).value;

        let cselect = document.getElementById(`casingType${j}`);
        let cselectedoption = cselect.options[cselect.selectedIndex];
        var cinnerDia = parseFloat(cselectedoption.getAttribute("data-id"));
        var couterDia = parseFloat(cselectedoption.getAttribute("data-od"));
        

        if((cendval-cstartval)>=0){
        fullwellvol = fullwellvol + cinnerDia*cinnerDia*0.0005066*(cendval-cstartval);
        };

       
    }

    let wellvol = 0;

    if ((fullwellvol - tubmetaldisp)>=0)
      { wellvol = fullwellvol - tubmetaldisp;}
    

          
     document.getElementById("display").innerHTML = "Tubing volume: " + tubinnervol.toFixed(3) + " kl <br>" + "Tubing metal displacement: "+ tubmetaldisp.toFixed(3) + " kl <br>" + "Well volume (with string): " + wellvol.toFixed(3) + "kl";
     



});
