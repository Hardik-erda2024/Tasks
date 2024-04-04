const path = window.location.pathname.split("/");
    const Id = path[path.length - 1];
    const update = path[path.length - 2];
    async function fetchDB(){ 
        let response = await fetch(`http://localhost:${window.location.port}/db-Candidatemaster/${Id}`);
        let data = await response.json();
        var key=Object.keys(data[0]);
        key.forEach((item)=>{
            if(item == 'Gender'){
                let rb = document.getElementsByName(item);
                rb.forEach((e)=>{
                    if(e.value == data[0][item]){
                        e.checked = true;
                    }
                });
            }
            else{
                document.getElementsByName(item)[0].value = data[0][item];
            }
        });
        response = await fetch(`http://localhost:${window.location.port}/db-EducationDetails/${Id}`);
        data = await response.json();
        key=Object.keys(data);
        key.forEach((i)=>{
            let datakey =Object.keys(data[i]);
            datakey.forEach((item)=>{
                document.getElementsByName(item)[i].value = data[i][item];
            });
        });
        response = await fetch(`http://localhost:${window.location.port}/db-WorkExprience/${Id}`);
        data = await response.json();
        key=Object.keys(data);
        key.forEach((i)=>{
            let datakey =Object.keys(data[i]);
            datakey.forEach((item)=>{
                document.getElementsByName(item)[i].value = data[i][item];
            });
        });
        response = await fetch(`http://localhost:${window.location.port}/db-LanguageTable/${Id}`);
        data = await response.json();
        let lang =document.getElementsByName('Language[]');
        let langId = document.getElementsByName('LanguageId');
        lang.forEach((e)=>{
            key=Object.keys(data);
            key.forEach((i)=>{
                langId[i].value= data[i].LanguageId ;
                if(data[i].Language == e.value){
                    e.checked = true;
                    if(data[i].LanguageRead == 1 ){
                        document.getElementsByName(e.value+"_read")[0].checked = true;
                    }
                    if(data[i].LanguageWrite == 1){
                        document.getElementsByName(e.value+"_write")[0].checked = true;
                    }
                    if(data[i].LanguageSpeak == 1){
                        document.getElementsByName(e.value+"_speak")[0].checked = true;
                    }
                }
            });
        });
        response = await fetch(`http://localhost:${window.location.port}/db-TechnologiesTable/${Id}`);
        data = await response.json();
        let tech = document.getElementsByName('Technoloy[]');
        let TechID = document.getElementsByName('TechnologieID');
        tech.forEach((e)=>{
            key = Object.keys(data);
            key.forEach((i)=>{
                TechID[i].value=data[i].TechnologieID;
                if(data[i].TechnoloieName == e.value){
                    e.checked = true;
                    document.getElementsByName(e.value)[data[i].KnowlageLevel -1].checked = true;
                }
            })
        });
        response = await fetch(`http://localhost:${window.location.port}/db-ReferanceContact/${Id}`);
        data = await response.json();
        key=Object.keys(data);
        key.forEach((i)=>{
            let datakey =Object.keys(data[i]);
            datakey.forEach((item)=>{
                document.getElementsByName(item)[i].value = data[i][item];
            });
        });
        response = await fetch(`http://localhost:${window.location.port}/db-Perferances/${Id}`);
        data = await response.json();
        key=Object.keys(data);
        key.forEach((i)=>{
            let datakey =Object.keys(data[i]);
            datakey.forEach((item)=>{
                document.getElementsByName(item)[i].value = data[i][item];
            });
        });
    }
if(update == 'update'){
    document.getElementById('subBtn').removeAttribute('onclick');
    document.getElementById('subBtn').innerHTML = "Update";
    document.getElementById('subBtn').setAttribute('onclick','upFun()');
    fetchDB();
}
var dislayCount = 0;
async function upFun(){
    const obj = {};
        new FormData(document.querySelector('form')).forEach((value,key)=>{
            if(obj[key] != undefined){
                obj[key] += ","+value; 
            }
            else{
                obj[key] = value; 
            }
        });
        let response = await fetch(`http://localhost:${window.location.port}/Task12/update/${Id}`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(obj),
            })
        let data = await response.text();
        window.location = `http://localhost:${window.location.port}/Task12/display`;
}
function nxtdiv() {
    let flag =formValidationFun()
    if(flag != false){
        dislayCount++;
        switch (dislayCount) {
            case 1: document.getElementById('BasicDetails').setAttribute('style', 'display:none;');
            document.getElementById('EducationDiv').removeAttribute('style');
            document.getElementById('prvBtn').hidden = false;
            break;
            case 2: document.getElementById('EducationDiv').setAttribute('style', 'display:none;');
            document.getElementById('WorkExprienceDiv').removeAttribute('style');
            break;
            case 3: document.getElementById('WorkExprienceDiv').setAttribute('style', 'display:none;');
            document.getElementById('LanguageDiv').removeAttribute('style');
            break;
            case 4: document.getElementById('LanguageDiv').setAttribute('style', 'display:none;');
            document.getElementById('TechnoloyDiv').removeAttribute('style');
            break;
            case 5: document.getElementById('TechnoloyDiv').setAttribute('style', 'display:none;');
            document.getElementById('ReferanceDiv').removeAttribute('style');
            break;
            case 6: document.getElementById('ReferanceDiv').setAttribute('style', 'display:none;');
            document.getElementById('PreferancesDiv').removeAttribute('style');
            document.getElementById('nxtBtn').hidden = true;
            document.getElementById('subBtn').hidden = false;
            break;
        }
    }
}

function prvdiv() {
    let flag =formValidationFun()
    if(flag != false){
        dislayCount--;
        switch (dislayCount){
            case 0: document.getElementById('EducationDiv').setAttribute('style', 'display:none;');
            document.getElementById('BasicDetails').removeAttribute('style');
            document.getElementById('prvBtn').hidden = true;
            break;
            case 1: document.getElementById('WorkExprienceDiv').setAttribute('style', 'display:none;');
            document.getElementById('EducationDiv').removeAttribute('style');
            break;
            case 2: document.getElementById('LanguageDiv').setAttribute('style', 'display:none;');
            document.getElementById('WorkExprienceDiv').removeAttribute('style');
            break;
            case 3: document.getElementById('TechnoloyDiv').setAttribute('style', 'display:none;');
            document.getElementById('LanguageDiv').removeAttribute('style');
            break;
            case 4: document.getElementById('ReferanceDiv').setAttribute('style', 'display:none;');
            document.getElementById('TechnoloyDiv').removeAttribute('style');
            break;
            case 5: document.getElementById('PreferancesDiv').setAttribute('style', 'display:none;');
            document.getElementById('ReferanceDiv').removeAttribute('style');
            document.getElementById('nxtBtn').hidden = false;
            document.getElementById('subBtn').hidden = true;
            break;
        }
    }
}
async function subFun(){
        const obj = {};
        new FormData(document.querySelector('form')).forEach((value,key)=>{
            if(obj[key] != undefined){
                obj[key] += ","+value; 
            }
            else{
                obj[key] = value; 
            }
        });
        let response = await fetch(`http://localhost:${window.location.port}/Task12`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(obj),
            })
        let data = await response.text();
            alert(data);
            window.location = `http://localhost:${window.location.port}/Task12/display`;
    }
