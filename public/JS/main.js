function checkPsw()
{
    if(document.getElementById('password').value == document.getElementById('Confirmpsw').value)
    {
        document.getElementById('subBtn').disabled = false;
        document.getElementById('subBtn').style ='color:red';
        console.log('done')
    }
}
// task11

const path = window.location.pathname.split("/");
    const Id = path[path.length - 1];
    async function fetchDB()
    { 
        
        let response = await fetch(`http://localhost:8080/db-Candidatemaster/${Id}`);
        let data = await response.json();
        var key=Object.keys(data[0]);
        key.forEach((item)=>{
            if(item == 'Gender')
            {
                let rb = document.getElementsByName(item);
                rb.forEach((e)=>{
                    if(e.value == data[0][item])
                    {
                        e.checked = true;
                    }
                });
            }
            else{

                document.getElementsByName(item)[0].value = data[0][item];
            }
        });
        
        
        response = await fetch(`http://localhost:8080/db-EducationDetails/${Id}`);
        data = await response.json();
        key=Object.keys(data);
        key.forEach((i)=>{
            let datakey =Object.keys(data[i]);
            datakey.forEach((item)=>{
                document.getElementsByName(item)[i].value = data[i][item];
            });
        });

        

        response = await fetch(`http://localhost:8080/db-WorkExprience/${Id}`);
        data = await response.json();
        key=Object.keys(data);
        key.forEach((i)=>{
            let datakey =Object.keys(data[i]);
            datakey.forEach((item)=>{
                document.getElementsByName(item)[i].value = data[i][item];
            });
        });


        response = await fetch(`http://localhost:8080/db-LanguageTable/${Id}`);
        data = await response.json();
        let lang =document.getElementsByName('Language[]');
        let langId = document.getElementsByName('LanguageId');
        lang.forEach((e)=>{
            key=Object.keys(data);
            key.forEach((i)=>{

                langId[i].value= data[i].LanguageId ;
                if(data[i].Language == e.value)
                {
                    e.checked = true;
                    if(data[i].LanguageRead == 1 )
                    {
                        document.getElementsByName(e.value+"_read")[0].checked = true;
                    }
                    if(data[i].LanguageWrite == 1)
                    {
                        document.getElementsByName(e.value+"_write")[0].checked = true;
                    }
                    
                    if(data[i].LanguageSpeak == 1)
                    {
                        document.getElementsByName(e.value+"_speak")[0].checked = true;
                    }
                }
            });
        });
        


        response = await fetch(`http://localhost:8080/db-TechnologiesTable/${Id}`);
        data = await response.json();
        console.log(data);
        let tech = document.getElementsByName('Technoloy[]');
        let TechID = document.getElementsByName('TechnologieID');
        tech.forEach((e)=>{
            key = Object.keys(data);
            key.forEach((i)=>{
                TechID[i].value=data[i].TechnologieID;
                if(data[i].TechnoloieName == e.value)
                {
                    e.checked = true;
                    document.getElementsByName(e.value)[data[i].KnowlageLevel -1].checked = true;
                }
            })
        });

        response = await fetch(`http://localhost:8080/db-ReferanceContact/${Id}`);
        data = await response.json();
        key=Object.keys(data);
        key.forEach((i)=>{
            let datakey =Object.keys(data[i]);
            datakey.forEach((item)=>{
                document.getElementsByName(item)[i].value = data[i][item];
            });
        });

        response = await fetch(`http://localhost:8080/db-Perferances/${Id}`);
        data = await response.json();
        key=Object.keys(data);
        key.forEach((i)=>{
            let datakey =Object.keys(data[i]);
            datakey.forEach((item)=>{
                document.getElementsByName(item)[i].value = data[i][item];
            });
        });
        
    }
    if(Id != 'Task10')
    {
        document.getElementById('submitBtn').value = 'Update';
        fetchDB();
    }

