async function vwLogin() {
  const form = document.getElementById("formLogin");
  const formData = new FormData(form);

  if (!Validar(formData)) {
    return false;
  } else {


    resp = await axios.post('login', formData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .catch(error => {        
        alert('Error:' + error.response.data.msg);
        return;
      });

    console.log("Valor RESP:" + JSON.stringify(resp))  ;
    if (!resp) {
      return;
    }
    

    Cookies.set('isLogged', true, { sameSite: 'strict' });   
    window.open("/", "_self");
  }
}