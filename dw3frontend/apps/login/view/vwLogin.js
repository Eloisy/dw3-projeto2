async function vwLogin() {
  const form = document.getElementById("formLogin");
  const formData = new FormData(form);

  if (!Validar(formData)) {
    return false;
  } else {
    
    const dadosLogin = {
        UserName: formData.get('UserName'), 
        Password: formData.get('Password')
    };

    let resp = await axios.post('/Login', dadosLogin, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch(error => {        
        const msg = error.response?.data?.msg || error.message;
        alert('Erro: ' + msg);
        return null; 
    });

    console.log("RESPOSTA:", resp);
    
    if (!resp || !resp.data) {
      return;
    }

    if (resp.data.status === "ok") {
        Cookies.set('isLogged', true, { path: '/' }); 
        
        window.open("/", "_self");
    } else {
        alert("Login falhou!");
    }
  }
}