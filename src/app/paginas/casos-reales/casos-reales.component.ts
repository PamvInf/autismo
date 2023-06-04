import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Option {
  value: string,
  href: string
}

  var count = 0;
  var emotionIdRes: string ='';
  var emotionName: string ='';
  
@Component({
  selector: 'app-casos-reales',
  templateUrl: './casos-reales.component.html',
  styleUrls: ['./casos-reales.component.css']
})
export class CasosRealesComponent implements OnInit {
  options: Option[] = [
    { value: 'Feliz', href: 'assets/img/alegre.png' },
    { value: 'Enfadado', href: 'assets/img/enfadado.png' },
    { value: 'Sorprendido', href: 'assets/img/sorprendido.png' },
    { value: 'Triste', href: 'assets/img/triste.png' },
  ];
  situationImage: string = '';
  emotionId: string = '';
  situacion: string ='';

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    
    this.getSituation();
  }
  

 
  
  getSituation() {
    this.http.get<any>('http://127.0.0.1:8080/api/situaciones').subscribe(
      response => {
        this.situationImage = "../../assets/img/situaciones/" + response.dataImg;
        this.emotionId = response.dataEmoId;
        emotionIdRes = response.dataEmoId;
        this.situacion = response.datasituacion;
        emotionName = response.dataEmo;
        document.getElementById("situacion")!.innerHTML = this.situacion;
        console.log('Emoción: ', emotionIdRes);
      },
      error => {
        console.error('Error al obtener la situación:', error);
      }
    );
  }

  checkAnswer(selectedOption: string) {
    count++;
    
    if (selectedOption === emotionName) {
      const overlayDiv = document.getElementById('overlay');
          overlayDiv!.style.backgroundColor = '#7FEC65';
          
          const tituloEmocion = document.getElementById('situacion');
          tituloEmocion!.innerHTML = "HAS ACERTADO!";
          
          setTimeout(() => {
            
            tituloEmocion!.innerHTML = this.situacion; // Restaurar el título original
          }, 5000);
          setTimeout(() => {
            overlayDiv!.style.backgroundColor = 'white';
          }, 500);
          
      // Acciones cuando se selecciona la opción correcta
      console.log('¡Respuesta correcta!');
      this.postTest('WIN');
    } else if(count < 5){
      
      const overlayDiv = document.getElementById('overlay');
          overlayDiv!.style.backgroundColor = '#EC7D65';
          
          
          const tituloEmocion = document.getElementById('situacion');
          tituloEmocion!.innerHTML = "Vamos a intentarlo de nuevo! ";
          setTimeout(() => {
            
            tituloEmocion!.innerHTML = this.situacion;  // Restaurar el título original
          }, 3000);
          setTimeout(() => {
            overlayDiv!.style.backgroundColor = 'white';
          }, 500);
      // Acciones cuando se selecciona una opción incorrecta
      console.log('Respuesta incorrecta');
      
    }else{
      const overlayDiv = document.getElementById('overlay');
          overlayDiv!.style.backgroundColor = '#EC7D65';
          
          
          const tituloEmocion = document.getElementById('situacion');
          tituloEmocion!.innerHTML = "Vamos a por otra!!";
          setTimeout(() => {
            
            tituloEmocion!.innerHTML = this.situacion;  // Restaurar el título original
          }, 3000);
          setTimeout(() => {
            overlayDiv!.style.backgroundColor = 'white';
          }, 500);
      // Acciones cuando se selecciona una opción incorrecta
      console.log('Respuesta incorrecta');
      this.postTest('LOSE');
    }
  }

  
 async postTest(resu: string) {
  var res = await fetch('http://127.0.0.1:8080/api/tests',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario: "637b48e17e5e4cf71672c91b", //caso concreto de usuario previo a produccion
        tipo: "Photo",
        intentos: count,
        emotion: emotionIdRes,
        resultado: resu

      })
    })
  console.log(res);
  location.reload();
};
}
